export async function sendResultEmail({ email, name, baseColor, flakeType, screenshot }) {
  return fetch("http://localhost:4000/send-result", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, baseColor, flakeType, screenshot })
  })
  .then(res => res.json());
}
