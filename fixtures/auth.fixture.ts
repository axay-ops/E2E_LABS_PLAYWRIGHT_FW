import { test as base, expect} from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { STORAGE_STATE_PATH } from '../playwright.config';

type customFixtures = {
    AdminhomePage: HomePage; 
    CustomerhomePage: HomePage;
}

export const authTest  = base.extend<customFixtures>({
    AdminhomePage:  async ({page, baseURL}, use, testInfo) => {  
     const loginPage = new LoginPage (page); 
     await loginPage.navigateLoginPage(baseURL);
     const homePage = await loginPage.doLogin(testInfo.project.metadata.appAdminUsername, testInfo.project.metadata.appAdminPassword); 
     expect(await homePage.isUserLoggedIn()).toBeTruthy(); 
     await use(homePage);
     await page.close();
    },

    CustomerhomePage:  async ({page, baseURL}, use, testInfo) => { 
     const loginPage = new LoginPage (page); 
     await loginPage.navigateLoginPage(baseURL);
     const homePage = await loginPage.doLogin(testInfo.project.metadata.appCustomerUsername, testInfo.project.metadata.appCustomerPassword); 
     expect(await homePage.isUserLoggedIn()).toBeTruthy(); 
     await use(homePage);
     await page.close();
    }
});



/* 
    OPTION :
    **    This Base fixture uses "auth setup", i.e. storage stage Json files. 
    **    It returns the respective Pages for Admin and Customer
*/

type customFixtures1 = {
    AdminhomePage_SS: HomePage; 
    CustomerhomePage_SS: HomePage;
}

export const authTest_storageState = base.extend<customFixtures1>({
    AdminhomePage_SS: async ({browser, baseURL}, use, testInfo) => {

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
        
        // attach videos manually, since context is created manually (not by PW's page object)
            const videoPath = await mypage.video()?.path();
            console.log(`Video saved in standard location: ${videoPath}`);
                if (videoPath) {
                await testInfo.attach('video', {
                path: videoPath,
                contentType: 'video/webm',
            });
          }
        },

    CustomerhomePage_SS: async ({browser, baseURL}, use, testInfo) => {
        const context = await browser.newContext(
                {storageState: STORAGE_STATE_PATH('customer')!,
                 recordVideo: {dir: testInfo.outputPath('videos')}});
        const mypage = await context.newPage();
        await mypage.goto(baseURL+'?route=account/account'); 
        const homepage = new HomePage (mypage);
        await use(homepage);
        await context.close();

        // attach videos manually, since context is created manually (not by PW's page object)
            const videoPath = await mypage.video()?.path();
            console.log(`Video saved in standard location: ${videoPath}`);
                if (videoPath) {
                await testInfo.attach('video', {
                path: videoPath,
                contentType: 'video/webm',
            });
          }
        }
    }
);

