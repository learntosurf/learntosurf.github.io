const installSiteStyleOverrides = () => {
  const style = document.createElement("style");
  style.textContent = `
    :root {
      --global-theme-color: #003b73 !important;
      --global-hover-color: #002b55 !important;
      --global-link-color: #003b73 !important;
    }

    a,
    a:hover {
      color: #003b73;
    }

    .navbar a,
    .navbar .nav-link,
    .navbar .navbar-brand {
      color: #003b73 !important;
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
    const monthOnly = text.replace(/^([A-Z][a-z]{2}) 01, ([0-9]{4})$/, "$1 $2");
    if (monthOnly !== text) element.textContent = monthOnly;
  });
};

const normalizePublicationVenues = () => {
  document.querySelectorAll("ol.bibliography, .publications").forEach((section) => {
    const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node = walker.nextNode();

    while (node) {
      textNodes.push(node);
      node = walker.nextNode();
    }

    textNodes.forEach((textNode) => {
      textNode.nodeValue = textNode.nodeValue.replace("In ICML", "ICML").replace(", 2026", " 2026");
    });
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
