---
layout: post
title: "Livestream-Bildergallerie"
description: ""
category: computer/javascript
tags: [javascript, html5, tsp]
group: post
image: picturedisplay.png
resources: [/assets/js/picture_display.js]
---
Als kleines Gimmick am Rande hatten Schmiddie und ich die Idee, man könne die aktuellen Käufe auf der OTTO-Seite darstellen, damit wir eine Vorstellung davon bekommen, was da überhaupt passiert. Bei rund 100 Kaufvorgängen pro Minute, die jeweils mehrere Produkte enthalten, gibt es eigentlich nur die Möglichkeit zu abstrahieren. Statistiken haben wir schon genug, wir wollen etwas weniger praktisches. Also zeigen wir die Bilder der Produkte, die gerade gekauft werden :) Genaugenommen war das alles Schmiddies Idee, mich hat er ja bloß angesprochen weil ich an der Bezahlstrecke arbeite...

Ich möchte den Bildschirm (oder einen Teil davon) mit kleinen Produktbildern füllen und bei neuen Käufen dreht sich die Kachel um und zeigt das Bild des neu gekauften Produktes. Der Aufwand soll sich in Grenzen halten, deswegen baue ich das einfach in Javascript.

<div class="small_picture_demo"></div>

Jedes neue Bild wird an eine Kachel gehängt und wenn es fertig geladen ist wird die Kachel gedreht:

```javascript
nextImage.attr('src', imgUrl).on('load', function () {
    $frame.toggleClass('flip');
});
```

Jede Kachel enthält zwei Bilder (vorne und hinten) und durch das Zufügen und Entfernen der `flip`-Klasse wird jeweils eine CSS3-Transition gestartet, die ich aus einem [JSFiddle](http://jsfiddle.net/EZSlaver/5AWSJ/3/) angepasst habe. Dank [SASS](http://sass-lang.com/) ist sogar ganz übersichtlich:

```scss
.panel {
  float: left;
  width: 100px;
  height: 100px;
  position: relative;

  @include experimental(perspective, 600);

  .front, .back {
    float: none;
    position: absolute;
    top: 0;
    left: 0;
    width: inherit;
    height: inherit;

    @include experimental(transform-style, preserve-3d);
    @include experimental(backface-visibility, hidden);
    @include experimental(transition, all .4s ease-in-out);
  }

  .front {
    z-index: 900;
    @include experimental(transform, rotateX(0deg) rotateY(0deg));
  }
  .back {
    z-index: 800;
    @include experimental(transform, rotateY(180deg));
  }

  &.flip {
    .front {
      @include experimental(transform, rotateY(180deg));
    }
    .back {
      @include experimental(transform, rotateX(0deg) rotateY(0deg));
    }
  }
}
```

Diese Variante erlaubt eine sehr einfache HTML-Struktur, mit der man zwei Kindelemente eines Elements drehen kann, indem das `.panel` ein `.flip` bekommt:

```html
<span class="panel flip">
  <img class="front" src="...">
  <img class="back" src="...">
</span>
```

Die gesamte Implementierung in Javascript nimmt nur etwa 50 Zeilen in Anspruch, allerdings auch ohne besondere Rücksicht auf Architektur etc. zu nehmen:

```javascript
var halfdane = halfdane || {};
halfdane.picture_display = halfdane.picture_display || (function () {
    'use strict';

    var $target;

    function createFrame() {
        var ottoLogo = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF0aIE_awrS2dM7y36nR9s7yMFIW4Bkvyy_B8Swe9hsv419_gtwQ';
        $('<span></span>')
            .addClass('panel')
            .appendTo($target)
            .append($('<img>').addClass('front').attr('src', ottoLogo))
            .append($('<img>').addClass('back').attr('src', ottoLogo));
    }

    function showInFrame($frame, imgUrl) {
        var nextImage;
        if ($frame.hasClass('flip')) {
            nextImage = $frame.children('.front');
        } else {
            nextImage = $frame.children('.back');
        }
        nextImage.attr('src', imgUrl).on('load', function () {
            $frame.toggleClass('flip');
        });
    }

    function show(imgUrl) {
        var $elements = $target.find('.panel');
        var randomIndex = Math.floor(Math.random() * $elements.length);
        showInFrame($($elements.get(randomIndex)), imgUrl);
    }

    function init($targetElement) {
        $target = $targetElement;
        var i;
        for (i = 0; i < 200; i += 1) {
            createFrame();
        }
    }

    return {
        show: show,
        init: init
    };
}());
```

Die `init`-Funktion bekommt das Dom-Element, in dem die Kacheln einsortiert werden sollen und mit `halfdane.picture_display.show(pictureUrl);` wird das übergebene Bild in einer zufälligen Kachel angezeigt.

Für die Demo habe ich einfach hundert Bilder von der Google-Bildersuche gemopst und iteriere darüber. Die Kacheln werden in einem `div` angezeigt, das die gesamte Seite einnimmt.

Klick oder Tastendruck beendet die Demo.

<span class="btn" onclick="halfdane.picture_demo.run(); return false;">Click zum Start</span>

Der Code ändert sich vermutlich auch noch ein bisschen, die aktuelle Version ist immer hier: [/assets/js/picture_display.js](/assets/js/picture_display.js)