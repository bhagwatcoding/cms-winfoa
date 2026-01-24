/**
 * Professional Deployment Scripts
 * Enterprise-grade deployment automation utilities
 * 
 * @module DeploymentScripts
 * @description Comprehensive deployment scripts for multi-subdomain applications
 */

#!/bin/bash

# =============================================================================
# CONFIGURATION
# =============================================================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="winfoa-multi-subdomain"
DOCKER_COMPOSE_FILE="docker-compose.professional.yml"
PM2_CONFIG="ecosystem.config.professional.js"
ENV_FILE=".env.production"

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# =============================================================================
# VALIDATION FUNCTIONS
# =============================================================================

check_dependencies() {
    log "Checking dependencies..."
    
    local deps=("docker" "docker-compose" "node" "npm" "pm2")
    local missing=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing+=("$dep")
        fi
    done
    
    if [ ${#missing[@]} -ne 0 ]; then
        error "Missing dependencies: ${missing[*]}"
    fi
    
    success "All dependencies are available"
}

check_environment() {
    log "Checking environment configuration..."
    
    if [ ! -f "$ENV_FILE" ]; then
        error "Environment file $ENV_FILE not found"
    fi
    
    # Check required environment variables
    local required_vars=(
        "JWT_SECRET"
        "NEXTAUTH_SECRET"
        "SESSION_SECRET"
        "MONGODB_URI"
        "REDIS_URL"
    )
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" "$ENV_FILE"; then
            error "Required environment variable $var not found in $ENV_FILE"
        fi
    done
    
    success "Environment configuration is valid"
}

# =============================================================================
# BUILD FUNCTIONS
# =============================================================================

build_application() {
    log "Building application..."
    
    # Install dependencies
    npm ci --silent
    
    # Run type checking
    npm run type-check
    
    # Run linting
    npm run lint
    
    # Run tests
    npm run test:ci
    
    # Build for production
    npm run build:optimize
    
    success "Application built successfully"
}

build_docker_images() {
    log "Building Docker images..."
    
    # Build production image
    docker build -f Dockerfile.professional -t "$APP_NAME:latest" .
    
    # Tag with version if provided
    if [ -n "${VERSION:-}" ]; then
        docker tag "$APP_NAME:latest" "$APP_NAME:$VERSION"
    fi
    
    success "Docker images built successfully"
}

# =============================================================================
# DEPLOYMENT FUNCTIONS
# =============================================================================

deploy_with_docker() {
    log "Deploying with Docker Compose..."
    
    # Pull latest images
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
    
    # Stop existing containers
    docker-compose -f "$DOCKER_COMPOSE_FILE" down --remove-orphans
    
    # Start services
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
    
    # Wait for services to be ready
    wait_for_services
    
    success "Application deployed with Docker"
}

deploy_with_pm2() {
    log "Deploying with PM2..."
    
    # Install PM2 globally if not present
    if ! command -v pm2 &> /dev/null; then
        npm install -g pm2
    fi
    
    # Stop existing processes
    pm2 stop all || true
    pm2 delete all || true
    
    # Start application
    pm2 start "$PM2_CONFIG" --env production
    
    # Save PM2 configuration
    pm2 save
    
    # Setup PM2 startup script
    pm2 startup
    
    success "Application deployed with PM2"
}

# =============================================================================
# MONITORING FUNCTIONS
# =============================================================================

wait_for_services() {
    log "Waiting for services to be ready..."
    
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -f -s http://localhost:3000/api/health > /dev/null; then
            success "Application is ready"
            return 0
        fi
        
        attempt=$((attempt + 1))
        log "Waiting for application... (attempt $attempt/$max_attempts)"
        sleep 10
    done
    
    error "Application failed to start within timeout"
}

check_health() {
    log "Checking application health..."
    
    # Check main application
    if ! curl -f -s http://localhost:3000/api/health > /dev/null; then
        error "Main application health check failed"
    fi
    
    # Check database connection
    if ! curl -f -s http://localhost:3000/api/health/database > /dev/null; then
        error "Database health check failed"
    fi
    
    # Check Redis connection
    if ! curl -f -s http://localhost:3000/api/health/redis > /dev/null; then
        error "Redis health check failed"
    fi
    
    success "All health checks passed"
}

# =============================================================================
# ROLLBACK FUNCTIONS
# =============================================================================

rollback_docker() {
    log "Rolling back Docker deployment..."
    
    # Stop current containers
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
    
    # Restore from backup if available
    if [ -d "backup/docker" ]; then
        log "Restoring from backup..."
        docker-compose -f backup/docker/docker-compose.yml up -d
    fi
    
    warning "Docker deployment rolled back"
}

rollback_pm2() {
    log "Rolling back PM2 deployment..."
    
    # Stop current processes
    pm2 stop all || true
    
    # Restore from backup if available
    if [ -f "backup/pm2/dump.pm2" ]; then
        log "Restoring from backup..."
        pm2 resurrect backup/pm2/dump.pm2
    fi
    
    warning "PM2 deployment rolled back"
}

# =============================================================================
# BACKUP FUNCTIONS
# =============================================================================

create_backup() {
    log "Creating backup..."
    
    local backup_dir="backup/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"
    
    # Backup Docker configuration
    if [ -f "$DOCKER_COMPOSE_FILE" ]; then
        cp "$DOCKER_COMPOSE_FILE" "$backup_dir/"
    fi
    
    # Backup PM2 configuration
    if [ -f "$PM2_CONFIG" ]; then
        cp "$PM2_CONFIG" "$backup_dir/"
        pm2 dump "$backup_dir/dump.pm2"
    fi
    
    # Backup environment files
    cp .env* "$backup_dir/" 2>/dev/null || true
    
    success "Backup created at $backup_dir"
}

# =============================================================================
# CLEANUP FUNCTIONS
# =============================================================================

cleanup() {
    log "Cleaning up..."
    
    # Remove old Docker images
    docker image prune -f
    
    # Remove old containers
    docker container prune -f
    
    # Remove old volumes
    docker volume prune -f
    
    # Clean npm cache
    npm cache clean --force
    
    success "Cleanup completed"
}

# =============================================================================
# MAIN DEPLOYMENT FUNCTION
# =============================================================================

deploy() {
    local method="${1:-docker}"
    
    log "Starting deployment with method: $method"
    
    # Create backup before deployment
    create_backup
    
    # Validate environment
    check_dependencies
    check_environment
    
    # Build application
    build_application
    
    case "$method" in
        "docker")
            build_docker_images
            deploy_with_docker
            ;;
        "pm2")
            deploy_with_pm2
            ;;
        "both")
            build_docker_images
            deploy_with_docker
            deploy_with_pm2
            ;;
        *)
            error "Invalid deployment method: $method. Use 'docker', 'pm2', or 'both'"
            ;;
    esac
    
    # Check health after deployment
    check_health
    
    # Cleanup
    cleanup
    
    success "Deployment completed successfully!"
}

# =============================================================================
# USAGE AND ARGUMENT PARSING
# =============================================================================

usage() {
    cat << EOF
Usage: $0 [OPTIONS] [COMMAND]

Professional deployment script for Winfoa Multi-Subdomain Platform

COMMANDS:
    deploy [method]     Deploy application (methods: docker, pm2, both)
    health              Check application health
    backup              Create backup
    cleanup             Clean up resources
    rollback [method]   Rollback deployment (methods: docker, pm2)

OPTIONS:
    -h, --help          Show this help message
    -v, --version       Show version information
    -e, --env FILE      Specify environment file (default: .env.production)
    -V, --version-tag   Set version tag for Docker images

EXAMPLES:
    $0 deploy docker                    # Deploy with Docker
    $0 deploy pm2                       # Deploy with PM2
    $0 deploy both                      # Deploy with both methods
    $0 health                           # Check application health
    $0 backup                           # Create backup
    $0 rollback docker                  # Rollback Docker deployment

EOF
}

# =============================================================================
# MAIN EXECUTION
# =============================================================================

main() {
    local command=""
    local method="docker"
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                usage
                exit 0
                ;;
            -v|--version)
                echo "Winfoa Deployment Script v3.0.0"
                exit 0
                ;;
            -e|--env)
                ENV_FILE="$2"
                shift 2
                ;;
            -V|--version-tag)
                VERSION="$2"
                shift 2
                ;;
            deploy|health|backup|cleanup|rollback)
                command="$1"
                method="${2:-docker}"
                shift
                break
                ;;
            *)
                error "Unknown option: $1"
                ;;
        esac
    done
    
    # Execute command
    case "$command" in
        "deploy")
            deploy "$method"
            ;;
        "health")
            check_health
            ;;
        "backup")
            create_backup
            ;;
        "cleanup")
            cleanup
            ;;
        "rollback")
            case "$method" in
                "docker") rollback_docker ;;
                "pm2") rollback_pm2 ;;
                *) error "Invalid rollback method: $method" ;;
            esac
            ;;
        *)
            usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"