var activate_slideshows = function () {
    'use strict';

    $('.swipe').each(function (i, e) {
        var $slideshow = $(e);
        var $navi = $slideshow.find('.dots');

        var swipe = Swipe(e, {
            //auto: 3000,
            continuous: true,
            callback: function (pos) {
                $navi.children('.dot-item').removeClass('active');
                $($navi.children('.dot-item')[pos]).addClass('active');

                $slideshow.find('img').eq(pos).unveil(0);
            }
        });
        $slideshow.find('img').first().unveil(200);

        $slideshow.children('.swipe-wrap').children().each(function (i, e) {
            $navi.append('<button class="dot-item" data-index="' + i + '"><span class="dot"></span></button>');
        });

        $navi.children('.dot-item:first').addClass('active');
        $navi.children('.dot-item').on('click', function () {
            var $this = $(this);
            swipe.slide($this.data('index'), 300);
        });

        $slideshow.children('.next').on('click', swipe.next);
        $slideshow.children('.previous').on('click', swipe.prev);
    });
};

var register_baseline_trigger = function () {
    'use strict';

    $('.js_baseline_trigger').on('click', function () {
        $('body').toggleClass('baseline');
    });
};

var equalizeBlockHeights = function () {
    'use strict';

    $('.postslist:first .post').removeAttr('style');
    halfdane.equalheight_blocks($('.postslist:first .post'));
};

var lazyload_images = function () {
    'use strict';

    $('img:not(.swipe img)').unveil(200, function() {
        equalizeBlockHeights();
    });
};

var prepareLightboxes = function () {
    'use strict';

    var popupOptions = {
        type: 'image',
        gallery: {enabled: true},
        disableOn: 500
    };

    $('.swipe').each(function (index, element) {
        $(element).find('a.lightbox').magnificPopup(popupOptions);
    });

    $('.fullpost a.lightbox:not(.swipe a.lightbox)').magnificPopup(popupOptions);
    $('.postslist a.lightbox').on('click', function () { return false;});
};

var handlePostlistClicks = function () {
    'use strict';

    $('.postslist .post').on('click', function () {
        window.location.href = $(this).attr('href');
    });
};


$(window).load(function () {
    'use strict';

    activate_slideshows();
    lazyload_images();
    prepareLightboxes();

    register_baseline_trigger();
    handlePostlistClicks();
});

$(window).resize(equalizeBlockHeights);