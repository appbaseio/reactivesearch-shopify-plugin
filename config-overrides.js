const {
    override,
    fixBabelImports,
  } = require("customize-cra");

module.exports = override(
    fixBabelImports("import", {
        libraryName: "antd", libraryDirectory: "es", style: 'css' // change importing css to less
    }),
    fixBabelImports("direct-import", {
        name: "@appbaseio/reactivesearch", indexFile: "@appbaseio/reactivesearch/lib/index.es.js"
    })
)
