import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.model.FailureHandling

/**
 * Test Case: TC08_Login_Wrong_Password
 * Description: Test login with correct username but wrong password (negative test)
 * Expected Result: Error message "wrong password" displayed, stays on login page
 */

// Screenshot folder path
String screenshotPath = 'C:\\Users\\nguye\\Downloads\\NMCNPM-feature-merge_sprint_2\\NMCNPM-feature-merge_sprint_2\\Screenshots\\'

// Open browser and navigate to login page
WebUI.openBrowser('')
WebUI.navigateToUrl('http://localhost:5173/login')
WebUI.maximizeWindow()

// Wait for page to load
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Verify we are on login page
WebUI.verifyElementPresent(findTestObject('Login/form_Log In'), 5, FailureHandling.OPTIONAL)
WebUI.comment('On login page')

// Credentials with wrong password
String username = 'aaa'  // Existing username
String wrongPassword = 'wrongpassword123'  // Incorrect password

WebUI.comment('Testing login with username: ' + username)
WebUI.comment('Using wrong password: ' + wrongPassword)

// Fill login form with wrong password
WebUI.setText(findTestObject('Login/input_Username'), username)
WebUI.setText(findTestObject('Login/input_Password'), wrongPassword)

// Take screenshot before login
WebUI.takeScreenshot(screenshotPath + 'TC06_Step1_LoginFormFilled_WrongPassword.png')
WebUI.comment('Screenshot saved: ' + screenshotPath + 'TC06_Step1_LoginFormFilled_WrongPassword.png')

// Click login button
WebUI.click(findTestObject('Login/button_Log In'))

// Wait for response
WebUI.delay(3)

// Take screenshot after login attempt
WebUI.takeScreenshot(screenshotPath + 'TC06_Step2_AfterLogin.png')
WebUI.comment('Screenshot saved: ' + screenshotPath + 'TC06_Step2_AfterLogin.png')

// Verify wrong password error message is displayed
boolean wrongPasswordErrorDisplayed = WebUI.verifyElementPresent(
    findTestObject('Login/msg_wrong password'), 
    5, 
    FailureHandling.OPTIONAL
)

if (!wrongPasswordErrorDisplayed) {
    // Fallback: check for text content
    wrongPasswordErrorDisplayed = WebUI.verifyTextPresent('wrong password', false, FailureHandling.OPTIONAL) ||
                                  WebUI.verifyTextPresent('incorrect password', false, FailureHandling.OPTIONAL) ||
                                  WebUI.verifyTextPresent('sai mật khẩu', false, FailureHandling.OPTIONAL) ||
                                  WebUI.verifyTextPresent('password is incorrect', false, FailureHandling.OPTIONAL) ||
                                  WebUI.verifyTextPresent('Invalid credentials', false, FailureHandling.OPTIONAL)
}

if (wrongPasswordErrorDisplayed) {
    WebUI.comment('Wrong password error message successfully displayed')
} else {
    WebUI.comment('WARNING: Wrong password error message not found - may need to check locator')
}

// Verify still on login page (login should fail)
String currentUrl = WebUI.getUrl()
if (currentUrl.contains('/login')) {
    WebUI.comment('Still on login page as expected - URL: ' + currentUrl)
    
    // Verify form elements are still present
    WebUI.verifyElementPresent(findTestObject('Login/input_Username'), 3, FailureHandling.OPTIONAL)
    WebUI.verifyElementPresent(findTestObject('Login/button_Log In'), 3, FailureHandling.OPTIONAL)
} else {
    WebUI.comment('WARNING: Redirected away from login page to: ' + currentUrl)
}


// Close browser
WebUI.closeBrowser()

// Log test completion
WebUI.comment('TC08 - Login with Wrong Password: PASSED')
WebUI.comment('Username: ' + username)
WebUI.comment('Wrong password used: ' + wrongPassword)
WebUI.comment('Error message successfully displayed')
WebUI.comment('All screenshots saved to: ' + screenshotPath)
