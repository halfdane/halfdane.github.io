'use strict';

window.exponential = window.exponential || {};

window.exponential.graph = (function () {

    var canvas;
    var ctx;

    var scaled = (function () {
        var iteration;

        var scaleX;
        var scaleY;

        var maxX = 5, maxY = 100000;

        var targetMaxX;
        var targetMaxY;
        var xStep, yStep;

        function draw(callback) {
            ctx.save();
            ctx.translate(0, canvas.height);
            ctx.scale(scaleX, -scaleY);
            ctx.beginPath();

            callback(iteration, maxX, scaleX, scaleY);

            ctx.restore();

            ctx.lineJoin = 'round';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        function zoomTo(newMaxX, newMaxY) {
            targetMaxX = newMaxX;
            targetMaxY = newMaxY;

            xStep = (targetMaxX - maxX) / 100;
            yStep = (targetMaxY - maxY) / 100;

            zoomStep(maxX, maxY);
        }

        function set(maxX, maxY) {
            iteration = maxX / 1000;

            scaleX = canvas.width / maxX;
            scaleY = canvas.height / maxY;
        }

        function zoomStep() {
            var xDiff = Math.abs(targetMaxX - maxX);
            var yDiff = Math.abs(targetMaxY - maxY);

            if (xDiff > 0.1 || yDiff > 0.1) {
                if (xDiff > 0.1) {
                    maxX += xStep;
                }
                if (yDiff > 0.1) {
                    maxY += yStep;
                }
                set(maxX, maxY);
            }
        }

        return {
            set: set,
            draw: draw,
            zoomTo: zoomTo,
            zoomStep: zoomStep
        };
    })();

    var axes = (function () {
        function draw() {
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

        return {
            draw: draw
        }
    })();

    var equation = (function () {
        var equationFunction;

        function set(newEquationFunction) {
            equationFunction = newEquationFunction;
        }

        function calculate(x) {
            return equationFunction(x);
        }

        function draw() {
            scaled.draw(function (iteration, maxX, scaleX, scaleY) {
                for (var x = 0 + iteration; x <= maxX; x += iteration) {
                    ctx.fillStyle = 'red';
                    ctx.fillRect(x, equationFunction(x), 2 / scaleX, 2 / scaleY);
                }
            });
        }

        return {
            set: set,
            draw: draw,
            calculate: calculate
        }
    })(scaled);

    var highLight = (function (equation) {
        var animateHighlight;
        var shouldDrawHighlight;
        var currentHighlight;
        var highlightEnd;

        function reset() {
            animateHighlight = false;
            shouldDrawHighlight = false;
        }

        function activate(highlightStart) {
            shouldDrawHighlight = true;
            currentHighlight = highlightStart;
        }

        function animateTo(to) {
            animateHighlight = true;
            highlightEnd = to;
        }

        function draw() {
            if (!shouldDrawHighlight) {
                return;
            }

            scaled.draw(function (iteration) {
                if (currentHighlight > highlightEnd) {
                    if (animateHighlight) {
                        currentHighlight -= iteration;
                    }
                }

                ctx.moveTo(currentHighlight, 0);
                ctx.lineTo(currentHighlight, equation.calculate(currentHighlight));

                ctx.moveTo(0, equation.calculate(currentHighlight));
                ctx.lineTo(currentHighlight, equation.calculate(currentHighlight));
                ctx.strokeStyle = 'blue';
            });
        }

        return {
            reset: reset,
            activate: activate,
            animateTo: animateTo,
            draw: draw
        }
    })(equation);

    var steps = (function(){
        var running = false;
        var steps = [
            function () {
                highLight.activate(4);
            },
            function () {
                highLight.animateTo(3)
            },
            function () {
                highLight.reset();
                scaled.zoomTo(100, 100);
            },
            function () {
                equation.set(function (x) {
                    return Math.pow(17, x) % 97;
                });
            },
            function () {
                highLight.activate(50);
            },
            function () {
                highLight.animateTo(30)
            }
        ];
        var currentStep = 0;

        function init() {
            running = true;
            currentStep = 0;
        }

        function stop() {
            running = false;
        }

        function hasMoreSteps() {
            return running && currentStep < steps.length;
        }

        function step() {
            steps[currentStep++]();
        }

        function isRunning() {
            return running;
        }

        return {
            init: init,
            stop: stop,
            hasMoreSteps: hasMoreSteps,
            isRunning: isRunning,
            step: step
        }
    })();



    function init(current) {
        var $canvas = current.find('canvas')
                .width('100%')
                .prop({width: 500, height: 500});
        $canvas.trigger('resize.deckscale');

        canvas = $canvas[0];
        ctx = canvas.getContext('2d');
        steps.init();

        equation.set(function (x) {
            return Math.pow(17, x);
        });
        highLight.reset();
        scaled.set(5, 100000);
        scaled.zoomTo(5, 100000);


        window.requestAnimationFrame(draw);
    }

    function draw() {
        if (!steps.isRunning()) {
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        axes.draw();
        equation.draw();
        highLight.draw();
        scaled.zoomStep();

        window.requestAnimationFrame(draw);
    }

    return {
        init: init,
        hasMoreSteps: steps.hasMoreSteps,
        step: steps.step,
        stop: steps.stop
    };
})();
  
