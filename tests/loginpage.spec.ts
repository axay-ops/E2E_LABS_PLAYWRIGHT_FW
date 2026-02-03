// import {test, expect} from '@playwright/test
import {test, expect} from '../fixtures/baseFixtures'
import { LoginPage } from '../pages/LoginPage'
import { HomePage } from '../pages/HomePage';


test('Verify Successful login for Admin User', {tag: ['@smoke', '@regression', '@UI']}, async ({AdminhomePage})=> {

        expect(await AdminhomePage.isUserLoggedIn()).toBeTruthy();
        expect(await AdminhomePage.getTitle()).toEqual("My Account");
})

test('Verify Successful login for Customer User', {tag: ['@smoke', '@regression', '@UI']}, async ({CustomerhomePage})=> {

        expect(await CustomerhomePage.isUserLoggedIn()).toBeTruthy();
        expect(await CustomerhomePage.getTitle()).toEqual("My Account");

})


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
        let loginpage =  new LoginPage (page);
        await loginpage.navigateLoginPage(baseURL);
        let homepage: HomePage = await loginpage.doLogin('pwtest@nal.com', 'test125453');
        expect(await homepage.getTitle()).toEqual("Account Login");

        const errormsg = await loginpage.getWarningMsgforInvalidLogin();
        expect(errormsg).toContain("Warning: No match for E-Mail Address and/or Password."); 

})



