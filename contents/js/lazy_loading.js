var halfdane = halfdane || {};
halfdane.lazyload = (function () {
    'use strict';

    function init() {
        $('img:not(.slideshow img)').forEach(function (img) {

        });
    }

    return {
        init: init
    };
}());