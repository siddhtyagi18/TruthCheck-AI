const API = "http://127.0.0.1:8000";

// ======================
// 📰 NEWS VERIFICATION
// ======================
async function verifyNews() {
  const input = document.getElementById("newsInput").value.trim();
  const result = document.getElementById("newsResult");

  if (!input) {
    alert("Enter news text or link");
    return;
  }

  result.classList.remove("hidden");
  result.innerHTML = "🔍 Verifying across trusted news sources...";

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
        "<ul>" +
        data.related_news
          .map(
            n =>
              `<li><a href="${n.url}" target="_blank">${n.title} <em>(${n.source})</em></a></li>`
          )
          .join("") +
        "</ul>";
    } else {
      linksHtml = "<p>No related credible coverage found.</p>";
    }

    result.innerHTML = `
      <strong>${data.verdict}</strong><br/>
      <small>${data.reason}</small>
      <hr/>
      <strong>Related Coverage:</strong>
      ${linksHtml}
    `;
  } catch (e) {
    result.innerHTML = "❌ Error verifying news.";
  }
}

// ======================
// 🎬 IMAGE / VIDEO CHECK
// ======================
async function verifyMedia() {
  const file = document.getElementById("mediaInput").files[0];
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

  box.classList.remove("hidden");
  verdictEl.innerText = "Analyzing...";
  confEl.innerText = "";
  reasonEl.innerText = "";
  bar.style.width = "0%";

  const fd = new FormData();
  fd.append("file", file);

  try {
    const res = await fetch(`${API}/ai/${endpoint}`, {
      method: "POST",
      body: fd
    });

    const data = await res.json();
    const confidence = parseFloat(data.confidence);

    // Reset classes
    verdictEl.className = "";
    bar.className = "";

    // ======================
    // 🔒 AI INVOLVEMENT LAYER
    // ======================
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

  } catch (e) {
    verdictEl.innerText = "Error analyzing media";
    reasonEl.innerText = "Please try again.";
  }
}
