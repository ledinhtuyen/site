# Configure Here
# Create Serverless NEG
resource "google_compute_region_network_endpoint_group" "cloud_run_neg" {
  name                  = "${var.app_name}-cloud-run-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region

  cloud_run {
    service = var.serverless_name
  }
}

# Set Serverless NEG as the backend of HTTPS LB
resource "google_compute_backend_service" "cloud_run_backend" {
  name                  = "${var.app_name}-cloud-run-backend-service"
  protocol              = "HTTPS"
  load_balancing_scheme = "EXTERNAL_MANAGED"

  backend {
    group = google_compute_region_network_endpoint_group.cloud_run_neg.id
  }
  log_config {
    enable      = true
    sample_rate = 1.0
  }
  lifecycle {
    ignore_changes = [iap]
  }
  security_policy = var.google_iap_cloud_armor_policy
}

resource "google_compute_url_map" "web_url_map" {
  name            = "${var.app_name}-url-map"
  default_service = google_compute_backend_service.cloud_run_backend.id
}

resource "google_compute_target_https_proxy" "web_target_https_proxy" {
  name             = "${var.app_name}-target-https-prox"
  url_map          = google_compute_url_map.web_url_map.id
  ssl_certificates = [var.google_ssl_certificate_id]
  ssl_policy       = var.google_ssl_policy_name
}

resource "google_compute_global_forwarding_rule" "web_global_forwarding_rule" {
  name                  = "${var.app_name}-httpcontent-rule"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  target                = google_compute_target_https_proxy.web_target_https_proxy.id
  ip_address            = var.google_lb_ip
  port_range            = "443"
}
