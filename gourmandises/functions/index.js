const functions = require('firebase-functions');
environment = 'environment.js';

// ------------------ NODEMAILER FUNCTION ----------------------------
const nodemailer = require('nodemailer');

//Parameters
const user_name = environment.user_name;
const refresh_token = environment.refresh_token;
const access_token = environment.access_token;
const client_id = environment.client_id;
const client_secret = environment.client_secret;

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
      // Do nothing if data is edited or deleted
      console.log('Message edited or deleted - skip');
      return;
    }

    const val = change.after.val();

    // Use Nodemailer options and transporter
    const mailOptions = {
      to: 'lesgourmandisesdeludivine@yahoo.com',
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

// -------------- STRIPE PAYMENT FUNCTION ---------------------------------------

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const stripe = require('stripe')(functions.config().stripe.testkey);

exports.stripeCharge = functions.database
  .ref('/orders/{paymentId}')
  .onWrite((event, context) => {
    const payment = event.after.val();
    // console.log('payment ', payment);
    const paymentId = context.params.paymentId;

    if (!payment || payment.charge) {
      return;
    } else {
      const amount = payment.amount;
      const quantity = payment.quantity;
      const idempotency_key = paymentId; // prevent duplicate charges
      const source = payment.token.id;
      const currency = 'EUR';
      const charge = { amount, currency, source };

      // eslint-disable-next-line consistent-return
      return stripe.charges.create(charge, { idempotency_key }).then(charge => {
        // console.log('Charge', charge);
        return (
          // eslint-disable-next-line promise/no-nesting
          admin
            .database()
            .ref(`/orders/${paymentId}/charge`)
            .set(charge)
            // eslint-disable-next-line promise/always-return
            .then(() => {
              const date = Date();

              // Customer Info
              const name = payment.token.card.name;
              const email = payment.token.email;
              const city = payment.token.card.address_city;
              const address = payment.token.card.address_line1;
              const zipcode = payment.token.card.address_zip;

              // Message
              const row1 = payment.message.row1;
              const row2 = payment.message.row2;
              const row3 = payment.message.row3;

              // Order details
              const quantity = payment.details.quantity;
              const event = payment.details.event;
              const perfum = payment.details.perfum;
              const decoration = payment.details.decoration;
              const paint = payment.details.paint;
              // const form = payment.details.form;
              // const gluten = payment.details.gluten;
              // const lactose = payment.details.lactose;

              /*
                <strong>Forme</strong>: ${form}<br>
                <strong>Autre requête</strong>: 
                <ul>
                  <li>Sans gluten: ${gluten}</li>
                  <li>Sans lactose: ${lactose}</li>
                </ul>
              */

              const html = `
                <div><strong>From</strong>: ${name}</div>
                <div><strong>Email</strong>: <a href="mailto:${email}">${email}</a></div>
                <div><strong>Date</strong>: ${date}</div>
                <div>
                  <h2>Informations du Client:</h2>
                  <p><strong>Adresse</strong>: ${address}<br>
                     <strong>Ville</strong>: ${city}<br>
                     <strong>Code Postal</strong>: ${zipcode}</p>
                </div>
                <div>
                  <h2>Détail de la Commande:</h2>
                  <p><strong>Quantité commandée</strong>: ${quantity}<br>
                     <strong>Occasion</strong>: ${event}<br>
                     <strong>Saveur</strong>: ${perfum}<br>
                     <strong>Décoration</strong>: ${decoration}<br>
                     <strong>A colorier</strong>: ${paint}<br>
                  </p>
                </div>
                <div>
                  <h2>Message des biscuits: </h2>
                  <p><strong>Ligne 1</strong>: ${row1} <br>
                     <strong>Ligne 2</strong>: ${row2} <br>
                     <strong>Ligne 3</strong>: ${row3} </p>
                </div>
              `;

              const mailOptions = {
                to: 'lesgourmandisesdeludivine@yahoo.com',
                from: email,
                subject: `Nouvelle Commande de ${name}`,
                html: html
              };

              // eslint-disable-next-line promise/no-nesting
              return transporter.sendMail(mailOptions).then(() => {
                console.log('Email sent');
                return true;
              });
            })
        );
      });
    }
  });
