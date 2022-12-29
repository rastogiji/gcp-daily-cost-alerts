const sendSlackAlert = async (rows, spike) => {
  const slackWebhookURL = process.env.SLACK_WEBHOOK_URL;
  const billingURL = process.env.BILLING_URL;

  const SlackNotify = require("slack-notify");
  const slack = SlackNotify(slackWebhookURL);

  try {
    await slack.alert({
      text: `*Billing ID URL*: ${billingURL} \n *High Level Details:*`,
      fields: {
        "Previous Cost": `*${rows[1].day.value}*: ₹${rows[1].cost.toFixed(2)}`,
        "New Cost": `*${rows[0].day.value}*: ₹${rows[0].cost.toFixed(2)}`,
        Spike: `${spike.toFixed(2)}`,
      },
    });
  } catch (err) {
    return err;
  }
};

const logSpike = async (rows, spike) => {
  const logObject = {
    [rows[1].day.value]: `₹${rows[1].cost.toFixed(2)}`,
    [rows[0].day.value]: `₹${rows[0].cost.toFixed(2)}`,
    spike: `₹${spike.toFixed(2)}`,
  };
  console.log(JSON.stringify(logObject));
};

// const sendEmailAlert = async (rows, spike) => {
//   const nodemailer = require("nodemailer");
//   const { google } = require("googleapis");

//   const OAuth2 = google.auth.OAuth2;
//   const OAuth2_client = new OAuth2(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET
//   );
//   OAuth2_client.setCredentials({
//     refresh_token: process.env.REFRESH_TOKEN,
//   });

//   const accessToken = OAuth2_client.getAccessToken();
//   const transport = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       type: "OAuth2",
//       user: process.env.APP_EMAIL,
//       clientId: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       refreshToken: process.env.REFRESH_TOKEN,
//       accessToken: accessToken,
//     },
//   });

//   const mailConfig = {
//     from: `Alert Email <${process.env.APP_EMAIL}`,
//     to: process.env.NOTIFICATION_EMAIL,
//     subject: `Alert: Spike in Billing`,
//     html: `<p>
//     <strong>Billing URL: </strong>${process.env.BILLING_URL}
//     </p>

//     <h3>High Level Details</h3>
//     <p>
//         <strong>Previous Cost(${
//           rows[1].day.value
//         }): </strong>₹${rows[1].cost.toFixed(2)}
//     </p>
//     <p>
//         <strong>New Cost(${
//           rows[0].day.value
//         }): </strong>₹${rows[0].cost.toFixed(2)}
//     </p>
//     <p>
//         <strong>Spike: </strong>₹${spike.toFixed(2)}
//     </p>`,
//   };

//   try {
//     await transport.sendMail(mailConfig);
//   } catch (err) {
//     return err;
//   }
// };
module.exports = { sendSlackAlert, logSpike };
