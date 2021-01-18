const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",

  devtool: "eval-source-map",

  entry: [
    "webpack-dev-server/client?http://0.0.0.0:4040", // WebpackDevServer host and port
    "webpack/hot/only-dev-server", // "only" prevents reload on syntax errors
    "babel-polyfill", // 可以使用完整的ES6特性, 大概增加100KB
    "./src/index.js", // 编译的入口
  ],

  output: {
    // 输出的目录和文件名
    path: __dirname + "/dist",
    filename: "bundle.js",
  },

  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "src")], // import时到哪些地方去寻找模块
    extensions: [".js", ".jsx"], // require的时候可以直接使用require('file')，不用require('file.js')
    alias: {
      antdcss: "antd/dist/antd.min.css", // import时的别名
    },
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          // {
          //   loader: 'react-hot-loader'
          // },
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/react", "@babel/env"], // 开启ES6、部分ES7、react特性, preset相当于预置的插件集合
              plugins: [
                "@babel/plugin-proposal-function-bind",
                ["import", { libraryName: "antd", style: true }],
                [
                  "@babel/plugin-proposal-class-properties",
                  {
                    loose: true,
                  },
                ],
              ], // antd模块化加载, https://github.com/ant-design/babel-plugin-import
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: {
          loader: "style!css",
        },
      },
      {
        test: /\.less$/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader",
            options: {
              sourceMap: true,
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|svg)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 25000,
          },
        },
      },
    ],
  },

  plugins: [
    new webpack.BannerPlugin("This file is created by jxy"), // 生成文件时加上注释
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
      __DEV__: JSON.stringify(
        JSON.parse(process.env.NODE_ENV === "production" ? "false" : "true")
      ), // magic globals, 用于打印一些调试的日志, webpack -p时会删除
    }),
    // 生成html文件
    new HtmlWebpackPlugin({
      template: "index.html.template",
      title: "WebSocket Debug Tool",

      // HtmlWebpackPlugin自己有一个favicon属性, 但用起来有点问题, 所以自己重新搞个favIcon属性
      favIcon: "http://jxy.me/favicon.ico",
      // 这个属性也是我自己定义的, dev模式下要加载一些额外的js
      devMode: true,
    }),
  ],
};
