/* building a mongodb URI string based on configs read from .env file
*/
const { MongoMemoryServer } = require('mongodb-memory-server'),
    mongoose = require('mongoose');

const dbtestingConnBuilder = async () => {
    const mongoUri = await new MongoMemoryServer().getUri();
    mongoose.connect(mongoUri, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
        if (err) {
            console.log(err)
        }
        console.log('connected')
    });
    mongoose.connection.on('error', error => console.log(error));

    // const Mockgoose = require('mockgoose').Mockgoose;
    // const mockgoose = new Mockgoose(mongoose);
    // const DB_URI = 'mongodb://example.com/TestingDB';
    // mongoose.Promise = global.Promise;
    // mockgoose.prepareStorage()
    //     .then(() => {
    //         mongoose.connect(DB_URI,
    //             { useNewUrlParser: true, useCreateIndex: true })
    //             .then((res, err) => {
    //                 if (err) return console.log(err);
    //                 console.log('connected');
    //             })
    // mongoose.connection.on('connected', () => {
    //     console.log('db connection is now open');
    // });
    //     })
}


module.exports = dbtestingConnBuilder;
