var halfdane = halfdane || {};

halfdane.equalheight_blocks = function ($selector) {
    'use strict';

    //Inspired (read: stolen =) by http://css-tricks.com/equal-height-blocks-in-rows
    // not that it is necessary - the css builds blocks just fine,
    // but I want the hover effect on the postslists boxes to span the complete height :)

    function setConformingHeight(el, newHeight) {
        el.height(newHeight);
    }

    function getHeight(el) {
        return el.height();
    }

    function columnConform() {
        var currentTallest = 0,
            currentRowStart = 0,
            currentDiv,
            rowDivs = new Array();

        // find the tallest DIV in the row, and set the heights of all of the DIVs to match it.
        $selector.each(function () {
            // "caching"
            var $el = $(this);

            var topPosition = $el.position().top;

            if (currentRowStart != topPosition) {

                // we just came to a new row.  Set all the heights on the completed row
                for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                    setConformingHeight(rowDivs[currentDiv], currentTallest);
                }

                // set the variables for the new row
                rowDivs.length = 0; // empty the array
                currentRowStart = topPosition;
                currentTallest = getHeight($el);
                rowDivs.push($el);

            } else {

                // another div on the current row.  Add it to the list and check if it's taller
                rowDivs.push($el);
                currentTallest = (currentTallest < getHeight($el)) ? (getHeight($el)) : (currentTallest);

            }
            // do the last row
            for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                setConformingHeight(rowDivs[currentDiv], currentTallest);
            }
        });
    }

    columnConform();
};
