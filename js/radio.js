/* =========================
   RADIO STREAM CONFIG
========================= */

const audio = document.getElementById('player');

audio.src = "https://i.klikhost.com/8016/stream";
audio.preload = "none";
audio.crossOrigin = "anonymous";

/* =========================
   UI ADJUSTMENT (RADIO MODE)
========================= */

const prevBtn   = document.getElementById('prevBtn');
const nextBtn   = document.getElementById('nextBtn');
const qpBar     = document.getElementById('qpBar');
const qpFill    = document.getElementById('qpFill');
const qpThumb   = document.getElementById('qpThumb');
const timeNow   = document.getElementById('timeNow');
const timeTotal = document.getElementById('timeTotal');
const repeatBtn = document.getElementById('repeatBtn');
const playerInfo = document.getElementById('playerInfo');

if (prevBtn) prevBtn.style.display = "none";
if (nextBtn) nextBtn.style.display = "none";
if (repeatBtn) repeatBtn.style.display = "none";

if (qpBar) qpBar.style.pointerEvents = "none";
if (qpFill) qpFill.style.width = "0%";
if (qpThumb) qpThumb.style.display = "none";

if (timeNow) timeNow.textContent = "LIVE";
if (timeTotal) timeTotal.textContent = "";

/* =========================
   PLAYER INFO
========================= */

function updateRadioInfo(text = "LIVE") {
  if (!playerInfo) return;

  playerInfo.innerHTML = `
    <div class="info-surat">Radio Al-Qur'an</div>
    <div class="info-ayat" style="color:red;font-weight:600;">
      ● ${text}
    </div>
  `;
}

updateRadioInfo();

/* =========================
   AUTO RECONNECT
========================= */

audio.addEventListener("error", () => {
  updateRadioInfo("RECONNECTING...");
  setTimeout(() => {
    audio.load();
    audio.play().catch(()=>{});
  }, 3000);
});

/* =========================
   MEDIA SESSION
========================= */

function setMediaSession(title = "Radio Al-Qur'an Live") {
  if (!('mediaSession' in navigator)) return;

  navigator.mediaSession.metadata = new MediaMetadata({
    title: title,
    artist: "Streaming Dakwah",
    artwork: [
      {
        src: "/assets/img/radio-cover.jpg",
        sizes: "512x512",
        type: "image/jpeg"
      }
    ]
  });

  navigator.mediaSession.setActionHandler('play', () => audio.play());
  navigator.mediaSession.setActionHandler('pause', () => audio.pause());
}

setMediaSession();

/* =========================
   STATUS EVENTS
========================= */

audio.addEventListener("playing", () => {
  updateRadioInfo("LIVE");
  setMediaSession("Radio Al-Qur'an Live");

  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = "playing";
  }
});

audio.addEventListener("pause", () => {
  updateRadioInfo("PAUSED");

  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = "paused";
  }
});

audio.addEventListener("waiting", () => {
  updateRadioInfo("BUFFERING...");
});

/* =========================
   LIVE METADATA (ICY)
========================= */

async function fetchStreamMetadata() {
  try {
    const response = await fetch("https://i.klikhost.com/8016/stream", {
      method: "GET",
      headers: { "Icy-MetaData": "1" }
    });

    const reader = response.body.getReader();
    const { value } = await reader.read();

    const text = new TextDecoder().decode(value);
    const match = text.match(/StreamTitle='([^']*)'/);

    if (match && match[1]) {
      const title = match[1];

      updateRadioInfo(title);
      setMediaSession(title);
    }

  } catch (e) {
    // kemungkinan besar server tidak support CORS/ICY
  }
}

/* cek metadata tiap 20 detik */
setInterval(fetchStreamMetadata, 20000);
