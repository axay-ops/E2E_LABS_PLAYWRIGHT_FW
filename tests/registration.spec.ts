import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegistrationPage } from '../pages/RegistrationPage';

import fs from 'fs'; 
import {parse} from 'csv-parse/sync'; 

// schema/type of registration data
type registrationUserData = {
    firstName: string,
    lastName: string,
    telephone: string, 
    password: string, 
    SubscribeNewsletter: string
}

const csvfilecontent = fs.readFileSync('./data/bulk-registrationdata.csv', 'utf-8');
const userdata: registrationUserData[]  = parse(csvfilecontent, {
    columns: true,
    skip_empty_lines: true 
});

for (const user of userdata) {
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



