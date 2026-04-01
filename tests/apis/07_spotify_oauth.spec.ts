import { test, expect} from '../../fixtures/base.fixture';


let accessToken: string;

test.beforeEach(async({request})=> {

    const response = await request.post('https://accounts.spotify.com/api/token', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            grant_type: process.env.SPOTIFY_GRANTTYPE!,
            client_id:  process.env.SPOTIFY_CLIENTID!,
            client_secret: process.env.SPOTIFY_CLIENTSECRET!
        }
    });

    expect(response.status()).toBe(200);
    const responseBody =  await response.json();
    accessToken = responseBody.access_token;
    console.log('Access Token: ' +accessToken);
});
/*
test ('Get Album', {tag:['@api']}, async({ request })=> {
    console.log('Get Album API call');
    request.get('');  // pass access_token 
});

test ('Get Songs 2', {tag:['@api']}, async({ request })=> {
    console.log('Get Songs API call');
    request.get(''); // pass access_token 
});

*/

