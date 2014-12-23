module.exports = (env, callback) ->
  class ImageTag extends env.plugins.IntroDetection
    getHtml: (base = env.config.baseUrl) ->
      # Replace |image|url|alt|caption| with proper html
      @markdown = @markdown.replace ///\|\s*image\s*\   # detect image information
            |\s*([^|]*?)\                               # 1. parm is url
            |([^|]*?)\s*\                               # 2. is alt-text
            |\s*([^|]*?)\s*\|                           # everything else is caption
            ///gm, (match, imgUrl, altText, caption) =>
        url = if /^http/.test(imgUrl) then "#{imgUrl}" else "#{@metadata.http_dir}/#{imgUrl}"
        caption = if /./.test(caption) then "<figcaption>#{caption}</figcaption>" else ""
        "<figure class=\"cap-left\">" +
          "  [![#{altText}](#{url})](#{url})" +
          "  #{caption}" +
          "</figure>"
      super

  # register the plugin everywhere in contents
  env.registerContentPlugin 'posts', '**/*.*(markdown|mkd|md)', ImageTag

  # done!
  callback()
