// expose our config directly to our application using module.exports
module.exports = {

    mesos : {
        prefix : "/mesos",
        endpoint : process.env.HTTP_MESOS
    },
    chronos : {
        prefix : "/chronos",
        endpoint : process.env.HTTP_CHRONOS,
        http_user : process.env.USER_CHRONOS,
        http_pass : process.env.PASS_CHRONOS
    },
    marathon : {
        prefix : "/marathon",
        endpoint : process.env.HTTP_MARATHON,
        http_user : process.env.USER_MARATHON,
        http_pass : process.env.PASS_MARATHON
    }

};



