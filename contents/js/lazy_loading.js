var halfdane = halfdane || {};
halfdane.lazyload = (function () {
    'use strict';

    function init() {
        $('figure').forEach(function (el) {
            var li = el.parentNode;
            if (!$(li).is('li')) {
                return;
            }

            var ul = $(li.parentNode);
            if (!ul.is('ul')) {
                return;
            }
            /*check if all LIs in this UL consist of a FIGURE*/

            if (ul.is('.slideshow')) {
                return;
            }

            ul.addClass('slideshow')
                    .addClass('bss-slides');
        });
        makeBSS('.slideshow');
    }

    return {
        init: init
    };
}());