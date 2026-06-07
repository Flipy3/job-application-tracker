const API_BASE_URL = "http://localhost:3000";

const jobForm = document.getElementById("job-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const titleInput = document.getElementById("job-title");
const companyInput = document.getElementById("company");
const salaryInput = document.getElementById("salary");
const locationInput = document.getElementById("location");
const sourceInput = document.getElementById("source");
const urlInput = document.getElementById("job-url");
const notesInput = document.getElementById("notes");
const saveButton = document.getElementById("save-button");
const clearCredentialsButton = document.getElementById("clear-credentials-button");
const saveStatus = document.getElementById("save-status");

const STORED_CREDENTIAL_KEYS = ["email", "password"];

function getLocalStorageArea() {
  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    return null;
  }

  return chrome.storage.local;
}

function getStoredCredentials() {
  const storage = getLocalStorageArea();

  if (!storage) {
    return Promise.resolve({});
  }

  return new Promise((resolve) => {
    storage.get(STORED_CREDENTIAL_KEYS, (credentials) => {
      resolve(credentials ?? {});
    });
  });
}

function saveCredentials(credentials) {
  const storage = getLocalStorageArea();

  if (!storage) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    storage.set(credentials, resolve);
  });
}

function clearStoredCredentials() {
  const storage = getLocalStorageArea();

  if (!storage) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    storage.remove(STORED_CREDENTIAL_KEYS, resolve);
  });
}

async function fillStoredCredentials() {
  const credentials = await getStoredCredentials();

  fillInputIfValue(emailInput, credentials.email);
  fillInputIfValue(passwordInput, credentials.password);
}

async function fillCurrentTabUrl() {
  if (typeof chrome === "undefined" || !chrome.tabs?.query) {
    return null;
  }

  const [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  if (activeTab?.url) {
    urlInput.value = activeTab.url;
  }

  return activeTab ?? null;
}

async function fillParsedJobFields(activeTab) {
  if (!activeTab?.id || typeof chrome === "undefined" || !chrome.tabs?.sendMessage) {
    return;
  }

  try {
    const response = await sendMessageToTab(activeTab.id, {
      type: "PARSE_CURRENT_JOB"
    });
    const job = response?.job;

    if (!job) {
      return;
    }

    fillInputIfValue(titleInput, job.title);
    fillInputIfValue(companyInput, job.company);
    fillInputIfValue(salaryInput, job.salary);
    fillInputIfValue(locationInput, job.location);
    fillInputIfValue(sourceInput, job.source);
  } catch {
    // Keep the popup editable when parsing is unavailable on the current tab.
  }
}

function sendMessageToTab(tabId, message) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      const error = chrome.runtime.lastError;

      if (error) {
        reject(error);
        return;
      }

      resolve(response);
    });
  });
}

function fillInputIfValue(input, value) {
  if (typeof value !== "string" || !value.trim()) {
    return;
  }

  if (input.value.trim()) {
    return;
  }

  input.value = value.trim();
}

async function initializePopup() {
  await fillStoredCredentials();
  const activeTab = await fillCurrentTabUrl();
  await fillParsedJobFields(activeTab);
}

jobForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const jobData = {
    email: emailInput.value.trim(),
    password: passwordInput.value,
    title: titleInput.value.trim(),
    company: companyInput.value.trim(),
    salary: salaryInput.value.trim(),
    location: locationInput.value.trim(),
    source: sourceInput.value.trim(),
    url: urlInput.value.trim(),
    notes: notesInput.value.trim(),
    status: "saved"
  };

  setSaveState("保存中...", true, "saving");

  try {
    const response = await fetch(`${API_BASE_URL}/api/extension/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(jobData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "保存失败");
    }

    // MVP only: chrome.storage.local stores the password locally for testing convenience.
    // Replace this with a safer session, token, or OAuth flow before production use.
    await saveCredentials({
      email: jobData.email,
      password: jobData.password
    });

    setSaveState("保存成功", false, "success");
  } catch (error) {
    setSaveState(
      error instanceof Error ? error.message : "保存失败",
      false,
      "error"
    );
  }
});

clearCredentialsButton.addEventListener("click", async () => {
  await clearStoredCredentials();
  emailInput.value = "";
  passwordInput.value = "";
  setSaveState("已清除登录信息", false, "success");
});

document.addEventListener("DOMContentLoaded", initializePopup);

function setSaveState(message, isSaving, state) {
  saveButton.disabled = isSaving;
  saveButton.textContent = isSaving ? "保存中..." : "保存岗位";
  saveStatus.textContent = message;
  saveStatus.dataset.state = state;
}
