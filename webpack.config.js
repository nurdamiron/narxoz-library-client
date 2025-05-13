// This is a custom webpack config to resolve missing modules
const path = require('path');

module.exports = {
  // Disable source maps
  devtool: false,
  
  // Module resolution configuration
  resolve: {
    alias: {
      // Alias for missing @mui/system/RtlProvider
      '@mui/system/RtlProvider': path.resolve(__dirname, 'src/mui-compat.js'),
      '@mui/system': path.resolve(__dirname, 'node_modules/@mui/system'),
      
      // Alias for chart.js
      'chart.js': path.resolve(__dirname, 'src/components/admin/common/chartjs-mock'),
      'react-chartjs-2': path.resolve(__dirname, 'src/components/admin/common/chartjs-mock')
    },
    fallback: {
      '@mui/system': path.resolve(__dirname, 'src/mui-compat.js')
    }
  },
  
  // Disable source maps for problematic modules
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: [
          // Exclude problematic modules that are causing source map errors
          /node_modules\/@mui\/system\/esm\/RtlProvider/,
          /node_modules\/@mui\/system\/esm\/index\.js/,
          /node_modules\/chart\.js\/dist\/chart\.js/,
          /node_modules\/@mui\/x-date-pickers/
        ],
        use: ['source-map-loader']
      }
    ]
  },
  
  // Ignore source map warnings completely
  ignoreWarnings: [
    // Suppress source map warnings
    /Failed to parse source map/,
    /source-map-loader/,
    /Module not found/
  ],
};