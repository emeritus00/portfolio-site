terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  # State is local by default so a first `terraform apply` needs nothing else.
  # To keep state in S3 (recommended once it's live), create a bucket, then:
  #   cp backend.hcl.example backend.hcl   # fill in the bucket name
  #   uncomment the block below and run: terraform init -backend-config=backend.hcl -migrate-state
  #
  # backend "s3" {}
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project   = var.project_name
      ManagedBy = "terraform"
    }
  }
}

# CloudFront only accepts ACM certificates from us-east-1.
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project   = var.project_name
      ManagedBy = "terraform"
    }
  }
}
