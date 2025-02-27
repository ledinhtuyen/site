### Topic
resource "google_pubsub_topic" "create_queue_topic" {
  name                       = "${var.env}-create-queue"
}

### Trigger
#resource "google_storage_notification" "upload_notify" {
#  bucket                     = var.upload_bucket
#  topic                      = google_pubsub_topic.create_queue_topic.id
#  event_types                = ["OBJECT_FINALIZE"]
#  payload_format             = "JSON_API_V1" 
#}

### Trigger
resource "google_storage_notification" "processed_chunk_file_notify" {
  bucket                     = var.processed_chunk_file_bucket
  topic                      = google_pubsub_topic.create_queue_topic.id
  event_types                = ["OBJECT_FINALIZE"]
  payload_format             = "JSON_API_V1" 
}

### Trigger
resource "google_storage_notification" "audio_processed_chunk_notify" {
  bucket                     = var.audio_processed_chunk_bucket
  topic                      = google_pubsub_topic.create_queue_topic.id
  event_types                = ["OBJECT_FINALIZE"]
  payload_format             = "JSON_API_V1" 
}
