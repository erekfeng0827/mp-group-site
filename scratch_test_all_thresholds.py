import os
import numpy as np
from PIL import Image

repo_dir = r'D:\COWORK\1.素材\WEB\mp-group'
portfolio_dir = os.path.join(repo_dir, "minusplus/assets/portfolio")

# Let's check files in each project directory
for p in sorted(os.listdir(portfolio_dir)):
    p_path = os.path.join(portfolio_dir, p)
    if os.path.isdir(p_path):
        files = os.listdir(p_path)
        # Find raw PNG or fallback JPG
        src_file = None
        if "floorplan_raw.png" in files:
            src_file = "floorplan_raw.png"
        elif "floorplan.jpg" in files:
            src_file = "floorplan.jpg"
        elif "floorplan-a.jpg" in files:
            src_file = "floorplan-a.jpg"
            
        if src_file:
            src_p = os.path.join(p_path, src_file)
            with Image.open(src_p) as img:
                gray = img.convert('L')
                arr = np.array(gray)
                
                # Check threshold 60
                mask = arr < 60
                y_idx, x_idx = np.where(mask)
                if len(x_idx) > 0:
                    bbox = (x_idx.min(), y_idx.min(), x_idx.max(), y_idx.max())
                    print(f"Project {p} ({src_file}) -> Thresh 60 bbox: {bbox} (w: {bbox[2]-bbox[0]}, h: {bbox[3]-bbox[1]}, ratio: {round((bbox[2]-bbox[0])/(bbox[3]-bbox[1]), 2)})")
                else:
                    # Fallback to 120
                    mask = arr < 120
                    y_idx, x_idx = np.where(mask)
                    if len(x_idx) > 0:
                        bbox = (x_idx.min(), y_idx.min(), x_idx.max(), y_idx.max())
                        print(f"Project {p} ({src_file}) -> Fallback Thresh 120 bbox: {bbox} (w: {bbox[2]-bbox[0]}, h: {bbox[3]-bbox[1]})")
                    else:
                        print(f"Project {p} ({src_file}) -> Empty at 120")
