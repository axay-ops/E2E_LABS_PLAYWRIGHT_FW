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

import { test} from '@playwright/test';

// entire file runs in serial mode
test.describe.configure({ mode: 'serial' });


test.describe('Shopping Cart Flow', () => {
        // This hook only runs for tests in this block
            test.beforeEach(async ({ page }) => {
                await page.goto('/cart');
            });

    // On this block runs in serial mode
    test.describe.configure({ mode: 'serial' });

    test('add item to cart', async ({ page }) => { await page.goto('/cart'); });

    test('remove item from cart', async ({ page }) => { await page.goto('/cart');});
});

