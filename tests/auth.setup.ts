import {test as setup, expect, Page} from '@playwright/test'
import { LoginPage } from '../pages/LoginPage';
import { STORAGE_STATE_PATH } from '../playwright.config';
import fs from 'fs';

 // const adminjsonFile = STORAGE_STATE_PATH('admin');
 // const customerjsonFile = STORAGE_STATE_PATH('customer');

setup ("Authenticate as Admin User", async ({page, baseURL})=> {
    const mypage = new LoginPage (page); 
    await mypage.navigateLoginPage(baseURL);
    await mypage.doLogin(process.env.ADMIN_USER!,  process.env.ADMIN_PASSWORD!);
    expect(await mypage.getTitle()).toEqual("My Account");
    
    await mypage.saveSessionState('admin');

    const authFile = STORAGE_STATE_PATH('admin');
    const state = JSON.parse(fs.readFileSync(authFile, 'utf-8'));

    // 1. Check if cookies exist
    expect (await(state.cookies.length)).toBeGreaterThan(0);
})


setup ("Authenticate as Customer User", async ({page, baseURL})=> {
    const mypage = new LoginPage (page); 
    await mypage.navigateLoginPage(baseURL);
    await mypage.doLogin(process.env.CUSTOMER_USER!,  process.env.CUSTOMER_PASSWORD!);
    expect(await mypage.getTitle()).toEqual("My Account");
    await mypage.saveSessionState('customer');
    
    const authFile = STORAGE_STATE_PATH('customer');
    const state = JSON.parse(fs.readFileSync(authFile, 'utf-8'));

    // 1. Check if cookies exist
    expect (await(state.cookies.length)).toBeGreaterThan(0);

})


