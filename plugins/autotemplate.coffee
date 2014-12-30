module.exports = (env, callback) ->

  moment.lang('de')

  defaults =
    postsDir: 'articles' # directory containing blog posts
    template: 'article.jade'

  # assign defaults for any option not set in the config file
  options = env.config.blog or {}
  for key, value of defaults
    options[key] ?= defaults[key]

  class AutotemplatePage extends env.plugins.CustomTags
    constructor: (@filepath, @metadata) ->
      # extract date and url-part from directory name
      @metadata.http_dir = ( /(.*)\/[^/]*\.md/.exec @filepath.relative )[1]
      @metadata.date = (/articles\/(\d\d\d\d-\d\d-\d\d)-(.*)/.exec @metadata.http_dir)[1]

      if (@metadata.image && @metadata.image.indexOf('http') < 0)
        @metadata.imageUrl = "#{@metadata.http_dir}/#{@metadata.image}"
      else
        @metadata.imageUrl = @metadata.image
      super

    getTemplate: ->
      @metadata.template or options.template or super()

    getFilenameTemplate: ->
      super()

  # register the plugin
  prefix = if options.postsDir then options.postsDir + '/' else ''
  env.registerContentPlugin 'posts', prefix + '**/*.*(markdown|mkd|md)', AutotemplatePage

  # done!
  callback()
