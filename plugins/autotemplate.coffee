module.exports = (env, callback) ->

  moment.lang('de')

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
        [^%]*%}         # skip everything till end of opening tag
        ([\s\S]*?)       # everything between tags is caption
        \{%\s*endimage\s*%\} # closing tag
        ///gm

      @markdown = @markdown.replace pattern, (match, imgUrl, altText, caption) =>
        "<figure class=\"cap-left\">
            [![#{altText}](#{imgUrl})](#{imgUrl})
            <figcaption><p>#{caption}</p></figcaption>
        </figure>"
      super

    @property 'intro', 'getIntro'
    getIntro: (base) ->
      html = @getHtml(base)
      cutoffs = ['</p>', '<span class="more', '<h2', '<hr']
      idx = Infinity
      for cutoff in cutoffs
        i = html.indexOf cutoff
        if i isnt -1 and i < idx
          idx = i
      if idx isnt Infinity
        return html.substr 0, idx
      else
        return html

  # register the plugin
  prefix = if options.postsDir then options.postsDir + '/' else ''
  env.registerContentPlugin 'posts', prefix + '**/*.*(markdown|mkd|md)', BlogpostPage

  # done!
  callback()
