module.exports = (env, callback) ->

  defaults =
    postsDir: 'articles' # directory containing blog posts

  # assign defaults for any option not set in the config file
  options = env.config.blog or {}
  for key, value of defaults
    options[key] ?= defaults[key]

  class IntroDetection extends env.plugins.MarkdownPage
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
  env.registerContentPlugin 'posts', prefix + '**/*.*(markdown|mkd|md)', IntroDetection

  # done!
  callback()
