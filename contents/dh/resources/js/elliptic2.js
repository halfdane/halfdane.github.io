'use strict';

window.dh = window.dh || {};

window.dh.elliptic2 = (function () {

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

    function init(target) {
        steps.init();
        var a = -3;
        var b = 3;

        var board = JXG.JSXGraph.initBoard(target.id, {boundingbox: [-10, 10, 10, -10], axis: true});

        var f = function (x) {
            return Math.sqrt(x * x * x + a * x + b);
        };
        var fNeg = function (x) {
            return -f(x);
        };

        board.create('functiongraph', [f]);
        board.create('functiongraph', [fNeg]);


        board = JXG.JSXGraph.initBoard('box2', {boundingbox: [-5, 10, 7, -6], axis: true});

        // var f = function (x) {
        //     return (Math.abs(x));
        // };
        // qf2 = board.create('point', [function () {
        //     return qf.X() + sf.Value();
        // },
        //     function () {
        //         return f(qf.X() + sf.Value());
        //     }], {face: '[]', size: 2});
    }

    return {
        init: init,
        hasMoreSteps: steps.hasMoreSteps,
        step: steps.step,
        stop: steps.stop
    }
})();