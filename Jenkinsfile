#!groovy

def BN = (BRANCH_NAME == 'master' || BRANCH_NAME.startsWith('releases/')) ? BRANCH_NAME : 'releases/2024-06'

library "knime-pipeline@$BN"

properties([
    pipelineTriggers([upstream(
        'knime-core/' + env.BRANCH_NAME.replaceAll('/', '%2F')
    )]),
    parameters([p2Tools.getP2pruningParameter()]),
    buildDiscarder(logRotator(numToKeepStr: '5')),
    disableConcurrentBuilds()
])

try {
    node('maven && java17 && large') {
        knimetools.defaultTychoBuild(updateSiteProject: 'org.knime.update.core.ui')

        junit '**/test-results/junit.xml'

        stage('Sonarqube analysis') {
            workflowTests.runSonar(withOutNode: true)
        }

        owasp.sendNodeJSSBOMs('5.3.0-beta-0-84e14157')
    }
} catch (ex) {
    currentBuild.result = 'FAILURE'
    throw ex
} finally {
    notifications.notifyBuild(currentBuild.result);
}