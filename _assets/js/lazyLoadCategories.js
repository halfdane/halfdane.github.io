var halfdane = halfdane || {};

halfdane.lazyloadCategories = function (categories_target_selector, remaining_contents_selector) {
    'use strict';

    // Get the original CSS values instead of values of the element.
    // @param {String} ruleSelector
    // @param {String} cssprop
    // @returns {String} property of the style
    function getCssStyle(ruleSelector, cssprop) {
        for (var c = 0, lenC = document.styleSheets.length; c < lenC; c++) {
            var rules = document.styleSheets[c].cssRules;
            for (var r = 0, lenR = rules.length; r < lenR; r++) {
                var rule = rules[r];
                if (rule.selectorText == ruleSelector && rule.style) {
                    return rule.style[cssprop]; // rule.cssText;
                }
            }
        }
        return null;
    }

    if ($(categories_target_selector).length > 0) {
        var targetWidth = getCssStyle(categories_target_selector, "width");

        $(remaining_contents_selector)
            .css({display: "inline-block"})
            .animate({width: "80%"}, { duration: 200, queue: false });
        $(categories_target_selector)
            .css({display: "inline-block", width: 0})
            .animate({width: targetWidth}, { duration: 200, queue: false }, function() {
                halfdane.equalheight_blocks(categories_target_selector, remaining_contents_selector);
            });
    }
};
