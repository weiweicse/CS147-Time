$(function() {
    // "lock"
    var is_loading = false;
    var $items = $('#items');
    var $load_buttom = $('#load-more');
    var auto_load_times = 2;

    function loadPreviousItems() {
        // throttling
        if (is_loading) return;
        is_loading = true;

        // no harm if it's negative
        --auto_load_times;

        $load_buttom.addClass('disabled').text('Loading...');

        var date = $items.find('.done-list:last-child').data('date');

        $.get('/history/prev', {
            date: date
        }).done(function(html) {
            if (!html.trim()) {
                // empty => no more items
                // TODO: more robust no more date detection
                $load_buttom.text('No more data.');
            } else {
                $items.append(html);
                $load_buttom.removeClass('disabled').text('Load More');
                is_loading = false;
            }
        }).error(function() {
            $load_buttom.addClass('btn-danger').text("Something's wrong. Please refresh.");
        });
    }

    $load_buttom.on('click', loadPreviousItems);

    $(window).on('scroll', function() {
        var id;
        if (window.scrollY === 0) {
            // reached top, load later items
            console.log('at top');
            // TODO: load previous
        } else if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight+80) {
            // reached bottom, load earlier items
            console.log('at bottom');
            if (auto_load_times > 0)
                loadPreviousItems();
        }
    });
});
