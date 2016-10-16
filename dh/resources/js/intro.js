'use strict';

window.dh = window.dh || {};

window.dh.intro = (function () {

    var maxWidth = 500,
            maxHeight = 500;
    var actorWidth = 100;

    var halfWidth = maxWidth / 2;
    var halfHeight = maxHeight / 2;
    var halfActorWidth = actorWidth / 2;

    function activatable(something) {

    }

    var createImages = function (onComplete) {
        var images = [
            'resources/img/sean_connery.jpg',
            'resources/img/m.jpg',
            'resources/img/dr_no.jpg'];
        var imageObjects = [];

        var loaded = 0;

        function onLoad() {
            loaded++;
            if (loaded === images.length) {
                onComplete();
            }
        }

        for (var i = 0; i < images.length; i++) {
            var img = new Image();
            img.addEventListener("load", onLoad);
            img.src = images[i];
            imageObjects.push(img);
        }

        return {
            jb: imageObjects[0],
            m: imageObjects[1],
            no: imageObjects[2]
        }
    };

    var createActor = function (ctx, x, y, image) {
        var width = 100,
                height = image.height * (width / image.width),
                active = false;

        function draw() {
            if (active) {
                ctx.drawImage(image, x, y, width, height);
            }
        }

        function activate() {
            console.log('Activating', image.src);
            active = true;
        }

        function deactivate() {
            active = false;
        }

        return {
            draw: draw,
            activate: activate,
            deactivate: deactivate
        };
    };

    var createMessage = function (ctx, x, y) {
        var active = false,
                targetX = x,
                step = 1,
                moveFurther = function () {
                    return false;
                };

        function draw(progress) {
            if (active) {
                if (moveFurther(x)) {
                    x += progress * step;
                }

                ctx.font = "48px serif";
                ctx.fillText("7626", x, y);
            }
        }

        function activate() {
            console.log('Activating message');
            active = true;
        }

        function deactivate() {
            active = false;
        }

        function calcStep() {
            step = (targetX - x) / 500;
            if (targetX > x) {
                moveFurther = function (x) {
                    return x < targetX
                };
            } else {
                moveFurther = function (x) {
                    return x > targetX
                };
            }
        }

        function moveToHalf() {
            targetX = halfWidth - halfActorWidth;
            calcStep();
        }

        function moveToFull() {
            targetX = maxWidth - actorWidth-10;
            calcStep();
        }

        return {
            draw: draw,
            activate: activate,
            deactivate: deactivate,
            moveToHalf: moveToHalf,
            moveToFull: moveToFull
        };
    };

    var createProtocol = function(ctx, y) {
        var active = false;

        function draw() {
            if (active) {
                ctx.beginPath();
                ctx.moveTo(actorWidth, y+5);
                ctx.lineTo(maxWidth - actorWidth, y+5);
                ctx.stroke();
            }
        }

        function activate() {
            console.log('Activating protocol');
            active = true;
        }

        function deactivate() {
            active = false;
        }

        return {
            draw: draw,
            activate: activate,
            deactivate: deactivate
        };
    };

    var steps = (function () {

        var running = false;
        var steps;
        var currentStep = 0;

        function init(client, server, intruder,
                      message, protocol) {
            running = true;
            currentStep = 0;

            steps = [
                message.activate,
                server.activate,
                protocol.activate,
                message.moveToHalf,
                message.moveToFull,
                message.moveToHalf,
                intruder.activate,
            ];
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

        var images = createImages(function () {
            window.requestAnimationFrame(draw);
        });

        var client = createActor(ctx, 0, 200, images.jb);
        client.activate();
        var server = createActor(ctx, maxWidth - actorWidth, 200, images.m);
        var intruder = createActor(ctx, halfWidth - halfActorWidth, 300, images.no);
        var message = createMessage(ctx, 0, 180);

        var protocol = createProtocol(ctx, 180);

        steps.init(client, server, intruder, message, protocol);

        var lastTime;
        var progress;

        function draw(currentTime) {
            if (!steps.isRunning()) {
                return;
            }

            if (!lastTime) {
                lastTime = currentTime;
            }

            progress = (currentTime - lastTime);
            lastTime = currentTime;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            client.draw(progress);
            server.draw(progress);
            intruder.draw(progress);
            message.draw(progress);
            protocol.draw(progress);

            window.requestAnimationFrame(draw);
        }

    }

    return {
        init: init,
        hasMoreSteps: steps.hasMoreSteps,
        step: steps.step,
        stop: steps.stop
    };
})();
  
