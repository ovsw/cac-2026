# 0001. Shared Brand Theme

## Status

Accepted

## Context

The Canadian Adventure Camp website needs to adopt the visual direction of the
legacy public site: forest green identity surfaces, cream/light chrome, yellow
standard calls to action, red enrollment urgency, and dark charcoal text.

The repo has a shared `@workspace/ui` package that already owns global CSS
tokens and shared button variants. The website also has an existing CMS-driven
Navbar and an existing header theme toggle. The client has been promised that
dark mode will be explored, but the current legacy reference is primarily a
light visual system.

## Decision

The Brand Palette belongs in `@workspace/ui` as the shared source of truth, not
as an `apps/web`-only override.

The UI package should define named CAC brand color primitives and map existing
semantic tokens to them. Forest green is the primary brand color. Yellow is the
standard CTA color. Red is reserved for enrollment urgency.

The existing default button variant represents the standard CTA and should use
yellow. Enrollment gets its own reusable button variant and remains separate
from destructive UI semantics. `destructive` continues to mean
delete/remove/danger; `enrollment` means a positive enrollment action with
urgency styling.

The first rollout is light-first. It updates shared visual foundations,
site-wide navigation presentation, and call-to-action presentation. The current
Navbar layout remains intact; only its color roles should be adjusted.

Dark mode remains follow-up work. The current Theme Toggle may stay visible if
the dark presentation remains functional after the Brand Palette update. If the
token update makes dark mode misleading or broken, the toggle can be hidden
temporarily while preserving the documented dark-mode exploration.

## Consequences

- Future shared UI consumers inherit the CAC Brand Theme from one source of
  truth.
- Exact screenshot sampling is rejected; tuned values should preserve the
  legacy color roles while meeting accessibility needs.
- Editors and developers can distinguish standard CTAs, enrollment CTAs, and
  destructive actions by intent instead of by color alone.
- A later dark-mode pass must make explicit brand decisions rather than relying
  on an accidental inversion of the light palette.
