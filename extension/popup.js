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
const saveStatus = document.getElementById("save-status");

async function fillCurrentTabUrl() {
  if (typeof chrome === "undefined" || !chrome.tabs?.query) {
    return;
  }

  const [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  if (activeTab?.url) {
    urlInput.value = activeTab.url;
  }
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

  setSaveState("Saving...", true, "saving");

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
      throw new Error(result.error || "Failed to save job.");
    }

    setSaveState("Saved successfully", false, "success");
  } catch (error) {
    setSaveState(
      error instanceof Error ? error.message : "Failed to save job",
      false,
      "error"
    );
  }
});

document.addEventListener("DOMContentLoaded", fillCurrentTabUrl);

function setSaveState(message, isSaving, state) {
  saveButton.disabled = isSaving;
  saveButton.textContent = isSaving ? "Saving..." : "Save Job";
  saveStatus.textContent = message;
  saveStatus.dataset.state = state;
}
