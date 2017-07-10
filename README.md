# react-native-check-app-install

## Installation
```
npm i --save react-native-check-app-install
react-native link
```

## Usage
Check out the example app in the [example](https://github.com/redpandatronicsuk/react-native-check-app-install/tree/master/example) folder.

```javascript
import { AppInstalledChecker, CheckPackageInstallation } from 'react-native-check-app-install';

// To check by app name:
AppInstalledChecker
    .isAppInstalled('whatsapp')
    .then((isInstalled) => {
        // isInstalled is true if the app is installed or false if not
    });

// To check using URL (works on iOS and Android):
AppInstalledChecker
    .checkURLScheme('whatsapp') // omit the :// suffix
    .then((isInstalled) => {
        // isInstalled is true if the app is installed or false if not
    })

// To check using package name (Android only):
AppInstalledChecker
    .isAppInstalledAndroid('com.whatsapp') 
    .then((isInstalled) => {
        // isInstalled is true if the app is installed or false if not
    });
```
You can retrieve the list of supported app names by calling `AppInstalledChecker.getAppList()` or check in [app-list.js](https://github.com/redpandatronicsuk/react-native-check-app-install/blob/master/app-list.js). If your app is not in the list, you will have to find out the URL scheme or package name and use either `isAppInstalledIOS(url)` or `isAppInstalledAndroid(pacakge-name)`.

Android package names can be found on the [Google PlayStore](https://play.google.com/store/search). For example, the URL for the Twitter app is *https://play.google.com/store/apps/details?id=com.twitter.android* the package name is the value of the id query parameter, i.e. **com.twitter.android**.

iOS URL schemes can be found by googling or checking this unofficial registry: [http://handleopenurl.com](http://handleopenurl.com) (site seems down at the moment)