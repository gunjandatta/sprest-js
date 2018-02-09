var path = require("path");
var webpack = require("webpack");

// WebPack Configuration
module.exports = {
    entry: "./test/index.ts",
    output: {
        filename: "test.js",
        path: path.resolve(__dirname, "test")
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
                test: /\.tsx?/,
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