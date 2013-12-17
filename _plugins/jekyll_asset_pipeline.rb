require 'open3'
require 'jekyll_asset_pipeline'

module JekyllAssetPipeline

  class SassConverter < JekyllAssetPipeline::Converter

    def self.filetype
      '.scss'
    end

    def convert
      # Add path to the compiled file
      # Waiting for: https://github.com/matthodan/jekyll-asset-pipeline/pull/22
      dirname = "_assets/scss"

      # Get compiled output from stdout
      command = "sass -s --compass --scss -I " + dirname
      o, e, s = Open3.capture3(command, :stdin_data => @content)
      puts(<<-eos
SASS Error >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
#{e}
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SASS Error
      eos
      ) if e.length > 0
      return o
    end
  end
end
