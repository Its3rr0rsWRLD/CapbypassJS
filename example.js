const CapBypassWrapped = require('capbypassjs');

// Initialize CapBypass with your API key
const capBypass = new CapBypassWrapped('YOUR_API_KEY');

// Example: Create and get the result of a FunCaptcha task
async function bypassFunCaptcha() {
    const taskType = 'FunCaptchaTaskProxyLess';
    const websiteUrl = 'https://example.com';
    const websitePubKey = 'FUN_CAPTCHA_PUBLIC_KEY';
    const websiteSubdomain = 'api-secure.funcaptcha.com';
    const proxy = 'http://username:password@proxy.example.com:8080';

    const taskResult = await capBypass.createAndGetTaskResult(taskType, websiteUrl, websitePubKey, websiteSubdomain, proxy);
    console.log('Task Result:', taskResult);
}

bypassFunCaptcha();
