$ErrorActionPreference = "Stop"
$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$refs = Join-Path $base "refs"
$log = Join-Path $base "generation-log.txt"
$manifest = @()

$products = @(
  @{ slug = "01-half-zip-hoodie"; label = "half-zip drop-shoulder essentials hoodie" },
  @{ slug = "02-tracksuit-set"; label = "graphic hoodie and sweatpants tracksuit set" },
  @{ slug = "03-homug-tactical-cargo"; label = "HOMUG tactical multi-pocket cargo work pants" },
  @{ slug = "04-vortex-stacked-denim"; label = "Vortex camo stacked ripped denim jeans" },
  @{ slug = "05-kzz-colorblock-set"; label = "KZZ colorblock zip-up hoodie and joggers set" }
)

$shots = @(
  @{
    kind = "studio"
    aspect = "1:1"
    suffix = "Professional e-commerce product photo on seamless light gray studio backdrop, soft shadow, catalog style. Match the exact PRODUCT from the reference with same colors, print, silhouette, pockets, and details. Product only, no model, no text, no watermark, sharp focus."
  },
  @{
    kind = "lifestyle"
    aspect = "4:5"
    suffix = "Mens streetwear lifestyle photo, urban golden-hour light, TikTok Shop fit-check energy. Match the exact PRODUCT from the reference with same colors, print, silhouette, and details. Styled flatlay on concrete bench, aspirational, full product visible, no text, no watermark."
  }
)

foreach ($p in $products) {
  $img = Join-Path $refs "$($p.slug).png"
  if (-not (Test-Path $img)) { throw "Missing ref: $img" }
  foreach ($s in $shots) {
    $prompt = "PRODUCT: $($p.label). $($s.suffix)"
    $outDir = Join-Path $base $s.kind
    $name = "$($p.slug)-$($s.kind)"
    Write-Host "=== $name ==="
    $raw = higgsfield generate create nano_banana_flash --prompt $prompt --image $img --aspect_ratio $s.aspect --resolution 2k --wait 2>&1
    $url = ($raw | Select-Object -Last 1 | Out-String).Trim()
    Add-Content -Path $log -Value "$name`t$url"
    $dest = Join-Path $outDir "$name.png"
    Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing
    $manifest += [ordered]@{ product = $p.slug; kind = $s.kind; url = $url; local = $dest }
  }
}

$manifest | ConvertTo-Json -Depth 4 | Set-Content (Join-Path $base "manifest.json") -Encoding UTF8
Write-Host "Done. $($manifest.Count) images."
