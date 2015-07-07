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

    var $imagesContainer = $('#images');
    var imagesContainer = $imagesContainer[0];
    var $love = $('#love');
    var $hate = $('#hate');
    var love = $love[0];
    var hate = $hate[0];

    var jTinder = null;

    function currentTopImage() {
        return imagesContainer.lastElementChild;
    }

    function deleteElement(isHot, $element) {
        var articleNumber = $element.attr('data-articleNumber');
        model.setDecision(articleNumber, isHot);

        $element.remove();
        love.classList.remove('active');
        hate.classList.remove('active');

        refill();
    }

    function loveElement(element) {
        love.classList.add('active');
        deleteElement(true, element);
    }

    function hateElement(element) {
        hate.classList.add('active');
        deleteElement(false, element);
    }

    function addImageItem(item, onload) {
        //<li class="pane1"><div class="img"></div><div>Miami Beach</div><div class="like"></div><div class="dislike"></div></li>
        $imagesContainer.append(
                $('<li>').append(
                        $('<img>')
                                .attr('src', item.imageUrl)
                                .attr('data-articleNumber', item.articleNumber)
                                .addClass('recommendation')
                                .on('load', onload)));
    }

    function refill() {
        if ($('.recommendation').length < 5) {
            model.getRecommendations(function (recommendations) {
                if (recommendations[0]) {
                    addImageItem(recommendations[0], function () {
                        for (var i = 1; i < recommendations.length; i++) {
                            addImageItem(recommendations[i]);
                        }
                        $(".game_area").jTinder('startOver');
                    });
                }
            });
        }
    }

    function start() {
        jTinder = $(".game_area").jTinder({
            onDislike: hateElement,
            onLike: loveElement,
            threshold: 1
        });

        $love.on('click tap', function () {
            $(".game_area").jTinder('like');
        });

        $hate.on('click tap', function () {
            $(".game_area").jTinder('dislike');
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
