module.exports = (env, callback) ->
  class CustomTags extends env.plugins.IntroDetection

    replaceImageTags = ->
      # Replace |image|url|alt|caption| with proper html
      @markdown = @markdown.replace ///\|\s*image\s*\   # detect image information
            |\s*([^|]*?)\                               # 1. parm is url
            |([^|]*?)\s*\                               # 2. is alt-text
            |\s*([^|]*?)\s*\|                           # everything else is caption
            ///gm, (match, matched_url, altText, caption) =>
        url = if /\/\//.test(matched_url) || /^\//.test(matched_url)  then "#{matched_url}" else "#{@metadata.http_dir}/#{matched_url}"
        caption = if /./.test(caption) then "<figcaption>#{caption}</figcaption>" else ""
        "<div class=\"figure__container\"><figure>" +
          "  [![#{altText}](#{url})](#{url})" +
          "  #{caption}" +
          "</figure></div>"

    replaceJavaScriptTags = ->
      @markdown = @markdown.replace ///\|\s*include-js\s*   # detect image information
            \|\s*([^|]*?)\s*\|                                # 1. parm is url
            ///gm, (match, matched_url) =>
        url = if /\/\//.test(matched_url) || /^\//.test(matched_url)  then "#{matched_url}" else "#{@metadata.http_dir}/#{matched_url}"
        "<script type=\"text/javascript\" src=\"#{url}\"></script>"

    getHtml: (base = env.config.baseUrl) ->
      replaceImageTags.call(this)
      replaceJavaScriptTags.call(this)
      super

  # register the plugin everywhere in contents
  env.registerContentPlugin 'posts', '**/*.*(markdown|mkd|md)', CustomTags

  # done!
  callback()
