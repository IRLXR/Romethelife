$ErrorActionPreference = "Stop"
$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$refs = Join-Path $base "refs"
$romeSoulId = "14911b81-0038-4fa2-9b93-2198b46ca808"
$romeFace = Join-Path $refs "rome-fitcheck-anchor.png"
$log = Join-Path $base "generation-log.txt"
$manifest = @()

$jobs = @(
  @{
    slug = "01-half-zip-hoodie"
    scene = "penthouse"
    garment = "oversized charcoal grey half-zip drop-shoulder hoodie, black joggers, clean white sneakers"
  },
  @{
    slug = "02-tracksuit-set"
    scene = "car"
    garment = "black graphic hoodie and matching sweatpants tracksuit with bold abstract street print"
  },
  @{
    slug = "03-homug-tactical-cargo"
    scene = "penthouse"
    garment = "HOMUG tactical multi-pocket cargo pants, black fitted tee, utility streetwear"
  },
  @{
    slug = "04-vortex-stacked-denim"
    scene = "car"
    garment = "Vortex camo stacked ripped denim jeans, black fitted tee, high-top sneakers, stacked ankle visible"
  },
  @{
    slug = "05-kzz-colorblock-set"
    scene = "penthouse"
    garment = "KZZ navy and white colorblock zip-up hoodie with matching joggers"
  }
)

$romeCore = @"
Same Rome Soul character: masculine Black man, high-volume teal-tipped dreadlock bun, same face as reference image. Nonchalant old-money ease — relaxed jaw, unbothered cool neutral expression, half-lidded steady eyes, NO smile, never timid or cutesy. Unhurried confident energy, easy hands. Face and eyes clearly visible, full body head-to-toe fit-check, never omit Rome, never mannequin, never empty clothes.
"@.Trim()

$penthouseScene = @"
SETTING: Luxury Miami high-rise penthouse at NIGHT. Floor-to-ceiling windows, Brickell/Downtown Miami skyline lights bokeh outside. Cool dark moody interior — blue-teal ambient glow, soft cyan edge light, deep shadows, marble floors, modern minimalist furniture, quiet wealth. Cinematic movie-still, vertical 9:16 TikTok fit-check. Rome stands relaxed near the glass, subtle reflection, unbothered nonchalant posture.
"@.Trim()

$carScene = @"
SETTING: Night outside beside a matte ALL-BLACK exotic supercar (Lamborghini or McLaren wedge silhouette, glossy black paint, visible body lines). Cool dark cinematic lighting, city rim light, luxury street energy. Rome leans one shoulder on the car or hands in pockets — slow deliberate nonchalant fit-check stance, unhurried, never eager. Vertical 9:16 movie-still.
"@.Trim()

foreach ($j in $jobs) {
  $sceneBlock = if ($j.scene -eq "penthouse") { $penthouseScene } else { $carScene }
  $prompt = "$sceneBlock $romeCore Wearing exactly: $($j.garment). Match product colors, print, and silhouette faithfully."

  $name = "rome-$($j.scene)-$($j.slug)"
  Write-Host "=== $name ==="
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
  $manifest += [ordered]@{ slug = $j.slug; scene = $j.scene; url = $url; local = $dest }
}

$manifest | ConvertTo-Json -Depth 4 | Set-Content (Join-Path $base "manifest.json") -Encoding UTF8
Write-Host "Done. $($manifest.Count) images."
