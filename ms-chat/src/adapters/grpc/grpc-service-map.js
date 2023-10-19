
module.exports = {
    'chat': {
        service: {
            name: 'ChatService',
            handlers: require('./services/chat-service')
        }
    },
    'message': {
        service: {
            name: 'MessageService',
            handlers: require('./services/message-service')
        }
    },
};
