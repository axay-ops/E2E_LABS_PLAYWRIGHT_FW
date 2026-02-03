import { Page, Locator } from '@playwright/test'
import {ElementUtil} from '../utils/ElementUtil'; 
import { HomePage } from './HomePage';
import {RegistrationPage} from '../pages/RegistrationPage'

export class LoginPage {

// 1) page locators 
        /* (all are private. classic example of Encapsulation, where locators are private, and used in public methods) */
    private readonly page: Page;
    private readonly eleUtil;
    private readonly emailId: Locator; 
    private readonly password: Locator;
    private readonly loginBtn:  Locator;
    private readonly warningMsg: Locator;

    private readonly registerLink: Locator;


// 2) page class constructor
    constructor (page: Page) {
        this.page = page;
        this.eleUtil = new ElementUtil(page);
        this.emailId = page.getByRole('textbox', { name: 'E-Mail Address'});
        this.password = page.getByRole('textbox', { name: 'Password'});
        this.loginBtn = page.locator("input[type='submit'][value='Login']");
        this.warningMsg = page.locator("div.alert.alert-danger.alert-dismissible");
        this.registerLink = page.getByRole('link', { name: 'Register'}).nth(0);
    }

// 3) Page Methods/Actions

    /**
        * navigate to login page
    */
    async navigateLoginPage(baseURL: string | undefined) {
        await this.page.goto(baseURL+"?route=account/login"); 
    }
    /**
     * Login using Username and password
     * @param email 
     * @param password 
     * @returns page title
     */
    async doLogin(email:string, password: string): Promise<HomePage> {
        await this.eleUtil.fill(this.emailId, email);
        await this.eleUtil.fill(this.password, password, false);
        await this.eleUtil.click(this.loginBtn); 
        //const title = await this.page.title();
        //console.log("Page Title :" +title);
        //return title;
        return new HomePage(this.page);
    }

    /**
     * To get the warning message on invalid credentials
     * @returns Error Message
     */
    async getWarningMsgforInvalidLogin(): Promise<string | null> {
        const errormsg = await this.eleUtil.getText(this.warningMsg); 
        console.log("warning msg : "+errormsg);
        return errormsg;
    }

    async navigatetoRegisterPage() {
        await this.eleUtil.click(this.registerLink);
        return new RegistrationPage (this.page);
    }
}