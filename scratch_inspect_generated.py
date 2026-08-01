import os
from PIL import Image

repo_dir = r'D:\COWORK\1.素材\WEB\mp-group'
png_path = os.path.join(repo_dir, "minusplus/assets/portfolio/chun-jing-shi-shang-fa/floorplan.png")

if os.path.exists(png_path):
    with Image.open(png_path) as img:
        print("Generated size:", img.size)
else:
    print("Generated file does not exist!")
