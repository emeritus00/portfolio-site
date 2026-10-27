# Copy these into GitHub → Settings → Secrets and variables → Actions → Variables.

output "site_url" {
  description = "GitHub variable SITE_URL."
  value       = local.use_domain ? "https://${var.domain_name}" : "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "s3_bucket" {
  description = "GitHub variable S3_BUCKET."
  value       = aws_s3_bucket.site.bucket
}

output "cloudfront_distribution_id" {
  description = "GitHub variable CLOUDFRONT_DISTRIBUTION_ID."
  value       = aws_cloudfront_distribution.site.id
}

output "deploy_role_arn" {
  description = "GitHub variable AWS_ROLE_ARN."
  value       = aws_iam_role.deploy.arn
}

output "aws_region" {
  description = "GitHub variable AWS_REGION."
  value       = var.aws_region
}
