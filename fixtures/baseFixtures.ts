import {test as base, expect, Page} from '@playwright/test'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage';
import { STORAGE_STATE_PATH } from '../playwright.config';
import { log } from 'node:console';

const adminjsonFile = STORAGE_STATE_PATH('admin');
const customerjsonFile = STORAGE_STATE_PATH('customer');

/* 
    OPTION 1`:
    Below fixture doesnt use auth setup.
    It returns the respective HomePage for Admin and Customer
*/

type customFixtures = {
    AdminhomePage: HomePage; 
    CustomerhomePage: HomePage;
}

export const test = base.extend<customFixtures>({
    AdminhomePage:  async ({browser, baseURL}, use, testInfo) => {
     const context = await browser.newContext({recordVideo: {dir: testInfo.outputPath('videos')}}); 
     const mypage = await context.newPage();   
     const loginPage = new LoginPage (mypage); 
     await loginPage.navigateLoginPage(baseURL);
     let homePage = await loginPage.doLogin(testInfo.project.metadata.appAdminUsername, testInfo.project.metadata.appAdminPassword); 
     expect(await homePage.isUserLoggedIn()).toBeTruthy(); 
     await use(homePage);
     await context.close();

     // attach videos manually, since context is created manually (not by PW's page)
     const videoPath = await mypage.video()?.path();
     console.log(`Video saved in standard location: ${videoPath}`)
      if (videoPath) {
            await testInfo.attach('video', {
            path: videoPath,
            contentType: 'video/webm',
        });
    }
    },

    CustomerhomePage:  async ({browser, baseURL}, use, testInfo) => {
     const context = await browser.newContext();
     const mypage = await context.newPage();   
     const loginPage = new LoginPage (mypage); 
     await loginPage.navigateLoginPage(baseURL);
     let homePage = await loginPage.doLogin(testInfo.project.metadata.appCustomerUsername, testInfo.project.metadata.appCustomerPassword); 
     expect(await homePage.isUserLoggedIn()).toBeTruthy(); 
     await use(homePage);
     await context.close();
    }
});

export {expect}; 



type customFixtures1 = {
    AdminhomePage: HomePage; 
    CustomerhomePage: Page;
}

/* 
    OPTION 2:
    Below Base fixture uses auth setup, i.e. storagestage Json files. 
    It returns the respective Pages for Admin and Customer

*/
export const test1 = base.extend<customFixtures1>({
    AdminhomePage: async ({browser}, use, testInfo) => {
        
        console.log (`path in base: ${STORAGE_STATE_PATH('admin')}`); 

        const context = await browser.newContext(
                {storageState: STORAGE_STATE_PATH('admin')!,
                 recordVideo: {dir: testInfo.outputPath('videos')}});
        const mypage = await context.newPage();
        const homepage = new HomePage (mypage);
        await use(homepage);
        await context.close();
        },

       // `playwright/.auth/${ENV}-${role}.json`)



    CustomerhomePage: async ({browser}, use, testInfo) => {
        const context = await browser.newContext(
                {storageState: STORAGE_STATE_PATH('customer')!,
                 recordVideo: {dir: testInfo.outputPath('videos')}});
        const mypage = await context.newPage();
        await use(mypage);
        await context.close();
        }
    }

);

