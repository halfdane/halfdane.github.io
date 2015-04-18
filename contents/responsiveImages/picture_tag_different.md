---
template: minimal.jade
---
<link href="styles.css" rel="stylesheet">
<script type="text/javascript" src="picturefill.min.js"></script>

# Picture-Tag veranschaulicht
[Zurück zu "Picture-Tag"](picture_tag.html)

```css
img {
max-width: 100%;
height: auto;
}
```

```html
<picture>
  <source media="(min-width: 800px)" srcset="slideshow_large.jpg" >
  <source media="(min-width: 400px)" srcset="buecher.jpg" >
  <img src="comedia.jpg" />
</picture>

```

<picture>
  <source media="(min-width: 800px)" srcset="slideshow_large.jpg" >
  <source media="(min-width: 400px)" srcset="buecher.jpg" >
  <img src="comedia.jpg" />
</picture>

