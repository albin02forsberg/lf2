// Configure PostCSS to use Tailwind CSS v4 plugin
// Using object form ensures PostCSS correctly loads the plugin module.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
