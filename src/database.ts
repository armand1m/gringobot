import fs from 'node:fs';
import path from 'node:path';
import pino from 'pino';
import lodash from 'lodash';
import mkdirp from 'mkdirp';
import { Low, Memory } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { Alpha2Code } from 'i18n-iso-countries';
import { AvailableLocales } from './middlewares/createTranslateMiddleware/translate.js';

export interface DatabaseSchema {
  locationIndex: Partial<Record<Alpha2Code, number[]>>;
  remoteIndex: Record<number, RemoteEntry>;
  autoDeleteMessages: Record<string, number>;
  language: AvailableLocales;
}

export interface RemoteEntry {
  id: number;
  to: Alpha2Code;
  from: Alpha2Code;
}

export interface DatabaseInstance {
  addMemberLocation: (
    userId: number,
    countryCode: Alpha2Code
  ) => Promise<void>;
  removeMemberFrom: (
    userId: number,
    countryCode: Alpha2Code
  ) => Promise<void>;
  removeRemoteMember: (userId: number) => Promise<void>;
  getMembersAt: (countryCode: Alpha2Code) => number[];
  hasMemberRegistered: (
    userId: number,
    countryCode: Alpha2Code
  ) => boolean;
  getLocationIndex: () => DatabaseSchema['locationIndex'];
  findMember: (userId: number) => Promise<Alpha2Code[]>;
  addAutoDeleteMessage: (messageId: number) => Promise<void>;
  getAutoDeleteMessages: () => DatabaseSchema['autoDeleteMessages'];
  removeAutoDeleteMessage: (messageId: number) => Promise<void>;
  addRemoteMember: (
    userId: number,
    fromCountryCode: Alpha2Code,
    toCountryCode: Alpha2Code
  ) => Promise<void>;
  hasRemoteMemberRegistered: (userId: number) => boolean;
  getRemoteMembersFrom: (
    countryCode: Alpha2Code
  ) => Partial<Record<number, RemoteEntry>>;
  getRemoteMembersTo: (
    countryCode: Alpha2Code
  ) => Partial<Record<number, RemoteEntry>>;
  getAllRemoteMembers: () => Partial<Record<number, RemoteEntry>>;
  getGroupLanguage: () => Promise<AvailableLocales>;
  setGroupLanguage: (locale: AvailableLocales) => Promise<void>;
}

const emptyDatabase: DatabaseSchema = {
  locationIndex: {},
  remoteIndex: {},
  autoDeleteMessages: {},
  language: 'en',
};

const getChatDatabasePath = async (
  chatId: number,
  dataPath: string,
  logger: pino.Logger
) => {
  const chatDatabasePath = path.resolve(dataPath, `chat_${chatId}`);

  try {
    await fs.promises.access(chatDatabasePath);
  } catch (error) {
    logger.info(`Creating "${chatDatabasePath}" with "mkdir -p"`);
    await mkdirp(chatDatabasePath);
    logger.info(`Created ${chatDatabasePath}`);
  }

  const databaseFilePath = path.resolve(
    chatDatabasePath,
    'database.json'
  );

  return databaseFilePath;
};

class LowWithLodash<T> extends Low<T> {
  chain: lodash.ExpChain<this['data']> = lodash
    .chain(this)
    .get('data');
}

export const createDatabase = async (
  chatId: number,
  dataPath: string,
  logger: pino.Logger
) => {
  const databaseFilePath = await getChatDatabasePath(
    chatId,
    dataPath,
    logger
  );

  const db = new LowWithLodash<DatabaseSchema>(
    new JSONFile(databaseFilePath)
  );

  // initialize database with empty data if needed
  await db.read();
  db.data ||= emptyDatabase;
  await db.write();

  return createDatabaseMethods(db);
};

export const createTestDatabase = async (
  databaseFilePath: string
) => {
  const db = new LowWithLodash<DatabaseSchema>(new Memory());

  const testDatabaseContent = await fs.promises.readFile(
    databaseFilePath,
    'utf-8'
  );
  const testDatabaseInitialData = JSON.parse(testDatabaseContent);

  db.data = testDatabaseInitialData;

  await db.write();

  return createDatabaseMethods(db);
};

const createDatabaseMethods = async (
  db: LowWithLodash<DatabaseSchema>
): Promise<DatabaseInstance> => {
  const instance: DatabaseInstance = {
    getLocationIndex: () => {
      return db.chain.get('locationIndex').value();
    },
    removeMemberFrom: async (userId, countryCode) => {
      db.chain
        .get('locationIndex')
        .get(countryCode)
        .pull(userId)
        .value();
      return db.write();
    },
    removeRemoteMember: async (userId) => {
      db.chain.get('remoteIndex').unset(userId).value();
      return db.write();
    },
    hasMemberRegistered: (userId, countryCode) => {
      const members =
        db.chain.get('locationIndex').get(countryCode).value() ?? [];

      return members.includes(userId);
    },
    addMemberLocation: async (userId, countryCode) => {
      const collection = db.chain.get('locationIndex');
      const currentState = collection.value();

      if (currentState[countryCode] === undefined) {
        collection
          .assign({
            ...currentState,
            [countryCode]: [userId],
          })
          .value();
      } else {
        collection.get(countryCode).push(userId).value();
      }

      return db.write();
    },
    addRemoteMember: async (
      userId,
      fromCountryCode,
      toCountryCode
    ) => {
      const collection = db.chain.get('remoteIndex');
      const currentState = collection.value();

      if (currentState[userId] === undefined) {
        collection
          .assign({
            ...currentState,
            [userId]: { from: fromCountryCode, to: toCountryCode },
          })
          .value();

        return db.write();
      }
    },
    hasRemoteMemberRegistered: (userId) => {
      const members = db.chain.get('remoteIndex').value() ?? [];

      return Object.keys(members).includes(userId.toString());
    },
    getRemoteMembersFrom: (countryCode) => {
      const members = db.chain.get('remoteIndex').value() ?? [];

      const filteredMembers = Object.entries(members).filter(
        ([_key, value]) => {
          return value['from'] === countryCode;
        }
      );

      return Object.fromEntries(filteredMembers);
    },
    getRemoteMembersTo: (countryCode) => {
      const members = db.chain.get('remoteIndex').value() ?? [];

      const filteredMembers = Object.entries(members).filter(
        ([_key, value]) => {
          return value['to'] === countryCode;
        }
      );
      return Object.fromEntries(filteredMembers);
    },
    getAllRemoteMembers: () => {
      return db.chain.get('remoteIndex').value() ?? [];
    },
    getMembersAt: (code) => {
      return db.chain.get('locationIndex').get(code).value() ?? [];
    },
    findMember: async (userId) => {
      return db.chain
        .get('locationIndex')
        .pickBy((value) => value?.includes(userId))
        .keys()
        .value() as Alpha2Code[];
    },
    addAutoDeleteMessage: async (messageId: number) => {
      const messages = db.chain.get('autoDeleteMessages');
      const currentState = messages.value();

      messages
        .assign(currentState, { [messageId]: Date.now() })
        .value();

      return db.write();
    },
    getAutoDeleteMessages: () => {
      return db.chain.get('autoDeleteMessages').value();
    },
    removeAutoDeleteMessage: async (messageId: number) => {
      db.chain.get('autoDeleteMessages').unset(messageId).value();
      return db.write();
    },
    getGroupLanguage: async () => {
      return (db.chain.get('language').value() ??
        'en') as AvailableLocales;
    },
    setGroupLanguage: async (language) => {
      db.chain.set('language', language).value();
      return db.write();
    },
  };

  return instance;
};
