const BOSS_SOURCE_NAME = "Boss直聘";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "PARSE_CURRENT_JOB") {
    return false;
  }

  parseBossJobPageWithRetry().then((job) => {
    sendResponse({
      job
    });
  });

  return true;
});

async function parseBossJobPageWithRetry() {
  if (!isBossPage(window.location.href)) {
    return getEmptyJob();
  }

  const maxAttempts = 10;
  const retryDelayMs = 300;
  let bestJob = getEmptyBossJob();

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const job = parseBossJobPage();
    bestJob = pickMoreCompleteJob(bestJob, job);

    if (isCompleteJob(bestJob)) {
      return bestJob;
    }

    if (attempt < maxAttempts) {
      await wait(retryDelayMs);
    }
  }

  return bestJob;
}

function parseBossJobPage() {
  if (!isBossPage(window.location.href)) {
    return getEmptyJob();
  }

  try {
    const panelJob = parseBossSearchResultPanel();

    if (hasParsedJobFields(panelJob)) {
      return panelJob;
    }

    return parseBossStandaloneJobDetailPage();
  } catch {
    return getEmptyBossJob();
  }
}

function parseBossSearchResultPanel() {
  const isSearchPage = isBossSearchResultsPage(window.location.href);

  if (!isSearchPage) {
    return getEmptyBossJob();
  }

  const panel = findVisibleElement([
    ".user-center-job-detail-box",
    ".job-detail-card",
    ".job-detail-box",
    ".job-detail-panel",
    ".job-detail-container",
    ".job-detail-content"
  ]);

  if (!panel) {
    return getEmptyBossJob();
  }

  const panelTitle = findFirstTextIn(panel, [
    ".job-detail-info .job-name",
    ".job-detail-header .job-name",
    ".job-detail-header .title",
    ".job-header-info .job-name",
    ".job-name",
    ".job-title"
  ]);
  const sourceCard = findSourceJobCard(panel, panelTitle);

  const title =
    panelTitle || findFirstTextIn(sourceCard, [
      ".job-card-left .job-title .job-name",
      ".job-card-left .job-name",
      ".job-title .job-name",
      ".job-title"
    ]);
  const company =
    findCompanyTextInPanel(panel) || findCompanyTextInCard(sourceCard);
  const panelSalary = findSalaryTextIn(panel, [
    ".job-detail-info .job-salary",
    ".job-detail-header .job-salary",
    ".job-header-info .job-salary",
    ".job-detail-info .salary",
    ".job-detail-header .salary",
    ".job-header-info .salary",
    ".job-detail-info .salary-info",
    ".job-detail-header .salary-info",
    ".job-header-info .salary-info",
    ".job-detail-info .job-salary-info",
    ".job-detail-header .job-salary-info",
    ".job-header-info .job-salary-info",
    ".job-detail-info .red",
    ".job-detail-header .red",
    ".job-header-info .red",
    ".job-detail-info h1",
    ".job-detail-header h1",
    ".job-header-info h1",
    ".job-detail-info",
    ".job-detail-header",
    ".job-header-info",
    ".job-salary",
    ".salary-info",
    ".salary",
    ".red"
  ]);
  const cardSalary = findSalaryTextIn(sourceCard, [
    ".job-card-left .salary",
    ".job-card-left .job-salary",
    ".job-card-left .salary-info",
    ".job-card-left .job-info .salary",
    ".job-card-left .job-info .job-salary",
    ".job-card-left .job-info",
    ".job-card-left .job-title",
    ".job-card-left",
    ".salary",
    ".job-salary",
    ".salary-info"
  ]);
  const salary = panelSalary || cardSalary;
  const location =
    extractLocationText(
      findFirstTextIn(panel, [
        ".job-address .job-address-desc",
        ".job-address-desc",
        ".job-detail-header .job-area",
        ".job-detail-info .job-area",
        ".tag-list li:first-child",
        ".job-area",
        ".location"
      ])
    ) ||
    extractLocationText(
      findFirstTextIn(sourceCard, [
        ".job-card-left .job-area-wrapper .job-area",
        ".job-card-left .job-area",
        ".job-area",
        ".location"
      ])
    );

  const job = buildBossJob({
    title,
    company,
    salary,
    location
  });

  return job;
}

function parseBossStandaloneJobDetailPage() {
  if (!isBossJobDetailPage(window.location.href)) {
    return getEmptyBossJob();
  }

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
  const salary = findSalaryTextIn(document, [
    ".job-detail .job-salary",
    ".job-banner .job-salary",
    ".job-primary .salary",
    ".job-primary .job-salary",
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

  const job = buildBossJob({
    title,
    company,
    salary,
    location
  });

  return job;
}

function isBossPage(url) {
  try {
    const currentUrl = new URL(url);
    const hostname = currentUrl.hostname.toLowerCase();

    return hostname.endsWith("zhipin.com") || hostname.endsWith("bosszhipin.com");
  } catch {
    return false;
  }
}

function isBossJobDetailPage(url) {
  try {
    return new URL(url).pathname.includes("/job_detail/");
  } catch {
    return false;
  }
}

function isBossSearchResultsPage(url) {
  try {
    const pathname = new URL(url).pathname;

    return pathname === "/web/geek/jobs" || pathname === "/web/geek/job";
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

function findFirstTextIn(root, selectors) {
  if (!root) {
    return "";
  }

  for (const selector of selectors) {
    const element = root.querySelector(selector);
    const text = normalizeText(element?.textContent);

    if (text) {
      return text;
    }
  }

  return "";
}

function findVisibleElement(selectors) {
  for (const selector of selectors) {
    const elements = Array.from(document.querySelectorAll(selector));
    const visibleElement = elements.find(isElementVisible);

    if (visibleElement) {
      return visibleElement;
    }
  }

  return null;
}

function isElementVisible(element) {
  const style = window.getComputedStyle(element);

  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    element.getClientRects().length > 0
  );
}

function findSourceJobCard(panel, title) {
  return (
    panel.closest(".job-card-wrapper") ||
    findAriaSelectedJobCard() ||
    findSelectedJobCardByClass() ||
    findJobCardByTitle(title) ||
    findHighlightedJobCard()
  );
}

function findAriaSelectedJobCard() {
  const selectedElement = findVisibleElement([
    ".job-card-wrapper[aria-selected='true']",
    ".job-card-wrapper [aria-selected='true']",
    ".job-card-wrapper[aria-current='true']",
    ".job-card-wrapper [aria-current='true']"
  ]);

  return selectedElement?.closest(".job-card-wrapper") || null;
}

function findSelectedJobCardByClass() {
  return findVisibleElement([
    ".job-card-wrapper.active",
    ".job-card-wrapper.selected",
    ".job-card-wrapper.current",
    ".job-card-wrapper.hover-footer",
    ".job-card-wrapper[class*='active']",
    ".job-card-wrapper[class*='selected']",
    ".job-card-wrapper[class*='current']"
  ]);
}

function findHighlightedJobCard() {
  const cards = Array.from(document.querySelectorAll(".job-card-wrapper"))
    .filter(isElementVisible)
    .map((card) => ({
      card,
      score: getCardHighlightScore(card)
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score);

  return cards[0]?.card || null;
}

function getCardHighlightScore(card) {
  const style = window.getComputedStyle(card);
  let score = 0;

  if (/\b(active|selected|current|hover-footer)\b/.test(card.className)) {
    score += 20;
  }

  if (
    card.getAttribute("aria-selected") === "true" ||
    card.getAttribute("aria-current") === "true" ||
    card.querySelector("[aria-selected='true'], [aria-current='true']")
  ) {
    score += 20;
  }

  if (hasAnyVisibleBorder(style)) {
    score += 10;
  }

  if (hasVisibleBorder(style.outlineWidth, style.outlineColor)) {
    score += 10;
  }

  if (style.boxShadow && style.boxShadow !== "none") {
    score += 5;
  }

  return score;
}

function hasAnyVisibleBorder(style) {
  return (
    hasVisibleBorder(style.borderTopWidth, style.borderTopColor) ||
    hasVisibleBorder(style.borderRightWidth, style.borderRightColor) ||
    hasVisibleBorder(style.borderBottomWidth, style.borderBottomColor) ||
    hasVisibleBorder(style.borderLeftWidth, style.borderLeftColor)
  );
}

function hasVisibleBorder(width, color) {
  return parseFloat(width) > 0 && !isTransparentColor(color);
}

function isTransparentColor(color) {
  return (
    !color ||
    color === "transparent" ||
    color === "rgba(0, 0, 0, 0)" ||
    color.endsWith(", 0)")
  );
}

function findCompanyTextInPanel(panel) {
  return cleanCompanyText(
    findFirstTextIn(panel, [
      ".company-name a",
      ".company-name",
      ".company-info .name",
      ".job-company .name",
      ".company-card .name",
      ".job-detail-header .intro",
      ".job-boss-info .boss-info-attr",
      ".job-boss-info .boss-info-attr span",
      ".job-boss-info"
    ])
  );
}

function findCompanyTextInCard(card) {
  const companyFromSelector = cleanCompanyText(
    findFirstTextIn(card, [
      ".job-card-right a[href*='gongsi']",
      ".job-card-right a[href*='company']",
      ".job-card-right .company-info .company-name a",
      ".job-card-right .company-info .company-name",
      ".job-card-right .company-name a",
      ".job-card-right .company-name",
      ".job-card-right .company-info",
      ".job-card-right",
      ".job-card-footer .company-name",
      ".job-card-footer .info-desc",
      ".company-text em",
      ".company-text",
      ".company-name-info",
      ".company-name a",
      ".company-name"
    ])
  );

  if (companyFromSelector) {
    return companyFromSelector;
  }

  return cleanCompanyText(card?.textContent || "");
}

function findJobCardByTitle(title) {
  const normalizedTitle = normalizeText(title);

  if (!normalizedTitle) {
    return null;
  }

  const cards = Array.from(document.querySelectorAll(".job-card-wrapper"));

  return (
    cards
      .filter(isElementVisible)
      .filter((card) => {
        return doJobTitlesMatch(getJobCardTitle(card), normalizedTitle);
      })
      .sort((a, b) => getCardHighlightScore(b) - getCardHighlightScore(a))[0] ||
    null
  );
}

function getJobCardTitle(card) {
  return findFirstTextIn(card, [
    ".job-card-left .job-title .job-name",
    ".job-card-left .job-name",
    ".job-title .job-name",
    ".job-card-left .job-title",
    ".job-title"
  ]);
}

function doJobTitlesMatch(cardTitle, panelTitle) {
  const normalizedCardTitle = normalizeJobTitleForMatch(cardTitle);
  const normalizedPanelTitle = normalizeJobTitleForMatch(panelTitle);

  if (!normalizedCardTitle || !normalizedPanelTitle) {
    return false;
  }

  return (
    normalizedCardTitle === normalizedPanelTitle ||
    normalizedPanelTitle.includes(normalizedCardTitle) ||
    normalizedCardTitle.includes(normalizedPanelTitle)
  );
}

function normalizeJobTitleForMatch(title) {
  return normalizeText(title)
    .replace(/[【】[\]（）()]/g, "")
    .replace(/[-－—–]/g, "")
    .replace(/\s+/g, "");
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

function findSalaryTextIn(root, selectors) {
  if (!root) {
    return "";
  }

  for (const selector of selectors) {
    const elements = Array.from(root.querySelectorAll(selector));

    for (const element of elements) {
      const salary = extractSalaryFromElement(element);

      if (salary) {
        return salary;
      }
    }
  }

  return extractSalaryFromElement(root);
}

function extractSalaryFromElement(element) {
  const candidates = [
    element?.textContent,
    element?.getAttribute?.("title"),
    element?.getAttribute?.("aria-label"),
    element?.getAttribute?.("data-salary"),
    element?.getAttribute?.("data-title")
  ];

  for (const candidate of candidates) {
    const salary = extractSalaryFromText(candidate);

    if (salary) {
      return salary;
    }
  }

  return "";
}

function extractSalaryFromText(text) {
  const normalizedText = normalizeText(text)
    .replace(/[－～—–]/g, "-")
    .replace(/[Ｋｋ]/g, "K")
    .replace(/[・•]/g, "·");

  if (!normalizedText) {
    return "";
  }

  for (const pattern of getSalaryPatterns()) {
    const match = normalizedText.match(pattern);

    if (match?.[0]) {
      return normalizeSalaryText(match[0]);
    }
  }

  return "";
}

function getSalaryPatterns() {
  return [
    /薪资\s*面议/,
    /面议/,
    /\d+(?:\.\d+)?\s*K\s*-\s*\d+(?:\.\d+)?\s*K(?:\s*[·.]\s*\d+\s*薪)?/i,
    /\d+(?:\.\d+)?\s*-\s*\d+(?:\.\d+)?\s*K(?:\s*[·.]\s*\d+\s*薪)?/i,
    /\d+(?:\.\d+)?\s*-\s*\d+(?:\.\d+)?\s*元\s*\/\s*(?:天|日)/,
    /\d+(?:\.\d+)?\s*-\s*\d+(?:\.\d+)?\s*元\s*(?:每天|每日|天|日)/
  ];
}

function normalizeSalaryText(text) {
  return normalizeText(text)
    .replace(/\s*-\s*/g, "-")
    .replace(/\s*\/\s*/g, "/")
    .replace(/\s*([·.])\s*/g, "$1")
    .replace(/\s*K\b/gi, "K")
    .replace(/\s*薪/g, "薪")
    .replace(/^薪资\s*面议$/, "薪资面议");
}

function cleanCompanyText(text) {
  const normalizedText = normalizeText(text)
    .replace(/招聘HR.*$/, "")
    .replace(/HR.*$/, "")
    .replace(/[\d.]+[-~—–][\d.]+[Kk].*$/, "")
    .replace(
      /\s+(未融资|不需要融资|已上市|上市公司|融资未公开|[ABCD轮天使]+轮|[\d-]+人|[\d]+人以上|[\d]+人以下).*$/,
      ""
    );
  const [companyName] = normalizedText
    .split(/[|｜·]/)
    .map((segment) => segment.trim())
    .filter(Boolean)
    .filter((segment) => !isLikelyJobCardMetadata(segment));

  return companyName || "";
}

function isLikelyJobCardMetadata(text) {
  return /薪|经验|学历|本科|大专|融资|上市|人数|人以上|人以下|互联网|网约车|不需要融资/.test(text);
}

function normalizeText(value) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function containsPrivateUseCharacters(value) {
  if (typeof value !== "string") {
    return false;
  }

  const hasPrivateUseCharacters = /[\uE000-\uF8FF]/.test(value);

  if (!hasPrivateUseCharacters) {
    return false;
  }

  return !extractSalaryFromText(value.replace(/[\uE000-\uF8FF]/g, ""));
}

function hasParsedJobFields(job) {
  return Boolean(job.title || job.company || job.salary || job.location);
}

function buildBossJob(job) {
  return {
    title: job.title || "",
    company: job.company || "",
    salary: getSafeSalaryText(job.salary),
    location: job.location || "",
    source: BOSS_SOURCE_NAME
  };
}

function getSafeSalaryText(value) {
  const salary = extractSalaryFromText(value);

  if (salary) {
    return salary;
  }

  return containsPrivateUseCharacters(value) ? "" : value || "";
}

function isCompleteJob(job) {
  return Boolean(job.title && job.company && job.salary && job.location);
}

function pickMoreCompleteJob(currentJob, nextJob) {
  const mergedJob = {
    title: nextJob.title || currentJob.title,
    company: nextJob.company || currentJob.company,
    salary: nextJob.salary || currentJob.salary,
    location: nextJob.location || currentJob.location,
    source: nextJob.source || currentJob.source
  };

  return getJobCompletenessScore(mergedJob) >= getJobCompletenessScore(currentJob)
    ? mergedJob
    : currentJob;
}

function getJobCompletenessScore(job) {
  return [job.title, job.company, job.salary, job.location].filter(Boolean).length;
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function getEmptyBossJob() {
  return {
    title: "",
    company: "",
    salary: "",
    location: "",
    source: BOSS_SOURCE_NAME
  };
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
