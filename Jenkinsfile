@Library('libpipelines') _

hose {
    EMAIL = 'rocket'
    BUILDTOOL = 'docker'
    DEVTIMEOUT = 120
    RELEASETIMEOUT = 80
    ATTIMEOUT = 90
    INSTALLTIMEOUT = 90
    VERSIONING_TYPE = "stratioVersion-3-3"
    UPSTREAM_VERSION = '0.43.4'

    DEV = { config ->
        doDockers(
            conf : config,
            dockerImages :[
                [
                    image : "stratio-metabase-builder",
                    dockerfile : "stratio/Dockerfile",
                    conf : config
                ]
            ]
        )
    }
}