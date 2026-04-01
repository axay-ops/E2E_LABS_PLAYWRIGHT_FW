import { test, expect} from '../../fixtures/base.fixture';

const apiURI = 'https://the-internet.herokuapp.com/basic_auth';
const username = 'admin';
const password = 'admin';

test(' Basic Auth Test', {tag:['@api']}, async({ request})=> {

    // convert username and password into base64 string
    const credentials = Buffer.from(`${username}:${password}`).toString('base64'); 

    // call GET api with BASIC authorization
    const response = await request.get(`${apiURI}`, {
        headers: {
            'Authorization': `Basic ${credentials}`
        }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.text();
    console.log(JSON.stringify(responseBody, null, 2));

});


test(' Basic Auth Test with Credentials from pw config file', {tag:['@api']}, async({ request})=> {

    // credentials comes from pw config file httpCredentials by default.
    const response = await request.get(`${apiURI}`);
    expect(response.status()).toBe(200);
    const responseBody = await response.text();
    console.log('without stringify'+responseBody);
    console.log(JSON.stringify(responseBody, null, 2));

});

