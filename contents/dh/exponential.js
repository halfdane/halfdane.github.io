window.exponential = window.exponential || {};

window.exponential.graph = function(canvas) {
    
    var ctx = canvas.getContext('2d');
    var minX = 0;
    var minY = 0;
    var maxX = 5;
    var maxY = 100000;
    
    var iteration = (maxX - minX) / 1000;
    
    var rangeX = maxX - minX;
    var rangeY = maxY - minY;
    
    var scaleX = canvas.width / rangeX;
    var scaleY = canvas.height / rangeY;
    
    var animateHighlight;
    var highlightStart=4;
    var highlightEnd=3.5;
    var currentHighlight;
    
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
    
    function draw(equation) {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        
        drawAxes();
        
        inGraph({color: 'red'}, function(){
            ctx.moveTo(minX, equation(minX));
            for(var x = minX + iteration; x <= maxX; x += iteration) {
                ctx.lineTo(x, equation(x));
            }
        });
        
        if (animateHighlight && currentHighlight > highlightEnd) {
            currentHighlight -= iteration;
        }
        
        inGraph({color: 'blue'}, function(){
            ctx.moveTo(currentHighlight, 0);
            ctx.lineTo(currentHighlight, equation(currentHighlight));
            
            ctx.moveTo(0, equation(currentHighlight));
            ctx.lineTo(currentHighlight, equation(currentHighlight));
        });

        
    }
    
    function activateHighlightAnimation() {
        animateHighlight = true;
    }
    
    function resetAnimation() {
        animateHighlight=false;
        currentHighlight = highlightStart;
    }
    
    return {
        draw: draw,
        resetAnimation: resetAnimation,
        activateHighlightAnimation: activateHighlightAnimation
    }
};

window.exponential.simple = (function() {
    
    var running = false;
    var graph;
    var steps;
    var currentStep=0;
    
    function init(current){
        
        var $canvas = current.find('canvas')
                .width('100%')
                .prop({width: 500, height: 500});
        $canvas.trigger('resize.deckscale');
        
        
        graph = exponential.graph($canvas[0]);
        steps=[graph.activateHighlightAnimation]
    }
    
    function start() {
        running = true;
        graph.resetAnimation();
        window.requestAnimationFrame(draw);
    }
    
    function stop() {
        running = false;
    }
    
    function moreSteps() {
        return currentStep < steps.length;
    }
    
    function step() {
        steps[currentStep++]();
    }

    function draw(timestamp) {
        if (!running) {
            return;
        }
        
        graph.draw(function equation(x) {
            return Math.pow(17, x);
        });

        window.requestAnimationFrame(draw);
    }

    return {
        init: init,
        moreSteps: moreSteps,
        step: step,
        start: start,
        stop: stop
    };
})();
  
