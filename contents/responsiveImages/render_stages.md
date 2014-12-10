---
template: minimal.jade
---
<link href="styles.css" rel="stylesheet">
# Verbreiteter Trick: per JavaScript das Source-Attribute ersetzen
[Zurück zu "Max-Width"](large_responsive.html)
[Weiter zu "Picture Tag"](picture_tag.html)

```html
<img src="slideshow_veery_small.jpg" data-large-url="slideshow_large.jpg">
```

```javascript
if (someLargeBreakpoint) {
    $('img').each(function(){
      $img=$(this);
      $img.attr('src', $img.data('large-url'));
    });
}
```

1. Browser erhält die Antwort als lange Zeichenkette
2. Zeichenkette wird in Bestandteile zerlegt (Parsen) - parallel: weitere Resourcen holen, z.B. Bilder, CSS & JS
3. Bestandteile werden zum DOM-Baum zusammengesetzt und angezeigt
4. CSS wird geparsed und angewandt
5. JS wird geparsed und ausgeführt