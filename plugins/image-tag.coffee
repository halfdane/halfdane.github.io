path = require 'path'

module.exports = (env, callback) ->
  class CustomTags extends env.plugins.IntroDetection

    replaceImageTags = ->
      # Replace |image|url|alt|caption| with proper html
      @markdown = @markdown.replace ///\|\s*image\s*\|   # detect image information
            \s*([^|]*?)\s*\|                               # 1. parm is url
            \s*([^|]*?)\s*\|                               # 2. is alt-text
            \s*([^|]*?)\s*\|                           # everything else is caption
            ///gm, (match, url, altText, caption) =>
        caption = if /./.test(caption) then "<figcaption>#{caption}</figcaption>" else ""

        imageIsLocal = !(/\/\//.test(url) || /^\//.test(url))

        # Wouldn't it be nice to use the mixin from index.jade instead of this trainwreck?!
        ext = "."+url.split('.').pop()
        base = url.slice(0, -(ext.length))

        full = "#{base}#{ext}"
        large = if imageIsLocal then "#{base}-large#{ext}" else full
        medium = if imageIsLocal then "#{base}-medium#{ext}" else full
        small = if imageIsLocal then "#{base}-small#{ext}" else full

        "<div class=\"figure__container\"><figure>" +
          "  <a href=\"#{full}\"><img src=\"#{small}\" alt=\"#{altText}\" srcset=\"#{small} 320w, #{medium} 640w, #{large} 1024w\", "+
          "    sizes=\"(min-width: 600px) 50vw, 100vw\"/></a>" +
          "  #{caption}" +
          "</figure></div>"

    getHtml: (base = env.config.baseUrl) ->
      replaceImageTags.call(this)
      super

    # register the plugin everywhere in contents
    env.registerContentPlugin 'posts', '**/*.*(markdown|mkd|md)', CustomTags

    # done!
    callback()
