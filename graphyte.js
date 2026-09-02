/* ==========================================================================
   Graphyte — site config
   Tune these values in the lattice tuner, then paste them here.
   Requires lattice.js to have loaded first.
   ========================================================================== */
(function () {
  "use strict";

  var CFG = {
    anchor:      ".container",  /* bloom centres on this element */
    cell:        46,            /* base hex radius, px */
    octaves:     3,             /* how many lattice scales stack */
    ratio:       1.732,         /* √3 — each octave lands on the previous one */
    rotate:      30,            /* degrees per octave; 30 completes the √3 R30° */
    stroke:      0.75,          /* px */
    strokeScale: 0.45,          /* 0 = uniform weight, 1 = fully proportional */
    outer:       62,            /* bloom radius, % of half-diagonal */
    hole:        18,            /* clear centre, % — keeps the grid off the headline */
    peak:        42,            /* % where the lattice is fully opaque */
    aspect:      1.35,          /* >1 stretches the bloom horizontally */
    detail:      0.72,          /* each finer octave masked this much tighter */
    color:       "#7C9AEC",
    opacity:     10,            /* master, % */
    falloff:     0.65,          /* per-octave opacity multiplier */
    drift:       false,         /* slow sheet slide; honours prefers-reduced-motion */
    driftSpeed:  2
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
