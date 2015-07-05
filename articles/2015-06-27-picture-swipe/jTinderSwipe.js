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
    var pageX = 0, pageY = 0;

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
                    pageX = typeof ev.touches === 'undefined' ? ev.pageX : ev.touches[0].pageX;
                    pageY = typeof ev.touches === 'undefined' ? ev.pageY : ev.touches[0].pageY;

                    drag(parseInt(pageX) - parseInt(xStart), parseInt(pageY) - parseInt(yStart));
                }
                break;
            case 'mouseup':
            case 'touchend':
                touchStart = false;
                pageX = (typeof ev.changedTouches === 'undefined') ? ev.pageX : ev.changedTouches[0].pageX;
                pageY = (typeof ev.changedTouches === 'undefined') ? ev.pageY : ev.changedTouches[0].pageY;

                drop(parseInt(pageX) - parseInt(xStart), parseInt(pageY) - parseInt(yStart));
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
    
    var imagesContainer = document.getElementById('images');
    var love = document.getElementById('love');
    var hate = document.getElementById('hate');

    function currentTopImage() {
        return imagesContainer.lastElementChild;
    }

    function deleteElement(isHot) {
        var element = currentTopImage();
        var articleNumber = element.getAttribute('data-articleNumber');
        model.setDecision(articleNumber, isHot);

        element.addEventListener("transitionend", function transitionEndListener(e) {
            e.target.removeEventListener(e.type, transitionEndListener);

            imagesContainer.removeChild(element);
            love.classList.remove('active');
            hate.classList.remove('active');

            initTouchListeners();

            if (imagesContainer.childElementCount < 5) {
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
        var overTheEdge = Math.abs(deltaX) > (window.innerWidth * 0.2);
        if (overTheEdge) {
            if (deltaX > 0) {
                if (loveCallback) {
                    loveCallback();
                }
            } else {
                if (hateCallback) {
                    hateCallback();
                }
            }
        }

        return overTheEdge;
    }

    function loveElement() {
        love.classList.add('active');
        deleteElement(true);
    }

    function hateElement() {
        hate.classList.add('active');
        deleteElement(false);
    }

    function dragElement(deltaX) {
        window.requestAnimationFrame(function () {
            var element = currentTopImage();

            love.classList.remove('active');
            hate.classList.remove('active');
            isLovingOrHating(deltaX, function () {
                love.classList.add('active');
            }, function () {
                hate.classList.add('active');
            });

            element.style.transition = "0";
            element.style.transform = "translate(" + deltaX + "px, " + 0 + "px) rotate(" + (deltaX / 20) + "deg)";
            element.style.opacity = window.innerWidth / Math.abs(deltaX * 5);
        });
    }

    function resetElement(deltaX) {
        if (!isLovingOrHating(deltaX, loveElement, hateElement)) {
            window.requestAnimationFrame(function () {
                var element = currentTopImage();
                element.style.transition = "0.05s ease-in-out";
                element.style.transform = 'translate(0px, 0px) rotate(0deg)';
                element.style.opacity = '1.0';
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
        imagesContainer.insertBefore(image, imagesContainer.firstElementChild);
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
        love.addEventListener('click', loveElement);
        hate.addEventListener('click', hateElement);
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
