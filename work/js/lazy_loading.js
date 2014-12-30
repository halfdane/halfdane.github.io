/*global define, require */

/**
 * handles lazy loading elements of the form
 *
 * <div class="someTargetContainer">
 * </div>
 * ...
 * <div class="lazyload" data-lazyhref="url for ajax request" data-lazytarget=".someTargetContainer">scroll down to
 * here for loading</div>
 *
 * the ajax request must contain one or more elements with a class .lazycontent: these will be appended into
 * the target container and the next lazyload-element will be put in place of the previous.
 */
define(['vendor/balalaika', 'vendor/sloth', 'vendor/microajax', 'balalaika_extensions'], function ($, sloth, microAjax) {
    'use strict';

    function createCallbackFunction (afterLoadFinishedFunction) {
        return function loadElement(element) {
            var loader = $('<img>')[0],
                href = element.getAttribute('data-lazyhref'),
                targetSelector = element.getAttribute('data-lazytarget');

            loader.setAttribute('src', '/loader.gif');
            element.insertAdjacentElement('afterend', loader);
            element.parentNode.removeChild(element);

            microAjax(href, function (res) {
                var lazyContent = $('<div>');
                lazyContent[0].innerHTML = res;

                // insert lazy contents into dom
                var target = $(targetSelector);
                $(lazyContent.find('.lazycontent')).forEach(function (el) {
                    target.appendChild(el);
                });

                //find next .lazyload and append current to it.
                var nextLoad = lazyContent.findOne('.lazyload');
                if (nextLoad !== null) {
                    loader.insertAdjacentElement('afterend', nextLoad);
                }
                loader.parentNode.removeChild(loader);

                if (afterLoadFinishedFunction) {
                    afterLoadFinishedFunction();
                }
            });
        };
    }

    function init(afterLoadFinishedFunction) {
        var callbackFunction = createCallbackFunction(afterLoadFinishedFunction);

        $('.lazyload').forEach(function (el) {
            sloth({
                on: el,
                threshold: 100,
                callback: callbackFunction
            });
        });
    }

    return {
        init: init
    };
});