/*global define, require */
require(['vendor/balalaika', 'vendor/picturefill', 'galleries', 'lazy_loading'], function ($, pic, galleries, lazyload) {
    'use strict';

    $(function () {
        galleries.prepare();

        window.addEventListener("load", galleries.init);
        window.addEventListener("load", lazyload.init);
    });
});



