$(function() {
    var loading_prev = false;
    var $items = $('#items');

    function loadPreviousItems() {
        // throttling
        if (loading_prev) return;
        loading_prev = true;

        var date = $items.find('.done-list:last-child').data('date');

        $.get('/history/prev', {
            date: date
        }).done(function(html) {
            $items.append(html);
        }).always(function() {
            loading_prev = false;
        });
    }

    $(window).on('scroll', function() {
        var id;
        if (window.scrollY === 0) {
            // reached top, load later items
            console.log('at top');
            // TODO: load previous
        } else if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight+80) {
            // reached bottom, load earlier items
            console.log('at bottom');
            loadPreviousItems();
        }
    });
});
