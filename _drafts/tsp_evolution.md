Nachdem die "Simulated Annealing"-Strategie zur Lösung des Traveling Salesman Problems [nicht so beeindruckend war] (link), versuche ich mich jetzt mal an der Implementierung eines evolutionären Algorithmus' in Javascript. 

Eine kurze Erklärung, was das TSP ist, habe ich bereits [im vorigen Artikel] (link) gegeben, eine längere findet man natürlich [bei Wikipedia] (link). 

Ein evolutionärer Algorithmus definiert sich zunächst eine Population von denkbaren Lösungen und eine Fitnessfunktion um einschätzen zu können, wie "gut" eine einzelne Lösung ist. Im Verlauf werden besonders schlechte Lösungen aus der Population entfernt und zufällige Lösungen paarweise miteinander kombiniert um die nächste Generation zu erzeugen. Die wird wieder mit der Fitnessfunktion beurteilt und so weiter. Die Population wird dabei immer fitter, also die Lösungen immer besser. Das Ganze kann dann bei einer bestimmten Lösungsqualität oder einer bestimmten Anzahl von Generationen beendet werden. 

