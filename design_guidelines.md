{
  "brand": {
    "name": "ARVA Studios",
    "tagline": "We build the digital system behind your business.",
    "voice": {
      "attributes": ["confident", "blunt", "editorial", "premium", "technology-driven"],
      "writing_rules": [
        "Short sentences. Strong verbs.",
        "No corporate filler. No hype.",
        "Use numerals for emphasis (07, 04, 01).",
        "Use section eyebrows as the primary navigation cue (e.g., '03 / CONTENT & VIDEO')."
      ]
    }
  },
  "information_architecture": {
    "pages": {
      "home": {
        "type": "single-page",
        "sections_in_order": [
          "00_splash",
          "01_hero",
          "02_about_manifesto_light",
          "03_four_pillars_dark",
          "04_detail_content_video_dark",
          "05_detail_web_products_dark",
          "06_detail_automation_ai_dark",
          "07_detail_brand_design_dark",
          "08_process_light",
          "09_comparison_split_dark_light",
          "10_final_cta_form_dark",
          "11_footer_dark"
        ]
      },
      "privacy": {"route": "/privacy", "type": "simple editorial page"},
      "not_found": {"route": "*", "type": "branded 404"}
    },
    "section_rhythm_rule": "Follow the exact rhythm: splash dark → hero dark → about light/cream → four-pillars dark → 4 detail sections dark → process light/cream → comparison split dark/light → final CTA + form dark → footer dark."
  },
  "design_tokens": {
    "breakpoints_px": {"xs": 360, "sm": 640, "md": 768, "lg": 1024, "xl": 1280, "2xl": 1536},
    "spacing_4px_scale": {
      "0": "0px",
      "1": "4px",
      "2": "8px",
      "3": "12px",
      "4": "16px",
      "5": "20px",
      "6": "24px",
      "8": "32px",
      "10": "40px",
      "12": "48px",
      "14": "56px",
      "16": "64px",
      "20": "80px",
      "24": "96px",
      "28": "112px",
      "32": "128px"
    },
    "radius": {
      "pill": "9999px",
      "soft": "12px",
      "ui": "8px",
      "tight": "6px"
    },
    "shadows": {
      "none": "none (prefer borders over shadows)",
      "hairline": "0 1px 0 rgba(255,255,255,0.06)",
      "header": "0 10px 30px rgba(0,0,0,0.35)"
    },
    "borders": {
      "hairline_dark": "1px solid rgba(255,255,255,0.10)",
      "hairline_light": "1px solid rgba(10,10,10,0.12)",
      "focus_ring": "0 0 0 3px rgba(212,175,55,0.35)"
    },
    "color_system": {
      "rule": "ONE accent only: gold #D4AF37 with muted #C9A227. Use sparingly for eyebrows, section numbers, thin rules, price figures, hover underlines, focus rings. Never as large fills.",
      "dark": {
        "canvas": "#0A0A0A",
        "surface_1": "#111111",
        "surface_2": "#151515",
        "border": "rgba(255,255,255,0.10)",
        "border_strong": "rgba(255,255,255,0.16)",
        "text": "#F4F4F5",
        "text_muted": "#B6B6B8",
        "text_subtle": "#8B8B8F",
        "text_disabled": "rgba(244,244,245,0.35)",
        "icon_muted": "rgba(244,244,245,0.70)",
        "accent": "#D4AF37",
        "accent_muted": "#C9A227",
        "success": "#2FBF71",
        "danger": "#E5484D",
        "warning": "#F5A524",
        "info": "#4DA3FF"
      },
      "cream": {
        "canvas": "#F6F1E6",
        "surface_1": "#FFFFFF",
        "surface_2": "#FBF7EF",
        "border": "rgba(10,10,10,0.12)",
        "border_strong": "rgba(10,10,10,0.18)",
        "text": "#0A0A0A",
        "text_muted": "#2B2B2B",
        "text_subtle": "#4A4A4A",
        "text_disabled": "rgba(10,10,10,0.35)",
        "accent": "#D4AF37",
        "accent_muted": "#C9A227",
        "success": "#167D3E",
        "danger": "#B42318"
      },
      "contrast_notes": [
        "Avoid pure white (#FFF) on #0A0A0A for large paragraphs; use #F4F4F5 for primary and #B6B6B8 for secondary.",
        "Gold is for emphasis only; do not set long body copy in gold.",
        "On cream sections, keep body text near-black (#0A0A0A) and use muted grays sparingly."
      ]
    },
    "css_custom_properties": {
      "where": "/app/frontend/src/index.css (extend :root + add .theme-cream wrapper tokens)",
      "tokens": {
        "--arva-bg": "#0A0A0A",
        "--arva-surface": "#111111",
        "--arva-surface-2": "#151515",
        "--arva-border": "rgba(255,255,255,0.10)",
        "--arva-border-strong": "rgba(255,255,255,0.16)",
        "--arva-text": "#F4F4F5",
        "--arva-text-muted": "#B6B6B8",
        "--arva-text-subtle": "#8B8B8F",
        "--arva-gold": "#D4AF37",
        "--arva-gold-muted": "#C9A227",
        "--arva-focus": "rgba(212,175,55,0.35)",
        "--radius-pill": "9999px",
        "--radius-ui": "8px",
        "--radius-tight": "6px",
        "--space-1": "4px",
        "--space-2": "8px",
        "--space-3": "12px",
        "--space-4": "16px",
        "--space-6": "24px",
        "--space-8": "32px",
        "--space-12": "48px",
        "--space-16": "64px",
        "--ease-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "--ease-in": "cubic-bezier(0.7, 0, 0.84, 0)",
        "--dur-1": "120ms",
        "--dur-2": "180ms",
        "--dur-3": "260ms"
      }
    }
  },
  "typography": {
    "fonts": {
      "display": {"family": "Anton", "weights": [400], "usage": "All H1/H2 + big numerals"},
      "body": {"family": "Inter", "weights": [300, 400, 500], "usage": "Body, UI, tables, forms"}
    },
    "tailwind_font_tokens": {
      "font-display": "Anton, ui-sans-serif, system-ui",
      "font-body": "Inter, ui-sans-serif, system-ui"
    },
    "type_scale": {
      "h1": {
        "class": "font-display uppercase tracking-[-0.02em] leading-[0.92]",
        "size": "text-[clamp(2.6rem,8.5vw,4.8rem)] sm:text-[clamp(3.2rem,7vw,5.6rem)] lg:text-[clamp(4.2rem,5.2vw,6.6rem)]",
        "notes": "Must never overflow at 360px. Prefer manual line breaks with <br/> for control."
      },
      "h2_section": {
        "class": "font-display uppercase tracking-[-0.01em] leading-[0.95]",
        "size": "text-[clamp(2.0rem,6.8vw,3.4rem)]"
      },
      "eyebrow": {
        "class": "font-body text-xs tracking-[0.28em] uppercase",
        "color": "text-[color:var(--arva-gold)]"
      },
      "body": {
        "class": "font-body",
        "size": "text-sm sm:text-base",
        "leading": "leading-relaxed",
        "color_dark": "text-[color:var(--arva-text-muted)]",
        "color_cream": "text-[color:var(--cream-text-muted)]"
      },
      "small": {"class": "font-body text-xs", "leading": "leading-snug"}
    },
    "numeral_motif": {
      "big_section_number": {
        "class": "font-display text-[clamp(4.5rem,18vw,10rem)] leading-none text-transparent",
        "stroke": "[-webkit-text-stroke:1px_rgba(212,175,55,0.35)]",
        "notes": "Use as absolutely-positioned decorative numeral behind headings. Keep opacity low; never reduce readability."
      },
      "eyebrow_numbered": {
        "format": "03 / CONTENT & VIDEO",
        "class": "font-body text-xs tracking-[0.28em] uppercase text-[color:var(--arva-gold)]"
      }
    }
  },
  "layout": {
    "grid": {
      "container": "mx-auto w-full max-w-[1120px] px-4 sm:px-6 lg:px-8",
      "mobile_primary_target": "360px",
      "section_padding": "py-16 sm:py-20 lg:py-24",
      "section_dividers": "Use 1px hairline rules between major blocks; gold only for short headline underline rules."
    },
    "rhythm_anti_monotony": [
      "Alternate density: every 2–3 sections introduce a different layout pattern (grid → split → table → list).",
      "Use big numerals as anchors so the long scroll feels structured.",
      "Use one 'quiet' cream section after long dark runs (About, Process)."
    ],
    "sticky_header": {
      "structure": "Left: square logo tile only. Right: Early Access pill + Book a Call button. No nav links. No hamburger.",
      "shrink_behavior": "On scroll > 12px: reduce height/padding, add subtle border + shadow.",
      "classes": {
        "base": "sticky top-0 z-50 bg-[color:var(--arva-bg)]/92 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--arva-bg)]/72",
        "rest": "h-16 px-4 sm:px-6",
        "shrink": "h-12 px-4 sm:px-6 border-b border-[color:var(--arva-border)] shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
      }
    }
  },
  "components": {
    "component_path": {
      "note": "Repo currently has no /src/components/ui. If shadcn is added later, map these to shadcn equivalents. For now, implement as lightweight local components in /app/frontend/src/components/*.jsx (per project constraint: .js files).",
      "preferred_shadcn_equivalents": {
        "button": "src/components/ui/button",
        "input": "src/components/ui/input",
        "textarea": "src/components/ui/textarea",
        "select": "src/components/ui/select",
        "table": "src/components/ui/table",
        "badge": "src/components/ui/badge",
        "separator": "src/components/ui/separator",
        "tabs": "src/components/ui/tabs",
        "accordion": "src/components/ui/accordion"
      }
    },
    "buttons": {
      "primary_cta_dark": {
        "label_pattern": "Text + trailing arrow (→)",
        "shape": "pill",
        "base_classes": "inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-5 py-3 text-sm font-medium font-body",
        "hover": "hover:bg-[#F4F4F5]",
        "focus": "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--arva-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--arva-bg)]",
        "active": "active:scale-[0.99]",
        "disabled": "disabled:opacity-50 disabled:cursor-not-allowed",
        "transition_rule": "transition-colors duration-200 (never transition: all)"
      },
      "secondary_hero": {
        "style": "outlined pill on dark",
        "base_classes": "inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--arva-border-strong)] bg-transparent text-[color:var(--arva-text)] px-5 py-3 text-sm font-medium",
        "hover": "hover:border-[color:var(--arva-gold-muted)] hover:text-white",
        "focus": "focus-visible:ring-2 focus-visible:ring-[color:var(--arva-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--arva-bg)]",
        "active": "active:bg-white/5",
        "disabled": "disabled:opacity-40 disabled:cursor-not-allowed"
      },
      "utility_outline_header": {
        "shape": "6–8px radius",
        "base_classes": "inline-flex items-center rounded-lg border border-[color:var(--arva-border)] px-3 py-2 text-xs text-[color:var(--arva-text-muted)]",
        "hover": "hover:border-[color:var(--arva-gold-muted)] hover:text-[color:var(--arva-text)]"
      }
    },
    "pill_badges": {
      "early_access": {
        "classes": "inline-flex items-center rounded-full border border-[color:var(--arva-border)] px-3 py-1 text-xs font-body text-[color:var(--arva-text-muted)]",
        "accent_rule": "Do not fill with gold. Gold only for tiny dot or underline on hover."
      },
      "built_with": {
        "classes": "inline-flex items-center rounded-full border border-[color:var(--arva-border)] bg-white/0 px-3 py-1 text-xs text-[color:var(--arva-text-muted)]"
      }
    },
    "cards": {
      "pillar_card": {
        "classes": "group rounded-xl border border-[color:var(--arva-border)] bg-[color:var(--arva-surface)] p-5",
        "hover": "hover:border-[color:var(--arva-gold-muted)]",
        "title": "font-display uppercase tracking-[-0.01em] text-2xl text-[color:var(--arva-text)]",
        "meta": "text-xs tracking-[0.28em] uppercase text-[color:var(--arva-text-subtle)]",
        "link": "inline-flex items-center gap-2 text-sm text-[color:var(--arva-text)] underline-offset-4 decoration-[color:var(--arva-gold)] group-hover:underline"
      },
      "stat_callout": {
        "cream": "rounded-xl border border-[color:var(--cream-border)] bg-white p-5",
        "number": "font-display text-4xl leading-none",
        "label": "text-xs tracking-[0.28em] uppercase text-[color:var(--cream-text-subtle)]"
      }
    },
    "tables_pricing": {
      "web_products": {
        "md_up": {
          "structure": "Real <table> from md and up. Use sticky first column only if it stays performant.",
          "table_classes": "w-full border-separate border-spacing-0 rounded-xl overflow-hidden border border-[color:var(--arva-border)]",
          "th": "text-left text-xs tracking-[0.28em] uppercase text-[color:var(--arva-text-subtle)] bg-[color:var(--arva-surface)] px-4 py-3",
          "td": "px-4 py-4 text-sm text-[color:var(--arva-text-muted)] border-t border-[color:var(--arva-border)]",
          "price": "font-body font-medium text-[color:var(--arva-gold)]",
          "row_hover": "hover:bg-white/3"
        },
        "below_md": {
          "pattern": "Stacked price cards (each row becomes a card).",
          "card": "rounded-xl border border-[color:var(--arva-border)] bg-[color:var(--arva-surface)] p-5",
          "price": "text-[color:var(--arva-gold)] font-medium"
        }
      }
    },
    "forms": {
      "lead_capture_dark": {
        "field_base": "w-full rounded-lg border border-[color:var(--arva-border)] bg-transparent px-4 py-3 text-sm text-[color:var(--arva-text)] placeholder:text-[color:var(--arva-text-subtle)]",
        "hover": "hover:border-[color:var(--arva-border-strong)]",
        "focus": "focus:outline-none focus:ring-2 focus:ring-[color:var(--arva-gold)] focus:ring-offset-2 focus:ring-offset-[color:var(--arva-bg)]",
        "error": "border-[#E5484D] focus:ring-[#E5484D]",
        "success": "border-[#2FBF71] focus:ring-[#2FBF71]",
        "help_text": "mt-2 text-xs text-[color:var(--arva-text-subtle)]",
        "error_text": "mt-2 text-xs text-[#E5484D]",
        "success_text": "mt-2 text-xs text-[#2FBF71]",
        "aria": "All inline status messages must be in an aria-live region (polite)."
      },
      "select": {
        "note": "Use native <select> for performance; style to match inputs. No heavy dropdown libs.",
        "classes": "appearance-none bg-transparent"
      }
    },
    "splash": {
      "duration_ms": "2500–3000 auto-dismiss",
      "skip_control": {
        "must": "Always visible, keyboard operable",
        "label": "Skip →",
        "placement": "top-right",
        "classes": "absolute top-4 right-4 rounded-full border border-[color:var(--arva-border)] px-3 py-2 text-xs text-[color:var(--arva-text-muted)] hover:border-[color:var(--arva-gold-muted)] hover:text-[color:var(--arva-text)] focus-visible:ring-2 focus-visible:ring-[color:var(--arva-gold)]"
      },
      "visual": "Logo tile centered + thin gold rule + one-line statement. No gradients. Optional subtle noise overlay (CSS) at 6–8% opacity."
    },
    "comparison_split": {
      "layout": "lg+: two columns. Left dark (Most Agencies). Right cream (ARVA). Below lg: stack dark first.",
      "divider": "At lg: 1px vertical rule; at mobile: 1px horizontal rule.",
      "list_style": "Use short bullets with strong verbs. Use gold only for the column label underline."
    },
    "footer": {
      "layout": "3 labeled link columns + socials + /privacy link",
      "link": "text-sm text-[color:var(--arva-text-muted)] hover:text-[color:var(--arva-text)] hover:underline decoration-[color:var(--arva-gold)] underline-offset-4"
    }
  },
  "motion": {
    "principles": [
      "Performance wins over visual ambition.",
      "Use IntersectionObserver reveals: opacity + translateY only.",
      "Stagger siblings by 60–90ms.",
      "No WebGL/3D. No heavy animation runtime."
    ],
    "reveal_classes": {
      "initial": "opacity-0 translate-y-3",
      "entered": "opacity-100 translate-y-0",
      "transition": "transition-[opacity] duration-300 ease-out will-change-[opacity]",
      "note": "Do not transition transforms globally; if using translate, add transition-transform only on the revealed element."
    },
    "prefers_reduced_motion": {
      "rule": "If prefers-reduced-motion: reduce, disable reveals (render entered state), shorten splash to 0–300ms, disable smooth scroll.",
      "implementation": "Gate animations behind a usePrefersReducedMotion() hook."
    },
    "smooth_scroll_offset": {
      "rule": "Smooth-scroll to anchors must account for sticky header height.",
      "implementation": "Use scroll-margin-top on section anchors: scroll-mt-20 (rest) and scroll-mt-16 (shrink)."
    }
  },
  "accessibility": {
    "requirements": [
      "WCAG AA contrast for all text.",
      "Visible focus ring (gold) on every interactive element.",
      "Keyboard operable splash skip.",
      "Form errors announced via aria-live.",
      "Use semantic headings and lists; pricing uses real <table> at md+."
    ],
    "focus_style": "ring-2 ring-[color:var(--arva-gold)] ring-offset-2 ring-offset-[color:var(--arva-bg)]",
    "disabled_style": "Must look clearly disabled: reduced opacity + cursor-not-allowed + no hover underline."
  },
  "performance": {
    "targets": ["Lighthouse 90+ mobile all categories", "Fast on cheap Android over 4G"],
    "rules": [
      "Lazy-load below-fold sections (React.lazy or conditional render after first paint).",
      "Use <img loading='lazy'> for any non-hero images (logo is local and tiny).",
      "Avoid heavy libraries; IntersectionObserver is enough.",
      "Prefer CSS borders over shadows; avoid backdrop-blur except header (small area)."
    ]
  },
  "image_urls": {
    "logo": [
      {
        "category": "brand",
        "description": "Client-provided square logo tile (white tile with black lockup).",
        "url": "/brand/arva-logo-tile.png",
        "usage": "Header + splash + footer"
      }
    ],
    "abstract_visuals": [
      {
        "category": "decorative",
        "description": "No fabricated client work. Use only abstract tech textures if needed; prefer CSS noise + rules over images for performance.",
        "url": "(avoid external images; generate CSS noise overlay)",
        "usage": "Optional: hero/splash background overlay at <= 8% opacity"
      }
    ]
  },
  "data_testid_convention": {
    "rule": "All interactive and key informational elements MUST include data-testid in kebab-case describing role.",
    "examples": [
      "data-testid='splash-skip-button'",
      "data-testid='header-book-call-button'",
      "data-testid='hero-primary-cta-button'",
      "data-testid='hero-secondary-cta-button'",
      "data-testid='pillars-explore-content-video-link'",
      "data-testid='web-products-pricing-table'",
      "data-testid='lead-form-submit-button'",
      "data-testid='lead-form-error-message'",
      "data-testid='lead-form-success-message'"
    ]
  },
  "instructions_to_main_agent": [
    "Do not change the client-provided palette, typography, header structure, or section order.",
    "Implement in .js files (not .tsx) per constraint; keep components small and tree-shakeable.",
    "Extend /app/frontend/src/index.css with CSS variables for dark + cream themes; use a .theme-cream wrapper to swap tokens for cream sections.",
    "Build the page as 12 sections with IDs for anchor scrolling; add scroll-margin-top to each section.",
    "Use IntersectionObserver for reveal-on-scroll; respect prefers-reduced-motion.",
    "Pricing: md+ real <table>; below md stacked cards.",
    "Forms: native inputs/selects for performance; full validation states; aria-live for status; gold focus ring.",
    "No WebGL/3D, no heavy animation libs."
  ],
  "general_ui_ux_design_guidelines": "<General UI UX Design Guidelines>  \n    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms\n    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text\n   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json\n\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. \n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.\n</General UI UX Design Guidelines>"
}
