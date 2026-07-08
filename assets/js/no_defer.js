const installSiteStyleOverrides = () => {
  const style = document.createElement("style");
  style.textContent = `
    :root {
      --soomi-link-color: #003b73;
      --soomi-link-hover-color: #002b55;
      --soomi-separator-color: #111111;
      --global-theme-color: var(--soomi-link-color) !important;
      --global-hover-color: var(--soomi-link-hover-color) !important;
      --global-link-color: var(--soomi-link-color) !important;
    }

    html[data-theme="dark"],
    html[data-theme-setting="dark"],
    [data-theme="dark"] {
      --soomi-link-color: #7dbdff;
      --soomi-link-hover-color: #a9d4ff;
      --soomi-separator-color: #d7dce2;
    }

    a,
    a:hover {
      color: var(--soomi-link-color);
    }

    .navbar a,
    .navbar .nav-link,
    .navbar .navbar-brand {
      color: var(--soomi-link-color) !important;
    }

    .post h1 strong,
    .post h1 b,
    .post h1 span,
    .post h1 .font-weight-bold,
    .post-title span,
    .post-title .font-weight-bold {
      font-weight: 400 !important;
    }

    ol.bibliography .author a,
    ol.bibliography .authors a,
    .publications .author a,
    .publications .authors a {
      color: inherit !important;
      border-bottom: 0 !important;
      text-decoration: none !important;
    }

    ol.bibliography .abbr,
    ol.bibliography .abbr *,
    .publications .abbr,
    .publications .abbr * {
      color: #ffffff !important;
    }

    .profile img {
      width: min(100%, 280px) !important;
      max-width: 280px !important;
      height: auto !important;
    }

    .post h2 {
      margin-top: 2.8rem;
      margin-bottom: 1.4rem;
    }

    .profile-socials {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-top: 1.25rem;
      margin-bottom: 2.6rem;
      font-size: 1rem;
    }

    .profile-socials a,
    .profile-socials span {
      color: var(--soomi-link-color) !important;
      line-height: 1;
    }

    .profile-socials a,
    .profile-social-cv {
      display: inline-flex;
      align-items: center;
      gap: 0.22rem;
      text-decoration: none !important;
      font-weight: 400;
    }

    .profile-socials i {
      font-size: 0.95em;
    }

    .profile-social-separator {
      color: var(--soomi-separator-color) !important;
      margin: 0 0.15rem;
    }

    .pub-self-author {
      text-decoration: underline;
      text-decoration-thickness: 1.5px;
      text-underline-offset: 3px;
    }

    .news-logo {
      display: inline-block;
      height: 0.82em;
      width: auto;
      margin: 0 0.12rem;
      vertical-align: -0.04em;
    }

    .news-logo-postech {
      height: 0.72em;
    }
  `;
  document.head.appendChild(style);
};

const normalizeHomepageHeadings = () => {
  document.querySelectorAll("h1, h2").forEach((heading) => {
    const text = heading.textContent.trim().toLowerCase();
    if (text === "news") heading.textContent = "News";
    if (text === "selected publications") heading.textContent = "Publications";
  });
};

const normalizeProfileName = () => {
  document.querySelectorAll("h1").forEach((heading) => {
    const text = heading.textContent.trim().replace(/\s+/g, " ");
    if (text !== "Soomi Jeong") return;

    heading.textContent = "Soomi Jeong";
    heading.style.fontWeight = "400";
  });
};

const normalizeNewsDates = () => {
  document.querySelectorAll("td, th, span").forEach((element) => {
    const text = element.textContent.trim();
    const monthOnly = text.replace(/^([A-Z][a-z]{2}) [0-9]{1,2}, ([0-9]{4})$/, "$1 $2");
    if (monthOnly !== text) element.textContent = monthOnly;
  });
};

const normalizePublicationVenues = () => {
  const venuePattern = /(?:^|\b)In\s+([A-Z0-9]+),\s*([0-9]{4})/;

  document.querySelectorAll("ol.bibliography, .publications").forEach((section) => {
    section.querySelectorAll("em, i, p, span").forEach((venue) => {
      const canReplaceElement = venue.childElementCount === 0 || ["EM", "I"].includes(venue.tagName);
      if (!canReplaceElement) return;

      const text = venue.textContent.trim().replace(/\s+/g, " ");
      const normalized = text.replace(venuePattern, "$1 $2");
      if (normalized !== text) venue.textContent = normalized;
    });

    const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node = walker.nextNode();

    while (node) {
      textNodes.push(node);
      node = walker.nextNode();
    }

    textNodes.forEach((textNode) => {
      textNode.nodeValue = textNode.nodeValue.replace(/\bIn\s+([A-Z0-9]+),\s*([0-9]{4})/g, "$1 $2");
    });
  });
};

const highlightSelfAuthors = () => {
  document.querySelectorAll("ol.bibliography, .publications").forEach((section) => {
    const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node = walker.nextNode();

    while (node) {
      textNodes.push(node);
      node = walker.nextNode();
    }

    textNodes.forEach((textNode) => {
      if (!textNode.nodeValue.includes("Soomi Jeong")) return;
      if (textNode.parentElement?.classList.contains("pub-self-author")) return;

      const fragment = document.createDocumentFragment();
      const parts = textNode.nodeValue.split("Soomi Jeong");

      parts.forEach((part, index) => {
        if (part) fragment.appendChild(document.createTextNode(part));
        if (index === parts.length - 1) return;

        const selfAuthor = document.createElement("span");
        selfAuthor.className = "pub-self-author";
        selfAuthor.textContent = "Soomi Jeong";
        fragment.appendChild(selfAuthor);
      });

      textNode.parentNode.replaceChild(fragment, textNode);
    });
  });
};

const normalizePublicationButtons = () => {
  document.querySelectorAll("ol.bibliography a, .publications a").forEach((link) => {
    const text = link.textContent.trim().toLowerCase();
    if (text === "html") link.textContent = "Paper";
    if (text === "website") link.textContent = "Project page";
  });
};

const disablePlaceholderLinks = () => {
  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.removeAttribute("href");
    link.setAttribute("aria-disabled", "true");
    link.style.cursor = "default";
  });
};

installSiteStyleOverrides();

if (typeof determineThemeSetting === "function" && determineThemeSetting() === "system") {
  localStorage.setItem("theme", "light");
  document.documentElement.setAttribute("data-theme-setting", "light");
  if (typeof applyTheme === "function") {
    applyTheme();
  }
}

if (typeof toggleThemeSetting === "function") {
  toggleThemeSetting = () => {
    const nextTheme = determineComputedTheme() === "dark" ? "light" : "dark";
    setThemeSetting(nextTheme);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  normalizeProfileName();
  normalizeHomepageHeadings();
  normalizeNewsDates();
  normalizePublicationVenues();
  highlightSelfAuthors();
  normalizePublicationButtons();
  disablePlaceholderLinks();
  window.setTimeout(normalizePublicationVenues, 250);

  const compatBootstrap = Boolean(window.alFolio && window.alFolio.compatBootstrap);
  const computedTheme = typeof determineComputedTheme === "function" ? determineComputedTheme() : document.documentElement.dataset.theme || "light";

  document.querySelectorAll("table").forEach((table) => {
    if (computedTheme === "dark") {
      table.classList.add("table-dark");
    } else {
      table.classList.remove("table-dark");
    }

    const insideExcludedParent =
      table.closest('[class*="news"]') ||
      table.closest('[class*="card"]') ||
      table.closest('[class*="archive"]') ||
      table.closest("pre") ||
      table.closest("code");

    if (!insideExcludedParent) {
      table.classList.add("table", "table-hover");
      table.parentElement?.classList.add("table-responsive");

      if (compatBootstrap) {
        table.setAttribute("data-toggle", "table");
      }
    }
  });
});
