# GCP Daily Spike Alerts

Send Slack Notifications when there is a sudden spike in daily costs.

![Alert Image](slack_alert.png?raw=true)

```bash
npm install
```

## Prerequisites

- GCP Account with Billing Enabled
- BigQuery Billing Export Enabled
- Slack WebHook

## Deployment

The Deployment is a 2 step process:

- CI/CD tool to build your container using Secrets from Secret Manager and Deploy it to Cloud Run
- Cloud Scheduler to trigger the service

## License

[MIT](https://github.com/rastogiji/gcp-daily-cost-alerts/blob/master/LICENSE)
