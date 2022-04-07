---
title: "Initiale Position der Seite falsch – <br> A Scrollspy Mystery [solved]"
categories:
- html
tags:
- html5
- javascript
- scrollspy
header:
  teaser: /assets/images/scrollspy_mystery.png
  overlay_image: /assets/images/scrollspy_mystery.png
  overlay_filter: rgba(100, 100, 0, 0.5)

---

Auf einer internen Seite, die Twitter-Bootstrap nicht ganz unähnlich ist, trat das Problem auf, dass der Browser irgendwo in die Mitte der Seite gesprungen ist (also etwa so: http://twitter.github.io/bootstrap/base-css.html#forms aber ohne #forms am Ende ).

Meine erste Vermutung war, dass der Scrollspy-Code buggy sein müsse (Fehler machen immer nur die anderen, right?), aber auch ganz ohne Javascript sprang der Browser in die Mitte der Seite :/

In meiner Verwirrung habe ich auch noch das CSS abgeschaltet, aber da lag’s natürlich nicht dran.

Letztendlich war der Fehler doch selbstverschuldet: in einer Form in der Mitte der Seite hatte ein Eingabefeld das Attribut "autofocus", und der Browser hat den Cursor dann dahin gesetzt. Inklusive scrollen.

Ein völlig korrektes Verhalten – mit dem Entfernen des Attributes funktioniert die Seite jetzt auch wieder richtig.

Das zeigt mir mal wieder, dass es auch mit reinem HTML durchaus möglich ist, das Verhalten der Seite zu zerbrechen – und dass nicht immer die anderen Schuld sind.