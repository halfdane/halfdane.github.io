$.fn.addClass = function (className) {
    this.forEach(function (item) {
        var classList = item.classList;
        classList.add.apply(classList, className.split(/\s/));
    });
    return this;
};

$.fn.find = function (selector) {
    return this[0].querySelectorAll(selector);
};

$.fn.findOne = function (selector) {
    return this[0].querySelector(selector);
};