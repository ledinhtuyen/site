# Image repository 
resource "google_artifact_registry_repository" "image_repo" {
  provider        = google
  location        = var.region
  repository_id   = "${var.env}-${var.app_name}-image-repo"
  format          = "DOCKER"
  description     = "Docker image repo for ${var.env} web-app"
}
