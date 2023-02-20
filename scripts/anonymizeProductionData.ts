import fs from 'node:fs';
import path from 'node:path';
import {DatabaseSchema} from '../src/database';

/**
 * Run this from the repo root:
 * ts-node ./scripts/anonymizeProductionData.ts ./data/chat_-XXXXXXXXXXXXX/database.json > ./src/utils/testing/anonymizedDatabase.json
 */

const getDatabaseFile = async () => {
  const filePath = path.resolve(process.cwd(), process.argv[2]);
  const fileContent = await fs.promises.readFile(filePath, 'utf8');
  const database = JSON.parse(fileContent) as DatabaseSchema;

  return database;
}

function randomNumber(length: number) {
  return Math.floor(
    Math.pow(10, length-1) + Math.random() * (
      Math.pow(10, length) - Math.pow(10, length-1) - 1));
};

const main = async () => {
  const database = await getDatabaseFile();
  const locationIndexEntries = Object.entries(database.locationIndex)
  const anonymizedLocationIndexEntries = locationIndexEntries.map(([countryCode, userIds]) => {
    const anonymizedUserIds = userIds.map(userId => {
      return randomNumber(String(userId).length)
    });
  
    return [countryCode, anonymizedUserIds] 
  });
  const anonymizedRemoteIndexEntries = Object.entries(database.remoteIndex).map(([userId, location]) => {
    return [randomNumber(String(userId).length), location]
  })
  
  console.log(JSON.stringify({
    locationIndex: Object.fromEntries(anonymizedLocationIndexEntries),
    remoteIndex: Object.fromEntries(anonymizedRemoteIndexEntries),
    language: database.language,
    autoDeleteMessages: database.autoDeleteMessages
  }, null, 2))
}

main();