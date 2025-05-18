import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { beforeAll, afterAll, afterEach } from "@jest/globals";

// Configuración para pruebas
process.env.NODE_ENV = "test";
process.env.PORT = "4001";

let mongod: MongoMemoryServer;

// Setup MongoDB Memory Server
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri;
  await mongoose.connect(uri);
});

// Cleanup after tests
afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

// Clear collections between tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
