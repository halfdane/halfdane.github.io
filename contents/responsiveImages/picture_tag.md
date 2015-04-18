---
template: minimal.jade
---
<link href="styles.css" rel="stylesheet">
<script type="text/javascript" src="picturefill.min.js"></script>

# Picture-Tag
[Go to "Render-Stages"](render_stages.html)
[Go to "Picture-Tag - different pics"](picture_tag_different.html)

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

<picture>
  <source media="(min-width: 800px)" srcset="slideshow_large.jpg">
  <source media="(min-width: 400px)" srcset="slideshow_medium.jpg">
  <img src="slideshow_initial.jpg" />
</picture>

