let webPush = require('web-push');

const vapidKeys = {
   "publicKey": "BAp0sZEfsEzQTfA_qAKgl4LBQRLersibB6YbFCEq4VaxMGWb0Imy3iMCeaXu8sS1Z8hGpqw47TB-X2fcQKDvH8w",
   "privateKey": "hSXm8rc9Kxqz4G0QfuwnAeaRsgbYaOcUqTImDwc7Dhk"
};


webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
let pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/el4FsrCvUHU:APA91bF_CI5_BrNMaRrBlfi9ngkl1wpNM8HizSgUkY9MNRwMwkJBvs4BZW1w7QDL2TMCu4IEyzH42e3V_wij18Uasa1WOv72sl0hkZIxWMA9JrjWGdoiVJMHOQXVjKsLny0Eu1_-uYgl",
   "keys": {
       "p256dh":"BG562rTq6OiaDVG86+dGsWg+4e69H8nnEoQdFJ+cagwBvFruHsbyhWnTryY0dP+u5RoOVxrzcxwzyKOhGuC99vY=",
       "auth": "OOzDpRh8uvZeXQl0B4tmhA=="
   }
};
let payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

let options = {
   gcmAPIKey: '759607415770',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);
