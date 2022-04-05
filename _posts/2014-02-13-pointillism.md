---
title: "Pointillismus in Javascript"
categories:
- javascript
tags: [javascript, graphic, canvas]
image: /assets/images/pointillism1.png
resources: [/assets/js/pointillism/pointillism.js]
---
Bei meinen Experimenten mit dem Traveling Salesman Problem (Simulated Annealing, Evolutionary und Greedy mit Einsprengseln von Lin-Kernighan/Beppo Straßenkehrer) bin ich für die Anzeige der Graphen immer mal wieder am `canvas` Element vorbeigekommen und habe jetzt eine Ausrede gefunden, mich intensiver damit zu beschäftigen: automatischer Pointillismus.

{% include figure image_path="/assets/images/http://www.artschoolvets.com/news/wp-content/uploads/2011/12/cochran_graffiti_04.jpg" alt="Moderner Pointillismus von James Cochran" caption="Moderner Pointillismus von [James Cochran](http://www.artschoolvets.com/news/2011/12/13/james-cochran-pointillismus-aus-der-spraydose/)" %}

Pointillismus ist die Kunstform, bei der ein Künstler Bilder aus einzelnen Punkten konstruiert. Diese Punkte werden häufig so gesetzt, dass z.B. möglichst wenige oder große eine so starke Ausdruckskraft haben, das Motiv aber dennoch erkennbar ist.
Industriell findet der Pointillismus seine Anwendung bei der Rasterung von Bildern, unter anderem als Vorstufe für den Druck in Zeitungen. 

Die Rasterung von analogen Bildern für den analogen Druck ist wohlbekannt und erprobt. Algorithmen für digitale Rasterung hingegen sind offenbar nicht Gegenstand intensiver Forschung.
Genau genommen habe ich zu den Thema überhaupt nur zwei Veröffentlichungen gefunden - vermutlich kommen bei Zeitungen und Magazinen proprietäre (lies: unveröffentlichte) Algorithmen zum Einsatz.

Die erste Veröffentlichung, ["Stippling"](http://roberthodgin.com/stippling/), ist ein globaler Ansatz, der die Punkte als magnetische Kugeln in einem Magnetfeld betrachtet. Die Stärke des Feldes hängt vom ursprünglichen Bild ab, so dass besonders viele Kugeln zu den dunklen Stellen gezogen werden. Verfeinerungen dieser Idee ändern auch für die Größe der Punkte abhängig vom Bild, oder sorgen dafür, dass die Kugeln sich gegenseitig abstoßen, damit nicht zu viele auf einer Stelle enden.
Obwohl die Implementierung sicherlich ziemlich reizvoll wäre, bin ich letztlich vor der Laufzeit der globalen Kontrolle aller Punkte zurückgeschreckt - das hört sich alles sehr aufwändig und langsam an. Vielleicht mach ich das ja ein anderes mal.

Die andere Veröffentlichung, ["Weighted Voronoi Stippling"](http://mrl.nyu.edu/~ajsecord/stipples.html), beschäftigt sich mit der Idee ein Gitternetz über dem Bild aufzuspannen und die Knoten Stück für Stück in dunklere Bereiche des Bildes zu verschieben, so dass sich dort die Knoten sammeln. Die Pointillismus-Punkte befinden sich natürlich letztlich an den Knoten. (Genau genommen befinden sie sich im Mittelpunkt der Voronoi-Areale, aber da das genau die Knoten einer Delaunay-Triangulation sind, passt das schon.) Auch hiervor bin ich zurückgeschreckt, wegen des Implementierungsaufwands. Diese spezielle Art von Gitternetz ist überhaupt nicht mein Ding :-)

Ich habe mich für eine dritte Variante entschieden, die zwar nicht ganz so gute Ergebnisse liefert wie die Gitternetz-Version, dafür aber schneller ist und nicht annähernd die algorithmische Komplexität hat.
Soweit ich weiß, gibt es bislang noch keine Veröffentlichung dieser Variante, also handelt es sich was mich angeht um meine eigene Erfindung (yay \o/,  mein erster eigener Algorithmus - vielleicht nenne ich ihn Hinnerk).

## Beschreibung
Eine beliebige Menge von Punkten wird zufällig verteilt, wobei dunklere Bereiche des Bildes bevorzugt werden. Doppelte Punkte werden durch die `pointsMap` verhindert:

```javascript
function luminosity(imgData, index) {
    var red = imgData.data[index],
        green = imgData.data[index + 1],
        blue = imgData.data[index + 2],
        alpha = imgData.data[index + 3];

    /*@see: http://en.wikipedia.org/wiki/Luminosity#Computer_graphics */
    return (0.299 * red + 0.587 * green + 0.114 * blue) + (255 - alpha);
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
```

Um klarere Konturen zu bekommen, kann in einem vorhergehenden Schritt der Kontrast erhöht werden oder andere Effekte wie Embossing zum Einsatz kommen. Bei meinen Bildern reichte bislang aber der Kontrast. 

Bis zu diesem Punkt orientiert sich das Vorgehen an dem in ["Weighted Voronoi Stippling"](http://mrl.nyu.edu/~ajsecord/stipples.html) vorgestellten, aber anstatt die generierten Punkte als Eingabe für ein Voronoi-Gitter zu nutzen und das dann zu glätten, benutze ich eine einfache, modifizierte Kantenerkennung mit einer vergrößerten Matrix.
Damit werden Punkte mit einer gewissen Wahrscheinlichkeit in einen dunkleren Bereich verschoben, so dass sie sich dort sammeln:

```javascript
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
```


## Ergebnis
Das Ergebnis kann sich sehen lassen und die Implementierung ist nicht annähernd so komplex wie die beiden anderen :-)
Richtig gelungen sind die Bilder dann, wenn die Größe der Punkte abhängig von der Dunkelheit des Ausgangsbildes gewählt wird:

{% include figure image_path="/assets/images/pointillism1.png" alt="Vogel" caption="" %}
{% include figure image_path="/assets/images/pointillism3.png" alt="Kofd" caption="" %}
{% include figure image_path="/assets/images/pointillism4.png" alt="noch ein kopf" caption="" %}

Drumherum schwirrt noch ein bisschen Logik, um ein Bild ins Dokument zu laden und Canvas-Elemente zu erzeugen, aber das wars schon.

<style>
    .imageRow img {
        height: 300px;
    }

    .imageRow .target {
        min-height: 300px;
    }

    .imageRow canvas {
        max-height: 300px;
    }

    .imageRow canvas:nth-of-type(3n+2) {
        display: none;
    }

    .automaticInput .imageRow canvas:nth-of-type(1) {
        display: none;
    }
</style>

Wie immer hier eine Live-Demo:
<div class="automaticInput">
    <div class="imageRow">
        <div class="target">
            <img src="/assets/img/iris2.jpg"/>
        </div>
    </div>
</div>

Und mit der Möglichkeit, ein eigenes Bild zu nutzen:
<div class="manualInput">
    <input type="file" id="file" name="file" />
    <div class="imageRow">
        <div class="target"></div>
    </div>
</div>

Der Code ist selbstverständlich auch wieder [frei](/about.html#license) verfügbar:
[pointillism.js](/assets/js/pointillism/pointillism.js)


