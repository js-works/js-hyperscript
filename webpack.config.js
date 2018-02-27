const
    path = require('path'),
    FileManagerWebpackPlugin = require('filemanager-webpack-plugin');

module.exports = {
    mode: 'production',

    entry: {
        react: './src/main/__modules__/react.js',
        dio: './src/main/__modules__/dio.js',
        surface: './src/main/__modules__/surface.js',
        universal: './src/main/__modules__/universal.js'
    },

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
        library: ['jsHypertext', '[name]'],
        libraryTarget: 'umd'
    },

    optimization: {
        minimize: true
    },

    plugins: [
        new FileManagerWebpackPlugin({
            onStart: {
                delete: ['build', 'dist']
            },
            onEnd: {
                copy: [
                    {
                        source: 'build/*',
                        destination: 'dist'
                    }
                ]
            }
        })
    ],

    devServer: {
        contentBase: path.resolve(__dirname),
        openPage: 'src/demo/index.html',
        watchContentBase: false,
        lazy: false
    },

    externals: [
        {
            'js-hyperscript/react': true,
            'js-hyperscript/dio': true,
            'js-hyperscript/surface': true,
            'js-hyperscript/universal': true,

            'react': {
                root: 'React',
                commonjs2: 'react',
                commonjs: 'react',
                amd: 'react',
                umd: 'react'
            },
    
            'react-dom': {
                root: 'ReactDOM',
                commonjs2: 'react-dom',
                commonjs: 'react-dom',
                amd: 'react-dom'
            },

            'dio.js': {
                root: 'dio',
                commonjs2: 'dio.js',
                commonjs: 'dio.js',
                amd: 'dio.js'
            },

            'js-surface': {
                root: 'jsSurface',
                commonjs2: 'js-surface',
                commonjs: 'js-surface',
                amd: 'js-surface'
            }
        }
    ]
};
