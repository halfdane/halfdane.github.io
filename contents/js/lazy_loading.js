var halfdane = halfdane || {};
halfdane.lazyload = (function () {
    'use strict';

    var iteration = 0;

    function loadNext(element){
        console.log('LOADING');

        microAjax($('#next')[0].getAttribute('href'), function (res) {
            console.log("Done");
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = res;

            var node = $('#articles')[0];
            var newArticles = $(tempDiv).find('.article');
            $(newArticles).forEach(function(el){
                node.appendChild(el);
            });

            var nextNext = $(tempDiv).findOne('#next').getAttribute('href');
            $('#next')[0].setAttribute('href', nextNext);

            console.log("registering sloth for: ", $('#next')[0]);
            sloth({
                on: $('#next')[0],
                threshold: 100,
                callback: loadNext
            });
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
}());