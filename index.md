---
layout: page
title: Canned Nerd
---
{% include JB/setup %}

<ul>
    {% for post in site.posts limit 4 %}
    <li>
        <h2><a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></h2>
        <small><span>Veröffentlicht am {{ post.date | date_to_string }}</span></small>
        {{ post.content | split:"<!-- more -->" | first }}
        {% if post.content contains "<!-- more -->" %}<div><a href="{{ BASE_PATH }}{{ post.url }}"><strong>Weiterlesen</strong></a></div>{% endif %}
    </li>
    {% endfor %}
</ul>
