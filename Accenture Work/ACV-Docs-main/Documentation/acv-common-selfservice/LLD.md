# Common Self Service - Low-Level Design & Implementation Details

**Purpose:** Document workflow implementations, template scripts, and technical specifications.

**Scope:** Workflow YAML structure, script implementations, configuration details.

---

## 1. Repository Structure

### 1.1 Directory Organization

```
eai-3540813-common-selfservice/
├── .github/
│   ├── workflows/                    # GitHub Actions workflow definitions
│   │   ├── ci.yml                   # Build, test, quality gates
│   │   ├── build-and-push.yml       # Docker build and push
│   │   ├── deploy-dev.yml           # Deploy to dev environment
│   │   ├── deploy-test.yml          # Deploy to test environment
│   │   ├── deploy-prod.yml          # Deploy to production
│   │   └── security-scan.yml        # Security scanning workflow
│   └── CODEOWNERS                    # Code review assignments
│
├── helm/                             # Helm chart templates
│   ├── Chart.yaml                   # Chart metadata (name, version)
│   ├── values.yaml                  # Default configuration values
│   └── templates/
│       ├── deployment.yaml          # Kubernetes Deployment spec
│       ├── service.yaml             # Kubernetes Service
│       ├── ingress.yaml             # Ingress for routing
│       ├── configmap.yaml           # Application configuration
│       ├── secret.yaml              # Secret references
│       ├── hpa.yaml                 # Horizontal Pod Autoscaler
│       ├── pdb.yaml                 # Pod Disruption Budget
│       ├── networkpolicy.yaml       # Network security policy
│       ├── serviceaccount.yaml      # Kubernetes service account
│       └── _helpers.tpl             # Template helper functions
│
├── helm-releases/                    # Environment-specific values
│   ├── nonprod-dev.yaml             # Dev environment overrides
│   ├── nonprod-test.yaml            # Test environment overrides
│   └── prod.yaml                    # Production overrides
│
├── scripts/                          # Utility scripts
│   ├── deploy.sh                    # Deployment helper
│   ├── rollback.sh                  # Rollback helper
│   ├── health-check.sh              # Health verification
│   └── cleanup.sh                   # Resource cleanup
│
├── terraform/ (optional)             # IaC for infrastructure
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
│
├── Dockerfile                        # Container definition template
├── docker-compose.yml                # Local development setup template
├── pom.xml                          # Maven build template (Java projects)
├── package.json                     # npm config template (Node projects)
├── README.md                        # Project documentation
└── .gitignore                       # Git ignore patterns
```

---

## 2. GitHub Actions Workflows

### 2.1 CI Pipeline (ci.yml)

```yaml
name: Continuous Integration

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
      - develop

env:
  AZURE_REGISTRY: acr-dev.azurecr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    name: Build & Test
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Full history for SonarQube

      - name: Set up JDK 21
        uses: actions/setup-java@v3
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: maven

      - name: Build with Maven
        run: mvn clean package -DskipTests
        
      - name: Run unit tests
        run: mvn test
        
      - name: Verify code coverage
        run: |
          COVERAGE=$(mvn jacoco:report | grep -oP 'Total.*? \K[^%]*')
          echo "Code coverage: $COVERAGE%"
          if [ "${COVERAGE%.*}" -lt 75 ]; then
            echo "❌ Coverage below 75% threshold"
            exit 1
          fi

      - name: SonarQube analysis
        env:
          SONAR_HOST_URL: https://sonar.company.com
          SONAR_LOGIN: ${{ secrets.SONAR_TOKEN }}
        run: |
          mvn sonar:sonar \
            -Dsonar.projectKey="${{ github.repository }}" \
            -Dsonar.host.url="${SONAR_HOST_URL}" \
            -Dsonar.login="${{ secrets.SONAR_LOGIN }}"

      - name: Wait for SonarQube
        run: sleep 10

      - name: Check SonarQube quality gate
        env:
          SONAR_HOST_URL: https://sonar.company.com
          SONAR_LOGIN: ${{ secrets.SONAR_TOKEN }}
        run: |
          PROJECT_KEY="${{ github.repository }}"
          QUALITY_GATE=$(curl -s -u "${{ secrets.SONAR_TOKEN }}:" \
            "$SONAR_HOST_URL/api/qualitygates/project_status?projectKey=$PROJECT_KEY" \
            | jq '.projectStatus.status')
          
          if [ "$QUALITY_GATE" != '"OK"' ]; then
            echo "❌ Quality gate failed"
            exit 1
          fi

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: target/surefire-reports/

  security-scan:
    runs-on: ubuntu-latest
    name: Security Scanning
    
    steps:
      - uses: actions/checkout@v3

      - name: Dependency scanning (OWASP)
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: MyProject
          path: .
          format: JSON
          args: >
            --scan src/
            --enableExperimental

      - name: Check for hardcoded secrets
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD

  docker-build:
    runs-on: ubuntu-latest
    name: Build Docker Image
    needs: [build, security-scan]
    
    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Azure Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.AZURE_REGISTRY }}
          username: ${{ secrets.AZURE_CLIENT_ID }}
          password: ${{ secrets.AZURE_CLIENT_SECRET }}

      - name: Build Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: false
          tags: ${{ env.AZURE_REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          outputs: type=docker,dest=/tmp/image.tar

      - name: Scan image with Trivy
        uses: aquasecurity/trivy-action@master
        with:
          input: /tmp/image.tar
          format: sarif
          output: trivy-results.sarif
          severity: HIGH,CRITICAL

      - name: Upload Trivy results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: trivy-results.sarif

      - name: Push image to ACR (develop only)
        if: github.ref == 'refs/heads/develop'
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            ${{ env.AZURE_REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
            ${{ env.AZURE_REGISTRY }}/${{ env.IMAGE_NAME }}:develop
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### 2.2 Deploy Workflow (deploy-prod.yml)

```yaml
name: Deploy to Production

on:
  workflow_dispatch:
    inputs:
      image-tag:
        description: 'Docker image tag to deploy'
        required: true
        type: string
      environment:
        description: 'Target environment'
        required: true
        type: choice
        options:
          - prod-us-east
          - prod-us-west

env:
  AZURE_REGISTRY: acr-prod.azurecr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  approval:
    runs-on: ubuntu-latest
    environment: production
    name: Deployment Approval
    
    steps:
      - name: Check approval
        run: echo "✅ Deployment approved by ${{ github.actor }}"

  deploy:
    runs-on: ubuntu-latest
    needs: approval
    name: Deploy to Kubernetes
    
    steps:
      - uses: actions/checkout@v3

      - name: Fetch deployment credentials
        run: |
          az login --service-principal -u "${{ secrets.AZURE_CLIENT_ID }}" \
            -p "${{ secrets.AZURE_CLIENT_SECRET }}" \
            --tenant "${{ secrets.AZURE_TENANT_ID }}"
          
          az aks get-credentials \
            --resource-group "${{ secrets.AZURE_RG_PROD }}" \
            --name "aks-${{ github.event.inputs.environment }}" \
            --file kubeconfig

      - name: Set Kubernetes context
        run: |
          export KUBECONFIG=kubeconfig
          kubectl config current-context

      - name: Deploy with Helm
        run: |
          export KUBECONFIG=kubeconfig
          
          helm repo add common https://charts.company.com
          helm repo update
          
          helm upgrade --install ${{ env.IMAGE_NAME }} \
            common/${{ github.event.repository.name }} \
            --namespace production \
            --values helm-releases/prod.yaml \
            --set image.tag="${{ github.event.inputs.image-tag }}" \
            --wait \
            --timeout 10m

      - name: Verify deployment
        run: |
          export KUBECONFIG=kubeconfig
          
          # Wait for rollout
          kubectl -n production rollout status \
            deployment/${{ github.event.repository.name }} \
            --timeout=5m
          
          # Check pod status
          kubectl -n production get pods -l app=${{ github.event.repository.name }}

      - name: Run health check
        run: |
          POD=$(kubectl -n production get pod -l app=${{ github.event.repository.name }} \
            -o jsonpath='{.items[0].metadata.name}')
          
          kubectl -n production exec $POD -- \
            wget -q -O- http://localhost:8080/actuator/health

      - name: Notify on Slack
        if: always()
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK }}
          payload: |
            {
              "text": "Deployment to Production",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Environment:* ${{ github.event.inputs.environment }}\n*Image:* ${{ env.IMAGE_NAME }}:${{ github.event.inputs.image-tag }}\n*Status:* ${{ job.status }}"
                  }
                }
              ]
            }
```

---

## 3. Helm Chart Templates

### 3.1 Deployment Template

```yaml
# helm/templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "chart.fullname" . }}
  labels:
    {{- include "chart.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  selector:
    matchLabels:
      {{- include "chart.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      {{- with .Values.podAnnotations }}
      annotations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      labels:
        {{- include "chart.selectorLabels" . | nindent 8 }}
    spec:
      {{- with .Values.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      serviceAccountName: {{ include "chart.serviceAccountName" . }}
      securityContext:
        {{- toYaml .Values.podSecurityContext | nindent 8 }}
      containers:
      - name: {{ .Chart.Name }}
        securityContext:
          {{- toYaml .Values.securityContext | nindent 12 }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
        imagePullPolicy: {{ .Values.image.pullPolicy }}
        ports:
        - name: http
          containerPort: {{ .Values.service.targetPort }}
          protocol: TCP
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: http
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: http
          initialDelaySeconds: 15
          periodSeconds: 5
        resources:
          {{- toYaml .Values.resources | nindent 12 }}
        env:
        - name: ENVIRONMENT
          value: {{ .Values.environment }}
        - name: LOG_LEVEL
          value: {{ .Values.logLevel | default "INFO" }}
        volumeMounts:
        - name: config
          mountPath: /app/config
          readOnly: true
      volumes:
      - name: config
        configMap:
          name: {{ include "chart.fullname" . }}-config
      {{- with .Values.nodeSelector }}
      nodeSelector:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.affinity }}
      affinity:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.tolerations }}
      tolerations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
```

### 3.2 Values Files

**values.yaml (defaults):**
```yaml
replicaCount: 1

image:
  repository: acr-dev.azurecr.io/acv/myservice
  pullPolicy: IfNotPresent
  tag: "1.0.0"

imagePullSecrets: []

service:
  type: ClusterIP
  port: 80
  targetPort: 8080

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: myservice.company.com
      paths:
        - path: /
          pathType: Prefix

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 1
  maxReplicas: 3
  targetCPUUtilizationPercentage: 80
```

**helm-releases/prod.yaml (overrides):**
```yaml
replicaCount: 3

image:
  repository: acr-prod.azurecr.io/acv/myservice
  tag: "1.2.3"  # Specify exact version for prod

resources:
  limits:
    cpu: 1000m
    memory: 1Gi
  requests:
    cpu: 500m
    memory: 512Mi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

environment: production
logLevel: INFO

podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "8080"
  prometheus.io/path: "/actuator/prometheus"
```

---

## 4. Dockerfile Template

```dockerfile
# Multi-stage Spring Boot application

# Stage 1: Builder
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /build

# Copy build files
COPY pom.xml .
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn/

# Resolve dependencies
RUN ./mvnw dependency:resolve

# Copy source code
COPY src src/

# Build application
RUN ./mvnw clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Add non-root user
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser

# Copy JAR from builder
COPY --from=builder --chown=appuser:appuser \
  /build/target/app.jar app.jar

# Expose application port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Switch to non-root user
USER appuser

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 5. Deployment Scripts

### 5.1 deploy.sh

```bash
#!/bin/bash
set -e

# Deployment helper script

SERVICE_NAME=${1:-}
IMAGE_TAG=${2:-}
ENVIRONMENT=${3:-"dev"}

if [[ -z "$SERVICE_NAME" || -z "$IMAGE_TAG" ]]; then
  echo "Usage: ./deploy.sh <service-name> <image-tag> [environment]"
  exit 1
fi

echo "🚀 Deploying $SERVICE_NAME:$IMAGE_TAG to $ENVIRONMENT"

# Get cluster credentials
az aks get-credentials \
  --resource-group "acv-$ENVIRONMENT" \
  --name "aks-$ENVIRONMENT"

# Helm upgrade
helm upgrade --install "$SERVICE_NAME" ./helm \
  --namespace "$ENVIRONMENT" \
  --values helm-releases/"$ENVIRONMENT".yaml \
  --set image.tag="$IMAGE_TAG" \
  --wait \
  --timeout 10m

# Verify deployment
kubectl -n "$ENVIRONMENT" rollout status \
  deployment/"$SERVICE_NAME" \
  --timeout=5m

echo "✅ Deployment successful"
```

### 5.2 rollback.sh

```bash
#!/bin/bash
set -e

SERVICE_NAME=${1:-}
REVISION=${2:-0}
ENVIRONMENT=${3:-"dev"}

if [[ -z "$SERVICE_NAME" ]]; then
  echo "Usage: ./rollback.sh <service-name> [revision] [environment]"
  exit 1
fi

echo "⏮️  Rolling back $SERVICE_NAME in $ENVIRONMENT"

az aks get-credentials \
  --resource-group "acv-$ENVIRONMENT" \
  --name "aks-$ENVIRONMENT"

# Get previous revision
if [[ $REVISION -eq 0 ]]; then
  REVISION=$(helm history "$SERVICE_NAME" -n "$ENVIRONMENT" | tail -2 | head -1 | awk '{print $1}')
fi

# Rollback
helm rollback "$SERVICE_NAME" "$REVISION" \
  --namespace "$ENVIRONMENT" \
  --wait

echo "✅ Rollback to revision $REVISION complete"
```

---

## 6. Configuration Management

### 6.1 ConfigMap Template

```yaml
# helm/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ include "chart.fullname" . }}-config
  labels:
    {{- include "chart.labels" . | nindent 4 }}
data:
  application.yml: |
    spring:
      application:
        name: {{ .Chart.Name }}
      profiles:
        active: {{ .Values.environment }}
      cloud:
        config:
          uri: http://config-server:8888
          profile: {{ .Values.environment }}
    
    server:
      port: {{ .Values.service.targetPort }}
    
    logging:
      level:
        root: {{ .Values.logLevel }}
```

### 6.2 Secrets Template

```yaml
# helm/templates/secret.yaml (reference-only, use Key Vault in production)
apiVersion: v1
kind: Secret
metadata:
  name: {{ include "chart.fullname" . }}-secrets
  labels:
    {{- include "chart.labels" . | nindent 4 }}
type: Opaque
data:
  # In production, fetch from Azure Key Vault
  # Example:
  # db-username: {{ .Values.secrets.dbUsername | b64enc }}
  # db-password: {{ .Values.secrets.dbPassword | b64enc }}
```

---

## 7. Environment Setup

### docker-compose.yml Template

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: devuser
      POSTGRES_PASSWORD: devpass
      POSTGRES_DB: acv_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/acv_dev
      SPRING_DATASOURCE_USERNAME: devuser
      SPRING_DATASOURCE_PASSWORD: devpass
      SPRING_REDIS_HOST: redis
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
```

---

## 8. Testing Strategy

### 8.1 Unit Test Template

```java
@ExtendWith(MockitoExtension.class)
class ServiceTest {
    
    @Mock
    private Repository repository;
    
    @InjectMocks
    private Service service;
    
    @Test
    void testBusinessLogic() {
        // Arrange
        when(repository.findById(1L))
            .thenReturn(Optional.of(new Entity(1L, "test")));
        
        // Act
        Result result = service.process(1L);
        
        // Assert
        assertThat(result.isSuccess()).isTrue();
    }
}
```

### 8.2 Integration Test Template

```java
@SpringBootTest
@Testcontainers
class IntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres =
        new PostgreSQLContainer<>("postgres:15-alpine");
    
    @Test
    void testEndToEnd() {
        // Full integration test with real database
    }
}
```

---

## Cross-References

- [HLD.md](HLD.md) — Architecture and design decisions
- [services.md](services.md) — Template API contracts
- [code-mapping.md](code-mapping.md) — Template repository structure
- [glossary.md](glossary.md) — Technical terminology
- [onboarding.md](onboarding.md) — Setup procedures

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** Developers, DevOps Engineers, Platform Team
