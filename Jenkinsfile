#!groovy

def BN = (BRANCH_NAME == 'master' || BRANCH_NAME.startsWith('releases/')) ? BRANCH_NAME : 'releases/2022-09'

library "knime-pipeline@$BN"

properties([
    buildDiscarder(logRotator(numToKeepStr: '5')),
    disableConcurrentBuilds()
])

try {
    node('maven && java11') {
        knimetools.defaultMavenBuild(withoutNode: true)
        
        junit '**/coverage/junit.xml'
        knimetools.processAuditResults()
        
        stage('Sonarqube analysis') {
            withCredentials([usernamePassword(credentialsId: 'ARTIFACTORY_CREDENTIALS', passwordVariable: 'ARTIFACTORY_PASSWORD', usernameVariable: 'ARTIFACTORY_LOGIN')]) {
                withSonarQubeEnv('Sonarcloud') {
                    withMaven(options: [artifactsPublisher(disabled: true)]) {
                        def sonarArgs = knimetools.getSonarArgsForMaven(env.SONAR_CONFIG_NAME)
                        sh """
                            mvn -Dknime.p2.repo=${P2_REPO} validate $sonarArgs
                        """
                    }
                }
            }
        }
        
        if ((BRANCH_NAME == "master") && (currentBuild.result != 'UNSTABLE')) {
            try {
                stage('Deploy to npm') {
                    env.lastStage = env.STAGE_NAME
                    withCredentials([string(credentialsId: 'NPM_AUTH_TOKEN', variable: 'NPM_AUTH_TOKEN'),]) {
                        sh '''
                            echo "//registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}" >> ~/.npmrc
                            npm publish --quiet
                        '''
                    }
                }
            } catch (ex) {
                def time = "0.042" 
                def timestamp = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss", Locale.US)
                    .format(java.time.LocalDateTime.now())
                writeFile file: 'publish.xml', text:
                    """<?xml version="1.0" encoding="UTF-8"?>
                        <testsuite tests="1" name="Publish" errors="1" failures="0" time="${time}" timestamp="${timestamp}">
                            <testcase classname="org.knime.publishing" name="NPM Publish" time="${time}">
                                <error type="general.publishing.error" message="${ex?.message.replace('"', '&quot;')}">NPM Publishing failed, most likely the version has not been increased</error>
                            </testcase>
                        </testsuite>
                    """
                currentBuild.result = 'UNSTABLE'
                env.testFailure = true
                junit 'publish.xml'
            }
        }
    }
} catch (ex) {
    currentBuild.result = 'FAILURE'
    throw ex
} finally {
    notifications.notifyBuild(currentBuild.result);
}
/* vim: set shiftwidth=4 expandtab smarttab: */
