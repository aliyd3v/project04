const mongoose = require('mongoose')

exports.connectMongoDB = () => {
    mongoose.connect('mongodb+srv://nabiy5511:F2WJCLPcSX14sBz9@cluster0.adywe.mongodb.net/botcha')
        .then(() => { console.log('MongoDb connected.') })
        .catch((error) => console.log(error))
}