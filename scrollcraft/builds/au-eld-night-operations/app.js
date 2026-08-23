(() => {
  "use strict";

  const CONTACT = Object.freeze({
    phone: "+1 (555) 014-7824",
    phoneHref: "+15550147824",
    email: "support@aueldservice.com",
    telegram: "@AUELDService",
    telegramHref: "https://t.me/AUELDService"
  });

  const SAMPLE_INCIDENT = Object.freeze({
    id: "AU-248",
    driver: "Marcus Hale",
    unit: "82",
    route: "Reno to Salt Lake City",
    received: "02:30",
    issue: "Driver log status mismatch"
  });

  const SERVICES = Object.freeze([
    {
      id: "setup",
      label: "ELD setup and onboarding",
      shortLabel: "ELD setup",
      state: "Start clean",
      summary: "Organize devices, drivers, and records with practical step-by-step guidance.",
      steps: [
        ["Connect", "Confirm the device and vehicle pairing."],
        ["Organize", "Match the driver profile and carrier records."],
        ["Prepare", "Review the first-day workflow before the road."]
      ]
    },
    {
      id: "compliance",
      label: "Compliance support",
      shortLabel: "Compliance support",
      state: "Stay ready",
      summary: "Understand what needs attention, correct issues early, and keep the operation prepared.",
      steps: [
        ["Inspect", "Identify the event or record that needs attention."],
        ["Clarify", "Separate a data issue from a process issue."],
        ["Prepare", "Organize the context needed for the next action."]
      ]
    },
    {
      id: "driver-help",
      label: "Responsive driver help",
      shortLabel: "Driver help",
      state: "Get unstuck",
      summary: "Give the driver the next useful action without adding more delay.",
      steps: [
        ["Confirm", "Check the live device connection."],
        ["Review", "Compare the recent motion and duty events."],
        ["Guide", "Send the driver one clear correction path."]
      ]
    }
  ]);

  const STEPS = Object.freeze([
    { label: "Driver request", state: "Incoming" },
    { label: "Record scan", state: "Inspecting" },
    { label: "Service path", state: "Selecting" },
    { label: "Action control", state: "In control" },
    { label: "Record reconcile", state: "Reconciling" },
    { label: "Contact dispatch", state: "Ready" }
  ]);

  const SPANS = Object.freeze([1.3, 1.55, 1.55, 1.3, 3.1, 1.6]);
  const STARTS = SPANS.map((_, index) => SPANS.slice(0, index).reduce((sum, span) => sum + span, 0));
  const TOTAL_SPAN = SPANS.reduce((sum, span) => sum + span, 0);
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const root = document.documentElement;
  const experience = document.querySelector(".ops-experience");
  const stage = document.getElementById("ops-stage");
  const mapRegion = document.querySelector(".map-region");
  const canvas = document.getElementById("route-canvas");
  const context = canvas.getContext("2d", { alpha: false });
  const stateLayers = Array.from(document.querySelectorAll("[data-state-layer]"));
  const navItems = Array.from(document.querySelectorAll("[data-goto]"));
  const activeStepLabel = document.getElementById("active-step-label");
  const docketState = document.getElementById("docket-state");
  const scanPlane = document.getElementById("scan-plane");
  const serviceSurface = document.querySelector(".service-surface");
  const serviceTrack = document.getElementById("service-track");
  const reconcileSurface = document.getElementById("reconcile-surface");
  const mapContactChannels = document.getElementById("map-contact-channels");
  const fragments = Array.from(document.querySelectorAll("[data-fragment]"));
  const verifiedRecord = document.getElementById("verified-record");
  const verifiedAction = document.getElementById("verified-action");
  const handoffToken = document.getElementById("handoff-token");
  const selectionReadout = document.getElementById("selection-readout");
  const controlTitle = document.getElementById("control-title");
  const controlSummary = document.getElementById("control-summary");
  const actionSteps = document.getElementById("action-steps");
  const controlStatusCopy = document.getElementById("control-status-copy");
  const reconcileStatusLabel = document.getElementById("reconcile-status-label");
  const reconcileStatusValue = document.getElementById("reconcile-status-value");
  const nodeInspector = document.getElementById("node-inspector");
  const mapNodes = Array.from(document.querySelectorAll("[data-map-node]"));
  const form = document.getElementById("contact-composer");
  const subjectInput = document.getElementById("contact-subject");
  const formStatus = document.getElementById("form-status");
  const skipLink = document.querySelector(".skip-link");

  let selectedServiceIndex = 0;
  let serviceWasChosen = false;
  let subjectWasEdited = false;
  let activeIndex = -1;
  let targetProgress = 0;
  let renderedProgress = 0;
  let bootStart = performance.now();
  let canvasWidth = 0;
  let canvasHeight = 0;
  let canvasRatio = 1;
  let mapBounds = { x: 88, y: 54, width: 900, height: 700 };
  let pointerTarget = { x: 0.48, y: 0.48 };
  let pointerCurrent = { x: 0.48, y: 0.48 };
  let frameRequested = true;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  function smoothstep(edge0, edge1, value) {
    if (edge0 === edge1) return value < edge0 ? 0 : 1;
    const x = clamp((value - edge0) / (edge1 - edge0));
    return x * x * (3 - 2 * x);
  }

  function easeOutBack(value) {
    const x = clamp(value) - 1;
    return 1 + 2.18 * x * x * x + 1.18 * x * x;
  }

  function renderServices() {
    const lead = document.createElement("article");
    lead.className = "service-lead";
    lead.innerHTML = `
      <span>Service paths</span>
      <strong>One issue. One useful next action.</strong>
      <p>Choose a path to update the live response plan.</p>
    `;
    serviceTrack.append(lead);

    SERVICES.forEach((service, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "service-option";
      button.dataset.serviceIndex = String(index);
      button.dataset.scTilt = "4";
      button.setAttribute("aria-pressed", index === selectedServiceIndex ? "true" : "false");
      button.innerHTML = `
        <span class="service-option__index">0${index + 1}</span>
        <span class="service-option__body">
          <span>
            <span class="service-option__label">${service.state}</span>
            <h3>${service.label}</h3>
            <p>${service.summary}</p>
          </span>
          <span class="service-option__action">
            <span>Select path</span>
            <svg aria-hidden="true"><use href="#icon-arrow"></use></svg>
          </span>
        </span>
      `;
      button.addEventListener("click", () => {
        serviceWasChosen = true;
        setService(index);
      });
      serviceTrack.append(button);
    });

    const end = document.createElement("article");
    end.className = "service-endcap";
    end.innerHTML = `
      <span>Selected response</span>
      <p>The chosen path carries forward into the verified incident and contact composer.</p>
    `;
    serviceTrack.append(end);
  }

  function hydrateContact() {
    const values = {
      phone: CONTACT.phone,
      email: CONTACT.email,
      telegram: CONTACT.telegram
    };
    const hrefs = {
      phone: `tel:${CONTACT.phoneHref}`,
      email: `mailto:${CONTACT.email}`,
      telegram: CONTACT.telegramHref
    };

    document.querySelectorAll("[data-contact-value]").forEach((element) => {
      element.textContent = values[element.dataset.contactValue];
    });
    document.querySelectorAll("[data-contact-link]").forEach((element) => {
      element.href = hrefs[element.dataset.contactLink];
    });
  }

  function setService(index) {
    selectedServiceIndex = clamp(index, 0, SERVICES.length - 1);
    const service = SERVICES[selectedServiceIndex];

    serviceTrack.querySelectorAll("[data-service-index]").forEach((button) => {
      const selected = Number(button.dataset.serviceIndex) === selectedServiceIndex;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    selectionReadout.textContent = service.label;
    controlTitle.textContent = service.label;
    controlSummary.textContent = service.summary;
    verifiedAction.textContent = service.label;
    actionSteps.innerHTML = service.steps.map(([verb, description], order) => `
      <li data-motion="roll" style="--order:${order + 3}">
        <span>${verb}</span>
        <p>${description}</p>
      </li>
    `).join("");

    if (!subjectWasEdited) {
      subjectInput.value = `Sample ${SAMPLE_INCIDENT.id} · ${service.shortLabel}`;
    }
  }

  function resizeCanvas() {
    const rect = stage.getBoundingClientRect();
    canvasRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvasWidth = Math.max(1, Math.round(rect.width));
    canvasHeight = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(canvasWidth * canvasRatio);
    canvas.height = Math.round(canvasHeight * canvasRatio);
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    const mapRect = mapRegion.getBoundingClientRect();
    mapBounds = {
      x: mapRect.left - rect.left,
      y: mapRect.top - rect.top,
      width: mapRect.width,
      height: mapRect.height
    };
    frameRequested = true;
  }

  function readScrollProgress() {
    if (reduceMotionQuery.matches) return 1;
    const top = experience.getBoundingClientRect().top + window.scrollY;
    const max = Math.max(1, experience.offsetHeight - window.innerHeight);
    return clamp((window.scrollY - top) / max);
  }

  function storyPosition(progress) {
    const coordinate = progress * TOTAL_SPAN;
    let index = SPANS.length - 1;
    for (let i = 0; i < SPANS.length; i += 1) {
      if (coordinate < STARTS[i] + SPANS[i] || i === SPANS.length - 1) {
        index = i;
        break;
      }
    }
    return {
      coordinate,
      index,
      local: clamp((coordinate - STARTS[index]) / SPANS[index])
    };
  }

  function statePresence(coordinate, index) {
    const start = STARTS[index];
    const end = start + SPANS[index];
    const enterBlend = Math.min(0.18, SPANS[index] * 0.12);
    const exitBlend = Math.min(0.18, SPANS[index] * 0.12);
    const entering = index === 0 ? 1 : smoothstep(start, start + enterBlend, coordinate);
    const leaving = index === SPANS.length - 1 ? 1 : 1 - smoothstep(end - exitBlend, end, coordinate);
    return clamp(entering * leaving);
  }

  function setTextMotion(element, amount) {
    const value = clamp(amount);
    const inverse = 1 - value;
    element.style.setProperty("--text-enter", value.toFixed(4));
    element.style.setProperty("--text-rise-y", `${(inverse * 22).toFixed(2)}px`);
    element.style.setProperty("--text-wipe-x", `${(-inverse * 8).toFixed(2)}px`);
    element.style.setProperty("--text-clip", `${(inverse * 100).toFixed(2)}%`);
    element.style.setProperty("--text-roll-y", `${(-inverse * 14).toFixed(2)}px`);
    element.style.setProperty("--text-roll-rotate", `${(inverse * 8).toFixed(2)}deg`);
    element.style.setProperty("--text-fold-clip", `${(inverse * 36).toFixed(2)}%`);
    element.style.setProperty("--text-fold-rotate", `${(-inverse * 8).toFixed(2)}deg`);
    element.style.setProperty("--text-fold-y", `${(inverse * 18).toFixed(2)}px`);
  }

  function updateStateLayers(position, now) {
    const presences = stateLayers.map((_, index) => statePresence(position.coordinate, index));
    const bootProgress = clamp((now - bootStart) / 760);

    stateLayers.forEach((layer, index) => {
      const presence = presences[index];
      const paintPresence = presence < 0.12 ? 0 : presence;
      const localRaw = (position.coordinate - STARTS[index]) / SPANS[index];
      const enterBlend = Math.min(0.18, SPANS[index] * 0.12);
      layer.style.setProperty("--state-presence", paintPresence.toFixed(4));
      const direction = localRaw < 0.5 ? 1 : -1;
      layer.style.setProperty("--state-y", `${((1 - paintPresence) * 20 * direction).toFixed(2)}px`);

      const interactive = reduceMotionQuery.matches || (presence > 0.72 && index === position.index);
      layer.classList.toggle("is-interactive", interactive);
      layer.inert = !interactive;
      layer.setAttribute("aria-hidden", String(!interactive && !reduceMotionQuery.matches));

      layer.querySelectorAll("[data-motion]").forEach((element) => {
        const order = Number.parseFloat(element.style.getPropertyValue("--order")) || 0;
        let amount;
        if (reduceMotionQuery.matches) {
          amount = 1;
        } else if (index === 0) {
          amount = order === 0 ? 1 : smoothstep(0.04 + order * 0.045, 0.3 + order * 0.045, bootProgress);
        } else {
          const delay = order * 0.022;
          amount = smoothstep((-enterBlend / SPANS[index]) + delay, 0.1 + delay, localRaw);
        }
        setTextMotion(element, amount);
      });
    });

    return presences;
  }

  function updateServiceRail(position, presence) {
    const local = position.index === 2
      ? position.local
      : clamp((position.coordinate - STARTS[2]) / SPANS[2]);
    const overflow = Math.max(0, serviceTrack.scrollWidth - mapRegion.clientWidth);
    const travel = smoothstep(0.04, 0.96, local);
    const x = -overflow * travel;

    stage.style.setProperty("--service-presence", presence.toFixed(4));
    stage.style.setProperty("--service-x", `${x.toFixed(2)}px`);
    const interactive = reduceMotionQuery.matches || presence > 0.72;
    serviceSurface.classList.toggle("is-interactive", interactive);
    serviceSurface.inert = !interactive;
    serviceSurface.setAttribute("aria-hidden", String(!reduceMotionQuery.matches && presence <= 0.12));

    if (!serviceWasChosen && position.index === 2) {
      const automaticIndex = local < 0.38 ? 0 : local < 0.7 ? 1 : 2;
      if (automaticIndex !== selectedServiceIndex) setService(automaticIndex);
    }
  }

  function updateReconcile(position, reconcilePresence, finalPresence) {
    const isFinal = position.index === 5;
    const p = isFinal ? 1 : position.index === 4 ? position.local : position.coordinate > STARTS[4] ? 1 : 0;
    const emerge = smoothstep(0.16, 0.46, p);
    const align = easeOutBack(smoothstep(0.48, 0.75, p));
    const seal = smoothstep(0.75, 0.9, p);
    const handoff = smoothstep(0.9, 1, p);
    const combinedPresence = Math.max(reconcilePresence, finalPresence * 0.96);
    const quiet = position.index === 3 && position.local > 0.66
      ? smoothstep(0.66, 0.96, position.local)
      : position.index === 4
        ? 1 - smoothstep(0.08, 0.16, position.local)
        : 0;

    stage.style.setProperty("--reconcile-presence", combinedPresence.toFixed(4));
    reconcileSurface.setAttribute("aria-hidden", String(combinedPresence < 0.08));

    const width = Math.max(320, mapRegion.clientWidth);
    const height = Math.max(260, mapRegion.clientHeight);
    const spread = [
      { x: -width * 0.27, y: -height * 0.22, r: -7.5, targetY: -94 },
      { x: width * 0.25, y: -height * 0.06, r: 7, targetY: 0 },
      { x: -width * 0.04, y: height * 0.25, r: -3.5, targetY: 94 }
    ];

    fragments.forEach((fragment, index) => {
      const spec = spread[index];
      const x = spec.x * (1 - align);
      const y = spec.y * (1 - align) + spec.targetY * align;
      const rotation = spec.r * (1 - align);
      const scale = 0.9 + 0.1 * align;
      const opacity = emerge * (1 - seal);
      fragment.style.opacity = opacity.toFixed(4);
      fragment.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), calc(-50% + ${y.toFixed(2)}px), 0) rotate(${rotation.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
    });

    const verifiedOpacity = isFinal ? finalPresence : seal * reconcilePresence;
    const verifiedScale = isFinal ? 0.92 : 0.94 + seal * 0.06;
    const verifiedY = isFinal ? -52 : -50;
    verifiedRecord.style.opacity = verifiedOpacity.toFixed(4);
    verifiedRecord.style.clipPath = `inset(${((1 - seal) * 42).toFixed(2)}% 0 0 0 round 28px)`;
    verifiedRecord.style.transform = `translate3d(-50%, ${verifiedY}%, 0) scale(${verifiedScale.toFixed(4)})`;

    const surfaceRect = document.querySelector(".surface-main").getBoundingClientRect();
    const startX = mapBounds.x + mapBounds.width * 0.52 - surfaceRect.left;
    const endX = mapBounds.x + mapBounds.width + Math.max(110, (surfaceRect.width - mapBounds.width) * 0.46) - surfaceRect.left;
    const startY = mapBounds.y + mapBounds.height * 0.5 - surfaceRect.top;
    const endY = mapBounds.y + mapBounds.height * 0.56 - surfaceRect.top;
    const tokenX = startX + (endX - startX) * handoff;
    const tokenY = startY + (endY - startY) * handoff;
    handoffToken.style.opacity = (reconcilePresence * handoff * (1 - finalPresence)).toFixed(4);
    handoffToken.style.transform = `translate3d(${tokenX.toFixed(2)}px, ${tokenY.toFixed(2)}px, 0) translate(-50%, -50%) scale(${(0.82 + handoff * 0.18).toFixed(4)})`;

    if (quiet > 0.5 || p < 0.16) {
      reconcileStatusLabel.textContent = "Holding scan";
      reconcileStatusValue.textContent = "Source channels ready";
      controlStatusCopy.textContent = "Route settled. One scan remains active.";
    } else if (p < 0.48) {
      reconcileStatusLabel.textContent = "Separating sources";
      reconcileStatusValue.textContent = "Device · motion · duty";
    } else if (p < 0.75) {
      reconcileStatusLabel.textContent = "Aligning events";
      reconcileStatusValue.textContent = "Matching sample timestamps";
    } else {
      reconcileStatusLabel.textContent = "Record ready";
      reconcileStatusValue.textContent = `${SAMPLE_INCIDENT.id} verified for handoff`;
    }

    return { emerge, align, seal, handoff, quiet };
  }

  function updateScan(position, scanPresence, quiet) {
    const local = position.index === 1
      ? position.local
      : position.index >= 4 ? 0.5 : clamp((position.coordinate - STARTS[1]) / SPANS[1]);
    const quietPresence = quiet > 0 ? 0.55 + quiet * 0.25 : 0;
    const presence = Math.max(scanPresence, quietPresence);
    const travel = position.index === 1 ? smoothstep(0, 1, local) : 0.52;
    const x = (mapRegion.clientWidth * 1.48) * travel;
    const scrollPulse = 0.5 + Math.sin((position.coordinate + position.local) * Math.PI * 7) * 0.5;

    stage.style.setProperty("--scan-presence", presence.toFixed(4));
    stage.style.setProperty("--scan-x", `${x.toFixed(2)}px`);
    stage.style.setProperty("--scan-pulse", (0.72 + scrollPulse * 0.42).toFixed(4));
    stage.style.setProperty("--scan-pulse-opacity", (0.32 + scrollPulse * 0.6).toFixed(4));
    scanPlane.style.visibility = presence > 0.02 ? "visible" : "hidden";
    return scrollPulse;
  }

  function updateNodes(position, controlPresence) {
    const presence = 0.24 + controlPresence * 0.76;
    stage.style.setProperty("--nodes-presence", presence.toFixed(4));
    stage.style.setProperty("--nodes-y", `${((1 - presence) * 12).toFixed(2)}px`);
    stage.style.setProperty("--nodes-x", `${((1 - presence) * -16).toFixed(2)}px`);
    stage.style.setProperty("--pointer-ring-opacity", (presence * 0.72).toFixed(4));

    const travelX = (renderedProgress - 0.5) * Math.min(72, mapRegion.clientWidth * 0.08);
    const travelY = Math.sin(renderedProgress * Math.PI * 2) * 11 * (1 - controlPresence * 0.75);
    stage.style.setProperty("--vehicle-x", `${travelX.toFixed(2)}px`);
    stage.style.setProperty("--vehicle-y", `${travelY.toFixed(2)}px`);

    mapRegion.style.setProperty("--pointer-x", `${(pointerCurrent.x * 100).toFixed(2)}%`);
    mapRegion.style.setProperty("--pointer-y", `${(pointerCurrent.y * 100).toFixed(2)}%`);

    mapNodes.forEach((node) => {
      node.tabIndex = position.index >= 2 || reduceMotionQuery.matches ? 0 : -1;
    });
  }

  function setActiveStep(index) {
    if (activeIndex === index) return;
    activeIndex = index;

    activeStepLabel.textContent = STEPS[index].label;
    docketState.textContent = STEPS[index].state;
    activeStepLabel.classList.remove("is-swapping");
    void activeStepLabel.offsetWidth;
    activeStepLabel.classList.add("is-swapping");

    document.querySelectorAll(".stage-nav__item").forEach((button) => {
      const isActive = Number(button.dataset.goto) === index;
      button.classList.toggle("is-active", isActive);
      if (isActive) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
  }

  function updateSurface(now) {
    const position = storyPosition(renderedProgress);
    setActiveStep(position.index);
    const presences = updateStateLayers(position, now);
    updateServiceRail(position, presences[2]);
    const reconcile = updateReconcile(position, presences[4], presences[5]);
    const scanPulse = updateScan(position, presences[1], reconcile.quiet);
    updateNodes(position, presences[3]);
    stage.style.setProperty("--contact-presence", presences[5].toFixed(4));
    stage.style.setProperty("--contact-shift", `${((1 - presences[5]) * 18).toFixed(2)}px`);
    const contactInteractive = reduceMotionQuery.matches || presences[5] > 0.72;
    mapContactChannels.classList.toggle("is-interactive", contactInteractive);
    mapContactChannels.inert = !contactInteractive;
    mapContactChannels.setAttribute("aria-hidden", String(!contactInteractive && !reduceMotionQuery.matches));

    const sealBucket = Math.round(reconcile.seal * 8);
    const scanBucket = Math.round(scanPulse * 4);
    const serviceOverflow = Math.max(0, serviceTrack.scrollWidth - mapRegion.clientWidth);
    const serviceX = Number.parseFloat(getComputedStyle(stage).getPropertyValue("--service-x")) || 0;
    stage.dataset.scVerifyState = `s${position.index}:p${Math.round(position.local * 12)}:scan${scanBucket}:rail${Math.round(Math.abs(serviceX) / Math.max(1, serviceOverflow) * 6)}:seal${sealBucket}`;
    if (position.index === 5 && position.local > 0.985) stage.dataset.scVerifyHold = "true";
    else delete stage.dataset.scVerifyHold;

    drawMap(position, presences, reconcile);
  }

  function pathThrough(points) {
    const path = new Path2D();
    if (!points.length) return path;
    path.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i += 1) {
      const midX = (points[i].x + points[i + 1].x) * 0.5;
      const midY = (points[i].y + points[i + 1].y) * 0.5;
      path.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
    }
    const last = points[points.length - 1];
    path.lineTo(last.x, last.y);
    return path;
  }

  function routeSamples(disturbance = 0) {
    const anchors = [
      [-0.04, 0.78], [0.12, 0.72], [0.23, 0.64], [0.37, 0.67],
      [0.49, 0.52], [0.62, 0.48], [0.75, 0.34], [0.91, 0.28], [1.05, 0.17]
    ];
    return anchors.map(([x, y], index) => ({
      x: mapBounds.x + x * mapBounds.width + (renderedProgress - 0.5) * (index % 2 ? 28 : 16),
      y: mapBounds.y + y * mapBounds.height + Math.sin(index * 1.47 + renderedProgress * 12) * disturbance
    }));
  }

  function drawDistrict(points, fill, stroke) {
    context.beginPath();
    points.forEach(([x, y], index) => {
      const px = mapBounds.x + x * mapBounds.width;
      const py = mapBounds.y + y * mapBounds.height;
      if (index === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    });
    context.closePath();
    context.fillStyle = fill;
    context.fill();
    context.strokeStyle = stroke;
    context.lineWidth = 1;
    context.stroke();
  }

  function drawRoad(points, outerWidth = 18, alpha = 1) {
    const absolute = points.map(([x, y]) => ({
      x: mapBounds.x + x * mapBounds.width,
      y: mapBounds.y + y * mapBounds.height
    }));
    const path = pathThrough(absolute);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = `rgba(25, 43, 57, ${0.82 * alpha})`;
    context.lineWidth = outerWidth;
    context.stroke(path);
    context.strokeStyle = `rgba(97, 124, 147, ${0.22 * alpha})`;
    context.lineWidth = Math.max(1, outerWidth * 0.1);
    context.stroke(path);
  }

  function strokePartial(points, progress, width, color) {
    if (points.length < 2 || progress <= 0) return;
    const maxSegment = (points.length - 1) * clamp(progress);
    const completeSegments = Math.floor(maxSegment);
    const remainder = maxSegment - completeSegments;
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let i = 1; i <= completeSegments && i < points.length; i += 1) {
      context.lineTo(points[i].x, points[i].y);
    }
    if (completeSegments < points.length - 1 && remainder > 0) {
      const from = points[completeSegments];
      const to = points[completeSegments + 1];
      context.lineTo(from.x + (to.x - from.x) * remainder, from.y + (to.y - from.y) * remainder);
    }
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = width;
    context.strokeStyle = color;
    context.stroke();
  }

  function drawMap(position, presences, reconcile) {
    if (!context || !canvasWidth || !canvasHeight) return;
    context.setTransform(canvasRatio, 0, 0, canvasRatio, 0, 0);
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    const groundMix = smoothstep(0.2, 0.9, renderedProgress);
    const baseR = Math.round(7 + groundMix * 2);
    const baseG = Math.round(16 + groundMix * 6);
    const baseB = Math.round(26 + groundMix * 8);
    context.fillStyle = `rgb(${baseR}, ${baseG}, ${baseB})`;
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    context.save();
    context.beginPath();
    context.rect(mapBounds.x, mapBounds.y, mapBounds.width, mapBounds.height);
    context.clip();

    const parallaxX = (renderedProgress - 0.5) * Math.min(58, mapBounds.width * 0.055);
    const parallaxY = (renderedProgress - 0.5) * -32;
    context.save();
    context.translate(parallaxX, parallaxY);

    drawDistrict([[0.01, 0.12], [0.28, 0.04], [0.34, 0.34], [0.11, 0.43]], "rgba(19, 41, 56, 0.58)", "rgba(107, 139, 163, 0.11)");
    drawDistrict([[0.35, 0.03], [0.66, 0.08], [0.62, 0.35], [0.38, 0.31]], "rgba(16, 36, 51, 0.68)", "rgba(107, 139, 163, 0.1)");
    drawDistrict([[0.69, 0.08], [0.97, 0.02], [1.02, 0.33], [0.69, 0.39]], "rgba(20, 43, 57, 0.54)", "rgba(107, 139, 163, 0.1)");
    drawDistrict([[-0.04, 0.48], [0.24, 0.42], [0.31, 0.93], [0.02, 1.02]], "rgba(18, 38, 51, 0.58)", "rgba(107, 139, 163, 0.1)");
    drawDistrict([[0.29, 0.39], [0.61, 0.36], [0.67, 0.88], [0.34, 0.97]], "rgba(15, 34, 48, 0.7)", "rgba(107, 139, 163, 0.11)");
    drawDistrict([[0.66, 0.42], [1.03, 0.36], [1.04, 0.98], [0.69, 0.91]], "rgba(19, 42, 56, 0.58)", "rgba(107, 139, 163, 0.1)");

    drawRoad([[-0.05, 0.32], [0.18, 0.36], [0.38, 0.29], [0.62, 0.31], [0.82, 0.23], [1.06, 0.25]], 14, 0.82);
    drawRoad([[0.08, -0.06], [0.14, 0.2], [0.19, 0.48], [0.31, 0.72], [0.36, 1.08]], 12, 0.72);
    drawRoad([[0.7, -0.08], [0.66, 0.18], [0.72, 0.46], [0.83, 0.69], [0.87, 1.06]], 16, 0.78);
    drawRoad([[-0.04, 0.9], [0.24, 0.83], [0.43, 0.86], [0.68, 0.76], [1.05, 0.82]], 10, 0.62);

    context.strokeStyle = "rgba(91, 126, 153, 0.16)";
    context.lineWidth = 8;
    context.beginPath();
    context.ellipse(mapBounds.x + mapBounds.width * 0.37, mapBounds.y + mapBounds.height * 0.54, mapBounds.width * 0.075, mapBounds.height * 0.11, -0.45, 0, Math.PI * 2);
    context.stroke();
    context.lineWidth = 2;
    context.beginPath();
    context.ellipse(mapBounds.x + mapBounds.width * 0.37, mapBounds.y + mapBounds.height * 0.54, mapBounds.width * 0.055, mapBounds.height * 0.085, -0.45, 0, Math.PI * 2);
    context.stroke();

    context.restore();

    const disturbance = presences[1] * 18 * (1 - reconcile.seal);
    const route = routeSamples(disturbance);
    const reveal = 0.44 + renderedProgress * 0.56;
    strokePartial(route, reveal, 26, "rgba(16, 63, 103, 0.34)");
    strokePartial(route, reveal, 7, "rgba(31, 113, 194, 0.9)");
    strokePartial(route, reveal, 2, "rgba(144, 196, 239, 0.9)");

    context.save();
    context.setLineDash([3, 18]);
    context.lineDashOffset = -renderedProgress * 260;
    strokePartial(route, reveal, 3, "rgba(222, 237, 248, 0.72)");
    context.restore();

    for (let i = 0; i < 5; i += 1) {
      const particleProgress = (renderedProgress * 2.3 + i * 0.19) % 1;
      const routeIndex = Math.min(route.length - 2, Math.floor(particleProgress * (route.length - 1)));
      const fractional = particleProgress * (route.length - 1) - routeIndex;
      const from = route[routeIndex];
      const to = route[routeIndex + 1];
      const x = from.x + (to.x - from.x) * fractional;
      const y = from.y + (to.y - from.y) * fractional;
      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      context.fillStyle = `rgba(198, 224, 245, ${0.28 + i * 0.08})`;
      context.fillRect(-5, -1.5, 10, 3);
      context.restore();
    }

    const pointerX = mapBounds.x + pointerCurrent.x * mapBounds.width;
    const pointerY = mapBounds.y + pointerCurrent.y * mapBounds.height;
    context.strokeStyle = `rgba(114, 167, 214, ${0.08 + presences[3] * 0.16})`;
    context.lineWidth = 1;
    context.beginPath();
    context.arc(pointerX, pointerY, 64 + presences[3] * 34, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.moveTo(pointerX - 12, pointerY);
    context.lineTo(pointerX + 12, pointerY);
    context.moveTo(pointerX, pointerY - 12);
    context.lineTo(pointerX, pointerY + 12);
    context.stroke();

    if (presences[1] > 0.08) {
      const blockAlpha = presences[1] * (1 - reconcile.seal);
      context.fillStyle = `rgba(205, 153, 91, ${0.045 * blockAlpha})`;
      const blockWidth = mapBounds.width * 0.22;
      const blockHeight = mapBounds.height * 0.16;
      context.fillRect(mapBounds.x + mapBounds.width * 0.47, mapBounds.y + mapBounds.height * 0.39, blockWidth, blockHeight);
      context.strokeStyle = `rgba(232, 179, 111, ${0.34 * blockAlpha})`;
      context.strokeRect(mapBounds.x + mapBounds.width * 0.47, mapBounds.y + mapBounds.height * 0.39, blockWidth, blockHeight);
    }

    context.restore();
  }

  function scrollToStep(index, focusContact = false) {
    const max = Math.max(1, experience.offsetHeight - window.innerHeight);
    const top = experience.getBoundingClientRect().top + window.scrollY;
    const progress = clamp((STARTS[index] + SPANS[index] * (index === 5 ? 0.62 : 0.24)) / TOTAL_SPAN);
    window.scrollTo({
      top: top + max * progress,
      behavior: reduceMotionQuery.matches ? "auto" : "smooth"
    });

    if (focusContact) {
      window.setTimeout(() => {
        document.getElementById("contact-name").focus({ preventScroll: true });
      }, reduceMotionQuery.matches ? 0 : 700);
    }
  }

  function handleNodeInspection(node) {
    mapNodes.forEach((item) => item.classList.toggle("is-inspected", item === node));
    nodeInspector.querySelector("span").textContent = "Map focus";
    nodeInspector.querySelector("strong").textContent = node.dataset.mapNode;
  }

  function bindInteractions() {
    navItems.forEach((button) => {
      button.addEventListener("click", () => scrollToStep(Number(button.dataset.goto)));
    });

    mapNodes.forEach((node) => {
      node.addEventListener("click", () => handleNodeInspection(node));
      node.addEventListener("focus", () => handleNodeInspection(node));
    });

    document.querySelector("[data-focus-unit]").addEventListener("click", () => {
      nodeInspector.querySelector("span").textContent = "Located";
      nodeInspector.querySelector("strong").textContent = `Unit ${SAMPLE_INCIDENT.unit}`;
      scrollToStep(3);
    });

    mapRegion.addEventListener("pointermove", (event) => {
      const rect = mapRegion.getBoundingClientRect();
      pointerTarget.x = clamp((event.clientX - rect.left) / Math.max(1, rect.width));
      pointerTarget.y = clamp((event.clientY - rect.top) / Math.max(1, rect.height));
      frameRequested = true;
    }, { passive: true });

    mapRegion.addEventListener("pointerleave", () => {
      pointerTarget = { x: 0.5, y: 0.5 };
    }, { passive: true });

    subjectInput.addEventListener("input", () => {
      subjectWasEdited = true;
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const subject = String(data.get("subject") || "AU ELD Service request").trim();
      const message = String(data.get("message") || "").trim();
      const body = `${message}\n\nName or company: ${name}\nSample incident: ${SAMPLE_INCIDENT.id}\nSelected path: ${SERVICES[selectedServiceIndex].label}`;
      const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      formStatus.textContent = `Opening email for ${CONTACT.email}`;
      window.location.href = mailto;
    });

    skipLink.addEventListener("click", (event) => {
      event.preventDefault();
      scrollToStep(5, true);
    });

    window.addEventListener("scroll", () => {
      targetProgress = readScrollProgress();
      frameRequested = true;
    }, { passive: true });

    window.addEventListener("resize", resizeCanvas, { passive: true });

    reduceMotionQuery.addEventListener("change", () => {
      targetProgress = readScrollProgress();
      renderedProgress = targetProgress;
      stateLayers.forEach((layer) => {
        layer.inert = false;
        layer.removeAttribute("aria-hidden");
      });
      resizeCanvas();
    });
  }

  function tick(now) {
    const reduced = reduceMotionQuery.matches;
    if (reduced) {
      renderedProgress = 1;
    } else {
      renderedProgress += (targetProgress - renderedProgress) * 0.14;
      if (Math.abs(targetProgress - renderedProgress) < 0.00005) renderedProgress = targetProgress;
    }

    pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * (reduced ? 1 : 0.09);
    pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * (reduced ? 1 : 0.09);
    updateSurface(now);
    frameRequested = Math.abs(targetProgress - renderedProgress) > 0.00005
      || Math.abs(pointerTarget.x - pointerCurrent.x) > 0.001
      || Math.abs(pointerTarget.y - pointerCurrent.y) > 0.001;
    requestAnimationFrame(tick);
  }

  function init() {
    renderServices();
    hydrateContact();
    setService(0);
    bindInteractions();
    resizeCanvas();
    targetProgress = readScrollProgress();
    renderedProgress = reduceMotionQuery.matches ? 1 : targetProgress;

    if (window.ScrollCraft) {
      window.ScrollCraft.mount(document.body);
    }

    requestAnimationFrame(() => {
      root.classList.add("is-ready");
      requestAnimationFrame(tick);
    });

    window.AUELD = Object.freeze({ CONTACT, SAMPLE_INCIDENT, SERVICES });
  }

  init();
})();
