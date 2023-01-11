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
    const spike = await detectSpike(rows);
    if (spike >= process.env.TOTAL_SPIKE) {
      if (
        process.env.NOTIFICATION_CHANNEL.toLowerCase() === "Slack".toLowerCase()
      ) {
        console.log("Spike: Slack Alert");
        const { sendSlackAlert } = require("./utils/alert");
        await sendSlackAlert(rows, spike);
      } else {
        const { logSpike } = require("./utils/alert");
        logSpike(rows, spike);
      }
    } else {
      console.log(`No Alert. Spike: ₹${spike.toFixed(2)}`);
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
