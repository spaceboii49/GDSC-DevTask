const mongoose = require('mongoose');

const clearDatabase = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/responses', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    await mongoose.connection.db.dropDatabase();
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    await mongoose.connection.close();
  }
};

clearDatabase();