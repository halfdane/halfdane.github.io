var halfdane = halfdane || {};
halfdane.lazyload = (function () {
    'use strict';

    var iteration = 0;

    function loadNext(element){
        console.log('LOADING');

        var sexhr = new window.sexhr();
        sexhr.req({
            url: $('#next')[0].getAttribute('href'),
            done: function(err, res) {
                console.log("Done");
                if (err) throw err;
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = res.text;

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
}());