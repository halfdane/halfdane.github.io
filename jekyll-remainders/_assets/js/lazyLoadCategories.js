var halfdane = halfdane || {};

halfdane.lazyloadCategories = function (categories_target_selector, remaining_contents_selector) {
    'use strict';

    var $categories_target = $(categories_target_selector);
    if ($categories_target.is(":visible")) {

        $.getJSON("json/categories.json", function (categoriesJson) {
            var $categories = $('<ul></ul>').appendTo($categories_target);

            categoriesJson.categories.sort(function (entry1, entry2) {
                return  (entry1.title < entry2.title) ? -1 : (entry1.title > entry2.title) ? 1 : 0;
            });

            $(categoriesJson.categories).each(function (index, currentCategory) {
                var $category = $('<li></li>')
                    .append(
                        $('<a></a>').attr('href', currentCategory.url).text(currentCategory.title)
                    )
                    .appendTo($categories);

                var $posts = $('<ul></ul>').appendTo($category);
                $(currentCategory.posts).each(function (index, currentPost) {
                    var $post = $('<li></li>')
                        .append(
                            $('<a></a>').attr('href', currentPost.url).text(currentPost.title)
                        )
                        .appendTo($posts);
                });
            });
        });
    }
};
