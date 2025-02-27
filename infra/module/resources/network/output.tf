output "google_vpc_network_self_link" {
  value = google_compute_network.vpc_network.self_link
}

output "google_vpc_access_connector_id" {
  value = google_vpc_access_connector.serverless_vpc_connector.id
}

output "google_ssl_certificate_id" {
  value = google_compute_managed_ssl_certificate.app_cert.id
}

output "google_ssl_policy_name" {
  value = google_compute_ssl_policy.app-ssl-policy.name
}

output "google_lb_ip" {
  value = google_compute_global_address.lb_ip.address
}

output "google_iap_cloud_armor_policy" {
  value = google_compute_security_policy.iap_cloud_armor_policy_allow.self_link
}
