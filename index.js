exports.main = (req,res) => {
    const sendNotifications = async (rows) => {
        const SlackNotify = require("slack-notify");
        const MY_SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/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";
        const slack = SlackNotify(MY_SLACK_WEBHOOK_URL);
        
          await slack.alert({
              text: "The Cost for yesterday is :",
              fields: {
                  "Cost": `${rows[0].total_cost - rows[1].total_cost}`
              }
         });
    }
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

        sendNotifications(rows);
    }
    const newQuery =  `SELECT
    SUM(cost) as total_cost,
    EXTRACT(DAY
    FROM
      usage_start_time) AS day
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
}