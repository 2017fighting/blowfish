const sitePreference = document.documentElement.getAttribute("data-default-appearance");
const userPreference = localStorage.getItem("appearance");

window.switchThemeEventSet = new Set();
window.initThemeEventSet = new Set();
window.targetAppearance = undefined;

function triggerAppearanceChanged() {
  for (let event of window.switchThemeEventSet) {
    event();
  }
}
function triggerAppearanceInited() {
  for (let event of window.initThemeEventSet) {
    event();
  }
}

if ((sitePreference === "dark" && userPreference === null) || userPreference === "dark") {
  document.documentElement.classList.add("dark");
}

if (document.documentElement.getAttribute("data-auto-appearance") === "true") {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches &&
    userPreference !== "light"
  ) {
    document.documentElement.classList.add("dark");
  }
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    if (event.matches) {
      document.documentElement.classList.add("dark");
      window.targetAppearance = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      window.targetAppearance = "light";
    }
    triggerAppearanceChanged();
  });
}


window.addEventListener("DOMContentLoaded", (event) => {
  const switcher = document.getElementById("appearance-switcher");
  const switcherMobile = document.getElementById("appearance-switcher-mobile");

  const ta = getTargetAppearance()
  window.targetAppearance = ta;
  updateMeta();
  this.updateLogo?.(ta);
  triggerAppearanceChanged();
  triggerAppearanceInited();

  if (switcher) {
    switcher.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
      var targetAppearance = getTargetAppearance();
      localStorage.setItem(
        "appearance",
        targetAppearance
      );
      window.targetAppearance = targetAppearance;
      updateMeta();
      this.updateLogo?.(targetAppearance);
      triggerAppearanceChanged();
    });
    switcher.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      localStorage.removeItem("appearance");
    });
  }
  if (switcherMobile) {
    switcherMobile.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
      var targetAppearance = getTargetAppearance();
      localStorage.setItem(
        "appearance",
        targetAppearance
      );
      window.targetAppearance = targetAppearance;
      updateMeta();
      this.updateLogo?.(targetAppearance);
      triggerAppearanceChanged();
    });
    switcherMobile.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      localStorage.removeItem("appearance");
    });
  }
});


var updateMeta = () => {
  var elem, style;
  elem = document.querySelector('body');
  style = getComputedStyle(elem);
  document.querySelector('meta[name="theme-color"]').setAttribute('content', style.backgroundColor);
}

{{ if and (.Site.Params.Logo) (.Site.Params.SecondaryLogo) }}
{{ $primaryLogo := resources.Get .Site.Params.Logo }}
{{ $secondaryLogo := resources.Get .Site.Params.SecondaryLogo }}
{{ if and ($primaryLogo) ($secondaryLogo) }}
var updateLogo = (targetAppearance) => {
  var imgElems = document.querySelectorAll("img.logo");
  var logoContainers = document.querySelectorAll("span.logo");
  
  targetLogoPath = 
    targetAppearance == "{{ .Site.Params.DefaultAppearance }}" ?
    "{{ $primaryLogo.RelPermalink }}" : "{{ $secondaryLogo.RelPermalink }}"
  for (const elem of imgElems) {
    elem.setAttribute("src", targetLogoPath)
  }

  {{ if eq $primaryLogo.MediaType.SubType "svg" }}
  targetContent = 
    targetAppearance == "{{ .Site.Params.DefaultAppearance }}" ?
    `{{ $primaryLogo.Content | safeHTML }}` : `{{ $secondaryLogo.Content | safeHTML }}`
  for (const container of logoContainers) {
    container.innerHTML = targetContent;
  }
  {{ end }}
}
{{ end }}
{{- end }}

var getTargetAppearance = () => {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

window.addEventListener("DOMContentLoaded", (event) => {
  const scroller = document.getElementById("top-scroller");
  const footer = document.getElementById("site-footer");
  if(scroller && footer && scroller.getBoundingClientRect().top > footer.getBoundingClientRect().top) {
    scroller.hidden = true;
  }
});
