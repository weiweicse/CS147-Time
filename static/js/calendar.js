var d3Calendar = function() {
    var calendarWidth = 300,
    calendarHeight = 300 * 6 / 7,
    gridXTranslation = 10,
    gridYTranslation = 35,
    cellColorForCurrentMonth = '#EAEAEA',
    cellColorForPreviousMonth = '#FFFFFF',
    counter = 0,
    currentMonth = new Date().getMonth(),
    monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
    datesGroup;
    function getCalendarWidth() { return calendarWidth; }
    function getCalendarHeight() { return calendarHeight; }
    function getGridXTranslation() { return gridXTranslation; }
    function getGridYTranslation() { return gridYTranslation; }
    function getGridWidth() { return calendarWidth - 10; }
    function getGridHeight() { return calendarHeight - 40; }
    function getCellWidth() { return getGridWidth() / 7; }
    function getCellHeight() { return getGridHeight() / 5; }
    function getDatesGroup() { return datesGroup; }
    function setDatesGroup(value) { datesGroup = value; }
    function incrementCounter() { counter++; }
    function decrementCounter() { counter--; }
    function monthToDisplay() {
        var dateToDisplay = new Date();
        dateToDisplay.setMonth(currentMonth + counter);
        return dateToDisplay.getMonth();
    }
    function monthToDisplayAsText() {
        return monthNames[monthToDisplay()];
    }
    function yearToDisplay() {
        var dateToDisplay = new Date();
        dateToDisplay.setMonth(currentMonth + counter);
        return dateToDisplay.getFullYear();
    }
    function gridCellPositions() {
        var cellPositions = [];
        for (y = 0; y < 5; y++) {
            for (x = 0; x < 7; x++) {
                cellPositions.push([x * getCellWidth(), y * getCellHeight()]);
            }
        }
        return cellPositions;
    }
    function daysInMonth() {
        var daysArray = [];
        var firstDayOfTheWeek = new Date(yearToDisplay(), monthToDisplay(), 1).getDay();
        var daysInPreviousMonth = new Date(yearToDisplay(), monthToDisplay(), 0).getDate();
        for (i = 1; i <= firstDayOfTheWeek; i++) {
            daysArray.push([daysInPreviousMonth - firstDayOfTheWeek + i, cellColorForCurrentMonth]);
        }
        var daysInMonth = new Date(yearToDisplay(), monthToDisplay() + 1, 0).getDate();
        for (i = 1; i <= daysInMonth; i++) {
            daysArray.push([i, cellColorForPreviousMonth]);
        }
        var daysRequiredFromNextMonth = 35 - daysArray.length;
        for (i = 1; i <= daysRequiredFromNextMonth; i++) {
            daysArray.push([i, cellColorForCurrentMonth]);
        }
        return daysArray.slice(0,35);
    }
    return {
        calendarWidth: getCalendarWidth(),
        calendarHeight: getCalendarHeight(),
        gridXTranslation: getGridXTranslation(),
        gridYTranslation: getGridYTranslation(),
        gridWidth: getGridWidth(),
        gridHeight: getGridHeight(),
        cellWidth: getCellWidth(),
        cellHeight: getCellHeight(),
        getDatesGroup: getDatesGroup,
        setDatesGroup: setDatesGroup,
        incrementCounter: incrementCounter,
        decrementCounter: decrementCounter,
        monthToDisplay: monthToDisplay,
        monthToDisplayAsText: monthToDisplayAsText,
        yearToDisplay: yearToDisplay,
        gridCellPositions: gridCellPositions(),
        daysInMonth: daysInMonth
    };
}();
$(document).ready( function () {
    var aspect = d3Calendar.calendarWidth / d3Calendar.calendarHeight;
    var chart = $("#chart");
    renderCalendarGrid();
    $.get('/api/calendar/' + d3Calendar.yearToDisplay() + '/' + d3Calendar.monthToDisplay(), function(intensity) {
        renderDaysOfMonth(intensity);
    });
    $('#back').click(displayPreviousMonth);
    $('#forward').click(displayNextMonth);
    $(window).on("resize", function() {
        var targetWidth = chart.parent().width();
        chart.attr("width", targetWidth);
        chart.attr("height", Math.round(targetWidth / aspect));
    }).trigger("resize");
});
function displayPreviousMonth() {
    d3Calendar.decrementCounter();
    $.get('/api/calendar/' + d3Calendar.yearToDisplay() + '/' + d3Calendar.monthToDisplay(), function(intensity) {
        renderDaysOfMonth(intensity);
    });
}
function displayNextMonth() {
    d3Calendar.incrementCounter();
    $.get('/api/calendar/' + d3Calendar.yearToDisplay() + '/' + d3Calendar.monthToDisplay(), function(intensity) {
        renderDaysOfMonth(intensity);
    });
}
function renderDaysOfMonth(intensity) {
    $('#currentMonth a').text(d3Calendar.monthToDisplayAsText() + ' ' + d3Calendar.yearToDisplay());
    var daysInMonthToDisplay = d3Calendar.daysInMonth();
    var cellPositions = d3Calendar.gridCellPositions;
    var color = d3.scale.linear()
        .domain([0, 20])
        .range(["white", "#5abedb"])
        .interpolate(d3.interpolateLab);
    d3Calendar.datesGroup
        .selectAll("text")
        .data(daysInMonthToDisplay)
        .attr("x", function (d, i) { return cellPositions[i][0] - 8; })
        .attr("y", function (d, i) { return cellPositions[i][1] + 5; })
        .attr("dx", 20) // right padding
        .attr("dy", 20) // vertical alignment : middle
        .attr("transform", "translate(" + d3Calendar.gridXTranslation + "," + d3Calendar.gridYTranslation + ")")
        .text(function (d) { return d[0]; }) // render text for the day of the week
        .on("click", function(d) {
            year = d3Calendar.yearToDisplay();
            day = d[0];
            if (d[1] === '#EAEAEA') {
                month = d3Calendar.monthToDisplay();
                window.location = '/history/' + year + '/' + month + '/' + day + '?from=calendar';
            } else {
                month = d3Calendar.monthToDisplay() + 1;
                window.location = '/history/' + year + '/' + month + '/' + day + '?from=calendar';
            }
        });
    console.log(intensity);
    var maxintensity = Math.max.apply(Math, intensity);
    d3Calendar.calendar
        .selectAll("rect")
        .data(daysInMonthToDisplay)
        .style("fill", function(d, i) { return color(intensity[i] / maxintensity * 20); }) // function (d) { return d[1]; })
        .on("click", function(d) {
            year = d3Calendar.yearToDisplay();
            day = d[0];
            if (d[1] === '#EAEAEA') {
                month = d3Calendar.monthToDisplay();
                window.location = '/history/' + year + '/' + month + '/' + day + '?from=calendar';
            } else {
                month = d3Calendar.monthToDisplay() + 1;
                window.location = '/history/' + year + '/' + month + '/' + day + '?from=calendar';
            }
        });
}

function drawGraphsForMonthlyData() {
}

function getDataForMonth() {
}

function renderCalendarGrid(month, year) {
    d3Calendar.calendar = d3.select("#chart");
    var cellPositions = d3Calendar.gridCellPositions;
    var daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var daysInMonthToDisplay = d3Calendar.daysInMonth();
    console.log("#####");
    console.log(daysInMonthToDisplay);
    d3Calendar.calendar.selectAll("rect")
    .data(cellPositions)
    .enter()
    .append("rect")
    .attr("class", "rect")
    .attr("x", function (d) { return d[0]; })
    .attr("y", function (d) { return d[1]; })
    .attr("width", d3Calendar.cellWidth)
    .attr("height", d3Calendar.cellHeight)
    .style("stroke", "white")
    .style("fill", "white")
    .attr("transform", "translate(" + d3Calendar.gridXTranslation + "," + d3Calendar.gridYTranslation + ")");
    /*.on("mouseover", function() { if (d3.select(this).attr("style").indexOf("#eaeaea") == -1) {
      d3.select(this).style("fill", "#ccffcc");
      } else {
      d3.select(this).style("fill", "#cccccc");
      } })
      .on("mouseout", function() { if (d3.select(this).attr("style").indexOf("#cccccc") == -1) {
      d3.select(this).style("fill", "#ffffff")
      } else {
      d3.select(this).style("fill", "#eaeaea");
      } })*/
    d3Calendar.calendar.selectAll("headers")
        .data([0,1,2,3,4,5,6])
        .enter().append("text")
        .attr("x", function (d) { return cellPositions[d][0]; })
        .attr("y", function (d) { return cellPositions[d][1]; })
        .attr("dx", d3Calendar.gridXTranslation + 5) // right padding
        .attr("dy", 30) // vertical alignment
        .text(function(d) { return daysOfTheWeek[d]; });
    d3Calendar.datesGroup = d3Calendar.calendar.append("svg:g");
    d3Calendar.datesGroup.selectAll("daysText")
        .data(daysInMonthToDisplay)
        .enter()
        .append("text")
        .attr("x", function (d, i) { return cellPositions[i][0]; })
        .attr("y", function (d, i) { return cellPositions[i][1]; })
        .attr("dx", 20) // right padding
        .attr("dy", 20) // vertical alignment : middle
        .attr("transform", "translate(" + d3Calendar.gridXTranslation + "," + d3Calendar.gridYTranslation + ")")
        .text(function(d) { return d[0]; });
}

