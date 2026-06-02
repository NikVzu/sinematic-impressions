(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const root = document.querySelector("[data-accordion]");
  if (!root) return;

  const questions = Array.from(root.querySelectorAll(".faq__q"));
  questions.forEach((btn, idx) => {
    btn.setAttribute("aria-expanded", idx === 0 ? "true" : "false");
    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      questions.forEach((b) => b.setAttribute("aria-expanded", "false"));
      btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
    });
  });
})();
