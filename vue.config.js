module.exports = {
  devServer: {
    proxy: {
      "https://karin.nkmr.io": {
        target: "http://localhost:8080",
      },
      "https://funazaki.nkmr.io": {
        target: "http://localhost:8080",
      }
    }
  },

  transpileDependencies: [
    'vuetify'
  ],
  publicPath: './'
}
