module.exports = (env, callback) ->
  class ImageTag extends env.plugins.IntroDetection
    getHtml: (base = env.config.baseUrl) ->
      # Replace |image|url|alt|caption| with proper html
      @markdown = @markdown.replace ///\|\s*image\s*\   # detect image information
            |\s*([^|]*?)\                               # 1. parm is url
            |([^|]*?)\s*\                               # 2. is alt-text
            |\s*([^|]*?)\s*\|                           # everything else is caption
            ///gm, (match, imgUrl, altText, caption) =>
        console.log("imageUrl", imgUrl)
        "  <figure class=\"cap-left\">" +
          "  [![#{altText}](#{@metadata.http_dir}/#{imgUrl})](#{@metadata.http_dir}/#{imgUrl})" +
          "  <figcaption>#{caption}</figcaption>" +
          "</figure>"
      super

  # register the plugin everywhere in contents
  env.registerContentPlugin 'posts', '**/*.*(markdown|mkd|md)', ImageTag

  # done!
  callback()
