node {

  checkout scm

  try{
    stage 'Run tests'
    sh 'make test'

    stage 'Bundle files'
    sh 'make build'

    stage 'Creating release environment'
    sh 'make release'

    stage 'Tag and publish release image'
    sh 'make tag latest \$(git rev-parse --short HEAD) \$(git tag --point-at HEAD)'
    sh 'make buildtag master \$(git tag --points-at HEAD)'

    withEnv(["DOCKER_USER=${DOCKER_USER}",
            "DOCKER_PASSWORD=${DOCKER_PASSWORD}"]){
          sh 'make login'
    }
    sh 'make publish'

  }
  finally{
    stage 'Cleaning environment'
    sh 'make clean'
    sh 'make logout'
  }
}
