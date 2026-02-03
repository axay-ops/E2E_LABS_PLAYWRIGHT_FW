import {test as base, expect} from '@playwright/test'
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

type csvFixture = {
    regData: registrationUserData [];
}

//export const test = base.extend<customFixtures>({
export const test = base.extend<csvFixture>({
    regData: async ({}, use) => {
        let csvfilecontent = fs.readFileSync('./data/registrationdata.csv', 'utf-8');
        let userdata: registrationUserData[]  = parse(csvfilecontent, {
        columns: true,
        skip_empty_lines: true 
        });
        await use(userdata);
    }
});

export {expect};

