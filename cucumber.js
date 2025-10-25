module.exports = {
  default: {
    requireModule: ['@babel/register'],
    require: [
      'features/support/**/*.js', // Load support files first
      'features/step_definitions/**/*.js',
    ],
    format: ['progress-bar'],
  },
};