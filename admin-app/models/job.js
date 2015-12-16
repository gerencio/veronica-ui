var mongoose = require('mongoose');

var SMschema = mongoose.Schema({
    name: {
        type: String
    },
    command: {
        type: String
    },
    shell: {
        type: Boolean
    },
    epsilon: {
        type: String
    },
    executor: {
        type: String
    },
    executorFlags: {
        type: String
    },
    retries: {
        type: String
    },
    owner: {
        type: String
    },
    ownerName: {
        type: String
    },
    description: {
        type: String
    },
    async: {
        type: Boolean
    },
    successCount: {
        type: String
    },
    errorCount: {
        type: String
    },
    lastSuccess: {
        type: String
    },
    lastError: {
        type: String
    },
    cpus: {
        type: String
    },
    disk: {
        type: String
    },
    mem: {
        type: String
    },
    disabled: {
        type: Boolean
    },
    softError: {
        type: Boolean
    },
    dataProcessingJobType: {
        type: Boolean
    },
    errorsSinceLastSuccess: {
        type: String
    },
    uris: {
        type: Array
    },
    environmentVariables: {
        type: Array
    },
    arguments: {
        type: Array
    },
    highPriority: {
        type: Boolean
    },
    runAsUser: {
        type: String
    },
    constraints: {
        type: Array
    },
    schedule: {
        type: String
    },
    scheduleTimeZone: {
        type: String
    }
});


module.exports = mongoose.model('Job', SMschema);