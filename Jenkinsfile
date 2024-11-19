#!groovy

def BN = (BRANCH_NAME == 'master' || BRANCH_NAME.startsWith('releases/')) ? BRANCH_NAME : 'releases/2024-12'

library "knime-pipeline@$BN"

properties([
    pipelineTriggers([upstream(
        'knime-core/' + env.BRANCH_NAME.replaceAll('/', '%2F')
    )]),
    parameters(workflowTests.getConfigurationsAsParameters()),
    buildDiscarder(logRotator(numToKeepStr: '5')),
    disableConcurrentBuilds()
])

try {
    
    buildConfigs = [
        Tycho: {
            knimetools.defaultTychoBuild(updateSiteProject: 'org.knime.update.core.ui')
        },
        UnitTests: {
            workflowTests.runIntegratedWorkflowTests(
                configurations: workflowTests.DEFAULT_FEATURE_BRANCH_CONFIGURATIONS,
                profile: "test"
            )
        }
    ]
    
    node('maven && java17 && large') {

        parallel buildConfigs

        // junit '**/test-results/junit.xml'

        stage('Sonarqube analysis') {
            workflowTests.runSonar(withOutNode: true)
        }

        owasp.sendNodeJSSBOMs(readMavenPom(file: 'pom.xml').properties['revision'])
    }
} catch (ex) {
    currentBuild.result = 'FAILURE'
    throw ex
} finally {
    notifications.notifyBuild(currentBuild.result);
}