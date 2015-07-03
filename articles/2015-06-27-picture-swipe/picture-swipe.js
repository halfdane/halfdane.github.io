var halfdane = halfdane || {};

halfdane.fake_dataprovider = (function () {
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

    return {
        next: next
    };
}());

halfdane.fullscreen = {
    start: function (element) {
        'use strict';

        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    },
    exit: function () {
        'use strict';

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
};

halfdane.pictureswipe = function (dataprovider) {
    'use strict';

    function nextImage() {
        var item = dataprovider.next();

        var image = document.createElement('img');
        image.setAttribute('id', 'target');
        image.setAttribute('src', item.imageUrl);
        image.setAttribute('data-articleNumber', item.articleNumber);
        image.classList.add('recommendation');

        var target = document.getElementById('target');
        target.parentNode.replaceChild(image, target);

        initTouchListeners(document.getElementById('target'));
    }

    function dragElement(event) {
        var element = document.getElementById('target');
        element.style.transition = "0";
        element.style.transform = "translate(" + event.gesture.deltaX + "px, " + 0 + "px) rotate(" +
        (event.gesture.deltaX / 10) + "deg)";
    }

    function deleteElement(event, emotion) {
        var element = document.getElementById('target');
        var articleNumber = element.getAttribute('data-articleNumber');

        console.log('User does ' + emotion + ' article ' + articleNumber);

        // Stop detecting touches on element when it's no longer needed. Can prevent odd behaviour.
        if (event.gesture && event.gesture.stopDetect) {
            event.gesture.stopDetect();
        }
        element.style.display = 'none';
    }

    function loveElement(event) {
        deleteElement(event, 'love');
        nextImage();
    }

    function hateElement(event) {
        deleteElement(event, 'hate');
        nextImage();
    }

    function resetElement(event) {
        var element = document.getElementById('target');
        element.style.transition = "0.05s ease-in-out";
        element.style.transform = 'translate(0px, 0px) rotate(0deg)';
    }

    // Swipe options as recommended by:
    // https://github.com/EightMedia/hammer.js/wiki/Tips-&-Tricks#horizontal-swipe-and-drag
    var swipeOptions = {dragLockToAxis: true, dragBlockHorizontal: true};

    function initTouchListeners(touchableElement) {
        var touchControl = new Hammer(touchableElement, swipeOptions);
        touchControl.on('dragleft dragright', dragElement)
                .on('swiperight', loveElement)
                .on('swipeleft', hateElement)
                .on('release', resetElement);
    }

    function bindControls() {
        document.getElementById('love').addEventListener('click', loveElement);
        document.getElementById('hate').addEventListener('click', hateElement);
    }

    function start() {
        bindControls();

        nextImage();
    }

    return {
        start: start
    };
};

document.addEventListener('DOMContentLoaded', halfdane.pictureswipe(halfdane.fake_dataprovider).start);
