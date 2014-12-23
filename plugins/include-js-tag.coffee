module.exports = (env, callback) ->
  class IncludeJsTag extends env.plugins.ImageTag
    getHtml: (base = env.config.baseUrl) ->
      # Replace |image|url|alt|caption| with proper html
      @markdown = @markdown.replace ///\|\s*include-js\s*   # detect image information
            \|\s*([^|]*?)\s*\|                                # 1. parm is url
            ///gm, (match, matched_url) =>
        url = if /\/\//.test(matched_url) || /^\//.test(matched_url)  then "#{matched_url}" else "#{@metadata.http_dir}/#{matched_url}"
        "<script type=\"text/javascript\" src=\"#{url}\"></script>"
      super

  # register the plugin everywhere in contents
  env.registerContentPlugin 'posts', '**/*.*(markdown|mkd|md)', IncludeJsTag

  # done!
  callback()
