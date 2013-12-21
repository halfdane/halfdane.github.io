# Gallery Tag
#

module Jekyll
  class GalleryTag < Liquid::Block
    @css = nil

    CSS = /"(.*?)"/i

    def initialize(tag_name, markup, tokens)
      super
      if markup =~ CSS
        @css=$1
      end
    end


    def render(context)
      site = context.registers[:site]
      converter = site.getConverterImpl(::Jekyll::Converters::Markdown)
      output = converter.convert(super(context))

      source = "<div class='swipeshow slideshow #{@css}'><div class='slides'>"
      source += "#{output}" unless (output.nil?)
      source += "</div><button class='previous'></button><button class='next'></button><div class='dots'></div></div>"
      source
    end
  end
end

Liquid::Template.register_tag('gallery', Jekyll::GalleryTag)