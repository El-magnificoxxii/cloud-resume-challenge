/** @type {import('postcss').Config} */
export default {
  plugins: {
    'postcss-preset-env': {
      stage: 1,
      features: {
        'custom-media-queries': true, // enables @custom-media
        'nesting-rules': true
      }
    }
  }
};