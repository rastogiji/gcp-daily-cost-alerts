const createBQJob = async (query) => {
  const { BigQuery } = require("@google-cloud/bigquery");
  const bigquery = new BigQuery();

  const options = {
    configuration: {
      query: {
        query: query,
        useLegacySql: false,
      },
    },
  };

  try {
    const response = await bigquery.createJob(options);
    const job = response[0];
    const [rows] = await job.getQueryResults(job);
    if (rows.length != 0) {
      return rows;
    } else {
      console.log("No Rows returned. Invalid Query");
      return 0;
    }
  } catch (err) {
    console.log(`Error Querying BQ: ${err}`);
    process.exit(1);
  }
};

module.exports = { createBQJob };
