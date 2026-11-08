/* SmileShot landing page behaviour
   1. Nav: once the hero CTA has scrolled away, the nav pins as a compact pill
      that slides down from the top (and lifts away again when scrolling back up).
   2. Offline app demo: loops offline -> uploading -> all uploaded while visible.
   3. How it works: steps 1-4 light up in sequence (scroll-pinned, carousel or static).
   4. Scroll reveal for elements marked .ss-reveal.
   5. Page backdrop that lightens slightly as you scroll.
   6. Privacy: static ciphertext wall with a one-time light ripple as it comes into view.
   7. Offline card: macOS or Windows desktop to match the visitor's computer.
   8. Mobile app: phone settles in, list scrolls and a notification drops in with the page.
   9. Features: staggered rise, dividers draw in, icons glow once.
  10. Hero product shot: scroll-triggered reveal with a soft scroll brake while it plays.
  11. Privacy & Security page: pinned, scroll-scrubbed padlock -> sparkle poof -> asterisks (Apple-style). */
(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initNav() {
    var nav = document.querySelector(".nav");
    if (!nav) return;

    var marker = document.querySelector(".hero-header .cta-button");
    var threshold = 400;
    var pinned = false;
    var ticking = false;

    function measure() {
      if (!marker) return;
      threshold = Math.max(240, marker.getBoundingClientRect().bottom + window.scrollY);
    }

    function pin() {
      pinned = true;
      nav.classList.remove("is-unpinning");
      nav.classList.add("is-pinned");
    }

    function unpin() {
      pinned = false;
      if (reduceMotion) {
        nav.classList.remove("is-pinned");
        return;
      }
      nav.classList.add("is-unpinning");
    }

    // Drop the pinned styles only after the lift-away animation has finished
    nav.addEventListener("animationend", function (e) {
      if (e.target === nav && e.animationName === "ssNavLift" && !pinned) {
        nav.classList.remove("is-pinned", "is-unpinning");
      }
    });

    function update() {
      ticking = false;
      var y = window.scrollY;
      // A small gap between the pin and unpin points stops flicker at the boundary
      if (!pinned && y > threshold) pin();
      else if (pinned && y < threshold - 60) unpin();
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", function () {
      measure();
      update();
    });
    window.addEventListener("load", measure);

    measure();
    update();
  }

  // Offline card: show a macOS or Windows desktop to match the visitor's computer.
  // Preview either one with ?os=mac or ?os=windows in the URL.
  function detectOS() {
    var forced = /[?&]os=(mac|windows)\b/i.exec(window.location.search);
    if (forced) return forced[1].toLowerCase();
    var platform =
      (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";
    if (/win/i.test(platform) || /Windows/i.test(navigator.userAgent)) return "windows";
    return "mac"; // macOS, iPhone/iPad and everything else
  }

  function initDesk() {
    var desk = document.querySelector(".ss-desk");
    if (!desk) return;
    desk.setAttribute("data-os", detectOS());

    // The windows are laid out at a fixed size and scaled down to fit narrow screens
    var visual = desk.parentNode;
    function fit() {
      var scale = Math.min(1, visual.clientWidth / 560);
      visual.style.setProperty("--desk-scale", scale.toFixed(3));
    }
    if ("ResizeObserver" in window) new ResizeObserver(fit).observe(visual);
    else window.addEventListener("resize", fit);
    fit();
  }

  function initOfflineDemo() {
    var desk = document.querySelector("[data-offline-demo]");
    if (!desk || reduceMotion) return; // keep the static mid-upload state from the markup

    var files = Array.prototype.slice.call(desk.querySelectorAll(".ss-file"));
    var timers = [];
    var running = false;

    function later(fn, ms) {
      timers.push(window.setTimeout(fn, ms));
    }

    function cycle() {
      timers = [];

      // 1. Photos are dragged from the SD card into SmileShot (no internet)
      desk.setAttribute("data-state", "dragging");
      files.forEach(function (f) {
        f.setAttribute("data-file-state", "pending");
      });

      // 2. They land in the queue, waiting for a signal
      var drop = 1900;
      later(function () {
        desk.setAttribute("data-state", "offline");
      }, drop);
      files.forEach(function (f, i) {
        later(function () {
          f.setAttribute("data-file-state", "queued");
        }, drop + i * 140);
      });

      // 3. Back online: each photo uploads in turn
      var online = drop + 2600;
      var step = 950;
      later(function () {
        desk.setAttribute("data-state", "uploading");
      }, online);
      files.forEach(function (f, i) {
        var start = online + 300 + i * step;
        later(function () {
          f.setAttribute("data-file-state", "uploading");
        }, start);
        later(function () {
          f.setAttribute("data-file-state", "done");
        }, start + 900);
      });

      // 4. All done, then start again
      var end = online + 300 + files.length * step + 900;
      later(function () {
        desk.setAttribute("data-state", "done");
      }, end);
      later(cycle, end + 2800);
    }

    function start() {
      if (running) return;
      running = true;
      desk.classList.add("is-live");
      cycle();
    }

    function stop() {
      running = false;
      timers.forEach(window.clearTimeout);
      timers = [];
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) start();
          else stop();
        },
        { threshold: 0.25 }
      ).observe(desk);
    } else {
      start();
    }
  }

  // Mobile app: as the section scrolls through the viewport the phone settles into place,
  // its patient list scrolls, and a "photos synced" notification drops in.
  function initMobile() {
    var section = document.querySelector("[data-mobile]");
    if (!section) return;
    var phone = section.querySelector(".ss-phone");
    var viewport = section.querySelector(".ss-app__viewport");
    var list = section.querySelector(".ss-app__list");

    if (reduceMotion) {
      section.classList.add("is-notified");
      return;
    }

    var ticking = false;
    function clamp(v) {
      return Math.max(0, Math.min(1, v));
    }

    function update() {
      ticking = false;
      var r = phone.getBoundingClientRect();
      var vh = window.innerHeight;
      // 0 when the phone's top enters the bottom of the screen, 1 when its bottom reaches the top
      var p = clamp((vh - r.top) / (vh + r.height));
      // set on the stage so the glow behind the phone fades up with it
      phone.parentNode.style.setProperty("--rise", clamp(p / 0.32).toFixed(3));
      var scroll = clamp((p - 0.3) / 0.45);
      var max = Math.max(0, list.scrollHeight - viewport.clientHeight);
      list.style.transform = "translateY(" + (-scroll * max).toFixed(1) + "px)";
      section.classList.toggle("is-notified", p > 0.42 && p < 0.95);
    }

    function request() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    update();
  }

  // How it works: light up steps 1-4 in sequence.
  //  pinned   - the card sticks while page scroll drives the steps (CSS gives the track its height)
  //  carousel - (<992px) steps swipe sideways; the card nearest the left edge is active
  //  static   - wide but short screens / reduced motion: click or hover a step
  function initHowItWorks() {
    var root = document.querySelector("[data-hiw]");
    if (!root) return;

    var track = root.querySelector(".ss-hiw__track");
    var card = root.querySelector(".ss-hiw__card");
    var scroller = root.querySelector(".ss-hiw__steps");
    var fill = root.querySelector(".ss-hiw__ruler-fill");
    var steps = Array.prototype.slice.call(root.querySelectorAll(".ss-hiw__step"));
    var tabs = Array.prototype.slice.call(root.querySelectorAll(".ss-hiw__tab"));
    var n = steps.length;
    var current = -1;
    var ticking = false;
    // When a tab is tapped in carousel mode, keep that step lit until the user swipes.
    // (On tablets two cards fit, so the last cards can't scroll to the left edge.)
    var tapped = -1;

    // Must match the pinned-mode media query in smileshot-landing.css
    var pinQuery = window.matchMedia(
      "(min-width: 992px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)"
    );
    var canPin = !!(window.CSS && CSS.supports && CSS.supports("overflow", "clip"));

    function mode() {
      if (window.innerWidth < 992) return "carousel";
      return pinQuery.matches && canPin ? "pinned" : "static";
    }

    function setActive(index, progress) {
      fill.style.width = Math.max(0, Math.min(1, progress)) * 100 + "%";
      if (index === current) return;
      current = index;
      // Once the last step is reached, the scroll/swipe cue has done its job
      if (index === n - 1) root.classList.add("is-hint-done");
      steps.forEach(function (s, k) {
        s.classList.toggle("is-active", k === index);
        s.classList.toggle("is-done", index > -1 && k < index);
      });
      tabs.forEach(function (t, k) {
        t.classList.toggle("is-active", k === index);
        t.classList.toggle("is-done", index > -1 && k < index);
        t.setAttribute("aria-pressed", k === index ? "true" : "false");
      });
    }

    function inView() {
      var r = card.getBoundingClientRect();
      return r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.25;
    }

    function update() {
      ticking = false;
      var m = mode();
      if (root.getAttribute("data-mode") !== m) root.setAttribute("data-mode", m);

      if (m === "pinned") {
        if (card.getBoundingClientRect().top > window.innerHeight * 0.6) {
          setActive(-1, 0); // not on screen yet: everything waits, so step 1 animates on arrival
          return;
        }
        var r = track.getBoundingClientRect();
        var span = r.height - window.innerHeight;
        var p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
        setActive(Math.min(n - 1, Math.floor(p * n)), p);
      } else if (m === "carousel") {
        if (current === -1 && !inView()) return;
        if (tapped > -1) {
          setActive(tapped, (tapped + 1) / n);
          return;
        }
        var max = scroller.scrollWidth - scroller.clientWidth;
        var q = max > 0 ? scroller.scrollLeft / max : 0;
        var i = Math.round(q * (n - 1));
        setActive(i, (q * (n - 1) + 1) / n);
      } else if (current === -1 && inView()) {
        setActive(0, 1 / n);
      }
    }

    function requestUpdate() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        var m = mode();
        if (m === "pinned") {
          var r = track.getBoundingClientRect();
          var span = r.height - window.innerHeight;
          window.scrollTo({
            top: window.scrollY + r.top + span * ((i + 0.5) / n),
            behavior: reduceMotion ? "auto" : "smooth"
          });
        } else if (m === "carousel") {
          tapped = i;
          setActive(i, (i + 1) / n);
          scroller.scrollTo({
            left: steps[i].offsetLeft - steps[0].offsetLeft,
            behavior: reduceMotion ? "auto" : "smooth"
          });
        } else {
          setActive(i, (i + 1) / n);
        }
      });
    });

    // Static mode: pointing at a step lights it up
    steps.forEach(function (step, i) {
      step.addEventListener("mouseenter", function () {
        if (mode() === "static") setActive(i, (i + 1) / n);
      });
    });

    ["pointerdown", "touchstart", "wheel"].forEach(function (type) {
      scroller.addEventListener(
        type,
        function () {
          tapped = -1;
        },
        { passive: true }
      );
    });

    root.classList.add("is-ready");
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    scroller.addEventListener("scroll", requestUpdate, { passive: true });
    update();
  }

  // Hero product shot: scrolling to it starts the tilt-and-snap reveal (CSS keyframes on
  // .hero-img-target.visible), as in the original Webflow trigger ("-5% center").
  // While it plays, wheel/trackpad scrolling is gently damped - it eases down to about a
  // quarter speed and back up again - so it's harder to fly past, without ever stopping the page.
  function initHeroReveal() {
    var target = document.querySelector(".hero-img-target");
    if (!target) return;

    var played = false;
    var BRAKE_MS = 1500; // roughly the length of the reveal
    var video = target.querySelector("[data-hero-video]");

    function reveal() {
      played = true;
      target.classList.add("visible");
      if (video && !reduceMotion) startVideo();
    }

    // The demo starts from the top as the reveal settles (it opens on a brief still of the dashboard),
    // then pauses whenever it's scrolled out of view
    function startVideo() {
      var inView = true;
      var started = false;
      var play = function () {
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
      };
      setTimeout(function () {
        started = true;
        video.currentTime = 0;
        if (inView) play();
      }, 500);
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          inView = entries[0].isIntersecting;
          if (!started) return;
          if (inView) play();
          else video.pause();
        }).observe(video);
      }
    }

    if (reduceMotion) {
      reveal();
      return;
    }

    // Layout position, ignoring the 3D tilt transform
    function docTop(el) {
      var y = 0;
      while (el) {
        y += el.offsetTop;
        el = el.offsetParent;
      }
      return y;
    }

    // Starts when the shot's top edge (less 5% of its height) is 65% of the way down the screen.
    // Always needs a real scroll of at least 80px, so tall windows (where the shot is
    // already half visible on load) don't start it before the visitor moves.
    var MIN_SCROLL = 40;
    var TRIGGER_AT = 0.65; // fraction down the screen the shot's top must reach (was 0.5)
    function triggerY() {
      return Math.max(MIN_SCROLL, docTop(target) - target.offsetHeight * 0.05 - window.innerHeight * TRIGGER_AT);
    }

    // --- Soft brake ---
    var brakeStart = 0;
    var goal = 0;
    var current = 0;
    var animating = false;

    function factor() {
      var t = (performance.now() - brakeStart) / BRAKE_MS;
      if (t >= 1) return 1;
      return 1 - 0.75 * Math.sin(Math.PI * t); // 1 -> 0.25 -> 1, smooth at both ends
    }

    function braking() {
      return brakeStart && performance.now() - brakeStart < BRAKE_MS;
    }

    function frame() {
      current += (goal - current) * 0.18;
      if (Math.abs(goal - current) < 0.5) current = goal;
      window.scrollTo({ top: current, behavior: "instant" });
      if (current !== goal) window.requestAnimationFrame(frame);
      else animating = false;
    }

    window.addEventListener(
      "wheel",
      function (e) {
        if (!braking() || e.ctrlKey) return; // ctrl+wheel is pinch-zoom
        e.preventDefault();
        if (!animating) {
          current = goal = window.scrollY;
        }
        var dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
        var max = document.documentElement.scrollHeight - window.innerHeight;
        goal = Math.max(0, Math.min(max, goal + dy * factor()));
        if (!animating) {
          animating = true;
          window.requestAnimationFrame(frame);
        }
      },
      { passive: false }
    );

    window.addEventListener(
      "scroll",
      function () {
        if (!played && window.scrollY >= triggerY()) {
          reveal();
          // Damp only when scrolling into it, not after a jump far down the page
          if (window.scrollY < triggerY() + window.innerHeight) brakeStart = performance.now();
        }
      },
      { passive: true }
    );

    // Jumping to a section via a link: reveal without damping
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href*="#"]');
      if (a && a.pathname === window.location.pathname && !played) reveal();
    });

    // Already past it (reload partway down the page). Anchor links and restored scroll
    // positions fire a scroll event, which the listener above handles.
    if (window.scrollY >= triggerY()) reveal();
  }

  // Page backdrop gets slightly lighter the further down you scroll
  function initBackdrop() {
    var lift = document.querySelector(".ss-backdrop__lift");
    if (!lift) return;
    var ticking = false;

    function update() {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      lift.style.opacity = p.toFixed(3);
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", update);
    update();
  }

  // Privacy: a static wall of ciphertext. When the section first comes into view, a single
  // ring of light sweeps out through it and the heading fades in (CSS does the animation).
  function initPrivacy() {
    var stage = document.querySelector(".ss-privacy__stage");
    var field = document.querySelector("[data-cipher]");
    if (!stage || !field) return;

    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var seed = 20261024; // same text on every load
    function rnd() {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    }
    function token() {
      var n = 5 + Math.floor(rnd() * 8);
      var t = "";
      for (var i = 0; i < n; i++) t += chars.charAt(Math.floor(rnd() * chars.length));
      return t;
    }

    var rows = [];
    for (var r = 0; r < 30; r++) {
      var parts = [];
      for (var t = 0; t < 12; t++) parts.push(token());
      rows.push(parts.join(" :.. "));
    }

    // Base (dim) and glow layers hold identical text so the ripple lines up exactly
    ["ss-cipher__base", "ss-cipher__glow"].forEach(function (cls) {
      var layer = document.createElement("div");
      layer.className = cls;
      rows.forEach(function (line) {
        var row = document.createElement("div");
        row.textContent = line;
        layer.appendChild(row);
      });
      field.appendChild(layer);
    });

    if (reduceMotion || !("IntersectionObserver" in window)) return;

    stage.classList.add("is-armed");
    var io = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          stage.classList.add("is-revealing");
          io.disconnect();
        }
      },
      { threshold: 0.5 } // starts once half the section is on screen
    );
    io.observe(stage);
  }

  // Features: items rise in a wave, dividers draw across, icons glow (CSS does the motion)
  function initFeatures() {
    var grid = document.querySelector(".ss-features");
    if (!grid || reduceMotion || !("IntersectionObserver" in window)) return;
    grid.classList.add("is-armed");
    var io = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          grid.classList.add("is-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -18% 0px" }
    );
    io.observe(grid);
  }

  // Privacy & Security page header. Not pinned - each step plays once you scroll past a point
  // and reverses when you scroll back (with a little slack so it never flickers at the edge):
  //   lock   on first scroll: padlock shackle appears open, then drops and clicks shut
  //   poof   the statement vanishes in one sparkle burst
  //   mask   "Private by design." flips letter by letter to asterisks
  // The background lightens with scroll (--p).
  function initPrivacyStory() {
    var root = document.querySelector("[data-ap]");
    if (!root) return;
    var title = root.querySelector("[data-encrypt]");
    var statement = root.querySelector("[data-ink]");
    var canvas = root.querySelector(".ss-ap__dust");

    function clamp(v) {
      return Math.max(0, Math.min(1, v));
    }

    // Headline: one span per character (words kept whole so lines break normally)
    var chars = [];
    var titleText = title.textContent;
    title.setAttribute("aria-label", titleText);
    title.textContent = "";
    titleText.split(/(\s+)/).forEach(function (part) {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        title.appendChild(document.createTextNode(" "));
        return;
      }
      var word = document.createElement("span");
      word.style.whiteSpace = "nowrap";
      word.setAttribute("aria-hidden", "true");
      for (var i = 0; i < part.length; i++) {
        var ch = document.createElement("span");
        ch.className = "ch";
        ch.textContent = part.charAt(i);
        word.appendChild(ch);
        chars.push(ch);
      }
      title.appendChild(word);
    });

    // Pin the headline's natural line breaks (measured unmasked), then stop it re-wrapping,
    // so the asterisks can never push a word onto another line
    function pinTitleLines() {
      Array.prototype.slice.call(title.querySelectorAll("br.ss-ap__br")).forEach(function (br) {
        br.parentNode.removeChild(br);
      });
      title.style.whiteSpace = "";
      var masked = chars.filter(function (ch) {
        return ch.classList.contains("is-masked");
      });
      masked.forEach(function (ch) {
        ch.classList.remove("is-masked");
      });
      var prevTop = null;
      Array.prototype.slice.call(title.children).forEach(function (w) {
        var top = Math.round(w.getBoundingClientRect().top);
        if (prevTop !== null && top > prevTop + 2) {
          var br = document.createElement("br");
          br.className = "ss-ap__br";
          title.insertBefore(br, w);
        }
        prevTop = top;
      });
      title.style.whiteSpace = "nowrap";
      masked.forEach(function (ch) {
        ch.classList.add("is-masked");
      });
      buildMask();
    }

    // Asterisk overlay: same lines and word groups as the headline, one star per character
    var mask = root.querySelector(".ss-ap__mask");
    var stars = [];
    function buildMask() {
      var on = stars.map(function (st) {
        return st.classList.contains("is-on");
      });
      mask.textContent = "";
      stars = [];
      var row = document.createElement("div");
      row.className = "row";
      mask.appendChild(row);
      Array.prototype.slice.call(title.childNodes).forEach(function (node) {
        if (node.nodeName === "BR") {
          row = document.createElement("div");
          row.className = "row";
          mask.appendChild(row);
          return;
        }
        if (node.nodeType !== 1) return;
        var grp = document.createElement("span");
        grp.className = "grp";
        for (var i = 0; i < node.children.length; i++) {
          var st = document.createElement("span");
          st.className = "star";
          st.textContent = "*";
          grp.appendChild(st);
          stars.push(st);
        }
        row.appendChild(grp);
      });
      stars.forEach(function (st, i) {
        if (on[i]) st.classList.add("is-on");
      });
      measureCover();
    }

    // Stars are evenly spaced but letters aren't (a "P" is wider than an "i"), so a star can
    // land on a letter that hasn't flipped yet. For each star, find the last letter it sits on,
    // so that letter is hidden as soon as the star appears.
    var cover = [];
    function measureCover() {
      cover = [];
      var charRow = [];
      var row = 0;
      Array.prototype.slice.call(title.childNodes).forEach(function (node) {
        if (node.nodeName === "BR") row++;
        else if (node.nodeType === 1) {
          for (var i = 0; i < node.children.length; i++) charRow.push(row);
        }
      });
      var rows = Array.prototype.slice.call(mask.children);
      stars.forEach(function (st, si) {
        var r = rows.indexOf(st.parentNode.parentNode);
        // offsetLeft/offsetWidth ignore the stars' pop-in scale; stars measure from the mask and
        // letters from the title wrapper, which share the same box
        var w = st.offsetWidth;
        var x0 = st.offsetLeft + w * 0.12;
        var x1 = x0 + w * 0.76;
        var last = si;
        for (var ci = 0; ci < chars.length; ci++) {
          if (charRow[ci] !== r) continue;
          var ch = chars[ci];
          var pad = ch.offsetWidth * 0.12;
          if (ch.offsetLeft + pad < x1 && ch.offsetLeft + ch.offsetWidth - pad > x0) last = Math.max(last, ci);
        }
        cover.push(last);
      });
      var n = maskedCount || 0;
      maskedCount = -1;
      applyMask(n);
    }
    window.addEventListener("resize", pinTitleLines);

    // Reveal the header only once the font and logo are ready and the headline is prepared,
    // so nothing visibly swaps or jumps on first paint (capped so it never waits too long)
    var revealed = false;
    function reveal() {
      if (revealed) return;
      revealed = true;
      pinTitleLines();
      window.requestAnimationFrame(function () {
        root.classList.add("is-ready");
      });
    }
    var waits = [];
    if (document.fonts && document.fonts.ready) waits.push(document.fonts.ready);
    var tooth = root.querySelector(".ss-ap__tooth");
    if (tooth && !tooth.complete) {
      waits.push(
        new Promise(function (res) {
          tooth.addEventListener("load", res, { once: true });
          tooth.addEventListener("error", res, { once: true });
        })
      );
    }
    if (window.Promise && waits.length) Promise.all(waits).then(reveal);
    else reveal();
    window.setTimeout(reveal, 1200);

    // Asterisks: mask the first n letters (stars pop in via CSS)
    var maskedCount = 0;
    function applyMask(n) {
      if (n === maskedCount) return;
      maskedCount = n;
      // hide every letter up to the furthest one an "on" star covers
      var reach = n - 1;
      for (var s = 0; s < n && s < cover.length; s++) reach = Math.max(reach, cover[s]);
      for (var i = 0; i < chars.length; i++) {
        var on = i < n;
        chars[i].classList.toggle("is-masked", i <= reach);
        if (stars[i]) stars[i].classList.toggle("is-on", on);
      }
      root.classList.toggle("is-masked-all", n >= chars.length);
    }

    var canPin = !!(window.CSS && CSS.supports && CSS.supports("overflow", "clip"));
    if (reduceMotion || !canPin) {
      root.classList.add("is-static", "is-shown", "is-locked");
      root.style.setProperty("--p", "0.5");
      return;
    }

    // --- Pinned, scroll-scrubbed sequence (Apple-style) ---
    // The header sticks while you scroll through its track; progress p (0-1) is eased towards
    // the scroll position every frame so it feels smooth. Only opacity/transform change per frame.
    //   (first 40px of scroll is a dead zone so a stray touch doesn't start it)
    //   0.00-0.20  padlock shackle appears open, then closes
    //   0.22-0.42  statement "poofs" into sparkles
    //   0.44-0.66  headline masks to asterisks, letter by letter
    //   0.68-0.80  caption appears; 0.80-1 holds briefly before the page moves on
    root.classList.add("is-scrub");
    var track = root.querySelector(".ss-ap__track");
    var shackle = root.querySelector(".ss-ap__shackle");
    var caption = root.querySelector(".ss-ap__caption");
    var cue = root.querySelector(".ss-ap__cue");
    var ctx = canvas.getContext("2d");
    var dpr = 1;
    var dust = [];

    function buildDust() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      var box = canvas.getBoundingClientRect();
      canvas.width = Math.round(box.width * dpr);
      canvas.height = Math.round(box.height * dpr);
      var rects = statement.getClientRects();
      var seed = 7;
      function r() {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      }
      var pts = [];
      var cx = 0, cy = 0;
      for (var k = 0; k < rects.length; k++) {
        var rc = rects[k];
        var count = Math.round((rc.width * rc.height) / 30);
        for (var i = 0; i < count; i++) {
          var x = rc.left - box.left + r() * rc.width;
          var y = rc.top - box.top + rc.height * 0.15 + r() * rc.height * 0.75;
          pts.push({ x: x, y: y, s: 0.6 + r() * 1.4, ph: r() * 6.283, d: r() * 0.3 });
          cx += x;
          cy += y;
        }
      }
      cx /= pts.length || 1;
      cy /= pts.length || 1;
      pts.forEach(function (q) {
        var dx = q.x - cx, dy = q.y - cy;
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        var sp = 25 + r() * 70;
        q.vx = (dx / len) * sp + (r() - 0.5) * 40;
        q.vy = (dy / len) * sp + (r() - 0.5) * 40 - 14;
      });
      dust = pts;
      lastDust = -1;
    }

    var lastDust = -1;
    function drawDust(t) {
      if (t === lastDust) return;
      lastDust = t;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (t <= 0 || t >= 1) return;
      for (var i = 0; i < dust.length; i++) {
        var q = dust[i];
        var lt = clamp((t - q.d * 0.4) / (1 - q.d * 0.4));
        if (lt <= 0) continue;
        var e = 1 - Math.pow(1 - lt, 3);
        var a = Math.sin(Math.PI * Math.min(1, lt * 1.6)) * (0.6 + 0.4 * Math.sin(q.ph + lt * 18));
        if (a <= 0.01) continue;
        ctx.globalAlpha = a;
        ctx.fillStyle = q.s > 1.5 ? "#ffffff" : "#ddd6ff";
        ctx.beginPath();
        ctx.arc((q.x + q.vx * e) * dpr, (q.y + q.vy * e) * dpr, q.s * dpr * (1 - lt * 0.4), 0, 6.283);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    var locked = false;
    function render(p) {
      root.style.setProperty("--p", p.toFixed(4));

      // Padlock
      var k = clamp(p / 0.2);
      var appear = clamp(k * 3);
      var open = 1 - clamp((k - 0.35) / 0.65);
      var openEase = open * open * (3 - 2 * open);
      shackle.style.opacity = appear.toFixed(3);
      shackle.style.transform =
        "translateY(" + (openEase * -16 - (1 - appear) * 12).toFixed(2) + "px) rotate(" + (openEase * -30).toFixed(2) + "deg)";
      var nowLocked = open === 0;
      if (nowLocked !== locked) {
        locked = nowLocked;
        root.classList.toggle("is-locked", locked);
      }

      // Statement poof
      var t = clamp((p - 0.22) / 0.2);
      statement.style.opacity = clamp(1 - t * 2.2).toFixed(3);
      statement.style.transform = "scale(" + (1 + t * 0.05).toFixed(4) + ")";
      drawDust(t);

      // Asterisks
      var m = clamp((p - 0.44) / 0.22);
      applyMask(Math.round(m * chars.length));

      // Caption + scroll cue
      var c = clamp((p - 0.68) / 0.12);
      caption.style.opacity = c.toFixed(3);
      caption.style.transform = "translateY(" + ((1 - c) * 8).toFixed(2) + "px)";
      if (cue) cue.style.opacity = clamp(1 - p * 8).toFixed(3);
    }

    var target = 0, current = 0, running = false;
    var DEAD = 40; // px of scroll ignored at the start
    function measure() {
      var r = track.getBoundingClientRect();
      var span = r.height - window.innerHeight - DEAD;
      target = span > 0 ? clamp((-r.top - DEAD) / span) : 0;
    }
    function tick() {
      current += (target - current) * 0.15;
      if (Math.abs(target - current) < 0.0004) current = target;
      render(current);
      if (current !== target) window.requestAnimationFrame(tick);
      else running = false;
    }
    function kick() {
      measure();
      if (!running) {
        running = true;
        window.requestAnimationFrame(tick);
      }
    }

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", function () {
      buildDust();
      kick();
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(buildDust);
    buildDust();
    measure();
    current = target; // start where the page is (e.g. after a reload part-way down)
    render(current);
  }

  // Pricing: Monthly / Yearly switch (CSS shows the matching [data-bill] prices)
  function initBilling() {
    var section = document.querySelector("[data-billing]");
    if (!section) return;
    var opts = Array.prototype.slice.call(section.querySelectorAll("[data-billing-opt]"));
    opts.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var mode = btn.getAttribute("data-billing-opt");
        section.setAttribute("data-billing", mode);
        opts.forEach(function (o) {
          var on = o === btn;
          o.classList.toggle("is-on", on);
          o.setAttribute("aria-pressed", on ? "true" : "false");
        });
      });
    });
  }

  function initReveal() {
    var items = document.querySelectorAll(".ss-reveal");
    if (!items.length || !("IntersectionObserver" in window)) return;

    document.documentElement.classList.add("ss-js");
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    items.forEach(function (el) {
      io.observe(el);
    });
  }

  // Practices & groups page: pill tabs that swap the visual, the cycling hero word and the scroll glow
  function initEnterprise() {
    var tabs = document.querySelector("[data-ent-tabs]");
    if (tabs) {
      var pills = Array.prototype.slice.call(tabs.querySelectorAll("[role=tab]"));
      var select = function (pill, focus) {
        pills.forEach(function (p) {
          var on = p === pill;
          p.classList.toggle("is-on", on);
          p.setAttribute("aria-selected", on ? "true" : "false");
          p.tabIndex = on ? 0 : -1;
          var pane = document.getElementById(p.getAttribute("aria-controls"));
          if (pane) {
            pane.hidden = !on;
            pane.classList.toggle("is-on", on);
          }
        });
        if (focus) pill.focus();
      };
      pills.forEach(function (p, i) {
        p.tabIndex = p.classList.contains("is-on") ? 0 : -1;
        p.addEventListener("click", function () {
          if (!p.classList.contains("is-on")) select(p);
        });
        p.addEventListener("keydown", function (e) {
          var d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          select(pills[(i + d + pills.length) % pills.length], true);
        });
      });
    }

    // hero: the big word cycles, Apple Education style
    var words = Array.prototype.slice.call(document.querySelectorAll("[data-ent-words] > span"));
    if (words.length > 1 && !reduceMotion) {
      var w = 0;
      var swap = function () {
        if (document.hidden) return;
        var old = words[w];
        old.classList.remove("is-on");
        old.classList.add("is-out");
        setTimeout(function () {
          old.classList.remove("is-out");
        }, 900);
        w = (w + 1) % words.length;
        words[w].classList.add("is-on");
      };
      // first change comes sooner so the effect shows straight away
      setTimeout(function () {
        swap();
        setInterval(swap, 2600);
      }, 1300);
    }

    // hero: the light beams stir and brighten a little while you scroll, then settle
    var rays = document.querySelector(".ss-ent-hero__rays");
    if (rays && !reduceMotion) {
      var lastY = window.scrollY;
      var glow = 0;
      var raf = 0;
      var tick = function () {
        raf = 0;
        var y = window.scrollY;
        var target = Math.min(1, Math.abs(y - lastY) / 28);
        lastY = y;
        glow += (target - glow) * (target > glow ? 0.3 : 0.06);
        if (y < window.innerHeight * 1.2) {
          rays.style.setProperty("--glow", glow.toFixed(3));
          rays.style.setProperty("--spin", (y * 0.012).toFixed(2));
        }
        if (glow > 0.004) raf = requestAnimationFrame(tick);
      };
      window.addEventListener("scroll", function () {
        if (!raf) raf = requestAnimationFrame(tick);
      }, { passive: true });
    }
  }

  function init() {
    initEnterprise();
    initBackdrop();
    initHeroReveal();
    initPrivacyStory();
    initPrivacy();
    initNav();
    initDesk();
    initOfflineDemo();
    initMobile();
    initHowItWorks();
    initFeatures();
    initBilling();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
