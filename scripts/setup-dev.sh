#!/bin/bash

# Finance Analytics - Development Environment Setup
# This script sets up the complete development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    local missing_tools=()
    
    if ! command_exists docker; then
        missing_tools+=("docker")
    fi
    
    if ! command_exists docker-compose; then
        missing_tools+=("docker-compose")
    fi
    
    if ! command_exists node; then
        missing_tools+=("node")
    fi
    
    if ! command_exists npm; then
        missing_tools+=("npm")
    fi
    
    if ! command_exists git; then
        missing_tools+=("git")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        log_error "Missing required tools: ${missing_tools[*]}"
        log_info "Please install the missing tools and run this script again."
        exit 1
    fi
    
    # Check Node.js version
    local node_version=$(node --version | cut -d'v' -f2)
    local required_version="18.0.0"
    
    if ! node -e "process.exit(require('semver').gte('$node_version', '$required_version') ? 0 : 1)" 2>/dev/null; then
        log_error "Node.js version $node_version is not supported. Please install Node.js >= $required_version"
        exit 1
    fi
    
    log_success "All prerequisites are met!"
}

# Setup environment variables
setup_environment() {
    log_info "Setting up environment variables..."
    
    if [ ! -f .env ]; then
        log_info "Creating .env file from template..."
        cp .env.example .env
        
        # Generate random secrets
        JWT_SECRET=$(openssl rand -hex 32)
        ENCRYPTION_KEY=$(openssl rand -hex 32)
        
        # Update .env file
        sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
        sed -i.bak "s/ENCRYPTION_KEY=.*/ENCRYPTION_KEY=$ENCRYPTION_KEY/" .env
        
        rm .env.bak
        
        log_warning "Please update the .env file with your API keys and configuration"
    else
        log_info ".env file already exists"
    fi
}

# Install dependencies
install_dependencies() {
    log_info "Installing Node.js dependencies..."
    
    # Install frontend dependencies
    if [ -f package.json ]; then
        npm ci
        log_success "Frontend dependencies installed"
    fi
    
    # Install API dependencies
    if [ -f api/package.json ]; then
        cd api
        npm ci
        cd ..
        log_success "API dependencies installed"
    fi
    
    # Install ML pipeline dependencies
    if [ -f ml/requirements.txt ]; then
        log_info "Installing Python dependencies..."
        if command_exists python3; then
            python3 -m pip install -r ml/requirements.txt
            log_success "Python dependencies installed"
        else
            log_warning "Python3 not found. Skipping ML dependencies."
        fi
    fi
}

# Setup database
setup_database() {
    log_info "Setting up database..."
    
    # Start PostgreSQL container
    docker-compose -f docker-compose.dev.yml up -d postgres
    
    # Wait for PostgreSQL to be ready
    log_info "Waiting for PostgreSQL to be ready..."
    timeout 60 bash -c 'until docker-compose -f docker-compose.dev.yml exec postgres pg_isready -U postgres; do sleep 2; done'
    
    # Run migrations
    log_info "Running database migrations..."
    npm run db:migrate
    
    # Seed database with sample data
    log_info "Seeding database with sample data..."
    npm run db:seed
    
    log_success "Database setup completed"
}

# Setup Redis
setup_redis() {
    log_info "Setting up Redis..."
    
    # Start Redis container
    docker-compose -f docker-compose.dev.yml up -d redis
    
    # Wait for Redis to be ready
    log_info "Waiting for Redis to be ready..."
    timeout 30 bash -c 'until docker-compose -f docker-compose.dev.yml exec redis redis-cli ping; do sleep 2; done'
    
    log_success "Redis setup completed"
}

# Setup Elasticsearch
setup_elasticsearch() {
    log_info "Setting up Elasticsearch..."
    
    # Start Elasticsearch container
    docker-compose -f docker-compose.dev.yml up -d elasticsearch
    
    # Wait for Elasticsearch to be ready
    log_info "Waiting for Elasticsearch to be ready..."
    timeout 120 bash -c 'until curl -s http://localhost:9200/_cluster/health | grep -q "yellow\|green"; do sleep 5; done'
    
    # Create indexes
    log_info "Creating Elasticsearch indexes..."
    npm run es:setup
    
    log_success "Elasticsearch setup completed"
}

# Setup monitoring
setup_monitoring() {
    log_info "Setting up monitoring stack..."
    
    # Start monitoring services
    docker-compose -f docker-compose.monitoring.yml up -d
    
    # Wait for services to be ready
    log_info "Waiting for monitoring services to be ready..."
    sleep 30
    
    log_success "Monitoring stack setup completed"
    log_info "Grafana: http://localhost:3001 (admin/admin)"
    log_info "Prometheus: http://localhost:9090"
}

# Setup ML pipeline
setup_ml_pipeline() {
    log_info "Setting up ML pipeline..."
    
    if [ -d ml/ ]; then
        # Start Jupyter notebook
        if command_exists jupyter; then
            log_info "Starting Jupyter notebook server..."
            cd ml
            nohup jupyter notebook --ip=0.0.0.0 --port=8888 --no-browser --allow-root > jupyter.log 2>&1 &
            cd ..
            log_success "Jupyter notebook started at http://localhost:8888"
        fi
        
        # Setup MLflow
        if command_exists mlflow; then
            log_info "Starting MLflow server..."
            nohup mlflow server --host 0.0.0.0 --port 5000 > mlflow.log 2>&1 &
            log_success "MLflow server started at http://localhost:5000"
        fi
    fi
}

# Start development servers
start_dev_servers() {
    log_info "Starting development servers..."
    
    # Start all services
    docker-compose -f docker-compose.dev.yml up -d
    
    # Wait for services to be ready
    log_info "Waiting for services to start..."
    sleep 10
    
    # Start frontend development server
    log_info "Starting frontend development server..."
    npm run dev &
    
    # Start API development server
    if [ -f api/package.json ]; then
        log_info "Starting API development server..."
        cd api
        npm run dev &
        cd ..
    fi
    
    log_success "Development servers started!"
}

# Health check
health_check() {
    log_info "Running health checks..."
    
    local services=(
        "http://localhost:3000|Frontend"
        "http://localhost:8080/health|API"
        "http://localhost:5432|PostgreSQL"
        "http://localhost:6379|Redis"
        "http://localhost:9200|Elasticsearch"
    )
    
    for service in "${services[@]}"; do
        IFS='|' read -r url name <<< "$service"
        
        if curl -f -s "$url" > /dev/null 2>&1; then
            log_success "$name is healthy"
        else
            log_warning "$name is not responding"
        fi
    done
}

# Display useful information
display_info() {
    log_success "Development environment setup completed!"
    echo
    log_info "Available services:"
    echo "  Frontend:      http://localhost:3000"
    echo "  API:           http://localhost:8080"
    echo "  PostgreSQL:    localhost:5432"
    echo "  Redis:         localhost:6379"
    echo "  Elasticsearch: http://localhost:9200"
    echo "  Grafana:       http://localhost:3001 (admin/admin)"
    echo "  Prometheus:    http://localhost:9090"
    echo "  Jupyter:       http://localhost:8888"
    echo "  MLflow:        http://localhost:5000"
    echo
    log_info "Useful commands:"
    echo "  npm run dev              - Start frontend development server"
    echo "  npm run api:dev          - Start API development server"
    echo "  npm run test             - Run tests"
    echo "  npm run db:migrate       - Run database migrations"
    echo "  npm run db:seed          - Seed database with sample data"
    echo "  docker-compose logs -f   - View container logs"
    echo "  ./scripts/stop-dev.sh    - Stop all development services"
    echo
    log_warning "Don't forget to update your .env file with the necessary API keys!"
}

# Cleanup function
cleanup() {
    log_info "Cleaning up..."
    # Kill background processes
    jobs -p | xargs -r kill
}

# Trap cleanup on script exit
trap cleanup EXIT

# Main execution
main() {
    log_info "Starting Finance Analytics development environment setup..."
    
    check_prerequisites
    setup_environment
    install_dependencies
    setup_database
    setup_redis
    setup_elasticsearch
    setup_monitoring
    setup_ml_pipeline
    start_dev_servers
    
    # Wait a bit for services to fully start
    sleep 15
    
    health_check
    display_info
}

# Run main function
main "$@"