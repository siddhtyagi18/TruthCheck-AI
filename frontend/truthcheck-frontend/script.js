const API = "http://127.0.0.1:8000";

document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadHistory();
  setupFileUpload();
});

function setupFileUpload() {
  const mediaInput = document.getElementById('mediaInput');
  const selectedFile = document.getElementById('selectedFile');

  mediaInput.addEventListener('change', () => {
    if (mediaInput.files.length > 0) {
      const file = mediaInput.files[0];
      selectedFile.textContent = `✅ Selected: ${file.name} (${formatFileSize(file.size)})`;
      selectedFile.classList.remove('hidden');
    } else {
      selectedFile.classList.add('hidden');
    }
  });
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

async function loadStats() {
  try {
    const res = await fetch(`${API}/stats`);
    const data = await res.json();
    document.getElementById('totalStats').textContent = data.total_verifications;
    document.getElementById('newsStats').textContent = data.news_count;
    document.getElementById('imageStats').textContent = data.image_count;
    document.getElementById('videoStats').textContent = data.video_count;
  } catch (e) {
    console.error('Failed to load stats:', e);
  }
}

async function loadHistory() {
  try {
    const res = await fetch(`${API}/history`);
    const data = await res.json();
    const historyList = document.getElementById('historyList');
    
    if (data.length === 0) {
      historyList.innerHTML = '<p class="empty-state">No verifications yet</p>';
      return;
    }

    historyList.innerHTML = data.map(log => `
      <div class="history-item">
        <div class="history-item-left">
          <span class="history-type history-type-${log.type}">${log.type.toUpperCase()}</span>
          <div class="history-input">${log.input_text || `Media file`}</div>
          <div class="history-verdict">${log.verdict}</div>
        </div>
        <div class="history-confidence">${log.confidence}%</div>
      </div>
    `).join('');
  } catch (e) {
    console.error('Failed to load history:', e);
  }
}

function setButtonLoading(btn, loading) {
  const btnText = btn.querySelector('.btn-text');
  const btnLoader = btn.querySelector('.btn-loader');
  if (loading) {
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    btn.disabled = true;
  } else {
    btnText.classList.remove('hidden');
    btnLoader.classList.add('hidden');
    btn.disabled = false;
  }
}

async function verifyNews() {
  const input = document.getElementById("newsInput").value.trim();
  const result = document.getElementById("newsResult");
  const btn = document.querySelector('#newsInput').closest('.card').querySelector('.btn');

  if (!input) {
    alert("Enter news text or link");
    return;
  }

  result.classList.remove("hidden");
  result.innerHTML = "🔍 Verifying across trusted news sources...";
  setButtonLoading(btn, true);

  try {
    const res = await fetch(`${API}/ai/verify-news`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input })
    });

    const data = await res.json();

    let linksHtml = "";
    if (data.related_news && data.related_news.length > 0) {
      linksHtml =
        "<ul style='list-style: none; padding: 0; margin: 12px 0 0 0;'>" +
        data.related_news
          .map(
            n =>
              `<li><a href="${n.url}" target="_blank" class="news-link">${n.title} <em>(${n.source})</em></a></li>`
          )
          .join("") +
        "</ul>";
    } else {
      linksHtml = "<p style='margin-top: 12px;'>No related credible coverage found.</p>";
    }

    result.innerHTML = `
      <strong style="font-size: 1.2rem;">${data.verdict}</strong><br/>
      <small style="color: #94a3b8;">${data.reason}</small>
      <hr style="margin: 16px 0; border: 1px solid rgba(148,163,184,0.2);"/>
      <strong>Related Coverage:</strong>
      ${linksHtml}
    `;

    await loadStats();
    await loadHistory();
  } catch (e) {
    result.innerHTML = "❌ Error verifying news.";
  } finally {
    setButtonLoading(btn, false);
  }
}

async function verifyMedia() {
  const fileInput = document.getElementById("mediaInput");
  const file = fileInput.files[0];
  if (!file) {
    alert("Select image or video");
    return;
  }

  const isVideo = file.type.startsWith("video");
  const endpoint = isVideo ? "verify-video" : "verify-image";

  const verdictEl = document.getElementById("mediaVerdict");
  const confEl = document.getElementById("mediaConfidence");
  const bar = document.getElementById("mediaBar");
  const reasonEl = document.getElementById("mediaReason");
  const box = document.getElementById("mediaResult");
  const btn = document.querySelector('#mediaInput').closest('.card').querySelector('.btn');

  box.classList.remove("hidden");
  verdictEl.innerText = "Analyzing...";
  confEl.innerText = "";
  reasonEl.innerText = "";
  bar.style.width = "0%";
  setButtonLoading(btn, true);

  const fd = new FormData();
  fd.append("file", file);

  try {
    const res = await fetch(`${API}/ai/${endpoint}`, {
      method: "POST",
      body: fd
    });

    const data = await res.json();
    const confidence = parseFloat(data.confidence);

    verdictEl.className = "";
    bar.className = "";

    if (confidence >= 70) {
      verdictEl.innerText = "High AI Involvement Detected";
      reasonEl.innerText =
        "Strong AI-related patterns detected, commonly found in generative or AI-enhanced media.";
      verdictEl.classList.add("ai-high");
      bar.classList.add("ai-high-bar");

    } else if (confidence >= 50) {
      verdictEl.innerText = "Moderate AI Involvement Detected";
      reasonEl.innerText =
        "Some AI-assisted enhancements detected such as smoothing, sharpening, or color correction.";
      verdictEl.classList.add("ai-mid");
      bar.classList.add("ai-mid-bar");

    } else {
      verdictEl.innerText = "Low AI Involvement (Likely Natural)";
      reasonEl.innerText =
        "No strong generative AI patterns detected. Media appears mostly natural.";
      verdictEl.classList.add("real");
      bar.classList.add("real-bar");
    }

    confEl.innerText = `Confidence: ${confidence}%`;
    setTimeout(() => (bar.style.width = confidence + "%"), 100);

    await loadStats();
    await loadHistory();
  } catch (e) {
    verdictEl.innerText = "Error analyzing media";
    reasonEl.innerText = "Please try again.";
  } finally {
    setButtonLoading(btn, false);
  }
}
