//mport {test, expect} from '@playwright/test'
import {test, expect} from '../fixtures/baseFixtures'
import { LoginPage } from '../pages/LoginPage'
import { HomePage } from '../pages/HomePage';
import { ResultsPage } from '../pages/ResultsPage';
import { ProductsInfoPage } from '../pages/ProductsInfoPage';
import { testData } from '../utils/dataLoader';


const searchData = [
    {searchKey: 'macbook', productName: 'MacBook',  productImageCount: 5},
    {searchKey: 'MacBook Air', productName: 'MacBook Air', productImageCount: 4},
    {searchKey: 'samsung', productName: 'Samsung Galaxy Tab 10.1',  productImageCount: 7}
];


for (let product of testData.searchData) {
test(`Verify Product Header and Images for Product ${product.productName}`, {tag: ['@smoke', '@UI']}, async ({AdminhomePage})=> {
           
        expect(await AdminhomePage.isUserLoggedIn()).toBeTruthy();
        expect(await AdminhomePage.getTitle()).toEqual("My Account");

        let resultspage: ResultsPage = await AdminhomePage.doSearch(product.searchKey); 
        expect(await resultspage.getProductsCount()).toBeGreaterThan(0);

        let productinfopage: ProductsInfoPage = await resultspage.selectProduct(product.productName);
        
        expect.soft(await productinfopage.getTitle()).toContain(product.productName);
        expect.soft(await productinfopage.getProductHeading()).toContain(product.productName);
        expect.soft(await productinfopage.getProductImageCount()).toBe(product.productImageCount);
})
}


const ProductData = [
    {searchKey: 'macbook', productName: 'MacBook', ResultCount: 3, productImageCount: 5, 
        "Brand": "Apple", "ProductCode": "Product 16", "RewardPoints": "600", "Availability":"In Stock",
        "Price":"$602.00", "ExTax": "$500.00"  
    },
    {searchKey: 'MacBook Air', productName: 'MacBook Air', ResultCount: 1, productImageCount: 4, 
        "Brand": "Apple", "ProductCode": "Product 17", "RewardPoints": "700", "Availability":"Out Of Stock",
        "Price":"$1,202.00", "ExTax": "$1,000.00"
    },
    {searchKey: 'samsung', productName: 'Samsung Galaxy Tab 10.1', ResultCount: 2,  productImageCount: 7,
         "Brand": "Samsung", "ProductCode": "SAM1", "RewardPoints": "1000", "Availability":"Pre-Order", 
        "Price":"$241.99", "ExTax": "$199.99"
    }
];


for (let product of ProductData) {
test.skip(`Verify Metadata for ${product.productName}`, {tag: ['@regression', '@UI']}, async ({AdminhomePage})=> {
       
        expect(await AdminhomePage.isUserLoggedIn()).toBeTruthy();
        expect(await AdminhomePage.getTitle()).toEqual("My Account");

        let resultspage: ResultsPage = await AdminhomePage.doSearch(product.searchKey); 
        expect(await resultspage.getProductsCount()).toBeGreaterThan(0);

        let productinfopage: ProductsInfoPage = await resultspage.selectProduct(product.productName);

        let fullProductDetails: Map<string, string|null|number> = await productinfopage.getFullProductDetails(); 

        expect.soft(fullProductDetails.get("header")).toBe(product.productName);
        expect.soft(fullProductDetails.get("imageCount")).toBe(product.productImageCount);
        expect.soft(fullProductDetails.get("PriceIncTax")).toBe(product.Price);
        expect.soft(fullProductDetails.get("PriceExTax")).toBe(product.ExTax);
        if (fullProductDetails.get("Brand")) {
            expect.soft(fullProductDetails.get("Brand")).toBe(product.Brand);
        }
        if (fullProductDetails.get("Product Code")) {
            expect.soft(fullProductDetails.get("Product Code")).toBe(product.ProductCode)
        }
        if (fullProductDetails.get("Reward Points")) {
            expect.soft(fullProductDetails.get("Reward Points")).toBe(product.RewardPoints)
        }
        if (fullProductDetails.get("Availability")) {
            expect.soft(fullProductDetails.get("Availability")).toBe(product.Availability)
        }
})
}










