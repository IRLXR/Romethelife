# Redo early exotic MS batch (no hook/setting) - same style as higgsfield.ai/s/B7BpM03NqLk -> job a2cc0587-de81-4e88-834e-9df191989ba4
# Rome MS avatar, ugc, 15s 720p 9:16, prompts cloned from completed jobs d595e527, a4849e57, f65b6df4, cd8c5e40, a454a9d3, a2cc0587, 96df8594, 1fa499ac
$ErrorActionPreference = "Stop"
$inDir = Join-Path $PSScriptRoot "ms-input"
$avPath = Join-Path $inDir "avatar-rome-ms.json"
$log = Join-Path $PSScriptRoot "redo-early-ms-exotic-batch-log.txt"
$jobs = @(
  @{ n=1; pf="redo-product-01.json"; prompt="Rome walks into a sleek private garage where an orange McLaren 720S sits under moody LED strip lighting. He's wearing the oversized God Is Good graphic tee with tech-fleece joggers, retro Jordans, and a crossbody designer bag. He stops center frame, unzips his jacket to reveal a layered chain stack, does a subtle shoulder shimmy, then points at the camera. Cool blue and orange contrast lighting. TikTok Shop fit check energy." }
  @{ n=2; pf="redo-product-02.json"; prompt="Rome hands keys to a valet outside a high-end restaurant at night, standing next to a white Rolls-Royce Cullinan. He's wearing the 230gsm GOD IS GOOD heavyweight tee tucked into fitted trousers with patent leather Chelsea boots, oversized watch catching the light. He straightens his cuffs, does a clean side-profile pose, then walks toward camera. Neon restaurant signage glowing in the background. Cinematic nighttime tones. TikTok Shop fit check energy." }
  @{ n=3; pf="redo-product-03.json"; prompt="Rome leans against a matte grey Porsche 911 GT3 at a gas station at dusk, wearing the COOFANDY workout tank top with distressed designer jeans, a leather bomber jacket draped over his shoulder, and high-top sneakers. He pulls out his phone, checks himself, then looks up and smirks at the camera. Fluorescent gas station lights mixing with purple-pink sunset sky. Gritty urban aesthetic. TikTok Shop fit check energy." }
  @{ n=4; pf="redo-product-04.json"; prompt="Rome walks down a luxury mansion driveway toward a red Ferrari 488 Spider with the top down, rocking the Cartoon Bear Drop-Shoulder Varsity Jacket over a fitted tee with wide-leg trousers and leather slides. Gold chain catches the sunlight. He pauses mid-stride, tugs the collar, looks directly into camera. Palm trees and mansion in the background, bright midday sun. TikTok Shop fit check energy." }
  @{ n=5; pf="redo-product-05.json"; prompt="Rooftop parking deck at sunset with a city skyline panorama. A silver Aston Martin DB11 is parked facing the view. Rome sits on the hood wearing the Acid Wash Oversized Crew-Neck Tee with relaxed linen pants, white low-top sneakers, minimal gold jewelry, and aviator sunglasses. He hops off the hood, does a casual fit check spin, then leans on the car door looking out at the skyline. Warm golden-hour backlight with lens flare. TikTok Shop fit check energy." }
  @{ n=6; pf="redo-product-06.json"; prompt="Rome steps out of a private elevator into a penthouse lobby with floor-to-ceiling windows showing a city skyline at night. Through the window, a dark green Bentley Continental GT is visible parked below. He's wearing the 100% Cotton Letters Graphic Tee with tailored shorts, designer loafers with no socks, and a statement bracelet stack. He does a slow fit check turn, tugs the shirt hem, then walks toward the window. Moody interior lighting, warm amber tones. TikTok Shop fit check energy." }
  @{ n=7; pf="redo-product-07.json"; prompt="Open desert highway, big sky energy. A blacked-out Mercedes G-Wagon is parked on the shoulder. Rome steps out wearing the Acid Wash Oversized Half-Sleeve Tee with wide-leg khaki pants, desert boots, and layered silver chains. He walks around the front of the truck, stops on the driver side facing camera, crosses arms, slight head nod. Dusty warm light, endless road stretching behind him. Epic landscape composition. TikTok Shop fit check energy." }
  @{ n=8; pf="redo-product-08.json"; prompt="Inside a minimalist luxury car showroom with polished concrete floors and dramatic spot lighting. A blue Bugatti Chiron sits on a raised platform in the background. Rome walks into frame wearing the Cartoon Bear Drop-Shoulder Varsity Jacket with slim trousers, pointed-toe boots, heavy Cuban link chain, and dark sunglasses. He adjusts his jacket lapel, does a power stance, then slowly walks toward camera. Clean white lighting with blue accent reflections from the car. Final boss energy. TikTok Shop fit check energy." }
)
"Started $(Get-Date -Format o)" | Out-File $log -Encoding utf8
foreach ($j in $jobs) {
  $pPath = Join-Path $inDir $j.pf
  "--- Redo $($j.n) / 8 ---" | Tee-Object -FilePath $log -Append
  try {
    higgsfield generate create marketing_studio_video `
      --prompt $j.prompt `
      --avatars "@$avPath" `
      --product_ids "@$pPath" `
      --mode ugc `
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
