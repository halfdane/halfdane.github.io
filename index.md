---
layout: archive
title: "Unapologetically Nerdy"

header:
  overlay_image: /assets/images/space4.jpg
---

{% assign projects = site.pages | where_exp:'item', "item.name contains 'project_'" %}
<div class="feature__wrapper">
  {% for post in projects %}

    {% if post.header.teaser %}
      {% capture teaser %}{{ post.header.teaser }}{% endcapture %}
    {% else %}
      {% assign teaser = site.teaser %}
    {% endif %}
    
    {% if post.id %}
      {% assign title = post.title | markdownify | remove: "<p>" | remove: "</p>" %}
    {% else %}
      {% assign title = post.title %}
    {% endif %}

    <div class="feature__item">
      <div class="archive__item">
          <div class="archive__item-teaser">
            <img src="{{ teaser | relative_url }}" alt="">
          </div>
        <div class="archive__item-body">
                <h2 class="archive__item-title no_toc" itemprop="headline">
                  {% if post.link %}
                    <a href="{{ post.link }}">{{ title }}</a> <a href="{{ post.url | relative_url }}" rel="permalink"><i class="fas fa-link" aria-hidden="true" title="permalink"></i><span class="sr-only">Permalink</span></a>
                  {% else %}
                    <a href="{{ post.url | relative_url }}" rel="permalink">{{ title }}</a>
                  {% endif %}
                </h2>
        </div>
      </div>
    </div>
  {% endfor %}
</div>
