$ErrorActionPreference = "Stop"
$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$refs = Join-Path (Split-Path -Parent $base) "refs"
$romeSoulId = "14911b81-0038-4fa2-9b93-2198b46ca808"
$log = Join-Path $base "generation-log.txt"
$manifest = @()

$jobs = @(
  @{ slug = "01-half-zip-hoodie"; garment = "oversized half-zip drop-shoulder essentials hoodie in charcoal grey, black joggers, clean white sneakers" },
  @{ slug = "02-tracksuit-set"; garment = "full graphic black hoodie and matching sweatpants tracksuit set with bold abstract street pattern" },
  @{ slug = "03-homug-tactical-cargo"; garment = "HOMUG tactical multi-pocket cargo work pants in olive or black, plain black fitted tee, utility street look" },
  @{ slug = "04-vortex-stacked-denim"; garment = "Vortex camo stacked ripped denim jeans, black fitted tee, high-top sneakers, stacked hem visible at ankle" },
  @{ slug = "05-kzz-colorblock-set"; garment = "KZZ colorblock zip-up hoodie and matching joggers set, navy and white two-tone athletic streetwear" }
)

$promptCore = @"
Movie-still cinematic frame, vertical TikTok fit-check. Dusk golden rim light and deep shadow; matte all-black exotic supercar behind him (Lamborghini-style wedge silhouette, glossy black paint, one clean highlight stripe). Same Rome: masculine Black man, nonchalant old-money street-luxury ease — relaxed jaw, unbothered cool neutral expression, half-lidded steady eyes, NO smile, never timid or eager. Loose confident stance, easy hands in pockets or light touch on zipper, slow deliberate posture. Full outfit head to toe visible for fit check. Clothes must match the product reference image exactly.
"@.Trim()

foreach ($j in $jobs) {
  $img = Join-Path $refs "$($j.slug).png"
  if (-not (Test-Path $img)) { throw "Missing ref: $img" }
  $prompt = "$promptCore Wearing: $($j.garment)."
  $name = "rome-exotic-$($j.slug)"
  Write-Host "=== $name ==="
  $raw = higgsfield generate create text2image_soul_v2 `
    --prompt $prompt `
    --soul-id $romeSoulId `
    --image $img `
    --aspect_ratio 9:16 `
    --quality 2k `
    --wait 2>&1
  $url = ($raw | Select-Object -Last 1 | Out-String).Trim()
  Add-Content -Path $log -Value "$name`t$url"
  $dest = Join-Path $base "$name.png"
  Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing
  $manifest += [ordered]@{ slug = $j.slug; url = $url; local = $dest }
}

$manifest | ConvertTo-Json -Depth 4 | Set-Content (Join-Path $base "manifest.json") -Encoding UTF8
Write-Host "Done. $($manifest.Count) Rome exotic fit-checks."
