import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import static com.kms.katalon.core.testobject.ObjectRepository.findWindowsObject
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import com.kms.katalon.core.cucumber.keyword.CucumberBuiltinKeywords as CucumberKW
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testng.keyword.TestNGBuiltinKeywords as TestNGKW
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.windows.keyword.WindowsBuiltinKeywords as Windows
import internal.GlobalVariable as GlobalVariable
import org.openqa.selenium.Keys as Keys

import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import org.openqa.selenium.Keys
import org.openqa.selenium.JavascriptExecutor
import com.kms.katalon.core.webui.driver.DriverFactory

/**
 * Test Case: TC03_Successful_Code_Submission
 * Description: Test successful code submission with correct solution
 * Expected Result: Status ACCEPTED, all test cases passed
 *
 * FIXED VERSION: Screenshots saved to workspace folder
 */

// Screenshot folder path (ABSOLUTE PATH)
String screenshotPath = 'C:\\Users\\nguye\\Downloads\\NMCNPM-feature-merge_sprint_2\\NMCNPM-feature-merge_sprint_2\\Screenshots\\'

// Open browser and navigate to login page
WebUI.openBrowser('')
WebUI.navigateToUrl('http://localhost:5173/login')
WebUI.maximizeWindow()

// Wait for page to load
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// ===== STEP 1: LOGIN =====
WebUI.comment('Step 1: Logging in...')

// Enter login credentials (using test account created in TC01 or existing account)
WebUI.setText(findTestObject('Login/input_Username'), 'aaa')
WebUI.setText(findTestObject('Login/input_Password'), '123456789')

// Take screenshot before login (ABSOLUTE PATH)
WebUI.takeScreenshot(screenshotPath + 'TC03_Step1_LoginForm.png')
WebUI.comment('Screenshot saved: ' + screenshotPath + 'TC03_Step1_LoginForm.png')

// Click login button
WebUI.click(findTestObject('Login/button_Log In'))

// Wait for login to complete
WebUI.delay(3)

// Verify login successful (check for redirect)
WebUI.waitForPageLoad(10)

// Take screenshot after login (ABSOLUTE PATH)
WebUI.takeScreenshot(screenshotPath + 'TC03_Step2_LoginSuccess.png')
WebUI.comment('Screenshot saved: ' + screenshotPath + 'TC03_Step2_LoginSuccess.png')

// ===== STEP 2: NAVIGATE TO PROBLEM =====
WebUI.comment('Step 2: Navigating to problem...')

// Navigate to a specific problem (e.g., Two Sum)
WebUI.navigateToUrl('http://localhost:5173/interface-code/two-sum')
WebUI.delay(3)

// Wait for code editor to load
WebUI.waitForElementPresent(findTestObject('Code_Editor/editor_Container'), 15)

// Take screenshot of problem page (ABSOLUTE PATH)
WebUI.takeScreenshot(screenshotPath + 'TC03_Step3_ProblemPage.png')
WebUI.comment('Screenshot saved: ' + screenshotPath + 'TC03_Step3_ProblemPage.png')

// ===== STEP 3: SELECT LANGUAGE =====
WebUI.comment('Step 3: Selecting language...')

// Select Python language from dropdown
WebUI.selectOptionByLabel(findTestObject('Code_Editor/select_Language'), 'Python', false)
WebUI.delay(1)
WebUI.comment('Selected language: Python')

// ===== STEP 4: ENTER CORRECT CODE =====
WebUI.comment('Step 4: Entering correct solution...')

// Define correct solution for Two Sum problem (dùng explicit newlines và spaces)
String correctCode = 'def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []'

// GIẢI PHÁP: Dùng JavaScript để set value trực tiếp (tránh vấn đề indent)
JavascriptExecutor js = (JavascriptExecutor) DriverFactory.getWebDriver()

// Tìm textarea bằng class name và set value với React-friendly approach
String jsSetCode = """
var textarea = document.querySelector('.code-input-area');
if (textarea) {
    // Lấy React internal instance để set value đúng cách
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    nativeInputValueSetter.call(textarea, arguments[0]);
    
    // Trigger cả input và change events cho React
    var inputEvent = new Event('input', { bubbles: true });
    var changeEvent = new Event('change', { bubbles: true });
    textarea.dispatchEvent(inputEvent);
    textarea.dispatchEvent(changeEvent);
    
    // Focus vào textarea để đảm bảo React state update
    textarea.focus();
    
    return 'Code set successfully';
} else {
    return 'ERROR: Textarea not found';
}
"""

String jsResult = js.executeScript(jsSetCode, correctCode)
WebUI.comment('JavaScript result: ' + jsResult)

// Verify code was actually set
WebUI.delay(1)
String verifyCode = """
var textarea = document.querySelector('.code-input-area');
return textarea ? textarea.value : 'NOT FOUND';
"""
String currentValue = js.executeScript(verifyCode)
WebUI.comment('Code verification - First 50 chars: ' + currentValue.substring(0, Math.min(50, currentValue.length())))

// Fallback: Nếu JS thất bại hoặc code không match, dùng sendKeys
if (!jsResult.contains('successfully') || !currentValue.contains('def twoSum')) {
    WebUI.comment('JavaScript failed or code not set properly, using sendKeys fallback...')
    WebUI.click(findTestObject('Code_Editor/editor_Container'))
    WebUI.delay(1)
    WebUI.sendKeys(findTestObject('Code_Editor/editor_Container'), Keys.chord(Keys.CONTROL, 'a'))
    WebUI.delay(0.5)
    WebUI.sendKeys(findTestObject('Code_Editor/editor_Container'), Keys.chord(Keys.BACK_SPACE))
    WebUI.sendKeys(findTestObject('Code_Editor/editor_Container'), correctCode)
    WebUI.delay(1)
}

WebUI.delay(1)

// Take screenshot of code entered (ABSOLUTE PATH)
WebUI.takeScreenshot(screenshotPath + 'TC03_Step4_CodeEntered.png')
WebUI.comment('Screenshot saved: ' + screenshotPath + 'TC03_Step4_CodeEntered.png')

// ===== STEP 5: SUBMIT CODE =====
WebUI.comment('Step 5: Submitting code...')

// Click Submit button
WebUI.click(findTestObject('Code_Editor/btn_Submit'))

// Wait for judging process (can take 10-30 seconds)
WebUI.delay(5)
WebUI.comment('Waiting for code execution...')

// ===== STEP 6: VERIFY RESULTS =====
WebUI.comment('Step 6: Verifying results...')

// Wait for navigation to submission result page
WebUI.waitForPageLoad(30)
WebUI.delay(3)

// Verify URL changed to submission-result page
String currentUrl = WebUI.getUrl()
WebUI.comment('Current URL after submit: ' + currentUrl)

if (currentUrl.contains('submission-result')) {
    WebUI.comment('Successfully navigated to submission result page')
} else {
    WebUI.comment('WARNING: Not on submission-result page. URL: ' + currentUrl)
}

// Wait for result container to load
WebUI.waitForElementPresent(findTestObject('Result/Status_Container'), 30)

// Verify ACCEPTED status
WebUI.verifyTextPresent('ACCEPTED', false)

// Take screenshot of result (ABSOLUTE PATH)
WebUI.takeScreenshot(screenshotPath + 'TC03_Step5_AcceptedStatus.png')
WebUI.comment('Screenshot saved: ' + screenshotPath + 'TC03_Step5_AcceptedStatus.png')

// Verify additional elements (if available)
// WebUI.verifyElementPresent(findTestObject('Result/time_Limit_Exceeded'), 5, FailureHandling.OPTIONAL)

// Take final screenshot (ABSOLUTE PATH)
WebUI.takeScreenshot(screenshotPath + 'TC03_Step6_FinalResult.png')
WebUI.comment('Screenshot saved: ' + screenshotPath + 'TC03_Step6_FinalResult.png')

// Close browser
WebUI.closeBrowser()

// Log test completion
WebUI.comment('TC03 - Successful Code Submission: PASSED')
WebUI.comment('Status: ACCEPTED')
WebUI.comment('All screenshots saved to: ' + screenshotPath)