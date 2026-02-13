import devData from '../data/dev-testdata.json' with { type: 'json' };
import qaData from '../data/qa-testdata.json' with { type: 'json' };
import stageData from '../data/stage-testdata.json' with { type: 'json' };

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
        default:
        data = qaData;
        break;
}

export const testData = data;

//export const testData = `${testenv}Data`;
// export const testData = process.env.ENV === 'prod' ? prodData : qaData;


/* 

In this specific TypeScript import, qaData is an Object that contains the entire parsed content of your JSON file.
What exactly is it?
        When you use a default import for a JSON file in a Playwright/TypeScript environment:
        Automatic Parsing: The build tool (like ts-node or Vite) automatically runs JSON.parse() on the file during the import process.
        Type Mapping: TypeScript looks at the keys and values inside qa.data.json and creates an anonymous type for qaData. 
                      This gives you IntelliSense (autocompletion) when you type qaData. in your editor.

*/