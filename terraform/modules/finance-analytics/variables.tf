# Variables for Finance Analytics Terraform Module

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "production"], var.environment)
    error_message = "Environment must be one of: dev, staging, production."
  }
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "tags" {
  description = "A map of tags to add to all resources"
  type        = map(string)
  default     = {}
}

# ============ NETWORKING ============
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "private_subnets" {
  description = "A list of private subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "public_subnets" {
  description = "A list of public subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
}

# ============ EKS CLUSTER ============
variable "kubernetes_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.28"
}

variable "instance_types" {
  description = "List of instance types for the EKS node group"
  type        = list(string)
  default     = ["t3.medium"]
}

variable "min_capacity" {
  description = "Minimum number of nodes in the EKS node group"
  type        = number
  default     = 1
}

variable "max_capacity" {
  description = "Maximum number of nodes in the EKS node group"
  type        = number
  default     = 10
}

variable "desired_capacity" {
  description = "Desired number of nodes in the EKS node group"
  type        = number
  default     = 3
}

variable "key_pair_name" {
  description = "Name of the EC2 Key Pair for SSH access to worker nodes"
  type        = string
  default     = null
}

# ============ RDS DATABASE ============
variable "db_instance_class" {
  description = "The instance type of the RDS instance"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "The allocated storage in gigabytes"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "The upper limit to which Amazon RDS can automatically scale the storage"
  type        = number
  default     = 100
}

variable "db_name" {
  description = "The name of the database"
  type        = string
  default     = "finance_analytics"
}

variable "db_username" {
  description = "Username for the master DB user"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "Password for the master DB user"
  type        = string
  sensitive   = true
}

variable "backup_retention_period" {
  description = "The days to retain backups for"
  type        = number
  default     = 7
}

variable "multi_az" {
  description = "Specifies if the RDS instance is multi-AZ"
  type        = bool
  default     = false
}

# ============ ELASTICACHE REDIS ============
variable "cache_node_type" {
  description = "The compute and memory capacity of the nodes"
  type        = string
  default     = "cache.t3.micro"
}

variable "num_cache_clusters" {
  description = "Number of cache clusters (primary and replicas) this replication group will have"
  type        = number
  default     = 1
}

variable "redis_auth_token" {
  description = "The password used to access a password protected server"
  type        = string
  sensitive   = true
  default     = null
}

# ============ ELASTICSEARCH ============
variable "elasticsearch_instance_type" {
  description = "Instance type for Elasticsearch cluster"
  type        = string
  default     = "t3.small.elasticsearch"
}

variable "elasticsearch_instance_count" {
  description = "Number of instances in the Elasticsearch cluster"
  type        = number
  default     = 1
}

# ============ CLOUDFRONT & CDN ============
variable "enable_cloudfront" {
  description = "Whether to create CloudFront distribution"
  type        = bool
  default     = true
}

# ============ SECURITY ============
variable "enable_waf" {
  description = "Whether to enable AWS WAF"
  type        = bool
  default     = false
}

variable "enable_shield" {
  description = "Whether to enable AWS Shield Advanced"
  type        = bool
  default     = false
}

# ============ MONITORING ============
variable "enable_detailed_monitoring" {
  description = "Whether to enable detailed monitoring"
  type        = bool
  default     = false
}

variable "enable_cloudtrail" {
  description = "Whether to enable CloudTrail"
  type        = bool
  default     = false
}

# ============ BACKUP & DISASTER RECOVERY ============
variable "enable_cross_region_backup" {
  description = "Whether to enable cross-region backup"
  type        = bool
  default     = false
}

variable "backup_region" {
  description = "AWS region for cross-region backups"
  type        = string
  default     = "us-west-2"
}

# ============ COST OPTIMIZATION ============
variable "enable_spot_instances" {
  description = "Whether to use spot instances for non-critical workloads"
  type        = bool
  default     = false
}

variable "spot_instance_types" {
  description = "List of instance types for spot instances"
  type        = list(string)
  default     = ["t3.medium", "t3.large", "m5.large"]
}

# ============ COMPLIANCE ============
variable "enable_encryption" {
  description = "Whether to enable encryption at rest for all services"
  type        = bool
  default     = true
}

variable "enable_audit_logging" {
  description = "Whether to enable audit logging"
  type        = bool
  default     = false
}

variable "compliance_mode" {
  description = "Compliance mode (none, hipaa, pci, sox)"
  type        = string
  default     = "none"
  validation {
    condition     = contains(["none", "hipaa", "pci", "sox"], var.compliance_mode)
    error_message = "Compliance mode must be one of: none, hipaa, pci, sox."
  }
}

# ============ FEATURE FLAGS ============
variable "enable_ml_pipeline" {
  description = "Whether to enable ML pipeline infrastructure"
  type        = bool
  default     = false
}

variable "enable_data_lake" {
  description = "Whether to enable data lake infrastructure"
  type        = bool
  default     = true
}

variable "enable_real_time_analytics" {
  description = "Whether to enable real-time analytics infrastructure"
  type        = bool
  default     = false
}

# ============ SCALING ============
variable "auto_scaling_enabled" {
  description = "Whether to enable auto scaling"
  type        = bool
  default     = true
}

variable "scale_up_threshold" {
  description = "CPU utilization threshold for scaling up"
  type        = number
  default     = 70
}

variable "scale_down_threshold" {
  description = "CPU utilization threshold for scaling down"
  type        = number
  default     = 30
}

# ============ NETWORKING ADVANCED ============
variable "enable_private_endpoints" {
  description = "Whether to enable VPC endpoints for AWS services"
  type        = bool
  default     = false
}

variable "enable_transit_gateway" {
  description = "Whether to enable Transit Gateway for multi-VPC connectivity"
  type        = bool
  default     = false
}

# ============ DISASTER RECOVERY ============
variable "rto_minutes" {
  description = "Recovery Time Objective in minutes"
  type        = number
  default     = 60
}

variable "rpo_minutes" {
  description = "Recovery Point Objective in minutes"
  type        = number
  default     = 15
}

variable "enable_multi_region" {
  description = "Whether to enable multi-region deployment"
  type        = bool
  default     = false
}

# ============ DEVELOPMENT ============
variable "enable_debug_mode" {
  description = "Whether to enable debug mode (only for dev environment)"
  type        = bool
  default     = false
}

variable "enable_test_data" {
  description = "Whether to create test data (only for dev/staging)"
  type        = bool
  default     = false
}

# ============ INTEGRATION ============
variable "external_integrations" {
  description = "List of external integrations to enable"
  type        = list(string)
  default     = []
  validation {
    condition = alltrue([
      for integration in var.external_integrations :
      contains(["plaid", "stripe", "sendgrid", "twilio", "slack"], integration)
    ])
    error_message = "External integrations must be from: plaid, stripe, sendgrid, twilio, slack."
  }
}

# ============ CUSTOM DOMAINS ============
variable "domain_name" {
  description = "Custom domain name for the application"
  type        = string
  default     = null
}

variable "certificate_arn" {
  description = "ARN of the SSL certificate for custom domain"
  type        = string
  default     = null
}

# ============ RESOURCE LIMITS ============
variable "max_pods_per_node" {
  description = "Maximum number of pods per node"
  type        = number
  default     = 110
}

variable "max_nodes_per_az" {
  description = "Maximum number of nodes per availability zone"
  type        = number
  default     = 10
}

# ============ MAINTENANCE ============
variable "maintenance_window" {
  description = "Preferred maintenance window"
  type        = string
  default     = "sun:04:00-sun:05:00"
}

variable "backup_window" {
  description = "Preferred backup window"
  type        = string
  default     = "03:00-04:00"
}

# ============ ALERTING ============
variable "alert_email" {
  description = "Email address for alerts"
  type        = string
  default     = null
}

variable "slack_webhook_url" {
  description = "Slack webhook URL for notifications"
  type        = string
  default     = null
  sensitive   = true
}

# ============ PERFORMANCE ============
variable "enable_performance_insights" {
  description = "Whether to enable Performance Insights for RDS"
  type        = bool
  default     = false
}

variable "performance_insights_retention_period" {
  description = "Performance Insights retention period in days"
  type        = number
  default     = 7
}

# ============ LOGGING ============
variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 14
}

variable "enable_vpc_flow_logs" {
  description = "Whether to enable VPC Flow Logs"
  type        = bool
  default     = true
}