'use strict';

window.exponential = window.exponential || {};

window.exponential.graph = function (canvas) {

    var ctx = canvas.getContext('2d');
    var iteration;

    var scaleX;
    var scaleY;

    var animateHighlight;
    var shouldDrawHighlight;
    var currentHighlight;
    var highlightEnd;

    var drawFct;
    var equationFct;

    var maxX = 5, maxY = 100000;
    var targetMaxX;
    var targetMaxY;
    var xStep, yStep;

    function scaleTo(maxX, maxY) {
        iteration = maxX / 1000;

        scaleX = canvas.width / maxX;
        scaleY = canvas.height / maxY;
    }

    function useEquation(equationFunction) {
        return function () {
            equationFct = equationFunction;
        };
    }

    function zoomTo(newMaxX, newMaxY) {
        return function () {
            animateHighlight = false;
            shouldDrawHighlight = false;

            targetMaxX = newMaxX;
            targetMaxY = newMaxY;

            xStep = (targetMaxX - maxX) / 100;
            yStep = (targetMaxY - maxY) / 100;

            scaleTo(maxX, maxY);
        };
    }

    function activateHighlight(highlightStart) {
        return function () {
            shouldDrawHighlight = true;
            currentHighlight = highlightStart;
        };
    }

    function activateHighlightAnimation(to) {
        return function () {
            animateHighlight = true;
            highlightEnd = to;
        };
    }

    function drawAxes() {
        ctx.save();
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width, 0);
        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, canvas.height);
        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

    function inGraph(callback) {
        ctx.save();
        ctx.translate(0, canvas.height);
        ctx.scale(scaleX, -scaleY);
        ctx.beginPath();

        callback();

        ctx.restore();

        ctx.lineJoin = 'round';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    function zoomScale() {
        var xDiff = Math.abs(targetMaxX - maxX);
        var yDiff = Math.abs(targetMaxY - maxY);

        if (xDiff > 0.1 || yDiff > 0.1) {
            if (xDiff > 0.1) {
                maxX += xStep;
            }
            if (yDiff > 0.1) {
                maxY += yStep;
            }

            scaleTo(maxX, maxY);
        }
    }

    function drawHighlight(equation) {
        if (currentHighlight > highlightEnd) {
            if (animateHighlight) {
                currentHighlight -= iteration;
            }
        }

        inGraph(function () {
            ctx.moveTo(currentHighlight, 0);
            ctx.lineTo(currentHighlight, equation(currentHighlight));

            ctx.moveTo(0, equation(currentHighlight));
            ctx.lineTo(currentHighlight, equation(currentHighlight));
            ctx.strokeStyle = 'blue';
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawAxes();

        inGraph(function () {
            for (var x = 0 + iteration; x <= maxX; x += iteration) {
                ctx.fillStyle = 'red';
                ctx.fillRect(x, equationFct(x), 2 / scaleX, 2 / scaleY);
            }
        });

        if (shouldDrawHighlight) {
            drawHighlight(equationFct);
        }

        zoomScale();
    }

    return {
        draw: draw,
        useEquation: useEquation,
        activateHighlight: activateHighlight,
        activateHighlightAnimation: activateHighlightAnimation,
        zoomTo: zoomTo
    }
};

window.exponential.simple = (function () {

    var running = false;
    var graph;
    var steps;
    var currentStep;

    function init(current) {
        var $canvas = current.find('canvas')
                .width('100%')
                .prop({width: 500, height: 500});
        $canvas.trigger('resize.deckscale');

        graph = exponential.graph($canvas[0]);
        graph.useEquation(function (x) {
            return Math.pow(17, x);
        })();
        graph.zoomTo(5, 100000)();

        steps = [
            graph.activateHighlight(4),
            graph.activateHighlightAnimation(3),
            graph.zoomTo(100, 100),
            graph.useEquation(function (x) {
                return Math.pow(17, x) % 97;
            }),
            graph.activateHighlight(50),
            graph.activateHighlightAnimation(30)
        ];
        running = true;
        currentStep = 0;

        window.requestAnimationFrame(draw);
    }

    function stop() {
        running = false;
    }

    function hasMoreSteps() {
        return currentStep < steps.length;
    }

    function step() {
        steps[currentStep++]();
    }

    function draw(timestamp) {
        if (!running) {
            return;
        }

        graph.draw(timestamp);

        window.requestAnimationFrame(draw);
    }

    return {
        init: init,
        hasMoreSteps: hasMoreSteps,
        step: step,
        stop: stop
    };
})();
  
