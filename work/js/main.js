/*global define, require */
require(['vendor/balalaika', 'vendor/picturefill', 'galleries', 'lazy_loading'], function ($, picturefill, galleries, lazyload) {
    'use strict';

    $(function initializePage () {
        picturefill();
        galleries.init();
        lazyload.init(initializePage);
    });
});



