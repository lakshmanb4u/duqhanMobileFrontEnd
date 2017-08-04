# Duqhan
This is an e-commerce mobile app. It has been created using ionic framework.

## Git clone
Clone the project from https://github.com/lakshmanb4u/duqhan.git using the following command:

    git clone https://github.com/lakshmanb4u/duqhan.git

This will download the whole project except all of the 3rd party files. Specifically except:

- bower components
- node modules
- Cordova platforms and plugins

## After git clone
Since all these files are excluded from git, we need to install all of them. In order to do so, run the following commands in that order:

    npm install
installs all node modules from the package.json

    bower install
install all bower components from the bower.json

    gulp --cordova "prepare"
install all Cordova platforms and plugins from the config.xml


It may get an exception that of not finding files in '/resources', then copy the 'resources' folder and paste it inside 'platforms/android'.


### Platforms and plugins in config.xml
Since `cordova 5.0` all platforms and plugins you install can be added to the `config.xml`.

Release notes:
https://cordova.apache.org/news/2015/04/21/tools-release.html

> Added the ability to manage your plugin and platform dependencies in your project’s `config.xml`. When adding plugins or platforms, use the `--save` flag to add them to `config.xml`. Ex: `cordova platform add android --save`. Existing projects can use `cordova plugin save` and `cordova platform save` commands to save all previously installed plugins and platforms into your project’s `config.xml`. Platforms and plugins will be autorestored when `cordova prepare` is run. This allows developers to easily manage and share their dependenceis among different development enviroments and with their coworkers.
>

Since your projects `.gitignore` will completely ignore the `platforms/` and `plugins/` folders, it's important to make sure your `config.xml` contains all the plugins and platforms required by your project. As explained above this can either be achieved by always using the `--save` options when adding/removing platforms:

```sh
gulp --cordova "platform add ios --save"
gulp --cordova "plugin remove cordova-plugin-camera --save"
```

or by typing the following commands before you commit:

```sh
gulp --cordova "platform save"
gulp --cordova "plugin save"
```

## Generate Keyhash for debug
C:\Program Files\Java\jdk1.8.0_66\bin

keytool -exportcert -alias androiddebugkey -keystore "debug.keystore" | "C:\OpenSSL\bin\openssl" sha1 -binary |"C:\OpenSSL\bin\openssl" base64

## Generate Keyhash for release
keytool -exportcert -alias "duqhan" -keystore "duqhan-release-key.keystore" | "C:\OpenSSL\bin\openssl" sha1 -binary | "C:\OpenSSL\bin\openssl" base64

## Generate Certificate Fingerprint for debug
keytool -exportcert -list -v -alias androiddebugkey -keystore debug.keystore

## Generate Certificate Fingerprint for release
keytool -exportcert -list -v -alias duqhan -keystore duqhan-release-key.keystore

## Release Process

### Build Release APK
```sh
gulp --cordova "build --release android"
```

### Sign Release APK
Go to
C:\Program Files\Java\jdk1.8.0_66\bin
```sh
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore duqhan-release-key.keystore duqhan-release-unsigned.apk duqhan
```


### Align Release APK
Go to
C:\Users\CLB\AppData\Local\Android\sdk\build-tools\23.0.3
```sh
zipalign -v 4 duqhan-release-unsigned.apk duqhan-release-signed-1.0.11.apk
```

### Setup deep linking
gulp --cordova "plugin add ionic-plugin-deeplinks --variable URL_SCHEME=duqhan --variable DEEPLINK_SCHEME=https --variable DEEPLINK_HOST=duqhan.com --save"