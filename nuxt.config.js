import { name, version } from './package.json'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode

  ssr: false,
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  server: {
    port: process.env.PORT || 5000 // default: 3000
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'openmozart.net',
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: ''
      },
      {
        name: 'format-detection',
        content: 'telephone=no'
      },
      // https://realfavicongenerator.net/
      {
        name: 'apple-mobile-web-app-title',
        content: 'openmozart'
      },
      {
        name: 'application-name',
        content: 'openmozart'
      },
      {
        name: 'msapplication-TileColor',
        content: '#160804'
      },
      {
        name: 'msapplication-config',
        content: '/favicon/browserconfig.xml?v=3'
      },
      {
        name: 'theme-color',
        content: '#160804'
      }
    ],
    link: [
      // https://realfavicongenerator.net/
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/favicon/apple-touch-icon.png?v=3'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon/favicon-32x32.png?v=3'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon/favicon-16x16.png?v=3'
      },
      {
        rel: 'manifest',
        href: '/favicon/site.webmanifest?v=3'
      },
      {
        rel: 'mask-icon',
        href: '/favicon/safari-pinned-tab.svg?v=3',
        color: '#160804'
      },
      {
        rel: 'shortcut icon',
        href: '/favicon/favicon.ico?v=3'
      },
      //
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://cdn.jsdelivr.net/npm/bootstrap@latest/dist/css/bootstrap.min.css'
      }
    ],
    script: [
      {
        src: 'https://cdn.jsdelivr.net/npm/@popperjs/core@latest/dist/umd/popper.min.js',
        type: 'text/javascript'
      },
      {
        src: 'https://cdn.jsdelivr.net/npm/bootstrap@latest/dist/js/bootstrap.min.js',
        type: 'text/javascript'
      },
      {
        type: 'text/javascript',
        src: '/js/close-pixelate.js'
      }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/css/fonts.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://google-fonts.nuxtjs.org/
    '@nuxtjs/google-fonts',
    // https://github.com/shakee93/vue-toasted
    '@nuxtjs/toast'
  ],

  googleFonts: {
    display: 'block', // 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
    preload: true,
    prefetch: true,
    preconnect: true,
    download: true,
    base64: true,
    inject: true,
    families: {
      'IM+Fell+English+SC': true,
      // 'Roboto+Slab': true,
      // 'Inconsolata': true,
      // 'Birthstone+Bounce': true,
      'Roboto+Mono:wght@700': true,
      Arvo: true
    }
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, { isDev, isClient }) {
      // https://www.npmjs.com/package/yaml-loader
      config.module.rules.push({
        test: /\.ya?ml$/,
        type: 'json', // Required by Webpack v4
        use: 'yaml-loader'
      })
    }
  },

  publicRuntimeConfig: {
    packageName: name,
    packageVersion: version
  },
  privateRuntimeConfig: {
  }
}
