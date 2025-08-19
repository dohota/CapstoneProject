document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("btn")as HTMLElement;
  const result = document.getElementById("result");

  button.addEventListener("click", async () => {
    try {
      const res = await fetch("/api/hello");
      const data = await res.json();
      result.textContent = data.message;
    } catch (err) {
      result.textContent = "Request failed!";
      console.error(err);
    }
  });
});
