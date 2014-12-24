var halfdane = halfdane || {};
halfdane.lazyload = (function ($) {
    'use strict';

    var iteration = 0;

    function loadNext(element){

        microAjax($('#next').getAttribute('href'), function (res) {
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = res;

            var node = $('#articles');
            var next = $('#next');

            var newArticles = $(tempDiv).find('.article');

            $(newArticles).forEach(function(el){
                node.appendChild(el);
            });

            var nextNext = $(tempDiv).findOne('#next');
            if (nextNext !== null) {
                next.setAttribute('href', nextNext.getAttribute('href'));
                sloth({
                    on: next[0],
                    threshold: 100,
                    callback: loadNext
                });
            } else {
                next.parentNode.removeChild(next);
            }

        });
    }

    function init() {
        sloth({
            on: $('#next')[0],
            threshold: 100,
            callback: loadNext
        });
    }

    return {
        init: init
    };
}($$));