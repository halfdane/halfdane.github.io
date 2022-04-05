---
title: "TSP in JavaScript (Greedy)"
categories:
- Javascript
tags: [javascript, tsp, greedy algorithm, momo]
image: /assets/images/tsp_greedy.png
resources: [/assets/js/tsp/delaunay.js, /assets/js/tsp/tspBase.js, /assets/js/tsp/nearestNeighbourTsp.js]
series: js-tsp
---
Jetzt hab ich die Nase voll! Diese ganzen randomisierten Näherungsalgorithmen stinken doch: die Implementierung ist umständlich, die Laufzeit katastrophal und das Ergebnis eher so mittelgut. Dabei ist mir die Qualität der Tour nicht mal so wichtig. Zeit für ein bisschen Gier! Ich brauche Beppo Straßenkehrer. 

Die lange, unverständliche Erklärung zum Traveling Salesman Problem gibt's immer noch bei Wikipedia und immer noch finde ich meine besser:

>
Für das TSP werden eine Reihe von Punkten (z.B. Städte auf einer Landkarte, können aber auch dreidimensional sein) sortiert. Aber nicht einfach irgendwie, sondern so dass beim Durchgehen der Punkte von einem zum nächsten die zurückgelegte Strecke möglichst kurz ist. Wie ein Handelsreisender, der Benzin sparen möchte, daher der Name. Das Problem ist für die Informatik interessant, weil es überraschend schwer ist, es optimal zu lösen. Ein Computer muss bei jedem einzelnen Punkt nämlich erstmal alle anderen Punkte prüfen und schauen, wo der neue an besten hinpasst. Bei vielen Punkten kann die Rechenzeit für eine optimale Lösung mehr Zeit in Anspruch nehmen, als z.B. das Universum existiert. Die Klasse der Probleme, zu der das TSP gehört wird von Profis daher auch "die echt richtig schweren Probleme" genannt. Allerdings ist das Problem nicht nur rein akademisch, sondern unter anderem für Logistik-Unternehmen relevant, also für den Post- oder Hermesboten oder für Containerschiffe. Die benutzen für ihre Tourenoptimierung dann keine optimalen Lösungen (keine Zeit), sondern Annäherungen, die "gut genug" sind. Und da gibt es einen ganzen Sack von Strategien, die ausgesprochen spannend sind - natürlich für eine ganz persönliche Definition von "spannend" :-D


## Gieriger Beppo 
Ein Greedy (gieriger) Algorithmus versucht erst gar nicht so clever zu sein wie z.B. Simulated Annealing oder evolutionäre Strategien. Man geht den Problemraum einfach Schritt für Schritt durch und wählt immer nur den gerade für den aktuellen Punkt besten nächsten Schritt. Dabei schaut man sich nicht um oder versucht einen Überblick übers große Ganze zu bekommen, sondern bewegt sich wie [Beppo Straßenkehrer in Momo](http://de.wikipedia.org/wiki/Momo_%28Roman%29#Personen) Besenstrich um Besenstrich vorwärts. Am Ende ist die ganze Straße gefegt und man hat sich nicht mal angestrengt.

Es ist offensichtlich, dass man sich auf diese Weise höchstens eine gerade Straße entlang bewegen kann, während man sich in einem Labyrinth wie dem TSP (ein Gewirr von Städten und Straßen) leicht verzettelt, aber so lange Beppo irgendwie durchkommt ist ihm das eigentlich egal.

## Beppo on the road 
Beim TSP fängt Beppo mit einer beliebigen Stadt an und wählt dann eine nächstgelegene, die noch nicht besucht wurde. Von da aus nimmt er dann wieder die nächstgelegene, unbesuchte Stadt und so weiter. Zum Glück kann er mit dieser Strategie vielleicht nicht die beste (oder auch nur eine gute) Lösung finden, aber immerhin gibt's am Ende überhaupt eine Tour. Und zwar schnell. 

Diese erste, etwas naive Strategie hat mir aber klar gemacht, dass ich mich doch auch ein bisschen für die Qualität der Lösung interessiere. Zumindest möchte ich kein völlig chaotisches Gekrakel, sonst könnte ich mir die Mühe auch sparen und einfach eine völlig zufällige Tour nehmen. Obwohl die wahrscheinlich _noch_  schlechter wäre :-)  

Und soo schnell war's jetzt echt auch nicht. 

## Die Paten
The Godfathers of TSP-Optimierung sind vermutlich Lin und Kernighan, die einen nach ihnen benannten Algorithmus entworfen haben um eine nicht so gute Lösung in eine bessere Lösung zu überführen. Völlig unverständlich ist das natürlich auch bei [Wikipedia](http://de.wikipedia.org/wiki/Kernighan-Lin-Algorithmus) nachlesbar, aber eigentlich werden nur die Städte der Tour immer paarweise vertauscht. Dabei wird jedesmal geschaut, ob's besser geworden ist. Variationen davon, die auch immer eigene Namen haben, vertauschen drei oder mehr Strecken, aber ich hab's mir einfach gemacht:

```javascript
for (i = 0; i < tour.tourSize(); i += 1) {
    // consecutively swap cities around
    for (ii = i; ii < tour.tourSize(); ii += 1) {
        if (ii === i) {
            continue;
        }

        var newSolution = createTour().usingCities(tour.tour);

        // Swap two cities
        newSolution.setCity(ii, newSolution.getCity(i));
        newSolution.setCity(i, newSolution.getCity(ii));

        // Decide if we should accept the neighbour
        if (tour.getDistance() > newSolution.getDistance()) {
            tour = newSolution;
        }
    }
}
```

Der ohnehin etwas schnarchige Beppo Straßenkehrer ist durch diese anschließende Optimierung natürlich total lahmarschig geworden, aber immerhin sieht die Tour deutlich besser aus. Wenn nicht noch eine clevere Idee um die Ecke kommt, würde ich wohl dabei bleiben.

Glück gehabt, mir ist noch etwas eingefallen. Das ist zwar etwas unkonventionell (lies: ich habe während des Studiums nichts davon gehört), aber das muss ja nichts heißen. Mein Beppo braucht vor allem so viel Zeit, weil er in jeder neuen Stadt erstmal die Entfernung zu allen verbleibenden Städten berechnen muss. Ein Computer ist halt doch kein Mensch wie Beppo, der auf einen Blick sieht, welches die nächsten Städte sind. Es würde helfen, wenn er nicht immer alle Städte begutachten müsste, sondern nur ein paar. 

## Beppo meets Delaunay 
Für meine Diplomarbeit habe ich mich recht intensiv mit Dreicks- und Vierecksgittern beschäftigt, und auch wenn ich das meiste schon vergessen habe, kann ich mich noch daran erinnern, dass die Delaunay-Triangulierung immer drei Punkte zusammenfasst, sodass im entstehenden Dreieck keine weiteren Punkte mehr sind. Die Punkte jedes Dreiecks sind einander also am nächsten. Und das Beste daran ist, dass man diese Triangulierung gut (schnell) berechnen kann. 

Statt in einer ungeordneten Punktmenge lasse ich meinen Beppo also mal auf so einem Dreiecksgitter los: dann muss er nicht mehr alle Städte betrachten, sondern nur diejenigen, mit denen er über eine Dreieckskante verbunden ist. Dabei kann er auch sicher sein, dass es immer die nächstgelegenen Städte sind, denn das garantiert die Delaunay-Triangulierung. 

Im Internet gibt's ja echt alles und so musste ich nicht lange suchen, um eine [Implementierung in Javascript](https://github.com/ironwallaby/delaunay) zu finden und lo and behold: da konnte mein Beppo aber flitzen. Und sieht gut dabei aus! Ganz ohne Lin-Kernighan.

Natürlich kann es immer noch passieren, dass Beppo sich in einen Bereich von Dreiecken begibt, aus dem es keinen einfachen Ausweg gibt, weil alle ausgehenden Kanten zu nächstgelegenen Städten schon benutzt sind. Der Einfachheit halber wählt Beppo dann irgendeine andere unbesuchte Stadt, ohne auf die Entfernung zu achten.

Dazu werden erst einmal die Punkte aller Dreiecke in Nachbarschaftsbeziehung gesetzt:

```javascript
function createPointMap(triangles) {
    var map = {};

    /* SNIP */

    function addPointAsProperty(point, triangle, map) {
        if (!map[point]) {
            //Array der benachbarten Punkte initialisieren
            map[point] = [];
        }
        if ((triangle.a.x !== point.x || triangle.a.y !== point.y)) {
            // triangle.a ist ein benachbarter Punkt:
            map[point].push(triangle.a);
        }
        if ((triangle.b.x !== point.x || triangle.b.y !== point.y)) {
            // triangle.b ist ein benachbarter Punkt:
            map[point].push(triangle.b);
        }
        if ((triangle.c.x !== point.x || triangle.c.y !== point.y)) {
            // triangle.c ist ein benachbarter Punkt:
            map[point].push(triangle.c);
        }
    }

    $(triangles).each(function (index, triangle) {
        addPointAsProperty(triangle.a, triangle, map);
        addPointAsProperty(triangle.b, triangle, map);
        addPointAsProperty(triangle.c, triangle, map);
    });

    return map;
}
```

Mit Hilfe dieser Nachbarschaftsbeziehungen kann Beppo sich entlang der Dreieckskanten durch alle verfügbaren Städte bewegen:

```javascript
while (true) {
    var currentEndpoints = pointmap[currentPoint],
        nearest = maxTripSentry,
        p2 = undefined;

    // die aktuelle Stadt steht nicht mehr zum Besuch zur Verfügung
    delete pointmap[currentPoint];

    // wähle den dichtesten Dreiecks-Nachbarn
    $(currentEndpoints).each(function (index, point) {
        var d = currentPoint.distanceTo(point);
        if (pointmap.hasEndpoints(point) && d < nearest) {
            p2 = point;
            nearest = d;
        }
    });

    // Wenn kein Dreiecksnachbar mehr da ist, wähle irgendeine dichteste Stadt
    if (!p2) {
        $(pointmap.allPoints()).each(function (index, pointname) {
            $(pointmap.endpointsFromString(pointname)).each(function (index, point) {
                var d = currentPoint.distanceTo(point);
                if (pointmap.hasEndpoints(point) && d < nearest) {
                    p2 = point;
                    nearest = d;
                }
            });
        });
    }

    // Wenn gar keine Städte mehr übrig sind, ist die Tour fertig
    if (!p2) {
        return tourPoints;
    }

    // Die gefundene nächste Stadt gehört zur Tour
    tourPoints.push(p2);

    // von dort aus geht's weiter
    currentPoint = p2;
}

return tourPoints;

```

## Beppo ist der beste 
Auch tausend und mehr Städte bringen ihn nicht zum Schwitzen und das Ergebnis ist gut genug für meine Zwecke. Diesen Beppo ziehe ich jederzeit so aufgeblasenen Gesellen wie dem Annealing oder dem Evolutionary vor. 

Als Beweis habe ich wie immer eine kleine Demo vorbereitet, nur diesmal nicht mit 20 Punkten, sondern mit 200,die zufällig gesetzt werden. Bei dieser Menge hätten die andern schon längst die Waffen gestreckt, aber nicht der Beppo :-) 

<div>
<label for="#pointsCount">Anzahl der Punkte</label><input id="pointsCount" value="200"/>
</div>
<span class="target"></span>
<span class="btn" onclick="halfdane.tsp.greedyTest($('#pointsCount').val()); return false;">Click zum Start</span>