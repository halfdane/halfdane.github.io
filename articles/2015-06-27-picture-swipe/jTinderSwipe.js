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
        getRecommendations: getRecommendations
    };
}());

halfdane.tinderswipe = function (model) {
    'use strict';

    var jTinder = null;

    function onNewRecommendationsArrived(recommendations) {
        recommendations.forEach(function (item) {
            var image = $('<img>')
                    .attr('id', 'target')
                    .attr('src', item.imageUrl)
                    .attr('data-articleNumber', item.articleNumber)
                    .addClass('img');

            $('<li>')
                    .addClass('recommendation')
                    .append(image)
                    .prependTo('#tinderslide ul');
        });

    }

    function hate(element) {
        element.remove();
        refill();
    }

    function love(element) {
        element.remove();
        refill();
    }

    function refill() {
        if ($('.recommendation').length < 5) {
            model.getRecommendations(onNewRecommendationsArrived);
            $("#tinderslide").jTinder('startOver');
        }
    }

    function init() {
        jTinder = $("#tinderslide").jTinder({
            onDislike: hate,
            onLike: love
        });

        refill();
    }

    return {
        init: init
    };
};

document.addEventListener('DOMContentLoaded', halfdane.tinderswipe(halfdane.fake_model).init);
