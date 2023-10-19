const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const path = require('path')

const dotenv = require('dotenv');
const { Database } = require('./configs/database');
const { GrpcServer } = require('./adapters/grpc/grpc-server');

(async () => {
    dotenv.config();

    await Database.connect(()=> {
        require('./adapters/db/models/chat');
        require('./adapters/db/models/message');
    });

    const grpcServer = new GrpcServer(
        process.env.GRPC_HOST || '0.0.0.0',
        process.env.GRPC_PORT || 50051
    );

    grpcServer.start();

    console.log(`GRPC Server is running at: ${grpcServer.host}:${grpcServer.port}`);
    console.log('Microservice has been started!');

    const protoObject = protoLoader.loadSync(path.resolve(__dirname, './adapters/grpc/proto/chat.proto'));
    const ChatDefinition = grpc.loadPackageDefinition(protoObject)
    const client = new ChatDefinition.ChatService('localhost:50051', grpc.credentials.createInsecure());

    const noteStream = client.ChatStream({ chatId: 0,  userMessage: 'Olá Chat!' });
    noteStream.on('data', (note) => console.log(note));
})();
