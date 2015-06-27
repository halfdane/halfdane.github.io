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
            imageUrl: 'img' + counter + '.jpg',
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

halfdane.pictureswipe = function (dataprovider) {
    'use strict';

    function nextImage() {
        var item = dataprovider.next();

        var image = document.createElement('img');
        image.setAttribute('id', 'target');
        image.setAttribute('src', item.imageUrl);
        image.setAttribute('data-articleNumber', item.articleNumber);

        var target = document.getElementById('target');
        target.parentNode.replaceChild(image, target);

        initTouchListeners(document.getElementById('target'));
    }

    function dragElement(event) {
        var element = event.target;
        element.style.transition = "0";
        // deltaX tracks the distance dragged along the x-axis since the initial touch.
        element.style.transform = "translateX(" + event.gesture.deltaX + "px)";
    }

    function deleteElement(element, emotion) {
        var articleNumber = element.getAttribute('data-articleNumber');

        console.log('User does ' + emotion + ' article ' + articleNumber);

        var elementToDelete = event.target;
        // Stop detecting touches on element when it's no longer needed. Can prevent odd behaviour.
        event.gesture.stopDetect();
        elementToDelete.style.display = 'none';
    }

    function likeElement(event) {
        deleteElement(event.target, 'love');
        nextImage();
    }

    function hateElement(event) {
        deleteElement(event.target, 'hate');
        nextImage();
    }

    function resetElement(event) {
        var element = event.target;
        element.style.transition = "1s ease-in-out";
        element.style.transform = 'translateX(0px)';
    }

    // Swipe options as recommended by:
    // https://github.com/EightMedia/hammer.js/wiki/Tips-&-Tricks#horizontal-swipe-and-drag
    var swipeOptions = {dragLockToAxis: true, dragBlockHorizontal: true};

    function initTouchListeners(touchableElement) {
        var touchControl = new Hammer(touchableElement, swipeOptions);
        touchControl.on('dragleft dragright', dragElement)
                .on('swiperight', likeElement)
                .on('swipeleft', hateElement)
                .on('release', resetElement);
    }

    function start() {
        var target = document.getElementById('target');

        while( target.firstChild ) {
            target.removeChild( target.firstChild );
        }
        target.appendChild( document.createTextNode('Game has started') );
        nextImage();
    }

    return {
        start: start
    };
};

document.addEventListener('DOMContentLoaded', halfdane.pictureswipe(halfdane.fake_dataprovider).start);
