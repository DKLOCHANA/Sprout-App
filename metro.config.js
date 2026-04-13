// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure react-native condition is used for package exports resolution
config.resolver.unstable_conditionNames = ['react-native', 'browser', 'require'];

module.exports = config;
