module.exports = (env, callback) ->

  class SplitPage extends env.plugins.ImageTag

    getHtml: (base = env.config.baseUrl) ->
      theHtml = super

      path = require('path')
      targetDir = 'contents/' + path.dirname(@filepath.relative)

      splitExpression = '<h2'
      result = theHtml.split(splitExpression);
      firstParagraph = result.shift()

      if result.length>0
        for index in [1..result.length]
          paragraph = result[index-1]

          splitFile = "/part#{index}.html"

          console.log("writing to #{splitFile}")

          fs = require('fs')
          fs.writeFile targetDir + splitFile, splitExpression + paragraph, (error) ->
            console.error("Error writing file", error) if error

      return firstParagraph

  # register the plugin
  env.registerContentPlugin 'posts', '**/*.*(markdown|mkd|md)', SplitPage

  # done!
  callback()
