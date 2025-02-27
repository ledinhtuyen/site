resource "google_firestore_database" "editor_firestore_database" {
  name                    = "${var.env}-${var.app_name}-db"
  project                 = var.project_id
  location_id             = var.region
  type                    = "FIRESTORE_NATIVE"
  delete_protection_state = "DELETE_PROTECTION_ENABLED"
  deletion_policy         = "DELETE"
}
