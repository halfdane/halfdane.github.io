# Gallery Tag
#

module Jekyll
  class ClearTag < Liquid::Tag

    def render(context)
      "<div class='clearfix'></div>"
    end
  end
end

Liquid::Template.register_tag('clear', Jekyll::ClearTag)