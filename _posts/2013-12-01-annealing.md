---
layout: post
title: "TSP in JavaScript (Simulated Annealing)"
description: ""
category: computer
tags: [javascript, html5, tsp, simulated annealing]
group: post
image: tsp_annealing.png
---
Um meine JavaScript-Kenntnisse zu vertiefen, habe mich daran gemacht einen Graphen aus Knoten und Kanten zu implementieren. Und weil das zu einfach ist, soll darauf das Travelling Salesman Problem gelöst werden :)

An einige Algorithmen dazu konnte ich mich noch ganz gut aus meinem Studium erinnern, aber ehrlich gesagt hatte ich nicht so viel Lust, die alten Unterlagen nochmal herauszukramen. Glücklicherweise konnte ich Inspiration auf dieser [Seite](http://www.theprojectspot.com/tutorial-post/simulated-annealing-algorithm-for-beginners/6) finden. Diese Implementierung muss dann ja nur noch nach JavaScript portiert werden.

Im Kern besteht die Idee darin, paarweise zufällig gewählte Kanten einer Tour zu vertauschen und zu prüfen, ob das Ergebnis besser ist als die bislang beste Tour. Die Wahrscheinlichkeit, dass eine schlechtere Lösung akzeptiert wird (um ein lokales Minimum zu vermeiden) ist direkt abhängig von der "Temperatur".

Ausgangspunkt ist eine zufällige Tour.

```javascript
function acceptanceProbability(energy,
                                newEnergy,
                                temperature) {
    // If the new solution is better, accept it
    if (newEnergy < energy) {
        return 1.0;
    }
    // If the new solution is worse,
    //calculate an acceptance probability
    return Math.exp(
        (energy - newEnergy) / temperature);
}
```

Nach jedem Durchgang verringert sich die Temperatur und wenn sie unter 1 gefallen ist, wird das bis dahin beste Ergebnis akzeptiert, daher "Simulated Annealing" - simulierte Erstarrung.

```javascript
function solve() {
    // Set initial temp
    var temp = 10000,
        // Cooling rate
        coolingRate = 0.001;

    ...

    while (temp > 1) {

        ...

        // Cool system
        temp *= 1 - coolingRate;
    }
}
```

Drumherum schwirrt noch ein ganzer Sack Code, der für die Liste der Punkte, die Berechnung der euklidischen Distanz zwischen zwei Punkten, die aktuelle Tour, ihre Gesamtlänge und noch viel mehr zuständig ist:

```javascript
...
function distanceTo (point, otherPoint) {
    var xDistance = Math.abs(point.x - otherPoint.x),
        yDistance = Math.abs(point.y - otherPoint.y),
        // Skip Math.sqrt - real distance is not
        // important, as long as relative distance
        // is correct. And it's soo slow!
        distance = (xDistance * xDistance)
                + (yDistance * yDistance);

        return distance;
}
...
```

Der ganze Kladderadatsch wird dann mit einem Array von Punkten gefüttert und gestartet:

```javascript
var points = [
    {x: 60, y: 200},
    {x: 180, y: 200},
    {x: 80, y: 180},
    {x: 140, y: 180},
    {x: 20, y: 160},
    {x: 100, y: 160},
    {x: 200, y: 160},
    {x: 140, y: 140},
    {x: 40, y: 120},
    {x: 100, y: 120},
    {x: 180, y: 100},
    {x: 60, y: 80},
    {x: 120, y: 80},
    {x: 180, y: 60},
    {x: 20, y: 40},
    {x: 100, y: 40},
    {x: 200, y: 40},
    {x: 20, y: 20},
    {x: 60, y: 20},
    {x: 160, y: 20}
];

halfdane.tsp.createAnnealing(points).solve();
```

Insgesamt würde ich beim Anschauen des Ergebnisses sagen: ja, es funktioniert, aber mit den paar Punkten hätte ich das auch manuell machen können.

{% image tsp_before.png "Ausgangstour" "p20" %}
Ausgangstour
{% endimage %}

{% image tsp_annealing.png "Ergebnis" "p20" %}
Nach der simulierten Erstarrung
{% endimage %}

Bei größeren Punktmengen wird die Rechenzeit seeehr lang und das Ergebnis ist trotzdem nicht so richtig beeindruckend:



{% image tsp_before1.png "100 Punkte Ausgangstour" "p20" %}
100 Punkte vor dem Durchlauf
{% endimage %}

{% image tsp_annealing1.png "100 Punkte Ergebnis" "p20" %}
Die Ergebnistour
{% endimage %}

... und das waren nur 100 Punkte. Ich wollte eigentlich eher 20-mal so viele. Und das soll auf einem Handy laufen, nicht auf einer Workstation :/ Tja, nicht umsonst gehört das TSP zu der Klasse der echt richtig schwierigen Probleme (ja, das ist nicht der richtige Name - verklag' mich).