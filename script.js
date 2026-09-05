/**
 * =========================================================================
 * WEDDING INVITATION SCRIPT - ADRIAN & NATASHA
 * =========================================================================
 */

let isAudioPlaying = false;
let audioContext = null;
let audioInterval = null;
let currentLightboxIndex = 1;
let isOpeningCover = false;

// Voice note states
let isVoicePlaying = false;
let voiceInterval = null;
let voiceSeconds = 0;
let voiceSynthTimer = null;

// 5 Curated Editorial Gallery Photos
const galleryData = [
  {
    id: 1,
    title: "The Celestial Union",
    desc: "Keanggunan busana adat Nusantara bernuansa Midnight Navy & Pure White dalam balutan estetika editorial modern.",
    badge: "Vogue Wedding Vol. 24",
    icon: `<svg class="w-20 h-20 text-white mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`
  },
  {
    id: 2,
    title: "Warm Sunset Embrace",
    desc: "Tawa lepas di kala senja di Pantai Seminyak, Bali. Menjadi saksi awal perjalanan yang saling melengkapi.",
    badge: "Polaroid Snapshot 2022",
    icon: `<svg class="w-20 h-20 text-amber-100 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
  },
  {
    id: 3,
    title: "Stardust Vows Under The Sky",
    desc: "Di bawah lautan gemintang Penanjakan Bromo pada pukul 05.15 WIB, dinginnya embun menjadi saksi kehangatan ikrar kami.",
    badge: "Bromo Expedition 2025",
    icon: `<svg class="w-20 h-20 text-blue-200 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
  },
  {
    id: 4,
    title: "The Solitaire Ring Promise",
    desc: "Cincin pertunangan bertahtakan permata sebagai lambang ketulusan dan janji seumur hidup.",
    badge: "Sacred Ring Macro",
    icon: `<svg class="w-20 h-20 text-amber-200 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="7" r="2" fill="currentColor"/></svg>`
  },
  {
    id: 5,
    title: "Eternal Symphony",
    desc: "Menatap masa depan bersama dengan penuh harapan, doa restu, dan keyakinan akan berkah-Nya.",
    badge: "Jakarta Pre-Wedding 2026",
    icon: `<svg class="w-20 h-20 text-white mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
  }
];

// Initial Wishes List
const defaultWishes = [
  {
    id: 1,
    name: "Rizky & Amanda",
    time: "2 jam yang lalu",
    content: "Selamat Adrian & Natasha! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Lancar sampai hari H!",
    likes: 12,
    liked: false
  },
  {
    id: 2,
    name: "Keluarga Besar Bpk. Gunawan",
    time: "4 jam yang lalu",
    content: "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khoir. Turut berbahagia untuk kedua keluarga.",
    likes: 8,
    liked: false
  },
  {
    id: 3,
    name: "Alief Pratama (Sahabat Kampus)",
    time: "1 hari yang lalu",
    content: "Akhirnya berlabuh ke pelaminan! Selamat bro Adrian dan Natasha, happily ever after!",
    likes: 15,
    liked: false
  },
  {
    id: 4,
    name: "Siti Nurhaliza",
    time: "2 hari yang lalu",
    content: "Semoga pernikahannya selalu dipenuhi keberkahan, cinta, dan kebahagiaan seumur hidup. Aamiin!",
    likes: 6,
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
  initEnvelopeUnboxing();
  initVoiceNotePlayer();
  init3DCardTilt();
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

  if (urlParams.get("opened") === "true") {
    const cover = document.getElementById("opening-cover");
    if (cover) cover.style.display = "none";
    document.body.classList.remove("overflow-hidden");
    document.documentElement.classList.remove("overflow-hidden");
  }
}

// =============================================================================
// 2. INTERACTIVE 3D WAX SEAL & ENVELOPE UNBOXING
// =============================================================================
function initEnvelopeUnboxing() {
  const btnSeal = document.getElementById("btn-wax-seal");
  const btnOpen = document.getElementById("btn-open-invitation");

  if (btnSeal) {
    btnSeal.addEventListener("click", () => {
      openWeddingInvitation();
    });
  }

  if (btnOpen) {
    btnOpen.addEventListener("click", () => {
      openWeddingInvitation();
    });
  }
}

function playWaxCrackAudio() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioContext) audioContext = new AudioCtx();
    if (audioContext.state === "suspended") audioContext.resume();

    const now = audioContext.currentTime;

    // 1. Crisp pop/seal crack impulse
    const osc1 = audioContext.createOscillator();
    const gain1 = audioContext.createGain();
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(320, now);
    osc1.frequency.exponentialRampToValueAtTime(70, now + 0.08);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc1.connect(gain1);
    gain1.connect(audioContext.destination);
    osc1.start(now);
    osc1.stop(now + 0.1);

    // 2. Ascending golden chime sparkle
    const notes = [659.25, 880, 1108.73, 1318.51];
    notes.forEach((freq, idx) => {
      const chimeOsc = audioContext.createOscillator();
      const chimeGain = audioContext.createGain();
      chimeOsc.type = "sine";
      chimeOsc.frequency.setValueAtTime(freq, now + 0.08 + (idx * 0.06));
      chimeGain.gain.setValueAtTime(0.001, now + 0.08 + (idx * 0.06));
      chimeGain.gain.exponentialRampToValueAtTime(0.07, now + 0.1 + (idx * 0.06));
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8 + (idx * 0.06));
      chimeOsc.connect(chimeGain);
      chimeGain.connect(audioContext.destination);
      chimeOsc.start(now + 0.08 + (idx * 0.06));
      chimeOsc.stop(now + 0.9 + (idx * 0.06));
    });
  } catch (err) {
    console.warn("Wax sound notice:", err);
  }
}

function createWaxSparks() {
  const container = document.getElementById("wax-sparks-container");
  if (!container) return;

  const sparkCount = 20;
  for (let i = 0; i < sparkCount; i++) {
    const spark = document.createElement("div");
    const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() * 0.3 - 0.15);
    const distance = Math.random() * 90 + 40;
    const duration = Math.random() * 0.4 + 0.5;
    const size = Math.random() * 5 + 3;

    spark.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: radial-gradient(circle, #fff7cc 0%, #ffd43b 60%, #e67700 100%);
      box-shadow: 0 0 10px #ffd43b;
      transform: translate(-50%, -50%);
      transition: transform ${duration}s cubic-bezier(0.1, 0.9, 0.2, 1), opacity ${duration}s ease-out;
      pointer-events: none;
      z-index: 30;
      opacity: 1;
    `;
    container.appendChild(spark);

    requestAnimationFrame(() => {
      const destX = Math.cos(angle) * distance;
      const destY = Math.sin(angle) * distance;
      spark.style.transform = `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(0)`;
      spark.style.opacity = "0";
    });

    setTimeout(() => {
      if (spark.parentNode) spark.parentNode.removeChild(spark);
    }, duration * 1000 + 100);
  }
}

function openWeddingInvitation() {
  if (isOpeningCover) return;
  isOpeningCover = true;

  playWaxCrackAudio();
  createWaxSparks();

  const sealBtn = document.getElementById("btn-wax-seal");
  const envelope = document.getElementById("envelope-wrapper");
  const cover = document.getElementById("opening-cover");

  if (sealBtn) sealBtn.classList.add("is-cracking");
  if (envelope) envelope.classList.add("is-open");

  startRomanticAudio();

  setTimeout(() => {
    if (cover) {
      cover.style.transition = "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.9s ease";
      cover.style.opacity = "0";
      cover.style.transform = "translateY(-100%) scale(1.05)";
      cover.style.filter = "blur(10px)";
    }
    // Enable full page scrolling after invitation opens
    document.body.classList.remove("overflow-hidden");
    document.documentElement.classList.remove("overflow-hidden");
    showToast("Selamat datang di pernikahan Adrian & Natasha! ✨");
  }, 1350);

  setTimeout(() => {
    if (cover) cover.style.display = "none";
  }, 2300);
}

// =============================================================================
// 2.5. BESPOKE VOICE NOTE GREETING PLAYER
// =============================================================================
function initVoiceNotePlayer() {
  const btnVoice = document.getElementById("btn-voice-note");
  const iconPlay = document.getElementById("icon-voice-play");
  const iconPause = document.getElementById("icon-voice-pause");
  const timerCurrent = document.getElementById("voice-timer-current");
  const waveBars = document.querySelectorAll(".wave-bar");

  if (!btnVoice) return;

  btnVoice.addEventListener("click", () => {
    if (isVoicePlaying) {
      stopVoiceNote();
      showToast("Pesan suara dijeda ⏸️");
    } else {
      startVoiceNote();
      showToast("Memutar pesan suara mempelai 🎙️");
    }
  });

  function startVoiceNote() {
    isVoicePlaying = true;
    if (iconPlay) iconPlay.classList.add("hidden");
    if (iconPause) iconPause.classList.remove("hidden");
    waveBars.forEach((bar) => bar.classList.add("playing"));

    playVoiceSynthesizer();

    if (voiceInterval) clearInterval(voiceInterval);
    voiceInterval = setInterval(() => {
      voiceSeconds++;
      if (timerCurrent) {
        const secStr = String(voiceSeconds % 60).padStart(2, "0");
        timerCurrent.textContent = `00:${secStr}`;
      }

      // Randomize bar heights dynamically for live equalizer effect
      waveBars.forEach((bar) => {
        const h = Math.floor(Math.random() * 22) + 6;
        bar.style.height = `${h}px`;
      });

      if (voiceSeconds >= 24) {
        stopVoiceNote();
        voiceSeconds = 0;
        if (timerCurrent) timerCurrent.textContent = "00:00";
      }
    }, 1000);
  }

  function stopVoiceNote() {
    isVoicePlaying = false;
    if (iconPlay) iconPlay.classList.remove("hidden");
    if (iconPause) iconPause.classList.add("hidden");
    waveBars.forEach((bar) => {
      bar.classList.remove("playing");
      bar.style.height = "";
    });

    if (voiceInterval) {
      clearInterval(voiceInterval);
      voiceInterval = null;
    }
    if (voiceSynthTimer) {
      clearInterval(voiceSynthTimer);
      voiceSynthTimer = null;
    }
  }

  function playVoiceSynthesizer() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContext) audioContext = new AudioCtx();
      if (audioContext.state === "suspended") audioContext.resume();

      const melody = [329.63, 392.00, 493.88, 587.33, 493.88, 392.00];
      let noteIdx = 0;

      function playNote() {
        if (!isVoicePlaying || !audioContext) return;
        const now = audioContext.currentTime;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(melody[noteIdx % melody.length], now);
        noteIdx++;

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.045, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start(now);
        osc.stop(now + 1.3);
      }

      playNote();
      if (voiceSynthTimer) clearInterval(voiceSynthTimer);
      voiceSynthTimer = setInterval(playNote, 1400);
    } catch (e) {
      console.warn("Voice synth error:", e);
    }
  }
}

// =============================================================================
// 2.6. EDITORIAL 3D CARD TILT EFFECT
// =============================================================================
function init3DCardTilt() {
  const cards = document.querySelectorAll(".tilt-card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
  });
}

// =============================================================================
// 2.7. AUDIO TOGGLE EVENT
// =============================================================================
function initEvents() {
  const audioToggle = document.getElementById("btn-audio-toggle");

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
        gainNode.gain.exponentialRampToValueAtTime(0.06 / (idx + 1), now + 0.1);
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
// 3. CELESTIAL STARDUST / STARFIELD CANVAS
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
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.3 + 0.1,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach((star) => {
      star.alpha += star.twinkleSpeed * star.direction;
      if (star.alpha > 0.95 || star.alpha < 0.2) {
        star.direction *= -1;
      }

      star.y -= star.speed;
      if (star.y < 0) {
        star.y = height;
        star.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.shadowBlur = 4;
      ctx.shadowColor = "#ffffff";
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
  const details = encodeURIComponent("Pernikahan Adrian Pratama & Natasha Anggraini. Mohon doa restunya.");
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

  // 1. Save RSVP to localStorage
  const rsvpEntry = { name, status, pax, timestamp: new Date().toISOString() };
  const storedRSVP = JSON.parse(localStorage.getItem("wedding_rsvp_list") || "[]");
  storedRSVP.push(rsvpEntry);
  localStorage.setItem("wedding_rsvp_list", JSON.stringify(storedRSVP));

  // 2. Add Wish to wall
  const newWish = {
    id: Date.now(),
    name,
    time: "Baru saja",
    content: wish,
    likes: 1,
    liked: true
  };

  wishesData.unshift(newWish);
  localStorage.setItem("wedding_wishes_list", JSON.stringify(wishesData));
  renderWishes();

  document.getElementById("rsvp-wish").value = "";
  showToast(`Terima kasih ${name}, konfirmasi & doa restu berhasil dikirim! 🎉`);
};

// =============================================================================
// 7. BUKU TAMU / WISHES WALL
// =============================================================================
function initWishes() {
  const saved = localStorage.getItem("wedding_wishes_list");
  if (saved) {
    wishesData = JSON.parse(saved);
  } else {
    wishesData = defaultWishes;
    localStorage.setItem("wedding_wishes_list", JSON.stringify(wishesData));
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
    <div class="p-4 rounded-2xl bg-white/10 border border-white/20 space-y-2 transform transition-all hover:border-white/50 backdrop-blur-md">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-white text-navy-950 flex items-center justify-center font-bold text-xs shadow-md">
            ${item.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h5 class="text-xs font-bold text-white">${escapeHtml(item.name)}</h5>
            <span class="text-[10px] text-slate-200">${item.time}</span>
          </div>
        </div>
        <button onclick="toggleWishLike(${index})" class="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-white/15 border border-white/30 ${item.liked ? 'text-red-400 font-bold' : 'text-white'} hover:scale-105 transition-all">
          <span>${item.liked ? '❤️' : '🤍'}</span>
          <span>${item.likes}</span>
        </button>
      </div>
      <p class="text-xs text-slate-100 leading-relaxed pl-10">${escapeHtml(item.content)}</p>
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
    localStorage.setItem("wedding_wishes_list", JSON.stringify(wishesData));
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
    btn.className = "px-5 py-2 rounded-xl text-xs font-bold tracking-wider transition-all text-slate-300 hover:text-white";
  });

  const activeClasses = "px-5 py-2 rounded-xl text-xs font-bold tracking-wider transition-all bg-white text-navy-950 shadow-md";

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
      ${item.badge ? `<span class="inline-block px-3 py-0.5 rounded-full bg-white/10 text-amber-200 text-[10px] font-cinzel uppercase tracking-widest mb-2 border border-white/20">${item.badge}</span>` : ''}
      <h4 class="font-serif text-2xl text-white font-bold">${item.title}</h4>
      <p class="text-xs text-slate-200 mt-2 font-normal max-w-md mx-auto">${item.desc}</p>
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
  toast.className = "toast-item px-5 py-3 rounded-2xl bg-white text-navy-950 text-xs sm:text-sm font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 pointer-events-auto border border-white/50";
  toast.innerHTML = `
    <span class="text-navy-950 text-base">✨</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3000);
}
