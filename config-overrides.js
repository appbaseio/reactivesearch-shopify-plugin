const {
    override,
    fixBabelImports,
  } = require("customize-cra");

const publicPathPlugin = (config, env) => {
    config.output.filename = 'static/js/[name].js';
    config.plugins[4].filename = 'static/css/[name].css';
    return config
}

module.exports = override(
    fixBabelImports("import", {
        libraryName: "antd", libraryDirectory: "es", style: 'css' // change importing css to less
    }),
    fixBabelImports("direct-import", {
        name: "@appbaseio/reactivesearch", indexFile: "@appbaseio/reactivesearch/lib/index.es.js"
    }),
    publicPathPlugin,
)
