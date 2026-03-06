import { MongoClient, Db } from 'mongodb';

export class MongoDbUtil {
  private client: MongoClient;
  public db!: Db;

  constructor() {
    const uri = process.env.MONGO_URI;
    const dbName = process.env.MONGO_DB_NAME;

    if (!uri || !dbName) {
      throw new Error('Missing MongoDB configuration in environment variables.');
    }

    this.client = new MongoClient(uri);
  }

  async connect() {
    await this.client.connect();
    this.db = this.client.db(process.env.MONGO_DB_NAME);
    return this;
  }

  async disconnect() {
    await this.client.close();
  }


  async checkConnection() {
    try {
      // The 'ping' command is the standard way to verify a working connection
      await this.client.db(process.env.MONGO_DB_NAME).command({ ping: 1 });
      return true;
      } 
    catch (error) {
      console.error('MongoDB connection failed:', error);
      return false;
      }
  }
}