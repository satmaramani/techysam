# Portfolio Website S3 Deployment Script (PowerShell)
# Make sure to update the BUCKET_NAME variable below

# Configuration
$BUCKET_NAME = "sam-portfolio-site"
$REGION = "ap-south-1"  # Change this to your preferred region

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"

Write-Host "🚀 Portfolio Website S3 Deployment" -ForegroundColor $Green
Write-Host "==================================" -ForegroundColor $Green

# Check if AWS CLI is installed
try {
    $null = Get-Command aws -ErrorAction Stop
    Write-Host "✅ AWS CLI is installed" -ForegroundColor $Green
} catch {
    Write-Host "❌ AWS CLI is not installed. Please install it first." -ForegroundColor $Red
    exit 1
}

# Check if AWS credentials are configured
try {
    $null = aws sts get-caller-identity 2>$null
    Write-Host "✅ AWS credentials configured" -ForegroundColor $Green
} catch {
    Write-Host "❌ AWS credentials not configured. Please run 'aws configure' first." -ForegroundColor $Red
    exit 1
}

Write-Host "📋 Checking prerequisites..." -ForegroundColor $Yellow

# Check if bucket exists
try {
    $null = aws s3 ls "s3://$BUCKET_NAME" 2>$null
    Write-Host "✅ Bucket '$BUCKET_NAME' exists" -ForegroundColor $Green
} catch {
    Write-Host "📦 Creating bucket '$BUCKET_NAME'..." -ForegroundColor $Yellow
    try {
        aws s3 mb "s3://$BUCKET_NAME" --region "$REGION"
        Write-Host "✅ Bucket created successfully" -ForegroundColor $Green
    } catch {
        Write-Host "❌ Failed to create bucket" -ForegroundColor $Red
        exit 1
    }
}

Write-Host "🌐 Configuring static website hosting..." -ForegroundColor $Yellow

# Configure static website hosting
try {
    aws s3 website "s3://$BUCKET_NAME" --index-document index.html --error-document index.html
    Write-Host "✅ Static website hosting configured" -ForegroundColor $Green
} catch {
    Write-Host "❌ Failed to configure static website hosting" -ForegroundColor $Red
    exit 1
}

Write-Host "📤 Uploading website files..." -ForegroundColor $Yellow

# Upload files to S3
try {
    aws s3 sync ./ "s3://$BUCKET_NAME" `
        --exclude "*.md" `
        --exclude "deploy.ps1" `
        --exclude "deploy.sh" `
        --exclude ".git/*" `
        --exclude ".github/*" `
        --exclude "node_modules/*" `
        --exclude "*.log"
    Write-Host "✅ Files uploaded successfully" -ForegroundColor $Green
} catch {
    Write-Host "❌ Failed to upload files" -ForegroundColor $Red
    exit 1
}

Write-Host "🔓 Setting file permissions..." -ForegroundColor $Yellow

# Set public read permissions
try {
    aws s3 cp "s3://$BUCKET_NAME/" "s3://$BUCKET_NAME/" --recursive --acl public-read
    Write-Host "✅ File permissions set successfully" -ForegroundColor $Green
} catch {
    Write-Host "❌ Failed to set file permissions" -ForegroundColor $Red
    exit 1
}

Write-Host "📋 Creating bucket policy..." -ForegroundColor $Yellow

# Create bucket policy
$bucketPolicy = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
"@

# Save policy to temporary file
$bucketPolicy | Out-File -FilePath "bucket-policy.json" -Encoding UTF8

# Apply bucket policy
try {
    aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy file://bucket-policy.json
    Write-Host "✅ Bucket policy applied successfully" -ForegroundColor $Green
} catch {
    Write-Host "❌ Failed to apply bucket policy" -ForegroundColor $Red
    exit 1
}

# Clean up temporary files
Remove-Item "bucket-policy.json" -ErrorAction SilentlyContinue

Write-Host "🌐 Configuring public access..." -ForegroundColor $Yellow

# Configure public access blocks
try {
    aws s3api put-public-access-block `
        --bucket "$BUCKET_NAME" `
        --public-access-block-configuration `
        "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
    Write-Host "✅ Public access configured" -ForegroundColor $Green
} catch {
    Write-Host "❌ Failed to configure public access" -ForegroundColor $Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Deployment completed successfully!" -ForegroundColor $Green
Write-Host "==================================" -ForegroundColor $Green
Write-Host "🌐 Your website is now available at:" -ForegroundColor $Yellow
Write-Host "http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com" -ForegroundColor $Green
Write-Host ""
Write-Host "📱 Next steps:" -ForegroundColor $Yellow
Write-Host "1. Test your website functionality"
Write-Host "2. Consider setting up CloudFront for HTTPS"
Write-Host "3. Configure a custom domain (optional)"
Write-Host "4. Set up monitoring and analytics"
Write-Host ""
Write-Host "✨ Happy coding!" -ForegroundColor $Green
