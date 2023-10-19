const dotenv = require('dotenv');
const { Database } = require('./configs/database');
const { GrpcServer } = require('./adapters/grpc/grpc-server');

(async () => {
    dotenv.config();

    await Database.connect();

    const grpcServer = new GrpcServer(
        process.env.GRPC_HOST || '0.0.0.0',
        process.env.GRPC_PORT || 50051
    );

    grpcServer.start();

    console.log(`GRPC Server is running at: ${grpcServer.host}:${grpcServer.port}`);
    console.log('Microservice has been started!');
})();
