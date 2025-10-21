#!/usr/bin/env python3
"""
Image Optimization Script for Sampurna Atmaramani Portfolio
Converts JPG/PNG to WebP with optimal dimensions and quality
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image
    print("✅ PIL/Pillow found")
except ImportError:
    print("❌ Pillow not found. Installing...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image
    print("✅ Pillow installed successfully")

# Image optimization configurations
IMAGE_CONFIGS = {
    'profile-image.jpg': [
        {
            'output': 'profile-image.webp',
            'size': (600, 600),
            'quality': 85,
            'description': 'Hero profile image'
        },
        {
            'output': 'profile-image-small.webp',
            'size': (80, 80),
            'quality': 90,
            'description': 'Navbar profile image'
        }
    ],
    'images/award-1.jpg': {
        'output': 'images/award-1.webp',
        'size': (700, 400),
        'quality': 80,
        'description': 'Award image 1'
    },
    'images/award-2.jpg': {
        'output': 'images/award-2.webp',
        'size': (700, 400),
        'quality': 80,
        'description': 'Award image 2'
    },
    'images/singing-stage.jpg': {
        'output': 'images/singing-stage.webp',
        'size': (700, 400),
        'quality': 80,
        'description': 'Singing stage image'
    },
    'images/flute-performance.jpg': {
        'output': 'images/flute-performance.webp',
        'size': (700, 400),
        'quality': 80,
        'description': 'Flute performance image'
    },
    'images/training-award.jpg': {
        'output': 'images/training-award.webp',
        'size': (700, 400),
        'quality': 80,
        'description': 'Training award image'
    },
    'images/udemy-instructor.jpg': {
        'output': 'images/udemy-instructor.webp',
        'size': (700, 400),
        'quality': 80,
        'description': 'Udemy instructor image'
    }
}

def get_file_size(filepath):
    """Get file size in KB"""
    if os.path.exists(filepath):
        return os.path.getsize(filepath) / 1024
    return 0

def optimize_image(input_path, output_path, target_size, quality, description):
    """
    Optimize a single image:
    - Resize to target dimensions
    - Convert to WebP
    - Compress with specified quality
    """
    try:
        if not os.path.exists(input_path):
            print(f"⚠️  {input_path} not found - skipping")
            return False
        
        # Get original size
        original_size = get_file_size(input_path)
        
        # Open and process image
        print(f"\n📸 Processing: {description}")
        print(f"   Input: {input_path}")
        
        img = Image.open(input_path)
        
        # Convert RGBA to RGB if necessary (for JPG compatibility)
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        
        # Resize image (high-quality resampling)
        print(f"   Original size: {img.size[0]}×{img.size[1]} ({original_size:.1f} KB)")
        img_resized = img.resize(target_size, Image.Resampling.LANCZOS)
        print(f"   Resized to: {target_size[0]}×{target_size[1]}")
        
        # Save as WebP
        img_resized.save(output_path, 'WebP', quality=quality, method=6)
        
        # Get new size
        new_size = get_file_size(output_path)
        savings = ((original_size - new_size) / original_size * 100) if original_size > 0 else 0
        
        print(f"   Output: {output_path}")
        print(f"   New size: {new_size:.1f} KB")
        print(f"   ✅ Saved {savings:.1f}% ({original_size - new_size:.1f} KB)")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def main():
    """Main optimization function"""
    print("=" * 60)
    print("🖼️  IMAGE OPTIMIZATION SCRIPT")
    print("   Sampurna Atmaramani Portfolio")
    print("=" * 60)
    
    total_original = 0
    total_optimized = 0
    success_count = 0
    total_count = 0
    
    # Process each image configuration
    for input_file, config in IMAGE_CONFIGS.items():
        # Handle both single config and list of configs
        configs = config if isinstance(config, list) else [config]
        
        for cfg in configs:
            total_count += 1
            output_file = cfg['output']
            target_size = cfg['size']
            quality = cfg['quality']
            description = cfg['description']
            
            # Get original size before processing
            if os.path.exists(input_file):
                total_original += get_file_size(input_file)
            
            # Optimize the image
            if optimize_image(input_file, output_file, target_size, quality, description):
                success_count += 1
                total_optimized += get_file_size(output_file)
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 OPTIMIZATION SUMMARY")
    print("=" * 60)
    print(f"✅ Processed: {success_count}/{total_count} images")
    print(f"📦 Original total: {total_original:.1f} KB")
    print(f"📦 Optimized total: {total_optimized:.1f} KB")
    
    if total_original > 0:
        savings = ((total_original - total_optimized) / total_original * 100)
        print(f"💾 Total savings: {total_original - total_optimized:.1f} KB ({savings:.1f}%)")
    
    print("\n🎉 DONE! Your images are now optimized!")
    print("=" * 60)
    print("\n📝 Next Steps:")
    print("1. Check the generated .webp files")
    print("2. Tell me 'Images converted!' ")
    print("3. I'll update your HTML with <picture> tags")
    print("4. Deploy and enjoy 90+ Lighthouse scores! 🚀")
    print("\n")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Process interrupted by user")
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()

