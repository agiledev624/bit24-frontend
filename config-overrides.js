var {
  override,
  useEslintRc,
  addWebpackAlias,
  addDecoratorsLegacy,
  removeModuleScopePlugin,
  addLessLoader,
  addWebpackModuleRule,
} = require("customize-cra");
var path = require("path");

module.exports = override(
  //@babel/plugin-proposal-decorators is required
  addDecoratorsLegacy(),
  useEslintRc(path.resolve(__dirname, ".eslintrc")),
  addWebpackAlias({
    // eslint-disable-next-line no-useless-computed-key
    ["@"]: path.resolve(__dirname, "src"),
  }),
  addLessLoader(),
  addWebpackModuleRule({
    test: /\.s[ac]ss$/i,
    use: [
      // Creates `style` nodes from JS strings
      "style-loader",
      // Translates CSS into CommonJS
      "css-loader",
      // Compiles Sass to CSS
      "sass-loader",
    ],
  }),
  addWebpackModuleRule({
    test: /\.worker\.js$/i,
    use: {
      loader: "worker-loader",
    },
  }),
  removeModuleScopePlugin()
);
