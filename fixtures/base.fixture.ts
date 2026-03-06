import { mergeTests, expect } from '@playwright/test';
import { dbTest } from './db.fixture';
import { authTest, authTest_storageState } from './auth.fixture';

// 1. Merge all specialized test extensions
export const test = mergeTests(dbTest, authTest, authTest_storageState);

// 2. Re-export expect from here
export { expect }; 