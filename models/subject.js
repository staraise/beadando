module.exports = {
    identity: 'subject',
    connection: 'default',
    attributes: {
        date: {
            type: 'datetime',
            defaultsTo: function () { return new Date(); },
            required: true,
        },
        subjectname: {
            type: 'string',
            required: true,
        },
        description: {
            type: 'string',
            required: true,
        },
        creditvalue:{
            type: 'string',
            required: true,
        },
    }
};