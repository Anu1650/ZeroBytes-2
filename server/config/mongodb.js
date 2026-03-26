import mongoose from 'mongoose';

const connectDB = async () => {

    mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));
    //Not in tutorial
    mongoose.connection.on('error', (err) => console.log('MongoDB connection error', err));
    mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));
    mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected'));
    mongoose.connection.on('close', () => console.log('MongoDB connection closed'));
    mongoose.connection.on('reconnectFailed', () => console.log('MongoDB reconnect failed'));
    mongoose.connection.on('fullsetup', () => console.log('MongoDB full setup'));
    mongoose.connection.on('all', () => console.log('MongoDB all'));
    mongoose.connection.on('all', () => console.log('MongoDB all'));
    mongoose.connection.on('all', () => console.log('MongoDB all'));

    await mongoose.connect(`${process.env.MONGO_URI}MernAuth`); 
};

export default connectDB;