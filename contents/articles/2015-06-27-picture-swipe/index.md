---
title: "Picture-Swipe"
image: luftkissen_cd_final.jpg
---
Für die OTTO-InnoDays hat mein Team die Idee "Hot or not for Fashion" umgesetzt und dazu die Otto-Empfehlungsengine umgebaut, 
einen MicroService für die Datenversorgung erstellt und eine Android-App zum Swipen von Mode-Bildern gebaut.
Jetzt möchte ich gerne herausfinden, wie schwer es ist, so einen Swiping-Client in HTML zu bauen.

<a href="picture-swipe.html">Hammer.js-Basierte Implementierung</a>

Der Code ist selbstverständlich auch wieder [frei](/about.html#lizenzen) verfügbar:
[picture-swipe.js](http://halfdane.github.io/articles/2015-06-27-picture-swipe/picture-swipe.js)

Die Icons habe ich mit der Google-Bildersuche gefunden und die Bilder kommen von OTTO.

Die eigentliche Implementierung ist nicht so sehr schwer, allerdings fühlt sich das Verhalten auf einem Touch-Device sehr, sehr träge an.
Meine Vermutung ist, dass ich bei der Verwendung von [Hammer.js](https://hammerjs.github.io/) irgendetwas falsch gemacht habe.

Die Implementierung mit [jTinder](https://github.com/do-web/jTinder) ist vergleichsweise smooth und angenehm:
<a href="picture-swipe2.html">jTinder-Basierte Implementierung</a>

Aber ehrlich gesagt nervt mich jQuery so extrem, dass ich hier noch mal eine VanillaJS-Implementierung nachgeschoben habe:
<a href="picture-swipe3.html">VanillaJS Implementierung</a>

