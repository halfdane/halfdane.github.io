/*global define, require */
define(['vendor/balalaika'], function ($) {
    'use strict';

    $.fn.addClass = function (className) {
        this.forEach(function (item) {
            var classList = item.classList;
            classList.add.apply(classList, className.split(/\s/));
        });
        return this;
    };

    $.fn.removeClass = function( className ) {
        this.forEach( function( item ) {
            var classList = item.classList;
            classList.remove.apply( classList, className.split( /\s/ ) );
        });
        return this;
    };

    $.fn.hasClass = function( className ) {
        return !!this[ 0 ] && this[ 0 ].classList.contains( className );
    };

    $.fn.find = function (selector) {
        return this.querySelectorAll(selector);
    };

    $.fn.findOne = function (selector) {
        return this.querySelector(selector);
    };
});