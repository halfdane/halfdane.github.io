module.exports = (env, callback) ->
  defaults =
    postsDir: 'articles' # directory containing blog posts

  # assign defaults for any option not set in the config file
  options = env.config.blog or {}
  for key, value of defaults
    options[key] ?= defaults[key]

  class ImageTag extends env.plugins.IntroDetection
    @image: (imgUrl, altText, caption) ->
      return "<figure class=\"cap-left\">[![#{altText}](#{imgUrl})](#{imgUrl})<figcaption><p>#{caption}</p></figcaption></figure>"

    getHtml: (base = env.config.baseUrl) ->
      pattern = ///
        \{%\s*image\s*  # beginning of opening tag
        (\S*)\s*        # first parm is img url
        "([^"]*)"\s*    # second parm is alt text surrounded by "
        [^%]*%}         # skip everything till end of opening tag
        ([\s\S]*?)       # everything between tags is caption
        \{%\s*endimage\s*%\} # closing tag
        ///gm

      @markdown = @markdown.replace pattern, (match, imgUrl, altText, caption) =>
        ImageTag.image(imgUrl, altText, caption)

      @markdown = @markdown.replace /\|\s*image\s*\|\s*([^|]*?)\|([^|]*?)\s*\|\s*([^|]*?)\s*\|/gm, (match, imgUrl, altText, caption) =>
        ImageTag.image(imgUrl, altText, caption)

      super

  # register the plugin
  env.registerContentPlugin 'posts', '**/*.*(markdown|mkd|md)', ImageTag

  # done!
  callback()
