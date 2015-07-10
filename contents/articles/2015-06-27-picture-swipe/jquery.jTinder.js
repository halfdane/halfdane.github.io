/*global jQuery */

var jTinder = (function ($) {
    'use strict';

    var defaults = {
        onDislike: null,
        onLike: null,
        animationRevertSpeed: 200,
        animationSpeed: 400,
        threshold: 1,
        likeSelector: '.like',
        dislikeSelector: '.dislike'
    };

    var settings = {};

    var touchStart = false;
    var xStart = 0;
    var lastPosX = 0;
    var panes = null;
    var pane_width = 0, currentPane = 0;

    function init(element, options) {
        settings = $.extend({}, defaults, options);

        $(element).on('touchstart', handleTouchstart);
        $(element).on('mousedown', handleMousedown);
        $(element).on('touchmove mousemove', handleMove);
        $(element).on('touchend mouseup', handleEnd);

        startOver(element);
    }

    function startOver(element) {
        panes = $(".slide", element);
        pane_width = $(element).width();

        currentPane = function () {
            return $(".slide", element).last();
        };
    }

    function next() {
        currentPane().hide();
        currentPane().remove();
    }

    function translateTo(pos) {
        return {transform: "translateX(" + pos + "px) rotate(" + ((pos / pane_width) * 50) + "deg)"};
    }

    function dislike() {
        currentPane().animate(translateTo(-pane_width), settings.animationSpeed,
                function () {
                    if (settings.onDislike) {
                        settings.onDislike(currentPane());
                    }
                    next();
                });
    }

    function like() {
        currentPane().animate(translateTo(pane_width), settings.animationSpeed,
                function () {
                    if (settings.onLike) {
                        settings.onLike(currentPane());
                    }
                    next();
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
            } else if (deltaX < 0) {

                currentPane().find(settings.dislikeSelector).css('opacity', opa);
                currentPane().find(settings.likeSelector).css('opacity', 0);
            }
        }
    }

    function handleEnd(ev) {
        touchStart = false;
        var pageX = (typeof ev.pageX === 'undefined') ? ev.originalEvent.changedTouches[0].pageX : ev.pageX;
        var deltaX = parseInt(pageX) - parseInt(xStart);
        var posX = deltaX + lastPosX;
        var opa = Math.abs((Math.abs(deltaX) / settings.threshold) / 100 + 0.2);

        if (opa >= 1) {
            if (posX > 0) {
                like();
            } else {
                dislike();
            }
        } else {
            lastPosX = 0;
            currentPane().animate(translateTo(0), settings.animationRevertSpeed);
            currentPane().find(settings.likeSelector).animate({"opacity": 0},
                    settings.animationRevertSpeed);
            currentPane().find(settings.dislikeSelector).animate({"opacity": 0},
                    settings.animationRevertSpeed);
        }
    }

    return {
        init: init,
        startOver: startOver,
        love: like,
        hate: dislike
    };

}(jQuery));
