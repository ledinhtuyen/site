resource "google_dns_managed_zone" "googleapis_com" {
  name        = "googleapis-com"
  dns_name    = "googleapis.com."
  description = "googleapis.com."
  visibility  = "private"
  private_visibility_config {
    networks {
      network_url = var.google_vpc_network_self_link
    }
  }
}

resource "google_dns_record_set" "googleapis_com_CNAME" {
  name         = "*.googleapis.com."
  type         = "CNAME"
  ttl          = 300
  managed_zone = google_dns_managed_zone.googleapis_com.name

  rrdatas = ["restricted.googleapis.com."]
}

resource "google_dns_record_set" "googleapis_com_A" {
  name         = "restricted.googleapis.com."
  type         = "A"
  ttl          = 300
  managed_zone = google_dns_managed_zone.googleapis_com.name

  rrdatas = [
    "199.36.153.4",
    "199.36.153.5",
    "199.36.153.6",
    "199.36.153.7"
  ]
}
