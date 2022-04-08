---
title: Häkeldecke
permalink: /haekeldecke/
taxonomy: haekeldecke
header:
  teaser: /assets/images/space3.jpg
  overlay_image: /assets/images/space4.jpg
---

{%- for post in site.categories[page.taxonomy] -%}
  {%- unless post.hidden -%}
    {{ post.content }}
  {%- endunless -%}
{%- endfor -%}
