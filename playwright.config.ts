import { defineConfig, devices } from '@playwright/test';
import dotenvx from '@dotenvx/dotenvx'
import path from 'path';


const ENV = process.env.ENV || 'qa';
dotenvx.config({ path: path.resolve("", `.env.${ENV}`) });  // Load from .env files based on ENV

export const STORAGE_STATE_PATH = (role: string) => {
       return path.join("", `playwright/.auth/${ENV}-${role}.json`);  //set path for Storage state json files based on env. 
      }

export default defineConfig({
  
  globalTimeout: 5 * 60 * 1000,   // Entire run - 0s (No limit) 
  timeout: 1 * 60 * 1000,         // Single Test run - 30s

  expect: {timeout: 10000},       // Web Assertion timeout (5s)
  
  testDir: './tests',
  fullyParallel: true,
 
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  forbidOnly: !!process.env.CI,     //* Fail the build on CI if you accidentally left test.only in the source code. */

  use: {
    actionTimeout: 10000,           //  Action Timeout     (0s, falls back to timeout)
    navigationTimeout: 15000,       //  Navigation Timeout (0s, falls back to timeout)

    trace: 'retain-on-failure',     // Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
    screenshot: {
        mode: 'on',
        fullPage: true},
    video: 'on',
    baseURL: process.env.BASE_URL!,
    headless: process.env.CI ? true : (process.env.HEADLESS === 'true'),  // headless: !!process.env.CI,  false locally, true in CI
  },

  reporter: [
    ['html', {open: 'never'}],
    ['list'],
    ['playwright-html-reporter', {
      testFolder: 'tests',
      title: 'CMS LABS HTML Report',
      project: 'CMS LABS',
      release: '10.1.6',
      testEnvironment: process.env.ENV || 'QA',
      embedAssets: true,
      embedAttachments: true,
      outputFolder: 'playwright-html-report',
      minifyAssets: true,
      startServer: process.env.CI ? false : true
    }], 
    ['allure-playwright', {
      environmentInfo: {
        ENV: process.env.ENV || 'qa',
        URL: process.env.BASE_URL,
        User: process.env.CUSTOMER_USER,
        Version: 'Build v1.0.4'}, 
        outputFolder: 'allure-results', clean: true
    }]
    ],
 
  metadata: {
    appAdminUsername:  process.env.ADMIN_USER,    //  this metadata will be accessible in test/fixtures/auth via testInfo.project.metadata.appUsername */ 
    appAdminPassword:  process.env.ADMIN_PASSWORD,
    appCustomerUsername: process.env.CUSTOMER_USER, 
    appCustomerPassword: process.env.CUSTOMER_PASSWORD, 
    },

  /* Configure projects for major browsers
          chrome and msedge, chromium - channel and launchoptions works
          Firefox and webkit - browesername  */
  
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/  },
    {
      name: 'Google Chrome',
      use: {channel: 'chrome',
            viewport: null,
            launchOptions: {
                args: ['--start-maximized'],
                ignoreDefaultArgs: ['--window-size=1280, 720']
              },
           },
     dependencies: ['setup']     
    },
    
    // {
    //   name: 'Microsoft Edge',
    //   use: { channel: 'msedge', 
    //     viewport: null,
    //         launchOptions: {
    //             args: ['--start-maximized'],
    //             ignoreDefaultArgs: ['--window-size=1280, 720']
    //           }
    //    },
    //    dependencies: ['setup'] 
    // },

    // {
    //   name: 'chromium',
    //   use: { browserName: 'chromium', 
    //     viewport: {width: 1920, height: 1080},
    //         launchOptions: {
    //             args: [],
    //             ignoreDefaultArgs: ['--window-size=1280, 720']
    //           }
    //    },
    //   dependencies: ['setup'] 
    // },

    // {
    //   name: 'webkit',
    //   use: { browserName : 'webkit', 
    //         viewport: null,
    //         launchOptions: {
    //           args: [],
    //           ignoreDefaultArgs: ['--window-size=1280, 720']
    //         }
    //   },
    //   dependencies: ['setup'] 
    // },


    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },



    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },

    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },

});
