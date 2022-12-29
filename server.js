// Importing Packages and Utilities
const express = require("express");
require("dotenv").config();
const { createBQJob } = require("./utils/BQJobs");
const { detectSpike } = require("./utils/spike");
const { total_cost_query } = require("./utils/queries");

//Server Config
const port = process.env.PORT;
const app = express();
app.use(express.json());

//Routes
app.get("/", async (req, res) => {
  try {
    const rows = await createBQJob(total_cost_query);
    const returnVal = await detectSpike(rows);
    if (returnVal) {
      if (
        process.env.NOTIFICATION_CHANNEL.toLowerCase() === "Slack".toLowerCase()
      ) {
        console.log("Spike: Slack Alert");
        const { sendSlackAlert } = require("./utils/alert");
        await sendSlackAlert(rows, returnVal);
      } else {
        const { logSpike } = require("./utils/alert");
        logSpike(rows, returnVal);
      }
    } else {
      console.log("No Spike");
    }
    res.status(200).send("Successful");
  } catch (err) {
    res.status(500).send(err);
  }
});
//Server Startup
app.listen(port, (err) => {
  if (err) {
    console.log(`Error Starting server: ${err}`);
  } else {
    console.log(`Server Running on ${port}`);
  }
});
