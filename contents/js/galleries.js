var halfdane = halfdane || {};
halfdane.galleries = (function ($) {
    'use strict';

    function init() {
        $('ul>li>figure').forEach(function (el) {
            var ul = $(el.parentNode.parentNode);
            /*check if all LIs in this UL consist of a FIGURE*/

            if (ul.is('.slideshow')) {
                return;
            }

            ul.addClass('slideshow')
                    .addClass('bss-slides');
        });

        var opts = {
            //auto-advancing slides? accepts boolean (true/false) or object
            auto : {
                // speed to advance slides at. accepts number of milliseconds
                speed : 1000,
                // pause advancing on mouseover? accepts boolean
                pauseOnHover : true
            },
            // show fullscreen toggle? accepts boolean
            fullScreen : true,
            // support swiping on touch devices? accepts boolean, requires hammer.js
            swipe : true
        };

        makeBSS('.slideshow');
    }

    return {
        init: init
    };
}($$));