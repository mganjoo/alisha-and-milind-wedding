module.exports = {
  webpack: async (config) => {
    const babelPlugins = [
      // use @babel/plugin-proposal-class-properties for class arrow functions
      require.resolve("@babel/plugin-proposal-class-properties"),
      // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
      require.resolve("babel-plugin-remove-graphql-queries"),
    ]

    // Configure rule 0 (.mjs, .js, .jsx) for gatsby
    // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
    // (Fix from https://github.com/storybookjs/storybook/issues/5949#issuecomment-500869039)
    config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/]

    // use installed babel-loader which is v8.0-beta (which is meant to work with @babel/core@7)
    config.module.rules[0].use[0].loader = require.resolve("babel-loader")

    // By default @babel/preset-env is configured to add additional imports for polyfills ("usage").
    // For transpiling Gatsby, configure preset to not add polyfills
    // (https://babeljs.io/docs/en/babel-preset-env#usebuiltins)
    config.module.rules[0].use[0].options.presets = [
      require.resolve("@babel/preset-react"),
      require.resolve("@babel/preset-env"),
    ]

    config.module.rules[0].use[0].options.plugins = babelPlugins

    // Prefer Gatsby ES6 entrypoint (module) over commonjs (main) entrypoint
    config.resolve.mainFields = ["browser", "module", "main"]

    // Add TypeScript support
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve("babel-loader"),
      options: {
        presets: [["react-app", { flow: false, typescript: true }]],
        plugins: babelPlugins,
      },
    })

    config.resolve.extensions.push(".ts", ".tsx")

    return config
  },
}
