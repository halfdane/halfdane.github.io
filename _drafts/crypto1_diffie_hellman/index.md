---
title: "Verschlüsselung für absolute Einsteiger: das Diffie-Hellman-Schlüsseltausch-Spiel"
template: minimal.jade
---
Die korrekte Implementierung von kryptographischen Algorithmen ist schwer. Sehr schwer. 
Aber die Mechanismen sind häufig erstaunlich leicht zugänglich, wenn man einige zugrundeliegende Konzepte (Restgruppen, Kommutativität von Potenzen) noch einmal langsam erklärt.
Das tue ich auf dieser Seite für die Konzepte, die dem Diffie-Hellman-Schlüsseltausch zugrunde liegen.

Um den Diffie-Hellman-Schlüsseltausch (das "`S`" in "`HTTPS`") verständlich zu machen, ist es einleuchtend, die Anwesenden zu Client und Server zu machen und ihre Kommunikation von einem dritten Spieler prüfen zu lassen. 
Mit einem Taschenrechner und einigen Erklärungen sollte es den Spielern möglich sein, mit kleinen Zahlen einen Diffie-Hellman-Schlüsseltausch durchzuführen um einen sicheren Kommunikationskanal zu etablieren.

# Das Spiel
In diesem Spiel sollen zwei Spieler (Alice und Bob) versuchen, eine Geheimzahl (Kreditkarten-Nummer?) auszutauschen, ohne dass ein 
dritter Spieler (Trudy the intruder) diese Zahl herausfinden kann.

Die einzige Regel besteht darin, dass Alice und Bob nur Nachrichten austauschen dürfen, indem sie sie auf eine Karte schreiben und sie offen für Trudy lesbar auf den Tisch legen.

Das Spiel ist gewonnen, wenn Alice und Bob es schaffen, ihre Geheimzahl auszutauschen, ohne dass Trudy sie lesen kann.

## Vorbereitungen
Der Spielleiter erklärt den Spielern die Regeln und verteilt mehrfarbige Karten und Stifte. 
Ggf. werden die Rollen von Alice, Bob un Trudy zugewiesen.

Vor jedem Durchgang denkt sich Alice eine geheime Zahl (eine Kreditkarten-Nummer? Die Geheimzahl für den Geldautomaten?) aus, die sie verdeckt auf eine Karte schreibt.
Diese Karte legt sie so vor sich auf den Tisch, dass sie nicht lesbar ist.

## Erster Durchgang
Wenn die Spieler nicht schon erhebliche Vorkenntnisse haben, werden sie schnell feststellen, dass sie nicht in der Lage sind, die geheime Information zu transportieren, ohne dass Trudy sie lesen kann.

## Erklärungen
An dieser Stelle werden die Spieler einige Informationen benötigt, um es Alice und Bob zu ermöglichen, vertraulich zu kommunizieren.


### Restgruppen
Modulo: Division mit Rest

Beispiel 3: Vorzählen (...2, 3, 4, 5, 6, 7) und so kreisartigkeit demonstrieren

Betonen: 
- Ergebnis ist immer zwischen 0 und der Basis
- bei Multiplikation z.B. mit 17 landet man meist irgendwo, ohne dass klar ist, wie oft man im Kreis gegangen ist
- immer ganze Zahlen, keine Kommazahlen

In der Kryptographie benutzt man Primzahlen für modulo, damit man in beide Richtungen 
(also z.B. auch negative Zahlen) rechnen kann - das geht bei den anderen Zahlen nicht, weil die Teiler 
der Nicht-Primen Basis immer übrig bleiben.

mod3-Gruppe: 0 ist neutral und (1,2) sind ein gegensätzliches Paar


### Potenzen potenzieren
Beispiele für: Potenzen werden potenziert, indem die Exponenten multipliziert werden: 2^3^4 = 2^(3*4)

Beispiele für: bei der Multiplikation ist die Reihenfolge egal (Kommutativ)! 3*4=4*3

Wenn zwei Leute also nacheinander potenzieren, ist es egal wer zuerst dran ist, das Ergebnis bleibt das gleiche
2^3^4 = 2^(3*4) === 2^4^3 = 2^(3*4)

### Die Diffie-Hellmann Formel
g^x mod p

Alice:
- denkt sich a aus (geheim)
- denkt sich g, p aus (öffentlich)
- berechnet A=g^a mod p
- und übermittelt g, p und A an Bob

Bob: 
- denkt sich b aus
- berechnet B=g^b mod p
- und übermittelt B an Alice
- Berechnet den gemeinsamen Schlüssel K=A^b mod p

Alice:
- berechnet den gemeinsamen Schlüssel K=B^a mod p

K=g^a^b mod p = g^b^a mod p


### Simple Verschlüsselung
Geheimnis und vertrauliche Information addieren und subtrahieren

## Zweiter und spätere Durchgänge
Wenn die Karten ausgeteilt sind, können die Spieler erneut versuchen, die vertrauliche Zahl zu übermitteln.
In den weiteren Durchgängen können die Rollen auch vertauscht werden, damit Trudy das auch mal ausprobieren kann.



