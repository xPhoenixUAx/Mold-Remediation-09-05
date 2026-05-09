(function () {
  const config = window.SITE_CONFIG || {};

  const textBindings = {
    "company-name": config.companyName,
    "company-legal-name": config.companyLegalName,
    "company-id": config.companyId,
    "phone-text": config.phoneDisplay,
    "email-text": config.email,
    "company-address": [config.addressLine1, config.addressLine2].filter(Boolean).join(", "),
    "service-area": config.serviceArea,
    "legal-last-updated": config.legalLastUpdated,
    "business-hours": config.businessHours,
    "footer-text-primary": config.footerTextPrimary,
    "footer-text-secondary": config.footerTextSecondary,
    "disclaimer-short": config.disclaimerShort,
    "disclaimer-full": config.disclaimerFull,
    "cta-primary": config.ctaPrimary,
    "cta-secondary": config.ctaSecondary
  };

  function setText(selector, value) {
    if (!value) return;
    document.querySelectorAll(selector).forEach((node) => {
      node.textContent = value;
    });
  }

  function hydrateConfig() {
    Object.entries(textBindings).forEach(([key, value]) => {
      setText(`[data-${key}]`, value);
    });

    document.querySelectorAll("[data-phone-link]").forEach((node) => {
      node.setAttribute("href", `tel:${config.phone || ""}`);
      if (!node.textContent.trim()) node.textContent = config.phoneDisplay || "";
      if (config.phoneButtonLabel) node.setAttribute("aria-label", config.phoneButtonLabel);
    });

    document.querySelectorAll("[data-email-link]").forEach((node) => {
      node.setAttribute("href", `mailto:${config.email || ""}`);
      if (!node.textContent.trim()) node.textContent = config.email || "";
    });

    document.querySelectorAll("[data-map-embed]").forEach((node) => {
      if (config.mapEmbedUrl) node.setAttribute("src", config.mapEmbedUrl);
      if (config.mapTitle) node.setAttribute("title", config.mapTitle);
    });

    document.querySelectorAll("[data-current-year]").forEach((node) => {
      node.textContent = new Date().getFullYear();
    });

    document.querySelectorAll("[data-copyright-line]").forEach((node) => {
      node.textContent = (config.copyrightLine || "").replace("{year}", new Date().getFullYear());
    });

    if (document.body.dataset.pageTitle && config.companyName) {
      document.title = `${document.body.dataset.pageTitle} | ${config.companyName}`;
    }
  }

  function renderFooter() {
    const mount = document.querySelector("[data-site-footer]");
    if (!mount) return;

    mount.innerHTML = `
      <footer class="site-footer">
        <div class="footer-shell">
          <div class="footer-brand">
            <a class="footer-logo" href="index.html" aria-label="${config.companyName || "Home"}">
              <span class="brand-mark" aria-hidden="true"></span>
              <span data-company-name>${config.companyName || ""}</span>
            </a>
            <p data-footer-text-primary>${config.footerTextPrimary || ""}</p>
            <p class="footer-note" data-footer-text-secondary>${config.footerTextSecondary || ""}</p>
          </div>
          <nav class="footer-column" aria-label="Primary footer navigation">
            <h2>Company</h2>
            <a href="services.html">Services</a>
            <a href="about.html">About</a>
            <a href="contact.html">Contact</a>
            <a href="service-detail.html">Service Framework</a>
          </nav>
          <nav class="footer-column" aria-label="Mold remediation service navigation">
            <h2>Service Groups</h2>
            <a href="mold-inspection-testing.html">Inspection & Testing</a>
            <a href="residential-mold-remediation.html">Residential Remediation</a>
            <a href="commercial-mold-remediation.html">Commercial Remediation</a>
            <a href="emergency-mold-response.html">Emergency Response</a>
            <a href="hvac-air-odor-solutions.html">HVAC, Air & Odor</a>
            <a href="moisture-control-prevention.html">Moisture Prevention</a>
          </nav>
          <div class="footer-column footer-contact">
            <h2>Contact</h2>
            <a href="tel:${config.phone || ""}" data-phone-link>${config.phoneDisplay || ""}</a>
            <a href="mailto:${config.email || ""}" data-email-link>${config.email || ""}</a>
            <span data-company-address>${[config.addressLine1, config.addressLine2].filter(Boolean).join(", ")}</span>
            <span data-business-hours>${config.businessHours || ""}</span>
            <span data-service-area>${config.serviceArea || ""}</span>
          </div>
          <div class="footer-legal">
            <p><strong data-company-legal-name>${config.companyLegalName || ""}</strong> · <span data-company-id>${config.companyId || ""}</span></p>
            <p data-disclaimer-short>${config.disclaimerShort || ""}</p>
            <nav aria-label="Legal footer navigation">
              <a href="privacy.html">Privacy Policy</a>
              <a href="terms.html">Terms of Service</a>
              <a href="cookie.html">Cookie Policy</a>
            </nav>
            <p data-copyright-line>${(config.copyrightLine || "").replace("{year}", new Date().getFullYear())}</p>
          </div>
        </div>
      </footer>
    `;
  }

  function renderHeader() {
    const mount = document.querySelector("[data-site-header]");
    if (!mount || document.querySelector("[data-header]")) return;

    const current = mount.dataset.current || "";
    const services = [
      ["mold-inspection-testing.html", "Inspection & Testing"],
      ["residential-mold-remediation.html", "Residential Remediation"],
      ["commercial-mold-remediation.html", "Commercial Remediation"],
      ["emergency-mold-response.html", "Emergency Response"],
      ["hvac-air-odor-solutions.html", "HVAC, Air & Odor"],
      ["moisture-control-prevention.html", "Moisture Prevention"]
    ];

    const serviceLinks = services.map(([href, label]) => `<a href="${href}">${label}</a>`).join("");
    const navLinks = `
      <a href="index.html"${current === "home" ? ' aria-current="page"' : ""}>Home</a>
      <div class="nav-dropdown">
        <a class="nav-dropdown-trigger" href="services.html"${current === "services" ? ' aria-current="page"' : ""}>
          Services
          <span aria-hidden="true"></span>
        </a>
        <div class="nav-dropdown-panel" aria-label="Service pages">
          <a class="dropdown-overview" href="services.html">All services</a>
          ${serviceLinks}
        </div>
      </div>
      <a href="about.html"${current === "about" ? ' aria-current="page"' : ""}>About</a>
      <a href="contact.html"${current === "contact" ? ' aria-current="page"' : ""}>Contact</a>
    `;

    const mobileLinks = `
      <a href="index.html">Home</a>
      <a href="services.html">Services</a>
      <div class="mobile-service-links">
        ${serviceLinks}
      </div>
      <a href="about.html">About</a>
      <a href="contact.html">Contact</a>
    `;

    mount.innerHTML = `
      <header class="site-header" data-header>
        <div class="header-shell">
          <a class="brand" href="index.html" aria-label="Home">
            <span class="brand-mark" aria-hidden="true"></span>
            <span data-company-name>${config.companyName || ""}</span>
          </a>
          <nav class="desktop-nav" aria-label="Primary navigation">${navLinks}</nav>
          <div class="header-actions">
            <a class="phone-link" href="tel:${config.phone || ""}" data-phone-link>${config.phoneDisplay || ""}</a>
            <a class="btn btn-primary" href="contact.html" data-cta-primary>${config.ctaPrimary || ""}</a>
            <button class="menu-toggle" type="button" data-menu-toggle aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
              <span aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </header>
      <div class="mobile-menu" id="mobile-menu" data-mobile-menu hidden>
        <div class="mobile-menu-inner">
          <div class="mobile-menu-top">
            <a class="brand" href="index.html">
              <span class="brand-mark" aria-hidden="true"></span>
              <span data-company-name>${config.companyName || ""}</span>
            </a>
            <button class="menu-close" type="button" data-menu-close aria-label="Close menu"><span aria-hidden="true"></span></button>
          </div>
          <nav class="mobile-links" aria-label="Mobile navigation">${mobileLinks}</nav>
          <div class="mobile-menu-footer">
            <p data-disclaimer-short>${config.disclaimerShort || ""}</p>
            <a class="btn btn-light" href="contact.html" data-cta-primary>${config.ctaPrimary || ""}</a>
          </div>
        </div>
      </div>
    `;
  }

  function initHeader() {
    const header = document.querySelector("[data-header]");
    const toggle = document.querySelector("[data-menu-toggle]");
    const overlay = document.querySelector("[data-mobile-menu]");
    const closeButton = document.querySelector("[data-menu-close]");
    if (!header) return;

    const setScrolled = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    setScrolled();
    window.addEventListener("scroll", setScrolled, { passive: true });

    if (!toggle || !overlay) return;

    const focusableSelector = "a, button, input, textarea, select, [tabindex]:not([tabindex='-1'])";
    let lastFocused = null;

    const openMenu = () => {
      lastFocused = document.activeElement;
      document.body.classList.add("menu-open");
      overlay.classList.add("is-open");
      overlay.removeAttribute("hidden");
      toggle.setAttribute("aria-expanded", "true");
      const firstItem = overlay.querySelector(focusableSelector);
      if (firstItem) firstItem.focus({ preventScroll: true });
    };

    const closeMenu = () => {
      document.body.classList.remove("menu-open");
      overlay.classList.remove("is-open");
      overlay.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", "false");
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus({ preventScroll: true });
      }
    };

    toggle.addEventListener("click", openMenu);
    closeButton?.addEventListener("click", closeMenu);
    overlay.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && overlay.classList.contains("is-open")) closeMenu();
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const target = document.querySelector(anchor.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        const headerHeight = document.querySelector("[data-header]")?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 18;
        window.scrollTo({ top, behavior: "smooth" });
      });
    });
  }

  function initReveal() {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
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
      { threshold: 0.14 }
    );
    items.forEach((item) => observer.observe(item));
  }

  function initFaqs() {
    document.querySelectorAll("[data-faq]").forEach((faq) => {
      const button = faq.querySelector("button");
      const panel = faq.querySelector("[data-faq-panel]");
      if (!button || !panel) return;
      panel.hidden = false;
      panel.style.maxHeight = "0px";
      button.addEventListener("click", () => {
        const isOpen = faq.classList.toggle("is-open");
        button.setAttribute("aria-expanded", String(isOpen));
        panel.style.maxHeight = isOpen ? `${panel.scrollHeight}px` : "0px";
      });
    });
  }

  function initForms() {
    document.querySelectorAll("[data-inquiry-form]").forEach((form) => {
      const status = form.querySelector("[data-form-status]");
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (status) {
          status.textContent =
            "Thanks. This demo form is ready for a CRM or call center connection before launch.";
        }
      });
    });
  }

  function initTestimonialSliders() {
    document.querySelectorAll("[data-testimonial-slider]").forEach((slider) => {
      const track = slider.querySelector("[data-slider-track]");
      const slides = Array.from(slider.querySelectorAll("[data-slide]"));
      const prev = slider.querySelector("[data-slider-prev]");
      const next = slider.querySelector("[data-slider-next]");
      const dotsMount = slider.querySelector("[data-slider-dots]");
      if (!track || !slides.length || !prev || !next || !dotsMount) return;

      let active = 0;
      let pages = 1;
      let perView = 1;
      let dots = [];

      const getPerView = () => {
        const value = getComputedStyle(track).getPropertyValue("--slides-per-view").trim();
        return Math.max(1, Number.parseInt(value, 10) || 1);
      };

      const renderDots = () => {
        dotsMount.innerHTML = "";
        dots = Array.from({ length: pages }, (_, index) => {
          const dot = document.createElement("button");
          dot.type = "button";
          dot.className = "slider-dot";
          dot.setAttribute("aria-label", `Show testimonial group ${index + 1}`);
          dot.addEventListener("click", () => goTo(index));
          dotsMount.appendChild(dot);
          return dot;
        });
      };

      const update = () => {
        const slideWidth = slides[0].getBoundingClientRect().width;
        const gap = Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
        track.style.transform = `translateX(${-active * (slideWidth + gap) * perView}px)`;
        dots.forEach((dot, index) => {
          dot.classList.toggle("is-active", index === active);
          dot.setAttribute("aria-current", index === active ? "true" : "false");
        });
      };

      const rebuild = () => {
        perView = getPerView();
        pages = Math.max(1, Math.ceil(slides.length / perView));
        active = Math.min(active, pages - 1);
        renderDots();
        update();
      };

      function goTo(index) {
        if (index < 0) active = pages - 1;
        else if (index > pages - 1) active = 0;
        else active = index;
        update();
      }

      prev.addEventListener("click", () => goTo(active - 1));
      next.addEventListener("click", () => goTo(active + 1));
      window.addEventListener("resize", rebuild, { passive: true });
      rebuild();
    });
  }

  function initCookieBanner() {
    const storageKey = "mrn_cookie_choice";
    const existingChoice = localStorage.getItem(storageKey);
    if (existingChoice) return;

    const banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Cookie preferences");
    banner.innerHTML = `
      <div class="cookie-banner-copy">
        <span class="eyebrow">Cookie preferences</span>
        <p>
          We use essential cookies for site function and may use analytics to understand what helps visitors.
          You can accept, decline, or manage preferences.
        </p>
        <div class="cookie-options" data-cookie-options hidden>
          <label><input type="checkbox" checked disabled> Essential cookies</label>
          <label><input type="checkbox" data-cookie-analytics> Analytics cookies</label>
        </div>
        <a href="cookie.html">Read Cookie Policy</a>
      </div>
      <div class="cookie-banner-actions">
        <button class="btn btn-primary" type="button" data-cookie-accept>Accept</button>
        <button class="btn btn-outline-light cookie-manage" type="button" data-cookie-manage>Manage</button>
        <button class="btn btn-ghost" type="button" data-cookie-decline>Decline</button>
      </div>
    `;

    document.body.appendChild(banner);

    const options = banner.querySelector("[data-cookie-options]");
    const analytics = banner.querySelector("[data-cookie-analytics]");
    const accept = banner.querySelector("[data-cookie-accept]");
    const manage = banner.querySelector("[data-cookie-manage]");
    const decline = banner.querySelector("[data-cookie-decline]");

    const saveChoice = (choice) => {
      localStorage.setItem(storageKey, JSON.stringify({ choice, analytics: Boolean(analytics?.checked), savedAt: new Date().toISOString() }));
      banner.classList.add("is-hiding");
      window.setTimeout(() => banner.remove(), 220);
    };

    accept?.addEventListener("click", () => {
      if (analytics) analytics.checked = true;
      saveChoice("accepted");
    });

    decline?.addEventListener("click", () => {
      if (analytics) analytics.checked = false;
      saveChoice("declined");
    });

    manage?.addEventListener("click", () => {
      const isHidden = options?.hasAttribute("hidden");
      if (!options) return;
      if (isHidden) {
        options.removeAttribute("hidden");
        manage.textContent = "Save";
      } else {
        saveChoice("custom");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
    hydrateConfig();
    initHeader();
    initSmoothScroll();
    initReveal();
    initFaqs();
    initForms();
    initTestimonialSliders();
    initCookieBanner();
  });
})();
