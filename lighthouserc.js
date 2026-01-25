/**
 * Lighthouse CI Configuration
 * Performance testing configuration for web applications
 *
 * @module LighthouseConfig
 * @description Configuration for automated performance testing
 */

module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/auth/login',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/myaccount',
        'http://localhost:3000/wallet',
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        throttling: {
          cpuSlowdownMultiplier: 1,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
        emulatedUserAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36',
      },
    },

    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.8 }],
        'categories:pwa': ['warn', { minScore: 0.7 }],

        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'first-meaningful-paint': ['error', { maxNumericValue: 2500 }],
        'speed-index': ['error', { maxNumericValue: 3400 }],
        interactive: ['error', { maxNumericValue: 3800 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],

        // Accessibility
        'color-contrast': ['error', { minScore: 1 }],
        'heading-order': ['error', { minScore: 1 }],
        'image-alt': ['error', { minScore: 1 }],
        label: ['error', { minScore: 1 }],
        'link-name': ['error', { minScore: 1 }],

        // Best Practices
        'errors-in-console': ['error', { maxLength: 0 }],
        'inspector-issues': ['error', { maxLength: 0 }],
        'js-libraries': ['warn', { maxLength: 5 }],
        'notification-on-start': ['error', { maxLength: 0 }],
        'password-inputs-can-be-pasted-into': ['error', { minScore: 1 }],
        'uses-http2': ['error', { minScore: 1 }],
        'uses-passive-event-listeners': ['error', { minScore: 1 }],

        // SEO
        'document-title': ['error', { minScore: 1 }],
        hreflang: ['error', { minScore: 1 }],
        'image-alt': ['error', { minScore: 1 }],
        'is-crawlable': ['error', { minScore: 1 }],
        'link-text': ['error', { minScore: 1 }],
        'meta-description': ['error', { minScore: 1 }],
        'robots-txt': ['error', { minScore: 1 }],
        'structured-data': ['warn', { minScore: 0.5 }],
        'tap-targets': ['error', { minScore: 1 }],
      },
    },

    upload: {
      target: 'temporary-public-storage',
    },

    server: {
      port: 9001,
    },
  },
};
