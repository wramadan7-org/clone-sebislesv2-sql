pipeline {
    agent any 
    stages {
        stage('Publish Artifacts') {
            steps {
                echo 'Save the assemblies generated from the compilation' 
                sh '''#!/bin/bash
                   cd "/var/lib/jenkins/workspace/api-les-dev"
                   git checkout -f main-contrib-dev
                   git merge --ff-only origin/main-contrib-dev
		   # Deploy to production
                   echo "Deploy to production ..."
		   rsync -a /var/lib/jenkins/workspace/api-les-dev/ backendles-1:~/Projects/les-backend-express-dev/
                '''
            }
        }
    }
}
