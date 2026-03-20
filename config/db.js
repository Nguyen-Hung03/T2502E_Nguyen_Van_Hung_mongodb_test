const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'eShop';

async function connectDB() {
    try {
        await client.connect();
        console.log(">>> Kết nối MongoDB thành công!");
        return client.db(dbName);
    } catch (error) {
        console.error("Lỗi kết nối:", error);
        process.exit(1);
    }
}

module.exports = { connectDB, client };