(() => {
  "use strict";

  const root = document.documentElement;
  const header = document.querySelector("[data-header]");
  const revealItems = [...document.querySelectorAll("[data-reveal]")];
  const signalBoard = document.querySelector("[data-signal-board]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");

  let scrollFrame = 0;
  let pointerFrame = 0;
  let pointerX = 0;
  let pointerY = 0;

  const setYear = () => {
    document.querySelectorAll("[data-year]").forEach((node) => {
      node.textContent = String(new Date().getFullYear());
    });
  };

  const updateScrollState = () => {
    scrollFrame = 0;
    const scrollable = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
    const progress = Math.min(Math.max(scrollY / scrollable, 0), 1);

    root.style.setProperty("--scroll-p", progress.toFixed(4));
    header?.classList.toggle("is-scrolled", scrollY > 30);
  };

  const requestScrollUpdate = () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollState);
  };

  const updatePointer = () => {
    pointerFrame = 0;
    root.style.setProperty("--pointer-x", pointerX.toFixed(3));
    root.style.setProperty("--pointer-y", pointerY.toFixed(3));
  };

  const requestPointerUpdate = (event) => {
    if (!finePointer.matches || reducedMotion.matches) return;
    pointerX = event.clientX / innerWidth - 0.5;
    pointerY = event.clientY / innerHeight - 0.5;
    if (!pointerFrame) pointerFrame = requestAnimationFrame(updatePointer);
  };

  const prepareRevealTiming = () => {
    document.querySelectorAll("section").forEach((section) => {
      const items = [...section.querySelectorAll("[data-reveal]")];
      items.forEach((item, index) => {
        const kind = item.dataset.reveal;
        const groupDelay = kind === "signal" ? (index % 3) * 40 : (index % 3) * 55;
        item.style.transitionDelay = `${groupDelay}ms`;
      });
    });
  };

  const startRevealObserver = () => {
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      signalBoard?.classList.add("is-live");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );

    revealItems.forEach((item) => observer.observe(item));

    if (signalBoard) {
      const boardObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          signalBoard.classList.add("is-live");
          boardObserver.disconnect();
        },
        { threshold: 0.22 }
      );
      boardObserver.observe(signalBoard);
    }
  };

  const showInitialViewport = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        revealItems.forEach((item) => {
          if (item.getBoundingClientRect().top < innerHeight * 0.96) {
            item.classList.add("is-visible");
          }
        });
      });
    });
  };

  const init = () => {
    setYear();
    prepareRevealTiming();
    updateScrollState();
    startRevealObserver();
    showInitialViewport();

    addEventListener("scroll", requestScrollUpdate, { passive: true });
    addEventListener("resize", requestScrollUpdate, { passive: true });
    addEventListener("pointermove", requestPointerUpdate, { passive: true });
  };

  init();
})();
