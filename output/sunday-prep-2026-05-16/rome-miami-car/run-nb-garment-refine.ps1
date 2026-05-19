$ErrorActionPreference = "Stop"
$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$refs = Join-Path $base "refs"
$log = Join-Path $base "generation-log-nb.txt"
if (Test-Path $log) { Remove-Item $log }
$manifest = @()

$jobs = @(
  @{ slug = "01-half-zip-hoodie"; sceneFile = "rome-penthouse-01-half-zip-hoodie.png"; garment = "oversized charcoal grey half-zip drop-shoulder essentials hoodie, black joggers, white sneakers" },
  @{ slug = "02-tracksuit-set"; sceneFile = "rome-car-02-tracksuit-set.png"; garment = "matching black graphic hoodie and sweatpants tracksuit set with bold abstract street print exactly as product reference" },
  @{ slug = "03-homug-tactical-cargo"; sceneFile = "rome-penthouse-03-homug-tactical-cargo.png"; garment = "HOMUG tactical multi-pocket cargo work pants and black fitted tee exactly as product reference" },
  @{ slug = "04-vortex-stacked-denim"; sceneFile = "rome-car-04-vortex-stacked-denim.png"; garment = "Vortex camo stacked ripped denim jeans, black tee, sneakers, stacked ankle detail exactly as product reference" },
  @{ slug = "05-kzz-colorblock-set"; sceneFile = "rome-penthouse-05-kzz-colorblock-set.png"; garment = "KZZ navy and white colorblock zip-up hoodie and matching joggers exactly as product reference" }
)

foreach ($j in $jobs) {
  $sceneImg = Join-Path $base $j.sceneFile
  $productImg = Join-Path $refs "$($j.slug).png"
  if (-not (Test-Path $sceneImg)) { throw "Missing scene: $sceneImg" }
  if (-not (Test-Path $productImg)) { throw "Missing product: $productImg" }

  $prompt = @"
Use the first reference image for Rome, pose, lighting, and background ONLY. Use the second reference image for the outfit and product ONLY.

Outfit-swap edit. Keep the man in image 1 EXACTLY: same masculine Black Rome, high-volume teal-tipped dreadlock bun, same face, same nonchalant cool neutral expression, relaxed jaw, half-lidded eyes, NO smile, same full-body fit-check pose, same Miami penthouse OR same night luxury car scene, same cool dark blue-teal nighttime lighting, same camera framing 9:16 vertical.

Replace only his clothing with the EXACT garment from image 2 (product reference): $($j.garment). Match colors, prints, pockets, silhouette, and details faithfully. Full outfit visible head to toe.

Photoreal TikTok fit-check. No text overlay. No mannequin. Rome must stay in frame.
"@.Trim()

  $name = "rome-nb-refined-$($j.slug)"
  Write-Host "=== $name ==="
  $raw = higgsfield generate create nano_banana_flash `
    --prompt $prompt `
    --image $sceneImg `
    --image $productImg `
    --aspect_ratio 9:16 `
    --resolution 2k `
    --wait 2>&1
  $url = ($raw | Select-Object -Last 1 | Out-String).Trim()
  Add-Content -Path $log -Value "$name`t$url"
  $dest = Join-Path $base "$name.png"
  Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing
  $manifest += [ordered]@{ slug = $j.slug; url = $url; local = $dest }
}

$manifest | ConvertTo-Json -Depth 4 | Set-Content (Join-Path $base "manifest-nb.json") -Encoding UTF8
Write-Host "Done. $($manifest.Count) refined images."
