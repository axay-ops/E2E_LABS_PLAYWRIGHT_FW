import {test as setup, expect, Page} from '@playwright/test'
import { STORAGE_STATE_PATH } from '../playwright.config';
import { LoginPage } from '../pages/LoginPage';


 // const adminjsonFile = STORAGE_STATE_PATH('admin');
 // const customerjsonFile = STORAGE_STATE_PATH('customer');

setup ("Authenticate as Admin User", async ({page, baseURL})=> {
    const mypage = new LoginPage (page); 
    await mypage.navigateLoginPage(baseURL);
    await mypage.doLogin(process.env.ADMIN_USER!,  process.env.ADMIN_PASSWORD!);
    console.log("Admin path : "+STORAGE_STATE_PATH('admin'));
    expect(await mypage.getTitle()).toEqual("My Account");
    await page.waitForTimeout(10000);
    await page.context().storageState({path: STORAGE_STATE_PATH('admin')!});
})


setup ("Authenticate as Customer User", async ({page, baseURL})=> {
    const mypage = new LoginPage (page); 
    await mypage.navigateLoginPage(baseURL);
    await mypage.doLogin(process.env.CUSTOMER_USER!,  process.env.CUSTOMER_PASSWORD!);
    expect(await mypage.getTitle()).toEqual("My Account");
    console.log("Customer path : "+STORAGE_STATE_PATH('customer'));
    await page.context().storageState({path: STORAGE_STATE_PATH('customer')!});
})