import { Page, Locator } from '@playwright/test'
import { ElementUtil } from '../utils/ElementUtil'
import { LoginPage } from './LoginPage';
import { ResultsPage } from './ResultsPage'

export class HomePage {

    private readonly page: Page;
    private readonly eleUtil: ElementUtil; 

    private readonly listItemOnRightPanel: Locator;
    private readonly logoutlink: Locator; 
    private readonly searchInput: Locator;
    private readonly searchIcon: Locator;
    private readonly logInLink: Locator;
    private readonly accountLoggedLabel: Locator;


    constructor(page: Page) {
        this.page = page; 
        this.eleUtil = new ElementUtil(page); 
        this.listItemOnRightPanel = page.locator('.list-group-item');
        this.logoutlink =  page.locator("//a[@class='list-group-item'][contains(text(), 'Logout')]");
        this.searchInput = page.locator("//input[@name='search'][@type='text']");
        this.searchIcon = page.locator("#search > span.input-group-btn > button.btn");  // 
        this.logInLink =  page.locator("//a[@class='list-group-item'][contains(text(), 'Login')]");
        this.accountLoggedLabel = page.getByRole('heading', { name: 'Account Logout'});
    }

    async getTitle(): Promise<string|null> {
        const title = await this.page.title();
        console.log("Page Title :" +title);
        return title;
    }

    async isUserLoggedIn(): Promise<boolean> {
        return await this.eleUtil.isVisible(this.logoutlink)
    }

    async logout(): Promise <LoginPage> {
        await this.eleUtil.click(this.logoutlink, {timeout: 5000});
        await this.eleUtil.click(this.logInLink); 
        return new LoginPage(this.page); 
    }

    async doSearch(seachKey: string): Promise<ResultsPage> {
        console.log("search key:  "+ seachKey)
        await this.eleUtil.fill(this.searchInput, seachKey); 
        await this.eleUtil.click(this.searchIcon);
        return await new ResultsPage(this.page); 
    }
}
