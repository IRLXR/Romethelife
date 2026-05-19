# Higgsfield — Available Products

A complete catalog of products, models, and tools available through the Higgsfield AI platform (via the `higgsfield` CLI). Grouped by category, with the customer-facing name, the technical ID for `--model` flags where applicable, the provider, and what each one is for.

> Source of truth: `higgsfield model list --json` (live schema). This document mirrors the in-house skill catalogs and is meant as a quick reference.

---

## 1. Top-level Products / Tools

These are the higher-level Higgsfield offerings — full workflows, not just models. Each has its own CLI sub-command.


| Product                | CLI entry point                                                                       | What it does                                                                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Generate**           | `higgsfield generate create <model>`                                                  | Generic image / video / analysis generation. Picks any model in the catalog below.                                                                         |
| **Marketing Studio**   | `higgsfield marketing-studio …` + `marketing_studio_video` / `marketing_studio_image` | Branded ad image and video gen with avatars, products, hooks, settings, ad references, and Click-to-Ad shortcuts.                                          |
| **Product Photoshoot** | `higgsfield product-photoshoot create`                                                | Brand-quality product images (studio, lifestyle, hero, carousel, ad creative, virtual try-on, conceptual, restyle). Prompt-enhanced on top of GPT Image 2. |
| **Marketplace Cards**  | `higgsfield marketplace-cards create`                                                 | Marketplace-ready listing images: main image, secondary product images, A+ content modules.                                                                |
| **Soul Character**     | `higgsfield soul-id create`                                                           | Train an identity-faithful character model on a person's face. Reusable across Soul-powered generations.                                                   |
| **Virality Predictor** | `higgsfield generate create brain_activity --video …`                                 | Analyze a finished video for hook strength, attention, retention, distraction risk, and overall virality score. Returns a text report + Open report URL.   |


---

## 2. Image Models

Pass via `--model` to `higgsfield generate create`. Defaults bolded.


| Model                      | `job_set_type` / ID       | Provider          | Best for                                                                                                                                    |
| -------------------------- | ------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **GPT Image 2**            | `gpt_image_2`             | OpenAI            | **Default high-fidelity image gen.** Graphic design, UI, banners, typography, on-image text. Also powers Product Photoshoot under the hood. |
| GPT Image 1.5              | `gpt_image_1_5`           | OpenAI            | Earlier OpenAI image model with editing and text-rendering.                                                                                 |
| **Nano Banana 2**          | `nano_banana_2`           | Google            | **Default for character / cartoon / animated-style** image work and edits.                                                                  |
| Nano Banana Pro            | `nano_banana_pro`         | Google            | Top-tier Nano Banana — extra fidelity / accuracy for hard briefs.                                                                           |
| Nano Banana                | `nano_banana`             | Google            | Budget-friendly Nano Banana variant with the same realistic look.                                                                           |
| Higgsfield Soul 2.0        | `text2image_soul_v2`      | Higgsfield        | **Aesthetic UGC, fashion editorial, character generation.** Accepts a Soul Character reference.                                             |
| Soul Cinema                | `soul_cinematic`          | Higgsfield        | **Cinematic stills, film-grade lighting.** Soul-aware.                                                                                      |
| Soul Cast                  | `soul_cast`               | Higgsfield        | **Distinctive, characterful personas.** Text-only (no reference image).                                                                     |
| Soul Location              | `soul_location`           | Higgsfield        | **Best-in-class environments / locations / no-people scenes.**                                                                              |
| Seedream 4.5               | `seedream_4_5`            | ByteDance         | **Vector illustrations and face-anchored edits with complex scene swaps.**                                                                  |
| Seedream 5.0 Lite          | `seedream_5_lite`         | ByteDance         | Same lineage as 4.5, faster turnaround for visual-reasoning edits.                                                                          |
| Z Image                    | `z_image`                 | Tongyi-MAI        | **Fastest in catalog.** Drafts, fast iteration, LoRA-driven stylization. Prompt-only.                                                       |
| Flux 2.0                   | `flux_2_0`                | Black Forest Labs | Precise prompt adherence; variants pro / flex / max. Alternative creative look.                                                             |
| Flux Kontext Max           | `flux_kontext_max`        | Black Forest Labs | Context-aware editing and style transfer — anime, stylized looks, typography remix.                                                         |
| Kling O1 Image             | `kling_o1_image`          | Kling             | Versatile photorealistic generation with broad aspect-ratio support.                                                                        |
| Grok Imagine               | `grok_imagine`            | xAI               | Expressive, high-contrast, bold creative outputs. Strong for anime and stylized looks.                                                      |
| Cinema Studio Image 2.5    | `cinema_studio_image_2_5` | Higgsfield        | Cinematic still frames up to 4K with dramatic film look.                                                                                    |
| **Marketing Studio Image** | `marketing_studio_image`  | Higgsfield        | **Branded ad images.** Retrieval-augmented over the user's avatars and products.                                                            |
| Auto                       | `auto`                    | Higgsfield        | Smart routing layer — picks the best image model from the prompt automatically.                                                             |


---

## 3. Video Models


| Model                        | `job_set_type` / ID       | Provider   | Best for                                                                                                                                           |
| ---------------------------- | ------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Seedance 2.0**             | `seedance_2_0`            | ByteDance  | **SOTA all-purpose video.** Multi-shot, consistent identity, image-to-video, 4–15s. Default for any serious motion / cinematic / production brief. |
| Kling 3.0                    | `kling3_0`                | Kling      | **Cheaper Seedance 2.0 substitute** for single-plane scenes. Multi-shot, audio sync, motion transfer.                                              |
| Kling 2.6                    | `kling2_6`                | Kling      | Cinematic motion with advanced physics — earlier Kling release.                                                                                    |
| Seedance 1.5 Pro             | `seedance_1_5_pro`        | ByteDance  | Budget-friendly clean single-take Seedance.                                                                                                        |
| **Marketing Studio (video)** | `marketing_studio_video`  | Higgsfield | **Default for all advertising / commercial video** — UGC, unboxing, TV spot, product showcase.                                                     |
| Cinema Studio Video 3.0      | `cinema_studio_video_3_0` | Higgsfield | **Top-tier cinema-grade execution**, highest fidelity, film-look briefs.                                                                           |
| Cinema Studio Video v2       | `cinema_studio_video_v2`  | Higgsfield | Refined cinematic camera and color with genre control (legacy — prefer 3.0).                                                                       |
| Cinema Studio Video          | `cinema_studio_video`     | Higgsfield | Cinematic compositions with dramatic mood (legacy — prefer 3.0).                                                                                   |
| Google Veo 3.1               | `veo3_1`                  | Google     | Ultra-realistic, top-tier cinematic. Tiers basic / high / ultra. Constrained format set.                                                           |
| Veo 3.1 Lite                 | `veo3_1_lite`             | Google     | **Fast and cost-effective Veo.** Built for batch / volume work.                                                                                    |
| Google Veo 3                 | `veo3`                    | Google     | Reliable cinematic with broad creative range and audio support.                                                                                    |
| Minimax Hailuo               | `minimax_hailuo`          | Hailuo     | **Cheap with strong physics.** Solid budget pick; no audio in current variants.                                                                    |
| Wan 2.7                      | `wan_2_7`                 | Wan        | Synchronized audio with character-consistent video — newer Wan release.                                                                            |
| Wan 2.6                      | `wan_2_6`                 | Wan        | Open-weight, stylized, experimental, cheap.                                                                                                        |
| Grok Imagine (video)         | `grok_imagine_video`      | xAI        | Text- and image-to-video with audio. Strong for stylized creative briefs.                                                                          |


---

## 4. Text / Analysis Models


| Model                  | `job_set_type` / ID | Provider   | Best for                                                                                                                                                                                          |
| ---------------------- | ------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Virality Predictor** | `brain_activity`    | Higgsfield | **Objective attention proxy** for finished video creative. Scores hook strength, virality potential, attention, retention, distraction risk. Input: video. Output: text report + Open report URL. |


---

## 5. Marketing Studio — Sub-products

Marketing Studio is a workflow on top of `marketing_studio_video` and `marketing_studio_image`. It composes several reusable building blocks. Each block has its own CLI namespace.


| Block             | CLI namespace                                   | What it is                                                                                                             |
| ----------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Avatars**       | `higgsfield marketing-studio avatars …`         | Presenter faces. `preset` (curated by Higgsfield) or `custom` (uploaded photos → Soul Character auto-created).         |
| **Products**      | `higgsfield marketing-studio products …`        | Brand items with title + reference images. Created from upload or imported from URL (incl. App Store → webproduct).    |
| **Webproducts**   | (auto-routed under `products fetch --url …`)    | App Store / web-page product variant.                                                                                  |
| **Hooks**         | `higgsfield marketing-studio hooks …`           | Reusable opening angles / ad hooks. Prepended to your prompt. Valid for UGC-family modes only.                         |
| **Settings**      | `higgsfield marketing-studio settings …`        | Reusable environments / scene contexts. Valid for UGC-family modes only.                                               |
| **Ad References** | `higgsfield marketing-studio ad-references …`   | Reusable inspiration videos bound to an avatar and/or product. Built from an uploaded video or a prior generation job. |
| **Click-to-Ad**   | `--feature click_to_ad` + `--url <product-url>` | One-shot URL → marketing video. Backend dedupes by URL.                                                                |


### Marketing Studio Video — Modes

Pass via `--mode` to `marketing_studio_video`. Default is `ugc`.


| `--mode` slug        | Label              | Hook / setting compatible | Best for                                                |
| -------------------- | ------------------ | ------------------------- | ------------------------------------------------------- |
| `ugc`                | UGC                | ✅                         | Default. Casual, organic-feel content from a presenter. |
| `ugc_how_to`         | Tutorial           | ✅                         | "Here's how to use this." Tutorial / explainer.         |
| `ugc_unboxing`       | Unboxing           | ✅                         | "Just got this in the mail." Unboxing reveal.           |
| `product_showcase`   | Product Showcase   | ❌                         | Clean product highlight, polished.                      |
| `product_review`     | Product Review     | ✅                         | Presenter giving an opinion on the product.             |
| `tv_spot`            | TV Spot            | ❌                         | Broadcast-style commercial, higher production.          |
| `wild_card`          | Wild Card          | ❌                         | Experimental, model picks the vibe.                     |
| `ugc_virtual_try_on` | UGC Virtual Try On | ✅                         | Person trying on clothing / accessories — UGC vibe.     |
| `virtual_try_on`     | Pro Virtual Try On | ❌                         | Same but more polished, model-driven.                   |


---

## 6. Product Photoshoot — Modes

`higgsfield product-photoshoot create --mode <mode>`. Backend assembles the final prompt; runs on `gpt_image_2`.


| Mode                          | When to use                                                                |
| ----------------------------- | -------------------------------------------------------------------------- |
| `product_shot`                | Product on neutral / studio / catalog background.                          |
| `lifestyle_scene`             | Product in real-world environment, hands, action, atmosphere.              |
| `closeup_product_with_person` | Tight crop with hands / partial face — beauty, demonstrating, holding.     |
| `moodboard_pin`               | Vertical 2:3 Pinterest-native aesthetic, moodboard feel.                   |
| `hero_banner`                 | Wide-format website / email / campaign header.                             |
| `social_carousel`             | 3–10 connected slides for IG / LinkedIn / Facebook.                        |
| `ad_creative_pack`            | Coordinated static ad variants for Meta / TikTok / Pinterest / Google Ads. |
| `virtual_model_tryout`        | Product worn or used by an AI-rendered model.                              |
| `conceptual_product`          | Surreal / CGI / levitating / splash / sculptural product.                  |
| `restyle`                     | Transform an existing image's aesthetic, mood, or seasonal context.        |


---

## 7. Marketplace Cards — Scopes & Assets

`higgsfield marketplace-cards create`. Runs on `nano_banana_2`.

### Scopes (common bundles)


| `--scope`        | Creates                                        |
| ---------------- | ---------------------------------------------- |
| `main`           | 1 marketplace main image                       |
| `product-images` | main image + 5 secondary images                |
| `aplus`          | main image + 7 A+ modules                      |
| `full-set`       | main image + 5 secondary images + 7 A+ modules |


### Individual asset types (`--asset`)

- `main_image`
- `infographic`
- `multi_angle`
- `detail_shot`
- `lifestyle`
- `whats_in_box`
- `aplus_hero_banner`
- `aplus_pain_points`
- `aplus_features`
- `aplus_ingredients`
- `aplus_efficacy`
- `aplus_how_to_use`
- `aplus_endorsement`

---

## 8. Soul Character — Variants

`higgsfield soul-id create`. Trains an identity model on a person's face. Requires Basic plan or higher.


| Variant flag       | Best for                                                   |
| ------------------ | ---------------------------------------------------------- |
| `--soul-2`         | Default. Image generation. Pair with `text2image_soul_v2`. |
| `--soul-cinematic` | Cinematic / video work. Pair with `soul_cinematic`.        |


Once trained, pass `--soul-id <ref_id>` to any Soul-powered model:

- `text2image_soul_v2` — Soul 2.0 stills
- `soul_cinematic` — Soul Cinema stills / cinematic frames

---

## 9. Default Picks (Cheat-Sheet)


| Intent                                                     | Reach-for-this product                                         |
| ---------------------------------------------------------- | -------------------------------------------------------------- |
| General high-fidelity image, graphic design, on-image text | **GPT Image 2**                                                |
| Character / cartoon / animated-style image                 | **Nano Banana 2** (step up to Nano Banana Pro for hard briefs) |
| Aesthetic UGC / fashion editorial / lifestyle still        | **Soul 2.0**                                                   |
| Cinematic still frame                                      | **Soul Cinema**                                                |
| Environments / locations / no people                       | **Soul Location**                                              |
| Fast/cheap image iteration                                 | **Z Image**                                                    |
| Brand product photo (lifestyle, hero, pin, ad, try-on)     | **Product Photoshoot**                                         |
| Marketplace listing image set                              | **Marketplace Cards**                                          |
| All-purpose serious / cinematic video                      | **Seedance 2.0**                                               |
| Cheaper single-plane video                                 | **Kling 3.0**                                                  |
| Cinema-grade highest-fidelity video                        | **Cinema Studio Video 3.0**                                    |
| Cheap video with strong physics, no audio                  | **Minimax Hailuo**                                             |
| Fast batch / volume video                                  | **Veo 3.1 Lite**                                               |
| Any branded ad / UGC / unboxing / TV spot                  | **Marketing Studio**                                           |
| Train an identity / digital twin                           | **Soul Character**                                             |
| Score / analyze a finished video                           | **Virality Predictor** (`brain_activity`)                      |


---

## 10. Discovery Commands

When something here looks stale, the live schema wins:

```bash
higgsfield model list --json                       # every generation model
higgsfield model get <job_set_type> --json         # one model's full schema
higgsfield marketing-studio avatars list --json
higgsfield marketing-studio products list --json
higgsfield marketing-studio hooks list --json
higgsfield marketing-studio settings list --json
higgsfield marketing-studio ad-references list --json
higgsfield soul-id list                            # trained Soul Characters
```

---

## 11. Your Account Assets

> Account: **[hello@irlxr.com](mailto:hello@irlxr.com)** — Creator plan. Snapshot taken 2026-05-12.

### 11.1 Soul Characters (trained identities)

Pass the ID via `--soul-id <id>` to Soul-powered models (`text2image_soul_v2`, `soul_cinematic`).


| Name                               | Variant     | Status             | ID                                     |
| ---------------------------------- | ----------- | ------------------ | -------------------------------------- |
| **RomeInfluencer**                 | `soul_2`    | completed          | `ca4467f1-d15f-4df0-981d-0394649dabf3` |
| **Rome**                           | `soul_2`    | completed          | `14911b81-0038-4fa2-9b93-2198b46ca808` |
| **Dej**                            | `soul_2`    | completed          | `a919b59a-53f0-4988-a89c-af1fc5d39b48` |
| **Urban Swagger King**             | `soul_2`    | completed          | `3148322a-3ae7-40e6-a093-3ba614885ff7` |
| **Male Archive**                   | `soul_2`    | completed          | `b5940816-88de-4175-b85a-dcfd092f6cc2` |
| **Jojo**                           | `soul_2`    | completed          | `c95172ac-3a2e-4d03-9938-82d70f01cdb5` |
| **Philosopher's Quiet Reflection** | `soul_2`    | completed          | `0ca6976f-609e-4f87-a11d-576ae7a3d4d3` |
| **Urban Elegance Leader**          | `soul` (v1) | completed          | `22e5ba45-20af-4327-b1a2-9fbcf7e83d46` |
| Wave characters                    | `soul_2`    | ❌ failed (retrain) | `8ecc11ae-2f14-422f-8d04-f7028864ada6` |


**RomeInfluencer** — trained 2026-05-12 from `Rome Ref-20260512T224501Z-3-001/Rome Ref/Face` (20 photos, sorted by filename; excluded AI comp folders).

### 11.2 Marketing Studio Avatars — Custom (your uploads)

Pass via `--avatars` as `{"id": "...", "type": "custom"}`.


| Name                  | Preview                                                                                                                    | ID                                     |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **Rome** (v4, latest) | [preview](https://d2ol7oe51mr4n9.cloudfront.net/user_36qUG9ViEiTTb1uSQP8OYOk94zV/db3fd4b2-34b5-44e9-9e4f-e64435d4e0fb.png) | `9b072a84-7211-4766-bad4-6f5c73b37800` |
| **rome2**             | [preview](https://d2ol7oe51mr4n9.cloudfront.net/user_36qUG9ViEiTTb1uSQP8OYOk94zV/73cfe4ce-c9f2-4a14-ba10-a292833560f1.png) | `3e545803-06d2-49c7-8270-56f0d219d4b0` |
| rome (v2)             | [preview](https://d2ol7oe51mr4n9.cloudfront.net/user_36qUG9ViEiTTb1uSQP8OYOk94zV/15d2c80b-cbd3-4824-a968-3933752f26f3.png) | `24cc9730-33db-4541-908a-853626ee7ad2` |
| rome (v1)             | [preview](https://d2ol7oe51mr4n9.cloudfront.net/user_36qUG9ViEiTTb1uSQP8OYOk94zV/4e3ab744-82cf-4037-b139-a127d9e46e01.png) | `7c05b5ad-ae8a-45b2-995d-3d0e882f6716` |


### 11.3 Marketing Studio Avatars — Preset (available to your account)

Pass via `--avatars` as `{"id": "...", "type": "preset"}`. 16 presets available.


| Name      | Gender | ID                                     |
| --------- | ------ | -------------------------------------- |
| Jayden    | male   | `672be390-36ab-4d79-bb95-ff562a57c79c` |
| Stefan    | male   | `35cd52c0-e92b-44b1-b56d-b4ea5e609c00` |
| Felix     | male   | `83711427-335b-4b9c-b89a-b6fa78579b49` |
| Malik     | male   | `94950cff-b90a-4416-8384-ce554ff387e1` |
| Liam      | male   | `734451fd-d418-40bd-9dee-5b467658b0d4` |
| Joon      | male   | `48b5553f-4bad-4b87-9a39-4f0088664ed7` |
| Tae       | male   | `6c21ac3e-1f76-4a35-91a6-60f334a0fafa` |
| Mei       | female | `44ee57aa-d1f4-4a0a-a55f-cdf9dacee265` |
| Yuna      | female | `24d6d9cc-42df-43c7-bdfc-be06f317b924` |
| Adriana   | female | `aa9260cc-a888-47b2-8bfd-0a9c90558384` |
| Clara     | female | `daf4bf2e-c19e-4879-805b-bcfa6eda61f2` |
| Maria     | female | `bbf8e803-f10b-4e39-801c-eb12850237ab` |
| Sofia     | female | `bba3087a-ad14-42c2-b51b-7c22b632abf4` |
| Valentina | female | `cd6fb78c-e1a2-42f1-8b1e-902c15511877` |
| Jia       | female | `ffc8862b-0b8a-485c-88e1-f89196d3dc10` |
| Lily      | female | `cec35719-5848-4455-a9dc-e6df72e03b80` |


### 11.4 Marketing Studio Products (your imported / created)

Pass via `--product_ids` as a JSON array (e.g. `'["1eb6201f-..."]'`).


| Title                                                          | Source                 | Primary image                                                                                                           | ID                                     |
| -------------------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **438 Rolling Loud T Shirt**                                   | jeremiahterrell.online | [main](https://d2ol7oe51mr4n9.cloudfront.net/user_36qUG9ViEiTTb1uSQP8OYOk94zV/e6540974-ce85-4e41-9d1f-62c2933eb8cf.png) | `1eb6201f-6df6-499b-8325-efd279aecbf4` |
| Men's Cartoon Bear & Letter Print Drop-Shoulder Varsity Jacket | TikTok                 | [main](https://d2ol7oe51mr4n9.cloudfront.net/user_36qUG9ViEiTTb1uSQP8OYOk94zV/4dd1916d-1141-495a-9310-993f5b496c7c.png) | `66a26506-762b-4094-8030-f75c632a4b0e` |
| Oversized Graphic T-Shirt "God Is Good"                        | upload                 | [main](https://d2ol7oe51mr4n9.cloudfront.net/user_36qUG9ViEiTTb1uSQP8OYOk94zV/f5843f4b-2c14-4b7a-88e0-c4b508165ab6.png) | `bca0c37f-0d8a-4e35-8b42-6340573c0ebf` |
| 230gsm Heavyweight Washed "GOD IS GOOD" Double-Sided Tee       | TikTok                 | [main](https://d2ol7oe51mr4n9.cloudfront.net/user_36qUG9ViEiTTb1uSQP8OYOk94zV/e92ebf68-4a7a-441f-9adf-7fb990fad510.png) | `a9d676cf-cbf9-40a4-b071-e87e876b4333` |
| GTPLAYER Office Gaming Chair                                   | TikTok                 | [main](https://d2ol7oe51mr4n9.cloudfront.net/user_36qUG9ViEiTTb1uSQP8OYOk94zV/243a2602-237d-4418-9b19-58ef057c00d1.png) | `2d205378-0a69-487d-803a-8159b29e200a` |
| COOFANDY Men's Workout Tank Top 2-Pack                         | TikTok                 | [main](https://d2ol7oe51mr4n9.cloudfront.net/user_36qUG9ViEiTTb1uSQP8OYOk94zV/6b0c1196-699e-4b44-af0f-cdb6a1704e35.png) | `9100c0d3-b9c8-4dee-b4e6-61202c6d50a7` |
| 100% Cotton Plus-Size Letters Graphic T-shirt                  | TikTok                 | [main](https://d2ol7oe51mr4n9.cloudfront.net/user_36qUG9ViEiTTb1uSQP8OYOk94zV/800aa463-f88f-4cb8-98ed-fddb5245b112.png) | `191fd30b-7df2-4a3b-9da0-73b295c35156` |
| 100% Cotton Plus-Size Creative Letters Tee (Unisex)            | TikTok                 | [main](https://d2ol7oe51mr4n9.cloudfront.net/user_36qUG9ViEiTTb1uSQP8OYOk94zV/b4177650-e870-48fb-ac71-9ba3c25bf578.png) | `c74243cf-52e0-49a1-b6de-494668ccb98e` |
| 3-Pack Acid Wash Oversized Crew-Neck Tee                       | TikTok                 | [main](https://d2ol7oe51mr4n9.cloudfront.net/user_36qUG9ViEiTTb1uSQP8OYOk94zV/c6b4ae8b-083b-4758-914b-bdf82bc95c6c.png) | `1424d3c6-61f1-4eb1-8cc8-e448b4e2c206` |
| 3-Pack Acid Wash Oversized Half-Sleeve Tee                     | TikTok                 | [main](https://d2ol7oe51mr4n9.cloudfront.net/user_36qUG9ViEiTTb1uSQP8OYOk94zV/1c404433-8136-4393-8615-3b53d65e55df.png) | `a18210d0-4b18-48ec-b11f-84309500981d` |
| **Men's Plain Half Zip Drop Shoulder Essentials Hoodie**       | TikTok Shop (trending) | [main](https://d2ol7oe51mr4n9.cloudfront.net/user_36qUG9ViEiTTb1uSQP8OYOk94zV/f5617c1f-262e-4cf7-9f51-8e60ebb96cf8.png) | `f9e0e9e7-ffce-4cd5-b0f1-45ab0e083ca0` |
| **Wide Leg Jeans Y2K Streetwear Baggy Denim**                  | TikTok Shop (trending) | [main](https://d2ol7oe51mr4n9.cloudfront.net/user_36qUG9ViEiTTb1uSQP8OYOk94zV/7f2163cf-ed1e-4a2e-99c2-709c89358f53.png) | `c63ce3b0-b57f-4073-bd0f-2f6401b1ecd2` |
| **Edgy Graphic Hoodie & Sweatpants Tracksuit Set**             | TikTok Shop (trending) | [main](https://d2ol7oe51mr4n9.cloudfront.net/user_36qUG9ViEiTTb1uSQP8OYOk94zV/087da6bd-af3d-42a0-860f-bcc66c0cb6ea.png) | `2b82c7d9-ec31-4d96-9188-8fb884599b68` |
| **Vortex Ripped Stacked Denim (Camo)**                         | TikTok Shop (trending) | [main](https://d2ol7oe51mr4n9.cloudfront.net/user_36qUG9ViEiTTb1uSQP8OYOk94zV/b567e873-1d15-4bb4-9a01-a06eac3be5a4.png) | `8e0ae6c3-4cc8-4d44-8f93-c973bf37d73e` |
| **HOMUG Men's Solid Color Tactical Work Pants**                | TikTok Shop (trending) | [main](https://d2ol7oe51mr4n9.cloudfront.net/user_36qUG9ViEiTTb1uSQP8OYOk94zV/51b4e1ba-97c3-4a43-ab51-d326d68a0ea7.png) | `64a2fe02-0ca2-4f92-b1f6-adee3d188afe` |
| **KZZ Colorblock Zip-Up Hoodie & Joggers Set**                 | TikTok Shop (trending) | [main](https://d2ol7oe51mr4n9.cloudfront.net/user_36qUG9ViEiTTb1uSQP8OYOk94zV/f424b4a0-052d-4c01-9df5-9e6194f70817.png) | `3b07f4c1-4c22-4910-8953-5a9cd69d5387` |


### 11.5 Marketing Studio Hooks (presets available to your account)

Pass the ID as `--hook_id <id>` on `marketing_studio_video` (UGC-family modes only).


| Name                  | Type   | What it does                                                                                                     | ID                                     |
| --------------------- | ------ | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **Product Hit**       | stunt  | Object flies into frame, hits subject → brief reaction → pivot to product.                                       | `3d45fb46-254f-4c83-9685-8e3d28945a67` |
| **Spicy**             | subtle | Extreme close-up of collarbone tilts up to a full makeup reveal → selfie framing → silent pause → product pitch. | `75b6d501-be0e-4416-a7ed-52f04f180574` |
| **Interview**         | subtle | Stranger-interview confusion builds until they notice the product and pivot into a casual review.                | `26cac2dd-99cb-4818-a678-509b0dab2c32` |
| **Random Object Mic** | stunt  | Random object falls into hand, used as a microphone for a serious review.                                        | `d50eb41c-fcfa-4f4d-93aa-473cdc6bc3b2` |
| **Product Crash**     | subtle | Product falls from above, destroyed → cuts to clean restored scene → calm product review.                        | `8101cd3e-3cc9-4607-a171-3582daa2f6ee` |
| **Blizzard**          | stunt  | Impossible blizzard hits indoor scene; product survives and keeps working.                                       | `31976cc7-e597-4be2-9753-4a80153b0cc7` |
| **Camera Bump**       | subtle | Camera operator bumps into person; brief react → reveals product → casual explanation.                           | `2db84ed8-7082-4981-9c9c-9d61b3c28668` |
| **Product Dodge**     | stunt  | Product flies at face → dodge → stands up already holding it → review like nothing happened.                     | `5443eff1-d940-4ad3-9413-957bb048a6b0` |
| **Epic Fail**         | subtle | Unsuccessful backflip → unflappable product review from the floor.                                               | `ec9fdf99-314d-480d-a656-10d9861341e7` |


### 11.6 Marketing Studio Settings (presets available to your account)

Pass the ID as `--setting_id <id>` on `marketing_studio_video` (UGC-family modes only).


| Name              | Type        | Scene                                                               | ID                                     |
| ----------------- | ----------- | ------------------------------------------------------------------- | -------------------------------------- |
| **Bedroom**       | realistic   | On bed / propped against pillows, soft window light, cozy textures. | `b8368076-35eb-4045-b33b-74b2646d9863` |
| **Kitchen**       | realistic   | Counter or island, natural daylight, daily-routine energy.          | `a0eb0be9-f0ff-4aee-9dee-69d9fd20110a` |
| **Bathroom**      | realistic   | Mirror selfie / vanity lighting, getting-ready close-ups.           | `189fa1ac-1fdc-44f4-bdea-8804a76f0659` |
| **Gym**           | realistic   | Gym floor / locker room / post-workout bench, performance vibe.     | `6bfbe372-e50a-4900-adee-d4cbd0db8a2f` |
| **Office**        | realistic   | Desk + laptop, mid-workday hushed tone.                             | `d39dda10-643c-44e2-bfc8-2451dddde7d9` |
| **In Car**        | realistic   | Selfie from driver/passenger seat, casual between-errands tone.     | `fdfa032c-801f-4602-8dfd-1162b0f8c9c9` |
| **Street**        | realistic   | Walking sidewalk / urban street, energetic handheld pace.           | `8c95f9ba-5849-44b1-82d0-9f6b33240758` |
| **Nature**        | realistic   | Trail / park / beach / garden, natural light, active or peaceful.   | `10f47b85-abd7-4899-b6b6-91ff2969d3bf` |
| **Roofing**       | unrealistic | Skyscraper rooftop edge, city skyline, golden hour, unbothered.     | `3cf2164e-ffac-4867-9c43-1d673a5cb28a` |
| **Airplane Wing** | unrealistic | On airplane wing mid-flight; wind + cloud + engine roar.            | `b03705e5-bbed-4d83-8d29-3bc2101cd14f` |
| **Volcano Rim**   | unrealistic | Sits on active volcano rim, lava below, zero reaction.              | `e99c2ee8-3c4a-4697-9a58-908e73c9ad38` |
| **Car Roof**      | unrealistic | On roof of moving car, desert highway, golden hour.                 | `d6992aea-4521-4606-9e4f-8c766e12622c` |
| **Train Surf**    | unrealistic | Hangs outside a moving train, wind is the live demo.                | `71f61bb0-dfd9-459b-a220-0dd468b977d5` |
| **Tiny Reviewer** | unrealistic | Shrunk to 15 cm next to product their full height.                  | `f495493f-0251-4bd7-afc0-90bc6a862e04` |


### 11.7 Ad References

**None saved yet.** Build one with `higgsfield marketing-studio ad-references create --video-input <upload_id>` or `--job <prior_job_id>`.

---

## 12. Ready-to-Run Examples (Your Assets)

Copy these straight into the terminal.

### Make a UGC ad with Rome wearing the "God Is Good" tee

```bash
PRODUCTS=$(mktemp); AVATARS=$(mktemp)
printf '["a9d676cf-cbf9-40a4-b071-e87e876b4333"]' > "$PRODUCTS"
printf '[{"id":"9b072a84-7211-4766-bad4-6f5c73b37800","type":"custom"}]' > "$AVATARS"

higgsfield generate create marketing_studio_video \
  --prompt "Rome reps the GOD IS GOOD oversized tee in a confident street-style selfie review." \
  --avatars @"$AVATARS" \
  --product_ids @"$PRODUCTS" \
  --hook_id 26cac2dd-99cb-4818-a678-509b0dab2c32 \
  --setting_id 8c95f9ba-5849-44b1-82d0-9f6b33240758 \
  --mode ugc \
  --duration 15 --resolution 720p --aspect_ratio 9:16 \
  --wait
```

### Soul 2.0 still of Rome in a cinematic Rome (Italy) location

```bash
higgsfield generate create text2image_soul_v2 \
  --prompt "Rome, Italy at golden hour, narrow cobblestone alley, cinematic editorial mood." \
  --soul-id 14911b81-0038-4fa2-9b93-2198b46ca808 \
  --quality 2k --aspect_ratio 9:16 \
  --wait
```

### Marketplace cards for the GTPLAYER chair

```bash
higgsfield marketplace-cards create \
  --scope full-set \
  --prompt "GTPLAYER office gaming chair, premium marketplace listing visual system" \
  --image https://d2ol7oe51mr4n9.cloudfront.net/user_36qUG9ViEiTTb1uSQP8OYOk94zV/243a2602-237d-4418-9b19-58ef057c00d1.png \
  --category "gaming chair"
```

### Refresh this snapshot any time

```bash
higgsfield soul-id list --json
higgsfield marketing-studio avatars list --json
higgsfield marketing-studio products list --json
higgsfield marketing-studio hooks list --json
higgsfield marketing-studio settings list --json
higgsfield marketing-studio ad-references list --json
```

