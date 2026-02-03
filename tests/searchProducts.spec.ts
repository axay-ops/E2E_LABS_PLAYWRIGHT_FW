// import {test, expect} from '@playwright/test'
import { test, expect} from '../fixtures/baseFixtures'
import { LoginPage } from '../pages/LoginPage'
import { HomePage } from '../pages/HomePage';
import { ResultsPage } from '../pages/ResultsPage';


// data provider for search results
let searchData = [
        {key: 'macbook', results: 3},
        {key: 'samsung', results: 2},
        {key: 'imac', results: 1},
        {key: 'canon', results: 1},
        {key: 'dummy', results: 0},
]

for (let product of searchData) {
test(`Verify Search Product: ${product.key}`, {tag: ['@smoke', '@regression', '@UI', '@product']}, async ({AdminhomePage})=> {
        //let loginpage =  new LoginPage (page);
        //await loginpage.gotoLoginPage();
        //let homepage: HomePage = await loginpage.doLogin('pwtest@nal.com', 'test123');
       
        //expect(await homepage.isUserLoggedIn()).toBeTruthy();
        //expect(await homepage.getTitle()).toEqual("My Account");

        let resultspage: ResultsPage = await AdminhomePage.doSearch(product.key); 
        expect(await resultspage.getProductsCount()).toBe(product.results);
})       
}

