module.exports = {
    entry: './index.js',
    output: {
        publicPath: 'http://localhost:8090/assets'
    },
    module: {
        loaders: require('./loaders.config')
    },
    externals: {
        'react' : 'React'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
}