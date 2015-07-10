document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    halfdane.pictureswipe(halfdane.fake_model);
});

var halfdane = (function () {
    'use strict';

    var swiper = (function () {
        var touchStart = false;
        var xStart = 0;

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

                if (moveHandler) {
                    moveHandler(deltaX);
                }
            }
        }

        function handleEnd(ev) {
            ev.preventDefault();
            touchStart = false;
            var pageX = ev.pageX || ev.changedTouches[0].pageX;
            var deltaX = parseInt(pageX) - parseInt(xStart);

            if (endMoveHandler) {
                endMoveHandler(deltaX);
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
        var animTime = 400;
        var revertTime = 200;
        var pane_width = 1.2 * (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
        var removingCurrent = false;

        function setStyleWithVendorPrefix(el, prop, val) {
            var vendors = ['-moz-', '-webkit-', '-o-', '-ms-', '-khtml-', ''];

            function toCamelCase(str) {
                return str.toLowerCase().replace(/(\-[a-z])/g, function ($1) {
                    return $1.toUpperCase().replace('-', '');
                });
            }

            for (var i = 0, l = vendors.length; i < l; i++) {
                var p = toCamelCase(vendors[i] + prop);
                if (p in el.style) {
                    el.style[p] = val;
                }
            }
        }

        function onAnimationEnd(element, callback) {
            var realCallback = function (event) {
                event.target.removeEventListener(event.type, realCallback, false);

                if (callback) {
                    callback();
                }
            };

            element.addEventListener("webkitTransitionEnd", realCallback, false);
            element.addEventListener("MSTransitionEnd", realCallback, false);
            element.addEventListener("oTransitionEnd", realCallback, false);
            element.addEventListener("transitionend", realCallback, false);
        }

        function addImageItem(item, createOnLoad) {
            var img = new Image();
            img.onload = createOnLoad(img);
            img.src = item.imageUrl;
            img.classList.add('recommendation');
            img.setAttribute('data-articlenumber', item.articleNumber);
            img.setAttribute('data-rnd', Math.random());

            var like = document.createElement('div');
            like.classList.add('love');

            var dislike = document.createElement('div');
            dislike.classList.add('hate');

            var li = document.createElement('li');
            li.classList.add('slide');
            li.appendChild(img);
            li.appendChild(like);
            li.appendChild(dislike);

            var images = imagecontainer();
            images.insertBefore(li, images.firstChild);
        }

        function translateTo(pos) {
            return 'translateX(' + pos + 'px) rotate(' + ((pos / pane_width) * 50) + 'deg)';
        }

        function removeCurrentAt(leftOrRight, callback) {
            if (!removingCurrent) {
                removingCurrent = true;
                var element = lastPane();
                setStyleWithVendorPrefix(element, 'transition-duration', animTime + 'ms');
                setStyleWithVendorPrefix(element, 'transform', translateTo(leftOrRight * pane_width));

                onAnimationEnd(element, function () {
                    callback(element);
                    element.parentNode.removeChild(element);
                    removingCurrent = false;
                });
            }
        }

        function moveCurrentTo(targetPosition) {
            var element = lastPane();
            setStyleWithVendorPrefix(element, 'transition-duration', 0 + 'ms');
            setStyleWithVendorPrefix(element, 'transform', translateTo(targetPosition));

            if (isOut(targetPosition)) {
                if (targetPosition >= 0) {
                    currentLoveBadge().style.opacity = 1.0;
                    currentHateBadge().style.opacity = 0.0;
                } else {
                    currentLoveBadge().style.opacity = 0.0;
                    currentHateBadge().style.opacity = 1.0;
                }
            } else {
                currentLoveBadge().style.opacity = 0.0;
                currentHateBadge().style.opacity = 0.0;
            }

        }

        function revertCurrent() {
            var pane = lastPane();
            setStyleWithVendorPrefix(pane, 'transition-duration', revertTime + 'ms');
            setStyleWithVendorPrefix(pane, 'transform', translateTo(0));

            var loveBadge = currentLoveBadge();
            setStyleWithVendorPrefix(loveBadge, 'transition', 'opacity ' + revertTime + 'ms');

            var hateBadge = currentHateBadge();
            setStyleWithVendorPrefix(hateBadge, 'transition', 'opacity ' + revertTime + 'ms');
        }

        function addLoveAndHateHandler(love, hate) {
            document.getElementById('love').addEventListener('click', love);
            document.getElementById('hate').addEventListener('click', hate);
        }

        function lastPane() {
            return imagecontainer().querySelector('.slide:last-child');
        }

        function percentMoved(pos) {
            return Math.abs(pos / pane_width);
        }

        function isOut(pos) {
            return percentMoved(pos) >= 0.3;
        }

        function articleNumber(slide) {
            return slide.firstChild.getAttribute('data-articlenumber');
        }

        function imagecontainer() {
            return document.getElementById('images');
        }

        function imageCount() {
            return imagecontainer().querySelectorAll('.recommendation').length;
        }

        function currentLoveBadge() {
            return lastPane().querySelector('.love');
        }

        function currentHateBadge() {
            return lastPane().querySelector('.hate');
        }

        return {
            lastPane: lastPane,
            addImageItem: addImageItem,
            articleNumber: articleNumber,
            imagecontainer: imagecontainer,
            addLoveAndHateHandler: addLoveAndHateHandler,
            imageCount: imageCount,
            removeCurrentAt: removeCurrentAt,
            moveCurrentTo: moveCurrentTo,
            revertCurrent: revertCurrent,
            isOut: isOut
        };

    }());

    var presenter = function (model) {
        (function initializer() {
            view.addLoveAndHateHandler(love, hate);
            refill();
        }());

        function hate() {
            view.removeCurrentAt(-1, function (element) {
                model.setDecision(view.articleNumber(element), false);
                refill();
            });
        }

        function love() {
            view.removeCurrentAt(1, function (element) {
                model.setDecision(view.articleNumber(element), true);
                refill();
            });
        }

        function endMove(deltaX) {
            if (view.isOut(deltaX)) {
                if (deltaX > 0) {
                    love();
                } else {
                    hate();
                }
            } else {
                view.revertCurrent();
            }
        }

        function refill() {
            if (view.imageCount() <= 5) {
                model.getRecommendations(function (recommendations) {
                    recommendations.forEach(function (recommendation) {
                        view.addImageItem(recommendation, function (img) {
                            return function () {
                                swiper.addEventhandler(img, view.moveCurrentTo, endMove);
                            };
                        });
                    });
                });
            }
        }
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