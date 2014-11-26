$.fn.addClass = function (className) {
    this.forEach(function (item) {
        var classList = item.classList;
        classList.add.apply(classList, className.split(/\s/));
    });
    return this;
};