# 🚀 S3 Bucket Deployment Guide

This guide will help you deploy your portfolio website to AWS S3 bucket for cost-effective, scalable hosting.

## 📋 Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Basic knowledge of AWS S3 and CloudFront

## 🔧 Step-by-Step Deployment

### 1. Create S3 Bucket

```bash
# Create a new S3 bucket (replace 'your-portfolio-bucket' with your desired name)
aws s3 mb s3://your-portfolio-bucket

# Set bucket to public (for static website hosting)
aws s3api put-public-access-block --bucket your-portfolio-bucket --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

### 2. Configure Static Website Hosting

```bash
# Enable static website hosting
aws s3 website s3://your-portfolio-bucket --index-document index.html --error-document index.html
```

### 3. Create Bucket Policy

Create a file named `bucket-policy.json`:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-portfolio-bucket/*"
        }
    ]
}
```

Apply the policy:

```bash
aws s3api put-bucket-policy --bucket your-portfolio-bucket --policy file://bucket-policy.json
```

### 4. Upload Website Files

```bash
# Upload all files to S3 bucket
aws s3 sync ./ s3://your-portfolio-bucket --exclude "*.md" --exclude "S3_DEPLOYMENT.md"

# Or upload specific files
aws s3 cp index.html s3://your-portfolio-bucket/
aws s3 cp styles.css s3://your-portfolio-bucket/
aws s3 cp script.js s3://your-portfolio-bucket/
aws s3 cp profile-image.jpg s3://your-portfolio-bucket/
```

### 5. Set File Permissions

```bash
# Set proper permissions for all files
aws s3 cp s3://your-portfolio-bucket/ s3://your-portfolio-bucket/ --recursive --acl public-read
```

### 6. Configure CORS (if needed)

Create `cors-config.json`:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

Apply CORS:

```bash
aws s3api put-bucket-cors --bucket your-portfolio-bucket --cors-configuration file://cors-config.json
```

## 🌐 Access Your Website

Your website will be available at:
```
http://your-portfolio-bucket.s3-website-[region].amazonaws.com
```

## 🔒 Optional: Add HTTPS with CloudFront

### 1. Create CloudFront Distribution

1. Go to CloudFront console
2. Create distribution
3. Set origin domain to your S3 bucket
4. Configure viewer protocol policy to "Redirect HTTP to HTTPS"
5. Set default root object to `index.html`

### 2. Configure Error Pages

Set custom error responses:
- **403 Forbidden**: Redirect to `/index.html` with 200 status
- **404 Not Found**: Redirect to `/index.html` with 200 status

## 📱 Mobile Optimization

Ensure your website works well on mobile devices:

```bash
# Test mobile responsiveness
# Use browser dev tools to simulate mobile devices
# Verify touch interactions work properly
```

## 🔍 SEO Optimization

### 1. Update Meta Tags

In `index.html`, update these URLs:
```html
<meta property="og:url" content="https://your-domain.com">
<meta property="og:image" content="https://your-domain.com/profile-image.jpg">
<meta name="twitter:image" content="https://your-domain.com/profile-image.jpg">
```

### 2. Add Sitemap (Optional)

Create `sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://your-domain.com/</loc>
        <lastmod>2024-12-19</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>
```

## 📊 Performance Monitoring

### 1. Enable CloudWatch Metrics

- Monitor S3 request counts
- Track CloudFront performance
- Set up alarms for errors

### 2. Use AWS X-Ray (Optional)

- Trace request paths
- Identify performance bottlenecks
- Monitor user experience

## 🔄 Continuous Deployment

### 1. GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to S3

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Deploy to S3
      run: |
        aws s3 sync ./ s3://your-portfolio-bucket --exclude "*.md" --exclude ".github/*"
        aws s3 cp s3://your-portfolio-bucket/ s3://your-portfolio-bucket/ --recursive --acl public-read
    
    - name: Invalidate CloudFront
      run: |
        aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

### 2. Manual Deployment

```bash
# Create deployment script
cat > deploy.sh << 'EOF'
#!/bin/bash
echo "Deploying to S3..."
aws s3 sync ./ s3://your-portfolio-bucket --exclude "*.md" --exclude "S3_DEPLOYMENT.md"
aws s3 cp s3://your-portfolio-bucket/ s3://your-portfolio-bucket/ --recursive --acl public-read
echo "Deployment complete!"
EOF

chmod +x deploy.sh
./deploy.sh
```

## 🚨 Troubleshooting

### Common Issues:

1. **403 Forbidden**: Check bucket policy and public access settings
2. **404 Not Found**: Verify file paths and index document configuration
3. **CORS Errors**: Ensure CORS configuration is correct
4. **HTTPS Issues**: Check CloudFront SSL certificate configuration

### Debug Commands:

```bash
# Check bucket policy
aws s3api get-bucket-policy --bucket your-portfolio-bucket

# Check website configuration
aws s3api get-bucket-website --bucket your-portfolio-bucket

# List bucket contents
aws s3 ls s3://your-portfolio-bucket --recursive

# Test public access
curl -I http://your-portfolio-bucket.s3-website-[region].amazonaws.com
```

## 💰 Cost Optimization

### S3 Costs:
- Storage: ~$0.023 per GB/month
- Requests: ~$0.0004 per 1,000 GET requests

### CloudFront Costs:
- Data transfer: ~$0.085 per GB
- Requests: ~$0.0075 per 10,000 requests

### Estimated Monthly Cost:
- Low traffic (<1GB): $1-5/month
- Medium traffic (1-10GB): $5-20/month
- High traffic (10GB+): $20+/month

## 🔐 Security Best Practices

1. **Enable AWS CloudTrail** for audit logging
2. **Use IAM Roles** instead of access keys when possible
3. **Enable S3 Access Logging** for monitoring
4. **Regular Security Reviews** of bucket policies
5. **Monitor CloudWatch** for unusual activity

## 📚 Additional Resources

- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [CloudFront Distribution](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-overview.html)
- [S3 Bucket Policies](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-policies.html)
- [AWS CLI S3 Commands](https://docs.aws.amazon.com/cli/latest/reference/s3/)

## 🎯 Next Steps

After successful deployment:

1. **Test all functionality** on the live site
2. **Set up monitoring** and alerts
3. **Configure custom domain** (optional)
4. **Set up analytics** (Google Analytics, etc.)
5. **Implement CI/CD** for automatic deployments
6. **Monitor performance** and optimize as needed

---

**Need Help?** Check the AWS documentation or AWS support for additional assistance with S3 deployment.
