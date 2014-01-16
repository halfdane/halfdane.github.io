---
layout: post
title: "TSP in JavaScript (Evolutionary)"
description: ""
category: computer
tags: [javascript, html5, tsp, evolutionary algorithm]
group: post
image: tsp_evolutionary.png
---
Nachdem die "Simulated Annealing"-Strategie zur Lösung des Traveling Salesman Problems [nicht so beeindruckend war] (/2013/12/01/annealing/), versuche ich mich jetzt mal an der Implementierung eines evolutionären Algorithmus' in Javascript.

Eine kurze Erklärung, was das TSP ist, habe ich bereits [im vorigen Artikel] (/2013/12/01/annealing/) gegeben, eine längere findet man natürlich [bei Wikipedia] (http://de.wikipedia.org/wiki/Problem_des_Handlungsreisenden).

Ein evolutionärer Algorithmus definiert sich zunächst eine Population von denkbaren Lösungen und eine Fitnessfunktion um einschätzen zu können, wie "gut" eine einzelne Lösung ist. Im Verlauf werden besonders schlechte Lösungen mit höherer Wahrscheinlichkeit aus der Population entfernt und zufällige Lösungen paarweise miteinander kombiniert um die nächste Generation zu erzeugen. Die wird wieder mit der Fitnessfunktion beurteilt und so weiter. Die Population wird dabei immer fitter, also die Lösungen immer besser (oder zumindest nicht )schlechter. Das Ganze kann dann bei einer bestimmten Lösungsqualität oder einer bestimmten Anzahl von Generationen beendet werden. Verfeinerungen verwenden noch eine Mutationsrate, die mit einer bestimmten Wahrscheinlichkeit einzelne Lösungen der Population verwürfelt, oder auch eine Elitenbildung, die die beste (oder die mehrere beste) Lösungen niemals aus der Population entfernt.

Auf das TSP angewandt könnte man Rundtouren als Population verwenden und die Länge einer Tour als Fitness-Funktion. Die Rekombination zweier Touren könnte aus dem Beginn der einen Tour und dem Ende der anderen Tour bestehen und für die Mutation können Strecken innerhalb einer Tour paarweise vertauscht werden.

Mit der Implementierung möchte ich mich wieder nicht so wahnsinnig lange aufhalten, aber zum Glück gibt es wieder Inspiration in Java bei [the Project Spot](http://www.theprojectspot.com/tutorial_post/applying-a-genetic-algorithm-to-the-travelling-salesman-problem/5), die lediglich portiert werden muss.

