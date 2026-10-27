variable "project_name" {
  description = "Prefix for every resource name."
  type        = string
  default     = "strata-portfolio"
}

variable "aws_region" {
  description = "Region for the S3 bucket and budget. CloudFront itself is global."
  type        = string
  default     = "ca-central-1"
}

variable "domain_name" {
  description = "Apex domain (e.g. adewalegbadamosi.com) with a Route 53 hosted zone in this account. Leave empty to use the default *.cloudfront.net URL."
  type        = string
  default     = ""
}

variable "github_repository" {
  description = "GitHub repo allowed to deploy, as owner/name."
  type        = string
  default     = "emeritus00/portfolio"
}

variable "create_github_oidc_provider" {
  description = "Create the GitHub Actions OIDC provider. Set false if your AWS account already has one."
  type        = bool
  default     = true
}

variable "budget_limit_usd" {
  description = "Monthly AWS budget; you get emailed at 80% (actual) and 100% (forecast)."
  type        = number
  default     = 5
}

variable "budget_email" {
  description = "Where budget alerts go."
  type        = string
}

variable "price_class" {
  description = "CloudFront price class. PriceClass_100 = North America + Europe edges (cheapest)."
  type        = string
  default     = "PriceClass_100"
}
