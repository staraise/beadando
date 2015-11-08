module.exports = {
    identity: 'usrelation',
    migrate: 'safe',
    connection: 'default',
    attributes: {
        uid: {
            type: 'integer',
            required: true,
        },
        sid: {
            type: 'integer',
            required: true,
        },
    }
};