---
layout: post
title: "Pointillismus in Javascript "
description: ""
category: javascript
tags: [javascript, graphic, canvas]
group: post
image: img_manipulation.png
---
Bei meinen Experimenten mit dem Traveling Salesman Problem (Simulated Annealing, Evolutionary und Greedy mit Einsprengseln von Lin-Kernighan/Beppo Straßenkehrer) bin ich für die Anzeige der Graphen immer mal wieder am `canvas` Element vorbeigekommen und habe jetzt eine Ausrede gefunden, mich intensiver damit zu beschäftigen: automatischer Pointillismus.

{% image http://www.artschoolvets.com/news/wp-content/uploads/2011/12/cochran_graffiti_04.jpg "Moderner Pointillismus von James Cochran" %}
Moderner Pointillismus von [James Cochran](http://www.artschoolvets.com/news/2011/12/13/james-cochran-pointillismus-aus-der-spraydose/)
{% endimage %}

Pointillismus ist die Kunstform, bei der ein Künstler Bilder aus einzelnen Punkten konstruiert. Diese Punkte werden häufig so gesetzt, dass z.B. möglichst wenige oder große eine so starke Ausdruckskraft haben, das Motiv aber dennoch erkennbar ist.
Industriell findet der Pointillismus seine Anwendung bei der Rasterung von Bildern, unter anderem als Vorstufe für den Druck in Zeitungen. 

Die Rasterung von analogen Bildern für den analogen Druck ist wohlbekannt und erprobt. Algorithmen für digitale Rasterung hingegen sind offenbar nicht Gegenstand intensiver Forschung.
Genau genommen habe ich zu den Thema überhaupt nur zwei Veröffentlichungen gefunden - vermutlich kommen bei Zeitungen und Magazinen proprietäre (lies: unveröffentlichte) Algorithmen zum Einsatz.

Die erste Veröffentlichung, [Stippling](http://roberthodgin.com/stippling/), ist ein globaler Ansatz, der die Punkte als magnetische Kugeln in einem Magnetfeld betrachtet. Die Stärke des Feldes hängt vom ursprünglichen Bild ab, so dass besonders viele Kugeln zu den dunklen Stellen gezogen werden. Verfeinerungen dieser Idee ändern auch für die Größe der Punkte abhängig vom Bild, oder sorgen dafür, dass die Kugeln sich gegenseitig abstoßen, damit nicht zu viele auf einer Stelle enden.
Obwohl die Implementierung sicherlich ziemlich reizvoll wäre, bin ich letztlich vor der Laufzeit der globalen Kontrolle aller Punkte zurückgeschreckt - das hört sich alles sehr aufwändig und langsam an. Vielleicht mach ich das ja ein anderes mal.

Die andere Veröffentlichung, [Weighted Voronoi Stippling](http://mrl.nyu.edu/~ajsecord/stipples.html), beschäftigt sich mit der Idee ein Gitternetz über dem Bild aufzuspannen und die Knoten Stück für Stück in dunklere Bereiche des Bildes zu verschieben, so dass sich dort die Knoten sammeln. Die Pointillismus-Punkte befinden sich natürlich letztlich an den Knoten. (Genau genommen befinden sie sich im Mittelpunkt der Voronoi-Areale, aber da das genau die Knoten einer Delaunay-Triangulation sind, passt das schon.) Auch hiervor bin ich zurückgeschreckt, wegen des Implementierungsaufwands. Diese spezielle Art von Gitternetz ist überhaupt nicht mein Ding :-)

Ich habe mich für eine dritte Variante entschieden, die zwar nicht ganz so gute Ergebnisse liefert wie die Gitternetz-Version, dafür aber schneller ist und nicht annähernd die algorithmische Komplexität hat.
Soweit ich weiß, gibt es bislang noch keine Veröffentlichung dieser Variante, also handelt es sich was mich angeht um meine eigene Erfindung (yay \o/,  mein erster eigener Algorithmus - ich nenne ihn Hinnerk).

## Beschreibung
Eine beliebige Menge von Punkten wird zufällig verteilt, wobei dunklere Bereiche des Bildes bevorzugt werden :

CODE 

Um klarere Konturen zu bekommen, kann in einem vorhergehenden Schritt der Kontrast erhöht werden oder andere Effekte wie Embossing zum Einsatz kommen. Bei meinen Bildern reichte bislang aber der Kontrast. 

Bis zu diesem Punkt orientiert sich das Vorgehen an dem in ZWEI vorgestellten, aber anstatt die generierten Punkte als Eingabe für ein Voronoi-Gitter zu nutzen und das dann zu glätten, benutze ich eine einfache, modifizierte Kantenerkennung mit einem vergrößerten Kernel :

CODE 

Das Ergebnis kann sich sehen lassen und die Implementierung ist nicht annähernd so komplex wie die beiden anderen :-)

## Ergebnis
Richtig gelungen sind die Bilder dann, wenn die Größe der Punkte abhängig von der Dunkelheit des Ausgangsbildes gewählt wird:

BILDER 

Drumherum schwirrt noch ein bisschen Logik, um ein Bild ins Dokument zu laden und Canvas-Elemente zu erzeugen, aber das wars schon. 

Wie immer hier eine Live-Demo:
DEMO 

Und mit der Möglichkeit, ein eigenes Bild zu nutzen:
DEMO 

Der Code ist selbstverständlich auch wieder [frei](/about#license) verfügbar:



