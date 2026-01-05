import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.driver.DriverFactory
import org.openqa.selenium.WebDriver

/**
 * Test Case: TC01_Successful_Registration
 * Description: Test successful user registration with valid data
 * Expected Result: Success message displayed and redirect to login page
 * 
 * FIXED VERSION V2: Screenshots saved to workspace folder
 */

// Screenshot folder path (ABSOLUTE PATH)
String screenshotPath = 'C:\\Users\\nguye\\Downloads\\NMCNPM-feature-merge_sprint_2\\NMCNPM-feature-merge_sprint_2\\Screenshots\\'

// Open browser and navigate to signup page
WebUI.openBrowser('')
WebUI.navigateToUrl('http://localhost:5173/signup')
WebUI.maximizeWindow()

// Wait for page to load
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Generate unique username with timestamp to avoid duplicates
String timestamp = String.valueOf(System.currentTimeMillis())
String uniqueUsername = 'testuser_' + timestamp
String uniqueEmail = 'testuser_' + timestamp + '@example.com'
String password = '12345678'

// Fill registration form
WebUI.setText(findTestObject('SignUp/input_Username'), uniqueUsername)
WebUI.setText(findTestObject('SignUp/input_Email'), uniqueEmail)
WebUI.setText(findTestObject('SignUp/input_Password'), password)

// Take screenshot before submit (ABSOLUTE PATH)
WebUI.takeScreenshot(screenshotPath + 'TC01_Step1_FormFilled.png')
WebUI.comment('Screenshot saved: ' + screenshotPath + 'TC01_Step1_FormFilled.png')

// Click Sign Up button
WebUI.click(findTestObject('SignUp/button_Register'))

// Wait for response
WebUI.delay(3)

// Verify success message (FIXED: Changed from 'null' to 'SignUp/msg_Success')
WebUI.waitForElementPresent(findTestObject('SignUp/msg_Success'), 10)
WebUI.verifyElementPresent(findTestObject('SignUp/msg_Success'), 10)

// Take screenshot of success message (ABSOLUTE PATH)
WebUI.takeScreenshot(screenshotPath + 'TC01_Step2_SuccessMessage.png')
WebUI.comment('Screenshot saved: ' + screenshotPath + 'TC01_Step2_SuccessMessage.png')

// Click "Go to login" button to redirect
WebUI.click(findTestObject('SignUp/button_Go to login'))

// Wait for redirect
WebUI.delay(2)

// Verify redirect to login page (check for login form elements)
WebUI.waitForElementPresent(findTestObject('Login/form_Log In'), 10)
WebUI.verifyElementPresent(findTestObject('Login/form_Log In'), 10)

// Take final screenshot (ABSOLUTE PATH)
WebUI.takeScreenshot(screenshotPath + 'TC01_Step3_RedirectToLogin.png')
WebUI.comment('Screenshot saved: ' + screenshotPath + 'TC01_Step3_RedirectToLogin.png')

// Close browser
WebUI.closeBrowser()

// Log test completion
WebUI.comment('TC01 - Successful Registration: PASSED')
WebUI.comment('Username: ' + uniqueUsername)
WebUI.comment('Email: ' + uniqueEmail)
WebUI.comment('All screenshots saved to: ' + screenshotPath)
