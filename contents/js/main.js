$.fn.addClass = function (className) {
    this.forEach(function (item) {
        var classList = item.classList;
        classList.add.apply(classList, className.split(/\s/));
    });
    return this;
};

var halfdane = halfdane || {};

halfdane.galleries = (function () {
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

window.addEventListener("load", halfdane.galleries.init);