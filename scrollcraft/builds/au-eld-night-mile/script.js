const CONTACT = Object.freeze({
  phoneLabel: "+1 (440) 808-6300",
  phoneHref: "+14408086300",
  email: "aueldservice@gmail.com",
  telegramLabel: "@AUELD_manager",
  telegramHref: "https://t.me/AUELD_manager",
});

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothstep = (from, to, value) => {
  const amount = clamp((value - from) / Math.max(to - from, 0.0001));
  return amount * amount * (3 - 2 * amount);
};

const mile = document.querySelector("#night-mile");
const routeStops = [...document.querySelectorAll("[data-route-index]")];
const routeTargets = [...document.querySelectorAll("[data-route-target]")];
const mainReveal = document.querySelector("#main-lane-reveal");
const exitRoutes = [...document.querySelectorAll(".exit-route")];
const laneGuide = document.querySelector("#lane-guide");
const laneMarks = document.querySelector(".main-lane__marks");
const laneRunner = document.querySelector("#lane-runner");
const contactExits = [...document.querySelectorAll(".contact-exit")];
const benefitGroups = [...document.querySelectorAll("[data-benefit-group]")];
const supportAlerts = [...document.querySelectorAll("[data-support-alert]")];
const offerParts = [...document.querySelectorAll("[data-offer-part]")];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

document.querySelectorAll("[data-contact-value='phone']").forEach((element) => {
  element.textContent = CONTACT.phoneLabel;
});
document.querySelectorAll("[data-contact-value='email']").forEach((element) => {
  element.textContent = CONTACT.email;
});
document.querySelectorAll("[data-contact-value='telegram']").forEach((element) => {
  element.textContent = CONTACT.telegramLabel;
});
document.querySelectorAll("[data-contact='phone']").forEach((element) => {
  element.href = `tel:${CONTACT.phoneHref}`;
});
document.querySelectorAll("[data-contact='email']").forEach((element) => {
  element.href = `mailto:${CONTACT.email}`;
});
document.querySelectorAll("[data-contact='telegram']").forEach((element) => {
  element.href = CONTACT.telegramHref;
});

if (matchMedia("(max-width: 900px), (pointer: coarse)").matches) {
  document.querySelectorAll("[data-sc-poster-mobile]").forEach((poster) => {
    poster.src = poster.dataset.scPosterMobile;
    poster.width = 406;
    poster.height = 720;
  });
}

window.__sc = ScrollCraft.mount(document.body);

const relayout = () => dispatchEvent(new Event("resize"));
addEventListener("load", relayout, { once: true });
if (document.fonts?.ready) document.fonts.ready.then(relayout);

requestAnimationFrame(() => document.documentElement.classList.add("is-ready"));

routeTargets.forEach((control) => {
  control.addEventListener("click", () => {
    const target = Number.parseFloat(control.dataset.routeTarget || "0");
    const scrollRange = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
    scrollTo({
      top: scrollRange * clamp(target),
      behavior: reduceMotion.matches ? "auto" : "smooth",
    });
  });
});

let pointerX = 0;
let pointerY = 0;
let pointerTargetX = 0;
let pointerTargetY = 0;

if (matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion.matches) {
  addEventListener("pointermove", (event) => {
    pointerTargetX = (event.clientX / Math.max(innerWidth, 1) - 0.5) * 2;
    pointerTargetY = (event.clientY / Math.max(innerHeight, 1) - 0.5) * 2;
  }, { passive: true });
}

function activeRouteIndex(progress) {
  if (progress >= 0.82) return 3;
  if (progress >= 0.48) return 2;
  if (progress >= 0.18) return 1;
  return 0;
}

function updateRoute(progress) {
  const current = activeRouteIndex(progress);
  routeStops.forEach((stop, index) => {
    const selected = index === current;
    stop.classList.toggle("is-current", selected);
    if (selected) stop.setAttribute("aria-current", "step");
    else stop.removeAttribute("aria-current");
  });
}

function updateLane(progress) {
  const routeProgress = reduceMotion.matches ? 1 : smoothstep(0.015, 0.78, progress);
  const contactProgress = reduceMotion.matches ? 1 : smoothstep(0.84, 0.94, progress);
  const runnerProgress = clamp((progress - 0.08) / 0.76);

  document.documentElement.style.setProperty("--mile-p", progress.toFixed(4));
  document.documentElement.style.setProperty("--route-p", routeProgress.toFixed(4));
  document.documentElement.style.setProperty("--contact-p", contactProgress.toFixed(4));
  const worldZoom = reduceMotion.matches ? 0 : smoothstep(0.015, 0.9, progress);
  document.documentElement.style.setProperty("--world-scale", (1.015 + worldZoom * 0.105).toFixed(4));
  document.documentElement.style.setProperty("--world-lift", `${(-worldZoom * 1.15).toFixed(3)}vh`);
  document.documentElement.style.setProperty("--hero-plate", (1 - smoothstep(0.08, 0.19, progress)).toFixed(4));
  document.documentElement.style.setProperty("--finale-plate", smoothstep(0.8, 0.89, progress).toFixed(4));
  const leftFocusPlate = Math.max(
    smoothstep(0.48, 0.54, progress) * (1 - smoothstep(0.7, 0.74, progress)),
    smoothstep(0.67, 0.72, progress) * (1 - smoothstep(0.85, 0.89, progress)),
  );
  const rightFocusPlate = smoothstep(0.23, 0.28, progress) * (1 - smoothstep(0.39, 0.44, progress));
  document.documentElement.style.setProperty("--left-focus-plate", leftFocusPlate.toFixed(4));
  document.documentElement.style.setProperty("--right-focus-plate", rightFocusPlate.toFixed(4));

  benefitGroups.forEach((group) => {
    const start = Number.parseFloat(group.dataset.benefitStart || "0");
    group.querySelectorAll("[data-benefit]").forEach((item, index) => {
      const itemProgress = reduceMotion.matches ? 1 : smoothstep(start + index * 0.018, start + 0.065 + index * 0.018, progress);
      item.style.setProperty("--item-in", itemProgress.toFixed(4));
    });
  });

  supportAlerts.forEach((alert, index) => {
    const alertProgress = reduceMotion.matches ? 1 : smoothstep(0.525 + index * 0.024, 0.59 + index * 0.024, progress);
    alert.style.setProperty("--alert-in", alertProgress.toFixed(4));
  });

  offerParts.forEach((part, index) => {
    const partProgress = reduceMotion.matches ? 1 : smoothstep(0.695 + index * 0.01, 0.745 + index * 0.01, progress);
    part.style.setProperty("--offer-in", partProgress.toFixed(4));
  });

  mainReveal.style.strokeDashoffset = (1 - routeProgress).toFixed(4);
  exitRoutes.forEach((route, index) => {
    const traceProgress = reduceMotion.matches ? 1 : smoothstep(0.86 + index * 0.018, 0.925 + index * 0.018, progress);
    route.style.strokeDashoffset = (1 - traceProgress).toFixed(4);
  });
  laneMarks.style.strokeDashoffset = (-progress * 0.72).toFixed(4);

  const guideLength = laneGuide.getTotalLength();
  const guidePoint = laneGuide.getPointAtLength(guideLength * runnerProgress);
  const aheadPoint = laneGuide.getPointAtLength(guideLength * clamp(runnerProgress + 0.003));
  const rotation = Math.atan2(aheadPoint.y - guidePoint.y, aheadPoint.x - guidePoint.x) * 180 / Math.PI;
  if (progress > 0.075) {
    laneRunner.setAttribute("transform", `translate(${guidePoint.x.toFixed(2)} ${guidePoint.y.toFixed(2)}) rotate(${rotation.toFixed(2)})`);
  } else {
    laneRunner.removeAttribute("transform");
  }
  laneRunner.style.opacity = String(smoothstep(0.08, 0.15, progress) * (1 - smoothstep(0.88, 0.96, progress)));

  contactExits.forEach((exit, index) => {
    const exitProgress = reduceMotion.matches ? 1 : smoothstep(0.85 + index * 0.02, 0.92 + index * 0.02, progress);
    exit.style.setProperty("--exit-in", exitProgress.toFixed(4));
    exit.tabIndex = exitProgress > 0.45 ? 0 : -1;
  });

  mile.dataset.scVerifyState = `p${Math.round(progress * 24)}:r${Math.round(routeProgress * 18)}:c${Math.round(contactProgress * 8)}`;
  updateRoute(progress);
}

function readProgress() {
  const scrollRange = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
  return clamp(scrollY / scrollRange);
}

let visualProgress = readProgress();
let lastRenderTime = performance.now();

function render(now = performance.now()) {
  pointerX += (pointerTargetX - pointerX) * 0.075;
  pointerY += (pointerTargetY - pointerY) * 0.075;
  document.documentElement.style.setProperty("--pointer-x", pointerX.toFixed(4));
  document.documentElement.style.setProperty("--pointer-y", pointerY.toFixed(4));
  const rawProgress = readProgress();
  const elapsed = Math.min(Math.max(now - lastRenderTime, 0), 64);
  lastRenderTime = now;
  const motionCatchup = reduceMotion.matches ? 1 : 1 - Math.exp(-elapsed / 60);
  visualProgress += (rawProgress - visualProgress) * motionCatchup;
  if (Math.abs(rawProgress - visualProgress) < 0.0001) visualProgress = rawProgress;
  updateLane(visualProgress);
  requestAnimationFrame(render);
}

const rainCanvas = document.querySelector("#rain-field");
const rainContext = rainCanvas.getContext("2d", { alpha: true });
let rainDrops = [];
let rainWidth = 0;
let rainHeight = 0;
let lastScrollY = scrollY;
let scrollEnergy = 0;

function seeded(index, salt) {
  const value = Math.sin(index * 112.37 + salt * 47.11) * 43758.5453;
  return value - Math.floor(value);
}

function sizeRain() {
  const ratio = Math.min(devicePixelRatio || 1, 2);
  const rect = rainCanvas.getBoundingClientRect();
  rainWidth = Math.max(rect.width, 1);
  rainHeight = Math.max(rect.height, 1);
  rainCanvas.width = Math.round(rainWidth * ratio);
  rainCanvas.height = Math.round(rainHeight * ratio);
  rainContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  const count = innerWidth < 700 ? 30 : 62;
  rainDrops = Array.from({ length: count }, (_, index) => ({
    x: seeded(index, 1) * rainWidth,
    y: seeded(index, 2) * rainHeight,
    speed: 0.32 + seeded(index, 3) * 0.82,
    length: 5 + seeded(index, 4) * 16,
    alpha: 0.08 + seeded(index, 5) * 0.25,
  }));
}

function drawRain() {
  if (reduceMotion.matches) return;
  const scrollDelta = Math.abs(scrollY - lastScrollY);
  lastScrollY = scrollY;
  scrollEnergy += (Math.min(scrollDelta / 32, 1) - scrollEnergy) * 0.13;
  rainContext.clearRect(0, 0, rainWidth, rainHeight);
  rainContext.lineWidth = 0.8;
  rainDrops.forEach((drop) => {
    drop.y += drop.speed * (0.55 + scrollEnergy * 4.2);
    drop.x -= drop.speed * (0.14 + scrollEnergy * 0.36);
    if (drop.y > rainHeight + 24 || drop.x < -24) {
      drop.y = -24;
      drop.x = seeded(Math.round(drop.y + drop.length), 8) * rainWidth;
    }
    rainContext.beginPath();
    rainContext.moveTo(drop.x, drop.y);
    rainContext.lineTo(drop.x - drop.length * 0.16, drop.y + drop.length * (0.45 + scrollEnergy * 0.45));
    rainContext.strokeStyle = `rgba(166, 198, 222, ${drop.alpha * (0.55 + scrollEnergy * 0.75)})`;
    rainContext.stroke();
  });
  requestAnimationFrame(drawRain);
}

addEventListener("resize", sizeRain);
sizeRain();
render();
drawRain();
