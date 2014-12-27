/*global define, require */
define(['vendor/balalaika', 'vendor/better-simple-slideshow'], function ($, makeBSS) {
    'use strict';

    function prepare() {
        $('ul>li>.figure__container>figure').forEach(function (el) {
            var ul = $(el.parentNode.parentNode.parentNode);
            /*check if all LIs in this UL consist of a FIGURE*/

            if (ul.is('.slideshow')) {
                return;
            }

            ul.addClass('slideshow');
        });
    }

    function init() {
        var opts = {
            //auto-advancing slides? accepts boolean (true/false) or object
            auto: {
                // speed to advance slides at. accepts number of milliseconds
                speed: 10000,
                // pause advancing on mouseover? accepts boolean
                pauseOnHover: true
            },
            // support swiping on touch devices? accepts boolean, requires hammer.js
            swipe: true
        };

        $('.slideshow').forEach(function (el) {
            makeBSS(el, opts);
        });

    }

    return {
        init: init,
        prepare: prepare
    };
});