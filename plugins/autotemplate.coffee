module.exports = (env, callback) ->

  defaults =
    postsDir: 'articles' # directory containing blog posts
    template: 'article.jade'
    filenameTemplate: '/:year/:month/:day/{{page.metadata.short_dir}}/index.html' # Here's the magic part

  # assign defaults for any option not set in the config file
  options = env.config.blog or {}
  for key, value of defaults
    options[key] ?= defaults[key]

  class BlogpostPage extends env.plugins.MarkdownPage

    constructor: (@filepath, @metadata) ->
      p = /articles\/(\d\d\d\d-\d\d-\d\d)-(.*)\/index.md/.exec @filepath.relative
      # extract date and url-part from directory name
      @metadata.date = p[1]
      @metadata.short_dir = p[2]
      super

    getTemplate: ->
      @metadata.template or options.template or super()

    getFilenameTemplate: ->
      @metadata.filenameTemplate or options.filenameTemplate or super()

    getHtml: (base=env.config.baseUrl) ->
      pattern = ///
        \{%\s*image\s*  # beginning of opening tag
        (\S*)\s*        # first parm is img url
        "([^"]*)"\s*    # second parm is alt text surrounded by "
        "([^"]*)"\s*    # third parm are additional css classes for the figure tag surrounded by "
        %}              # end of opening tag
        ([\s\S]*)       # everything between tags is caption
        \{%\s*endimage\s*%\} # closing tag
        ///gm

      @markdown = @markdown.replace pattern, (match, imgUrl, altText, cssClasses, caption) =>
        "<figure class=\"cap-left #{cssClasses}\">
            <a class=\"lightbox\" href=\"#{imgUrl}\">![#{altText}](#{imgUrl})</a>
            <figcaption><p>#{caption}</p></figcaption>
        </figure>"
      super

  # register the plugin
  prefix = if options.postsDir then options.postsDir + '/' else ''
  env.registerContentPlugin 'posts', prefix + '**/*.*(markdown|mkd|md)', BlogpostPage

  # done!
  callback()
