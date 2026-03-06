//import {test, expect} from '@playwright/test';
import { test, expect} from '../fixtures/base.fixture';
import { LoginPage } from '../pages/LoginPage';
import { RegistrationPage } from '../pages/RegistrationPage';
import { csvUserdata } from '../utils/dataLoader';


for (const user of csvUserdata) {
test (`Verify User Registration: "${user.firstName}"`, {tag: ['@regression', '@UI', '@registration']}, async ({page, baseURL}) => {
    const loginpage = new LoginPage (page);
    await loginpage.navigateLoginPage(baseURL);
    const registrationpage: RegistrationPage = await loginpage.navigatetoRegisterPage();
    const userregister: boolean = await registrationpage.registerUser(
        user.firstName, 
        user.lastName, 
        await getrandomEmail(), 
        user.telephone, 
        user.password, 
        user.SubscribeNewsletter);
    expect(userregister).toBeTruthy(); 
});
}

async function getrandomEmail() {
    const randomvalue = Math.random().toString(36).substring(2,9);
    const email = `auto_${randomvalue}@x.com`;
    console.log('Email: '+email);
    return email;
}



