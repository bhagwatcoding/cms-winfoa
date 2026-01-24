/**
 * Professional Multi-Subdomain Application Configuration
 * Enterprise-grade configuration for scalable web applications
 * 
 * @module AppConfig
 * @description Main configuration file for the professional application architecture
 * @version 3.0.0
 */

// =============================================================================
// APPLICATION CONFIGURATION
// =============================================================================

/**
 * 🚀 MAIN APPLICATION CONFIGURATION
 * 
 * This file serves as the central configuration for the professional
 * multi-subdomain application architecture.
 * 
 * ARCHITECTURE OVERVIEW:
 * - Modular subdomain-based structure
 * - Performance-optimized build configuration
 * - Enterprise-grade security implementation
 * - Scalable component architecture
 * - Professional UI/UX design system
 */

export const APP_CONFIG = {
  // Application metadata
  name: 'Winfoa Multi-Subdomain Platform',
  version: '3.0.0',
  description: 'Professional enterprise-grade multi-subdomain application',
  
  // Domain configuration
  domains: {
    production: 'yourdomain.com',
    staging: 'staging.yourdomain.com',
    development: 'localhost:3000',
  },
  
  // Subdomain configuration
  subdomains: {
    auth: {
      name: 'Authentication Portal',
      url: 'auth.yourdomain.com',
      description: 'User authentication and onboarding',
      theme: 'auth',
    },
    dashboard: {
      name: 'Main Dashboard',
      url: 'app.yourdomain.com',
      description: 'Primary application interface',
      theme: 'dashboard',
    },
    god: {
      name: 'Super Admin Panel',
      url: 'god.yourdomain.com',
      description: 'System administration and control',
      theme: 'admin',
    },
    myaccount: {
      name: 'User Account',
      url: 'account.yourdomain.com',
      description: 'Personal account management',
      theme: 'account',
    },
    ump: {
      name: 'User Management',
      url: 'ump.yourdomain.com',
      description: 'User and role management',
      theme: 'management',
    },
    wallet: {
      name: 'Financial Services',
      url: 'wallet.yourdomain.com',
      description: 'Financial transactions and services',
      theme: 'financial',
    },
  },
  
  // Performance configuration
  performance: {
    // Bundle optimization
    codeSplitting: true,
    lazyLoading: true,
    treeShaking: true,
    
    // Caching strategies
    staticCache: '1y',
    apiCache: '5m',
    dynamicCache: '1h',
    
    // Image optimization
    imageFormats: ['avif', 'webp'],
    imageSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Font optimization
    fontDisplay: 'swap',
    fontPreload: true,
  },
  
  // Security configuration
  security: {
    // Headers
    securityHeaders: true,
    corsProtection: true,
    csrfProtection: true,
    
    // Rate limiting
    rateLimiting: true,
    rateLimitWindow: 15 * 60 * 1000, // 15 minutes
    rateLimitMax: 100,
    
    // Authentication
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    maxLoginAttempts: 5,
    
    // Encryption
    bcryptRounds: 12,
    jwtExpiry: '7d',
  },
  
  // UI/UX configuration
  ui: {
    // Design system
    designSystem: 'Radix UI + Tailwind CSS',
    themeSupport: true,
    darkMode: true,
    
    // Responsive design
    mobileFirst: true,
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    
    // Accessibility
    wcagCompliance: 'AA',
    keyboardNavigation: true,
    screenReaderSupport: true,
    
    // Performance UX
    skeletonLoading: true,
    optimisticUpdates: true,
    progressiveEnhancement: true,
  },
  
  // Development configuration
  development: {
    // Debugging
    debugMode: process.env.NODE_ENV === 'development',
    sourceMaps: process.env.NODE_ENV === 'development',
    
    // Hot reload
    fastRefresh: true,
    devIndicators: true,
    
    // Testing
    testCoverage: 80,
    testTimeout: 10000,
  },
  
  // Monitoring and analytics
  monitoring: {
    // Performance monitoring
    webVitals: true,
    errorTracking: true,
    performanceMetrics: true,
    
    // Analytics
    userAnalytics: true,
    customEvents: true,
    conversionTracking: true,
  },
} as const;

// =============================================================================
// SUBDOMAIN-SPECIFIC CONFIGURATIONS
// =============================================================================

/**
 * Subdomain-specific configuration overrides
 */
export const SUBDOMAIN_CONFIG = {
  auth: {
    // Authentication subdomain configuration
    publicRoutes: ['/login', '/register', '/forgot-password', '/reset-password'],
    protectedRoutes: [],
    rateLimit: { max: 50, window: 15 * 60 * 1000 }, // Stricter for auth
    security: {
      csrfProtection: true,
      captcha: true,
    },
    ui: {
      layout: 'auth',
      showSidebar: false,
      theme: 'auth',
    },
  },
  
  dashboard: {
    // Main dashboard configuration
    publicRoutes: [],
    protectedRoutes: ['/*'],
    rateLimit: { max: 300, window: 15 * 60 * 1000 },
    ui: {
      layout: 'dashboard',
      showSidebar: true,
      theme: 'dashboard',
    },
  },
  
  god: {
    // Super admin configuration
    publicRoutes: [],
    protectedRoutes: ['/*'],
    requiredRole: 'god',
    rateLimit: { max: 100, window: 15 * 60 * 1000 }, // Lower for admin
    security: {
      auditLogging: true,
      ipWhitelist: false, // Can be enabled for extra security
    },
    ui: {
      layout: 'admin',
      showSidebar: true,
      theme: 'admin',
    },
  },
  
  myaccount: {
    // User account configuration
    publicRoutes: [],
    protectedRoutes: ['/*'],
    requiredRole: 'user',
    rateLimit: { max: 300, window: 15 * 60 * 1000 },
    ui: {
      layout: 'account',
      showSidebar: true,
      theme: 'account',
    },
  },
  
  ump: {
    // User management configuration
    publicRoutes: [],
    protectedRoutes: ['/*'],
    requiredRole: 'admin',
    rateLimit: { max: 200, window: 15 * 60 * 1000 },
    ui: {
      layout: 'management',
      showSidebar: true,
      theme: 'management',
    },
  },
  
  wallet: {
    // Financial services configuration
    publicRoutes: [],
    protectedRoutes: ['/*'],
    requiredRole: 'user',
    rateLimit: { max: 150, window: 15 * 60 * 1000 }, // Lower for financial
    security: {
      csrfProtection: true,
      auditLogging: true,
      twoFactorAuth: true,
    },
    ui: {
      layout: 'financial',
      showSidebar: true,
      theme: 'financial',
    },
  },
} as const;

// =============================================================================
// PERFORMANCE METRICS
// =============================================================================

/**
 * Performance targets and metrics
 */
export const PERFORMANCE_METRICS = {
  // Core Web Vitals targets
  coreWebVitals: {
    lcp: 2500, // Largest Contentful Paint (ms)
    fid: 100,  // First Input Delay (ms)
    cls: 0.1,  // Cumulative Layout Shift
    fcp: 1800, // First Contentful Paint (ms)
    ttfb: 600, // Time to First Byte (ms)
  },
  
  // Application-specific metrics
  application: {
    pageLoadTime: 3000,      // Page load time (ms)
    apiResponseTime: 500,   // API response time (ms)
    bundleSize: 500,        // Initial bundle size (KB)
    imageLoadTime: 1000,    // Image load time (ms)
  },
  
  // User experience metrics
  userExperience: {
    timeToInteractive: 3500, // Time to Interactive (ms)
    perceivedLoadTime: 2000, // Perceived load time (ms)
    errorRate: 0.01,         // Error rate (1%)
    bounceRate: 0.3,         // Bounce rate (30%)
  },
} as const;

// =============================================================================
// DEPLOYMENT CONFIGURATION
// =============================================================================

/**
 * Deployment and environment configuration
 */
export const DEPLOYMENT_CONFIG = {
  // Environment detection
  environment: process.env.NODE_ENV || 'development',
  
  // Build configuration
  build: {
    optimize: process.env.NODE_ENV === 'production',
    analyze: process.env.ANALYZE === 'true',
    profile: process.env.PROFILE === 'true',
  },
  
  // CDN configuration
  cdn: {
    enabled: process.env.NODE_ENV === 'production',
    domain: process.env.CDN_DOMAIN || '',
    cacheDuration: '1y',
  },
  
  // Database configuration
  database: {
    connection: process.env.MONGODB_URI || 'mongodb://localhost:27017/winfoa',
    poolSize: 10,
    timeout: 30000,
  },
  
  // Cache configuration
  cache: {
    redis: {
      enabled: process.env.REDIS_URL !== undefined,
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      ttl: 3600, // 1 hour
    },
    memory: {
      maxSize: 1000, // 1000 items
      ttl: 300, // 5 minutes
    },
  },
} as const;

// =============================================================================
// EXPORT CONFIGURATION
// =============================================================================

/**
 * Main configuration export
 */
export default {
  APP_CONFIG,
  SUBDOMAIN_CONFIG,
  PERFORMANCE_METRICS,
  DEPLOYMENT_CONFIG,
  
  // Helper functions
  getSubdomainConfig: (subdomain: string) => {
    return SUBDOMAIN_CONFIG[subdomain as keyof typeof SUBDOMAIN_CONFIG] || null;
  },
  
  isProduction: () => process.env.NODE_ENV === 'production',
  isDevelopment: () => process.env.NODE_ENV === 'development',
  isTesting: () => process.env.NODE_ENV === 'test',
  
  // Performance helpers
  shouldOptimize: () => process.env.NODE_ENV === 'production',
  shouldDebug: () => process.env.NODE_ENV === 'development',
} as const;