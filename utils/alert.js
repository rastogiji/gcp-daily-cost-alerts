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
module.exports = { sendSlackAlert };
