variable "env" {}
variable "project_id" {}
variable "project_number" {}
variable "region" {}
variable "domain" {}
variable "app_name" {}
variable "iap_access_group" {}
variable "admin_permissions" {
  description = "Permissions for admin"
  type        = list(string)
  default = [
    "roles/aiplatform.user",
    "roles/run.admin",
    "roles/run.invoker",
    "roles/secretmanager.secretAccessor",
    "roles/iam.serviceAccountTokenCreator", 
    "roles/datastore.owner",
    "roles/iap.admin",
    "roles/iap.httpsResourceAccessor"
  ]
}

variable "web_app_sa_permissions" {
  description = "Service Account permissions for web cloud run"
  type        = list(string)
  default = [
    "roles/aiplatform.user",
    "roles/run.invoker",
    "roles/iam.serviceAccountTokenCreator",
    "roles/datastore.user",
    "roles/storage.admin",
    "roles/secretmanager.admin"
  ]
}

variable "speech_to_text_sa_permissions" {
description = "Service Account permissions for speech to text"
  type        = list(string)
  default     = [
    "roles/run.invoker",
    "roles/eventarc.eventReceiver",
    "roles/bigquery.dataOwner",
    "roles/cloudtasks.admin",
    "roles/iam.serviceAccountUser",
    "roles/datastore.user",
    "roles/storage.admin",
    "roles/pubsub.admin",
    "roles/aiplatform.user",
  ]
}

variable "bigquery_inserter_permissions" {
  description = "Service Account permissions for bigquery inserter"
  type        = list(string)
  default     = [
    "roles/run.builder",
    "roles/run.invoker",
    "roles/eventarc.eventReceiver",
    "roles/bigquery.admin",
    "roles/storage.admin",
    "roles/pubsub.admin",
    "roles/logging.logWriter",
    "roles/artifactregistry.createOnPushWriter"
  ]
}
