# Grant Pub/sub publisher permission to service agent
resource "google_project_iam_member" "pub_sub_permission" {
  project = var.project_id
  role    = "roles/pubsub.publisher"
  member  = "serviceAccount:service-${var.project_number}@gs-project-accounts.iam.gserviceaccount.com"
}

# Grant Clound Run Invoker permission to service agent
resource "google_project_iam_member" "iap_invoker" {
  project  = var.project_id
  for_each = toset(["roles/run.invoker", "roles/storage.objectUser"])
  role     = each.value
  member   = "serviceAccount:service-${var.project_number}@gcp-sa-iap.iam.gserviceaccount.com"
}

resource "google_project_iam_member" "iap_web_user_binding" {
  project = var.project_id
  role    = "roles/iap.httpsResourceAccessor"

  # member = formatlist("group:%s", var.iap_access_group)
  member = "group:${var.iap_access_group}"

  condition {
    expression  = "request.host == '${var.domain}'"
    title       = "AccessToSpecificDomain"
    description = "Allow access to specific domain only"
  }
}

resource "google_project_iam_member" "admin_roles" {
  project  = var.project_id
  for_each = toset(var.admin_permissions)
  role     = each.value
  # members  = formatlist("group:%s", var.iap_access_group)
  member = "group:${var.iap_access_group}"
}

# Grant Clound Run Invoker permission to access users with invoke permission
resource "google_cloud_run_service_iam_member" "web_cloud_invoker_binding" {
  project  = var.project_id
  location = var.region
  service  = "${var.env}-${var.app_name}-web"
  role     = "roles/run.invoker"
  # members  = formatlist("group:%s", var.iap_access_group)
  member = "group:${var.iap_access_group}"
}

# Create Service Account for web (cloud run) 
resource "google_service_account" "web_app_sa" {
  project      = var.project_id
  account_id   = "${var.env}-${var.app_name}-web-sa"
  display_name = "Web ${var.env} ${var.app_name} Service Account"
}

resource "google_project_iam_member" "web_app_roles" {
  project  = var.project_id
  for_each = toset(var.web_app_sa_permissions)
  role     = each.value
  member   = "serviceAccount:${google_service_account.web_app_sa.email}"
}
