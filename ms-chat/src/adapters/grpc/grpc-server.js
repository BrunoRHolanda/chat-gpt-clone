const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

class GrpcServer {
    static _server = null;
    constructor(host, port ) {
        this._host = host;
        this._port = port;
    }

    get port() {
        return this._port;
    }

    get host() {
        return this._host;
    }

    _loadServices() {
        const ChatDefinition = grpc.loadPackageDefinition(
            protoLoader.loadSync(path.resolve(__dirname, './proto/chat.proto'))
        );

        GrpcServer._server.addService(ChatDefinition.ChatService.service, require('./services/chat-service'));
    }

    _init() {
        if (GrpcServer._server !== null) {
            GrpcServer._server.close();
        }

        GrpcServer._server = new grpc.Server();

        this._loadServices();
    }

    start() {
        this._init();

        GrpcServer._server.bindAsync(`${this._host}:${this._port}`, grpc.ServerCredentials.createInsecure(), () => {
            GrpcServer._server.start();
        });
    }
}

module.exports = { GrpcServer };
