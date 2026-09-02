/* ==========================================================================
   Graphyte — site config
   Tune these values in the lattice tuner, then paste them here.
   Requires lattice.js to have loaded first.

   NOTE: octaves is 1, so this draws a single lattice. That leaves ratio,
   rotate, strokeScale, detail and falloff inert — they only describe how
   octave N differs from octave N-1, and there is no octave 1. They are kept
   at their tuned values so raising `octaves` picks up where you left off.
   ========================================================================== */
(function () {
  "use strict";

  var CFG = {
    anchor:      ".container",  /* bloom centres on this element */
    cell:        10,            /* base hex radius, px — fine mesh */
    octaves:     1,             /* single lattice; see note above */
    ratio:       1.2,           /* inert while octaves === 1 */
    rotate:      0,             /* inert while octaves === 1 */
    stroke:      1,             /* px */
    strokeScale: 1,             /* inert while octaves === 1 */
    outer:       92,            /* bloom radius, % of half-diagonal */
    hole:        0,             /* no clear centre — lattice runs behind the copy */
    peak:        39,            /* % where the lattice is fully opaque */
    aspect:      0.81,          /* <1 makes the bloom taller than it is wide */
    detail:      0.61,          /* inert while octaves === 1 */
    color:       "#7C9AEC",
    opacity:     7.5,           /* master, % */
    falloff:     0.3,           /* inert while octaves === 1 */
    drift:       true,          /* slow sheet slide; honours prefers-reduced-motion */
    driftSpeed:  2              /* px per second */
  };

  function start() {
    var host = document.querySelector("main > .page-section:first-child > .section");
    if (!host || !window.GraphyteLattice) return;
    window.GraphyteLattice(host, CFG);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
