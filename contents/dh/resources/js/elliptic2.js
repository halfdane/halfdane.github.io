'use strict';

window.dh = window.dh || {};

window.dh.elliptic2 = (function () {

    var steps = (function () {
        var running = false;

        var objects = {};

        var steps = [
            function () {
                objects.graph = objects.board.create('functiongraph', [objects.ellipticFunction]);
                objects.board.create('functiongraph', [objects.negEllipticFunction]);
            },
            function () {
                var point = objects.board.create('glider', [objects.graph]);
                var q2 = objects.board.create('point', [function () {
                    return point.X() + 0.01;
                },
                    function () {
                        return objects.ellipticFunction(point.X() + 0.01);
                    }], {face: '[]', size: 2});

                objects.board.create('line', [point, q2], {strokeColor: '#ff0000', dash: 2});
            }
        ];
        var currentStep = 0;

        function init(board, ellipticFunction, negEllipticFunction) {
            running = true;
            currentStep = 0;
            objects.board = board;
            objects.ellipticFunction = ellipticFunction;
            objects.negEllipticFunction = negEllipticFunction;
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

    function init(target) {
        var a = -3;
        var b = 3;

        var board = JXG.JSXGraph.initBoard(target.id, {boundingbox: [-10, 10, 10, -10], axis: true});

        var f = function (x) {
            return Math.sqrt(x * x * x + a * x + b);
        };
        var fNeg = function (x) {
            return -f(x);
        };

        steps.init(board, f, fNeg);
    }

    return {
        init: init,
        hasMoreSteps: steps.hasMoreSteps,
        step: steps.step,
        stop: steps.stop
    }
})();