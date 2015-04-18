---
template: minimal.jade
---
<link href="styles.css" rel="stylesheet">
# 2010 Trick: set the source attribute via JavaScript
[Go to "Max-Width"](large_responsive.html)
[Go to "Picture Tag"](picture_tag.html)

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

1. Browse receives the server response as a long string without much of a structure
2. String is split up into its parts (parsing) - parallel: fetching more resources like pictures, CSS, JS
3. the Parts interpreted to build up the DOM tree -> first rendering
4. CSS is parsed and applied
5. JS is parsed and applied