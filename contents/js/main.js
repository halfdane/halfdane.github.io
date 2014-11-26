(function() {
    'use strict';

    if (halfdane && halfdane.galleries && typeof halfdane.galleries.init === 'function') {
        window.addEventListener("load", halfdane.galleries.init);
    }

    if (halfdane && halfdane.lazyload && typeof halfdane.lazyload.init === 'function') {
        window.addEventListener("load", halfdane.lazyload.init);
    }
}());

