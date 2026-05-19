$ErrorActionPreference = "Stop"
$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$productRefs = Join-Path (Split-Path -Parent $base) "refs"
$romeRefs = Join-Path $base "refs"
$romeSoulId = "ca4467f1-d15f-4df0-981d-0394649dabf3"
$romeFace = Join-Path $romeRefs "rome-fitcheck-anchor.png"
$log = Join-Path $base "generation-log-v2.txt"
if (Test-Path $log) { Remove-Item $log }
$manifest = @()

if (-not (Test-Path $romeFace)) { throw "Missing Rome face anchor: $romeFace" }

$jobs = @(
  @{ slug = "01-half-zip-hoodie"; garment = "oversized charcoal grey half-zip drop-shoulder hoodie, black joggers, white sneakers" },
  @{ slug = "02-tracksuit-set"; garment = "black graphic hoodie and matching sweatpants tracksuit with bold abstract street print" },
  @{ slug = "03-homug-tactical-cargo"; garment = "HOMUG tactical multi-pocket cargo pants, black fitted tee, utility streetwear" },
  @{ slug = "04-vortex-stacked-denim"; garment = "Vortex camo stacked ripped denim jeans, black tee, Jordans, stacked ankle detail visible" },
  @{ slug = "05-kzz-colorblock-set"; garment = "KZZ navy and white colorblock zip-up hoodie with matching joggers" }
)

foreach ($j in $jobs) {
  $productImg = Join-Path $productRefs "$($j.slug).png"
  if (-not (Test-Path $productImg)) { throw "Missing product ref: $productImg" }

  $prompt = @"
Cinematic luxury movie-still, vertical 9:16 TikTok fit-check at dusk.

MANDATORY IN FRAME (all four):
(1) ROME the man — same Soul character: masculine Black man, high-volume teal-tipped dreadlock bun, same face as first reference image. Face and eyes clearly visible, never cropped out, never turned away, never missing. Cool neutral unbothered expression, relaxed jaw, half-lidded steady eyes, NO smile, nonchalant old-money ease, unhurried confident energy, easy hands in pockets or light zip adjust.
(2) MATTE ALL-BLACK EXOTIC SUPERCAR behind him — Lamborghini or McLaren silhouette, glossy black paint, visible headlights or body lines, parked close, luxury status symbol, not omitted.
(3) LUXURY mood — golden-hour rim light, deep cinematic shadows, quiet wealth street-luxury, aspirational but real, shallow depth of field.
(4) FULL OUTFIT head to toe — $($j.garment). Faithful colors, print placement, and silhouette.

Scene change from reference: move Rome outdoors beside a parked matte black exotic supercar (not the apartment). He stands relaxed mid-step or one-hand lean on the car door, unhurried fit-check showing the full drip. Never empty clothing, never mannequin, never car-only without Rome, never generic model. Same Rome person as reference image — only location and outfit change.
"@.Trim()

  $name = "rome-exotic-v2-$($j.slug)"
  Write-Host "=== $name ==="
  # Soul V2 accepts only ONE reference image — use Rome face/body anchor; garment spelled out in prompt
  $raw = higgsfield generate create text2image_soul_v2 `
    --prompt $prompt `
    --soul-id $romeSoulId `
    --image $romeFace `
    --aspect_ratio 9:16 `
    --quality 2k `
    --wait 2>&1
  $url = ($raw | Select-Object -Last 1 | Out-String).Trim()
  Add-Content -Path $log -Value "$name`t$url"
  $dest = Join-Path $base "$name.png"
  Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing
  $manifest += [ordered]@{ slug = $j.slug; url = $url; local = $dest }
}

$manifest | ConvertTo-Json -Depth 4 | Set-Content (Join-Path $base "manifest-v2.json") -Encoding UTF8
Write-Host "Done. $($manifest.Count) images."
