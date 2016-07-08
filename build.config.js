module.exports = {
    entry: './index.js',
    output: {
        filename: './bundle.js'
    },
    module: {
        loaders: require('./loaders.config')
    },
    externals: {
        'react' : 'React',
        'moment': 'moment'
    },
    resolve: {
        // Allow to omit extensions when requiring these files
        extensions: ['', '.js', '.jsx']
    }
}