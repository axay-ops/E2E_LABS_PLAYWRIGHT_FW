import { test, expect} from '../../fixtures/base.fixture';
import { apiURI, apiValidToken } from '../../playwright.config';
import { compiledGorestGetUsers } from '../../utils/dataLoader'; 

test ('Validate API schema for - GET Users', {tag: ['@api']}, async({request})=> {
    
    const response = await request.get(`${apiURI}/users`, {
        headers: {
            'Authorization' : apiValidToken,
            'Content-Type': 'application/json'
        }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    
    // Validate Json Schema
    const isValid = compiledGorestGetUsers(responseBody);
    if (!isValid) {
        console.log(compiledGorestGetUsers.errors);
    }
    
    expect(isValid).toBe(true);
    console.log('API Schema is validated successfully');
    
});







