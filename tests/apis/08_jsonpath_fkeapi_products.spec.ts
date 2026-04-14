import { test, expect } from '../../fixtures/base.fixture';
import { APIResponse } from '@playwright/test';
import { JSONPath } from 'jsonpath-plus';

const FAKESTORE_API = 'https://fakestoreapi.com';

test.describe('FakeStore API - Products JSONPath Validation', () => {

    test('GET All Products - Validate Response Structure', { tag: ['@smoke', '@jsonpath'] }, async ({ request }) => {
        const startTime = Date.now();
        const response: APIResponse = await request.get(`${FAKESTORE_API}/products`);
        const responseTime = Date.now() - startTime;

        // Validate response time is less than 1 second
        expect(responseTime).toBeLessThan(1000);
        console.log(`Response time: ${responseTime}ms`);

        expect(response.status()).toBe(200);
        const responseBody = await response.json();

        // Validate response is an array
        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);

        console.log(`Total products: ${responseBody.length}`);
    });

    test('JSONPath - Validate All Product IDs', { tag: ['@regression', '@jsonpath'] }, async ({ request }) => {
        const startTime = Date.now();
        const response: APIResponse = await request.get(`${FAKESTORE_API}/products`);
        const responseTime = Date.now() - startTime;

        // Validate response time is less than 1 second
        expect(responseTime).toBeLessThan(1000);
        console.log(`Response time: ${responseTime}ms`);

        const responseBody = await response.json();

        // Get all product IDs using JSONPath
        const productIds = JSONPath({ path: '$[*].id', json: responseBody });

        console.log('Product IDs:', productIds);
        expect(productIds.length).toBeGreaterThan(0);

        // Verify all IDs are numbers
        productIds.forEach((id: number) => {
            expect(typeof id).toBe('number');
        });
    });

    test('JSONPath - Validate All Product Titles', { tag: ['@regression', '@jsonpath'] }, async ({ request }) => {
        const startTime = Date.now();
        const response: APIResponse = await request.get(`${FAKESTORE_API}/products`);
        const responseTime = Date.now() - startTime;

        // Validate response time is less than 1 second
        expect(responseTime).toBeLessThan(1000);
        console.log(`Response time: ${responseTime}ms`);

        const responseBody = await response.json();

        // Get all product titles using JSONPath
        const productTitles = JSONPath({ path: '$[*].title', json: responseBody });

        console.log(`Total titles found: ${productTitles.length}`);
        console.log('Sample titles:', productTitles.slice(0, 3));

        // Verify all titles are strings and not empty
        productTitles.forEach((title: string) => {
            expect(typeof title).toBe('string');
            expect(title.length).toBeGreaterThan(0);
        });
    });

    test('JSONPath - Validate Product Prices', { tag: ['@regression', '@jsonpath'] }, async ({ request }) => {
        const startTime = Date.now();
        const response: APIResponse = await request.get(`${FAKESTORE_API}/products`);
        const responseTime = Date.now() - startTime;

        // Validate response time is less than 1 second
        expect(responseTime).toBeLessThan(1000);
        console.log(`Response time: ${responseTime}ms`);

        const responseBody = await response.json();

        // Get all product prices using JSONPath
        const prices = JSONPath({ path: '$[*].price', json: responseBody });

        console.log('Sample prices:', prices.slice(0, 5));

        // Verify all prices are numbers and greater than 0
        prices.forEach((price: number) => {
            expect(typeof price).toBe('number');
            expect(price).toBeGreaterThan(0);
        });

        // Find min and max prices
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        console.log(`Price range: $${minPrice} - $${maxPrice}`);
    });

    test('JSONPath - Filter Products by Category', { tag: ['@regression', '@jsonpath'] }, async ({ request }) => {
        const startTime = Date.now();
        const response: APIResponse = await request.get(`${FAKESTORE_API}/products`);
        const responseTime = Date.now() - startTime;

        // Validate response time is less than 1 second
        expect(responseTime).toBeLessThan(1000);
        console.log(`Response time: ${responseTime}ms`);

        const responseBody = await response.json();

        // Get all electronics products using JSONPath filter
        const electronicsProducts = JSONPath({ path: '$[?(@.category == \'electronics\')]', json: responseBody });

        console.log(`Electronics products count: ${electronicsProducts.length}`);
        console.log('Electronics products:', electronicsProducts.map((p:  { title: string }) => p.title));  // :any --> { title: string } to fix eslint

        expect(electronicsProducts.length).toBeGreaterThan(0);

        // Verify all filtered products are electronics
        electronicsProducts.forEach((product: {category: string}) => {
            expect(product.category).toBe('electronics');
        });
    });

    test('JSONPath - Filter Products by Price Range', { tag: ['@regression', '@jsonpath'] }, async ({ request }) => {
        const startTime = Date.now();
        const response: APIResponse = await request.get(`${FAKESTORE_API}/products`);
        const responseTime = Date.now() - startTime;

        // Validate response time is less than 1 second
        expect(responseTime).toBeLessThan(1000);
        console.log(`Response time: ${responseTime}ms`);

        const responseBody = await response.json();

        // Get products priced between $50 and $200
        const midRangeProducts = JSONPath({ path: '$[?(@.price >= 50 && @.price <= 200)]', json: responseBody });

        console.log(`Products in $50-$200 range: ${midRangeProducts.length}`);

        // Verify all products are in the specified price range
        midRangeProducts.forEach((product: {price:string, title:string}) => {
            expect(product.price).toBeGreaterThanOrEqual(50);
            expect(product.price).toBeLessThanOrEqual(200);
            console.log(`${product.title}: $${product.price}`);
        });
    });

    test('JSONPath - Validate Product Ratings', { tag: ['@regression', '@jsonpath'] }, async ({ request }) => {
        const startTime = Date.now();
        const response: APIResponse = await request.get(`${FAKESTORE_API}/products`);
        const responseTime = Date.now() - startTime;

        // Validate response time is less than 1 second
        expect(responseTime).toBeLessThan(1000);
        console.log(`Response time: ${responseTime}ms`);

        const responseBody = await response.json();

        // Get all rating rates using nested JSONPath
        const ratings = JSONPath({ path: '$[*].rating.rate', json: responseBody });
        const ratingCounts = JSONPath({ path: '$[*].rating.count', json: responseBody });

        console.log('Sample ratings:', ratings.slice(0, 5));
        console.log('Sample rating counts:', ratingCounts.slice(0, 5));

        // Verify all ratings are between 0 and 5
        ratings.forEach((rate: number) => {
            expect(rate).toBeGreaterThanOrEqual(0);
            expect(rate).toBeLessThanOrEqual(5);
        });

        // Verify all rating counts are positive numbers
        ratingCounts.forEach((count: number) => {
            expect(count).toBeGreaterThan(0);
        });
    });

    test('JSONPath - Find High-Rated Products', { tag: ['@regression', '@jsonpath'] }, async ({ request }) => {
        const startTime = Date.now();
        const response: APIResponse = await request.get(`${FAKESTORE_API}/products`);
        const responseTime = Date.now() - startTime;

        // Validate response time is less than 1 second
        expect(responseTime).toBeLessThan(1000);
        console.log(`Response time: ${responseTime}ms`);

        const responseBody = await response.json();

        // Get products with rating >= 4.0
        const highRatedProducts = JSONPath({ path: '$[?(@.rating.rate >= 4.0)]', json: responseBody });

        console.log(`High-rated products (>=4.0): ${highRatedProducts.length}`);

        highRatedProducts.forEach((product: { title: string; rating: { rate: number } }) => {
            console.log(`${product.title} - Rating: ${product.rating.rate}`);
            expect(product.rating.rate).toBeGreaterThanOrEqual(4.0);
        });
    });

    test('JSONPath - Validate All Categories', { tag: ['@regression', '@jsonpath'] }, async ({ request }) => {
        const startTime = Date.now();
        const response: APIResponse = await request.get(`${FAKESTORE_API}/products`);
        const responseTime = Date.now() - startTime;

        // Validate response time is less than 1 second
        expect(responseTime).toBeLessThan(1000);
        console.log(`Response time: ${responseTime}ms`);

        const responseBody = await response.json();

        // Get all categories
        const allCategories = JSONPath({ path: '$[*].category', json: responseBody }) as string[];

        // Get unique categories
        const uniqueCategories = [...new Set(allCategories)];

        console.log('Available categories:', uniqueCategories);
        console.log(`Total unique categories: ${uniqueCategories.length}`);

        // Verify categories are not empty
        expect(uniqueCategories.length).toBeGreaterThan(0);
        uniqueCategories.forEach((category: string) => {
            expect(typeof category).toBe('string');
            expect(category.length).toBeGreaterThan(0);
        });
    });

    test('JSONPath - Get Specific Product by ID', { tag: ['@smoke', '@jsonpath'] }, async ({ request }) => {
        const startTime = Date.now();
        const response: APIResponse = await request.get(`${FAKESTORE_API}/products`);
        const responseTime = Date.now() - startTime;

        // Validate response time is less than 1 second
        expect(responseTime).toBeLessThan(1000);
        console.log(`Response time: ${responseTime}ms`);

        const responseBody = await response.json();

        // Get product with ID = 1 using JSONPath
        const product = JSONPath({ path: '$[?(@.id == 1)]', json: responseBody });

        expect(product.length).toBe(1);
        expect(product[0].id).toBe(1);
        expect(product[0].title).toBeTruthy();
        expect(product[0].price).toBeGreaterThan(0);
        expect(product[0].category).toBeTruthy();

        console.log('Product with ID 1:', JSON.stringify(product[0], null, 2));
    });

    test('JSONPath - Complex Query - Expensive Electronics', { tag: ['@regression', '@jsonpath'] }, async ({ request }) => {
        const startTime = Date.now();
        const response: APIResponse = await request.get(`${FAKESTORE_API}/products`);
        const responseTime = Date.now() - startTime;

        // Validate response time is less than 1 second
        expect(responseTime).toBeLessThan(1000);
        console.log(`Response time: ${responseTime}ms`);

        const responseBody = await response.json();

        // Get electronics products priced above $100 with rating >= 3.0
        const expensiveElectronics = JSONPath({
            path: '$[?(@.category == \'electronics\' && @.price > 100 && @.rating.rate >= 3.0)]',
            json: responseBody
        });

        console.log(`Expensive electronics found: ${expensiveElectronics.length}`);

        expensiveElectronics.forEach((product: { title: string; price: number; category: string; rating: { rate: number } }) => {
            console.log(`${product.title} - $${product.price} - Rating: ${product.rating.rate}`);
            expect(product.category).toBe('electronics');
            expect(product.price).toBeGreaterThan(100);
            expect(product.rating.rate).toBeGreaterThanOrEqual(3.0);
        });
    });

    test('JSONPath - Validate Image URLs', { tag: ['@regression', '@jsonpath'] }, async ({ request }) => {
        const startTime = Date.now();
        const response: APIResponse = await request.get(`${FAKESTORE_API}/products`);
        const responseTime = Date.now() - startTime;

        // Validate response time is less than 1 second
        expect(responseTime).toBeLessThan(1000);
        console.log(`Response time: ${responseTime}ms`);

        const responseBody = await response.json();

        // Get all image URLs
        const imageUrls = JSONPath({ path: '$[*].image', json: responseBody });

        console.log(`Total images: ${imageUrls.length}`);
        console.log('Sample image URL:', imageUrls[0]);

        // Verify all image URLs are valid strings starting with http
        imageUrls.forEach((imageUrl: string) => {
            expect(typeof imageUrl).toBe('string');
            expect(imageUrl).toMatch(/^https?:\/\//);
        });
    });

});
