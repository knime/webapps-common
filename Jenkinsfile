#!groovy

// Jenkinsfile for the webapps commons
// NOTE: This does not create any build artifacts. It is merely for automated testing.

def BN = BRANCH_NAME == "master" || BRANCH_NAME.startsWith("releases/") ? BRANCH_NAME : "master"

library "knime-pipeline@$BN"

timeout(time: 15, unit: 'MINUTES') {
  node('nodejs') {
    stage('Clean Workspace') {
      cleanWs()
    }

    stage('Checkout Sources') {
      checkout scm
    }

    try {
      stage('Install npm Dependencies') {
        sh '''
          npm ci
        '''
      }

      stage('npm Security Audit') {
        retry(3) {
          sh '''
            npm audit
          '''
        }
      }

      stage('Static Code Analysis') {
        sh '''
          npm run lint
        '''
      }

    } catch (ex) {
      currentBuild.result = 'FAILED'
      throw ex
    } finally {
      notifications.notifyBuild(currentBuild.result);
    }
  }
}
