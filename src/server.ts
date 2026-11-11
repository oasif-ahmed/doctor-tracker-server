import app from './app.js';
import config from './config/index.js';
import { connectDB, closeDB } from './lib/db.js';  // 🔄 REPLACE prisma with connectDB

const port = config.port

async function main() {
  try {
    // 🔌 CONNECT TO MONGODB FIRST (gearUp pattern)
    await connectDB();
    console.log('MongoDB Database connected successfully!');
    
    // 🚀 THEN START THE SERVER
    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
      console.log(`📊 Database: doctor-tracker`);
    });
  } catch (error) {
    console.error('❌ Error starting the server');
    console.error('Database connection failed:', error);
    
    // 🔌 DISCONNECT ON ERROR (gearUp pattern)
    await closeDB();
  }
}

main();