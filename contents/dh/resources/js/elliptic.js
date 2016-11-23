'use strict';

window.dh = window.dh || {};

window.dh.elliptic = (function () {

    function createScaler(canvasWidth, canvasHeight, newMaxX, newMaxY, ctx) {
        var iteration = newMaxX / 1000;

        var scaleX = canvasWidth / newMaxX;
        var scaleY = canvasHeight / newMaxY;

        var maxX = newMaxX;
        var maxY = newMaxY;

        function draw(callback) {
            ctx.save();
            ctx.translate(canvasWidth / 2, canvasHeight / 2);
            ctx.scale(scaleX, -scaleY);
            ctx.beginPath();

            callback(ctx, iteration, maxX, maxY, scaleX, scaleY);

            ctx.restore();

            ctx.lineJoin = 'round';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        return {
            draw: draw,
        };
    }

    function createEquation(scaled) {
        //y^2 = x^3 + ax + b;
        var a = -3;
        var b = 3;
        //y^2 = x^3 -3x + 3;

        var equationFunction = function (x) {
            /*
            y^2 = x^3 -3x + 3;

            0 = x^3 + ax +b -y^2
            x^3 = -ax -b + y^2

            */
            // http://jsxgraph.uni-bayreuth.de/wiki/index.php/Category:Examples
            return Math.sqrt(x*x*x + a*x + b);
        };


        function draw() {
            scaled.draw(function (ctx, iteration, maxX, maxY, scaleX, scaleY) {
                for (var x = -maxX + iteration; x <= maxX; x += iteration) {
                    ctx.fillStyle = 'red';
                    ctx.fillRect(x, equationFunction(x), 2 / scaleX, 2 / scaleY);
                    ctx.fillRect(x, -equationFunction(x), 2 / scaleX, 2 / scaleY);
                }
            });
        }

        return {
            draw: draw,
        }
    }

    function createAxes(canvasWidth, canvasHeight, ctx) {
        function draw() {
            ctx.save();
            ctx.translate(canvasWidth / 2, canvasHeight / 2);
            ctx.scale(1, -1);

            ctx.beginPath();
            ctx.moveTo(-canvasWidth, 0);
            ctx.lineTo(canvasWidth, 0);
            ctx.strokeStyle = '#aaa';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, -canvasHeight);
            ctx.lineTo(0, canvasHeight);
            ctx.strokeStyle = '#aaa';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.restore();
        }

        return {
            draw: draw
        }
    }

    var steps = (function () {
        var running = false;
        var steps = [
            function () {

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

    function init(canvas) {
        var ctx = canvas.getContext('2d');

        var scaled = createScaler(canvas.width, canvas.height, 5, 5, ctx);
        var equation = createEquation(scaled);

        steps.init();

        var axes = createAxes(canvas.width, canvas.height, ctx);

        function draw() {
            if (!steps.isRunning()) {
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            axes.draw();
            equation.draw();

            window.requestAnimationFrame(draw);
        }

        window.requestAnimationFrame(draw);
    }

    return {
        init: init,
        hasMoreSteps: steps.hasMoreSteps,
        step: steps.step,
        stop: steps.stop
    };
})();