import { test as base} from '@playwright/test';
import { MongoDbUtil } from '../utils/mongodbUtil';

// // @ts-expect-error: Playwright requires an object pattern even if no fixtures are used
export const dbTest = base.extend<{mongotest: MongoDbUtil }>({
  mongotest: async ({}, use) => {
    const mongo = new MongoDbUtil();
    await mongo.connect();
    if (await mongo.checkConnection()) {
      console.log('Mongo Connection successfull')
    }
    await use(mongo);
    await mongo.disconnect();
  },
});
