# Marketing Studio UGC - 10 exotic CAR + product videos (Rome MS avatar)
$ErrorActionPreference = "Stop"
$inDir = Join-Path $PSScriptRoot "ms-input"
$avPath = Join-Path $inDir "avatar-rome-ms.json"
$log = Join-Path $PSScriptRoot "ms-exotic-car-batch-log.txt"
$jobs = @(
  @{ n=1; pf="product-01.json"; hook="26cac2dd-99cb-4818-a678-509b0dab2c32"; set="8c95f9ba-5849-44b1-82d0-9f6b33240758"; prompt="The exotic supercar stays a large hero prop in frame, three-quarter or full profile, paint readable. Matte black Lamborghini Urus, golden hour downtown street. Rome in the half-zip drop-shoulder hoodie, full garment, 360 spin, adjusts zipper. TikTok Shop fit check. Masculine nonchalant Black man, mid-twenties regular athletic build, no new tattoos. 9:16 vertical." }
  @{ n=2; pf="product-02.json"; hook="2db84ed8-7082-4981-9c9c-9d61b3c28668"; set="10f47b85-abd7-4899-b6b6-91ff2969d3bf"; prompt="The exotic supercar stays a large hero prop in frame, three-quarter or full profile, paint readable. Red Ferrari 488 Spider, long luxury driveway, palms and mansion light. Rome in the heavyweight GOD IS GOOD washed tee, graphics legible, collar tug, slow walk. TikTok Shop. Masculine nonchalant, no new tattoos. 9:16 vertical." }
  @{ n=3; pf="product-03.json"; hook="26cac2dd-99cb-4818-a678-509b0dab2c32"; set="6bfbe372-e50a-4900-adee-d4cbd0db8a2f"; prompt="The exotic supercar stays a large hero prop in frame, three-quarter or full profile, paint readable. Orange McLaren 720S in sleek private garage, LED mood. Rome in matching graphic hoodie and joggers, half zip, shoulder shimmy, points camera. TikTok Shop. Masculine nonchalant, no new tattoos. 9:16 vertical." }
  @{ n=4; pf="product-04.json"; hook="2db84ed8-7082-4981-9c9c-9d61b3c28668"; set="8c95f9ba-5849-44b1-82d0-9f6b33240758"; prompt="The exotic supercar stays a large hero prop in frame, three-quarter or full profile, paint readable. White Rolls-Royce Cullinan at valet curb, night neon. Rome in creative letters plus-size tee, cuff straighten, profile, walk to camera. TikTok Shop. Masculine nonchalant, no new tattoos. 9:16 vertical." }
  @{ n=5; pf="product-05.json"; hook="26cac2dd-99cb-4818-a678-509b0dab2c32"; set="fdfa032c-801f-4602-8dfd-1162b0f8c9c9"; prompt="The exotic supercar stays a large hero prop in frame, three-quarter or full profile, paint readable. Matte grey Porsche 911 GT3 at gas station dusk, purple sky and pump lights. Rome in acid wash oversized half-sleeve tee, phone check, smirk. TikTok Shop. Masculine nonchalant, no new tattoos. 9:16 vertical." }
  @{ n=6; pf="product-06.json"; hook="2db84ed8-7082-4981-9c9c-9d61b3c28668"; set="3cf2164e-ffac-4867-9c43-1d673a5cb28a"; prompt="The exotic supercar stays a large hero prop in frame, three-quarter or full profile, paint readable. Dark green Bentley Continental GT visible from penthouse lobby windows, skyline night. Rome in bear and letter varsity jacket, fit-check turn, hem tug. TikTok Shop. Masculine nonchalant, no new tattoos. 9:16 vertical." }
  @{ n=7; pf="product-07.json"; hook="26cac2dd-99cb-4818-a678-509b0dab2c32"; set="8c95f9ba-5849-44b1-82d0-9f6b33240758"; prompt="The exotic supercar stays a large hero prop in frame, three-quarter or full profile, paint readable. Purple Lamborghini Aventador, scissor doors up, wet neon street reflections. Rome in Vortex stacked ripped camo denim, hood adjust, power pose. TikTok Shop. Masculine nonchalant, no new tattoos. 9:16 vertical." }
  @{ n=8; pf="product-08.json"; hook="26cac2dd-99cb-4818-a678-509b0dab2c32"; set="3cf2164e-ffac-4867-9c43-1d673a5cb28a"; prompt="The exotic supercar stays a large hero prop in frame, three-quarter or full profile, paint readable. Silver Aston Martin DB11 on rooftop deck, sunset skyline panorama. Rome in Y2K wide-leg baggy jeans, safe hood sit, hop off, fit-check spin. TikTok Shop. Masculine nonchalant, no new tattoos. 9:16 vertical." }
  @{ n=9; pf="product-09.json"; hook="2db84ed8-7082-4981-9c9c-9d61b3c28668"; set="d6992aea-4521-4606-9e4f-8c766e12622c"; prompt="The exotic supercar stays a large hero prop in frame, three-quarter or full profile, paint readable. Blacked-out Mercedes G-Wagon, desert highway golden hour, big sky. Rome in 438 Rolling Loud tee and utility vest, walk around truck, arms crossed, nod. TikTok Shop. Masculine nonchalant, no new tattoos. 9:16 vertical." }
  @{ n=10; pf="product-10.json"; hook="26cac2dd-99cb-4818-a678-509b0dab2c32"; set="d39dda10-643c-44e2-bfc8-2451dddde7d9"; prompt="The exotic supercar stays a large hero prop in frame, three-quarter or full profile, paint readable. Blue Bugatti Chiron on raised platform, minimalist showroom spotlights. Rome in acid wash oversized crew tee and open blazer, lapel adjust, slow walk. TikTok Shop. Masculine nonchalant, no new tattoos. 9:16 vertical." }
)
"Started $(Get-Date -Format o)" | Out-File $log -Encoding utf8
foreach ($j in $jobs) {
  $pPath = Join-Path $inDir $j.pf
  "--- Pairing $($j.n) ---" | Tee-Object -FilePath $log -Append
  try {
    higgsfield generate create marketing_studio_video `
      --prompt $j.prompt `
      --avatars "@$avPath" `
      --product_ids "@$pPath" `
      --mode ugc `
      --hook_id $j.hook `
      --setting_id $j.set `
      --duration 15 `
      --resolution 720p `
      --aspect_ratio 9:16 `
      --wait `
      --wait-timeout 30m 2>&1 | Tee-Object -FilePath $log -Append
  } catch {
    $_ | Tee-Object -FilePath $log -Append
  }
}
"Finished $(Get-Date -Format o)" | Tee-Object -FilePath $log -Append
