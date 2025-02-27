# Create Cloud Tasks
resource "google_cloud_tasks_queue" "create_queue_task" {
  name     = "${var.env}-create-queue"
  location = var.region
  retry_config {
    max_attempts       = 100
    min_backoff        = "0.1s"
    max_backoff        = "3600s"
    max_doublings      = 16
    max_retry_duration = "0s"
  }
  rate_limits {
    max_dispatches_per_second = 500
    max_concurrent_dispatches = 5000
  }
}
