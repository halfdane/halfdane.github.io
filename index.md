---
layout: page
title: Canned Nerd
---
{% include JB/setup %}

<ul>
    {% for post in site.posts limit 4 %}
    <li>
        <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a>
        <span>Veröffentlicht am {{ post.date | date_to_string }}</span>
        {{ post.content | split:"<!-- more -->" | first }}
        {% if post.content | size > 300 %}<a href="{{ BASE_PATH }}{{ post.url }}"><strong>Read more</strong></a>{% endif %}
    </li>
    {% endfor %}
</ul>
