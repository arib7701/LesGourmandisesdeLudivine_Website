const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

//Parameters
const user_name = 'amandineribot01@gmail.com';
const refresh_token = '1/L3s38kqZDTCCjQ_DGNQz07mZ1Vh5m5H62JaVkVFsL0o';
const access_token =
  'ya29.GlsVBtp5q0MFawa6XkylV6LCnZMlyUwkU0o9VdYTBxVCz2ktGzTUJKrCXmqwK_YP0gCdWQInLJ-14Ktojq01Av9j9HjVrZB_F1eCk-xRYWjlrm0AsUfSUc-FTzXI';
const client_id =
  '403711033846-h8ufq2csruunvamf55e04mq8vhorghq9.apps.googleusercontent.com';
const client_secret = 'tg3B1xPtXgBqaNBnZ6BpDE0I';

var auth = {
  type: 'oauth2',
  user: user_name,
  clientId: client_id,
  clientSecret: client_secret,
  refreshToken: refresh_token
};

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: auth
});

// New message pushed to DB table "message" in firebase - Cloud Fct listen using onWrite to any change on table and send email
exports.sendContactMessage = functions.database
  .ref('/messages/{pushKey}')
  .onWrite((change, context) => {
    if (change.before.exists() || !change.after.exists()) {
      //Do nothing if data is edited or deleted
      console.log('Message edited or deleted - skip');
      return;
    }

    const val = change.after.val();

    // to: 'lesgourmandisesdeludivine@yahoo.com',

    // Use Nodemailer options and transporter
    const mailOptions = {
      to: 'amandineribot01@gmail.com',
      from: val.email,
      subject: `Nouveau Message Site 'Les Gourmandises de Ludivine' de ${
        val.email
      }`,
      html: val.html
    };

    transporter
      .sendMail(mailOptions)
      .then(() => console.log('Email sent.'))
      .catch(error =>
        console.error('There was an error while sending the email:', error)
      );
  });
