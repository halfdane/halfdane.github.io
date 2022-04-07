---
title: "Vertikaler Rhythmus"
categories:
- html
tags: [html5,css,layout,typhographie]
header:
  teaser: /assets/images/baseline.png
  overlay_image: /assets/images/baseline.png
---
Was von vielen kompetenten Designern offenbar für sehr wichtig gehalten wird, ist der vertikale Rhythmus, also das Ausrichten der Schriftzeilen (und der anderen Elemente) an einem konsistenten Raster, nämlich genau den Schrifzeilen eines regulären Absatzes. Dazu muss man so crazy Dinge machen wie die Baseline berechnen (gewünschte Höhe der Schrift durch Höhe der Zeilen teilen), für Überschriften eine Skalierung nach dem goldenen Schnitt berechnen (und zwar für jedes Überschriften-Level einzeln) und einen unteren Margin an Überschriften- und Absatz-Elemente hängen, der genau so abgepasst ist, dass die nächste Schriftzeile ins Raster passt.

{% include figure image_path="/assets/images/baseline.png" alt="Seite mit baseline" caption="Ausschnitt der Seite im alten Design - die Baseline ist sichbar." %}

Dazu kommt, dass ich das Raster (und die Schriften) unbedingt in `em` haben will, damit
es gut (und mit [wenig Aufwand](http://joshnh.com/2011/07/26/are-you-using-ems-with-your-media-queries/))
skaliert, wenn ich für die Responsiveness (das wird dann der nächste Eintrag)
andere Größen benutzen möchte.
Und die Schriftgröße soll bitte nicht 14 oder 16 sein, sondern eine richtig große Schrift - das
heißt insbesondere, dass ich keine der fertigen baselines
von einer anderen Seite klauen kann :/

Puh!

Zum Glück hat [Joshua Hibbert](http://joshnh.com/) einen
[wunderbaren Baseline-Generator](http://joshnh.com/tools/em-baseline-generator.html) gebaut, der die Verhältnisse in `em` und relativen Größen ausdrücken kann! Dankeschön, ich war schon drauf und dran die Idee in die Tonne zu kloppen.

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

Da ich ohnehin schon SASS dabei hatte, kann ich auch gleich die Baseline-Funktionen von
[Compass](http://compass-style.org/reference/compass/typography/vertical_rhythm/) benutzen.
War immer noch etwas Arbeit, aber jetzt funktioniert's auf allen Seiten und beim Verkleinern
(Vergrößern) des Browsers.

Ich benutze das auf allen Seiten des Blogs, und das Raster sieht so aus: <span class="js_baseline_trigger btn">Click for raster</span>

Dank Compass sieht der Baseline-Code nur noch in etwa so aus:

```scss
@import "compass/typography/vertical_rhythm";
$base-font-size       : 21px;
$base-line-height     : 26px;
$relative-font-sizing: true;
@include establish-baseline;

@mixin font($relation, $top: 1, $bottom: 1) {
  $px: $relation * $base-font-size;
  @include adjust-font-size-to($px);
  @include rhythm($top, 0, 0, $bottom, $px);
}

h1 {
  @include font(4, 0, 1);
  text-align: center;
}

h2 {
  @include font(2, 0, 0);
}

h3 {
  @include font(1.5, 0, 0);
}

p, blockquote, figcaption, ul, pre, code {
  @include font(1, 0);
}

small {
  @include font(0.7, 0);
}
```

Für die sexy Code-Ansicht habe ich dann noch ein bisschen draufgelegt, damit die
Zebrastreifen hinter den Zeilen automatisch erzeugt werden und oben und unten jeweils eine halbe Zeile
frei bleibt:

```scss
pre {
  /*Ja, das ist übertrieben - sue me!*/
  font-family: Consolas, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", Monaco, "Courier New", Courier, monospace;

  padding: 0 0.8rem 0 1.2rem;
  border: 1px solid #ccc;
  border-left: 1rem solid #ccc;

  /*Im Layout oben und unten je eine halbe Zeile Platz*/
  @include leader(0.5, $base-font-size, padding);
  @include trailer(0.5, $base-font-size, padding);

  /*erst eine Zeile klar, dann eine Zeile Dunkel*/
  background-image: linear-gradient(transparent rhythm(1, $base-font-size), #ececec rhythm(1, $base-font-size));

  /*nach zwei Zeilen nicht einfach weiter grau lassen -> repeat*/
  /*ich hätte zwar erwartet, dass 2 der richtige Wert sein müsse
  (zwei Zeilen), aber da gibt es vielleicht Rundungsfehler*/
  background-size: auto rhythm(2.01, $base-font-size);

  /*den Hintergrund eine halbe Zeile nach unten schieben, damit er zum verschobenen Layout passt */
  background-position: 0 rhythm(0.5, $base-font-size);
}
```

Bei der Recherche habe ich einiges an sehr lesenswerten Artikeln gefunden:

- http://alistapart.com/article/settingtypeontheweb
- http://alistapart.com/article/more-meaningful-typography
- http://24ways.org/2006/compose-to-a-vertical-rhythm/
- http://atendesigngroup.com/blog/vertical-rhythm-compass