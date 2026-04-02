# Design System Strategy for `apps/web` nextJS website: The Elevated Expedition

## 1. Overview & Creative North Star

### Creative North Star: "The Modern Naturalist"
This design system moves away from the generic, grid-locked "summer camp" aesthetic and toward a high-end, editorial experience that feels as expansive and premium as the Canadian wilderness. "The Modern Naturalist" blends the rugged, adventurous spirit of the outdoors with a sophisticated digital execution.

We break the "template" look through **Intentional Asymmetry** and **Tonal Depth**. Instead of standard boxed sections, we use overlapping image-to-text treatments, varied content widths, and high-contrast typography scales. The goal is to evoke the feeling of a premium adventure journal—where every page turn (or scroll) reveals a new, carefully composed landscape.

---

## 2. Colors

The color palette is rooted in the deep forest and golden sunlight of Temagami, but applied with a sophisticated hierarchy to ensure a premium feel.

### The Palette
- **Primary / Forest Green (`#3b571d`, `#527033`):** Used for authoritative elements and primary brand touchpoints.
- **Secondary / Golden Sun (`#745b00`, `#fecb00`):** Reserved for high-action CTAs and moments of "warmth."
- **Tertiary / Adventure Red (`#a30013`):** High-alert or urgent engagement.
- **Surface Neutrals (`#fff2d9`, `#f9e1ad`):** Organic, off-white tones that prevent the "stark white" digital fatigue.

### Core Rules for Color Application
* **The "No-Line" Rule:** Explicitly prohibit 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. Transition from `surface` to `surface-container-low` to signal a new thematic block.
* **Surface Hierarchy & Nesting:** Treat the UI as physical layers. An informative card (`surface-container-lowest`) should sit atop a section background (`surface-container-low`) to create a soft, natural lift without requiring a shadow.
* **Signature Textures:** For main CTAs or hero backgrounds, use subtle linear gradients transitioning from `primary` to `primary-container`. This adds a "soul" to the color that flat hex codes cannot achieve.
* **The Glass Rule:** For floating navigation or mobile menus, use `surface` tokens at 85% opacity with a `20px` backdrop-blur to allow the background textures to bleed through, softening the interface.

---

## 3. Typography

The typography strategy pairs the adventurous, structured nature of **Plus Jakarta Sans** (Display/Headlines) with the clean, approachable legibility of **Work Sans** (Body/Labels).

* **Display-LG (3.5rem / Plus Jakarta Sans):** Editorial-scale headers. Use for hero statements with tight tracking (-2%) to feel modern and "thick."
* **Headline-MD (1.75rem / Plus Jakarta Sans):** Section headers. Always use `on_primary_fixed_variant` or `primary` to maintain the "forest" identity.
* **Body-LG (1rem / Work Sans):** The workhorse for storytelling. Use a generous line-height (1.6) to ensure readability for families planning their summer.
* **Label-MD (0.75rem / Work Sans):** Caps-locked with slight letter spacing for utility items (e.g., "DATE & RATES").

---

## 4. Elevation & Depth

We move beyond Material Design's standard shadows, opting for **Tonal Layering** to create a more organic, high-end feel.

* **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-highest` element on a `surface` background provides all the visual affordance needed for a high-priority card.
* **Ambient Shadows:** If a "floating" effect is necessary (e.g., a "Watch Video" button), shadows must be extra-diffused. Use the `on-surface` color at 6% opacity with a blur of `24px` and a Y-offset of `8px`. Avoid pure black shadows.
* **The "Ghost Border" Fallback:** If accessibility requires a container edge, use the `outline-variant` token at **15% opacity**. This creates a "suggestion" of a border rather than a hard cage.
* **Glassmorphism:** To integrate UI with the stunning photography of the camp, floating headers should utilize a semi-transparent `surface` color with a backdrop-blur. This makes the UI feel like an overlay on nature, not a barrier to it.

---

## 5. Components

### Buttons
* **Primary:** Solid `secondary_container` (Golden Sun) with `on_secondary_container` text. Roundedness: `full`. Padding: `12px 24px`.
* **Secondary:** `primary` (Forest Green) with an arrow icon. Roundedness: `md` (`0.375rem`).
* **Ghost:** No background, `primary` text, `outline-variant` (20% opacity) border.

### Adventure Cards
* **Constraint:** No divider lines. Separate content using the `spacing-6` (1.5rem) scale.
* **Visual:** Incorporate "nature-themed" backgrounds (subtle topographical line patterns) at 5% opacity within `surface-container-lowest` cards.

### Navigation & Chips
* **Filter Chips:** Use `surface-container-high` for unselected and `primary` for selected. Roundedness: `full`.
* **The Navigation Bar:** A centered, floating pill using glassmorphism. Avoid the traditional "full-width header" to emphasize the "Modern Naturalist" editorial feel.

### Input Fields
* **Styling:** Soft `surface-container-highest` backgrounds rather than white boxes.
* **States:** On focus, the `outline` should transition to `primary` with a 2px width—never use a default blue focus ring.

---

## 6. Do’s and Don’ts

### Do
* **Do** use asymmetrical image layouts where images bleed off the edge of the screen or overlap section boundaries.
* **Do** leverage the spacing scale `24` (6rem) for major section breathing room.
* **Do** use the "Golden Yellow" (`secondary_container`) sparingly to draw the eye to critical conversion points like "Enroll Now."

### Don’t
* **Don’t** use 1px solid black or high-contrast borders. It breaks the organic feel of the brand.
* **Don’t** use standard drop shadows. If a shadow doesn't look like natural ambient light, remove it.
* **Don’t** crowd the text. If a section feels "busy," increase the vertical spacing using the `20` or `24` spacing tokens.
* **Don’t** use pure `#000000` for text. Always use `on_surface` (`#0e2000`) for a softer, more natural high-contrast look.
