# Image Tag
#
# Inspired by:
# https://github.com/stewart/blog/blob/master/plugins/image_tag.rb
#
# Allow retina and lazy loading, using:
# https://github.com/scottjehl/picturefill
# https://github.com/sebarmeli/JAIL

module Jekyll
  class ImageTag < Liquid::Block
    @url = nil
    @title = nil
    @css = nil
    @markup = nil

    IMAGE_URL_WITH_TITLE_AND_CSS = /(\S+)(\s+)"(.*?)"(\s+)"(.*?)"/i
    IMAGE_URL_WITH_TITLE = /(\S+)(\s+)"(.*?)"/i
    IMAGE_URL = /(\S+)/i

    def initialize(tag_name, markup, tokens)
      super
      @css="cap-left"
      if markup =~ IMAGE_URL_WITH_TITLE_AND_CSS
        @url     = $1
        @title   = $3
        givenCss = $5
      elsif markup =~ IMAGE_URL_WITH_TITLE
        @url   = $1
        @title = $3
      elsif markup =~ IMAGE_URL
        @url = $1
        @title = ""
      end

      @markup = markup

      @css += " " + givenCss unless givenCss.nil?

      # Config options
      @config = Jekyll.configuration({})['images'] || {}
      @config['root_url']         ||= '/assets/img'
      @config['retina']           ||= false
      @config['retina_suffix']    ||= '@2x'
      @config['lazy']             ||= false
      @config['lazy_placeholder'] ||= ''
    end

    def render(context)

      imageUrl = Liquid::Template.parse(@url).render context

      # Build url
      # Only works if no trailing slash in `root_url`, and no leading in `url`
      imageUrl = [@config['root_url'], imageUrl].join('/') unless (imageUrl=~/^http/)

      source = "<figure class=\"#{@css}\">"

      source += "<img src=\"/assets/img/loader.gif\" data-src=\"#{imageUrl}\" alt=\"#{@title}\">"

      site = context.registers[:site]
      converter = site.getConverterImpl(::Jekyll::Converters::Markdown)
      output = converter.convert(super(context))

      source += "<figcaption>#{output}</figcaption>" unless (output.to_s == "")
      source += "</figure>"
      source
    end

    def retina_url(normal_url)
      retina_url = normal_url
      # Only works with .jpg and .png
      base = normal_url[0..-5]
      extension = normal_url[-3..-1]
      if extension == '.jpg' || extension == '.png'
        retina_url = base + @config['retina_suffix'] + extension
      end
      retina_url
    end
  end
end

Liquid::Template.register_tag('image', Jekyll::ImageTag)