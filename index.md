---
layout: page
title: Navigate by sight
---
{% include JB/setup %}

<ul class="postslist">
    {% for post in site.posts limit 4 %}
    <li class="clear">
        {% if post.image %}{% include image img=post.image title=post.title %}{% endif %}
        <h2><a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></h2>
        {{ post.excerpt }}
    </li>
    {% endfor %}
</ul>


