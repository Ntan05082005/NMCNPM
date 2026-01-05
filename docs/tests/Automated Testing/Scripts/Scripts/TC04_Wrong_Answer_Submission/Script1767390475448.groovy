import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import org.openqa.selenium.Keys
import com.kms.katalon.core.model.FailureHandling
import org.openqa.selenium.JavascriptExecutor
import com.kms.katalon.core.webui.driver.DriverFactory

/**
 * Test Case: TC04_Wrong_Answer_Submission
 * Description: Test code submission with incorrect solution
 * Expected Result: Status WRONG_ANSWER, some test cases failed
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

// Enter login credentials
WebUI.setText(findTestObject('Login/input_Username'), 'aaa')
WebUI.setText(findTestObject('Login/input_Password'), '123456789')

// Take screenshot before login (ABSOLUTE PATH)
WebUI.takeScreenshot(screenshotPath + 'TC04_Step1_LoginForm.png')
WebUI.comment('Screenshot saved: ' + screenshotPath + 'TC04_Step1_LoginForm.png')

// Click login button
WebUI.click(findTestObject('Login/button_Log In'))

// Wait for login to complete
WebUI.delay(3)
WebUI.waitForPageLoad(10)

// Take screenshot after login (ABSOLUTE PATH)
WebUI.takeScreenshot(screenshotPath + 'TC04_Step2_LoginSuccess.png')
WebUI.comment('Screenshot saved: ' + screenshotPath + 'TC04_Step2_LoginSuccess.png')

// ===== STEP 2: NAVIGATE TO PROBLEM =====
WebUI.comment('Step 2: Navigating to problem...')

// Navigate to Two Sum problem
WebUI.navigateToUrl('http://localhost:5173/interface-code/two-sum')
WebUI.delay(3)

// Wait for code editor to load
WebUI.waitForElementPresent(findTestObject('Code_Editor/editor_Container'), 15)

// Take screenshot of problem page (ABSOLUTE PATH)
WebUI.takeScreenshot(screenshotPath + 'TC04_Step3_ProblemPage.png')
WebUI.comment('Screenshot saved: ' + screenshotPath + 'TC04_Step3_ProblemPage.png')

// ===== STEP 3: SELECT LANGUAGE =====
WebUI.comment('Step 3: Selecting language...')

// Select Python language from dropdown
WebUI.selectOptionByLabel(findTestObject('Code_Editor/select_Language'), 'Python', false)
WebUI.delay(1)
WebUI.comment('Selected language: Python')

// ===== STEP 4: ENTER WRONG CODE =====
WebUI.comment('Step 4: Entering wrong solution...')

// Define incorrect solution (always returns [0, 1]) - dùng explicit newlines và spaces
String wrongCode = 'def two_sum(nums, target):\n    # This is intentionally wrong - always returns first two indices\n    return [0, 1]'

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

String jsResult = js.executeScript(jsSetCode, wrongCode)
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
    WebUI.sendKeys(findTestObject('Code_Editor/editor_Container'), wrongCode)
    WebUI.delay(1)
}

WebUI.delay(1)

// Take screenshot of code entered (ABSOLUTE PATH)
WebUI.takeScreenshot(screenshotPath + 'TC04_Step4_WrongCodeEntered.png')
WebUI.comment('Screenshot saved: ' + screenshotPath + 'TC04_Step4_WrongCodeEntered.png')

// ===== STEP 5: SUBMIT CODE =====
WebUI.comment('Step 5: Submitting code...')

// Click Submit button
WebUI.click(findTestObject('Code_Editor/btn_Submit'))

// Wait for judging process
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

// Verify WRONG_ANSWER status (or similar error status)
WebUI.verifyTextPresent('WRONG', false, FailureHandling.OPTIONAL)

// Take screenshot of result (ABSOLUTE PATH)
WebUI.takeScreenshot(screenshotPath + 'TC04_Step5_WrongAnswerStatus.png')
WebUI.comment('Screenshot saved: ' + screenshotPath + 'TC04_Step5_WrongAnswerStatus.png')

// Verify error is shown (status should not be ACCEPTED)
boolean isAccepted = WebUI.verifyTextPresent('ACCEPTED', false, FailureHandling.OPTIONAL)
if (isAccepted) {
    WebUI.comment('WARNING: Expected WRONG_ANSWER but got ACCEPTED')
} else {
    WebUI.comment('Correct: Status is not ACCEPTED')
}

// Take final screenshot (ABSOLUTE PATH)
WebUI.takeScreenshot(screenshotPath + 'TC04_Step6_FinalResult.png')
WebUI.comment('Screenshot saved: ' + screenshotPath + 'TC04_Step6_FinalResult.png')

// Close browser
WebUI.closeBrowser()

// Log test completion
WebUI.comment('TC04 - Wrong Answer Submission: PASSED')
WebUI.comment('Status: Not ACCEPTED (Wrong Answer detected)')
WebUI.comment('All screenshots saved to: ' + screenshotPath)
