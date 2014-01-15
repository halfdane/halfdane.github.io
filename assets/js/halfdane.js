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

                $slideshow.find('img').eq(pos).unveil();
            }
        });
        $slideshow.find('img').first().unveil(200);

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
    $('img:first').unveil();
    $('img:not(.swipe img)').unveil(200);
};

var prepareLightboxes = function() {
    var popupOptions = {
        type: 'image',
        gallery:{enabled:true},
        disableOn: 500
    };

    $('.swipe').each(function(index, element){
        $(element).find('a.lightbox').magnificPopup(popupOptions);
    });

    $('a.lightbox:not(.swipe a.lightbox)').magnificPopup(popupOptions);
};

$(window).load(function () {
    activate_slideshows();
    lazyload_images();
    prepareLightboxes();

    register_baseline_trigger();
});
