# graphyte-assets

Custom CSS and JS for the Graphyte Design site (Relume Publish), served via jsDelivr.

| File | Purpose |
|---|---|
| `graphyte.css` | Page canvas colour, full-height centred hero, lattice host styles |
| `lattice.js` | Hex-lattice engine — exposes `window.GraphyteLattice(host, cfg)` |
| `graphyte.js` | Site config; calls the engine |

Load order matters: `lattice.js` before `graphyte.js`. Both use `defer`, which
preserves document order.

URLs are pinned to a commit SHA, so they are immutable and cached hard by
jsDelivr. **Pushing new commits will not change the live site** — repoint the
tags at the new SHA when you want to ship a change.
