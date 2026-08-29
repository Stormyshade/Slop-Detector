// function to look for the AI generated label
function AIlabelCheck() {
  // checks for the AI sparkles icon
  const sparkleIcons = document.querySelectorAll(
    "svg.lucide-sparkles"
  );

  for (const icon of sparkleIcons) {
    const container = icon.nextElementSibling;

    if (!container) {
      continue;
    }

    // checks for the "AI generated" text as a fail safe
    const text = container.textContent.toLowerCase();

    if (
      text.includes("ai-generated") ||
      text.includes("ai generated")
    ) {
      return true;
    }
  }

  return false;
}


// warning function
function warnshow() {
  if (document.getElementById("slop-warning")) {
    return;
  }

  const overlay = document.createElement("div");
  overlay.id = "slop-warning";

  // overlay text HTML
  overlay.innerHTML = `
    <div class="slop-warning">

      <img
        class="slop-warning-icon"
        src="${browser.runtime.getURL("warningsymbol.png")}"
        alt="Warning"
      >

      <h1>AI Detected</h1>

      <p>
        The following page likely contains AI Slop,
        this may result in poorly coded content containing bugs
        and/or lower quality visuals/assets.
      </p>

      <div class="slop-warning-buttons">

        <button id="slop-warning-B">
          Go Back
        </button>

        <button id="slop-warning-P">
          Proceed Anyways
        </button>

      </div>

    </div>
  `;

  document.body.appendChild(overlay);

  // Back button
  document
    .getElementById("slop-warning-B")
    .addEventListener("click", () => {
      overlay.remove();
      history.back();
    });

    // Proceed button
    document
      .getElementById("slop-warning-P")
      .addEventListener("click", () => {
        dismissedURL = location.href;
        overlay.remove();
      });
  }

  let dismissedURL = null;
  // checks for AI Label
  function labelCheck() {
    if (location.href === dismissedURL) {
      return;
    }

    if (AIlabelCheck()) {
      warnshow();
    }
  }

  labelCheck();


  let currentURL = location.href;
  let checkTimeout;
  const observer = new MutationObserver(() => {
    clearTimeout(checkTimeout);
    checkTimeout = setTimeout(() => {
      if (location.href !== currentURL) {
        currentURL = location.href;

        const oldWarning = document.getElementById("slop-warning");
        if (oldWarning) {
          oldWarning.remove();
        }
        dismissedURL = null;
      }

      labelCheck();

    }, 300);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
