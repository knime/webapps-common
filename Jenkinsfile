#!groovy

// Jenkinsfile for the webapps commons
// NOTE: This does not create any build artifacts. It is merely for automated testing.

def BN = BRANCH_NAME == 'master' || BRANCH_NAME.startsWith('releases/') ? BRANCH_NAME : 'master'

library "knime-pipeline@$BN"

properties([
  buildDiscarder(logRotator(numToKeepStr: '20')),
  parameters([
    booleanParam(
      name: 'PUBLISH_ESLINT_CONFIG',
      description: 'Triggers a publish of @knime/eslint-config to npm. Make sure you update the version number in ' 
          + 'package.json. Only for master branch.',
      defaultValue: false
    )
  ])
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

        if ((BRANCH_NAME == "vue3") && (params.PUBLISH_ESLINT_CONFIG)) {
            try {
                stage('Deploy to npm') {
                    env.lastStage = env.STAGE_NAME
                    withCredentials([string(credentialsId: 'NPM_AUTH_TOKEN', variable: 'NPM_AUTH_TOKEN'),]) {
                        sh '''
                            echo "//registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}" >> ~/.npmrc
                            target/node/npm publish lint --quiet --access=public
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
    notifications.notifyBuild(currentBuild.result)
}
