(() => {
  "use strict";

  const form = document.querySelector("#trial-form");
  const status = document.querySelector("#trial-form-status");
  if (!form || !status) return;

  const button = form.querySelector("button[type='submit']");
  const buttonLabel = button.querySelector("span");
  const fields = [...form.querySelectorAll(".trial-intake__field input")];
  const company = form.elements.namedItem("company");
  const phone = form.elements.namedItem("phone");
  const email = form.elements.namedItem("email");
  let pending = false;
  let sent = false;

  const showStatus = (message, state, focus = false) => {
    status.textContent = message;
    status.dataset.state = state;
    if (focus) status.focus();
  };

  [company, phone].forEach((field) => {
    field.addEventListener("input", () => field.setCustomValidity(""));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (pending || sent || form.elements.namedItem("_honey").value) return;

    company.value = company.value.trim();
    phone.value = phone.value.trim();
    email.value = email.value.trim();
    company.setCustomValidity(company.value ? "" : "Enter your company name.");
    const phoneDigits = phone.value.replace(/\D/g, "");
    phone.setCustomValidity(phoneDigits.length >= 7 && phoneDigits.length <= 15
      ? "" : "Enter a phone number with 7 to 15 digits.");
    if (!form.reportValidity()) return;

    // The native POST action remains available if JavaScript is disabled.
    // Do not disable FormSubmit's CAPTCHA in that fallback or add client secrets.
    const payload = Object.fromEntries(new FormData(form));
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    pending = true;
    button.disabled = true;
    buttonLabel.textContent = "Sending…";
    form.setAttribute("aria-busy", "true");
    fields.forEach((field) => { field.readOnly = true; });
    showStatus("Sending your request…", "pending");

    try {
      const response = await fetch("https://formsubmit.co/ajax/aueldservice@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        credentials: "omit",
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Unconfirmed response");
      const result = await response.json();

      if (result.success === true || result.success === "true") {
        sent = true;
        buttonLabel.textContent = "Request sent";
        showStatus("Request received. Our team will contact you to arrange your free week.", "success", true);
      } else if (/activat/i.test(String(result.message || ""))) {
        showStatus("Online requests are not ready yet. Your request has not been confirmed. Please use Telegram, email or the phone number alongside this form.", "error", true);
      } else {
        showStatus("Your request was not accepted. Please check your details and try again, or contact our team directly.", "error", true);
      }
    } catch {
      // A timeout or lost response does not prove the request failed to arrive.
      // Preserve entries and never retry automatically, to avoid duplicate leads.
      showStatus("We couldn’t confirm your request. It may have arrived — contact our team before trying again. Your details are still here.", "error", true);
    } finally {
      clearTimeout(timeout);
      pending = false;
      form.removeAttribute("aria-busy");
      button.disabled = sent;
      if (!sent) buttonLabel.textContent = "Start Free Trial";
      fields.forEach((field) => { field.readOnly = sent; });
    }
  });
})();
