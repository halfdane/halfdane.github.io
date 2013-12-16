---
layout: post
title: "Vertikaler Rhythmus"
category: html
tags: [html,css,layout,typhographie]
image: baseline.png
---

Was von vielen kompetenten Designern offenbar für sehr wichtig gehalten wird,
ist der vertikale Rhythmus, also das Ausrichten der Schriftzeilen (und der anderen Elemente) an einem
konsistenten Raster, nämlich genau den Schrifzeilen eines regulären Absatzes.
Dazu muss man so crazy Dinge machen wie die Baseline berechnen
(gewünschte Höhe der Schrift durch Höhe der Zeilen teilen), für Überschriften eine Skalierung nach dem
goldenen Schnitt berechnen (und zwar für jedes Überschriften-Level einzeln) und einen unteren Margin
an Überschriften- und Absatz-Elemente hängen, der genau so abgepasst ist, dass die nächste Schriftzeile
ins Raster passt.

{% include image img='baseline.png' title="Seite mit baseline" %}

Dazu kommt, dass ich das Raster (und die Schriften) unbedingt in `em` haben will, damit
es gut (und mit [wenig Aufwand](http://joshnh.com/2011/07/26/are-you-using-ems-with-your-media-queries/))
skaliert, wenn ich für die Responsiveness (das wird dann der nächste Eintrag)
andere Größen benutzen möchte.
Und die Schriftgröße soll bitte nicht 14 oder 16 sein, sondern eine richtig große Schrift - das
heißt insbesondere, dass ich keine der fertigen baselines
von einer anderen Seite klauen kann :/

Puh!

Zum Glück hat [Joshua Hibbert](http://joshnh.com/) einen
[wunderbaren Baseline-Generator](http://joshnh.com/tools/em-baseline-generator.html) gebaut,
der die Verhältnisse in `em` und relativen Größen ausdrücken kann!
Dankeschön, ich war schon drauf und dran die Idee in die Tonne zu kloppen.

Ich habe 21 Pixel als Schriftgröße und 31 Pixel als Linienabstand gewählt und das generierte CSS
einfach direkt übernommen - naja, die Überschriften habe ich dann doch nicht fett gemacht,
sondern 500 als Gewicht gewählt. Das wäre dann doch zu
fett gewesen :)

P.S.: Aber ich kann's natürlich nicht lassen - nachdem ich zu meiner Bestürzung
feststellen konnte, dass eine prozentuale Fontsize nicht ausreicht, um in responsive-Stufen den
Rhythmus zu erhalten, hatte ich die Nase voll: die Stylesheets werden jetzt mit
[SASS](http://sass-lang.com/) berechnet.

P.P.S.: Der Erniedrigungen sind kein Ende: jetzt muss ich vor mir selbst auch noch zugeben, dass ich
nicht in der Lage bin, die Baseline-Berechnungen korrekt selbst zu programmieren. Es gibt einfach
zu viele Sonderfälle für meinen Geschmack: das fängt mit dem seltsamen Verhalten der prozentualen
Werte an und hört mit dem Kollabieren aneinandergrenzender Margins noch lange nicht auf.

Da ich ohnehin schon SASS dabei hatte, kann ich auch gleich die Baseline-Funktionen von dort benutzen.
War immer noch etwas Arbeit, aber jetzt funktioniert's auf allen Seiten und beim Verkleinern
(Vergrößern) des Browsers.

Ich benutze das auf allen Seiten des Blogs, und das Raster sieht so aus: <span class="js_baseline_trigger btn">Click for raster</span>

<script src="{{ ASSET_PATH }}/js/display_halfdane_baseline.js"> </script>