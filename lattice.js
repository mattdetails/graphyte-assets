/* ==========================================================================
   Graphyte — graphite hex-lattice engine
   Exposes window.GraphyteLattice(host, cfg). Load before graphyte.js.

   Geometry: a honeycomb is graphite's actual crystal structure. Octaves are
   scaled by cfg.ratio and rotated by cfg.rotate; at the defaults (√3, 30°)
   each octave lands back on the previous lattice — graphene's √3×√3 R30°
   superstructure — so the stack is genuinely self-similar.
   ========================================================================== */
(function (w) {
  "use strict";

  function buildLattice(host, cfg) {
    var NS = "http://www.w3.org/2000/svg";
    var uid = "gd" + Math.random().toString(36).slice(2, 7);
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "gd-lattice");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("preserveAspectRatio", "none");
    var defs = document.createElementNS(NS, "defs");
    var layers = document.createElementNS(NS, "g");
    svg.appendChild(defs);
    svg.appendChild(layers);

    function el(n, a) {
      var e = document.createElementNS(NS, n), k;
      for (k in a) e.setAttribute(k, a[k]);
      return e;
    }

    /* Each hexagon contributes only its three left-hand edges (V3-V4-V5-V0),
       so every edge in the lattice is drawn exactly once. Drawing closed
       hexagons would double-stroke every shared border, and uneven line
       weight is precisely what reads as cheap at 6-10% opacity. */
    function tile(r) {
      var w2 = Math.sqrt(3) * r, hw = w2 / 2, d = "", i, j, cx, cy;
      for (j = -2; j <= 3; j++) {
        for (i = -2; i <= 2; i++) {
          cx = i * w2 + ((j & 1) ? hw : 0);
          cy = j * 1.5 * r;
          d += "M" + cx.toFixed(2) + " " + (cy + r).toFixed(2) +
               "L" + (cx - hw).toFixed(2) + " " + (cy + r / 2).toFixed(2) +
               "L" + (cx - hw).toFixed(2) + " " + (cy - r / 2).toFixed(2) +
               "L" + cx.toFixed(2) + " " + (cy - r).toFixed(2);
        }
      }
      return { d: d, w: w2, h: 3 * r };
    }

    var phases = [], lastCx = 0, lastCy = 0, raf = 0, t0 = 0;

    function render() {
      var W = host.clientWidth, H = host.clientHeight;
      if (!W || !H) return;

      /* Anchor on the content block rather than the section box, so the bloom
         stays locked to the copy if the section grows taller than it. */
      var cx = W / 2, cy = H / 2;
      var anchor = host.querySelector(cfg.anchor || ".container");
      if (anchor) {
        var hr = host.getBoundingClientRect(), ar = anchor.getBoundingClientRect();
        cx = ar.left - hr.left + ar.width / 2;
        cy = ar.top - hr.top + ar.height / 2;
      }

      svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      while (defs.firstChild) defs.removeChild(defs.firstChild);
      while (layers.firstChild) layers.removeChild(layers.firstChild);
      phases = [];

      var R0 = (cfg.outer / 100) * Math.hypot(W, H) / 2;

      for (var k = 0; k < cfg.octaves; k++) {
        var r = cfg.cell / Math.pow(cfg.ratio, k);
        if (r < 2) break;
        var t = tile(r);
        var sw = cfg.stroke * Math.pow(1 / Math.pow(cfg.ratio, k), cfg.strokeScale);

        var pat = el("pattern", {
          id: uid + "p" + k,
          patternUnits: "userSpaceOnUse",
          width: t.w,
          height: t.h,
          patternTransform: "translate(" + cx + "," + cy + ") rotate(" + (cfg.rotate * k) + ")"
        });
        pat.appendChild(el("path", {
          d: t.d,
          fill: "none",
          stroke: cfg.color,
          "stroke-width": sw.toFixed(3),
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        }));
        defs.appendChild(pat);
        phases.push(pat);

        /* Finer octaves get tighter masks, so detail intensifies toward the
           content instead of sitting as a flat overlay. */
        var R = R0 * Math.pow(cfg.detail, k);
        var hole = cfg.hole / 100;
        var peak = Math.max(cfg.peak / 100, hole + 0.01);
        var g = el("radialGradient", {
          id: uid + "g" + k,
          gradientUnits: "userSpaceOnUse",
          cx: cx, cy: cy, r: R,
          gradientTransform: "translate(" + cx + "," + cy + ") scale(" + cfg.aspect +
                             ",1) translate(" + (-cx) + "," + (-cy) + ")"
        });
        var st = hole > 0
          ? [[0, 0], [hole, 0], [peak, 1], [1, 0]]
          : [[0, 1], [peak, 1], [1, 0]];
        for (var s = 0; s < st.length; s++) {
          g.appendChild(el("stop", {
            offset: Math.min(st[s][0], 1),
            "stop-color": "#fff",
            "stop-opacity": st[s][1]
          }));
        }
        defs.appendChild(g);

        var m = el("mask", {
          id: uid + "m" + k, maskUnits: "userSpaceOnUse",
          x: 0, y: 0, width: W, height: H
        });
        m.appendChild(el("rect", {
          x: 0, y: 0, width: W, height: H, fill: "url(#" + uid + "g" + k + ")"
        }));
        defs.appendChild(m);

        layers.appendChild(el("rect", {
          x: 0, y: 0, width: W, height: H,
          fill: "url(#" + uid + "p" + k + ")",
          mask: "url(#" + uid + "m" + k + ")",
          opacity: (cfg.opacity / 100 * Math.pow(cfg.falloff, k)).toFixed(4)
        }));
      }
      lastCx = cx;
      lastCy = cy;
    }

    function drift(ts) {
      if (!t0) t0 = ts;
      var e = (ts - t0) / 1000 * cfg.driftSpeed;
      for (var k = 0; k < phases.length; k++) {
        var a = k * 2.1, dx = Math.cos(a) * e, dy = Math.sin(a) * e * 0.6;
        phases[k].setAttribute("patternTransform",
          "translate(" + (lastCx + dx) + "," + (lastCy + dy) +
          ") rotate(" + (cfg.rotate * k) + ")");
      }
      raf = requestAnimationFrame(drift);
    }

    render();
    host.insertBefore(svg, host.firstChild);

    if (w.ResizeObserver) new ResizeObserver(render).observe(host);
    else w.addEventListener("resize", render);

    var still = w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (cfg.drift && !still) raf = requestAnimationFrame(drift);

    return {
      el: svg,
      render: render,
      stop: function () { cancelAnimationFrame(raf); }
    };
  }

  w.GraphyteLattice = buildLattice;
})(window);
