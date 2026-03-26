
import { test, expect} from '../../fixtures/base.fixture';
import { apiURI, apiValidToken } from '../../playwright.config';
import {APIResponse} from '@playwright/test';

const headers = {
    'Authorization': `Bearer ${apiValidToken}`,
    'Content-Type': 'application/json'
};

const requestBody = {
            name: 'Ak Kumar',
            email: `aktest${Math.floor(100000 + Math.random() * 900000)}@mail.com`,
            gender: 'male',
            status: 'active'
    };


test('POST - Create User', {tag: ['@regression', '@API']}, async ({request})=> {

    const response: APIResponse = await request.post(`${apiURI}/users`, {
    headers, 
    data: requestBody
});

expect(response.status()).toBe(201); // 201 Created
const responseBody = await response.json();
console.log(responseBody);
});    


test('PATCH - partial update User', {tag: ['@API']}, async ({request})=> {

    const userid = 1020;
    const reqBody = {
           name: 'akk'
    };

    const response: APIResponse = await request.patch(`${apiURI}/users/${userid}}`, {
    headers, 
    data: reqBody
});

expect.soft(response.status()).toBe(200);
const responseBody = await response.json();
console.log(responseBody);
});    


test('DELETE - delete User', {tag: ['@API']}, async ({request})=> {

    const userid = 1002;

    const response: APIResponse = await request.delete(`${apiURI}/users/${userid}}`, {
    headers
});

expect.soft(response.status()).toBe(204);  // 204 No Content
}); 