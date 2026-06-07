const BOSS_SOURCE_NAME = "Boss直聘";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "PARSE_CURRENT_JOB") {
    return false;
  }

  sendResponse({
    job: parseBossJobPage()
  });

  return false;
});

function parseBossJobPage() {
  if (!isBossJobDetailPage(window.location.href)) {
    return getEmptyJob();
  }

  try {
    const title = findFirstText([
      ".job-detail .job-name",
      ".job-banner .job-name",
      ".job-primary .name h1",
      ".job-title .job-name",
      ".job-name",
      "h1"
    ]);
    const company = findFirstText([
      ".job-detail .company-name",
      ".job-banner .company-name",
      ".company-info .company-name",
      ".company-info .name",
      ".job-sec-company .name",
      ".job-company .name",
      ".company-card .name"
    ]);
    const salary = findFirstText([
      ".job-detail .job-salary",
      ".job-banner .job-salary",
      ".job-primary .salary",
      ".job-salary",
      ".salary",
      ".red"
    ]);
    const location =
      findFirstText([
        ".job-address .location-address",
        ".job-location",
        ".job-primary .job-area",
        ".job-area",
        ".company-location"
      ]) || findLocationFromBasicInfo();

    return {
      title,
      company,
      salary: containsPrivateUseCharacters(salary) ? "" : salary,
      location,
      source: BOSS_SOURCE_NAME
    };
  } catch {
    return getEmptyJob();
  }
}

function isBossJobDetailPage(url) {
  try {
    const currentUrl = new URL(url);
    const hostname = currentUrl.hostname.toLowerCase();

    return (
      (hostname.endsWith("zhipin.com") || hostname.endsWith("bosszhipin.com")) &&
      currentUrl.pathname.includes("/job_detail/")
    );
  } catch {
    return false;
  }
}

function findFirstText(selectors) {
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    const text = normalizeText(element?.textContent);

    if (text) {
      return text;
    }
  }

  return "";
}

function findLocationFromBasicInfo() {
  const basicInfoText = findFirstText([
    ".job-primary .info-primary p",
    ".job-banner .info-primary p",
    ".job-detail .job-base-info",
    ".job-detail .job-basic-info"
  ]);

  if (!basicInfoText) {
    return "";
  }

  return extractLocationText(basicInfoText);
}

function extractLocationText(text) {
  const [firstSegment] = normalizeText(text)
    .split(/[|/·]/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  return firstSegment || "";
}

function normalizeText(value) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function containsPrivateUseCharacters(value) {
  return /[\uE000-\uF8FF]/.test(value);
}

function getEmptyJob() {
  return {
    title: "",
    company: "",
    salary: "",
    location: "",
    source: ""
  };
}
