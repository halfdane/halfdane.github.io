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

halfdane.dragger = function (drag, drop) {
    'use strict';

    var touchStart = false;
    var xStart = 0, yStart = 0;
    var posX = 0, posY = 0;
    var lastPosX = 0, lastPosY = 0;

    function handler(ev) {
        ev.preventDefault();

        switch (ev.type) {
            case 'touchstart':
                if (touchStart === false) {
                    touchStart = true;
                    xStart = ev.touches[0].pageX;
                    yStart = ev.touches[0].pageY;
                }
                break;
            case 'mousedown':
                if (touchStart === false) {
                    touchStart = true;
                    xStart = ev.pageX;
                    yStart = ev.pageY;
                }
                break;
            case 'mousemove':
            case 'touchmove':
                if (touchStart === true) {
                    var pageX = typeof ev.touches[0].pageX === 'undefined' ? ev.pageX : ev.touches[0].pageX;
                    var pageY = typeof ev.touches[0].pageY === 'undefined' ? ev.pageY : ev.touches[0].pageY;
                    var deltaX = parseInt(pageX) - parseInt(xStart);
                    var deltaY = parseInt(pageY) - parseInt(yStart);
                    posX = deltaX + lastPosX;
                    posY = deltaY + lastPosY;

                    drag(deltaX, deltaY);
                }
                break;
            case 'mouseup':
            case 'touchend':
                touchStart = false;
                var pageX = (typeof ev.changedTouches[0].pageX === 'undefined') ? ev.pageX : ev.changedTouches[0].pageX;
                var pageY = (typeof ev.changedTouches[0].pageY === 'undefined') ? ev.pageY : ev.changedTouches[0].pageY;
                var deltaX = parseInt(pageX) - parseInt(xStart);
                var deltaY = parseInt(pageY) - parseInt(yStart);

                posX = deltaX + lastPosX;
                posY = deltaY + lastPosY;

                drop(deltaX, deltaY);
                break;
        }
    }

    function bind(element) {
        element.addEventListener('touchstart', handler);
        element.addEventListener('mousedown', handler);
        element.addEventListener('touchmove', handler);
        element.addEventListener('mousemove', handler);
        element.addEventListener('touchend', handler);
        element.addEventListener('mouseup', handler);
    }

    return {
        bind: bind
    };
};

halfdane.pictureswipe = function (model) {
    'use strict';

    function distanceSquared(deltaX, deltaY) {
        return Math.pow(deltaX, 2.0) + Math.pow(deltaY, 2.0)
    }

    function imagesContainer() {
        return document.getElementById('images');
    }

    function currentTopImage() {
        return imagesContainer().lastElementChild;
    }

    function deleteElement(isHot) {
        var element = currentTopImage();
        var articleNumber = element.getAttribute('data-articleNumber');
        model.setDecision(articleNumber, isHot);

        element.addEventListener("transitionend", function transitionEndListener(e) {
            e.target.removeEventListener(e.type, transitionEndListener);

            imagesContainer().removeChild(currentTopImage());

            document.getElementById('love').classList.remove('active');
            document.getElementById('hate').classList.remove('active');

            initTouchListeners();

            if (imagesContainer().childElementCount < 5) {
                loadSomeImages();
            }
        });

        window.requestAnimationFrame(function () {
            var imageThrowTarget = window.innerWidth * (isHot ? 1 : -1);
            element.style.transition = "0.2s";
            element.style.transform = "translate(" + imageThrowTarget + "px, " + 0 + "px) rotate(" +
            (imageThrowTarget / 10) + "deg)";
            element.style.opacity = "0";
        });

    }

    function isLovingOrHating(deltaX, loveCallback, hateCallback) {
        console.log(deltaX, (window.innerWidth * 0.2));
        var overTheEdge = Math.abs(deltaX) > (window.innerWidth * 0.2);
        if (overTheEdge) {
            if (deltaX > 0) {
                loveCallback && loveCallback();
            } else {
                hateCallback && hateCallback();
            }
        }

        return overTheEdge;
    }

    function loveElement() {
        document.getElementById('love').classList.add('active');
        deleteElement(true);
    }

    function hateElement() {
        document.getElementById('hate').classList.add('active');
        deleteElement(false);
    }

    function dragElement(deltaX) {
        window.requestAnimationFrame(function () {
            var element = currentTopImage();

            document.getElementById('love').classList.remove('active');
            document.getElementById('hate').classList.remove('active');
            isLovingOrHating(deltaX, function () {
                document.getElementById('love').classList.add('active');
            }, function () {
                document.getElementById('hate').classList.add('active');
            });

            element.style.transition = "0";
            element.style.transform = "translate(" + deltaX + "px, " + 0 + "px) rotate(" + (deltaX / 20) + "deg)";
        });
    }

    function resetElement(deltaX) {
        if (!isLovingOrHating(deltaX, loveElement, hateElement)) {
            window.requestAnimationFrame(function () {
                var element = currentTopImage();
                element.style.transition = "0.05s ease-in-out";
                element.style.transform = 'translate(0px, 0px) rotate(0deg)';
            });
        }

    }

    function initTouchListeners() {
        halfdane.dragger(dragElement, resetElement)
                .bind(currentTopImage());
    }

    function addImageItem(item, onload) {
        var image = document.createElement('img');
        image.onload = onload;
        image.src = item.imageUrl;
        image.setAttribute('data-articleNumber', item.articleNumber);
        image.classList.add("recommendation");
        imagesContainer().insertBefore(image, imagesContainer().firstElementChild);
    }

    function loadSomeImages(afterLoad) {
        model.getRecommendations(function (recommendations) {

            if (recommendations[0]) {
                addImageItem(recommendations[0], function () {
                    for (var i = 1; i < recommendations.length; i++) {
                        addImageItem(recommendations[i]);
                    }
                });
            }

            if (afterLoad) {
                afterLoad();
            }
        });
    }

    function start() {
        document.getElementById('love').addEventListener('click', loveElement);
        document.getElementById('hate').addEventListener('click', hateElement);
        loadSomeImages(initTouchListeners);
    }

    return {
        start: start
    };
};

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    halfdane.pictureswipe(halfdane.fake_model).start();
});
