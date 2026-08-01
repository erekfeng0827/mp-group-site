# MP Group 企業集團網站 — 部署上線指南

## 專案概覽

| 項目 | 內容 |
|------|------|
| 網站類型 | 靜態 HTML 多品牌集團站（5 個子站） |
| 檔案總數 | 354 個 |
| 音樂/音效 | 57 個 MP3（需 Git LFS 處理） |
| 圖片 | 259 張 JPG + 26 張 PNG |
| Shell | 36 個 HTML 頁面 + 8 CSS + 9 JS |

## 品牌結構

```
mp-group/
├── index.html          # 集團主頁（品牌集散地）
├── minusplus/           # 加減設計（室內建築設計）
├── soft-structure/      # 軟構造（居家軟裝選品）
├── corey/               # COREY（AI Creator）
├── aether-vibes/        # 以太律動（自然療癒感官）
└── assets/              # CSS/JS 共用資源
```

---

## 最快速免費上線方案（三分鐘）

### 方案一：Netlify Drop（最快，2 分鐘）

**優點**：完全免費、不需註冊也能先試、上線即得 HTTPS 網址

**步驟**：

1. 前往 https://app.netlify.com/drop
2. 將整個 `D:\COWORK\1.素材\WEB\mp-group\` 資料夾 **拖放** 到 Netlify Drop 頁面上
3. 等待約 30 秒，系統會自動回傳一個臨時網址，例如：
   ```
   https://random-name-2024.netlify.app
   ```

**下一步（首次使用）**：

- 在 Netlify 註冊免費帳號（可用 GitHub 或 Email 登入）
- 註冊後可以自訂網域名稱（如 `mp-group.netlify.app`）
- 可設定自訂網域（如需 yourdomain.com）

---

### 方案二：GitHub Pages（免費且有版本控制）

**優點**：永久免費、有版本歷史、可結合 GitHub Actions 自動部署

**步驟**：

```powershell
# 1. 安裝 Git（如未安裝）
# 下載：https://git-scm.com/download/win

# 2. 進入專案目錄
cd "D:\COWORK\1.素材\WEB\mp-group"

# 3. 初始化 Git
git init
git add .
git commit -m "feat: initial commit - corporate group website"

# 4. 在 GitHub 網頁建立新 Repository（名稱如 mp-group-site）

# 5. 連接遠端並推送
git remote add origin https://github.com/你的帳號/mp-group-site.git
git branch -M main
git push -u origin main
```

之後在 GitHub Repository 設定頁面開啟 **Pages**，選擇 `main` 分支，儲存後約 2 分鐘即上線。網址為：
```
https://你的帳號.github.io/mp-group-site/
```

**音樂/音效大檔案處理**：

GitHub 單檔限制 100MB，57 個音效中有些超過此限制。建議：
1. 音樂檔案上傳至其他免費空間（iCloud Drive、Google Drive）
2. 或改用 **Git LFS** 處理大檔案：

```powershell
# 安裝 Git LFS
git lfs install

# 追蹤大檔案類型
git lfs track "*.mp3" "*.MP3" "*.mp4" "*.wav"

git add .gitattributes
git commit -m "chore: add git lfs config"

# 重新一次性加入
git add .
git commit -m "fix: re-add all files with lfs"
```

---

### 方案三：Vercel（速度最快，5 分鐘）

**優點**：全球 CDN、 blazing fast、與 GitHub 整合自動部署

**步驟**：

1. 前往 https://vercel.com/new
2. 選擇 **Import Third-Party Git Repository**，連接你的 GitHub
3. 選擇 `mp-group-site` Repo
4. Vercel 會自動偵測為靜態網站，直接 **Deploy**
5. 完成後會得到：
   ```
   https://mp-group-site.vercel.app
   ```

---

## 專案結構說明

```
D:\COWORK\1.素材\WEB\mp-group\
├── index.html          # 首頁 ─── 品牌導覽、創辦人介紹
├── minusplus/
│   └── index.html      # 加減設計網站
├── soft-structure/
│   └── index.html      # 軟構造網站
├── corey/
│   └── index.html      # COREY 網站
├── aether-vibes/
│   └── index.html      # 以太律動網站
├── assets/
│   ├── group/          # 集團共用 CSS/JS
│   │   ├── hub.css             # 首頁樣式
│   │   ├── group-bar.css       # 導覽列樣式
│   │   └── cart.js             # 購物車功能
│   └── [各品牌自有資源]
└── [音效素材]/
    └── aether-vibes/audio/    # 57 個 .mp3 檔案
```

---

## 上傳前注意事項

### 測試本地預覽

在部署前，確認網站是否能正常打開：

```powershell
# PowerShell 啟動簡單 HTTP 伺服器
cd "D:\COWORK\1.素材\WEB\mp-group"
python -m http.server 8080
# 然後在瀏覽器打開 http://localhost:8080
```

或使用 VS Code Live Server 擴充套件。

### 資源路徑檢查

所有連結使用相對路徑，例如：
- `/assets/group/hub.css`
- `minusplus/index.html`
- `aether-vibes/audio/BGM_01.mp3`

**建議上線前確認**：刪除本地不需上傳的檔案（如 `.exe`），並確認沒有使用 `file://` 絕對路徑。此次網站已補上部署相容檔：
- `.nojekyll`：避免 GitHub Pages 對部分資源做額外處理。
- `404.html`：提供靜態部署環境下的友善導向頁。

---

## 推薦的完整部署流程（一步一步）

### Step 1：本地檢查（現在）

```powershell
cd "D:\COWORK\1.素材\WEB\mp-group"
# 確認檔案都存在
dir
```

### Step 2：GitHub 建立 Repo

1. 登入 https://github.com
2. 點 **+** → **New Repository**
3. 名稱：`mp-group-site`
4. 設為 **Private**（暫時保密測試）
5. 不要勾選 Add README / .gitignore

### Step 3：推送專案

```powershell
cd "D:\COWORK\1.素材\WEB\mp-group"
git init
git add .
git commit -m "feat: initial deploy - MINUS PLUS GROUP corporate site"
git remote add origin https://github.com.tw/你的ID/mp-group-site.git
git branch -M main
git push -u origin main
```

### Step 4：開啟 GitHub Pages

1. 前往 Repository → Settings → Pages
2. Source 選擇 **Deploy from a branch**
3. Branch 選擇 `main` → `/root`
4. 點擊 **Save**
5. 等待 2-3 分鐘即上線

---

## 附：自訂網域名稱

如果您已有網域（例如 `mp-group.com`），可以設定 CNAME 指向 GitHub Pages 或 Netlify：

- **GitHub Pages**：在 DNS 設定加入 `CNAME` 記錄指向 `你的帳號.github.io`
- **Netlify**：在 Domain settings 加入自訂網域，Netlify 會免費幫你申請 SSL

---

## 所需工具清單

| 工具 | 用途 | 是否已有 |
|------|------|----------|
| Git | 版本控制 / 推送 | 大部分電腦已內建 |
| Git LFS | 上傳大檔（音樂） | 需另外安裝 |
| GitHub 帳號 | 免費託管 | 需註冊 |
| 瀏覽器 | 預覽網站 | 有 |
| Python（可選） | 本地 HTTP 伺服器測試 | 大部分電腦已有 |

---

## 常見問題

**Q：音樂檔案太大怎麼辦？**
A：GitHub Pages 免費版單檔限制 100MB，超過的檔案建議上傳至 Google Drive 或 iCloud，然後在網站中用外部連結播放。

**Q：可以修改網站內容嗎？**
A：可以。每次修改 HTML/CSS 後，重新推送 `git push` 即可。GitHub Pages 會自動重新部署。

**Q：上線後可以自訂網址嗎？**
A：Netlify 免費方案支援自訂子網域。要使用自己的域名（如 www.mp-group.com），需在 DNS 設定 CNAME 指向平台，Netlify 免費提供 SSL。

**Q：網站有購物車功能嗎？**
A：有 — `assets/group/cart.js`，但目前的靜態版本僅有前端邏輯，實際結账需結合後端支付（如綠界、Stripe）或表單服務。
