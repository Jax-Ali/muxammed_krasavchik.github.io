const eventDate = new Date("2026-08-22T19:00:00+05:00");
const revealItems = document.querySelectorAll(".reveal");
const modal = document.getElementById("modal");
const modalText = document.getElementById("modalText");
const wishModal = document.getElementById("wishModal");
const wishList = document.querySelector(".wish-list");
const audio = document.getElementById("weddingAudio");
const musicButton = document.getElementById("musicButton");
let selectedReply = "Иә, барамын!";

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

const startReveals = () => {
  revealItems.forEach((item, index) => {
    item.style.setProperty("--delay", `${Math.min(index % 4, 3) * 90}ms`);
    observer.observe(item);
  });
};

document.querySelectorAll(".choice").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".choice").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    selectedReply = button.dataset.value;
  });
});

document.querySelector(".reply-form").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("guestName").value.trim();
  modalText.textContent = `${name || "Қонақ"}, жауабыңыз қабылданды: ${selectedReply}`;
  openModal(modal);
});

document.getElementById("modalClose").addEventListener("click", () => closeModal(modal));
document.getElementById("wishClose").addEventListener("click", () => closeModal(wishModal));
document.getElementById("wishOpen").addEventListener("click", () => openModal(wishModal));
document.getElementById("readWishes").addEventListener("click", () => {
  wishList.scrollTo({ top: wishList.scrollHeight, behavior: "smooth" });
});

document.getElementById("wishForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("wishName").value.trim();
  const text = document.getElementById("wishText").value.trim();

  if (!name || !text) return;

  const card = document.createElement("article");
  card.innerHTML = `<strong>${escapeHtml(name)}</strong><p>${escapeHtml(text)}</p>`;
  wishList.prepend(card);
  event.currentTarget.reset();
  closeModal(wishModal);
  modalText.textContent = "Ізгі тілегіңіз қосылды. Рақмет!";
  openModal(modal);
});

document.querySelectorAll(".modal").forEach(item => {
  item.addEventListener("click", event => {
    if (event.target === item) closeModal(item);
  });
});

musicButton.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      await audio.play();
    } catch {
      modalText.textContent = "Әуенді қосу үшін браузер рұқсаты қажет болуы мүмкін.";
      openModal(modal);
    }
  } else {
    audio.pause();
  }
});

audio.addEventListener("play", () => {
  musicButton.textContent = "Әуен тоқтату";
  musicButton.classList.add("playing");
});

audio.addEventListener("pause", () => {
  musicButton.textContent = "Әуен қосу";
  musicButton.classList.remove("playing");
});

const initAudio = () => {
  if (audio.paused) audio.play().catch(() => {});
  document.removeEventListener("click", initAudio);
  document.removeEventListener("touchstart", initAudio);
  document.removeEventListener("scroll", initAudio);
};

const envelopeOverlay = document.getElementById("envelopeOverlay");
const envelopeWrapper = document.getElementById("envelopeWrapper");

if (envelopeWrapper && envelopeOverlay) {
  envelopeWrapper.addEventListener("click", () => {
    // Start animation
    envelopeWrapper.classList.add("open");
    
    // Start audio
    initAudio();

    // After envelope opens, fade out overlay
    setTimeout(() => {
      envelopeOverlay.classList.add("hidden");
      
      // Start reveals after overlay starts fading
      startReveals();

      // Remove from DOM to prevent blocking
      setTimeout(() => {
        envelopeOverlay.style.display = "none";
      }, 1200);
    }, 1500);
  });
} else {
  // If no envelope, just start reveals
  startReveals();
  document.addEventListener("click", initAudio);
  document.addEventListener("touchstart", initAudio);
  document.addEventListener("scroll", initAudio);
}

setInterval(() => {
  const first = wishList.firstElementChild;
  if (first && wishList.children.length > 2) {
    wishList.appendChild(first);
  }
}, 3000);

function openModal(element) {
  element.classList.add("open");
  element.setAttribute("aria-hidden", "false");
}

function closeModal(element) {
  element.classList.remove("open");
  element.setAttribute("aria-hidden", "true");
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function updateCountdown() {
  const now = new Date();
  let diff = eventDate.getTime() - now.getTime();

  if (diff < 0) diff = 0;

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;
}

updateCountdown();
setInterval(updateCountdown, 1000);
