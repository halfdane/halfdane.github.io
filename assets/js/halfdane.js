var activate_slideshows = function () {
    $('.swipe').each(function (i, e) {
        var $slideshow = $(e);
        var $navi = $slideshow.find('.dots');


        var swipe = Swipe(e, {
            //auto: 3000,
            continuous: true,
            callback: function (pos) {
                $navi.children('.dot-item').removeClass('active');
                $($navi.children('.dot-item')[pos]).addClass('active');
            }
        });

        $slideshow.children('.swipe-wrap').children().each(function (i, e) {
            $navi.append('<button class="dot-item" data-index="'+i+'"><span class="dot"></span></button>');
        });

        $navi.children('.dot-item:first').addClass('active');
        $navi.children('.dot-item').on('click', function() {
            var $this = $(this);
            swipe.slide($this.data('index'), 300);
        });

        $slideshow.children('.next').on('click', swipe.next);
        $slideshow.children('.previous').on('click', swipe.prev);
    });
};

var register_baseline_trigger = function () {
    $('.js_baseline_trigger').on('click', function () {
        $('body').toggleClass('baseline');
    })
};

var lazyload_images = function() {
    $("img").unveil(200);
};

$(function () {
    activate_slideshows();
    register_baseline_trigger();
    lazyload_images();
});
