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
        setDecision: function (articlenumber, hot) {
            console.log(articlenumber, hot);
        }
    };
}());

var jTinder = (function () {
    'use strict';

    var defaults = {
        onLove: function () {
        },
        onHate: function () {
        },
        threshold: 1,
        likeSelector: '.like',
        dislikeSelector: '.dislike',
        loveClickTarget: '#love',
        hateClickTarget: '#hate'

    };

    var settings = {};

    var animTime = 400;
    var revertTime = 200;

    var touchStart = false;
    var xStart = 0;
    var lastPosX = 0;
    var pane_width = 0;
    var currentPane = null;

    function init(element, options) {
        settings = $.extend({}, defaults, options);

        var $element = $(element);

        $element.on('touchstart', handleTouchstart);
        $element.on('mousedown', handleMousedown);
        $element.on('touchmove mousemove', handleMove);
        $element.on('touchend mouseup', handleEnd);

        pane_width = $element.width() * 1.5;

        currentPane = function () {
            return $(".slide", $element).last();
        };

        $(settings.loveClickTarget).on('click', love);
        $(settings.hateClickTarget).on('click', hate);
    }

    function translateTo(pos) {
        return {transform: "translateX(" + pos + "px) rotate(" + ((pos / pane_width) * 50) + "deg)"};
    }

    function hate() {
        currentPane().animate(translateTo(-pane_width), animTime,
                function () {
                    var current = currentPane();
                    settings.onHate(current[0]);
                    current.remove();
                });
    }

    function love() {
        currentPane().animate(translateTo(pane_width), animTime,
                function () {
                    var current = currentPane();
                    settings.onLove(current[0]);
                    current.remove();
                });
    }

    function handleTouchstart(ev) {
        ev.preventDefault();
        if (touchStart === false) {
            touchStart = true;
            xStart = ev.originalEvent.touches[0].pageX;
        }
    }

    function handleMousedown(ev) {
        ev.preventDefault();
        if (touchStart === false) {
            touchStart = true;
            xStart = ev.pageX;
        }
    }

    function handleMove(ev) {
        ev.preventDefault();
        if (touchStart === true) {
            var pageX = typeof ev.pageX === 'undefined' ? ev.originalEvent.touches[0].pageX : ev.pageX;
            var deltaX = parseInt(pageX) - parseInt(xStart);

            currentPane().css(translateTo(deltaX));

            var opa = (Math.abs(deltaX) / settings.threshold) / 100 + 0.2;
            if (opa > 1.0) {
                opa = 1.0;
            }
            if (deltaX >= 0) {
                currentPane().find(settings.likeSelector).css('opacity', opa);
                currentPane().find(settings.dislikeSelector).css('opacity', 0);
            } else {
                currentPane().find(settings.dislikeSelector).css('opacity', opa);
                currentPane().find(settings.likeSelector).css('opacity', 0);
            }
        }
    }

    function handleEnd(ev) {
        ev.preventDefault();
        touchStart = false;
        var pageX = (typeof ev.pageX === 'undefined') ? ev.originalEvent.changedTouches[0].pageX : ev.pageX;
        var deltaX = parseInt(pageX) - parseInt(xStart);
        var opa = (Math.abs(deltaX) / settings.threshold) / 100 + 0.2;

        if (opa >= 1) {
            if (deltaX > 0) {
                love();
            } else {
                hate();
            }
        } else {
            lastPosX = 0;
            currentPane().animate(translateTo(0), revertTime);
            currentPane().find(settings.likeSelector).animate({"opacity": 0}, revertTime);
            currentPane().find(settings.dislikeSelector).animate({"opacity": 0}, revertTime);
        }
    }

    return {
        init: init
    };

}());

halfdane.view = (function () {
    'use strict';

    function imagecontainer() {
        return document.getElementById('images');
    }

    function addImageItem(item, onload) {
        var img = new Image();
        img.onload = onload;
        img.src = item.imageUrl;
        img.classList.add('recommendation');
        img.setAttribute('data-articlenumber', item.articleNumber);

        var like = document.createElement('div');
        like.classList.add('like');

        var dislike = document.createElement('div');
        dislike.classList.add('dislike');

        var li = document.createElement('li');
        li.classList.add('slide');
        li.appendChild(img);
        li.appendChild(like);
        li.appendChild(dislike);

        var images = imagecontainer();
        images.insertBefore(li, images.firstChild);
    }

    function articleNumber(slide) {
        return slide.firstChild.getAttribute('data-articlenumber');
    }

    return {
        addImageItem: addImageItem,
        articleNumber: articleNumber,
        imagecontainer: imagecontainer
    };

}());

halfdane.pictureswipe = function (model, view) {
    'use strict';

    function loveElement(element) {
        model.setDecision(view.articleNumber(element), true);
        refill();
    }

    function hateElement(element) {
        model.setDecision(view.articleNumber(element), false);
        refill();
    }

    function refill() {
        if ($('.recommendation').length <= 5) {
            model.getRecommendations(function (recommendations) {
                recommendations.forEach(view.addImageItem);
            });
        }
    }

    function start() {
        jTinder.init(view.imagecontainer(), {
            onLove: hateElement,
            onHate: loveElement,
            threshold: 2
        });

        refill();
    }

    return {
        start: start
    };
};

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    halfdane.pictureswipe(halfdane.fake_model, halfdane.view).start();
});
