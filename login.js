// login.js
// Handles basic interactivity and smooth animations for the FlyEase login selection page

document.addEventListener("DOMContentLoaded", () => {
  const roleCards = document.querySelectorAll(".role-card");
  
  // Animate cards on load
  roleCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    setTimeout(() => {
      card.style.transition = "all 0.6s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 200 * index);
  });

  // Add click feedback / redirect loader
  roleCards.forEach(card => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const href = card.getAttribute("href");
      const role = card.querySelector("h2").textContent.trim();
      
      // Show loading toast
      showToast(`Redirecting to ${role} Login...`);
      
      // Simulate short delay before redirect
      setTimeout(() => {
        window.location.href = href;
      }, 800);
    });
  });

  // Toast for temporary feedback
  const toast = document.createElement("div");
  toast.id = "login-toast";
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = "rgba(10,26,58,0.9)";
  toast.style.color = "#fff";
  toast.style.padding = "10px 16px";
  toast.style.borderRadius = "8px";
  toast.style.fontWeight = "600";
  toast.style.boxShadow = "0 8px 20px rgba(0,0,0,0.25)";
  toast.style.display = "none";
  toast.style.zIndex = "1000";
  document.body.appendChild(toast);

  function showToast(message) {
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => toast.style.display = "none", 2000);
  }

  // Optional: Back to Home smooth scroll if using in SPA later
  const backHome = document.querySelector(".back-home a");
  if (backHome) {
    backHome.addEventListener("click", (e) => {
      if (backHome.getAttribute("href") === "#") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }
});
