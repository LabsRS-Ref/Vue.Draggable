const config = {
  publicPath: "./",
  configureWebpack: { 
    output: {
      libraryExport: 'default'
    }
  },
  devServer: {
    disableHostCheck: true // 解决无法在replit暴露端口的问题
  },
}

if (process.env.NODE_ENV === "production") {
  config.configureWebpack.externals = {
    sortablejs: {
      commonjs: "sortablejs",
      commonjs2: "sortablejs",
      amd: "sortablejs",
      root: "Sortable"
    }
  };
};

module.exports = config;