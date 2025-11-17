const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Path alias desteği
config.resolver = {
  ...config.resolver,
  alias: {
    '@': path.resolve(__dirname),
  },
  // Zustand'ın CommonJS versiyonunu kullan
  sourceExts: [...(config.resolver?.sourceExts || []), 'cjs'],
};

// Transform import.meta
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

module.exports = config;

