import { test, expect } from '../../fixtures/base.fixture';

test.describe('MongoDB API Tests', () => {

  test('Connect to MongoDB and verify connection', { tag: ['@smoke', '@db'] }, async ({ mongotest }) => {
    // Connection is already established via fixture
    const isConnected = await mongotest.checkConnection();
    expect(isConnected).toBeTruthy();
    console.log('MongoDB connection verified successfully');
  });

  test('Insert a document into MongoDB', { tag: ['@regression', '@db'] }, async ({ mongotest }) => {
    const collection = mongotest.db.collection('users');

    const testUser = {
      name: 'Test User',
      email: `test_${Date.now()}@example.com`,
      age: 25,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(testUser);
    expect(result.acknowledged).toBeTruthy();
    expect(result.insertedId).toBeDefined();

    console.log('Document inserted with ID:', result.insertedId);

    // Cleanup
    //await collection.deleteOne({ _id: result.insertedId });
  });

  test('Find documents from MongoDB', { tag: ['@smoke', '@db'] }, async ({ mongotest }) => {
    const collection = mongotest.db.collection('users');

    // Insert test data
    const testUser = {
      name: 'Find Test User',
      email: `findtest_${Date.now()}@example.com`,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const insertResult = await collection.insertOne(testUser);

    // Find the document
    const foundUser = await collection.findOne({ _id: insertResult.insertedId });

    expect(foundUser).toBeDefined();
    expect(foundUser?.name).toBe('Find Test User');
    expect(foundUser?.status).toBe('active');

    console.log('Found user:', foundUser);

    // Cleanup
   // await collection.deleteOne({ _id: insertResult.insertedId });
  });

  test('Update a document in MongoDB', { tag: ['@regression', '@db'] }, async ({ mongotest }) => {
    const collection = mongotest.db.collection('users');

    // Insert test data
    const testUser = {
      name: 'Update Test User',
      email: `updatetest_${Date.now()}@example.com`,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const insertResult = await collection.insertOne(testUser);

    // Update the document
    const updateResult = await collection.updateOne(
      { _id: insertResult.insertedId },
      { $set: { status: 'inactive', updatedAt: new Date() } }
    );

    expect(updateResult.acknowledged).toBeTruthy();
    expect(updateResult.modifiedCount).toBe(1);

    // Verify update
    const updatedUser = await collection.findOne({ _id: insertResult.insertedId });
    expect(updatedUser?.status).toBe('inactive');

    console.log('Updated user:', updatedUser);

    // Cleanup
    //await collection.deleteOne({ _id: insertResult.insertedId });
  });

  test('Delete a document from MongoDB', { tag: ['@regression', '@db'] }, async ({ mongotest }) => {
    const collection = mongotest.db.collection('users');

    // Insert test data
    const testUser = {
      name: 'Delete Test User',
      email: `deletetest_${Date.now()}@example.com`,
      status: 'active'
    };
    const insertResult = await collection.insertOne(testUser);

    // Delete the document
    const deleteResult = await collection.deleteOne({ _id: insertResult.insertedId });

    expect(deleteResult.acknowledged).toBeTruthy();
    expect(deleteResult.deletedCount).toBe(1);

    // Verify deletion
    const deletedUser = await collection.findOne({ _id: insertResult.insertedId });
    expect(deletedUser).toBeNull();

    console.log('Document deleted successfully');
  });

  test('Query multiple documents from MongoDB', { tag: ['@regression', '@db'] }, async ({ mongotest }) => {
    const collection = mongotest.db.collection('users');

    // Insert multiple test documents
    const testUsers = [
      { name: 'User 1', email: `user1_${Date.now()}@example.com`, age: 25, status: 'active' },
      { name: 'User 2', email: `user2_${Date.now()}@example.com`, age: 30, status: 'active' },
      { name: 'User 3', email: `user3_${Date.now()}@example.com`, age: 35, status: 'inactive' }
    ];
    const insertResult = await collection.insertMany(testUsers);

    expect(insertResult.acknowledged).toBeTruthy();
    expect(insertResult.insertedCount).toBe(3);

    // Query active users
    const activeUsers = await collection.find({ status: 'active' }).toArray();
    expect(activeUsers.length).toBeGreaterThanOrEqual(2);

    // Query users with age greater than 25
    const olderUsers = await collection.find({ age: { $gt: 25 } }).toArray();
    expect(olderUsers.length).toBeGreaterThanOrEqual(2);

    console.log('Active users:', activeUsers.length);
    console.log('Older users:', olderUsers.length);

    // Cleanup
   // await collection.deleteMany({ _id: { $in: Object.values(insertResult.insertedIds) } });
  });

  test('Count documents in MongoDB collection', { tag: ['@smoke', '@db'] }, async ({ mongotest }) => {
    const collection = mongotest.db.collection('users');

    // Get initial count
    const initialCount = await collection.countDocuments();
    console.log('Initial document count:', initialCount);

    // Insert test data
    const testUser = {
      name: 'Count Test User',
      email: `counttest_${Date.now()}@example.com`,
      status: 'active'
    };
    const insertResult = await collection.insertOne(testUser);

    // Get new count
    const newCount = await collection.countDocuments();
    expect(newCount).toBe(initialCount + 1);

    console.log('New document count:', newCount);

    // Cleanup
   await collection.deleteOne({ _id: insertResult.insertedId });
  });
});
