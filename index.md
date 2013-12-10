---
layout: page
title: Navigate by sight
---
{% include JB/setup %}

<ul class="postslist">
    {% for post in site.posts limit 4 %}
    <li>
        <h2><a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></h2>
        {{ post.content | split:"<!-- more -->" | first }}
    </li>
    {% endfor %}
</ul>


