# Gallery Tag
#

module Jekyll
  class GalleryTag < Liquid::Block
    def render(context)
      site = context.registers[:site]
      converter = site.getConverterImpl(::Jekyll::Converters::Markdown)
      output = converter.convert(super(context))

      source = "<div class='swipeshow slideshow'><div class='slides'>"
      source += "#{output}" unless (output.nil?)
      source += "</div><button class='previous'></button><button class='next'></button><div class='dots'></div></div>"
      source
    end
  end
end

Liquid::Template.register_tag('gallery', Jekyll::GalleryTag)