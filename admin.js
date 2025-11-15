async function login() {
  const pass = document.getElementById("adminPass").value;
  const res = await fetch("/api/admin-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: pass })
  });

  if ((await res.text()) === "OK") {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    loadData();
  } else alert("Wrong password");
}

async function loadData() {
  const res = await fetch("/api/admin-data");
  const data = await res.json();

  const box = document.getElementById("entries");
  box.innerHTML = "";

  data.forEach((x, i) => {
    const div = document.createElement("div");
    div.className = "entryCard";
    div.innerHTML = `
      <p><b>${x.name}</b> — ${x.phone}</p>
      <button onclick="del(${i})">Delete</button>
    `;
    box.appendChild(div);
  });
}

async function del(index) {
  const res = await fetch(`/api/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ index })
  });
  alert(await res.text());
  loadData();
}

function downloadJSON() {
  window.location.href = "/api/download-json";
}

function downloadVCF() {
  const m = document.getElementById("monthPick").value;
  if (!m) return alert("Select month first");

  const [year, month] = m.split("-");
  window.location.href = `/api/download-vcf?year=${year}&month=${month}`;
}
