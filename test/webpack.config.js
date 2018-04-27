var path = require("path");
var webpack = require("webpack");

// WebPack Configuration
module.exports = {
    entry: "./test/index.ts",
    output: {
        filename: "test/test.js",
    },
    module: {
        loaders: [
            {
                test: /\.s?css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    { loader: "sass-loader" }
                ]
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["es2015"]
                        }
                    },
                    {
                        loader: "ts-loader"
                    }
                ]
            }
        ]
    }
}