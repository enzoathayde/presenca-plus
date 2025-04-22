module.exports = {
  "expo": {
    "name": "mobile",
    "slug": "mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "plugins": [
      "expo-router"
    ],
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "package": "com.presencaplus.android",
      "googleServicesFile": "google-services.json",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": {

    },
    
    "extra": {
      "eas": {
        "projectId": "a9a41010-05c1-4f6b-9fa2-784b42a028b8"
      }
    },
  }
}
