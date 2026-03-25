import { test, expect} from '../../fixtures/base.fixture';
import { apiURI, apiValidToken } from '../../playwright.config';
import {APIResponse} from '@playwright/test';

const headers = {
    'Authorization': `Bearer ${apiValidToken}`,
    'Content-Type': 'application/json'
};

test('E2E - API Crud operations', {tag: ['@regression', '@API']}, async ({request, randomEmail})=> {
    const requestBody = {
            name: 'Ak Kumar',
            email: randomEmail,
            gender: 'male',
            status: 'active'
    };

    // Step 1:  CREATE USER
    const responsePOST: APIResponse = await request.post(`${apiURI}/users`, {
     headers,
     data: requestBody});

        expect(responsePOST.status()).toBe(201);
        const createdUser = await responsePOST.json();
        console.log(createdUser);
        const userid = createdUser.id;
        console.log('New User Id:'+userid);

    // Step 2: GET USER
     const responseGET: APIResponse = await request.get(`${apiURI}/users/${userid}`, {
     headers});

        expect(responseGET.status()).toBe(200);
        const RetrievedUser = await responseGET.json();
        console.log(RetrievedUser);
        expect(RetrievedUser.id).toBe(userid);

    // Step 3:  UPDATE USER
        const updateBody = {
            name : 'updated name',
            status: 'inactive'
         };

    const responsePATCH: APIResponse = await request.patch(`${apiURI}/users/${userid}`, {headers,data: updateBody});
        expect(responsePATCH.status()).toBe(200);
        const UpdatedUser = await responsePATCH.json();
        console.log(UpdatedUser);
        expect(UpdatedUser.id).toBe(userid);
        expect(UpdatedUser.name).toEqual(updateBody.name);
        expect(UpdatedUser.status).toEqual(updateBody.status);
        console.log('User updated Successfully');

    // STEP 4: DELETE USER
    const responseDELETE: APIResponse = await request.delete(`${apiURI}/users/${userid}}`, {headers});
        expect(responseDELETE.status()).toBe(204);
        console.log('User Deleted Successfully');
        
    // STEP 5: GET deleted USER   
    const responseGETafterDeleted: APIResponse = await request.get(`${apiURI}/users/${userid}`, {headers});
        expect(responseGETafterDeleted.status()).toBe(404);
        console.log('User not found');    
});

