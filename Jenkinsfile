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

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Project') {
            steps {
                sh 'npx vite build'
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
