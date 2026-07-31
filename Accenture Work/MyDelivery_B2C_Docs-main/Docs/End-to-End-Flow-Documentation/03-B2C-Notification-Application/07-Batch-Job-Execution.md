# Batch Job Execution (B2C Notification)

## Purpose
This document describes how batch jobs are executed for the B2C Notification application: scheduling mechanisms, startup scripts, Control-M integration, logging, and operational runbooks for starting/stopping and troubleshooting jobs.

---

## Job Launch Methods
- Shell scripts (`process-alerts.sh`, `process-constatuses.sh`) invoked manually or by scheduler
- Jobs may be launched by Control-M or cron on a dedicated batch server
- For containerized deployments, jobs may be run as scheduled containers or Kubernetes CronJobs


## Control-M Integration
- Control-M job definitions call shell scripts and set environment variables for the job run
- Control-M handles retries, alerts on failure, and downstream dependencies


## Startup Scripts
- Typical script sets environment variables (JAVA_HOME, CLASSPATH, SPRING_CONFIG_LOCATION) and then runs `java -cp ... org.springframework.batch.core.launch.support.CommandLineJobRunner <jobContext> <jobId>`
- Scripts capture stdout/stderr to log files and include timestamps in filenames


## Logs & Monitoring
- Batch logs include step-level start/stop times and row counts
- Use centralized log aggregation (ELK) to index logs for easier troubleshooting
- Monitor job success rates, average duration, and failure counts


## Restart & Recovery
- Use Spring Batch restartability features: mark JobRepository to record last execution and step progress
- For partial failures, rerun jobs with parameters to process only failed records if job supports partitioning


## Operational Runbook (Quick Actions)
- Start job manually: run shell script and monitor log
- If job fails during processing, check stack trace and failed record details in logs
- For DB deadlocks: retry job with increased isolation or after resolving blocking transaction
- For IBIS outages: pause job scheduling and notify integration team


## Metrics to Track
- Jobs run per hour/day
- Average processing time per job
- Alerts generated per run
- Failed alerts and retry counts


## References & Files Scanned
- `process-alerts.sh` and related scripts
- `process-alerts-job.xml` and Spring Batch configs
- Control-M job templates (if present in deployment docs)

---

Next: create `08-Error-Handling-Retry.md` describing failure cases and recovery patterns.