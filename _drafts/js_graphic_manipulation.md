---
layout: post
title: "Pointillismus in Javascript "
description: ""
category: computer
tags: [javascript, html5, graphic, canvas]
group: post
image: img_manipulation.png
---
Bei meinen Experimenten mit dem traveling salesman Problem (Simulated Annealing, Evolutionary und Greedy mit Einsprengseln von Lin-Kernighan und Beppo Straßenkehrer) bin ich für die Anzeige der Graphen immer mal wieder am `canvas`Element vorbeigekommen und habe jetzt eine ausrede gefunden, mich intensiver damit zu beschäftigen: automatischer Pointillismus. 

Pointillismus ist die Kunstform, bei der ein Künstler Bilder aus einzelnen Punkten konstruiert. Diese Punkte werden häufig so gesetzt, dass z.B. möglichst wenige oder große eine so starke Ausdruckskraft haben, dass das Motiv dennoch erkennbar wird. 
Industriell findet der Pointillismus seine Anwendung bei der Rasterung von Bildern, unter anderem als Vorstufe für den Druck in Zeitungen. 

Die Rasterung von analogen Bildern für den analogen Druck ist wohlbekannt und erprobt. Algorithmen für digitale Rasterung hingegen sind offenbar nicht Gegenstand intensiver Forschung. Genau genommen habe ich zu den Thema überhaupt nur zwei Veröffentlichungen gefunden - vermutlich kommen bei Zeitungen und Magazinen proprietäre (lies: unveröffentlichte) Algorithmen zum Einsatz. 

Die erste Veröffentlichung, TITEL, ist ein globaler Ansatz, der die Punkte als metallische Kugeln in einem Magnetfeld betrachtet. Die Stärke des Feldes hängt vom ursprünglichen Bild ab, so dass besonders viele Kugeln zu den dunklen Stellen gezogen werden. Verfeinerungen dieser Idee ändern auch für die Größe der Punkte abhängig vom Bild, oder sorgen dafür, dass die Kugeln sich gegenseitig abstoßen, damit nicht zu viele auf einer Stelle enden. Obwohl die Implementierung sicherlich ziemlich reizvoll wäre, bin ich letztlich vor der Laufzeit der globalen Kontrolle aller Punkte zurückgeschreckt - das hört sich alles sehr aufwändig und langsam an. Vielleicht mach ich das ja ein anderes mal. 

Die andere Veröffentlichung, TITEL, beschäftigt sich mit der Idee, ein Gitternetz über dem Bild aufzuspannen und die Knoten Stück für Stück in dunklere Bereiche des Bildes zu verschieben, so dass sich dort die Knoten sammeln. Die Pointillismus-Punkte befinden sich natürlich letztlich an den Knoten. (Genau genommen befinden sie sich im Mittelpunkt der Voronoi-Areale, aber da das genau die Knoten einer Delaunay-Triangulation sind, passt das schon.) Auch hiervor bin ich zurückgeschreckt, wegen des Implementierungsaufwands. Diese spezielle Art von Gitternetz ist überhaupt nicht mein Ding :-) 

Ich habe mich für eine dritte Variante entschieden, die zwar nicht ganz so gute Ergebnisse liefert wie die Gitternetz-Version, dafür aber schneller ist und nicht annähernd die algorithmische Komplexität hat. Soweit ich weiß, gibt es bislang noch keine Veröffentlichung dieser Variante, also handelt es sich was mich angeht um meine eigene Erfindung (yay \o/,  mein erster eigener Algorithmus). 

Eine beliebige Menge von Punkten wird zufällig verteilt, wobei dunklere 


