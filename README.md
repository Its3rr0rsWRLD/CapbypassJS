# capbypassjs

A JavaScript wrapper for the CapBypass API, allowing easy integration into Node.js applications for bypassing CAPTCHA challenges.

## Installation

Install the package via npm:

```bash
npm install capbypassjs
```

## Usage

Import the `CapBypassWrapped` class into your Node.js application and initialize it with your CapBypass API key. You can then use its methods to interact with the CapBypass API.

```javascript
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
```

## API

### `CapBypassWrapped(clientKey, verbal = false)`

Constructor function to create a new instance of the CapBypass API wrapper.

- `clientKey`: Your CapBypass API key.
- `verbal`: Optional. If set to `true`, enables verbose logging. Default is `false`.

### Methods

- `makeRequest(url, method, data = null)`: Makes a request to the CapBypass API.

- `createTask(taskType, websiteUrl, websitePubKey, websiteSubdomain, proxy, blob = null)`: Creates a CAPTCHA solving task.

- `getTaskResult(taskId)`: Retrieves the result of a CAPTCHA solving task.

- `getBalance()`: Retrieves the balance of your CapBypass account.

- `createAndGetTaskResult(taskType, websiteUrl, websitePubKey, websiteSubdomain, proxy, blob = null, delay = 5)`: Convenience method to create a task and retrieve its result.

- `createClassificationTask(taskType, image, question)`: Creates a classification task for FunCaptcha.

- `createAndGetClassificationTaskResult(taskType, image, question, delay = 5)`: Convenience method to create a classification task and retrieve its result.
