/* Replace these three sample values with the real AU ELD Service contacts before launch. */
const CONTACT = {
  phoneDisplay: "+1 (555) 014-7824",
  phoneHref: "+15550147824",
  email: "support@aueldservice.com",
  telegramHandle: "@AUELDService",
  telegramUrl: "https://t.me/AUELDService",
};

const updateContacts = () => {
  document.querySelectorAll('[data-contact="phone-link"]').forEach((link) => {
    link.href = `tel:${CONTACT.phoneHref}`;
  });
  document.querySelectorAll('[data-contact="phone-text"]').forEach((el) => {
    el.textContent = CONTACT.phoneDisplay;
  });
  document.querySelectorAll('[data-contact="email-link"]').forEach((link) => {
    link.href = `mailto:${CONTACT.email}`;
  });
  document.querySelectorAll('[data-contact="email-text"]').forEach((el) => {
    el.textContent = CONTACT.email;
  });
  document.querySelectorAll('[data-contact="telegram-link"]').forEach((link) => {
    link.href = CONTACT.telegramUrl;
  });
  document.querySelectorAll('[data-contact="telegram-text"]').forEach((el) => {
    el.textContent = CONTACT.telegramHandle;
  });
};

updateContacts();

const header = document.querySelector("[data-header]");
const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-nav");

const closeMenu = () => {
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealElements = document.querySelectorAll(".reveal:not(.is-visible)");

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  revealElements.forEach((element) => revealObserver.observe(element));
}

const textMotionSelectors = [
  ".brand__name",
  ".site-nav a",
  ".header-call span",
  ".contact-dock__label",
  ".eyebrow",
  ".hero__lede",
  ".button > span",
  ".text-link",
  ".hero__signal strong",
  ".hero__signal span",
  ".section-kicker",
  ".intro__copy > p",
  ".service-card__meta",
  ".service-card h3",
  ".service-card > p:last-child",
  ".process-steps__number",
  ".process-steps h3",
  ".process-steps p",
  ".contact__copy > p",
  ".contact-links small",
  ".contact-links strong",
  ".contact-form__head > span",
  ".contact-form__status",
  ".contact-form label > span",
  ".form-note",
  ".site-footer p",
];

const textMotionTargets = [...new Set(textMotionSelectors.flatMap((selector) => [...document.querySelectorAll(selector)]))];
const utilityTextSelector = ".eyebrow, .section-kicker, .service-card__meta, .contact-links small, .contact-form label > span, .contact-form__status";
const actionTextSelector = ".site-nav a, .header-call span, .contact-dock__label, .button > span, .text-link";
const metricTextSelector = ".hero__signal strong, .hero__signal span, .process-steps__number";

textMotionTargets.forEach((element, index) => {
  element.classList.add("text-motion");
  if (element.matches(".service-card__meta")) element.classList.add("service-text", "service-text--label");
  else if (element.matches(".service-card h3")) element.classList.add("service-text", "service-text--title");
  else if (element.matches(".service-card > p:last-child")) element.classList.add("service-text", "service-text--copy");
  else if (element.matches(utilityTextSelector)) element.classList.add("text-motion--utility");
  else if (element.matches(actionTextSelector)) element.classList.add("text-motion--action");
  else if (element.matches(metricTextSelector)) element.classList.add("text-motion--metric");
  else element.classList.add("text-motion--body");
  element.style.setProperty("--text-delay", `${(index % 5) * 55}ms`);
});

document.querySelectorAll(".service-card").forEach((card, cardIndex) => {
  card.querySelectorAll(".service-text").forEach((element, partIndex) => {
    element.style.setProperty("--service-delay", `${cardIndex * 75 + partIndex * 145}ms`);
  });
});

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  textMotionTargets.forEach((element) => element.classList.add("is-text-visible"));
} else {
  const textMotionObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-text-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px" }
  );
  textMotionTargets.filter((element) => !element.classList.contains("service-text")).forEach((element) => textMotionObserver.observe(element));

  const serviceTextObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".service-text").forEach((element) => element.classList.add("is-text-visible"));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -2% 0px" }
  );
  document.querySelectorAll(".service-card").forEach((card) => serviceTextObserver.observe(card));
}

const scrollScenes = [...document.querySelectorAll(".section")];
const heroScene = document.querySelector(".hero");
let motionFrame = null;

const updateScrollScenes = () => {
  motionFrame = null;
  const viewportHeight = window.innerHeight;
  const heroProgress = Math.min(1, Math.max(0, window.scrollY / Math.max(heroScene.offsetHeight, 1)));
  heroScene.style.setProperty("--hero-shift", `${heroProgress * 46}px`);
  heroScene.style.setProperty("--scene-x", `${heroProgress * 72}px`);
  heroScene.style.setProperty("--scene-x-neg", `${heroProgress * -46}px`);
  heroScene.style.setProperty("--scene-y", `${heroProgress * -34}px`);
  heroScene.style.setProperty("--scene-y-neg", `${heroProgress * 18}px`);
  heroScene.style.setProperty("--route-dash", `${heroProgress * -280}px`);

  scrollScenes.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / (viewportHeight + rect.height)));
    const centered = progress - 0.5;
    const direction = index % 2 === 0 ? 1 : -1;
    const x = centered * 150 * direction;
    const y = centered * -72;

    section.style.setProperty("--scene-x", `${x}px`);
    section.style.setProperty("--scene-x-neg", `${x * -0.7}px`);
    section.style.setProperty("--scene-y", `${y}px`);
    section.style.setProperty("--scene-y-neg", `${y * -0.45}px`);
    section.style.setProperty("--scene-rotate", `${-12 + progress * 7}deg`);
    section.style.setProperty("--route-dash", `${progress * -420}px`);
  });
};

const requestScrollSceneUpdate = () => {
  if (motionFrame === null) motionFrame = window.requestAnimationFrame(updateScrollScenes);
};

if (!prefersReducedMotion) {
  updateScrollScenes();
  window.addEventListener("scroll", requestScrollSceneUpdate, { passive: true });
  window.addEventListener("resize", requestScrollSceneUpdate);
}

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const cubicPoint = (p0, p1, p2, p3, t) => {
  const inverse = 1 - t;
  return {
    x: inverse ** 3 * p0.x + 3 * inverse ** 2 * t * p1.x + 3 * inverse * t ** 2 * p2.x + t ** 3 * p3.x,
    y: inverse ** 3 * p0.y + 3 * inverse ** 2 * t * p1.y + 3 * inverse * t ** 2 * p2.y + t ** 3 * p3.y,
  };
};

const roundedRect = (context, x, y, width, height, radius) => {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.lineTo(x + width - r, y);
  context.quadraticCurveTo(x + width, y, x + width, y + r);
  context.lineTo(x + width, y + height - r);
  context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  context.lineTo(x + r, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - r);
  context.lineTo(x, y + r);
  context.quadraticCurveTo(x, y, x + r, y);
  context.closePath();
};

class DispatchAtmosphere {
  constructor(section, index) {
    this.section = section;
    this.index = index;
    this.isLight = section.classList.contains("intro") || section.classList.contains("process");
    this.canvas = document.createElement("canvas");
    this.canvas.className = `dispatch-canvas dispatch-canvas--${this.isLight ? "light" : "dark"}`;
    this.canvas.setAttribute("aria-hidden", "true");
    this.context = this.canvas.getContext("2d");
    this.visible = true;
    this.width = 0;
    this.height = 0;
    section.insertBefore(this.canvas, section.firstChild);
    this.resize();
  }

  resize() {
    const bounds = this.section.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 640 ? 1.25 : 1.5);
    this.width = Math.max(1, bounds.width);
    this.height = Math.max(1, this.section.offsetHeight);
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);
    this.context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  drawPlate(x, y, width, height, drift, palette) {
    const ctx = this.context;
    ctx.save();
    ctx.translate(x + drift, y);
    ctx.rotate((this.index % 2 ? -1 : 1) * 0.025);
    roundedRect(ctx, 0, 0, width, height, 16);
    ctx.fillStyle = palette.plate;
    ctx.fill();
    ctx.strokeStyle = palette.plateEdge;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = palette.plateLine;
    roundedRect(ctx, 18, 18, width * 0.46, 4, 2);
    ctx.fill();
    ctx.globalAlpha = 0.55;
    roundedRect(ctx, 18, 32, width * 0.28, 3, 2);
    ctx.fill();
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(width - 23, 23, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  draw(now) {
    if (!this.visible) return;
    const ctx = this.context;
    const width = this.width;
    const height = this.height;
    const rect = this.section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const progress = clamp01((viewportHeight - rect.top) / (viewportHeight + rect.height));
    const pulse = prefersReducedMotion ? 0.5 : (Math.sin(now * 0.0014 + this.index) + 1) / 2;
    const timeShift = prefersReducedMotion ? 0 : now * 0.000012;
    const compact = width < 640;
    const palette = this.isLight
      ? {
          wash: "rgba(0, 82, 170, 0.13)",
          beam: "rgba(0, 92, 190, 0.08)",
          line: "rgba(0, 70, 150, 0.34)",
          bright: "rgba(0, 78, 170, 0.6)",
          core: "rgba(0, 55, 125, 0.78)",
          plate: "rgba(0, 73, 154, 0.065)",
          plateEdge: "rgba(0, 66, 145, 0.18)",
          plateLine: "rgba(0, 70, 155, 0.38)",
        }
      : {
          wash: "rgba(0, 92, 205, 0.18)",
          beam: "rgba(34, 126, 231, 0.12)",
          line: "rgba(53, 137, 226, 0.42)",
          bright: "rgba(94, 174, 255, 0.92)",
          core: "rgba(224, 240, 255, 0.98)",
          plate: "rgba(32, 105, 186, 0.09)",
          plateEdge: "rgba(101, 174, 250, 0.22)",
          plateLine: "rgba(119, 185, 255, 0.5)",
        };

    ctx.clearRect(0, 0, width, height);
    const side = this.index % 2 === 0 ? 1 : -1;
    const anchorX = width * (side > 0 ? 0.76 : 0.24) + (progress - 0.5) * width * 0.12 * side;
    const anchorY = height * (0.42 + (this.index % 3) * 0.07) - progress * 44;

    const wash = ctx.createRadialGradient(anchorX, anchorY, 0, anchorX, anchorY, Math.max(width, height) * 0.58);
    wash.addColorStop(0, palette.wash);
    wash.addColorStop(0.46, this.isLight ? "rgba(0,82,170,.035)" : "rgba(0,82,190,.05)");
    wash.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(anchorX, anchorY);
    ctx.rotate(-0.42 + progress * 0.75);
    const sweep = ctx.createLinearGradient(0, 0, width * 0.42, 0);
    sweep.addColorStop(0, palette.beam);
    sweep.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = sweep;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width * 0.44, -height * 0.12);
    ctx.lineTo(width * 0.44, height * 0.12);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    const ringCount = compact ? 3 : 5;
    for (let ring = 0; ring < ringCount; ring += 1) {
      const radius = (compact ? 56 : 76) + ring * (compact ? 38 : 54) + pulse * 8;
      ctx.beginPath();
      ctx.ellipse(anchorX, anchorY, radius, radius * 0.56, -0.16, 0, Math.PI * 2);
      ctx.strokeStyle = palette.line;
      ctx.globalAlpha = Math.max(0.08, 0.34 - ring * 0.045);
      ctx.lineWidth = ring === 0 ? 1.4 : 0.8;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    const p0 = { x: -width * 0.08, y: height * (this.isLight ? 0.82 : 0.72 - this.index * 0.015) };
    const p1 = { x: width * 0.26, y: height * (this.isLight ? 0.7 : 0.47 + progress * 0.08) };
    const p2 = { x: width * 0.54, y: height * (this.isLight ? 0.84 : 0.87 - progress * 0.18) };
    const p3 = { x: width * 1.08, y: height * (this.isLight ? 0.56 : 0.25 + this.index * 0.02) };

    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    ctx.strokeStyle = palette.line;
    ctx.lineWidth = compact ? 1.4 : 2;
    ctx.shadowColor = palette.bright;
    ctx.shadowBlur = compact ? 5 : 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    const packetCount = compact ? 8 : 15;
    for (let packet = 0; packet < packetCount; packet += 1) {
      const t = (packet / packetCount + progress * 0.48 + timeShift) % 1;
      const point = cubicPoint(p0, p1, p2, p3, t);
      const ahead = cubicPoint(p0, p1, p2, p3, Math.min(1, t + 0.008));
      const angle = Math.atan2(ahead.y - point.y, ahead.x - point.x);
      const packetAlpha = 0.28 + ((packet * 7) % 5) * 0.1;
      ctx.save();
      ctx.translate(point.x, point.y);
      ctx.rotate(angle);
      ctx.fillStyle = palette.bright;
      ctx.globalAlpha = packetAlpha;
      ctx.shadowColor = palette.bright;
      ctx.shadowBlur = packet % 4 === 0 ? 12 : 4;
      roundedRect(ctx, -5, -2, packet % 4 === 0 ? 18 : 10, packet % 4 === 0 ? 4 : 3, 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    [0.23, 0.57, 0.82].forEach((position, nodeIndex) => {
      const node = cubicPoint(p0, p1, p2, p3, clamp01(position + (progress - 0.5) * 0.025));
      const nodeRadius = ((compact ? 3.5 : 5) + (nodeIndex === 1 ? pulse * 3 : 0)) * (this.isLight ? 0.68 : 1);
      const glowScale = this.isLight ? 4.5 : 7;
      const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, nodeRadius * glowScale);
      glow.addColorStop(0, palette.core);
      glow.addColorStop(0.18, palette.bright);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius * glowScale, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = palette.core;
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!compact && !this.isLight) {
      const drift = (progress - 0.5) * 66 * side;
      this.drawPlate(width * (side > 0 ? 0.08 : 0.72), height * 0.2, 220, 62, drift, palette);
      this.drawPlate(width * (side > 0 ? 0.14 : 0.66), height * 0.29, 165, 48, drift * 0.55, palette);
    }
  }
}

const atmosphereSections = [heroScene, ...scrollScenes];
const dispatchAtmospheres = atmosphereSections.map((section, index) => new DispatchAtmosphere(section, index));
const atmosphereObserver = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    const field = dispatchAtmospheres.find((item) => item.section === entry.target);
    if (field) field.visible = entry.isIntersecting;
  }),
  { rootMargin: "20% 0px" }
);
dispatchAtmospheres.forEach((field) => atmosphereObserver.observe(field.section));

let lastAtmosphereFrame = 0;
const renderDispatchAtmosphere = (now = 0) => {
  if (prefersReducedMotion || now - lastAtmosphereFrame > 32) {
    dispatchAtmospheres.forEach((field) => field.draw(now));
    lastAtmosphereFrame = now;
  }
  if (!prefersReducedMotion) window.requestAnimationFrame(renderDispatchAtmosphere);
};
renderDispatchAtmosphere();

window.addEventListener("resize", () => {
  dispatchAtmospheres.forEach((field) => field.resize());
});

document.querySelector("[data-year]").textContent = new Date().getFullYear();

const contactForm = document.querySelector("#contact-form");
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(contactForm));
  const subject = encodeURIComponent(`Callback request from ${values.name}`);
  const body = encodeURIComponent(
    `Name: ${values.name}\nCompany: ${values.company || "Not provided"}\nReply to: ${values.replyTo}\n\nRequest:\n${values.message || "Please contact me."}`
  );
  window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
});
