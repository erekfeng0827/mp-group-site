# Sync images from new/ folders to main portfolio directories
# - If a file in new/ matches an expected filename (cover, 01.jpg, etc.), copy to parent
# - If the file is different overwrite, if same skip
# - Remove files in parent that don't have a match in new/

$ErrorActionPreference = 'SilentlyContinue'
$base = "D:\COWORK\1.素材\WEB\mp-group\Minusplus\assets\portfolio"

function Get-ExpectedNames($projectJsImages, $cover) {
    $names = @()
    if ($cover) { $names += Split-Path $cover -Leaf }
    if ($projectJsImages) { foreach ($img in $projectJsImages) { $names += Split-Path $img -Leaf } }
    return $names
}

# Read portfolio-data.js to get the original image lists
$jsPath = "$base\..\..\portfolio-data.js"
$jsContent = Get-Content $jsPath -Raw -Encoding UTF8

# Parse each project block from JS
$projectDirs = Get-ChildItem $base -Directory | Where-Object { $_.Name -ne 'new' -and $_.Name -ne '.github' }
$log = @()

foreach ($projDir in $projectDirs) {
    $slug = $projDir.Name
    $newDir = Join-Path $projDir.FullName "new"
    if (-not (Test-Path $newDir)) { continue }

    # Get all files in new/ folder
    $newFiles = Get-ChildItem $newDir -File
    if (-not $newFiles) { continue }

    # Extract original image names from portfolio-data.js
    # Find block for this slug
    $blockPattern = [regex]::Escape($slug)
    $slugMatch = [regex]::Match($jsContent, "(?s)""slug"": ""$([regex]::Escape($slug).Replace('\','\\'))"".*?\},\s*(?=\{)")

    $originalImages = @()
    $originalCover = ""

    if ($slugMatch.Success) {
        $block = $slugMatch.Value
        # Extract cover
        $coverMatch = [regex]::Match($block, '"cover"\s*:\s*"([^"]+)"')
        if ($coverMatch.Success) { $originalCover = $coverMatch.Groups[1].Value }
        # Extract images array
        $imagesMatch = [regex]::Match($block, '"images"\s*:\s*\[(.*?)\]')
        if ($imagesMatch.Success) {
            $imgs = [regex]::Matches($imagesMatch.Groups[1].Value, '"([^"]+)"')
            foreach ($m in $imgs) { $originalImages += $m.Groups[1].Value }
        }
    }

    $expectedFilenames = Get-ExpectedNames $originalImages $originalCover

    $log += "=== $slug ==="
    $log += "  Expected: $($expectedFilenames -join ', ')"

    # Map new/ files to expected names (by prefix match)
    $newFileMap = @{}
    $matchedInNew = @{}

    foreach ($nf in $newFiles) {
        $nfName = $nf.Name
        # Try to match against expected filenames
        $matched = $false
        # Clean filename: remove timestamp suffixes like "_2K_202608010530.jpeg"
        $cleanName = $nfName -replace '_[^.]*\.(jpg|jpeg|png)$', '.$1'

        foreach ($expName in $expectedFilenames) {
            $expBase = [System.IO.Path]::GetFileNameWithoutExtension($expName)
            $expExt = [System.IO.Path]::GetExtension($expName).ToLower()
            $nfBase = [System.IO.Path]::GetFileNameWithoutExtension($nfName)
            $nfExt = [System.IO.Path]::GetExtension($nfName).ToLower()

            # Match if clean name equals expected name
            if ($cleanName.ToLower() -eq $nfName.ToLower()) {
                $newFileMap[$expName] = $nf
                $matchedInNew[$nf.FullName] = $true
                $matched = $true
                break
            }
            # Match if the start of filename matches expected
            if ($nfName.StartsWith($expBase, [System.StringComparison]::OrdinalIgnoreCase)) {
                if (-not $newFileMap.ContainsKey($expName)) {
                    $newFileMap[$expName] = $nf
                    $matchedInNew[$nf.FullName] = $true
                }
                $matched = $true
                break
            }
        }
        if (-not $matched) {
            $log += "  UNMATCHED in new/: $nfName"
        }
    }

    # Now: copy matched files from new/ to parent if different
    foreach ($kv in $newFileMap.GetEnumerator()) {
        $destName = $kv.Key
        $srcFile = $kv.Value
        $destPath = Join-Path $projDir.FullName $destName

        $fileIsSame = $false
        if (Test-Path $destPath) {
            $srcHash = (Get-FileHash $srcFile.FullName -Algorithm SHA256).Hash
            $dstHash = (Get-FileHash $destPath -Algorithm SHA256).Hash
            $fileIsSame = ($srcHash -eq $dstHash)
        }

        if ($fileIsSame) {
            $log += "  SAME (skip): $destName"
        } else {
            if (Test-Path $destPath) {
                Remove-Item $destPath -Force
                $log += "  REPLACE: $destName (removed old, copying new)"
            } else {
                $log += "  NEW: $destName"
            }
            Copy-Item $srcFile.FullName $destPath
        }
    }

    # Remove files in parent that don't have matches in new/ (except .js .css etc)
    $existingInParent = Get-ChildItem $projDir.FullName -File | Where-Object {
        $_.Extension -match '^\.(jpg|jpeg|png|gif|webp)$' -and $_.Name -ne 'new'
    }
    foreach ($f in $existingInParent) {
        $isExpected = $false
        foreach ($expName in $expectedFilenames) {
            if ($f.Name -eq $expName) { $isExpected = $true; break }
        }
        if (-not $isExpected) {
            # Check if it was matched from new/
            $wasMatched = $false
            foreach ($kv in $newFileMap.GetEnumerator()) {
                if ($kv.Key -eq $f.Name) { $wasMatched = $true; break }
            }
            if (-not $wasMatched) {
                Remove-Item $f.FullName -Force
                $log += "  DELETED (not in new/): $($f.Name)"
            }
        }
    }
}

$log | ForEach-Object { Write-Output $_ }
