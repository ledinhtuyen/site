# Create vpc network, subnetwork, cloud route/nat, serverless vpc connector
resource "google_compute_network" "vpc_network" {
  name                    = "${var.env}-${var.app_name}-genai-vpc"
  routing_mode            = "GLOBAL"
  auto_create_subnetworks = false // no auto create subnet
}

# subnet
resource "google_compute_subnetwork" "vpc_subnet" {
  name          = "${var.env}-${var.app_name}-serverless-vpc-access-subnet"
  region        = var.region
  network       = google_compute_network.vpc_network.id
  ip_cidr_range = "10.0.1.0/28"
  log_config {
    aggregation_interval = "INTERVAL_5_SEC"
    flow_sampling        = 1
    metadata             = "INCLUDE_ALL_METADATA"
  }
  private_ip_google_access = true
}

# Severless as Cloud Run connect to VPC
resource "google_vpc_access_connector" "serverless_vpc_connector" {
  name   = "${var.app_name}-sls-connector"
  region = var.region
  subnet {
    name = google_compute_subnetwork.vpc_subnet.name
  }
  min_instances = 2
  max_instances = 10
  machine_type  = "e2-micro"
}

resource "google_compute_router" "toazure_route" {
  name                    = "${var.env}-${var.app_name}-toazure-route"
  network                 = google_compute_network.vpc_network.name
  region                  = var.region
}

resource "google_compute_router_nat" "nat" {
  name                               = "${var.env}-${var.app_name}nat-for-azure-access"
  router                             = google_compute_router.toazure_route.name
  region                             = google_compute_router.toazure_route.region
  nat_ip_allocate_option             = "MANUAL_ONLY"
  nat_ips                            = [google_compute_address.toazure_ip.self_link]
  source_subnetwork_ip_ranges_to_nat = "LIST_OF_SUBNETWORKS"
  subnetwork {
    name                             = google_compute_subnetwork.vpc_subnet.id
    source_ip_ranges_to_nat          = ["PRIMARY_IP_RANGE"]
  }
}

# External ip address for accessing Azure
resource "google_compute_address" "toazure_ip" {
  name                    = "${var.env}-${var.app_name}-toazure-ip"
  region                  = var.region
}

# global ip address for Loab balancer 
resource "google_compute_global_address" "lb_ip" {
  name         = "${var.env}-${var.app_name}-lb-ip"
  address_type = "EXTERNAL"
}

# Loab balancer Step 2. Create SSL certification
resource "google_compute_managed_ssl_certificate" "app_cert" {
  name = "${var.env}-${var.app_name}-ssl-cert"
  managed {
    domains = [var.domain]
  }
}

# Loab balancer Step 3. Create SSL policy
resource "google_compute_ssl_policy" "app-ssl-policy" {
  name            = "${var.app_name}-ssl-policy"
  profile         = "MODERN"
  min_tls_version = "TLS_1_2"
}

# Firewall policy
resource "google_compute_network_firewall_policy" "firewall_policy" {
  name        = "${var.app_name}-firewall-policy"
  description = "Firewall_policy"
  project     = var.project_id
}

# Bind firewall to policy
resource "google_compute_network_firewall_policy_association" "firewall-policy-associate" {
  name              = "firewall-policy-associate"
  attachment_target = google_compute_network.vpc_network.id
  firewall_policy   = google_compute_network_firewall_policy.firewall_policy.name
  project           = var.project_id
}

# Firewall rules
resource "google_compute_network_firewall_policy_rule" "azure_egress_firewall_policy_rule" {
  action                  = "allow"
  direction               = "EGRESS"
  disabled                = false
  enable_logging          = true
  firewall_policy         = google_compute_network_firewall_policy.firewall_policy.name
  priority                = 1000
  rule_name               = "allow-egress-our-azure"

  match {
    dest_fqdns = [
      "sandbox-dev-eastus2-aoai.openai.azure.com",
      "prd-jpeast-aoai.openai.azure.com",
      "prd-westus-aoai.openai.azure.com",
      "sandbox-dev-eastus-aoai.openai.azure.com",
      "prd-aiplatform-vector-store.search.windows.net",
      "asia-northeast1-genai-platform-dev.cloudfunctions.net",
      "asia-northeast1-precision-genai.cloudfunctions.net",
      "openaipublic.blob.core.windows.net",
      "ebara.ent.box.com"
    ]
    layer4_configs {
      ip_protocol = "all"
    }

  }
}

resource "google_compute_network_firewall_policy_rule" "deny_egress_firewall_policy_rule" {
  action          = "deny"
  direction       = "EGRESS"
  disabled        = false
  enable_logging  = true
  firewall_policy = google_compute_network_firewall_policy.firewall_policy.name
  priority        = 2000
  rule_name       = "deny-egress-route"

  match {
    dest_ip_ranges = ["0.0.0.0/0"]
    layer4_configs {
      ip_protocol = "all"
    }
  }
}

resource "google_compute_network_firewall_policy_rule" "google_restricted_egress_firewall_policy_rule" {
  action          = "allow"
  direction       = "EGRESS"
  disabled        = false
  enable_logging  = true
  firewall_policy = google_compute_network_firewall_policy.firewall_policy.name
  priority        = 1001
  rule_name       = "allow-egress-google-restricted-route"

  match {
    dest_ip_ranges = ["199.36.153.4/30"]
    layer4_configs {
      ip_protocol = "all"
    }

  }
}

resource "google_compute_network_firewall_policy_rule" "deny_ingress_firewall_policy_rule" {
  action          = "deny"
  direction       = "INGRESS"
  disabled        = false
  enable_logging  = true
  firewall_policy = google_compute_network_firewall_policy.firewall_policy.name
  priority        = 3000
  rule_name       = "deny-ingress-route"

  match {
    src_ip_ranges = ["0.0.0.0/0"]
    layer4_configs {
      ip_protocol = "all"
    }

  }
}

# Cloud Armor Policy
resource "google_compute_security_policy" "iap_cloud_armor_policy_allow" {
  name        = "iap-cloud-armor-policy-allow"
  type        = "CLOUD_ARMOR"
  description = "Firewall rule for web application"


  rule {
    action      = "allow"
    priority    = 1000
    description = "Only allow from Ebara Intra Network"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = [
          "54.150.187.58",
          "210.161.142.70",
          "114.141.125.148",
          "18.182.101.92",
          "208.127.111.169",
          "210.160.41.194",
          "114.141.125.146",
          "114.141.125.147"
        ]
      }
    }
  }


  rule {
    action      = "deny(403)"
    priority    = 2147483647
    description = "deny from all other IPs"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
  }
}
