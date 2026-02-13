// import {test} from '../fixtures/dataFixtures'
// import { expect, Page} from '@playwright/test'
// import { LoginPage } from '../pages/LoginPage'
// import { RegistrationPage } from '../pages/RegistrationPage';

// Limitation:  Single test with multiple iterations.

/*
test("Verify User Registration", async ({regData, page, baseURL}) => {
    for (let user of regData) {
        let loginpage = new LoginPage (page);
        await loginpage.navigateLoginPage(baseURL);
        let registrationpage: RegistrationPage = await loginpage.navigatetoRegisterPage();
        let userregister: boolean = await registrationpage.registerUser(
            user.firstName, 
            user.lastName, 
            await getrandomEmail(), 
            user.telephone, 
            user.password, 
            user.SubscribeNewsletter)
        expect(userregister).toBeTruthy();
    }
});


async function getrandomEmail() {
    let randomvalue = Math.random().toString(36).substring(2,9);
    let email = `auto_${randomvalue}@x.com`
    console.log("Email: "+email)
    return email;
};

*/
