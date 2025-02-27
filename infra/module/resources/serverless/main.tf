# Create Cloud Run for Web UI function
resource "google_cloud_run_v2_service" "web_app" {
  client              = "gcloud"
  client_version      = "497.0.0"
  project             = var.project_id
  location            = var.region
  name                = "${var.env}-${var.app_name}-web"
  ingress             = "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"
  launch_stage        = "BETA"
  deletion_protection = false

  template {
    scaling {
      min_instance_count = 0
      max_instance_count = 100
    }
    containers {
      image = var.web_app_img
      ports {
        container_port = 8080
      }
      resources {
        limits = {
          cpu    = "1"
          memory = "2Gi"
        }
        cpu_idle          = false
        startup_cpu_boost = true
      }
      env {
        name  = "APP_NAME"
        value = var.app_name
      }
    }
    vpc_access {
      connector = var.google_vpc_access_connector_id
      egress    = "ALL_TRAFFIC"
    }

    timeout                          = "3600s"
    service_account                  = var.web_service_account_email
    execution_environment            = "EXECUTION_ENVIRONMENT_GEN2"
    max_instance_request_concurrency = 10
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  lifecycle {
    ignore_changes = [
      launch_stage,
      template[0].containers[0].image
    ]
  }
}
