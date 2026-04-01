import { test, expect} from '../../fixtures/base.fixture';
import { apiURI, apiValidToken } from '../../playwright.config';
import {APIResponse} from '@playwright/test';

//const valid_token = 'ak-token';

test('GET All Users', {tag: ['@smoke', '@api']}, async ({request})=> {
const response: APIResponse = await request.get(`${apiURI}/users`, {
    headers: {
        Authorization: `Bearer ${apiValidToken}`
    }
});
expect(response.status()).toBe(200);
const responseBody = await response.json();
console.log(responseBody);
console.log('-----------------------');
console.log(JSON.stringify(responseBody, null, 2));

});


test('GET Single User', {tag: ['@smoke', '@api']}, async ({request})=> {
const response: APIResponse = await request.get(`${apiURI}/users/1010`, {
    headers: {
        Authorization: `Bearer ${apiValidToken}`
    }
});
expect.soft(response.status()).toBe(200);
const responseBody = await response.json();
console.log(responseBody);
});



test('POST - Create User', {tag: ['@regression', '@api']}, async ({request})=> {
    const requestBody = {
            name: 'Ak Kumar',
            email: `aktest${Date.now()}@mail.com`,
            // email: `aktest${Math.floor(100000 + Math.random() * 900000)}@mail.com`
            gender: 'male',
            status: 'active'

    };
    const response: APIResponse = await request.post(`${apiURI}/users`, {
    headers: {
        Authorization: `Bearer ${apiValidToken}`
    }, 
    data: requestBody
});

expect(response.status()).toBe(201);
const responseBody = await response.json();
console.log(responseBody);
});

