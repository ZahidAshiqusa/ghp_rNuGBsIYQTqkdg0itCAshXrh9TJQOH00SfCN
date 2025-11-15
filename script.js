document.getElementById("childCount").addEventListener("change", () => {
  const val = document.getElementById("childCount").value;
  document.getElementById("classTab").style.display = val === "none" ? "none" : "block";
});

// Submit Handler
const form = document.getElementById("regForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: name.value,
    childCount: childCount.value,
    class: childCount.value !== "none" ? class.value : "",
    gender: gender.value,
    address: address.value,
    phone: phone.value,
    interest: interest.value,
    surveyor: surveyor.value
  };

  const res = await fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const msg = await res.text();
  alert(msg);
});
