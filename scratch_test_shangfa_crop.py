import os
import numpy as np
from PIL import Image

repo_dir = r'D:\COWORK\1.素材\WEB\mp-group'
src_jpg = r"D:\COWORK\1.素材\WEB\mp-group\scratch_shangfa_original.jpg"

with Image.open(src_jpg) as img:
    gray = img.convert('L')
    arr = np.array(gray)
    
    for thresh in [60, 100, 120, 150, 200, 240]:
        mask = arr < thresh
        y_idx, x_idx = np.where(mask)
        if len(x_idx) > 0:
            bbox = (x_idx.min(), y_idx.min(), x_idx.max(), y_idx.max())
            print(f"Threshold {thresh} -> bbox: {bbox} (width: {bbox[2]-bbox[0]}, height: {bbox[3]-bbox[1]})")
        else:
            print(f"Threshold {thresh} -> empty")
