exports.main = (req,res) => {

    const AMOUNT_CHANGED = 50;
    // Sending notification to Slack
    const sendNotifications = async (rows) => {
        const SlackNotify = require("slack-notify");
        const MY_SLACK_WEBHOOK_URL = "<WebHook URL>";
        const slack = SlackNotify(MY_SLACK_WEBHOOK_URL);
        const billingURL = "<Billing Account URL>";
        const spike = rows[0].total_cost - rows[1].total_cost;
        
          try{
            if(spike >= AMOUNT_CHANGED){
              console.log("Sending Alert");
              await slack.alert({
                "text": `*Billing ID URL*: ${billingURL} \n *High Level Details:*`,
                "fields": {
                    "Previous Cost": `*${rows[1].day.value}*: ₹${rows[1].total_cost}`,
                    "New Cost": `*${rows[0].day.value}*: ₹${rows[0].total_cost}`,
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
      EXTRACT(DATE FROM usage_start_time) AS day
    FROM
      \`<Table_Name>\`
    WHERE
      EXTRACT(DATE FROM usage_start_time) = EXTRACT(DATE FROM CURRENT_TIMESTAMP()) OR
      EXTRACT(DATE FROM usage_start_time) = EXTRACT(DATE FROM CURRENT_TIMESTAMP())-1
    GROUP BY 
      2
    ORDER BY
      2 DESC`
    createJob(newQuery);
    res.send("200");
};
