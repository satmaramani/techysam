#!/usr/bin/env python3
"""
Script to create a favicon.ico from profile-image.jpg
This script will resize the image to 32x32 pixels and convert it to ICO format
"""

from PIL import Image
import os

def create_favicon():
    # Check if profile image exists
    if not os.path.exists('profile-image.jpg'):
        print("Error: profile-image.jpg not found!")
        return False
    
    try:
        # Open the profile image
        with Image.open('profile-image.jpg') as img:
            # Convert to RGB if necessary (ICO format requires RGB)
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Create multiple sizes for favicon (16x16, 32x32, 48x48)
            sizes = [(16, 16), (32, 32), (48, 48)]
            images = []
            
            for size in sizes:
                # Resize image maintaining aspect ratio
                resized = img.resize(size, Image.Resampling.LANCZOS)
                images.append(resized)
            
            # Save as ICO file
            images[0].save('favicon.ico', format='ICO', sizes=[(size[0], size[1]) for size in sizes])
            
            print("✅ Favicon created successfully!")
            print("📁 File: favicon.ico")
            print("📏 Sizes: 16x16, 32x32, 48x48 pixels")
            return True
            
    except Exception as e:
        print(f"❌ Error creating favicon: {e}")
        return False

if __name__ == "__main__":
    print("🎨 Creating favicon from profile-image.jpg...")
    create_favicon()
