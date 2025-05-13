module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Disable source maps for problematic files
      if (webpackConfig.module && webpackConfig.module.rules) {
        // Find the source-map-loader rule
        const sourceMapRule = webpackConfig.module.rules.find(
          rule => rule.use && rule.use.some && rule.use.some(loader => 
            typeof loader === 'string' && loader.includes('source-map-loader')
          )
        );
        
        // If found, modify it to exclude problematic files
        if (sourceMapRule) {
          sourceMapRule.exclude = [
            /node_modules\/@mui\/system\/esm\/RtlProvider/,
            /node_modules\/@mui\/system\/esm\/index\.js/,
            /node_modules\/chart\.js\/dist\/chart\.js/
          ];
        }
      }
      
      // Configure to ignore source map warnings
      webpackConfig.ignoreWarnings = [
        ...(webpackConfig.ignoreWarnings || []),
        /Failed to parse source map/,
        /source-map-loader/
      ];
      
      return webpackConfig;
    },
  },
};