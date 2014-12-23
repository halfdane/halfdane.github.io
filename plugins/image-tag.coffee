module.exports = (env, callback) ->
  class ImageTag extends env.plugins.IntroDetection
    getHtml: (base = env.config.baseUrl) ->
      # Replace |image|url|alt|caption| with proper html
      @markdown = @markdown.replace ///\|\s*image\s*\   # detect image information
            |\s*([^|]*?)\                               # 1. parm is url
            |([^|]*?)\s*\                               # 2. is alt-text
            |\s*([^|]*?)\s*\|                           # everything else is caption
            ///gm, (match, matched_url, altText, caption) =>
        url = if /\/\//.test(matched_url) || /^\//.test(matched_url)  then "#{matched_url}" else "#{@metadata.http_dir}/#{matched_url}"
        caption = if /./.test(caption) then "<figcaption>#{caption}</figcaption>" else ""
        "<div class=\"figure_container\"><figure>" +
          "  [![#{altText}](#{url})](#{url})" +
          "  #{caption}" +
          "</figure></div>"
      super

  # register the plugin everywhere in contents
  env.registerContentPlugin 'posts', '**/*.*(markdown|mkd|md)', ImageTag

  # done!
  callback()
