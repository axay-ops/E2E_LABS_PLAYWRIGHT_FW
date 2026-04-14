import {test} from '@playwright/test'; 

test ('Network Monitoring', {tag: '@network'}, async ({page}) => {

    page.on('request', async (req) => {
        console.log('Outgoing request: ', req.method(), req.url());     
    });

    page.on ('response', async (res) => {
        console.log('Incoming response', res.status(), res.url());
    });

    await page.goto('https://dashboard.qa1.depotco.siemens.cloud/login/auth');
    await page.getByRole('textbox', { name: 'Username'}).fill('cmsqaautomation@gmail.com');
    await page.getByRole('textbox', { name: 'Password'}).fill('');
    await page.getByRole('button', { name: 'Log in'}).click();

});


