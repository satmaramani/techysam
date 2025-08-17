#!/bin/bash

# Portfolio Website S3 Deployment Script
# Make sure to update the BUCKET_NAME variable below

# Configuration
BUCKET_NAME="sam-portfolio-site"
REGION="ap-south-1"  # Change this to your preferred region

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Portfolio Website S3 Deployment${NC}"
echo "=================================="

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

# Check if bucket exists
if aws s3 ls "s3://$BUCKET_NAME" 2>&1 > /dev/null; then
    echo -e "${GREEN}✅ Bucket '$BUCKET_NAME' exists${NC}"
else
    echo -e "${YELLOW}📦 Creating bucket '$BUCKET_NAME'...${NC}"
    aws s3 mb "s3://$BUCKET_NAME" --region "$REGION"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Bucket created successfully${NC}"
    else
        echo -e "${RED}❌ Failed to create bucket${NC}"
        exit 1
    fi
fi

echo -e "${YELLOW}🌐 Configuring static website hosting...${NC}"

# Configure static website hosting
aws s3 website "s3://$BUCKET_NAME" --index-document index.html --error-document index.html

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Static website hosting configured${NC}"
else
    echo -e "${RED}❌ Failed to configure static website hosting${NC}"
    exit 1
fi

echo -e "${YELLOW}📤 Uploading website files...${NC}"

# Upload files to S3
aws s3 sync ./ "s3://$BUCKET_NAME" \
    --exclude "*.md" \
    --exclude "deploy.sh" \
    --exclude ".git/*" \
    --exclude ".github/*" \
    --exclude "node_modules/*" \
    --exclude "*.log"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Files uploaded successfully${NC}"
else
    echo -e "${RED}❌ Failed to upload files${NC}"
    exit 1
fi

echo -e "${YELLOW}🔓 Setting file permissions...${NC}"

# Set public read permissions
aws s3 cp "s3://$BUCKET_NAME/" "s3://$BUCKET_NAME/" --recursive --acl public-read

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ File permissions set successfully${NC}"
else
    echo -e "${RED}❌ Failed to set file permissions${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Creating bucket policy...${NC}"

# Create bucket policy
cat > bucket-policy.json << EOF
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
EOF

# Apply bucket policy
aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy file://bucket-policy.json

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Bucket policy applied successfully${NC}"
else
    echo -e "${RED}❌ Failed to apply bucket policy${NC}"
    exit 1
fi

# Clean up temporary files
rm -f bucket-policy.json

echo -e "${YELLOW}🌐 Configuring public access...${NC}"

# Configure public access blocks
aws s3api put-public-access-block \
    --bucket "$BUCKET_NAME" \
    --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Public access configured${NC}"
else
    echo -e "${RED}❌ Failed to configure public access${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo "=================================="
echo -e "${YELLOW}🌐 Your website is now available at:${NC}"
echo -e "${GREEN}http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com${NC}"
echo ""
echo -e "${YELLOW}📱 Next steps:${NC}"
echo "1. Test your website functionality"
echo "2. Consider setting up CloudFront for HTTPS"
echo "3. Configure a custom domain (optional)"
echo "4. Set up monitoring and analytics"
echo ""
echo -e "${GREEN}✨ Happy coding!${NC}"
