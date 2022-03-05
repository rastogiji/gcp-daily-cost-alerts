exports.main = (req,res) => {

    const AMOUNT_CHANGED = 50;
    // Sending notification to Slack
    const sendNotifications = async (rows) => {
        const SlackNotify = require("slack-notify");
        const MY_SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/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";
        const slack = SlackNotify(MY_SLACK_WEBHOOK_URL);
        const billingURL = "https://console.cloud.google.com/billing/012C8F-6ADB54-4D1C1D/reports;chartType=STACKED_BAR;grouping=GROUP_BY_NONE;credits=SPENDING_BASED_DISCOUNT?authuser=5&organizationId=309775343449&supportedpurview=project";
        const spike = rows[0].total_cost - rows[1].total_cost;
        
          try{
            if(spike >= AMOUNT_CHANGED){
              console.log("Sending Alert");
              await slack.alert({
                "text": `*Billing ID URL*: ${billingURL} \n *High Level Details:*`,
                "fields": {
                    "Previous Cost": `${rows[1].total_cost}`,
                    "New Cost": `${rows[0].total_cost}`,
                    "Spike": `${spike}`
                }
              });
            } else {
              console.log(`Spike is just ${spike}`);
            }
          } catch (e){
            console.log(`Failed to send Slack Alert because: ${e}`);
          }
    }

    // Querying BigQuery billing Dataset
    const createJob = async (newQuery)=> {
        const {BigQuery} = require('@google-cloud/bigquery');
        const bigquery = new BigQuery();

        const options = {
            configuration: {
                query: {
                    query: newQuery,
                    useLegacySql: false,
                }
          }
        };
        const response = await bigquery.createJob(options);
        const job = response[0];
        const [rows] = await job.getQueryResults(job);
        console.log("Query execution complete");

        sendNotifications(rows);
    }
    const newQuery =
    `SELECT
      SUM(cost) as total_cost,
      EXTRACT(DAY FROM usage_start_time) AS day
    FROM
      \`concise-rune-302709.bq_billing_dataset.gcp_billing_export_resource_v1_012C8F_6ADB54_4D1C1D\`
    WHERE
      EXTRACT(DAY FROM usage_start_time) = EXTRACT(DAY FROM CURRENT_TIMESTAMP()) OR
      EXTRACT(DAY FROM usage_start_time) = EXTRACT(DAY FROM CURRENT_TIMESTAMP())-1
    GROUP BY 
      day
    ORDER BY
      day DESC`
    createJob(newQuery);
    res.send("200");
};