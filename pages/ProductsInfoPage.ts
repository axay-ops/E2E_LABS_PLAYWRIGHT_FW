import {Page, Locator} from '@playwright/test'
import { ElementUtil } from '../utils/ElementUtil'


export class ProductsInfoPage {

    private readonly page: Page;
    private readonly eleUtil: ElementUtil;
    private readonly header:  Locator;
    private readonly imageCount: Locator;
    private readonly productMetadata: Locator;
    private readonly productPricedata: Locator;


    private readonly productMap = new Map <string, string | null | number>();


    constructor (page: Page){

        this.page = page;
        this.eleUtil = new ElementUtil(page);
        this.imageCount = page.locator("div#content img");
        this.header = page.locator("h1");
        this.productMetadata = page.locator("(//div[@id='content']//ul[@class='list-unstyled'])[1]/li");
        this.productPricedata = page.locator("(//div[@id='content']//ul[@class='list-unstyled'])[2]/li");
    }

    async getTitle (): Promise<string> {
       const title = await this.page.title();
       return title;
    }

    async getProductHeading ():  Promise<string>  {
        const header = await this.eleUtil.getInnerText(this.header);
        return header.trim();
    }

    async getProductImageCount ():  Promise<number>  {
        await this.eleUtil.waitForElementVisible(this.imageCount);
        const imagecount = await this.imageCount.count();
        console.log(`No of images for ${await this.getProductHeading()} is ${imagecount}`);
        return imagecount;
      }


    async getProductMetaData () {
         let myproductMetaData = await this.productMetadata.allInnerTexts();
         for (let meta of myproductMetaData) {
            let metadata: string[] = meta.split(':');
            let metakey = metadata[0]?.trim() ?? "no data"; // ?? nullish coalescing 
            let metavalue = metadata[1]?.trim() ?? "no data"; // ?? nullish coalescing 
            this.productMap.set(metakey, metavalue); 
         }
      }

    async getProductPriceData () {
         let myproductPriceData = await this.productPricedata.allInnerTexts();  
            let productPrice = myproductPriceData[0]?.trim() ?? "no data";  // ?? nullish coalescing 
            let productExTaxPrice = myproductPriceData[1]?.split(':')[1]?.trim()  ?? "no data";   // ?? nullish coalescing 
            this.productMap.set("PriceIncTax", productPrice);
            this.productMap.set("PriceExTax", productExTaxPrice); 
         
      }

    async getFullProductDetails (): Promise<Map<string, string | null | number>>  {
            this.productMap.set ("title", await this.getTitle())
            this.productMap.set ("header", await this.getProductHeading());
            this.productMap.set ("imageCount", await this.getProductImageCount());
            await this.getProductMetaData();
            await this.getProductPriceData();

            console.log(`Full Product details for the product: ${await this.getProductHeading()}`);
            await this.printProductDetails();
            return this.productMap;

    }  

    async printProductDetails () {
        //note:  For.. Of loop
        for (const [key, value] of this.productMap) {
            console.log (key, value);
        }

        // Note: FOREACH Loop --  Value comes BEFORE Key in the callback
            //this.productMap.forEach((value, key) => {console.log(`**** ${key}: ${value}`)});

    }
}
