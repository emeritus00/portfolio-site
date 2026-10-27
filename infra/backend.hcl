# Remote state: versioned, encrypted, private S3 bucket with native locking (Terraform >= 1.10).
# The bucket is created outside Terraform (it has to exist before `terraform init`); see README.
bucket       = "strata-portfolio-tfstate-286153084936"
key          = "strata-portfolio/terraform.tfstate"
region       = "ca-central-1"
encrypt      = true
use_lockfile = true
