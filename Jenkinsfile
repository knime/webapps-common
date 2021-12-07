#!groovy

def BN = (BRANCH_NAME == 'master' || BRANCH_NAME.startsWith('releases/')) ? BRANCH_NAME : 'releases/2022-06'

library "knime-pipeline@$BN"

properties([
    buildDiscarder(logRotator(numToKeepStr: '5')),
    disableConcurrentBuilds()
])

timeout(time: 15, unit: 'MINUTES') {
    try {
        node('nodejs-16') {
            cleanWs()
            checkout scm
            knimetools.reportJIRAIssues()

            stage('Install npm Dependencies') {
                env.lastStage = env.STAGE_NAME
                sh '''
                    npm ci
                '''
            }

            stage('Security Audit') {
                env.lastStage = 'Security Audit'

                catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
                    retry(3) { // because npm registry sometimes breaks
                        sh '''
                            npm run audit
                        '''
                    }
                }
            }

            stage('Static Code Analysis') {
                env.lastStage = 'Lint'
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
            if (currentBuild.result != 'UNSTABLE') {
                stage('NPM Build') {
                    env.lastStage = env.STAGE_NAME
                    sh '''
                        npm run build
                    '''
                }
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
                // TODO: NXT-736 enable NPM publishing stage
                if (false) {
                // if (currentBuild.result != 'UNSTABLE') {
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
        }

    } catch (ex) {
        currentBuild.result = 'FAILED'
        throw ex
    } finally {
        notifications.notifyBuild(currentBuild.result)
    }
}
