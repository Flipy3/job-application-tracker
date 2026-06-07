const jobForm = document.getElementById("job-form");
const titleInput = document.getElementById("job-title");
const companyInput = document.getElementById("company");
const urlInput = document.getElementById("job-url");
const notesInput = document.getElementById("notes");

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

jobForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const jobData = {
    title: titleInput.value.trim(),
    company: companyInput.value.trim(),
    url: urlInput.value.trim(),
    notes: notesInput.value.trim()
  };

  console.log(jobData);
});

document.addEventListener("DOMContentLoaded", fillCurrentTabUrl);
