require('chromedriver');
const webdriver = require("selenium-webdriver");
const {By} = require ("selenium-webdriver");
const ltCapabilities = require('../capabilities');

const user = "teacher@gmail.com";
const password = "teacher";
const subject = "Economics"
const description = "HSN-312"
const batch = "CSE-4th year"

describe("CodeZone Testing",async function(){
    // selenium automation testing on cloud used --- lambdatest for this
    // const USERNAME = ltCapabilities.capabilities.user;
    // const KEY =ltCapabilities.capabilities.accessKey;
    // const GRID_HOST = "hub.lambdatest.com/wd/hub";
    // const gridUrl = "https://" + USERNAME + ":" + KEY  + "@" + GRID_HOST;
    // driver = new webdriver.Builder().usingServer(gridUrl).withCapabilities(ltCapabilities.capabilities).build();
    let driver = new webdriver.Builder().forBrowser('chrome').build();
    
    describe("Teacher Login Test",async function(){
        it("Login To CodeZone", async function(){
            await driver.get("http://localhost:3000/");
            driver.manage().setTimeouts( { implicit: 5000 } )
            await driver.findElement(By.id("login-button")).click();
            await driver.findElement(By.id("email")).sendKeys(user);
            await driver.findElement(By.id("password")).sendKeys(password);
            await driver.findElement(By.id("sign-in")).click();
            });
    })
    describe("Teacher Dashboard Test",async function(){
        it("Logout button option", async function(){
            driver.wait(webdriver.until.elementLocated(By.id("logout-button")),5000);
            await driver.findElement(By.id("logout-button"));
            });
        it("Profile Settings option", async function(){
            await driver.findElement(By.id("profile-settings"));
            });
        it("Create class option", async function(){
            await driver.findElement(By.id("create-class"));
            });
        it("Join class option", async function(){
            await driver.findElement(By.id("join-class"));
            });
        it("Join class option", async function(){
            await driver.findElement(By.id("join-class"));
            });
        it("Classes List", async function(){
            await driver.findElement(By.id("class-list"));
            });
        it("Enter any Classroom", async function(){
            if(driver.findElement(By.id("class-card"))){
                await driver.findElement(By.id("class-card")).click();
            }else{
                console.log("No Classroom Find to enter");
            }
            });
    })


    // describe("Create new classroom", async function(){
    //     it("Open create classroom form",async function(){
    //         await driver.findElement(By.id("create-class")).click();
    //         await driver.findElement(By.id("subject")).sendKeys(subject);
    //         await driver.findElement(By.id("batch")).sendKeys(batch);
    //         await driver.findElement(By.id("description")).sendKeys(description);
    //         await driver.findElement(By.id("create-classroom")).click();
    //     })

    //     it("Message Displayed", async function(){
    //         driver.wait(webdriver.until.elementLocated(By.id("message")),5000);
    //         await driver.findElement(By.id("message")).getText();
    //         });
    // })



})
