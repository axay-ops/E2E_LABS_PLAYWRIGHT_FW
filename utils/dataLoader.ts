import devData from '../data/dev-testdata.json' with { type: 'json' };
import qaData from '../data/qa-testdata.json' with { type: 'json' };
import stageData from '../data/stage-testdata.json' with { type: 'json' };
import prodData from '../data/stage-testdata.json' with { type: 'json' };

import path from 'path';
import fs from 'fs'; 
import {parse} from 'csv-parse/sync'; 
// import { fileURLToPath } from 'url';

const testenv = process.env.ENV || 'qa';
let data: any;  // eslint-disable-line @typescript-eslint/no-explicit-any

switch (testenv) {
        case 'qa':
                data = qaData;       
                break;
        case 'dev':
                data = devData; 
                break;
        case 'stage':
                data = stageData; 
                break;
        case 'prod':
                data = prodData; 
                break;
        default:
                data = qaData;
                break;
}

export const testData = data;


/***************************************************************** 
                *  CSV loader
****************************************************************/

// schema/type of registration data
type registrationUserData = {
    firstName: string,
    lastName: string,
    telephone: string, 
    password: string, 
    SubscribeNewsletter: string
};

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


const filePath = path.join(process.cwd(), 'data/bulk-registrationdata.csv');

//const filePath = path.join(__dirname, '../data/bulk-registrationdata.csv');
const csvfilecontent = fs.readFileSync(filePath, 'utf-8');

        const Userdata: registrationUserData[]  = parse(csvfilecontent, {
        columns: true,
        skip_empty_lines: true 
        });

export const csvUserdata = Userdata;




// export const testData = `${testenv}Data`;


/* 

In this specific TypeScript import, qaData is an Object that contains the entire parsed content of your JSON file.
What exactly is it?
        When you use a default import for a JSON file in a Playwright/TypeScript environment:
        Automatic Parsing: The build tool (like ts-node or Vite) automatically runs JSON.parse() on the file during the import process.
        Type Mapping: TypeScript looks at the keys and values inside qa.data.json and creates an anonymous type for qaData. 
                      This gives you IntelliSense (autocompletion) when you type qaData. in your editor.

*/