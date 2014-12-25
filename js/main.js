$$(function() {
    'use strict';

    halfdane.galleries.prepare();

    window.addEventListener("load", halfdane.galleries.init);
    window.addEventListener("load", halfdane.lazyload.init);
});

