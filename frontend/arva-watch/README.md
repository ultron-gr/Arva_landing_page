# Join the Movement — Huly-style watch CTA (Vite + React)

Everything is CSS + SVG: dotted dial, two "comet" arcs that sweep like a
stopwatch (burst → crawl → reset) with a light-drag streak and a glowing tip,
real-time hands, lit straps, and the two pill buttons.

```bash
npm install
npm run dev
```

Requires a browser with CSS `@property` (Chrome/Edge 85+, Safari 16.4+, Firefox 128+).

## Files

| File | What it does |
| --- | --- |
| `src/components/JoinMovement.jsx/.css` | Section layout, heading, copy, buttons |
| `src/components/Watch.jsx/.css` | Watch: straps, case, dotted face, dial, comets, hands |

## Comets

Each comet is one config object (see `HULY_COMETS` in `Watch.jsx`):

```js
{
  tone: 'blue',                                            // class suffix
  colors: { base: '#3d6dff', hot: '#c6d8ff', deep: '#2038e6' },
  diameter: 75,     // ring size, % of the face
  anchor: 348,      // deg – the arc is always drawn from here to the head
  from: 378,        // deg – head start
  to: 500,          // deg – head end (to > from = grows clockwise, to < from = shrinks back)
  period: 4.6,      // seconds per cycle
  delay: 0,         // phase offset; negative = already mid-cycle
}
```

The head moves `from → to` with a hard ease-out (fast first ~10%, then slow),
`--bloom` peaks during the burst and drives the streak length, glow strength and tip size.

### Different palette (e.g. gold + white)

```jsx
const MY_COMETS = [
  { tone: 'gold',  colors: { base: '#e6b422', hot: '#fff1b8', deep: '#b8860b' },
    diameter: 69, anchor: 198, from: 352, to: 318, period: 6.4, delay: -1.6 },
  { tone: 'white', colors: { base: '#e8e9ee', hot: '#ffffff', deep: '#8f929c' },
    diameter: 75, anchor: 348, from: 378, to: 500, period: 4.6, delay: 0 },
]
<Watch comets={MY_COMETS} />
```

The straps take their colour from the comets automatically (first comet = upper-left strap).

## Logo

```jsx
<Watch logo={<img src="/your-mark.svg" alt="" />} />
```
