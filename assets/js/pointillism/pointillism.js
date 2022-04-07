var halfdane = halfdane || {};
halfdane.pointilism = {};

var amountOfGeneratedPoints = 2000,
    generateTsp = true,
    pointMovingProbability = 0.5;

halfdane.pointilism.presenter = (function () {
    'use strict';

    var presenter = {},
        view;

    function imageDataAvailable(imgData, createNewContext) {
        view.setContextCreator(createNewContext);

        halfdane.normalizeLuminosity(imgData);
        // create initial set of points
        var points = halfdane.generateRandomPointset(imgData, amountOfGeneratedPoints);
        view.drawPoints(points);

        points = halfdane.moveToDarkness(imgData, points);
        points = halfdane.removeDoublesFromPointset(points);
        view.drawPoints(points);
    }

    presenter.init = function (domBasedView, canvasView) {
        view = canvasView;
        domBasedView.init(imageDataAvailable);
    };

    return presenter;
}());

function luminosity(imgData, index) {
    'use strict';
    var red = imgData.data[index],
        green = imgData.data[index + 1],
        blue = imgData.data[index + 2],
        alpha = imgData.data[index + 3];

    return (0.299 * red + 0.587 * green + 0.114 * blue) + (255 - alpha);
}

function luminosityAt(imgData, x, y) {
    'use strict';
    return luminosity(imgData, (y * imgData.width + x) * 4);
}

halfdane.generateRandomPointset = function (imgData, expectedPointAmount) {
    'use strict';

    var pointsMap = {},
        points = [],
        x,
        y,
        pointCounter = 0;

    function isNewPoint(pointsMap) {
        if (pointsMap[x + '_' + y] === undefined) {
            pointsMap[x + '_' + y] = 1;
            return true;
        }
        return false;
    }

    while (pointCounter < expectedPointAmount) {
        var index = Math.floor(Math.random() * imgData.data.length / 4);
        var l = luminosity(imgData, index * 4);
        if (l < Math.random() * 255) {
            x = index % imgData.width;
            y = Math.floor(index / imgData.width);

            if (isNewPoint(pointsMap)) {
                points[pointCounter] = {x: x, y: y, luminosity: l};
                pointCounter++;
            }
        }
    }

    return points;
};

halfdane.moveToDarkness = function (imgData, givenPoints) {
    return $(givenPoints).map(function (index, point) {
        var kx, ky,
            newX = point.x,
            newY = point.y,
            newLuminosity = luminosityAt(imgData, newX, newY),
            otherLuminosity = 300,
            radius = 2;

        for (kx = -radius; kx < radius; kx += 1) {
            for (ky = -radius; ky < radius; ky += 1) {
                otherLuminosity = luminosityAt(imgData, newX + kx, newY + ky);
                if (otherLuminosity < newLuminosity
                    && Math.random() < pointMovingProbability) {
                    newLuminosity = otherLuminosity;
                    newX += kx;
                    newY += ky;
                }
            }
        }

        return {x: newX, y: newY, luminosity: newLuminosity};
    });
};

halfdane.removeDoublesFromPointset = function (points) {
    'use strict';
    console.log(points.length);
    var pointsMap = {};
    points = $.grep(points, function (point) {
        if (!pointsMap[point.x + "_" + point.y]) {
            pointsMap[point.x + "_" + point.y] = 1;
            return true;
        }
        return false;
    });
    console.log(points.length);
    return points;
};

halfdane.normalizeLuminosity = function (imgData) {
    function setPixel(imgData, pixel, value) {
        imgData.data[pixel] = value;
        imgData.data[pixel + 1] = value;
        imgData.data[pixel + 2] = value;
        imgData.data[pixel + 3] = 255;
    }

    var i,
        min = 300,
        max = -1,
        l;
    for (i = 0; i < imgData.data.length; i += 4) {
        l = luminosity(imgData, i);
        min = (l < min) ? l : min;
        max = (l > max) ? l : max;
    }
    var factor = (255 / (max - min));
    for (i = 0; i < imgData.data.length; i += 4) {
        l = ( luminosity(imgData, i) - min) * factor;
        setPixel(imgData, i, l);
    }
    return imgData;
};

halfdane.pointilism.view = (function () {
    'use strict';

    var view = {},
        createContext;

    view.setContextCreator = function (contextCreator) {
        createContext = contextCreator;
    };

    view.drawImage = function (imgData) {
        var context = createContext();
        context.putImageData(imgData, 0, 0);
    };

    view.drawPoints = function (points) {
        var context = createContext();
        $(points).each(function (index, point) {
            context.fillStyle = "black";
            context.beginPath();
            context.arc(point.x, point.y, (280-point.luminosity)/halfdane.pointilism.pointFactor, 0, 2 * Math.PI, false);
            context.closePath();
            context.fill();
        });
    };

    return view;
}());

halfdane.pointilism.domBasedView = (function () {
    'use strict';

    var view = {},
        imageDataHandler;

    view.canvasFactory = function(target, width, height) {
        return function () {
            return $('<canvas></canvas>')
                .attr('height', height)
                .attr('width', width)
                .appendTo(target)
                [0]
                .getContext('2d');
        };
    };

    function createOnImageLoad(target) {
        return function () {
            var $imageObject = $(this),
                imageObject = $imageObject[0],
                imageHeight = imageObject.height || $imageObject.height(),
                imageWidth = imageObject.width || $imageObject.width(),
                height = target.height(),
                width = (height / imageHeight) * imageWidth,
                contextCreator = view.canvasFactory(target, width, height),
                context = contextCreator();

            halfdane.pointilism.pointFactor = 30000/height;

            context.drawImage(imageObject, 0, 0, width, height);
            imageDataHandler(context.getImageData(0, 0, width, height), contextCreator);
        };
    }

    function loadSelectedImageAndTriggerOnload(evt) {
        var file = evt.target.files[0];

        if (!file.type.match('image.*')) {
            alert('DIE!');
            return;
        }

        var reader = new FileReader();
        reader.onload = function (loadEvent) {
            var imageObj = new Image();
            imageObj.onload = createOnImageLoad($('.manualInput .target'));
            imageObj.src = loadEvent.target.result;
        };
        reader.readAsDataURL(file);
    }

    function registerManualInputs() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            $('.manualInput #file').on('change', loadSelectedImageAndTriggerOnload);
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
    }

    function runAutomaticInputs() {
        $('.automaticInput img').each(function (index, img) {
            var imageObj = $(img);
            createOnImageLoad($('.automaticInput .target')).call(imageObj);
        });
    }

    view.init = function (imageDataAvailable) {
        imageDataHandler = imageDataAvailable;
        registerManualInputs();
        runAutomaticInputs();
    };

    return view;
}());

var waitForJQuery = setInterval(function () {
    if (typeof $ != 'undefined') {

        $(function () {
            halfdane.pointilism.presenter.init(halfdane.pointilism.domBasedView, halfdane.pointilism.view);
        });

        clearInterval(waitForJQuery);
    }
}, 10);
