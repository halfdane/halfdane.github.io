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

  class AutotemplatePage extends env.plugins.IncludeJsTag
    constructor: (@filepath, @metadata) ->
      p = /articles\/(\d\d\d\d-\d\d-\d\d)-(.*)\/index.md/.exec @filepath.relative
      # extract date and url-part from directory name
      @metadata.date = p[1]
      @metadata.short_dir = p[2]
      @metadata.http_dir= "/articles/#{p[1]}-#{p[2]}"

      if (@metadata.image && @metadata.image.indexOf('http') < 0)
        @metadata.imageUrl = "#{@metadata.http_dir}/#{@metadata.image}"
      else
        @metadata.imageUrl = @metadata.image
      super

    getTemplate: ->
      @metadata.template or options.template or super()

    getFilenameTemplate: ->
      @metadata.filenameTemplate or options.filenameTemplate or super()

  # register the plugin
  prefix = if options.postsDir then options.postsDir + '/' else ''
  env.registerContentPlugin 'posts', prefix + '**/*.*(markdown|mkd|md)', AutotemplatePage

  # done!
  callback()
