// login.js
// FlyEase Login Selection Interactivity and Animations

document.addEventListener("DOMContentLoaded", () => {
  const roleCards = document.querySelectorAll(".role-card");

  // Animate role cards on load
  roleCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    setTimeout(() => {
      card.style.transition = "all 0.6s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 200 * index);
  });

  // Toast setup for showing redirect message
  const toast = document.createElement("div");
  toast.id = "login-toast";
  toast.innerHTML = "";
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = "rgba(0,0,0,0.8)";
  toast.style.color = "#fff";
  toast.style.padding = "12px 20px";
  toast.style.borderRadius = "8px";
  toast.style.fontSize = "15px";
  toast.style.fontWeight = "600";
  toast.style.boxShadow = "0 8px 24px rgba(0,0,0,0.25)";
  toast.style.display = "none";
  toast.style.zIndex = "999";
  document.body.appendChild(toast);

  // Function to show toast message
  function showToast(message) {
    toast.textContent = message;
    toast.style.display = "block";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
    });
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => (toast.style.display = "none"), 400);
    }, 2000);
  }

  // Add click animation + redirect
  roleCards.forEach(card => {
    card.addEventListener("click", e => {
      e.preventDefault();
      const href = card.getAttribute("href");
      const role = card.querySelector("h2").textContent.trim();

      // Add brief "pressed" animation
      card.style.transform = "scale(0.97)";
      setTimeout(() => {
        card.style.transform = "scale(1)";
      }, 150);

      showToast(`Redirecting to ${role} ...`);

      setTimeout(() => {
        window.location.href = href;
      }, 1000);
    });
  });

  // Back to home hover glow effect
  const backLink = document.querySelector(".back-home a");
  if (backLink) {
    backLink.addEventListener("mouseenter", () => {
      backLink.style.textShadow = "0 0 8px rgba(58,123,213,0.8)";
    });
    backLink.addEventListener("mouseleave", () => {
      backLink.style.textShadow = "none";
    });
  }
});
