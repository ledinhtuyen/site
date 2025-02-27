module "enable_apis" {
  source     = "../resources/apis"
  project_id = var.project_id
}

module "network" {
  source     = "../resources/network"
  project_id = var.project_id
  env        = var.env
  region     = var.region
  app_name   = var.app_name
  domain     = var.domain
  depends_on = [module.enable_apis]
}

module "dns_zone" {
  source                       = "../resources/dns_zone"
  google_vpc_network_self_link = module.network.google_vpc_network_self_link
  depends_on                   = [module.enable_apis, module.network]
}

module "database" {
  source         = "../resources/database"
  project_id     = var.project_id
  region         = var.region
  env            = var.env
  app_name       = var.app_name
  depends_on     = [module.enable_apis, module.network]
}

module "serverless" {
  source                         = "../resources/serverless"
  project_id                     = var.project_id
  env                            = var.env
  region                         = var.region
  app_name                       = var.app_name
  google_vpc_access_connector_id = module.network.google_vpc_access_connector_id
  web_service_account_email      = module.iam.web_service_account_email
  web_app_img                    = var.web_app_img
  depends_on                     = [module.enable_apis, module.iam, module.network, module.database]
}

# module "cloud_storage" {
#   source                       = "../resources/cloud_storage"
#   project_id                   = var.project_id
#   region                       = var.region
#   domain                       = var.domain
#   bucket_names                 = var.bucket_names
#   upload_bucket                = var.upload_bucket
#   init_bucket                  = var.init_bucket
#   processed_chunk_file_bucket  = var.processed_chunk_file_bucket
#   audio_processed_chunk_bucket = var.audio_processed_chunk_bucket
#   video_to_audio_bucket        = var.video_to_audio_bucket
# }

# module "pub_sub" {
#   source                       = "../resources/pub_sub"
#   env                          = var.env
#   app_name                     = var.app_name
#   upload_bucket                = var.upload_bucket
#   processed_chunk_file_bucket  = var.processed_chunk_file_bucket
#   audio_processed_chunk_bucket = var.audio_processed_chunk_bucket
# }

module "artifact_repo" {
  source     = "../resources/artifact_repo"
  region     = var.region
  env        = var.env
  app_name   = var.app_name
  depends_on = [module.enable_apis]
}

module "load_balancer" {
  source                        = "../resources/load_balancer"
  region                        = var.region
  app_name                      = var.app_name
  serverless_name               = module.serverless.serverless_name
  google_ssl_certificate_id     = module.network.google_ssl_certificate_id
  google_ssl_policy_name        = module.network.google_ssl_policy_name
  google_lb_ip                  = module.network.google_lb_ip
  google_iap_cloud_armor_policy = module.network.google_iap_cloud_armor_policy
  depends_on                    = [module.enable_apis, module.network, module.serverless]
}

module "iam" {
  source           = "../resources/iam"
  env              = var.env
  project_id       = var.project_id
  project_number   = var.project_number
  region           = var.region
  app_name         = var.app_name
  domain           = var.domain
  iap_access_group = var.access_group
  depends_on       = [module.enable_apis]
}

# module "cloud_tasks" {
#   source = "../resources/cloud_tasks"
#   env    = var.env
#   region = var.region
# }
