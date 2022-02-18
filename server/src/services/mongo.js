const mongoose = require('mongoose');

const MONGO_URL =
    'mongodb+srv://nasa-api:eysJa5rVD0NfZ411@nasacluster.kwyqa.mongodb.net/' +
    'nasa-db?retryWrites=true&w=majority'

mongoose.connection.once('open', () => {
    console.log('MongoDB Connection Ready')
})

mongoose.connection.on('error', (err) => {
    console.log(err);
})

async function mongoConnect() {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    });
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect
};
