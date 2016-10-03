window.exponential = window.exponential || {};

window.exponential.graph = function(canvas) {
    
    var ctx = canvas.getContext('2d');
    var iteration;
    
    var scaleX;
    var scaleY;

    var lastTime;
    
    var animateHighlight;
    var currentHighlight;
    
    var g;
    
    var shouldZoom;
    
    function resetAnimation(graphType) {
        g = graphType;
        
        shouldZoom = false;
        animateHighlight=false;
        shouldDrawHightlight = false;
        currentHighlight = g.highlightStart;
        lastTime = null;
        
        iteration = g.maxX / 1000;
        
        scaleX = canvas.width / g.maxX;
        scaleY = canvas.height / g.maxY;
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
    
    function drawHighlight(timestamp, equation) {
        if (currentHighlight > g.highlightEnd) {
            if (animateHighlight) {
                if (!lastTime) lastTime = timestamp;
                var progress = (timestamp - lastTime)/20;
                lastTime = timestamp;
                
                currentHighlight -= (iteration*progress);
            }
        }
        
        inGraph({color: 'blue'}, function(){
            ctx.moveTo(currentHighlight, 0);
            ctx.lineTo(currentHighlight, equation(currentHighlight));
            
            ctx.moveTo(0, equation(currentHighlight));
            ctx.lineTo(currentHighlight, equation(currentHighlight));
        });
    }
        
    function draw(timestamp) {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        
        drawAxes();
        
        inGraph({color: 'red'}, function(){
            ctx.moveTo(0, g.equation(0));
            for(var x = 0 + iteration; x <= g.maxX; x += iteration) {
                g.draw(ctx, x, g.equation(x));
            }
        });
        
        if (shouldDrawHightlight) {
            drawHighlight(timestamp, g.equation);
        }
    }
    
    function activateHighlight() {
        shouldDrawHightlight = true;
    }
    
    function activateHighlightAnimation() {
        animateHighlight = true;
    }
    
    
    return {
        draw: draw,
        resetAnimation: resetAnimation,
        activateHighlight: activateHighlight,
        activateHighlightAnimation: activateHighlightAnimation
    }
};

window.exponential.simple = (function() {
    
    var running = false;
    var graph;
    var steps;
    var currentStep;
    
    function init(current, graphType){
        var $canvas = current.find('canvas')
                .width('100%')
                .prop({width: 500, height: 500});
        $canvas.trigger('resize.deckscale');
        
        graph = exponential.graph($canvas[0]);
        graph.resetAnimation(graphType);
        
        steps=[
            graph.activateHighlight, 
            graph.activateHighlightAnimation,
              ];
        running = true;
        currentStep=0;
        
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
        console.log('Executing %d step: %s', currentStep, currentFunction.toString().substr(0, currentFunction.toString().indexOf('(')));
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
  
