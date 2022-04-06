---
title: "Schriften _wirklich_ in Css einbinden"
categories:
- Html
tags: [css, fonts, typhographie]
header:
  teaser: /assets/images/font_embed.png
---
Ja ja, embedded fonts in Css sind ein totgerittenes Pferd. Allerdings wird immer nur darüber geredet, wie ein Font-File auf einem Server referenziert wird, am besten auch noch über [Google-Fonts](http://www.google.com/fonts) und das ist einfach falsch, denn das ist eigentlich genau das Gegenteil eines eingebetteten Fonts.

Denn so liegt der ja nach wie vor auf dem Server und muss extra mit einem eigenen Request (oder bei Google-Fonts sogar mit zweien) abgeholt werden, bevor er dann im Browser benutzt werden kann. 

Für die meisten Seiten ist die Verzögerung durch zwei überflüssige Requests kein Problem, selbst wenn die reine Anzahl von Requests der Hauptgrund für langsame Seiten ist. Die meisten Seiten sind halt trotzdem noch "schnell genug" oder haben nicht genug Publikum. 
Dummerweise brauchen verschiedene Browser aber auch noch ganz eigene Fonts, so dass man ganz schnell bei zehn bis zwölf unnötigen requests ist, die auch noch jeder für sich fehlschlagen können.

Denn spätestens, wenn man sich vor Augen hält, dass Werbeblocker, Firewalls oder schlechte / langsame Verbindungen (hat da jemand Mobile First gesagt?) das Laden der Schrift auch völlig verhindern können und damit das gesamte Design der Seite plötzlich kaputt ist, wird klar, dass wir die Schriften auf diese Weise eigentlich kein bisschen einbetten, auch wenn wir das gerne behaupten. 

Die Lösung wird bei Logos, Favicons und anderen kleinen Bildern schon lange völlig selbstverständlich benutzt: Data-Uri. Damit kann der komplette Inhalt einer Datei direkt im Quelltext anstelle einer Referenz angegeben werden. Damit wird die Css-Datei natürlich um so größer, aber das sind ja Daten, die der Browser ohnehin geladen hätte, nur jetzt ohne separaten Request.

Die Lobster-Schriftart, die ich für Überschriften einsetze, soll eigentlich so eingebunden werden:

```css
@import url(//fonts.googleapis.com/css?family=Lobster);
```

Damit wird eine weitere Css-Datei vom Google-Server geladen, die die Referenz auf die Woff-Datei mit der Schriftart enthält:

```css
@font-face {
  font-family: 'Lobster';
  font-style: normal;
  font-weight: 400;
  src: local('Lobster'), url(http://themes.googleusercontent.com/static/fonts/lobster/v6/MWVf-Rwh4GLQVBEwbyI61Q.woff) format('woff');
}
```

Den ersten Request kann man sich sparen, indem man den Code einfach ins eigene css übernimmt. Für den zweiten muss die Datei zunächst base64-encoded werden. 

```bash
wget 'http://themes.googleusercontent.com/static/fonts/lobster/v6/MWVf-Rwh4GLQVBEwbyI61Q.woff'
base64 -w0 MWVf-Rwh4GLQVBEwbyI61Q.woff > lobster.b64.woff
```

Der String aus der neuen Datei `lobster.b64.woff` kann nun als Data-Uri im Css benutzt werden :

```css
url('data:application/x-font-woff;base64,d09GRgABAAAAAD6sAAwAAAAAdQgAAQABAAAAAAAAAAAAAAAAAAAAAAA.....')
```

Dieselbe Strategie funktioniert natürlich auch mit TrueType-Fonts für Android-Browser. Dort funktioniert's jetzt endlich auch. Danke, base64.

Und mit [SASS](http://sass-lang.com/), das ist seit den Experimenten mit dem [Vertialen Rhytmus](/2013/12/11/vertikaler-rhythmus/) ja ohnehin benutze, ist das sogar noch einfacher, da wird das Encoding der Font-Files automatisch gemacht:

```sass
@import "compass/css3";
@include font-face(
    "Cabin",
    inline-font-files(
        'cabin.woff', woff,
        'cabin.ttf', ttf),
    '', // ie-fallback? DIE IE7, DIE!
    400, // font-weight
    normal  // font-style
);
```
