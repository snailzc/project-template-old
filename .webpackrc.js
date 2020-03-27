const path = require("path");

export default {
  "entry": "./src/index.js",
  "extraBabelPlugins": [
    ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true }]
  ],
  es5ImcompatibleVersions: true,
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr"
      ]
    },
  },
  define: {
    'process.env': {},
    /*cannot set NODE_ENV for userDefined*/
    'process.env.NODE_ENV': process.env.NODE_ENV,
    'process.env.API_ENV': process.env.API_ENV,
  },
  "ignoreMomentLocale": true,
  "theme": "./src/theme.js",
  "html": {
    "template": "./src/index.ejs"
  },
  "disableDynamicImport": true,
  "hash": true,
  "proxy": {
    "/": {
      "changeOrigin": true,
      "target":  'http://10.106.11.110:31000',
      "pathRewrite": { "^": "" }
    }
  },
  alias: {
    '~': path.resolve(__dirname, 'src'),
  }
}
