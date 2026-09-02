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

  /* Retarget the CTA.

     The button carries data-bind="{"attrs":{"href":"buttonLink"}}", so Relume's
     bundle re-applies the address from data-props during hydration. Our scripts
     run FIRST (custom head code is injected at the top of <head>), so simply
     setting href is overwritten moments later. Three layers:

       1. rewrite data-props, so Relume's own binding produces the right value
       2. set href directly, for the pre-hydration paint
       3. observe, in case anything re-renders the node later

     The observer only touches nodes still holding the OLD address, so our own
     writes cannot retrigger it and it settles after one pass.

     Caveat: the served HTML still contains the old address, so a visitor with
     JS blocked will mail hello@. Point that alias at the same inbox as a net. */
  var CTA_FROM = "mailto:hello@graphytedesign.com";
  var CTA_TO   = "mailto:matt@graphytedesign.com";

  function applyCta() {
    var links = document.querySelectorAll('a[href="' + CTA_FROM + '"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i], props = a.getAttribute("data-props");
      if (props && props.indexOf(CTA_FROM) > -1) {
        a.setAttribute("data-props", props.split(CTA_FROM).join(CTA_TO));
      }
      a.setAttribute("href", CTA_TO);
    }
  }

  function watchCta() {
    if (!window.MutationObserver || !document.body) return;
    new MutationObserver(applyCta).observe(document.body, {
      subtree: true, childList: true,
      attributes: true, attributeFilter: ["href", "data-props"]
    });
  }

  function start() {
    applyCta();
    watchCta();
    window.addEventListener("load", applyCta);
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
