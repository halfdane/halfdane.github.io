module.exports = (env, callback) ->
  class IncludeJsTag extends env.plugins.ImageTag
    getHtml: (base = env.config.baseUrl) ->
      # Replace |image|url|alt|caption| with proper html
      @markdown = @markdown.replace ///\|\s*include-js\s*   # detect image information
            \|\s*([^|]*?)\s*\|                                # 1. parm is url
            ///gm, (match, js_url) =>
        url = if /\/\//.test(js_url) then "#{js_url}" else "#{@metadata.http_dir}/#{js_url}"
        "<script type=\"text/javascript\" src=\"#{url}\"></script>"
      super

  # register the plugin everywhere in contents
  env.registerContentPlugin 'posts', '**/*.*(markdown|mkd|md)', IncludeJsTag

  # done!
  callback()
