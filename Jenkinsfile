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

      stage('Unit Tests') {
        try {
          // trows exception on failing test
          sh '''
            npm run coverage -- --ci
          '''
        } catch (ignore) {
          // failing tests should not result in a pipeline exception
        } finally {
          junit 'coverage/junit.xml'
        }
      }

      if (BRANCH_NAME == "master") {
        stage('Upload Coverage data') {
          withCredentials([usernamePassword(credentialsId: 'SONAR_CREDENTIALS', passwordVariable: 'SONAR_PASSWORD', usernameVariable: 'SONAR_LOGIN')]) {
            sh '''
              npm run sendcoverage
            '''
          }
        }
      }

    } catch (ex) {
      currentBuild.result = 'FAILED'
      throw ex
    } finally {
      notifications.notifyBuild(currentBuild.result);
    }
  }
}
