---
template: minimal.jade
---
<link href="styles.css" rel="stylesheet">
<script type="text/javascript" src="picturefill.min.js"></script>

# Picture-Tag
[Zurück zu "Render-Stages"](render_stages.html)
[Weiter zu "Picture-Tag - veranschaulicht"](picture_tag_different.html)

<picture>
  <source media="(min-width: 800px)" srcset="slideshow_large.jpg">
  <source media="(min-width: 400px)" srcset="slideshow_medium.jpg">
  <img src="slideshow_initial.jpg" />
</picture>

Das Picture-Tag ist ein kommender HTML-Standard mit Fallback in Javascript.

```css
img {
  max-width: 100%;
  height: auto;
}
```

```html
<picture>
  <source media="(min-width: 800px)" srcset="slideshow_large.jpg">
  <source media="(min-width: 400px)" srcset="slideshow_medium.jpg">
  <img src="slideshow_initial.jpg" />
</picture>
```
