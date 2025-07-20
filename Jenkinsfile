pipeline {
    agent any
    
    environment {
        IMAGE_NAME = "bibek87/dynamic_weather_app"
        TAG = "v-1.0.0.${BUILD_ID}"
        CONTAINER_NAME = "dynamicweatherapp_cont"
        OPENWEATHER_API_KEY = credentials('OPENWEATHER_API_KEY')
        DOCKER_HUB_CREDS = credentials('docker_hub')
        SONAR_SCANNER_HOME = tool 'SonarScanner'
        SONARQUBE_URL = "http://localhost:9000"
    }
    
    stages {
        stage('Git Checkout') {
            steps {
                echo "---Git Checkout---"
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/tba87/dynamicweatherapp']])
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo "---Installing Node.js Dependencies---"
                sh "npm install"
                sh "npm run test -- --coverage"
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                echo "---Scanning with Sonarqube---"
                withSonarQubeEnv('SonarQube') {
                    withCredentials([string(credentialsId: 'dynamic', variable: 'SONAR_TOKEN')]) {
                        sh """
                            ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                            -Dsonar.projectName=dynamic_weather_app \
                            -Dsonar.projectKey=dynamic_weather_app \
                            -Dsonar.host.url=${SONARQUBE_URL} \
                            -Dsonar.login=${SONAR_TOKEN} \
                            -Dsonar.sources=. \
                            -Dsonar.exclusions=**/node_modules/**,**/*.md,**/coverage/**,**/dist/** \
                            -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                        """
                    }
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${TAG} ."
            }
        }
            
        stage('Test Container') {
            steps {
                echo "---Testing Docker---"
                sh "docker run -d -p 3000:5000 -e OPENWEATHER_API_KEY=${OPENWEATHER_API_KEY} --name ${CONTAINER_NAME} ${IMAGE_NAME}:${TAG}"
                sleep(time: 5, unit: 'SECONDS')
                sh "curl -s http://localhost:3000 || exit 1"
            }
            post {
                always {
                    sh "docker stop ${CONTAINER_NAME} || true"
                    sh "docker rm ${CONTAINER_NAME} || true"
                }
            }
        }
        
        stage('Trivy Scan - Critical Vulnerabilities Only') {
            steps {
                echo "---Scanning for CRITICAL vulnerabilities with Local Trivy---"
                script {
                    def imageExists = sh(script: "docker inspect ${IMAGE_NAME}:${TAG}", returnStatus: true) == 0
            
                    if (!imageExists) {
                        error("Docker image ${IMAGE_NAME}:${TAG} not found. Build the image first.")
                    }
            
                    def trivyInstalled = sh(script: 'which trivy || command -v trivy', returnStatus: true) == 0
            
                    if (!trivyInstalled) {
                        error("Trivy not found in PATH. Please install Trivy on the Jenkins agent.")
                    }
            
                    def trivyExitCode = sh(script: """
                        trivy image \
                        --scanners vuln \
                        --severity CRITICAL \
                        --exit-code 0 \
                        --format table \
                        ${IMAGE_NAME}:${TAG}
                    """, returnStatus: true)
            
                    if (trivyExitCode != 0) {
                        echo "WARNING: Trivy found CRITICAL vulnerabilities (see above)"
                        currentBuild.result = 'UNSTABLE'
                    } else {
                        echo "Trivy scan: No CRITICAL vulnerabilities found"
                    }
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker_hub') {
                        docker.image("${IMAGE_NAME}:${TAG}").push()
                        docker.image("${IMAGE_NAME}:${TAG}").push('latest')
                    }
                }
            }
        }
    }
    
    post {
        always {
            script {
                // 1. Remove Docker images
                echo "Cleaning up Docker images..."
                sh "docker rmi ${IMAGE_NAME}:${TAG} || true"
                sh "docker rmi ${IMAGE_NAME}:latest || true"
                sh "docker rmi registry.hub.docker.com/${IMAGE_NAME}:${TAG} || true"
                sh "docker rmi registry.hub.docker.com/${IMAGE_NAME}:latest || true"
            
                // 2. Clean up node_modules and other build artifacts
                echo "Cleaning up build artifacts..."
                sh "rm -rf node_modules || true"
                sh "rm -rf coverage || true"
                sh "rm -rf dist || true"
            
                // 3. Optional: Docker system cleanup (be careful with this in shared environments)
            //    echo "Performing Docker system prune..."
            //    sh "docker system prune -f || true"
            }
        }
    
    cleanup {
        // 4. Clean workspace (most aggressive option)
        echo "Cleaning workspace..."
        cleanWs()
        }
    }
 }
