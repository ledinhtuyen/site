module "genai-community" {
  source         = "../../module/platform"
  env            = var.env
  project_id     = var.project_id
  project_number = var.project_number
  region         = var.region
  app_name       = var.app_name
  domain         = var.domain
  access_group   = var.access_group
  web_app_img    = var.web_app_img
}
