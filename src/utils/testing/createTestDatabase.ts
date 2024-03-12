import fs from 'node:fs';
import { Memory } from 'lowdb';
import {
  createDatabaseMethods,
  DatabaseSchema,
  LowWithLodash,
  emptyDatabase,
} from '../../database.js';
import { mainFakeTestUser } from './fakeUser.js';

export const createTestDatabase = async (
  databaseFilePath: string
) => {
  const db = new LowWithLodash<DatabaseSchema>(
    new Memory(),
    emptyDatabase
  );

  const testDatabaseContent = await fs.promises.readFile(
    databaseFilePath,
    'utf-8'
  );
  const testDatabaseInitialData = JSON.parse(
    testDatabaseContent
  ) as DatabaseSchema;

  // Includes the mainFakeTestUser in NL
  testDatabaseInitialData.locationIndex.NL = [
    ...(testDatabaseInitialData.locationIndex.NL ?? []),
    mainFakeTestUser.id,
  ];

  db.data = testDatabaseInitialData;

  await db.write();

  return createDatabaseMethods(db);
};
