var halfdane = halfdane || {};
halfdane.galleries = (function ($, makeBSS) {
    'use strict';

    function prepare() {
        $('ul>li>.figure__container>figure').forEach(function (el) {
            var ul = $(el.parentNode.parentNode.parentNode);
            /*check if all LIs in this UL consist of a FIGURE*/

            var opts = {
                //auto-advancing slides? accepts boolean (true/false) or object
                auto: {
                    // speed to advance slides at. accepts number of milliseconds
                    speed: 1000,
                    // pause advancing on mouseover? accepts boolean
                    pauseOnHover: true
                },
                // support swiping on touch devices? accepts boolean, requires hammer.js
                swipe: true
            };

            if (ul.is('.slideshow')) {
                return;
            }

            ul.addClass('slideshow');
        });
    }

    function init() {
        $('.slideshow').forEach(function (el) {
            makeBSS(el);
        });

    }

    return {
        init: init,
        prepare: prepare
    };
}($$, makeBSS));