# Unit Spec Files

Per-unit implementation specs. **Preferred template:** `../feature-implementation-prompt-template.md` (18 sections, includes PR/code review/merge gate).

Legacy short template: `00-spec-template.md` (still valid for quick UI-only units).

## When to Use

Generate or copy a spec file **before implementing any build unit** — required by `feature-development-prompts.md` §2 Phase A4.

## Naming

```
docs/context/specs/NN-short-name.md   # MVP units
docs/context/specs/f-NN-short-name.md   # Post-MVP features
```

## Workflow

1. Copy `../feature-implementation-prompt-template.md` to `NN-short-name.md` (or use `00-spec-template.md` for quick UI-only work)
2. Fill all 18 sections from `build-plan.md` Unit NN + `feature-development-prompts.md` §4
3. Prompt the coding agent:

```
Read AGENTS.md, .cursorrules, docs/context/progress-tracker.md,
docs/context/feature-development-prompts.md Unit [NN] and §2–§2d,
and docs/context/specs/NN-short-name.md.
Implement exactly as specified. Follow merge gate before next feature.
```

4. After merge to `main`, mark unit complete in `progress-tracker.md`

## Index

| Spec                                                                 | Unit                         | Status            |
| -------------------------------------------------------------------- | ---------------------------- | ----------------- |
| [02-design-system.md](02-design-system.md)                           | 02 Design System + UI Tokens | Complete (merged) |
| [03-landing-page.md](03-landing-page.md)                             | 03 Landing Page UI (MVP)     | Complete (merged) |
| [03b-landing-marketing-refresh.md](03b-landing-marketing-refresh.md) | 03b Lovable mockup refresh   | Complete (merged) |
| [04-katex-mathquill.md](04-katex-mathquill.md)                       | 04 KaTeX + MathQuill         | Implemented       |
| [07-plausible-init.md](07-plausible-init.md)                         | 07 Plausible Analytics       | Ready             |
| [20-curriculum-explain-ui.md](20-curriculum-explain-ui.md)           | 20 Curriculum Explain UI     | Ready             |
| [21-progress-page.md](21-progress-page.md)                           | 21 Progress Page             | Ready             |
| [22-marking-appeals.md](22-marking-appeals.md)                       | 22 Marking Appeals           | Ready             |
| [23-profile-privacy.md](23-profile-privacy.md)                       | 23 Profile + Privacy         | Ready             |
| _(create when starting each remaining unit)_                         |                              |                   |
