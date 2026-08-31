/**
 * =========================================================================
 * BRIDE VERSION WEDDING INVITATION SCRIPT - NATASHA & ADRIAN (DUSTY BLUE)
 * =========================================================================
 */

let isAudioPlaying = false;
let audioContext = null;
let audioInterval = null;
let currentLightboxIndex = 1;

// 4 Gallery Photos
const galleryData = [
  {
    id: 1,
    title: "The Royal Portrait",
    desc: "Momen keanggunan busana adat bernuansa Dusty Blue & Pearl.",
    icon: `<svg class="w-20 h-20 text-dusty-600 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`
  },
  {
    id: 2,
    title: "Warm Sunset Embrace",
    desc: "Hangatnya mentari sore menjadi saksi tawa dan cinta kami.",
    icon: `<svg class="w-20 h-20 text-dusty-600 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
  },
  {
    id: 3,
    title: "Precious Promise",
    desc: "Cincin pertunangan sebagai simbol komitmen selamanya.",
    icon: `<svg class="w-20 h-20 text-dusty-600 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
  },
  {
    id: 4,
    title: "Eternal Symphony",
    desc: "Menatap masa depan bersama dengan penuh harapan dan doa.",
    icon: `<svg class="w-20 h-20 text-dusty-600 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
  }
];

// Initial Wishes List
const defaultWishes = [
  {
    id: 1,
    name: "Rizky & Amanda",
    time: "2 jam yang lalu",
    content: "Selamat Natasha & Adrian! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Lancar sampai hari H!",
    likes: 14,
    liked: false
  },
  {
    id: 2,
    name: "Keluarga Besar Bpk. Gunawan",
    time: "4 jam yang lalu",
    content: "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khoir. Turut berbahagia untuk kedua keluarga.",
    likes: 9,
    liked: false
  },
  {
    id: 3,
    name: "Dinda & Sahabat SMA",
    time: "1 hari yang lalu",
    content: "Cantik banget Natasha! Selamat ya untuk kalian berdua, happily ever after!",
    likes: 18,
    liked: false
  },
  {
    id: 4,
    name: "Siti Nurhaliza",
    time: "2 hari yang lalu",
    content: "Semoga pernikahannya selalu dipenuhi keberkahan, cinta, dan kebahagiaan seumur hidup. Aamiin!",
    likes: 7,
    liked: false
  }
];

let wishesData = [];

// =============================================================================
// DOM INITIALIZATION
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
  initGuestName();
  initStarfield();
  initCountdown();
  initWishes();
  initScrollSpy();
  initRevealOnScroll();
  initEvents();
});

// =============================================================================
// 1. GUEST NAME EXTRACTION FROM URL
// =============================================================================
function initGuestName() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get("to") || urlParams.get("u") || urlParams.get("guest") || "Tamu Undangan";
  
  const coverElement = document.getElementById("guest-name-cover");
  if (coverElement) {
    coverElement.textContent = decodeURIComponent(guestName);
  }

  const rsvpNameInput = document.getElementById("rsvp-name");
  if (rsvpNameInput && guestName !== "Tamu Undangan") {
    rsvpNameInput.value = decodeURIComponent(guestName);
  }
}

// =============================================================================
// 2. OPENING COVER & AUDIO SYSTEM (Web Audio API Synthesizer)
// =============================================================================
function initEvents() {
  const btnOpen = document.getElementById("btn-open-invitation");
  const cover = document.getElementById("opening-cover");
  const audioToggle = document.getElementById("btn-audio-toggle");

  if (btnOpen) {
    btnOpen.addEventListener("click", () => {
      cover.style.opacity = "0";
      cover.style.transform = "translateY(-100%)";
      setTimeout(() => {
        cover.style.display = "none";
      }, 1000);

      startRomanticAudio();
      showToast("Selamat datang di undangan kami! ✨");
    });
  }

  if (audioToggle) {
    audioToggle.addEventListener("click", () => {
      toggleAudio();
    });
  }
}

function startRomanticAudio() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    if (!audioContext) {
      audioContext = new AudioContext();
    }
    
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    isAudioPlaying = true;
    updateAudioUI(true);

    const chords = [
      [293.66, 369.99, 440.00, 554.37, 659.25],
      [246.94, 293.66, 369.99, 440.00, 587.33],
      [196.00, 246.94, 293.66, 369.99, 493.88],
      [220.00, 293.66, 329.63, 440.00, 554.37]
    ];

    let chordIndex = 0;

    function playArpeggio() {
      if (!isAudioPlaying || !audioContext) return;

      const currentChord = chords[chordIndex % chords.length];
      chordIndex++;

      currentChord.forEach((freq, idx) => {
        const osc = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        osc.type = idx % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, audioContext.currentTime + (idx * 0.35));

        const now = audioContext.currentTime + (idx * 0.35);
        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.exponentialRampToValueAtTime(0.05 / (idx + 1), now + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

        osc.connect(gainNode);
        gainNode.connect(audioContext.destination);

        osc.start(now);
        osc.stop(now + 3.2);
      });
    }

    playArpeggio();
    if (audioInterval) clearInterval(audioInterval);
    audioInterval = setInterval(playArpeggio, 3500);

  } catch (err) {
    console.warn("Audio notice:", err);
  }
}

function stopRomanticAudio() {
  isAudioPlaying = false;
  updateAudioUI(false);
  if (audioInterval) {
    clearInterval(audioInterval);
    audioInterval = null;
  }
  if (audioContext && audioContext.state === "running") {
    audioContext.suspend();
  }
}

function toggleAudio() {
  if (isAudioPlaying) {
    stopRomanticAudio();
    showToast("Musik dijeda 🔇");
  } else {
    startRomanticAudio();
    showToast("Musik diputar 🎵");
  }
}

function updateAudioUI(playing) {
  const iconPlaying = document.getElementById("icon-music-playing");
  const iconMuted = document.getElementById("icon-music-muted");
  const audioDisc = document.getElementById("audio-disc");

  if (playing) {
    if (iconPlaying) iconPlaying.classList.remove("hidden");
    if (iconMuted) iconMuted.classList.add("hidden");
    if (audioDisc) audioDisc.style.animationPlayState = "running";
  } else {
    if (iconPlaying) iconPlaying.classList.add("hidden");
    if (iconMuted) iconMuted.classList.remove("hidden");
    if (audioDisc) audioDisc.style.animationPlayState = "paused";
  }
}

// =============================================================================
// 3. CELESTIAL STARDUST / PASTEL PARTICLES CANVAS
// =============================================================================
function initStarfield() {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const stars = [];
  const starCount = Math.min(Math.floor(width * 0.08), 85);

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.6,
      alpha: Math.random() * 0.5 + 0.25,
      speed: Math.random() * 0.25 + 0.1,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach((star) => {
      star.alpha += star.twinkleSpeed * star.direction;
      if (star.alpha > 0.75 || star.alpha < 0.2) {
        star.direction *= -1;
      }

      star.y -= star.speed;
      if (star.y < 0) {
        star.y = height;
        star.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(116, 154, 192, ${star.alpha})`;
      ctx.shadowBlur = 4;
      ctx.shadowColor = "#98b7d5";
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// =============================================================================
// 4. REAL-TIME COUNTDOWN TIMER
// =============================================================================
function initCountdown() {
  const targetDate = new Date("2026-10-24T08:00:00+07:00").getTime();

  function update() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    const daysEl = document.getElementById("cd-days");
    const hoursEl = document.getElementById("cd-hours");
    const minutesEl = document.getElementById("cd-minutes");
    const secondsEl = document.getElementById("cd-seconds");

    if (difference <= 0) {
      if (daysEl) daysEl.innerText = "00";
      if (hoursEl) hoursEl.innerText = "00";
      if (minutesEl) minutesEl.innerText = "00";
      if (secondsEl) secondsEl.innerText = "00";
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(days).padStart(2, "0");
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, "0");
    if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, "0");
    if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

// =============================================================================
// 5. GOOGLE CALENDAR ADD INTEGRATION
// =============================================================================
window.addToCalendar = function(title, startISO, endISO, location) {
  const formatTime = (isoStr) => {
    return new Date(isoStr).toISOString().replace(/-|:|\.\d+/g, "");
  };

  const startFormatted = formatTime(startISO);
  const endFormatted = formatTime(endISO);
  const details = encodeURIComponent("Pernikahan Natasha Anggraini & Adrian Pratama. Mohon doa restunya.");
  const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startFormatted}/${endFormatted}&details=${details}&location=${encodeURIComponent(location)}`;

  window.open(calUrl, "_blank");
};

// =============================================================================
// 6. COMBINED RSVP & WISHES SUBMIT HANDLER
// =============================================================================
window.handleCombinedRSVPSubmit = function(event) {
  event.preventDefault();
  const name = document.getElementById("rsvp-name").value.trim();
  const status = document.getElementById("rsvp-status").value;
  const pax = document.getElementById("rsvp-pax").value;
  const wish = document.getElementById("rsvp-wish").value.trim();

  if (!name || !wish) {
    showToast("Mohon lengkapi nama dan doa restu Anda.");
    return;
  }

  // 1. Save RSVP
  const rsvpEntry = { name, status, pax, timestamp: new Date().toISOString() };
  const storedRSVP = JSON.parse(localStorage.getItem("wedding_rsvp_list_bride") || "[]");
  storedRSVP.push(rsvpEntry);
  localStorage.setItem("wedding_rsvp_list_bride", JSON.stringify(storedRSVP));

  // 2. Add Wish
  const newWish = {
    id: Date.now(),
    name,
    time: "Baru saja",
    content: wish,
    likes: 1,
    liked: true
  };

  wishesData.unshift(newWish);
  localStorage.setItem("wedding_wishes_list_bride", JSON.stringify(wishesData));
  renderWishes();

  document.getElementById("rsvp-wish").value = "";
  showToast(`Terima kasih ${name}, konfirmasi & doa restu berhasil dikirim! 🎉`);
};

// =============================================================================
// 7. BUKU TAMU / WISHES WALL
// =============================================================================
function initWishes() {
  const saved = localStorage.getItem("wedding_wishes_list_bride");
  if (saved) {
    wishesData = JSON.parse(saved);
  } else {
    wishesData = defaultWishes;
    localStorage.setItem("wedding_wishes_list_bride", JSON.stringify(wishesData));
  }
  renderWishes();
}

function renderWishes() {
  const container = document.getElementById("wishes-list");
  const countBadge = document.getElementById("wishes-count-badge");
  if (!container) return;

  if (countBadge) {
    countBadge.textContent = `${wishesData.length} Ucapan`;
  }

  container.innerHTML = wishesData.map((item, index) => `
    <div class="p-4 rounded-2xl bg-white border border-dusty-200 space-y-2 transform transition-all hover:border-dusty-400 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-dusty-100 text-dusty-800 flex items-center justify-center font-bold text-xs border border-dusty-300">
            ${item.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h5 class="text-xs font-bold text-dusty-950">${escapeHtml(item.name)}</h5>
            <span class="text-[10px] text-dusty-600">${item.time}</span>
          </div>
        </div>
        <button onclick="toggleWishLike(${index})" class="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-dusty-50 border border-dusty-300 ${item.liked ? 'text-red-500 font-bold' : 'text-dusty-700'} hover:scale-105 transition-all">
          <span>${item.liked ? '❤️' : '🤍'}</span>
          <span>${item.likes}</span>
        </button>
      </div>
      <p class="text-xs text-dusty-700 leading-relaxed pl-10">${escapeHtml(item.content)}</p>
    </div>
  `).join("");
}

window.toggleWishLike = function(index) {
  if (wishesData[index]) {
    if (wishesData[index].liked) {
      wishesData[index].likes--;
      wishesData[index].liked = false;
    } else {
      wishesData[index].likes++;
      wishesData[index].liked = true;
    }
    localStorage.setItem("wedding_wishes_list_bride", JSON.stringify(wishesData));
    renderWishes();
  }
};

function escapeHtml(string) {
  const div = document.createElement("div");
  div.innerText = string;
  return div.innerHTML;
}

// =============================================================================
// 8. WEDDING GIFT TABS & CLIPBOARD
// =============================================================================
window.switchGiftTab = function(tabName) {
  const bankContent = document.getElementById("gift-content-bank");
  const qrisContent = document.getElementById("gift-content-qris");
  const physContent = document.getElementById("gift-content-physical");

  const tabBank = document.getElementById("tab-btn-bank");
  const tabQris = document.getElementById("tab-btn-qris");
  const tabPhys = document.getElementById("tab-btn-physical");

  bankContent.classList.add("hidden");
  qrisContent.classList.add("hidden");
  physContent.classList.add("hidden");

  [tabBank, tabQris, tabPhys].forEach((btn) => {
    btn.className = "px-5 py-2 rounded-xl text-xs font-bold tracking-wider transition-all text-dusty-600 hover:text-dusty-950";
  });

  const activeClasses = "px-5 py-2 rounded-xl text-xs font-bold tracking-wider transition-all bg-dusty-700 text-white shadow-md";

  if (tabName === "bank") {
    bankContent.classList.remove("hidden");
    tabBank.className = activeClasses;
  } else if (tabName === "qris") {
    qrisContent.classList.remove("hidden");
    tabQris.className = activeClasses;
  } else if (tabName === "physical") {
    physContent.classList.remove("hidden");
    tabPhys.className = activeClasses;
  }
};

window.copyToClipboard = function(text, label = "Teks") {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label} berhasil disalin ke clipboard! 📋`);
    }).catch(() => {
      fallbackCopyText(text, label);
    });
  } else {
    fallbackCopyText(text, label);
  }
};

function fallbackCopyText(text, label) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
    showToast(`${label} berhasil disalin! 📋`);
  } catch (err) {
    showToast(`Gagal menyalin. Silakan salin manual: ${text}`);
  }
  document.body.removeChild(textArea);
}

// =============================================================================
// 9. LIGHTBOX MODAL VIEWER
// =============================================================================
window.openLightbox = function(id) {
  currentLightboxIndex = id;
  updateLightboxContent();
  const modal = document.getElementById("lightbox-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
};

window.closeLightbox = function() {
  const modal = document.getElementById("lightbox-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
};

window.nextLightbox = function() {
  currentLightboxIndex++;
  if (currentLightboxIndex > galleryData.length) {
    currentLightboxIndex = 1;
  }
  updateLightboxContent();
};

window.prevLightbox = function() {
  currentLightboxIndex--;
  if (currentLightboxIndex < 1) {
    currentLightboxIndex = galleryData.length;
  }
  updateLightboxContent();
};

function updateLightboxContent() {
  const item = galleryData.find((g) => g.id === currentLightboxIndex) || galleryData[0];
  const titleEl = document.getElementById("lightbox-title");
  const descEl = document.getElementById("lightbox-desc");
  const counterEl = document.getElementById("lightbox-counter");
  const placeholderEl = document.getElementById("lightbox-image-placeholder");

  if (titleEl) titleEl.innerText = item.title;
  if (descEl) descEl.innerText = item.desc;
  if (counterEl) counterEl.innerText = `Foto ${item.id} dari ${galleryData.length}`;

  if (placeholderEl) {
    placeholderEl.innerHTML = `
      ${item.icon}
      <h4 class="font-serif text-2xl text-dusty-950 font-bold">${item.title}</h4>
      <p class="text-xs text-dusty-600 mt-2 font-normal">${item.desc}</p>
    `;
  }
}

window.addEventListener("keydown", (e) => {
  const modal = document.getElementById("lightbox-modal");
  if (modal && !modal.classList.contains("hidden")) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") nextLightbox();
    if (e.key === "ArrowLeft") prevLightbox();
  }
});

// =============================================================================
// 10. SCROLLSPY & REVEAL OBSERVER
// =============================================================================
function initScrollSpy() {
  const sections = document.querySelectorAll("main section");
  const navItems = document.querySelectorAll(".nav-item");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (pageYOffset >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

function initRevealOnScroll() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fade-in-up");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll("section").forEach((sec) => {
    observer.observe(sec);
  });
}

// =============================================================================
// 11. TOAST NOTIFICATION UTILITY
// =============================================================================
function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast-item px-5 py-3 rounded-2xl bg-dusty-900 text-white text-xs sm:text-sm font-bold shadow-xl backdrop-blur-md flex items-center gap-2 pointer-events-auto border border-dusty-700";
  toast.innerHTML = `
    <span class="text-dusty-300 text-base">✨</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3000);
}
