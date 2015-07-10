/*global $ */
var halfdane = halfdane || {};

halfdane.fake_model = (function () {
    'use strict';

    var counter = 0,
            max = 3;

    function next() {
        if (counter + 1 > max) {
            counter = 0;
        } else {
            counter++;
        }

        return {
            id: 'article_' + counter,
            productId: 'product_id_' + counter,
            articleNumber: 'article_' + counter,
            name: 'The nicest thing you ever did see',
            imageUrl: 'img' + counter + '.fixed.jpg',
            brand: 'something like Adidas',
            price: 1800,
            link: 'target_url_for_product_detail' + counter,
            score: 27618,
            trackingLabel: 'remember_remember'
        };
    }

    function getRecommendations(callWithRecommendations) {
        var recommendations = [];
        for (var i = 0; i < 10; i++) {
            recommendations.push(next());
        }
        callWithRecommendations(recommendations);
    }

    return {
        getRecommendations: getRecommendations,
        setDecision: function () {
        }
    };
}());

halfdane.pictureswipe = function (model) {
    'use strict';

    var $love = $('#love');
    var $hate = $('#hate');
    var $gameArea = $(".game_area");

    function deleteElement(isHot, element) {
        var articleNumber = element.attr('data-articleNumber');
        model.setDecision(articleNumber, isHot);

        refill();
    }

    function loveElement(element) {
        deleteElement(true, element);
    }

    function hateElement(element) {
        deleteElement(false, element);
    }

    function addImageItem(item, onload) {
        $('#images').append($('<li>')
                .addClass('slide')
                .append($('<img>')
                        .attr('src', item.imageUrl)
                        .addClass('recommendation')
                        .attr('data-articleNumber', item.articleNumber)
                        .on('load', onload))
                .append($('<div>').addClass('like'))
                .append($('<div>').addClass('dislike')));
    }

    function refill() {
        if ($('.recommendation').length < 5) {
            model.getRecommendations(function (recommendations) {
                if (recommendations[0]) {
                    addImageItem(recommendations[0], function () {
                        for (var i = 1; i < recommendations.length; i++) {
                            addImageItem(recommendations[i]);
                        }
                        jTinder.startOver($gameArea);
                    });
                }
            });
        }
    }

    function start() {
        jTinder.init($gameArea, {
            onDislike: hateElement,
            onLike: loveElement,
            threshold: 2
        });

        $love.on('click', function () {
            jTinder.love();
        });

        $hate.on('click', function () {
            jTinder.hate();
        });

        refill();
    }

    return {
        start: start
    };
};

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    halfdane.pictureswipe(halfdane.fake_model).start();
});
