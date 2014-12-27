/*global define, require */
require(['vendor/balalaika', 'galleries', 'lazy_loading'], function ($, galleries, lazyload) {
    'use strict';

    $(function () {
        galleries.prepare();

        window.addEventListener("load", galleries.init);
        window.addEventListener("load", lazyload.init);
    });
});



