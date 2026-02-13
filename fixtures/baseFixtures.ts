import {test as base, expect} from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { STORAGE_STATE_PATH } from '../playwright.config';


// const adminjsonFile = STORAGE_STATE_PATH('admin');
// const customerjsonFile = STORAGE_STATE_PATH('customer');

/* 
    OPTION 1`:
    This fixture doesnt use "auth setup". 
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
     const homePage = await loginPage.doLogin(testInfo.project.metadata.appAdminUsername, testInfo.project.metadata.appAdminPassword); 
     expect(await homePage.isUserLoggedIn()).toBeTruthy(); 
     await use(homePage);
     await context.close();

     // attach videos manually, since context is created manually (not by PW's page)
    //  const videoPath = await mypage.video()?.path();
    //  console.log(`Video saved in standard location: ${videoPath}`)
    //   if (videoPath) {
    //         await testInfo.attach('video', {
    //         path: videoPath,
    //         contentType: 'video/webm',
    //     });
    // }
    },

    CustomerhomePage:  async ({browser, baseURL}, use, testInfo) => {
     const context = await browser.newContext();
     const mypage = await context.newPage();   
     const loginPage = new LoginPage (mypage); 
     await loginPage.navigateLoginPage(baseURL);
     const homePage = await loginPage.doLogin(testInfo.project.metadata.appCustomerUsername, testInfo.project.metadata.appCustomerPassword); 
     expect(await homePage.isUserLoggedIn()).toBeTruthy(); 
     await use(homePage);
     await context.close();
    }
});

export {expect}; 


/* 
    OPTION 2:
    **    This Base fixture uses "auth setup", i.e. storage stage Json files. 
    **    It returns the respective Pages for Admin and Customer
*/

type customFixtures1 = {
    AdminhomePage: HomePage; 
    CustomerhomePage: HomePage;
}



export const test1 = base.extend<customFixtures1>({
    AdminhomePage: async ({browser, baseURL}, use, testInfo) => {

        const context = await browser.newContext(
                {storageState: STORAGE_STATE_PATH('admin')!,
                 recordVideo: {dir: testInfo.outputPath('videos')}});
        
        // display current active cookies to check values        
            const cookies = await context.cookies();
            console.log('Active Cookies:', cookies.map(c => c.name));
                    
        const mypage = await context.newPage();
        await mypage.goto(baseURL+'?route=account/account'); 
        const homepage = new HomePage (mypage);
        await use(homepage);
        await context.close();
        },

    CustomerhomePage: async ({browser, baseURL}, use, testInfo) => {
        const context = await browser.newContext(
                {storageState: STORAGE_STATE_PATH('customer')!,
                 recordVideo: {dir: testInfo.outputPath('videos')}});
        const mypage = await context.newPage();
        await mypage.goto(baseURL+'?route=account/account'); 
        const homepage = new HomePage (mypage);
        await use(homepage);
        await context.close();
        }
    }

);

