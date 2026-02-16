// import {test,  expect} from '@playwright/test
import { test, test1, expect} from '../fixtures/baseFixtures';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { testData } from '../utils/dataLoader';


test('Verify Successful login for Admin User', {tag: ['@smoke', '@regression', '@UI']}, async ({AdminhomePage})=> { 
        expect(await AdminhomePage.getTitle()).toEqual(testData.homePageTitle);
});


test.skip('Verify Successful login for Customer User', {tag: ['@UI']}, async ({CustomerhomePage})=> {
        expect(await CustomerhomePage.getTitle()).toEqual(testData.homePageTitle);

});


 // From another Test1 (AUTH SETUP setup) base fixture
test1.skip('Verify Successful login for Admin User (via auth setup)', {tag: ['@smoke', '@regression', '@UI']}, async ({AdminhomePage})=> {

        expect(await AdminhomePage.isUserLoggedIn()).toBeTruthy();
        expect(await AdminhomePage.getTitle()).toEqual(testData.homePageTitle);
});


test1 ('Verify Successful login for Customer User (via auth setup)', {tag: ['@smoke', '@UI']}, async ({CustomerhomePage})=> {

        expect(await CustomerhomePage.isUserLoggedIn()).toBeTruthy();
        expect(await CustomerhomePage.getTitle()).toEqual(testData.homePageTitle);

});


test('Verify Invalid Login', 
    {
        tag: ['@regression', '@UI'],
        annotation: [
            { type: 'epic', description: 'EPIC 100 - Design login page for Open Cart App' },
            { type: 'feature', description: 'Login Page Feature' },
            { type: 'story', description: 'CMSTL-1- user can login to app' },
            { type: 'severity', description: 'Blocker' },
            { type: 'owner', description: 'Akshay k'}
        ]
    },
    async ({page, baseURL})=> {
        const loginpage =  new LoginPage (page);
        await loginpage.navigateLoginPage(baseURL);
        const homepage: HomePage = await loginpage.doLogin('abdsdscest2@nal.com', 'test125453');
        expect(await homepage.getTitle()).toEqual(testData.loginPageTitle);

        const errormsg = await loginpage.getWarningMsgforInvalidLogin();
        expect(errormsg).toContain('Warning:');
});

test ('Login Page: Verify presence of all options on right side panel', {tag: ['@regression', '@UI']}, async ({page, baseURL})=> {
        test.setTimeout(60000); // timeout for this test
        const loginpage = new LoginPage(page); 
        await loginpage.navigateLoginPage(baseURL); 
        
        const allOptions: string[] = await loginpage.getAllOptionsFromRightPanel(); 
        expect(allOptions.length).toEqual(testData.loginPageRightPanelOptions.length);
        expect(allOptions).toEqual(testData.loginPageRightPanelOptions);
});
