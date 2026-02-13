// import {test, expect} from '@playwright/test'
import { test, expect} from '../fixtures/baseFixtures';
import { ResultsPage } from '../pages/ResultsPage';


// data provider for search results
const searchData = [
        {key: 'macbook', results: 3},
        {key: 'samsung', results: 2},
        {key: 'imac', results: 1},
        {key: 'canon', results: 1},
        {key: 'dummy', results: 0},
];

for (const product of searchData) {
test(`Verify Search Product: ${product.key}`, {tag: ['@smoke', '@regression', '@UI', '@product']}, async ({AdminhomePage})=> {
        const resultspage: ResultsPage = await AdminhomePage.doSearch(product.key); 
        expect(await resultspage.getProductsCount()).toBe(product.results);
});       
}



