var path = require("path");
var webpack = require("webpack");

// WebPack Configuration
module.exports = {
    entry: "./build/index.js",
    output: {
        filename: "dist/gd-sprest-js.js",
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ]
            },
            {
                test: /\.jsx?/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["es2015"]
                        }
                    }
                ]
            }
        ]
    }
}