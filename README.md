# Firebase Push Notifications in React

Push notifications are a powerful way to engage users by delivering timely and relevant information directly to their devices.  Firebase provides Firebase Cloud Messaging (FCM) service. It is a cloud-based messaging service that allows us to send notifications to mobile devices and web applications. 

Before you begin, ensure that you have Node.js and npm are installed on your machine.


An FCM implementation includes two main components for sending and receiving:

1. A trusted environment such as Cloud Functions for Firebase or an app server on which to build, target, and send messages.
2. An Apple, Android, or web (JavaScript) client app that receives messages via the corresponding platform-specific transport service.