import {Page, Locator} from '@playwright/test';
import { ElementUtil } from '../utils/ElementUtil';
import { ProductsInfoPage } from './ProductsInfoPage';
 
export class ResultsPage {

    private readonly page: Page;
    private readonly eleUtil: ElementUtil; 
    private readonly products: Locator;


    constructor(page: Page) {
        this.page = page; 
        this.eleUtil = new ElementUtil(page); 
        this.products = page.locator('div.product-thumb');
    }

    async getProductsCount (): Promise <number> {
        return await this.products.count();
    }


    async selectProduct (productName: string): Promise<ProductsInfoPage> {
        await this.eleUtil.click(this.page.getByRole('link', { name: `${productName}`}));
        return new ProductsInfoPage(this.page); 

    }
}
