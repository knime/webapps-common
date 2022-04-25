#!groovy

// Jenkinsfile for the webapps commons
// NOTE: This does not create any build artifacts. It is merely for automated testing.

def BN = BRANCH_NAME == 'master' || BRANCH_NAME.startsWith('releases/') ? BRANCH_NAME : 'master'

library "knime-pipeline@$BN"

properties([
  buildDiscarder(logRotator(numToKeepStr: '20'))
])

try {
    node('maven && java11') {
        knimetools.defaultMavenBuild(withoutNode: true)

        if (BRANCH_NAME == 'master') {
            stage('Deploy Demo Page') {
                withMavenJarsignerCredentials {
                    withCredentials([string(credentialsId: 'webapps-common-bitbucket-pw', variable: 'BITBUCKET_PW')]){
                        sh '''
                            git config user.email "jenkins@knime.com"
                            git config user.name "Jenkins"
                            git remote set-url origin https://knime-bitbucket-bot:${BITBUCKET_PW}@bitbucket.org/knime/webapps-common.git
                            mvn verify -P deployDemoPage
                    '''
                    }
                }
            }
        }

        junit 'coverage/junit.xml'
        knimetools.processAuditResults()
    }
} catch (ex) {
    currentBuild.result = 'FAILURE'
    throw ex
} finally {
    notifications.notifyBuild(currentBuild.result)
}
