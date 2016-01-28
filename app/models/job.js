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
        type: Number
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
        type: Number
    },
    errorCount: {
        type: Number
    },
    lastSuccess: {
        type: Date
    },
    lastError: {
        type: Date
    },
    cpus: {
        type: Number
    },
    disk: {
        type: Number
    },
    mem: {
        type: Number
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