pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    tools {
        nodejs 'Node20'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/kyprogramming/sms-frontend-sv-v2.git'
            }
        }

        stage('Clean Workspace') {
            steps {
                deleteDir()
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'ls -la' 
                // sh 'cat package-lock.json'
                // sh 'npm ci'
                sh 'npm ci --include=dev'
            }
        }

         stage('Build') {
            steps {
                sh 'npm run build'
                //  sh 'npx vite build'
            }
        }

        // stage('Deploy (optional)') {
        //     when {
        //         branch 'main'
        //     }
        //     steps {
        //         echo 'You can add your deploy script here.'
        //         // For example: scp or rsync to EC2
        //     }
        // }
    }

    post {
        success {
            echo '✅ Build and deploy completed successfully!'
        }
        failure {
            echo '❌ Build failed!'
        }
    }
}
