module.exports = {
    lintOnSave: false,

    devServer: {
        host: 'localhost'
    },

    runtimeCompiler: true,

    pluginOptions: {
        quasar: {}
    },

    transpileDependencies: [
        /[\\\/]node_modules[\\\/]quasar[\\\/]/
    ],


    pwa: {
        name: 'Vue Argon Design',
        themeColor: '#172b4d',
        msTileColor: '#172b4d',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: '#172b4d'
    },
    css: {
        // Enable CSS source maps.
        sourceMap: process.env.NODE_ENV !== 'production'
    }
}