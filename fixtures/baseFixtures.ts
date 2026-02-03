import {test as base, expect, Page} from '@playwright/test'
import {HomePage} from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage';
import { log } from 'node:console';

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
    }
});

export {expect}; 
