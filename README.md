# GCP Daily Spike Alerts

Send Slack Notifications when there is a sudden spike in daily costs.

![Alert Image](slack_alert.png?raw=true)

## Installation

Use the package manager [npm](https://github.com/npm/cli) to install all the packages in package.json file.

```bash
npm install
```

## Prerequisites

- GCP Account with Billing Enabled
- BigQuery Billing Export Enabled
- Slack WebHook

## Deployment

The Deployment is a 2 step process:

- Cloud Functions to host your code
- Cloud Scheduler as an Enterprise Grade Cron Scheduler. 

## License
[MIT](https://github.com/rastogiji/gcp-daily-cost-alerts/blob/master/LICENSE)