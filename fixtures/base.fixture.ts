import { mergeTests, expect, APIResponse } from '@playwright/test';
import { dbTest } from './db.fixture';
import { authTest, authTest_storageState, random_Email } from './auth.fixture';

// 1. Merge all specialized test extensions
export const test = mergeTests(dbTest, authTest, authTest_storageState, random_Email);

// 2. Re-export expect from here
export { expect }; 

export type {APIResponse };