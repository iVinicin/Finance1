# 🚀 Guia de Deploy - Finance Analytics Dashboard

## Pré-requisitos

### Ferramentas Necessárias
- Docker & Docker Compose
- Kubernetes CLI (kubectl)
- Terraform >= 1.0
- AWS CLI v2
- Node.js >= 18
- Python >= 3.9

### Configuração de Ambiente
```bash
# Instalar dependências
npm install -g @aws-cdk/cli
pip install awscli terraform-compliance

# Configurar AWS
aws configure
aws eks update-kubeconfig --region us-east-1 --name finance-analytics-prod
```

## Ambientes

### 1. Desenvolvimento Local

#### Docker Compose Setup
```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - REACT_APP_API_URL=http://localhost:8080
      - REACT_APP_ENVIRONMENT=development

  api:
    build:
      context: ./api
      dockerfile: Dockerfile.dev
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/finance_analytics
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=dev-secret-key
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: finance_analytics
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.8.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"

volumes:
  postgres_data:
```

#### Comandos de Desenvolvimento
```bash
# Iniciar ambiente local
docker-compose -f docker-compose.dev.yml up -d

# Executar migrações
npm run db:migrate

# Seed data
npm run db:seed

# Executar testes
npm run test:watch

# Parar ambiente
docker-compose -f docker-compose.dev.yml down
```

### 2. Staging Environment

#### Terraform Configuration
```hcl
# terraform/environments/staging/main.tf
module "staging" {
  source = "../../modules/finance-analytics"
  
  environment = "staging"
  aws_region  = "us-east-1"
  
  # Configurações reduzidas para staging
  instance_types = ["t3.small"]
  min_capacity   = 1
  max_capacity   = 3
  
  # Database
  db_instance_class = "db.t3.micro"
  db_allocated_storage = 20
  
  # Cache
  cache_node_type = "cache.t3.micro"
  
  # Monitoring
  enable_detailed_monitoring = false
  
  tags = {
    Environment = "staging"
    Project     = "finance-analytics"
    Owner       = "devops-team"
  }
}
```

#### Deploy para Staging
```bash
# Aplicar infraestrutura
cd terraform/environments/staging
terraform init
terraform plan
terraform apply

# Deploy da aplicação
kubectl apply -f k8s/staging/

# Verificar deploy
kubectl get pods -n finance-analytics-staging
kubectl logs -f deployment/frontend -n finance-analytics-staging
```

### 3. Production Environment

#### Terraform Production
```hcl
# terraform/environments/production/main.tf
module "production" {
  source = "../../modules/finance-analytics"
  
  environment = "production"
  aws_region  = "us-east-1"
  
  # Configurações robustas para produção
  instance_types = ["m5.large", "m5.xlarge"]
  min_capacity   = 3
  max_capacity   = 20
  
  # Database com alta disponibilidade
  db_instance_class = "db.r5.large"
  db_allocated_storage = 100
  multi_az = true
  backup_retention_period = 30
  
  # Cache cluster
  cache_node_type = "cache.r5.large"
  num_cache_clusters = 3
  
  # Monitoring completo
  enable_detailed_monitoring = true
  enable_cloudtrail = true
  
  # Security
  enable_waf = true
  enable_shield = true
  
  tags = {
    Environment = "production"
    Project     = "finance-analytics"
    Owner       = "devops-team"
    Compliance  = "required"
  }
}
```

## CI/CD Pipeline

### GitHub Actions Workflow Completo
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY: finance-analytics
  EKS_CLUSTER_NAME: finance-analytics-prod

jobs:
  # ============ QUALITY GATES ============
  code-quality:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: ESLint
      run: npm run lint
    
    - name: Prettier
      run: npm run format:check
    
    - name: TypeScript Check
      run: npm run type-check

  # ============ SECURITY SCANNING ============
  security:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Run Snyk Security Scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
    
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'fs'
        scan-ref: '.'
        format: 'sarif'
        output: 'trivy-results.sarif'
    
    - name: Upload Trivy scan results
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'

  # ============ TESTING ============
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm run test:unit
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        REDIS_URL: redis://localhost:6379
    
    - name: Run integration tests
      run: npm run test:integration
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        REDIS_URL: redis://localhost:6379
    
    - name: Generate coverage report
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        fail_ci_if_error: true

  # ============ E2E TESTING ============
  e2e:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Start test environment
      run: docker-compose -f docker-compose.test.yml up -d
    
    - name: Wait for services
      run: |
        timeout 60 bash -c 'until curl -f http://localhost:3000/health; do sleep 2; done'
    
    - name: Run Cypress E2E tests
      uses: cypress-io/github-action@v5
      with:
        start: npm run start:test
        wait-on: 'http://localhost:3000'
        wait-on-timeout: 120
        browser: chrome
        record: true
      env:
        CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Upload E2E artifacts
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: cypress-screenshots
        path: cypress/screenshots

  # ============ PERFORMANCE TESTING ============
  performance:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    
    - name: Run K6 Load Tests
      uses: grafana/k6-action@v0.2.0
      with:
        filename: tests/performance/load-test.js
      env:
        K6_CLOUD_TOKEN: ${{ secrets.K6_CLOUD_TOKEN }}

  # ============ BUILD & PUSH ============
  build:
    needs: [code-quality, security, test]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'
    
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
      image-digest: ${{ steps.build.outputs.digest }}
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}
    
    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1
    
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v4
      with:
        images: ${{ steps.login-ecr.outputs.registry }}/${{ env.ECR_REPOSITORY }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha,prefix={{branch}}-
          type=raw,value=latest,enable={{is_default_branch}}
    
    - name: Build and push Docker image
      id: build
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max
        build-args: |
          BUILDKIT_INLINE_CACHE=1
          NODE_ENV=production

  # ============ DEPLOY TO STAGING ============
  deploy-staging:
    needs: [build, e2e]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}
    
    - name: Update kubeconfig
      run: |
        aws eks update-kubeconfig --region ${{ env.AWS_REGION }} --name finance-analytics-staging
    
    - name: Deploy to staging
      run: |
        # Update image in deployment
        kubectl set image deployment/frontend frontend=${{ needs.build.outputs.image-tag }} -n finance-analytics-staging
        kubectl set image deployment/api api=${{ needs.build.outputs.image-tag }} -n finance-analytics-staging
        
        # Wait for rollout
        kubectl rollout status deployment/frontend -n finance-analytics-staging --timeout=300s
        kubectl rollout status deployment/api -n finance-analytics-staging --timeout=300s
    
    - name: Run smoke tests
      run: |
        kubectl run smoke-test-${{ github.run_id }} \
          --image=curlimages/curl \
          --rm -i --restart=Never \
          --namespace=finance-analytics-staging \
          -- curl -f https://staging.finance-analytics.com/health

  # ============ DEPLOY TO PRODUCTION ============
  deploy-production:
    needs: [build, deploy-staging, performance]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}
    
    - name: Update kubeconfig
      run: |
        aws eks update-kubeconfig --region ${{ env.AWS_REGION }} --name ${{ env.EKS_CLUSTER_NAME }}
    
    - name: Blue-Green Deployment
      run: |
        # Create new deployment version
        kubectl patch deployment frontend -p '{"spec":{"template":{"spec":{"containers":[{"name":"frontend","image":"${{ needs.build.outputs.image-tag }}"}]}}}}' -n finance-analytics
        kubectl patch deployment api -p '{"spec":{"template":{"spec":{"containers":[{"name":"api","image":"${{ needs.build.outputs.image-tag }}"}]}}}}' -n finance-analytics
        
        # Wait for rollout
        kubectl rollout status deployment/frontend -n finance-analytics --timeout=600s
        kubectl rollout status deployment/api -n finance-analytics --timeout=600s
    
    - name: Health Check
      run: |
        # Wait for health check
        timeout 300 bash -c 'until curl -f https://api.finance-analytics.com/health; do sleep 10; done'
    
    - name: Run production smoke tests
      run: |
        kubectl run prod-smoke-test-${{ github.run_id }} \
          --image=curlimages/curl \
          --rm -i --restart=Never \
          --namespace=finance-analytics \
          -- curl -f https://api.finance-analytics.com/health

  # ============ POST-DEPLOY MONITORING ============
  post-deploy:
    needs: [deploy-production]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Trigger Datadog Deployment Event
      run: |
        curl -X POST "https://api.datadoghq.com/api/v1/events" \
        -H "Content-Type: application/json" \
        -H "DD-API-KEY: ${{ secrets.DATADOG_API_KEY }}" \
        -d '{
          "title": "Finance Analytics Deployment",
          "text": "New version deployed to production",
          "tags": ["environment:production", "service:finance-analytics"],
          "alert_type": "info"
        }'
    
    - name: Update Slack
      uses: 8398a7/action-slack@v3
      with:
        status: success
        text: '🚀 Finance Analytics deployed to production successfully!'
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Monitoramento e Alertas

### Configuração do Prometheus
```yaml
# monitoring/prometheus-config.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

scrape_configs:
  - job_name: 'finance-analytics-frontend'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        action: keep
        regex: frontend
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true

  - job_name: 'finance-analytics-api'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        action: keep
        regex: api

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
```

### Alertas Críticos
```yaml
# monitoring/alert_rules.yml
groups:
  - name: finance-analytics-alerts
    rules:
    - alert: HighErrorRate
      expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
      for: 5m
      labels:
        severity: critical
      annotations:
        summary: "High error rate detected"
        description: "Error rate is {{ $value }} errors per second"

    - alert: DatabaseConnectionFailure
      expr: up{job="postgres-exporter"} == 0
      for: 2m
      labels:
        severity: critical
      annotations:
        summary: "Database connection failure"
        description: "PostgreSQL database is not responding"

    - alert: HighMemoryUsage
      expr: container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.9
      for: 10m
      labels:
        severity: warning
      annotations:
        summary: "High memory usage"
        description: "Container memory usage is above 90%"
```

## Rollback Procedures

### Rollback Automático
```bash
#!/bin/bash
# scripts/rollback.sh

set -e

NAMESPACE="finance-analytics"
DEPLOYMENT_NAME="$1"
PREVIOUS_VERSION="$2"

if [ -z "$DEPLOYMENT_NAME" ] || [ -z "$PREVIOUS_VERSION" ]; then
    echo "Usage: $0 <deployment-name> <previous-version>"
    exit 1
fi

echo "Rolling back $DEPLOYMENT_NAME to version $PREVIOUS_VERSION..."

# Rollback deployment
kubectl rollout undo deployment/$DEPLOYMENT_NAME -n $NAMESPACE --to-revision=$PREVIOUS_VERSION

# Wait for rollback to complete
kubectl rollout status deployment/$DEPLOYMENT_NAME -n $NAMESPACE --timeout=300s

# Verify health
kubectl run health-check-$(date +%s) \
    --image=curlimages/curl \
    --rm -i --restart=Never \
    --namespace=$NAMESPACE \
    -- curl -f http://$DEPLOYMENT_NAME-service/health

echo "Rollback completed successfully!"
```

### Rollback Manual
```bash
# Ver histórico de deployments
kubectl rollout history deployment/frontend -n finance-analytics

# Rollback para versão anterior
kubectl rollout undo deployment/frontend -n finance-analytics

# Rollback para versão específica
kubectl rollout undo deployment/frontend --to-revision=3 -n finance-analytics

# Verificar status
kubectl rollout status deployment/frontend -n finance-analytics
```

## Troubleshooting

### Logs Centralizados
```bash
# Ver logs em tempo real
kubectl logs -f deployment/frontend -n finance-analytics

# Logs de múltiplos pods
kubectl logs -l app=frontend -n finance-analytics --tail=100

# Logs com timestamp
kubectl logs deployment/api -n finance-analytics --timestamps=true

# Exportar logs para análise
kubectl logs deployment/api -n finance-analytics --since=1h > api-logs.txt
```

### Debug de Pods
```bash
# Descrever pod com problemas
kubectl describe pod <pod-name> -n finance-analytics

# Executar shell no pod
kubectl exec -it <pod-name> -n finance-analytics -- /bin/bash

# Port forward para debug local
kubectl port-forward service/api-service 8080:80 -n finance-analytics

# Ver eventos do namespace
kubectl get events -n finance-analytics --sort-by='.lastTimestamp'
```

### Verificação de Saúde
```bash
# Health checks
curl -f https://api.finance-analytics.com/health
curl -f https://api.finance-analytics.com/ready

# Métricas
curl https://api.finance-analytics.com/metrics

# Status dos serviços
kubectl get all -n finance-analytics
```

Este guia de deploy garante uma entrega contínua robusta e confiável para o Finance Analytics Dashboard.