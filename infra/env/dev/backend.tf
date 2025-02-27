terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "2.4.2"
    }
  }
  backend "gcs" {
    bucket    = "tfstate-dev-community-bucket"
  }
}
