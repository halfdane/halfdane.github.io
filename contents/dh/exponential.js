window.exponential = window.exponential || {};

window.exponential.graph = function (canvas) {

    var ctx = canvas.getContext('2d');
    var iteration;

    var scaleX;
    var scaleY;

    var animateHighlight;
    var currentHighlight;
    var shouldDrawHighlight;

    var g, s;

    var shouldZoom;

    var maxX = 5, maxY = 100000;
    var xStep, yStep;

    function scaleTo(maxX, maxY) {
        iteration = maxX / 1000;

        scaleX = canvas.width / maxX;
        scaleY = canvas.height / maxY;
    }

    function resetAnimation(graphType) {
        g = graphType;
    }

    function zoomTo(scaleType) {
        s = scaleType;

        shouldZoom = false;
        animateHighlight = false;
        shouldDrawHighlight = false;

        currentHighlight = s.highlightStart;

        xStep = (s.maxX - maxX) / 100;
        yStep = (s.maxY - maxY) / 100;

        scaleTo(maxX, maxY);
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

    function inGraph(lineOpts, callback) {
        ctx.save();
        ctx.translate(0, canvas.height);
        ctx.scale(scaleX, -scaleY);
        ctx.beginPath();

        callback();

        ctx.restore();

        ctx.lineJoin = 'round';
        ctx.lineWidth = 1;
        ctx.strokeStyle = lineOpts.color;
        ctx.stroke();
    }

    function zoomScale(s) {
        var xDiff = Math.abs(s.maxX - maxX);
        var yDiff = Math.abs(s.maxY - maxY);

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
        if (currentHighlight > s.highlightEnd) {
            if (animateHighlight) {
                currentHighlight -= iteration;
            }
        }

        inGraph({color: 'blue'}, function () {
            ctx.moveTo(currentHighlight, 0);
            ctx.lineTo(currentHighlight, equation(currentHighlight));

            ctx.moveTo(0, equation(currentHighlight));
            ctx.lineTo(currentHighlight, equation(currentHighlight));
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawAxes();

        inGraph({color: 'red'}, function () {
            ctx.moveTo(0, g.equation(0));
            for (var x = 0 + iteration; x <= maxX; x += iteration) {
                g.draw(ctx, x, g.equation(x));
            }
        });

        if (shouldDrawHighlight) {
            drawHighlight(g.equation);
        }

        zoomScale(s);
    }

    function activateHighlight() {
        shouldDrawHighlight = true;
    }

    function activateHighlightAnimation() {
        animateHighlight = true;
    }

    return {
        draw: draw,
        resetAnimation: resetAnimation,
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

    function init(current, graphTypes) {
        var $canvas = current.find('canvas')
                .width('100%')
                .prop({width: 500, height: 500});
        $canvas.trigger('resize.deckscale');

        graph = exponential.graph($canvas[0]);
        graph.resetAnimation(graphTypes[0].graph);
        graph.zoomTo(graphTypes[0].scale);
        steps = [
            graph.activateHighlight,
            graph.activateHighlightAnimation,
            function () {
                graph.resetAnimation(graphTypes[1].graph);
            },
            function () {
                graph.zoomTo(graphTypes[1].scale);
            },
            graph.activateHighlight,
            graph.activateHighlightAnimation,
        ]
        ;
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
        var currentFunction = steps[currentStep];
        console.log('Executing %d step: %s', currentStep,
                currentFunction.toString().substr(0, currentFunction.toString().indexOf('(')));
        currentFunction();
        currentStep++;
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
  
