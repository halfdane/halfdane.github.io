module.exports = (env, callback) ->
  class CustomTags extends env.plugins.IntroDetection

    replaceImageTags = ->
      # Replace |image|url|alt|caption| with proper html
      @markdown = @markdown.replace ///\|\s*image\s*\   # detect image information
            |\s*([^|]*?)\                               # 1. parm is url
            |([^|]*?)\s*\                               # 2. is alt-text
            |\s*([^|]*?)\s*\|                           # everything else is caption
            ///gm, (match, url, altText, caption) =>
        console.log("#{url}")
        caption = if /./.test(caption) then "<figcaption>#{caption}</figcaption>" else ""
        "<div class=\"figure__container\"><figure>" +
          "  [![#{altText}](#{url})](#{url})" +
          "  #{caption}" +
          "</figure></div>"

    getHtml: (base = env.config.baseUrl) ->
      replaceImageTags.call(this)
      super

  # register the plugin everywhere in contents
  env.registerContentPlugin 'posts', '**/*.*(markdown|mkd|md)', CustomTags

  # done!
  callback()
