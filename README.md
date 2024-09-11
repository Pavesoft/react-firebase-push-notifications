# Firebase Push Notifications in React

Push notifications are a powerful way to engage users by delivering timely and relevant information directly to their devices.  Firebase provides Firebase Cloud Messaging (FCM) service. It is a cloud-based messaging service that allows us to send notifications to mobile devices and web applications. 

![image](https://github.com/user-attachments/assets/539ee26a-a3a5-466b-bdee-458cbf0b670c)

An FCM implementation includes two main components for sending and receiving:

1. A trusted environment such as Cloud Functions for Firebase or an app server on which to build, target, and send messages.
2. An Apple, Android, or web (JavaScript) client app that receives messages via the corresponding platform-specific transport service.

Before you begin, ensure that you have Node.js and npm are installed on your machine.

## Getting Started

 1. Clone this repository
 
    ```bash
    git clone https://github.com/Pavesoft/react-firebase-push-notifications.git
    ```

2. Install Dependencies
 
   ```bash
   npm install
   ```

3. Launch app
 
   ```bash
   npm start
   ```



## Libraries Used

Within this project, we are using the following libraries:

- [Firebase](https://www.npmjs.com/package/firebase): Provides Firebase tools and infrastructure such as Firebase Cloud Messaging.
- [React-hot-toast](https://react-hot-toast.com/): A lightweight package for showing notifications (foreground notifications)


## Firebase project setup

Go to  [https://console.firebase.google.com](https://console.firebase.google.com/) 

Add a new Firebase project and provide a name to it. Enable or disable analytics based on your preference.
![image](https://github.com/user-attachments/assets/061fe930-c48b-4e64-9e2d-d38ef54a3341)

![image](https://github.com/user-attachments/assets/ceacccc6-6f43-49c4-b30a-09b319f1d956)

On the same page sroll down and choose Cloud Messaging

![image](https://github.com/user-attachments/assets/ba276d15-aac5-4f3e-b4a9-23447a2f4c65)

Add a Web App to your firebase project

![image](https://github.com/user-attachments/assets/e922bc84-0cd5-47c5-ade3-ec31e3ba7eb8)

Provide a nickname and register the app. Config will be generated.

![image](https://github.com/user-attachments/assets/5cf24bd8-1947-46d7-896b-ce3f6e20e3e0)

Create a file named firebase.js in src directory. In our case we have created a notifications directory and created firebase.js file in it, but there is no need to a seperate notifications directory.
Copy the code in firebase.js file and click on “Continue to console” button.

![image](https://github.com/user-attachments/assets/65ad5fb6-39c4-4f39-b170-8c93ad4eb334)


## Notification permissions and fetching FCM registration token

Firstly, import Firebase's messaging module into the firebase.js file:

```js
import { getMessaging } from "firebase/messaging";

//...

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging();
```

In order to send Push Notifications to the browser, we need the user’s permission.

We will use the browser’s `Notification API`.

`Notification.requestPermission()` is a method that prompts the user for permission to send notifications.  It returns a promise that resolves with the user's decision, which can be `"granted"`, `"denied"`, or `"default"`.
If the permission is granted, then we can fetch FCM registration token. This token is used to identify the device or user to which notifications can be sent.

Create a function called generateToken in firebase.js file that makes use of Firebase's [`getToken`](https://firebase.google.com/docs/reference/js/messaging_#gettoken) method to fetch FCM registration token. 
If the user denies notification permissions, `getToken` won’t generate a token.

```js
import { getMessaging, getToken } from "firebase/messaging";

//...

export const messaging = getMessaging();

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log(permission);
  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey:
        "REPLACE_WITH_YOUR_VAPID_KEY",
    });
    console.log(token);  //printing FCM registration token in browser console
    // Send this token to your server
  }
};
```

The `getToken` method requires you to pass a *Voluntary Application Server Identification* or *VAPID* key.  You can get it by following these steps:

Click on **Project Settings** for your project from the Firebase console

![image](https://github.com/user-attachments/assets/f41a4d72-7a09-480b-8a00-1e1dca4f6541)

Navigate to the **Cloud Messaging** tab and scroll to the **Web configuration** section. 
Under **Web Push certificates** tab, click on **Generate key pair**.

![image](https://github.com/user-attachments/assets/fc70b459-5e79-4b99-b22b-0d2f9135b985)

![image](https://github.com/user-attachments/assets/6148f637-a431-472d-9f5a-7c4c5b2fc141)

The messaging service requires a firebase-messaging-sw.js file to work fine. Create this file in **public** folder. We have created this.

Import generateToken in App.js file.

```js
import { useEffect } from "react";
import { generateToken, messaging } from "./firebase";

function App() {
  useEffect(() => {
    generateToken();
  }, []);
  return (
    <div>
      Hello
    </div>
  );
}
```

![image](https://github.com/user-attachments/assets/c91394ce-4311-47a2-87e9-97c9b17c3a70)


## Receiving Push Notifications Implementation

Notifications can be of two types: foreground notifications and background notifications.

Every notification must have a title and body, the image is optional.

Now that the initial setup is done, you'll need to configure message listeners. 

Foreground message listeners are called when the page has focus(i.e. when the user is on the browser tab containing our web app), while background message listeners are called when the user is on a different tab or even when the tab containing our app is closed.


### Receiving messages in the foreground

To take care of cases in which the app is active in the foreground, we will be using the `onMessage` event listener from Firebase.

```js
import { useEffect } from "react";
import { generateToken, messaging } from "./firebase";
import { onMessage } from "firebase/messaging";
import toast, { Toaster } from "react-hot-toast";

function App() {
  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log(payload); // payload contains the notification data. 
      toast(payload.notification.body);
    });
  }, []);
  return (
    <div>
      Hello
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            backgroundColor: "orange",
            color: "brown",
          },
        }}
      />
    </div>
  );
}

export default App;
```

### Receiving messages in the background

To handle background messages, you'd need to make use of a **service worker**. A service worker is a script that your browser runs in the background, separate from the web page, enabling features that do not require a web page or user interaction.

You can go ahead to add the following lines of code to your firebase-messaging-sw.js file :

```js
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: `REPLACE_WITH_YOUR_FIREBASE_MESSAGING_API_KEY`,
  authDomain: `REPLACE_WITH_YOUR_FIREBASE_MESSAGING_AUTH_DOMAIN`,
  projectId: `REPLACE_WITH_YOUR_FIREBASE_MESSAGING_PROJECT_ID`,
  storageBucket: `REPLACE_WITH_YOUR_FIREBASE_MESSAGING_STORAGE_BUCKET`,
  messagingSenderId: `REPLACE_WITH_YOUR_FIREBASE_MESSAGING_SENDER_ID`,
  appId: `REPLACE_WITH_YOUR_FIREBASE_MESSAGING_APP_ID`,
  measurementId: `REPLACE_WITH_YOUR_FIREBASE_MESSAGING_MEASUREMENT_ID`,
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

```

`messaging.onBackgroundMessage`  is an event listener that listens for incoming messages when the web application is not in the foreground (in the background or terminated). When a background message is received, it calls the provided callback function, which logs the message payload and displays a notification.


## Let’s Test Our Push Notifications

In Firebase console, go to Messaging and click on “Create your first campaign” button

![image](https://github.com/user-attachments/assets/c24735f7-7122-40fc-9be8-d0dbc9f3e217)

Choose first option and click on “Create” button

![image](https://github.com/user-attachments/assets/98d516ca-dd83-4bb1-838a-3a274fd6dde5)

Enter notification title and text and then click on “Send test message” button

![image](https://github.com/user-attachments/assets/67f2243f-2a1e-4efd-81fc-7e28ccc043a4)

![image](https://github.com/user-attachments/assets/19991d1a-4171-49c0-8cad-d47347535388)

![image](https://github.com/user-attachments/assets/596052a3-8c50-4ff4-acc3-d6036fba6a4a)

Click on “Test” button. The notification message will be sent.

![image](https://github.com/user-attachments/assets/b680eff4-490d-459b-a2bd-8a80e3bfb578)


Here’s how the notification will look when the app is running in the foreground.

![image](https://github.com/user-attachments/assets/bf2db53f-4ff9-4fbb-91c0-675a3b3e125a)


If the browser tab with the application isn't in focus, you should see a default system notification pop-up like this

![image](https://github.com/user-attachments/assets/df1e7821-bc5a-4cb8-9807-d7abb9a20c4e)



## Conclusion

Thanks for reading — I hope you found this piece useful. Happy coding!
