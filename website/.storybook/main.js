module.exports = {
  stories: ["../src/components/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-actions",
    "@storybook/addon-backgrounds",
    "@storybook/addon-knobs",
    "@storybook/addon-links",
    "@storybook/addon-viewport",
  ],
  webpackFinal: async (config) => {
    // Configure rule 0 (.mjs, .js, .jsx) for gatsby
    // (warning: this reference by index is very brittle and may not work with package upgrades)
    // Transpile Gatsby module (because it contains ES6 code (exclude all node modules *except* gatsby)
    // (Fix from https://github.com/storybookjs/storybook/issues/5949#issuecomment-500869039)
    config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/]
    // By default @babel/preset-env is configured to add additional imports for polyfills ("usage").
    // For transpiling Gatsby, configure preset to not add polyfills (https://babeljs.io/docs/en/babel-preset-env#usebuiltins)
    config.module.rules[0].use[0].options.presets = [
      require.resolve("@babel/preset-env"),
      require.resolve("@babel/preset-react"),
    ]
    // Remove static queries from components when rendering in storybook
    config.module.rules[0].use[0].options.plugins.push(
      // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
      require.resolve("babel-plugin-remove-graphql-queries")
    )
    // Set up CSS module support
    const scopedName = `[name]--[local]--[hash:base64:5]`
    const reactCssModulesPlugin = [
      require.resolve("babel-plugin-react-css-modules"),
      {
        webpackHotModuleReloading: true,
        generateScopedName: scopedName,
      },
    ]
    config.module.rules[0].use[0].options.plugins.push(reactCssModulesPlugin)

    // Configure css rule to use postcss-loader (for Tailwind)
    // First, remove existing CSS rule
    config.module.rules = config.module.rules.filter(
      (f) => f.test.toString() !== "/\\.css$/"
    )
    // Then add PostCSS config for all non-module CSS files
    config.module.rules.push({
      test: /\.css$/,
      exclude: /\.module\.css$/,
      loaders: [
        "style-loader",
        {
          loader: "css-loader",
          options: { importLoaders: 1 },
        },
        "postcss-loader",
      ],
    })
    // Then add module CSS config
    config.module.rules.push({
      test: /\.module\.css$/,
      loaders: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            importLoaders: 1,
            modules: true,
            localIdentName: scopedName,
          },
        },
        "postcss-loader",
      ],
    })

    // Typescript support
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve("babel-loader"),
          options: {
            presets: [["react-app", { flow: false, typescript: true }]],
            plugins: [
              require.resolve("@babel/plugin-proposal-class-properties"),
              require.resolve("babel-plugin-remove-graphql-queries"),
              reactCssModulesPlugin,
            ],
          },
        },
      ],
    })
    config.resolve.extensions.push(".ts", ".tsx")

    return config
  },
}
