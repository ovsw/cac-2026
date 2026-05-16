# Canadian Adventure Camp Website

This context covers the shared content model and editorial language for the
Canadian Adventure Camp website and its Sanity-backed content operations.
It exists to keep the frontend and Studio aligned on one domain vocabulary.

## Language

**Page**:
A navigable unit of website content with its own route and editorial content.
_Avoid_: Document, content entry

**Parent Page**:
A **Page** whose slug path places other pages beneath it in the site
structure.
_Avoid_: Route parent, folder, explicit parent record

**Child Page**:
A **Page** whose slug path places it beneath another page in the site
structure.
_Avoid_: Nested route, explicit child record

**Home Page**:
The singleton landing page for the Canadian Adventure Camp Website.
_Avoid_: Landing page, page

**Redirect**:
A rule that sends visitors from one website URL to another.
_Avoid_: Route hack, forwarding logic

**Slug**:
The editable URL segment that identifies a page or other routed content item.
_Avoid_: Path fragment, route string

**Blog Index**:
The landing content item that organizes and presents the website's
**Blog Posts**.
_Avoid_: Blog page, page

**Blog Post**:
An editorial article published on the website's blog.
_Avoid_: Page, article page

**FAQ**:
A reusable question-and-answer item that can be featured in website content.
_Avoid_: Help item, accordion item

**FAQ Section**:
A **Section** that displays one or more **FAQs** on a page.
_Avoid_: FAQ block, accordion

**Author**:
A person credited for one or more **Blog Posts**.
_Avoid_: User, editor

**Testimonial**:
A reusable statement from a camper, parent, or participant used to build trust
on the website.
_Avoid_: Quote, review snippet

**Testimonial Section**:
A **Section** that displays one or more **Testimonials** on a page.
_Avoid_: Quote block, testimonials block

**Link**:
A connection from one piece of website content to another destination.
_Avoid_: Button

**Navbar**:
The site-wide navigation content used across the website.
_Avoid_: Header section, page section

**Footer**:
The site-wide footer content used across the website.
_Avoid_: Footer section, page section

**Brand Theme**:
The Canadian Adventure Camp visual identity applied consistently across digital
interfaces.
_Avoid_: Web-only theme, page styling

**Brand Palette**:
The set of canonical colors used by the **Brand Theme**.
_Avoid_: Ad hoc colors, component palette

**Brand Color**:
A named canonical color in the **Brand Palette**.
_Avoid_: One-off color, anonymous swatch

**Primary Brand Color**:
The main **Brand Color** used to express Canadian Adventure Camp identity.
_Avoid_: Default CTA color, accent color

**Standard CTA Color**:
The **Brand Color** used for ordinary high-attention calls to action.
_Avoid_: Primary brand color, enrollment color

**Enrollment Urgency Color**:
The **Brand Color** reserved for enrollment-specific calls to action.
_Avoid_: Default CTA color, destructive color

**Enrollment CTA**:
A call to action that asks visitors to begin or continue camp enrollment.
_Avoid_: Destructive action, generic CTA

**Destructive Action**:
A user action that removes, deletes, or otherwise damages data or state.
_Avoid_: Enrollment CTA, urgent CTA

**Brand Color Role**:
A recognizable use of color in the **Brand Theme**, independent of the exact
technical color value used to render it.
_Avoid_: Hex color, hard-coded color

**Light Brand Theme**:
The first supported presentation of the **Brand Theme**, matching the current
Canadian Adventure Camp visual direction.
_Avoid_: Complete brand theme

**Dark Mode Exploration**:
A promised follow-up evaluation of how the **Brand Theme** should translate to
dark surfaces.
_Avoid_: Finished dark theme, removed dark mode

**Theme Toggle**:
The header control that lets visitors switch between light and dark
presentations of the website.
_Avoid_: Dark mode promise, brand theme

**Brand Theme Rollout**:
The staged application of the **Brand Theme** to shared website surfaces.
_Avoid_: Full redesign, one-off restyle

**Page Builder**:
The content area where editors add, order, and manage **Blocks** for a
**Page** or other page-builder-driven content item.
_Avoid_: Block list, layout field

**Section**:
A visible content unit within a **Page** or the **Home Page**.
_Avoid_: Component

**Block**:
A page-builder content unit in Sanity that editors use to define some
**Sections**.
_Avoid_: Section, component

**Section Component**:
A frontend component that renders a **Section** on the website.
_Avoid_: Block

**Static Section**:
A **Section** whose content comes from fixed schema fields rather than a
page-builder **Block**.
_Avoid_: Hardcoded block

**Reusable Section**:
A shared content item whose page-builder content is maintained in one place and
reused across multiple pages.
_Avoid_: Duplicated section, copied section

**Draft**:
An unpublished change to website content prepared for later review or
publication.
_Avoid_: Content version

**Scheduled Drafts**:
A publishing workflow that schedules one or more drafts to go live at a
specific date and time without using a **Content Release**.
_Avoid_: Release

**Published**:
The live state of website content after it has been made visible on the
website.
_Avoid_: Draft

**Content Release**:
A coordinated publication bundle that can publish multiple drafts across the
dataset manually or at a scheduled date and time.
_Avoid_: Version, campaign

**Camp Season**:
A named phase in the camp's yearly operating and marketing cycle that drives
website messaging priorities and editorial planning.
_Avoid_: Quarter, website state, page state

### Camp Seasons

**Summer Season**:
The main camp season when the website supports active camp operations.

**Fall Follow-up Season**:
The September to December season focused on marketing, user-generated content,
testimonials, and early signups.

**Recruitment Season**:
The January to March season focused on staffing for the upcoming camp season.

**Spring Push Season**:
The April to May season focused on heavy marketing and sales before camp
begins.

## Relationships

- The **Home Page** is a singleton content item separate from ordinary
  **Pages**.
- A **Parent Page** and **Child Page** are determined by slug path structure,
  not by an explicit page-to-page reference field.
- A **Slug** identifies a page or other routed content item within the website
  structure.
- A **Redirect** sends visitors from one website URL to another.
- The **Navbar** and **Footer** are site-wide content items separate from any
  individual **Page**.
- The **Brand Palette** belongs to the **Brand Theme** and applies consistently
  across digital interfaces, not only to one website surface.
- The **Brand Palette** contains named **Brand Colors** used through
  **Brand Color Roles**.
- Forest green is the **Primary Brand Color**.
- Yellow is the **Standard CTA Color**.
- Red is the **Enrollment Urgency Color**.
- An **Enrollment CTA** uses the **Enrollment Urgency Color** and should be
  reusable across shared website surfaces.
- An **Enrollment CTA** is not a **Destructive Action**, even though both may
  use red visual cues.
- A **Brand Color Role** should preserve recognizable Canadian Adventure Camp
  color usage while allowing color values to be tuned for accessibility.
- The **Brand Palette** should use tuned color values inspired by the legacy
  website, not exact samples from screenshots or compressed media.
- The **Light Brand Theme** is the first implementation target.
- **Dark Mode Exploration** remains promised follow-up work, not a rejected
  feature.
- The **Theme Toggle** can remain visible during the light-theme rollout if the
  dark presentation remains functional after the **Brand Palette** update.
- The first **Brand Theme Rollout** focuses on shared visual foundations,
  site-wide navigation, and call-to-action presentation.
- The first **Brand Theme Rollout** preserves the current **Navbar** layout
  while applying **Brand Color Roles** to its presentation.
- The **Blog Index** organizes and presents **Blog Posts**.
- An **Author** can be credited on one or more **Blog Posts**.
- An **FAQ** is a reusable content item that can be displayed in an
  **FAQ Section**.
- A **Testimonial** is a reusable content item that can be displayed in a
  **Testimonial Section**.
- A **Page Builder** contains the **Blocks** used to define **Sections**.
- A **Section** is a visible part of a **Page** or the **Home Page**.
- A **Block** defines exactly one **Section**.
- A **Static Section** is a **Section** that does not come from a **Block**.
- A **Section Component** renders a **Section** on the website.
- A **Reusable Section** is a separate shared content item that can be
  referenced by multiple pages.
- A **Reusable Section** has its own **Page Builder**, and its internal
  composition model matches the **Page Builder** used on a **Page**.
- A **Reusable Section** cannot contain a reference to another
  **Reusable Section**.
- A **Draft** is unpublished content prepared for later publication.
- **Published** describes content that is live on the website.
- **Scheduled Drafts** can publish drafts at a chosen time without creating a
  **Content Release**.
- A **Content Release** can publish drafts from multiple content items across
  the dataset.
- A **Camp Season** shapes editorial planning and may drive coordinated content
  updates, but it is not tracked as state on the website or on individual
  pages.
- **Summer Season**, **Fall Follow-up Season**, **Recruitment Season**, and
  **Spring Push Season** are the four canonical **Camp Seasons**.

## Example Dialogue

> **Dev:** "For **Spring Push Season**, should we duplicate the **Home Page**
> and copy the CTA into every relevant **Page**?"
> **Domain expert:** "No. Keep the **Home Page** as a singleton. Prepare a
> **Draft** of the **Home Page**, update the shared CTA as a **Reusable
> Section** in its own **Page Builder**, and decide on the publishing workflow
> based on scope."
>
> **Dev:** "When do we use **Scheduled Drafts** versus a **Content Release**?"
> **Domain expert:** "Use **Scheduled Drafts** for a small timed change to one
> or a few content items. Use a **Content Release** when multiple drafts across
> the dataset need to go live together."
>
> **Dev:** "Does entering **Spring Push Season** mean every **Page** is now in
> that season?"
> **Domain expert:** "No. **Camp Season** is an editorial planning concept, not
> a website state. Some pages may stay evergreen, and some may be updated
> later."

## Flagged Ambiguities

- `web` and `studio` were considered as separate contexts; resolved: they are
  technical surfaces inside one shared domain context.
- `CAC Website` was considered as the context name; resolved: use
  **Canadian Adventure Camp Website** as the canonical product name.
- `Document` and `Content Entry` were considered as the primary content unit;
  resolved: use **Page** for the core website unit.
- `Home Page` was considered a special case of **Page**; resolved: treat
  **Home Page** as a separate singleton concept.
- `Content Version` was considered for editorial changes; resolved: use
  **Draft** for unpublished content changes.
- `Release` was clarified as a coordinated publication unit spanning multiple
  drafts across the dataset.
- `Camp Season` was introduced as a business concept that can drive coordinated
  website updates.
- Seasonal naming was resolved to four canonical **Camp Seasons**:
  **Summer Season**, **Fall Follow-up Season**, **Recruitment Season**, and
  **Spring Push Season**.
- `Camp Season` was considered as possible website-level or page-level state;
  resolved: it is an editorial planning concept only and is not tracked as a
  formal state on the website or on individual pages.
- `Seasonal Content` was considered as a possible formal domain term;
  resolved: keep it informal shorthand for content editors choose to update for
  a **Camp Season**.
- `Blog Post`, `FAQ`, and `Author` were considered as possible kinds of
  **Page**; resolved: they are separate domain concepts.
- `Section`, `Block`, and `Component` were overlapping terms; resolved: use
  **Section** for the domain concept, **Block** for the Sanity page-builder
  unit, and **Section Component** for the frontend renderer.
- `Static Section` was introduced as a formal term for sections powered by
  fixed schema fields rather than page-builder blocks.
- The relationship between **Block** and **Section** was clarified: each
  **Block** defines exactly one **Section**.
- `Reusable Section` was introduced as a formal term and distinguished from
  copied or duplicated sections, which create separate editable instances.
- The nature of **Reusable Section** was clarified: it is a separate shared
  content item referenced by pages, not a page-local section instance.
- The internal composition of **Reusable Section** was clarified: it uses the
  same page-builder schema and terminology as a **Page**.
- Nested **Reusable Sections** were rejected: a **Reusable Section** cannot
  reference another **Reusable Section** from its own **Page Builder**.
- `Reusable Section` was kept as the canonical term over alternatives such as
  `Shared Section`.
- `Navbar` and `Footer` were considered as possible page-local sections;
  resolved: they are separate site-wide domain concepts.
- `Settings` was considered as a possible domain term; resolved: keep it out of
  the glossary as a technical container rather than a business concept.
- Nested page structure was considered as possible routing-only detail;
  resolved: use **Parent Page** and **Child Page** as formal editorial terms.
- `Parent Page` and `Child Page` were clarified to match repo reality: they are
  path-based editorial terms derived from nested slugs, not explicit
  relationships stored on the page schema.
- Camp offerings such as programs or experiences were considered as possible
  domain concepts; resolved: keep them out for now unless they become
  first-class managed content entities.
- The legacy Canadian Adventure Camp header structure was considered for the
  first **Brand Theme Rollout**; resolved: preserve the current **Navbar**
  layout and apply **Brand Color Roles** to it.
- `Redirect` was treated as formal editorial language because stakeholders are
  likely to request redirects directly.
- `Slug` was added as a formal term because editors talk about and edit it
  directly.
- `Blog Index` was added as a formal concept separate from an ordinary
  **Page**.
- `FAQ` was clarified as the individual question-and-answer item, while
  **FAQ Section** names the page section that displays one or more FAQs.
- `Button` was kept out of the glossary for now; use **Link** as the broader
  domain term instead of a presentational label.
- `Link` was kept as the only formal link term; internal versus external link
  types remain implementation detail unless editorial language requires them.
- `Testimonial` was added as a formal reusable content concept rather than
  treating it as ordinary page copy.
- `Testimonial Section` was formalized as the page section that displays one or
  more **Testimonials**.
- `Campaign` was kept out of the glossary to avoid overlap with
  **Camp Season** and **Content Release**.
- `Scheduled Drafts` was formalized as a distinct publishing workflow from
  **Content Release**.
- `Published` was added as a formal editorial term because it is part of the
  vocabulary used to educate editors.
- A draft inside a **Content Release** remains a **Draft**; no separate term
  was introduced for release-assigned drafts.
- **Content Release** was kept as the canonical term, with `Release` only as
  acceptable shorthand in conversation.
- `Page Builder` was formalized as the editor-facing container where **Blocks**
  are added, ordered, and managed.
- `URL` was kept out of the glossary because **Slug** and **Redirect** cover
  the meaningful editor-facing distinctions.
