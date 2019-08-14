// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // Firebase Credentials
  firebaseConfig: {
    apiKey: 'AIzaSyBJtDdfGIudny6c9DFwDEzMm5lCJiQiAxM',
    authDomain: 'lesgourmandisesdeludivine.firebaseapp.com',
    databaseURL: 'https://lesgourmandisesdeludivine.firebaseio.com',
    projectId: 'lesgourmandisesdeludivine',
    storageBucket: 'lesgourmandisesdeludivine.appspot.com',
    messagingSenderId: '403711033846'
  },

  CAPTCHA_SITE_ID: '6Ldf0nAUAAAAAF907BHAHdh82QpoyHycMtoU1q3p',
  stripePublishedKey: 'pk_test_GyHseEHLuCIF1JtFNHoIwyfX'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
