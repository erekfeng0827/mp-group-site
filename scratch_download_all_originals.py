import urllib.request
import os

repo_dir = r'D:\COWORK\1.素材\WEB\mp-group'
portfolio_dir = os.path.join(repo_dir, "minusplus/assets/portfolio")

projects = [
    "chun-jing-shi-shang-fa",
    "shi-shang-di-bao",
    "chun-fu-tian-yu",
    "xin-min-quan",
    "mei-shu-bai-tian-e",
    "zun-yi-pu-zhen",
    "zhong-yi-zhen-suo",
    "du-hui-zhan",
    "yu-zhi-yuan"
]

base_url = "https://raw.githubusercontent.com/erekfeng0827/mp-group-site/1de6104f34933a34b4faed4b4a4f6383368336f5/minusplus/assets/portfolio"

for p in projects:
    url = f"{base_url}/{p}/floorplan.jpg"
    dest = os.path.join(portfolio_dir, p, "floorplan.jpg")
    try:
        urllib.request.urlretrieve(url, dest)
        print(f"Restored floorplan.jpg for {p}")
    except Exception as e:
        print(f"Failed to restore for {p}: {e}")
