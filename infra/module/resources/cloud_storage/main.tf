# Add cors setting for upload bucket
resource "google_storage_bucket" "upload_bucket" {
  project           = var.project_id
  location          = var.region
  name              = var.upload_bucket
  force_destroy     = false

  cors {
    origin          = ["https://${var.domain}"]
    method          = ["PUT"]
    response_header = ["Content-Type","x-goog-resumable"]  
    max_age_seconds = 3600
  }
}

resource "google_storage_bucket" "init_bucket" {
  project           = var.project_id
  location          = var.region
  name              = var.init_bucket
  force_destroy     = false
}

# Init cloud run function with hello world
resource "google_storage_bucket_object" "init" {
  name   = "archive.zip"
  bucket = var.init_bucket
  source = "../../module/resources/cloud_storage/archive.zip"
}

resource "google_storage_bucket" "processed_chunk_file_bucket" {
  project           = var.project_id
  location          = var.region
  name              = var.processed_chunk_file_bucket
  force_destroy     = false
}

resource "google_storage_bucket" "audio_processed_chunk_bucket" {
  project           = var.project_id
  location          = var.region
  name              = var.audio_processed_chunk_bucket
  force_destroy     = false
}

resource "google_storage_bucket" "video_to_audio_bucket" {
  project           = var.project_id
  location          = var.region
  name              = var.video_to_audio_bucket
  force_destroy     = false
}
