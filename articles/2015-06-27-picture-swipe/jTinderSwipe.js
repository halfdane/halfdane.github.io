/*global $ */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    halfdane.pictureswipe(halfdane.fake_model);
});

var halfdane = (function () {
    'use strict';

    var swiper = (function () {
        var touchStart = false;
        var xStart = 0;
        var threshold = 1;

        var moveHandler;
        var endMoveHandler;

        function handleStart(ev) {
            ev.preventDefault();
            if (touchStart === false) {
                touchStart = true;
                xStart = ev.pageX || ev.touches[0].pageX;
            }
        }

        function handleMove(ev) {
            ev.preventDefault();
            if (touchStart === true) {
                var pageX = ev.pageX || ev.touches[0].pageX;
                var deltaX = parseInt(pageX) - parseInt(xStart);
                var opa = (Math.abs(deltaX) / threshold) / 100 + 0.2;

                if (moveHandler) {
                    moveHandler(deltaX, opa);
                }
            }
        }

        function handleEnd(ev) {
            ev.preventDefault();
            touchStart = false;
            var pageX = ev.pageX || ev.changedTouches[0].pageX;
            var deltaX = parseInt(pageX) - parseInt(xStart);
            var opa = (Math.abs(deltaX) / threshold) / 100 + 0.2;

            if (endMoveHandler) {
                endMoveHandler(deltaX, opa);
            }
        }

        function addEventhandler(element, moving, endMove) {
            element.addEventListener('touchstart', handleStart);
            element.addEventListener('mousedown', handleStart);
            element.addEventListener('touchmove', handleMove);
            element.addEventListener('mousemove', handleMove);
            element.addEventListener('touchend', handleEnd);
            element.addEventListener('mouseup', handleEnd);

            moveHandler = moving;
            endMoveHandler = endMove;
        }

        return {
            addEventhandler: addEventhandler
        };
    }());

    var view = (function () {
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

        function lastPane() {
            return imagecontainer().querySelector('.slide:last-child');
        }

        function addLoveAndHateHandler(love, hate) {
            document.getElementById('love').addEventListener('click', love);
            document.getElementById('hate').addEventListener('click', hate);
        }

        return {
            addImageItem: addImageItem,
            articleNumber: articleNumber,
            imagecontainer: imagecontainer,
            lastPane: lastPane,
            addLoveAndHateHandler: addLoveAndHateHandler
        };

    }());

    var presenter = function (model) {
        var animTime = 400;
        var revertTime = 200;

        var pane_width = 0;
        var likeSelector = '.like';
        var dislikeSelector = '.dislike';

        function translateTo(pos) {
            return {transform: "translateX(" + pos + "px) rotate(" + ((pos / pane_width) * 50) + "deg)"};
        }

        function hate() {
            var current = $(view.lastPane());
            current.animate(translateTo(-pane_width), animTime,
                    function () {
                        model.setDecision(view.articleNumber(current[0]), false);
                        refill();
                        current.remove();
                    });
        }

        function love() {
            var current = $(view.lastPane());
            current.animate(translateTo(pane_width), animTime,
                    function () {
                        model.setDecision(view.articleNumber(current[0]), true);
                        refill();
                        current.remove();
                    });
        }

        function moving(deltaX, opa) {
            var currentPane = $(view.lastPane());

            currentPane.css(translateTo(deltaX));

            if (opa > 1.0) {
                opa = 1.0;
            }
            if (deltaX >= 0) {
                currentPane.find(likeSelector).css('opacity', opa);
                currentPane.find(dislikeSelector).css('opacity', 0);
            } else {
                currentPane.find(dislikeSelector).css('opacity', opa);
                currentPane.find(likeSelector).css('opacity', 0);
            }
        }

        function endMove(deltaX, opa) {
            var currentPane = $(view.lastPane());

            if (opa >= 1) {
                if (deltaX > 0) {
                    love();
                } else {
                    hate();
                }
            } else {
                currentPane.animate(translateTo(0), revertTime);
                currentPane.find(likeSelector).animate({"opacity": 0}, revertTime);
                currentPane.find(dislikeSelector).animate({"opacity": 0}, revertTime);
            }
        }

        function refill() {
            if ($('.recommendation').length <= 5) {
                model.getRecommendations(function (recommendations) {
                    recommendations.forEach(view.addImageItem);
                });
            }
        }

        function start() {
            var $element = $(view.imagecontainer());

            swiper.addEventhandler(
                    view.imagecontainer(),
                    moving,
                    endMove);

            view.addLoveAndHateHandler(love, hate);

            pane_width = $element.width() * 1.5;
            refill();
        }

        start();
    };

    return {
        pictureswipe: presenter
    };

}());

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