import type { StorybookConfig } from '@storybook/nextjs-vite';
import tailwindcss from '@tailwindcss/postcss';

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: "@storybook/nextjs-vite",
  staticDirs: [
    "../public"
  ],
  core: {
    disableTelemetry: true,
  },
  async viteFinal(config) {
    return {
      ...config,
      css: {
        postcss: {
          plugins: [tailwindcss()],
        },
      },
    };
  },
};
export default config;