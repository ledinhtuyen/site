variable "project_id" {

}

variable "enable_api_names" {
  description = "List of enable API names"
  type        = list(string)
  default     = [
    "analyticshub.googleapis.com",
    "bigquery.googleapis.com",
    "bigqueryconnection.googleapis.com",
    "bigquerydatapolicy.googleapis.com",
    "bigquerymigration.googleapis.com",
    "bigqueryreservation.googleapis.com",
    "bigquerystorage.googleapis.com",
    "cloudapis.googleapis.com",
    "cloudtrace.googleapis.com",
    "dataform.googleapis.com",
    "dataplex.googleapis.com",
    "datastore.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com",
    "servicemanagement.googleapis.com",
    "serviceusage.googleapis.com",
    "sql-component.googleapis.com",
    "storage-api.googleapis.com",
    "storage-component.googleapis.com",
    "storage.googleapis.com",
    "vpcaccess.googleapis.com",
    "run.googleapis.com",
    "secretmanager.googleapis.com",
    "iap.googleapis.com",
    "cloudtasks.googleapis.com",
    "certificatemanager.googleapis.com",
    "dns.googleapis.com",
    "firestore.googleapis.com",
    "aiplatform.googleapis.com",
    "cloudfunctions.googleapis.com",
    "cloudbuild.googleapis.com",
    "eventarc.googleapis.com"
  ]
}
