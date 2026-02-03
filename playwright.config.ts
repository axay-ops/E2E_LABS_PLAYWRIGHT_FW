import { defineConfig, devices } from '@playwright/test';

//Read environment variables from file. * https://github.com/motdotla/dotenv

//import dotenv from 'dotenv';
import dotenvx from '@dotenvx/dotenvx'
import path from 'path';

const ENV = process.env.ENV || 'qa';
// dotenv.config({ path: path.resolve(import.meta.dirname, `.env.${ENV}`) });   // dotenv.config({ path: path.resolve("", '.env') });
dotenvx.config({ path: path.resolve("", `.env.${ENV}`) }); 

export default defineConfig({
  // globalSetup: "";
  testDir: './tests',
  fullyParallel: true,
 
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  forbidOnly: !!process.env.CI,   //* Fail the build on CI if you accidentally left test.only in the source code. */

  reporter: [
    ['html'],
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
      startServer: true
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
 
  use: {
    trace: 'on-first-retry',     // Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
    screenshot: {
        mode: 'on',
        fullPage: true},
    video: 'on',
    baseURL: process.env.BASE_URL,
    headless: process.env.HEADLESS === 'true',
    },

  metadata: {
    appAdminUsername:  process.env.ADMIN_USER,  // "pwtest@nal.comxx",  //  this metadata will be accessible in test/fixtures via testInfo.project.metadata.appUsername */ 
    appAdminPassword:  process.env.ADMIN_PASSWORD, // test123xx
    appCustomerUsername: process.env.CUSTOMER_USER, // akk@opencart.comxx
    appCustomerPassword: process.env.CUSTOMER_PASSWORD, // akk@123xx
  },

  /* Configure projects for major browsers
  chrome and msedge, chromium - channel and launchoptions works
  Firefox and webkit - browesername  */
  
  projects: [
    {
      name: 'Google Chrome',
      use: {channel: 'chrome',
            viewport: null,
            launchOptions: {
                args: ['--start-maximized'],
                ignoreDefaultArgs: ['--window-size=1280, 720']
              },
           }
    },
    
    // {
    //   name: 'Microsoft Edge',
    //   use: { channel: 'msedge', 
    //     viewport: null,
    //         launchOptions: {
    //             args: ['--start-maximized'],
    //             ignoreDefaultArgs: ['--window-size=1280, 720']
    //           }
    //    }
    // },

    // {
    //   name: 'chromium',
    //   use: { browserName: 'chromium', 
    //     viewport: {width: 1920, height: 1080},
    //         launchOptions: {
    //             args: [],
    //             ignoreDefaultArgs: ['--window-size=1280, 720']
    //           }
    //    }
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
