#!groovy

// Jenkinsfile for the webapps commons
// NOTE: This does not create any build artifacts. It is merely for automated testing.

def BN = BRANCH_NAME == "master" || BRANCH_NAME.startsWith("releases/") ? BRANCH_NAME : "master"

library "knime-pipeline@$BN"

timeout(time: 15, unit: 'MINUTES') {
  try {
    node('nodejs') {
      stage('Clean Workspace') {
        env.lastStage = env.STAGE_NAME
        cleanWs()
      }

      stage('Checkout Sources') {
        env.lastStage = env.STAGE_NAME
        checkout scm
      knimetools.reportJIRAIssues()
      }

      stage('Install npm Dependencies') {
        env.lastStage = env.STAGE_NAME
        sh '''
          npm ci
        '''
      }

      parallel 'npm Security Audit': {
        env.lastStage = env.STAGE_NAME

        catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
          retry(3) { // because npm registry sometimes break
            sh '''
              npm audit --production
            '''
          }
        }
      },
      'Static Code Analysis': {
        env.lastStage = env.STAGE_NAME
        sh '''
          npm run lint
        '''
      }

      stage('Unit Tests') {
        env.lastStage = env.STAGE_NAME
        catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
          // trows exception on failing test
          sh '''
            npm run coverage -- --ci
          '''
        }
        junit 'coverage/junit.xml'
      }

      if (BRANCH_NAME == "master") {
        stage('Upload Coverage data') {
          env.lastStage = env.STAGE_NAME
          withCredentials([usernamePassword(credentialsId: 'SONAR_CREDENTIALS', passwordVariable: 'SONAR_PASSWORD', usernameVariable: 'SONAR_LOGIN')]) {
            sh '''
              npm run sendcoverage
            '''
          }
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
