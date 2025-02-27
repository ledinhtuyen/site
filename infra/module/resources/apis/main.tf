resource "google_project_service" "enable_apis" {
  project            = var.project_id
  for_each           = toset(var.enable_api_names)
  service            = each.value
  disable_on_destroy = false
}
