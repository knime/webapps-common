#!groovy

// Jenkinsfile for the webapps commons
// NOTE: This does not create any build artifacts. It is merely for automated testing.

def BN = BRANCH_NAME == "master" || BRANCH_NAME.startsWith("releases/") ? BRANCH_NAME : "master"

library "knime-pipeline@$BN"

properties([
  buildDiscarder(logRotator(numToKeepStr: '20'))
])

try {
    node('maven && java11') {
        knimetools.defaultMavenBuild(withoutNode: true)

        junit 'coverage/junit.xml' 
        knimetools.processAuditResults()
    }
} catch (ex) {
    currentBuild.result = 'FAILURE'
    throw ex
} finally {
    notifications.notifyBuild(currentBuild.result);
}
