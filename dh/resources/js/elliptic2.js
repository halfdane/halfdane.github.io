'use strict';

window.dh = window.dh || {};

window.dh.elliptic2 = (function () {

    var a = -3;
    var b = 3;

    var stepper = createStepper();

    function f(x) {
        return Math.sqrt(x * x * x + a * x + b);
    }

    function inverseF(x) {
        return -f(x);
    }

    function init(target) {
        var board = JXG.JSXGraph.initBoard(target.id, {
            boundingbox: [-10, 10, 10, -10],
            axis: true,
            showCopyright: false
        });

        var graph = board.create('functiongraph', [f]);
        var graph2 = board.create('functiongraph', [inverseF]);

        var tangent;


        var steps = [
            function () {
                var point = board.create('glider', [graph]);
                tangent = board.create('tangent', [point], {strokeColor: '#ff0000', dash: 2});
            },
            function () {
                board.create('intersection', [graph, tangent, 0]);
                board.create('intersection', [graph2, tangent, 0]);
            }
        ];

        stepper.use(steps);
    }

    return {
        init: init,
        hasMoreSteps: stepper.hasMoreSteps,
        step: stepper.step,
        stop: stepper.stop
    }
})();