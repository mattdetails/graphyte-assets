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
    cell:        43,            /* base hex radius, px */
    octaves:     1,             /* single lattice; see note above */
    ratio:       1.2,           /* inert while octaves === 1 */
    rotate:      0,             /* inert while octaves === 1 */
    stroke:      1.25,          /* px */
    strokeScale: 0,             /* inert while octaves === 1 */
    outer:       60,            /* bloom radius, % of half-diagonal */
    hole:        1,             /* clear centre, % — 1% is effectively none */
    peak:        58,            /* % where the lattice is fully opaque */
    aspect:      1.42,          /* >1 stretches the bloom horizontally */
    detail:      1,             /* inert while octaves === 1 */
    color:       "#7C9AEC",
    opacity:     9,             /* master, % */
    falloff:     0.3,           /* inert while octaves === 1 */
    drift:       false,         /* slow sheet slide; honours prefers-reduced-motion */
    driftSpeed:  2              /* px per second */
  };

  /* Retarget the CTA. This is a stopgap: the address of record lives in the
     Relume editor (the button's buttonLink prop), and the published HTML still
     ships the old one — so a visitor with JS blocked mails the wrong inbox.
     Fix it at source when you can; this rule then matches nothing and is a
     no-op, safe to leave in place. */
  var CTA_FROM = "mailto:hello@graphytedesign.com";
  var CTA_TO   = "mailto:matt@graphytedesign.com";

  function retargetCta() {
    var links = document.querySelectorAll('a[href="' + CTA_FROM + '"]');
    for (var i = 0; i < links.length; i++) links[i].setAttribute("href", CTA_TO);
  }

  function start() {
    retargetCta();
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
