(() => {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const lerp = (from, to, amount) => from + (to - from) * amount;
  const smoothstep = (from, to, value) => {
    const t = clamp((value - from) / Math.max(to - from, 0.0001));
    return t * t * (3 - 2 * t);
  };

  const mobileLayout = window.matchMedia("(max-width: 700px)");
  const mobileHeaderAction = document.querySelector("#site-header > .action");

  if (mobileLayout.matches) {
    mobileHeaderAction?.setAttribute("href", "tel:+14408086300");
    mobileHeaderAction?.setAttribute("aria-label", "Call AU ELD Service");
    const mobileHeaderLabel = mobileHeaderAction?.querySelector("span");
    if (mobileHeaderLabel) mobileHeaderLabel.textContent = "Call us";
  }

  const sc = window.ScrollCraft.mount(document.body, { lerp: 0.26 });

  const siteHeader = document.querySelector("#site-header");
  const supportAct = document.querySelector("#support");
  const supportStage = supportAct?.querySelector(".support-stage");
  const supportCore = document.querySelector("#support-core");
  const supportProgress = document.querySelector("#support-progress");
  const supportCopy = [...document.querySelectorAll("[data-support-copy]")];
  const signalEvents = [...document.querySelectorAll("[data-signal-event]")];
  const manifestAct = document.querySelector("#benefits");
  const manifestPanels = [...document.querySelectorAll(".manifest-lead, .manifest-group")];
  const manifestGroups = [...document.querySelectorAll(".manifest-group")];
  const contactSection = document.querySelector("#contact");
  const switchboard = document.querySelector("#channel-switchboard");
  const contactChannels = [...document.querySelectorAll(".contact-channel")];
  const tracePath = document.querySelector("#shift-trace-path");
  const traceStamps = [...document.querySelectorAll("[data-trace-stamp]")];
  const spineProgress = document.querySelector("#spine-progress");
  const spineLinks = [...document.querySelectorAll("[data-spine-link]")];
  const sections = ["top", "support", "benefits", "offer", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  let pageProgress = 0;
  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;
  let updateQueued = false;
  let manifestSnapTimer = 0;
  let manifestSnapping = false;

  const readActProgress = (element) => {
    if (!element) return 0;
    const raw = getComputedStyle(element).getPropertyValue("--sc-p");
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) ? clamp(parsed) : 0;
  };

  const setEntryState = (element, amount, axis = "y", distance = 18) => {
    if (!element) return;
    const value = reduceMotion.matches ? 1 : clamp(amount);
    const offset = (1 - value) * distance;
    const x = axis === "x" ? offset : 0;
    const y = axis === "y" ? offset : 0;
    element.style.opacity = value.toFixed(4);
    element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
  };

  const setupTextReveals = () => {
    const dynamic = new Set([
      ...supportCopy,
      ...signalEvents.flatMap((event) => [...event.querySelectorAll("small, strong, p")]),
      ...document.querySelectorAll(".hero-title__line > span")
    ]);

    const candidates = [...document.querySelectorAll([
      ".site-header .brand__copy > *",
      ".site-header .header-status",
      ".hero .eyebrow",
      ".hero__lede",
      ".hero .offer-line",
      ".hero-core__tag",
      ".offer-copy .eyebrow",
      ".offer-copy h2",
      ".offer-copy__note",
      ".offer-price__unit",
      ".service-promise p",
      ".contact-heading .eyebrow",
      ".contact-heading h2",
      ".contact-heading > p",
      ".contact-channel__copy > *",
      ".site-footer > span"
    ].join(","))].filter((element) => !dynamic.has(element));

    candidates.forEach((element, index) => {
      element.classList.add("text-reveal");
      element.style.transitionDelay = `${(index % 4) * 42}ms`;
    });

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      candidates.forEach((element) => element.classList.add("is-text-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-text-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -7% 0px", threshold: 0.04 });

    candidates.forEach((element) => observer.observe(element));
  };

  const updateHeaderAndSpine = () => {
    siteHeader?.classList.toggle("is-scrolled", window.scrollY > 34);
    root.style.setProperty("--spine-p", pageProgress.toFixed(4));
    if (spineProgress) spineProgress.style.setProperty("--spine-p", pageProgress.toFixed(4));

    const center = window.innerHeight * 0.46;
    let activeIndex = 0;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= center) activeIndex = index;
    });
    spineLinks.forEach((link, index) => link.classList.toggle("is-active", index === activeIndex));
  };

  const updateSupport = () => {
    if (!supportAct || !supportStage) return;
    supportCopy.forEach((element) => setEntryState(element, 1));
    signalEvents.forEach((event) => {
      event.classList.remove("is-active");
      event.classList.add("is-complete");
      event.style.setProperty("--signal-in", "1");
      event.style.setProperty("--signal-opacity", "1");
      event.querySelectorAll("small, strong, p").forEach((leaf) => setEntryState(leaf, 1));
    });

    supportStage.style.setProperty("--support-p", "1");
    supportStage.style.setProperty("--support-turn", "0.35");
    supportStage.style.setProperty("--core-live", "0.82");
    supportProgress?.style.setProperty("--support-p", "1");
    supportStage.setAttribute("data-sc-verify-state", "support:all");
    supportCore?.setAttribute("data-active-signal", "all");
  };

  const updateManifest = () => {
    manifestGroups.forEach((group) => group.style.setProperty("--manifest-settle", "0"));
  };

  const snapManifestPanel = () => {
    if (!manifestAct || manifestAct.getAttribute("data-sc-act") !== "pan" || manifestPanels.length < 2 || mobileLayout.matches || reduceMotion.matches || manifestSnapping) return;

    const start = manifestAct.getBoundingClientRect().top + window.scrollY;
    const travel = Math.max(1, manifestAct.offsetHeight - window.innerHeight);
    const localY = window.scrollY - start;
    if (localY < 0 || localY > travel) return;

    const steps = manifestPanels.length - 1;
    const targetProgress = Math.round(clamp(localY / travel) * steps) / steps;
    const targetY = start + targetProgress * travel;
    if (Math.abs(targetY - window.scrollY) < 3) return;

    manifestSnapping = true;
    window.scrollTo({ top: targetY, behavior: "smooth" });
    window.setTimeout(() => {
      manifestSnapping = false;
    }, 420);
  };

  const scheduleManifestSnap = () => {
    window.clearTimeout(manifestSnapTimer);
    manifestSnapTimer = window.setTimeout(snapManifestPanel, 105);
  };

  const updateContact = () => {
    const p = readActProgress(contactSection);
    const traceIn = reduceMotion.matches ? 1 : smoothstep(0.02, 0.3, p);
    switchboard?.style.setProperty("--contact-in", traceIn.toFixed(4));
    contactChannels.forEach((channel) => {
      const entered = reduceMotion.matches ? 1 : smoothstep(0.04, 0.28, p);
      channel.style.setProperty("--channel-in", entered.toFixed(4));
    });
  };

  const updateTrace = () => {
    const traceProgress = reduceMotion.matches ? 1 : smoothstep(0.01, 0.97, pageProgress);
    root.style.setProperty("--trace-p", traceProgress.toFixed(4));
    if (tracePath) tracePath.style.setProperty("--trace-p", traceProgress.toFixed(4));

    const thresholds = [0.08, 0.22, 0.43, 0.67, 0.87];
    traceStamps.forEach((stamp, index) => {
      const amount = reduceMotion.matches ? 1 : smoothstep(thresholds[index], thresholds[index] + 0.035, pageProgress);
      stamp.style.setProperty("--stamp-in", amount.toFixed(4));
    });
  };

  const updatePage = () => {
    updateQueued = false;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const nextY = window.scrollY;
    pageProgress = clamp(nextY / max);
    scrollVelocity = lerp(scrollVelocity, nextY - lastScrollY, 0.28);
    lastScrollY = nextY;

    root.style.setProperty("--page-p", pageProgress.toFixed(5));
    updateHeaderAndSpine();
    updateSupport();
    updateManifest();
    updateContact();
    updateTrace();
  };

  const requestUpdate = () => {
    if (updateQueued) return;
    updateQueued = true;
    requestAnimationFrame(updatePage);
  };

  document.querySelectorAll("[data-scroll-link], .coverage-spine a, .brand").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
    });
  });

  if (finePointer.matches && !reduceMotion.matches) {
    window.addEventListener("pointermove", (event) => {
      const x = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
      const y = event.clientY / Math.max(window.innerHeight, 1) - 0.5;
      root.style.setProperty("--field-x", x.toFixed(4));
      root.style.setProperty("--field-y", y.toFixed(4));
    }, { passive: true });
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("scroll", scheduleManifestSnap, { passive: true });
  window.addEventListener("resize", () => {
    sc.layout();
    resizeField();
    requestUpdate();
  }, { passive: true });

  reduceMotion.addEventListener?.("change", () => {
    resizeField();
    requestUpdate();
  });

  setupTextReveals();

  /* Code-native support field. Deterministic so it reads as a system, not random decoration. */
  const canvas = document.querySelector("#signal-field");
  const context = canvas?.getContext("2d");
  let fieldWidth = 0;
  let fieldHeight = 0;
  let fieldDpr = 1;
  let fieldTime = 0;
  let fieldAnimation = 0;

  const fieldNodes = [
    [0.05, 0.23], [0.18, 0.12], [0.31, 0.30], [0.46, 0.16],
    [0.62, 0.28], [0.79, 0.12], [0.94, 0.31], [0.12, 0.64],
    [0.28, 0.78], [0.49, 0.62], [0.67, 0.82], [0.86, 0.66], [0.97, 0.88]
  ];
  const routes = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
    [0, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12],
    [2, 9], [4, 9], [4, 11], [6, 11]
  ];

  function resizeField() {
    if (!canvas || !context) return;
    fieldDpr = Math.min(window.devicePixelRatio || 1, 1.5);
    fieldWidth = window.innerWidth;
    fieldHeight = window.innerHeight;
    canvas.width = Math.round(fieldWidth * fieldDpr);
    canvas.height = Math.round(fieldHeight * fieldDpr);
    canvas.style.width = `${fieldWidth}px`;
    canvas.style.height = `${fieldHeight}px`;
    context.setTransform(fieldDpr, 0, 0, fieldDpr, 0, 0);
    if (reduceMotion.matches) drawField(0);
  }

  const routePoint = (route, amount, phase) => {
    const a = fieldNodes[route[0]];
    const b = fieldNodes[route[1]];
    const ax = a[0] * fieldWidth;
    const ay = a[1] * fieldHeight;
    const bx = b[0] * fieldWidth;
    const by = b[1] * fieldHeight;
    const bend = Math.sin((route[0] + route[1] + phase) * 1.7) * fieldHeight * 0.055;
    const cx = (ax + bx) * 0.5;
    const cy = (ay + by) * 0.5 + bend;
    const inv = 1 - amount;
    return {
      x: inv * inv * ax + 2 * inv * amount * cx + amount * amount * bx,
      y: inv * inv * ay + 2 * inv * amount * cy + amount * amount * by,
      ax, ay, bx, by, cx, cy
    };
  };

  function drawField(delta) {
    if (!context || !fieldWidth || !fieldHeight) return;
    if (!reduceMotion.matches) fieldTime += delta;
    const phase = pageProgress * Math.PI * 6;
    const pointerX = Number.parseFloat(getComputedStyle(root).getPropertyValue("--field-x")) || 0;
    const pointerY = Number.parseFloat(getComputedStyle(root).getPropertyValue("--field-y")) || 0;
    const driftX = reduceMotion.matches ? 0 : pointerX * 18;
    const driftY = reduceMotion.matches ? 0 : pointerY * 18;
    const speedLift = clamp(Math.abs(scrollVelocity) / 160, 0, 1);

    context.clearRect(0, 0, fieldWidth, fieldHeight);
    context.save();
    context.translate(driftX, driftY);

    const zoneX = fieldWidth * (0.72 - pageProgress * 0.34);
    const zoneY = fieldHeight * (0.26 + Math.sin(phase * 0.35) * 0.11);
    const zone = context.createRadialGradient(zoneX, zoneY, 0, zoneX, zoneY, Math.max(fieldWidth, fieldHeight) * 0.48);
    zone.addColorStop(0, `rgba(35, 112, 184, ${0.09 + speedLift * 0.025})`);
    zone.addColorStop(0.34, "rgba(18, 70, 119, 0.035)");
    zone.addColorStop(1, "rgba(6, 9, 13, 0)");
    context.fillStyle = zone;
    context.fillRect(-40, -40, fieldWidth + 80, fieldHeight + 80);

    context.save();
    context.translate(zoneX, zoneY);
    context.rotate(phase * 0.025);
    [0.17, 0.29, 0.43].forEach((scale, index) => {
      context.beginPath();
      context.ellipse(0, 0, fieldWidth * scale, fieldHeight * (scale + 0.04), index * 0.18, 0.35, Math.PI * 1.72);
      context.strokeStyle = `rgba(102, 162, 219, ${0.105 - index * 0.02})`;
      context.lineWidth = index === 0 ? 1.4 : 0.8;
      context.stroke();
    });
    context.restore();

    routes.forEach((route, index) => {
      const p = routePoint(route, 0.5, phase);
      context.beginPath();
      context.moveTo(p.ax, p.ay);
      context.quadraticCurveTo(p.cx, p.cy, p.bx, p.by);
      context.strokeStyle = index % 4 === 0
        ? "rgba(93, 161, 224, 0.16)"
        : "rgba(117, 151, 183, 0.095)";
      context.lineWidth = index % 4 === 0 ? 1.15 : 0.72;
      context.stroke();

      if (index % 5 === 0) {
        context.beginPath();
        context.moveTo(p.ax, p.ay);
        context.quadraticCurveTo(p.cx, p.cy, p.bx, p.by);
        context.strokeStyle = "rgba(58, 132, 201, 0.025)";
        context.lineWidth = 16;
        context.stroke();
      }
    });

    fieldNodes.forEach((node, index) => {
      const x = node[0] * fieldWidth;
      const y = node[1] * fieldHeight;
      const pulse = 0.5 + Math.sin(fieldTime * 0.0014 + index * 1.7 + phase) * 0.5;
      context.beginPath();
      context.arc(x, y, 5.5 + pulse * 2, 0, Math.PI * 2);
      context.strokeStyle = `rgba(102, 168, 229, ${0.08 + pulse * 0.08})`;
      context.lineWidth = 0.8;
      context.stroke();
      context.beginPath();
      context.arc(x, y, 1.55, 0, Math.PI * 2);
      context.fillStyle = index % 3 === 0 ? "rgba(126, 195, 255, 0.74)" : "rgba(172, 194, 214, 0.34)";
      context.fill();

      context.beginPath();
      context.moveTo(x + 10, y - 5);
      context.lineTo(x + 24, y - 5);
      context.strokeStyle = "rgba(136, 170, 201, 0.075)";
      context.lineWidth = 0.8;
      context.stroke();
    });

    const pulseCount = fieldWidth < 700 ? 4 : 7;
    for (let index = 0; index < pulseCount; index += 1) {
      const route = routes[(index * 2 + Math.floor(pageProgress * 7)) % routes.length];
      const speed = 0.000055 + index * 0.000006 + speedLift * 0.000025;
      const amount = reduceMotion.matches ? (index + 1) / (pulseCount + 1) : (fieldTime * speed + index * 0.173 + pageProgress * 0.82) % 1;
      const p = routePoint(route, amount, phase);
      context.beginPath();
      context.arc(p.x, p.y, 2.15 + speedLift * 0.7, 0, Math.PI * 2);
      context.fillStyle = "rgba(111, 187, 255, 0.92)";
      context.fill();
    }

    context.restore();
  }

  let lastFieldFrame = performance.now();
  function animateField(now) {
    const delta = Math.min(50, now - lastFieldFrame);
    lastFieldFrame = now;
    drawField(delta);
    scrollVelocity *= 0.88;
    if (!reduceMotion.matches && !document.hidden) fieldAnimation = requestAnimationFrame(animateField);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(fieldAnimation);
    } else if (!reduceMotion.matches) {
      lastFieldFrame = performance.now();
      fieldAnimation = requestAnimationFrame(animateField);
    }
  });

  resizeField();
  requestUpdate();

  if (!reduceMotion.matches) {
    fieldAnimation = requestAnimationFrame(animateField);
  }
})();
