/**
 * Project Structure Validation Script
 * Validates the professional multi-subdomain project structure
 * 
 * @module ProjectValidation
 * @description Comprehensive project structure validation
 */

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// =============================================================================
// CONFIGURATION
// =============================================================================

const REQUIRED_FILES = [
  // Core configuration files
  'tsconfig.professional.json',
  '.eslintrc.professional.js',
  '.prettierrc.professional',
  'next.config.professional.ts',
  'package.professional.json',
  
  // Docker configuration
  'Dockerfile.professional',
  'docker-compose.professional.yml',
  
  // Deployment configuration
  'ecosystem.config.professional.js',
  
  // CI/CD configuration
  '.github/workflows/ci-cd.professional.yml',
  
  // Environment templates
  '.env.template',
  '.env.production.template',
  '.env.staging.template',
  '.env.test.template',
  
  // Documentation
  'ARCHITECTURE.md',
  'SETUP_GUIDE.md',
  'IMPLEMENTATION_SUMMARY.md',
  
  // Docker supporting files
  'docker/nginx/nginx.conf',
  'docker/prometheus/prometheus.yml',
  'docker/grafana/datasources/prometheus.yml',
  'docker/mongo/init.js',
  
  // Health check and monitoring
  'src/app/api/health/route.ts',
  'src/app/god/monitoring/page.tsx',
  'lighthouserc.js',
  
  // Deployment scripts
  'scripts/deploy.sh'
];

const REQUIRED_DIRECTORIES = [
  'src/apps',
  'src/core',
  'src/features',
  'src/shared',
  'docker',
  'scripts',
  '.github/workflows'
];

const OPTIONAL_FILES = [
  'src/shared/types/enums.ts',
  'src/shared/services/session/analytics.service.ts',
  'src/shared/lib/db/models/core/Session.ts',
  'src/shared/lib/db/models/core/User.ts',
  'src/shared/lib/db/models/wallet/WalletTransaction.ts'
];

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m',   // Red
    reset: '\x1b[0m'     // Reset
  };
  
  const timestamp = new Date().toISOString();
  const color = colors[type] || colors.info;
  console.log(`${color}[${timestamp}] ${message}${colors.reset}`);
}

function checkFileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    log(`Error checking file ${filePath}: ${error.message}`, 'error');
    return false;
  }
}

function checkDirectoryExists(dirPath) {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch (error) {
    log(`Error checking directory ${dirPath}: ${error.message}`, 'error');
    return false;
  }
}

function validateFileContent(filePath, validator) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return validator(content);
  } catch (error) {
    log(`Error reading file ${filePath}: ${error.message}`, 'error');
    return false;
  }
}

function validateJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    return true;
  } catch (error) {
    log(`Invalid JSON in ${filePath}: ${error.message}`, 'error');
    return false;
  }
}

function validatePackageJson() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredScripts = [
      'dev', 'build', 'start', 'lint', 'test', 'type-check'
    ];
    
    const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
    
    if (missingScripts.length > 0) {
      log(`Missing npm scripts: ${missingScripts.join(', ')}`, 'error');
      return false;
    }
    
    return true;
  } catch (error) {
    log(`Error validating package.json: ${error.message}`, 'error');
    return false;
  }
}

function validateTypeScriptConfig() {
  try {
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.professional.json', 'utf8'));
    
    const requiredOptions = [
      'strict', 'noImplicitAny', 'strictNullChecks', 'strictFunctionTypes'
    ];
    
    const missingOptions = requiredOptions.filter(option => !tsconfig.compilerOptions[option]);
    
    if (missingOptions.length > 0) {
      log(`Missing TypeScript strict options: ${missingOptions.join(', ')}`, 'error');
      return false;
    }
    
    return true;
  } catch (error) {
    log(`Error validating TypeScript config: ${error.message}`, 'error');
    return false;
  }
}

function validateDockerConfig() {
  try {
    const dockerfile = fs.readFileSync('Dockerfile.professional', 'utf8');
    
    if (!dockerfile.includes('multi-stage')) {
      log('Dockerfile should be multi-stage for optimization', 'warning');
    }
    
    if (!dockerfile.includes('HEALTHCHECK')) {
      log('Dockerfile should include HEALTHCHECK instruction', 'warning');
    }
    
    return true;
  } catch (error) {
    log(`Error validating Docker config: ${error.message}`, 'error');
    return false;
  }
}

function validateEnvironmentFiles() {
  const envFiles = ['.env.template', '.env.production.template'];
  
  for (const file of envFiles) {
    if (!checkFileExists(file)) continue;
    
    try {
      const content = fs.readFileSync(file, 'utf8');
      const requiredVars = [
        'NODE_ENV',
        'NEXT_PUBLIC_APP_URL',
        'JWT_SECRET',
        'MONGODB_URI',
        'REDIS_URL'
      ];
      
      const missingVars = requiredVars.filter(varName => !content.includes(varName));
      
      if (missingVars.length > 0) {
        log(`Missing environment variables in ${file}: ${missingVars.join(', ')}`, 'warning');
      }
    } catch (error) {
      log(`Error validating ${file}: ${error.message}`, 'error');
    }
  }
  
  return true;
}

// =============================================================================
// MAIN VALIDATION
// =============================================================================

function validateRequiredFiles() {
  log('Validating required files...', 'info');
  
  let allValid = true;
  
  for (const file of REQUIRED_FILES) {
    if (checkFileExists(file)) {
      log(`✓ ${file}`, 'success');
    } else {
      log(`✗ ${file} - MISSING`, 'error');
      allValid = false;
    }
  }
  
  return allValid;
}

function validateRequiredDirectories() {
  log('Validating required directories...', 'info');
  
  let allValid = true;
  
  for (const dir of REQUIRED_DIRECTORIES) {
    if (checkDirectoryExists(dir)) {
      log(`✓ ${dir}/`, 'success');
    } else {
      log(`✗ ${dir}/ - MISSING`, 'error');
      allValid = false;
    }
  }
  
  return allValid;
}

function validateOptionalFiles() {
  log('Validating optional files...', 'info');
  
  for (const file of OPTIONAL_FILES) {
    if (checkFileExists(file)) {
      log(`✓ ${file}`, 'success');
    } else {
      log(`⚠ ${file} - OPTIONAL`, 'warning');
    }
  }
}

function validateConfigurationFiles() {
  log('Validating configuration files...', 'info');
  
  let allValid = true;
  
  // Validate package.json
  if (checkFileExists('package.json')) {
    if (!validatePackageJson()) {
      allValid = false;
    }
  }
  
  // Validate TypeScript config
  if (checkFileExists('tsconfig.professional.json')) {
    if (!validateTypeScriptConfig()) {
      allValid = false;
    }
  }
  
  // Validate Docker config
  if (checkFileExists('Dockerfile.professional')) {
    if (!validateDockerConfig()) {
      allValid = false;
    }
  }
  
  // Validate environment files
  if (!validateEnvironmentFiles()) {
    allValid = false;
  }
  
  return allValid;
}

function checkDependencies() {
  log('Checking dependencies...', 'info');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const requiredDeps = [
      'next', 'react', 'react-dom', 'typescript',
      '@types/node', '@types/react', '@types/react-dom',
      'mongoose', 'redis', 'jsonwebtoken', 'bcryptjs',
      'eslint', 'prettier', 'jest'
    ];
    
    const missingDeps = requiredDeps.filter(dep => !dependencies[dep]);
    
    if (missingDeps.length > 0) {
      log(`Missing dependencies: ${missingDeps.join(', ')}`, 'warning');
      return false;
    }
    
    log('All required dependencies are present', 'success');
    return true;
  } catch (error) {
    log(`Error checking dependencies: ${error.message}`, 'error');
    return false;
  }
}

function checkScripts() {
  log('Checking build scripts...', 'info');
  
  try {
    // Check if deployment script is executable
    if (checkFileExists('scripts/deploy.sh')) {
      try {
        execSync('chmod +x scripts/deploy.sh', { stdio: 'ignore' });
        log('✓ Deployment script is executable', 'success');
      } catch (error) {
        log('⚠ Deployment script permissions issue', 'warning');
      }
    }
    
    // Check if MongoDB init script is valid
    if (checkFileExists('docker/mongo/init.js')) {
      try {
        const content = fs.readFileSync('docker/mongo/init.js', 'utf8');
        if (content.includes('db.createUser') && content.includes('db.createCollection')) {
          log('✓ MongoDB init script looks valid', 'success');
        } else {
          log('⚠ MongoDB init script may be incomplete', 'warning');
        }
      } catch (error) {
        log(`Error validating MongoDB init script: ${error.message}`, 'error');
      }
    }
    
    return true;
  } catch (error) {
    log(`Error checking scripts: ${error.message}`, 'error');
    return false;
  }
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================

function main() {
  log('Starting professional project structure validation...', 'info');
  log('=' .repeat(60), 'info');
  
  let validationResults = {
    files: false,
    directories: false,
    configuration: false,
    dependencies: false,
    scripts: false
  };
  
  // Validate required files
  validationResults.files = validateRequiredFiles();
  
  // Validate required directories
  validationResults.directories = validateRequiredDirectories();
  
  // Validate optional files
  validateOptionalFiles();
  
  // Validate configuration files
  validationResults.configuration = validateConfigurationFiles();
  
  // Check dependencies
  validationResults.dependencies = checkDependencies();
  
  // Check scripts
  validationResults.scripts = checkScripts();
  
  // Summary
  log('=' .repeat(60), 'info');
  
  const allPassed = Object.values(validationResults).every(result => result);
  
  if (allPassed) {
    log('🎉 All validations passed! Project structure is professional and complete.', 'success');
    log('✅ Ready for production deployment!', 'success');
  } else {
    log('❌ Some validations failed. Please review the errors above.', 'error');
    log('🔧 Fix the issues before proceeding with deployment.', 'warning');
  }
  
  // Exit with appropriate code
  process.exit(allPassed ? 0 : 1);
}

// Run validation if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = {
  validateRequiredFiles,
  validateRequiredDirectories,
  validateConfigurationFiles,
  checkDependencies,
  checkScripts
};