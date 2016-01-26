// expose our config directly to our application using module.exports
module.exports = {

    mesos : {
        prefix : "/mesos/",
        http_host : process.env.HTTP_MESOS,
        http_port : process.env.PORT_MESOS
    },
    chronos : {
        prefix : "/chronos/",
        http_host : process.env.HTTP_CHRONOS,
        http_port : process.env.PORT_CHRONOS,
        http_auth : process.env.AUTH_CHRONOS
    },
    marathon : {
        prefix : "/marathon/",
        http_host : process.env.HTTP_MARATHON,
        http_port : process.env.PORT_MARATHON,
        http_auth : process.env.AUTH_MARATHON
    }

};



