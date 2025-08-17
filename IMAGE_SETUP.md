# 📸 Profile Image Setup Guide

This guide will help you add your profile image to the portfolio website.

## 🖼️ Image Requirements

### Recommended Specifications:
- **Size**: 200x200 pixels (minimum 100x100)
- **Format**: JPG, PNG, or WebP
- **File Name**: `profile-image.jpg`
- **Quality**: High quality, professional appearance
- **Background**: Clean, professional background

### Image Guidelines:
- Use a professional headshot or business photo
- Ensure good lighting and clear visibility
- Avoid busy backgrounds or distracting elements
- Maintain consistent aspect ratio (square recommended)
- File size should be under 500KB for optimal loading

## 📁 File Placement

1. **Save your image** as `profile-image.jpg` in the `portfolio-website/` folder
2. **Ensure the file name matches** exactly: `profile-image.jpg`
3. **Place it in the same directory** as `index.html`

## 🔧 Current Setup

The website is already configured to:
- Display your profile image in the hero section
- Automatically fall back to a professional icon if no image is found
- Handle image loading gracefully with fade-in effects
- Optimize image display for different screen sizes

## 🎨 Customization Options

### Change Image File Name:
If you want to use a different filename, update the HTML:

```html
<!-- In index.html, line ~75 -->
<img src="your-image-name.jpg" alt="Sampurna Atmaramani" class="profile-photo">
```

### Use Different Image Format:
Supported formats: JPG, PNG, WebP, GIF

```html
<img src="profile-image.png" alt="Sampurna Atmaramani" class="profile-photo">
```

### Add Multiple Images:
You can add multiple profile images and cycle through them:

```html
<img src="profile-image-1.jpg" alt="Sampurna Atmaramani" class="profile-photo">
<img src="profile-image-2.jpg" alt="Sampurna Atmaramani" class="profile-photo">
```

## 🚀 Deployment Notes

### S3 Bucket:
- Upload `profile-image.jpg` along with other website files
- Ensure the image file has public read permissions
- The image will be automatically served from your S3 bucket

### Other Hosting:
- Upload the image file to your web hosting provider
- Maintain the same file structure and naming
- Verify the image is accessible via direct URL

## 🔍 Testing Your Image

### Local Testing:
1. Open `index.html` in your web browser
2. Verify the image displays correctly
3. Check different screen sizes for responsiveness
4. Test image loading and fallback behavior

### Online Testing:
1. Deploy to your hosting provider
2. Test image loading on different devices
3. Verify image accessibility and performance
4. Check social media previews (Open Graph tags)

## 📱 Responsive Behavior

The profile image automatically:
- Scales appropriately on all devices
- Maintains aspect ratio
- Provides smooth loading transitions
- Falls back gracefully if loading fails

## 🎯 Best Practices

1. **Optimize your image** before uploading
2. **Use descriptive alt text** for accessibility
3. **Test on multiple devices** and browsers
4. **Monitor loading performance** after deployment
5. **Keep backup images** in case of issues

## 🆘 Troubleshooting

### Image Not Displaying:
- Check file name and path
- Verify file permissions
- Check browser console for errors
- Ensure image file is not corrupted

### Poor Image Quality:
- Use higher resolution source image
- Optimize for web (200x200 pixels recommended)
- Check image compression settings
- Verify file format compatibility

### Slow Loading:
- Compress image file size
- Use WebP format if supported
- Consider lazy loading for multiple images
- Optimize server response times

---

**Need Help?** Check the main README.md for deployment assistance or review the browser console for any error messages.
