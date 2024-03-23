const mongoose = require('mongoose')

const connectDB = async () => {
  const MONGO_URI = "mongodb://localhost:27017/PE_SDN301m_TrialTest_StudentCodeDB"
  try {
    const conn = await mongoose.connect(MONGO_URI)
    console.log(`Mongodb connected: ${conn.connection.host}`)
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = connectDB