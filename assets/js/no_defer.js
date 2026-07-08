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
  const compatBootstrap = Boolean(window.alFolio && window.alFolio.compatBootstrap);
  const computedTheme =
    typeof determineComputedTheme === "function"
      ? determineComputedTheme()
      : document.documentElement.dataset.theme || "light";

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
