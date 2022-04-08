---
title: "TSP in JavaScript (Evolutionary)"
category: tsp_javascript
tags: [javascript, tsp, evolutionary algorithm]
header:
  teaser: /assets/images/tsp_evolutionary.png 
  overlay_image: /assets/images/tsp_evolutionary.png 
footer_scripts: [/assets/js/tsp/tspBase.js, /assets/js/tsp/evolutionaryTsp.js]
series: js-tsp
---
Nachdem die "Simulated Annealing"-Strategie zur Lösung des Traveling Salesman Problems [nicht so beeindruckend war] (/2013/12/01/annealing/), versuche ich mich jetzt mal an der Implementierung eines evolutionären Algorithmus' in Javascript.

Eine sehr lange und komplizierte Erklärung des TSP findet man natürlich [bei Wikipedia] (http://de.wikipedia.org/wiki/Problem_des_Handlungsreisenden), aber ehrlich gesagt gefällt mir meine aus [dem vorigen Artikel] (/2013/12/01/annealing/) besser:

>
Für das TSP werden eine Reihe von Punkten (z.B. Städte auf einer Landkarte, können aber auch dreidimensional sein) sortiert. Aber nicht einfach irgendwie, sondern so dass beim Durchgehen der Punkte von einem zum nächsten die zurückgelegte Strecke möglichst kurz ist. Wie ein Handelsreisender, der Benzin sparen möchte, daher der Name. Das Problem ist für die Informatik interessant, weil es überraschend schwer ist, es optimal zu lösen. Ein Computer muss bei jedem einzelnen Punkt nämlich erstmal alle anderen Punkte prüfen und schauen, wo der neue an besten hinpasst. Bei vielen Punkten kann die Rechenzeit für eine optimale Lösung mehr Zeit in Anspruch nehmen, als z.B. das Universum existiert. Die Klasse der Probleme, zu der das TSP gehört wird von Profis daher auch "die echt richtig schweren Probleme" genannt. Allerdings ist das Problem nicht nur rein akademisch, sondern unter anderem für Logistik-Unternehmen relevant, also für den Post- oder Hermesboten oder für Containerschiffe. Die benutzen für ihre Tourenoptimierung dann keine optimalen Lösungen (keine Zeit), sondern Annäherungen, die "gut genug" sind. Und da gibt es einen ganzen Sack von Strategien, die ausgesprochen spannend sind - natürlich für eine ganz persönliche Definition von "spannend" :-D

Ein evolutionärer Algorithmus definiert sich zunächst eine Population von denkbaren Lösungen und eine Fitnessfunktion um einschätzen zu können, wie "gut" eine einzelne Lösung ist. Im Verlauf werden besonders schlechte Lösungen mit höherer Wahrscheinlichkeit aus der Population entfernt und zufällige Lösungen paarweise miteinander kombiniert um die nächste Generation zu erzeugen. Die wird wieder mit der Fitnessfunktion beurteilt und so weiter. Die Population wird dabei immer fitter, also die Lösungen immer besser (oder zumindest nicht schlechter). Das Ganze kann dann bei einer bestimmten Lösungsqualität oder einer bestimmten Anzahl von Generationen beendet werden. Verfeinerungen verwenden noch eine Mutationsrate, die mit einer bestimmten Wahrscheinlichkeit einzelne Lösungen der Population verwürfelt, oder auch eine Elitenbildung, die die beste (oder die mehrere beste) Lösungen niemals aus der Population entfernt.

Auf das TSP angewandt könnte man Rundtouren als Population verwenden und die Länge einer Tour als Fitness-Funktion. Die Rekombination zweier Touren könnte aus dem Beginn der einen Tour und dem Ende der anderen Tour bestehen und für die Mutation können Strecken innerhalb einer Tour paarweise vertauscht werden.

Mit der Implementierung möchte ich mich wieder nicht so wahnsinnig lange aufhalten, aber zum Glück gibt es wieder Inspiration in Java bei [the Project Spot](http://www.theprojectspot.com/tutorial_post/applying-a-genetic-algorithm-to-the-travelling-salesman-problem/5), die lediglich portiert werden muss.

Besonders auffällig ist, dass der Algorithmus (zumindest in meiner Implementierung) mindestens dreimal so viel Code benötigt wie für's Simulated Annealing. Der theoretische Informatiker in mir findet das völlig irrelevant, weil der Algorithmus so spannend ist. Aber Informatik ist ja auch eine Ingenieurswissenschaft und deswegen finde ich das halt andererseits sehr fürchterlich, weil jede Zeile Code ein Einfallstor für Bugs ist (und randomisierte Algorithmen notorisch schwer zu testen sind). Nicht schön.

Zumal es auch hier nur für kleine Punktmengen eine zufriedenstellende Laufzeit und eine gute Lösung gibt.

Aber (wie schon beim [Simulated Annealing Algorithmus] (/2013/12/01/annealing/)) wird das ganze bei mittelgroßen Punktmengen (also z.B. 100 Punkten) ziemlich träge. Um überhaupt in endlicher Zeit ein Ergebnis zu bekommen muss also die Anzahl der Generationen reduziert werden und das schlägt sich dann natürlich in der Qualität nieder.

Ich habe wiederum eine Demo vorbereitet, damit man den Algorithmus in Aktion sehen kann: 100 Generationen auf 20 Punkten. Ach ja, beim [Eintrag zum Simulated Annealing](/2013/12/01/annealing/) habe ich die Live-Demo und den Code auch noch nachgereicht :)

<span class="target"></span>
<span class="btn btn--primary btn--x-large" onclick="halfdane.tsp.evolutionaryTest(); return false;">Click zum Start</span>

Der zugehörige Code ist hier verfügbar:

- [Helfer-Funktionen für Distanz und Touren-Verwaltung](/assets/js/tsp/tspBase.js)
- [Der Evolutionäre-Algorithmus](/assets/js/tsp/evolutionaryTsp.js)
