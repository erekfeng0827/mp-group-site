import urllib.request
from PIL import Image

url = "https://raw.githubusercontent.com/erekfeng0827/mp-group-site/1de6104f34933a34b4faed4b4a4f6383368336f5/minusplus/assets/portfolio/chun-jing-shi-shang-fa/floorplan.jpg"
dest = r"D:\COWORK\1.素材\WEB\mp-group\scratch_shangfa_original.jpg"

try:
    urllib.request.urlretrieve(url, dest)
    with Image.open(dest) as img:
        print("Original size of chun-jing-shi-shang-fa floorplan.jpg:", img.size)
except Exception as e:
    print("Error:", e)
