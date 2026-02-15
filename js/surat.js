const id = window.SURAT_ID;

/* ===== OVERRIDE NAMA ARAB SURAT (boleh HTML/icon) ===== */
const OVERRIDE_SURAT = {};
for (let i = 1; i <= 114; i++) {
  OVERRIDE_SURAT[i] = {
    arab: `<i class="icon-0"></i><i class="icon-${i}"></i>`
  };
}

/* ===== OVERRIDE ARTI SURAT ===== */
const OVERRIDE_ARTI = {
  2: "Sapi Betina",
  8: "Harta Rampasan Perang",
  10: "Nabi Yunus",
  11: "Nabi Hud",
  12: "Nabi Yusuf",
  14: "Nabi Ibrahim",
  15: "Negeri Kaum Tsamud",
  17: "Perjalanan Malam",
  30: "Bangsa Romawi",
  32: "Sujud",
  34: "Negeri Saba",
  45: "Yang Berlutut",
  47: "Nabi Muhammad SAW",
  55: "Yang Maha Pengasih",
  60: "Perempuan yang Diuji",
  62: "Hari Jum'at",
  71: "Nabi Nuh",
  81: "Menggulung",
  87: "Yang Maha Tinggi",
  88: "Hari Pembalasan",
  93: "Waktu Dhuha",
  103: "Masa",
  106: "Suku Quraisy",
  108: "Nikmat yang Banyak",
  112: "Kemurnian Keesaan Allah",
  113: "Waktu Subuh"
};

const OVERRIDE_LATIN = {
  18: "Al-Kahfi",
  20: "Thaha",
  35: "Fathir",
  37: "Ash-Shaffat",
  38: "Shad",
  41: "Fushshilat",
  45: "Al-Jatsiyah",
  51: "Adz-Dzariyat",
  52: "At-Thur",
  64: "At-Taghabun",
  65: "At-Thalaq",
  74: "Al-Muddatstsir",
  82: "Al-Infithar",
  83: "Al-Muthaffifin",
  93: "Ad-Dhuha",
  102: "At-Takatsur",
  103: "At-'Ashr",
  108: "Al-Kautsar",
  110: "An-Nashr",
  114: "An-Nas",
};

const titleLatin=document.getElementById('titleLatin');
const titleArab=document.getElementById('titleArab');
const titleArti=document.getElementById('titleArti');
const info=document.getElementById('info');
const content=document.getElementById('content');
const bismillah=document.getElementById('bismillah');
const select=document.getElementById("suratSelect");

if (id !== 1 && id !== 9) {
  bismillah.textContent =
    'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
  if (document.fonts) {
    document.fonts.load("1em surahquran").then(() => {
      bismillah.innerHTML = '<i class="icon-115"></i>';
    });
  }
} else {
  bismillah.textContent = '';
}

const audio=document.getElementById('player');
const wrap=document.getElementById('playerWrap');
const topBtn=document.querySelector('.top');

let ayatEls=[],currentIndex=-1,prevSurah=null,nextSurah=null,allSurah=[];
const AUTO_NEXT_SURAH=true;

window.addEventListener('scroll',()=>{
  if(!topBtn)return;
  topBtn.style.display=window.scrollY>500?'block':'none';
});

function scrollToTop(){
  scrollTo({top:0,behavior:'smooth'});
}

let isClosing = false;

function playAyat(i){
  if(!navigator.onLine){
    showToast("Anda sedang offline. Audio tidak tersedia.");
    return;
  }
  if(i<0||i>=ayatEls.length)return;
  currentIndex=i;
  const file=`${String(id).padStart(3,'0')}${String(i+1).padStart(3,'0')}`;
  audio.src=`https://everyayah.com/data/Alafasy_64kbps/${file}.mp3`;
  wrap.classList.add('show');
  audio.play();
  highlight(i);
  localStorage.setItem(`lastAyatSurah${id}`,i);
}

/* ================= */
/* SLUG DIKUNCI     */
/* ================= */

function getSlugName(nomor){
  const s = allSurah[nomor-1];
  return slugify(OVERRIDE_LATIN[nomor] || s.namaLatin);
}

audio.addEventListener('ended',()=>{
  if(currentIndex<ayatEls.length-1){
    playAyat(currentIndex+1);
  }else if(AUTO_NEXT_SURAH&&nextSurah){
    location.href=`/surat/${nextSurah}-${getSlugName(nextSurah)}/`;
  }
});

audio.addEventListener("error", () => {
  if(isClosing){
    isClosing = false;
    return;
  }
  showToast("Audio gagal dimuat. Periksa koneksi internet.");
  closePlayer();
});

function closePlayer(){
  isClosing = true;
  audio.onpause = null;
  audio.onplay  = null;
  audio.pause();
  audio.removeAttribute("src");
  audio.load();
  wrap.classList.remove('show');
  currentIndex = -1;
  ayatEls.forEach(el=>{
    const btn = el.querySelector('.play');
    if(btn) btn.innerHTML = `
<svg viewBox="0 0 20 20" fill="currentColor">
  <path d="M4 2l14 8-14 8z"/>
</svg>`;
  });
  updateInfo();
}

function setActiveAyat(i){
  if(i<0||i>=ayatEls.length)return;
  currentIndex=i;
  highlight(i);
}

function highlight(i){
  ayatEls.forEach(e=>e.classList.remove('active'));
  const el=ayatEls[i];
  if(!el)return;
  el.classList.add('active');
  el.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function go(n){
  if(n===-1&&prevSurah){
    location.href=`/surat/${prevSurah}-${getSlugName(prevSurah)}/`;
  }
  if(n===1&&nextSurah){
    location.href=`/surat/${nextSurah}-${getSlugName(nextSurah)}/`;
  }
}

function setNav(btns){
  if(!btns || btns.length < 2) return;

  const prevSVG = `<svg width="16" viewBox="0 0 24 24">
    <polyline points="15 18 9 12 15 6"
      fill="none"
      stroke="currentColor"
      stroke-width="2"/>
  </svg>`;

  const nextSVG = `<svg width="16" viewBox="0 0 24 24">
    <polyline points="9 18 15 12 9 6"
      fill="none"
      stroke="currentColor"
      stroke-width="2"/>
  </svg>`;

  if(prevSurah){
    const name = OVERRIDE_LATIN[prevSurah] || allSurah[prevSurah-1].namaLatin;
    btns[0].innerHTML = prevSVG + name;
  }

  if(nextSurah){
    const name = OVERRIDE_LATIN[nextSurah] || allSurah[nextSurah-1].namaLatin;
    btns[1].innerHTML = name + nextSVG;
  }
}


function setMeta(attr,key,value){
  let m=document.querySelector(`meta[${attr}="${key}"]`);
  if(!m){
    m=document.createElement('meta');
    m.setAttribute(attr,key);
    document.head.appendChild(m);
  }
  m.setAttribute('content',value);
}

async function load(){
  const listRes = await fetch('https://equran.id/api/v2/surat');
  const listJson = await listRes.json();
  allSurah = listJson.data;
  prevSurah=id>1?id-1:null;
  nextSurah=id<114?id+1:null;

  setNav(document.querySelectorAll('.nav:first-of-type button'));
  setNav(document.querySelectorAll('#navBottom button'));

  /* ===== DROPDOWN DIGABUNG ===== */
  if(select){
    allSurah.forEach(s=>{
      const nomor=s.nomor;
      const nama=OVERRIDE_LATIN[nomor]||s.namaLatin;
      const o=document.createElement("option");
      o.value=nomor;
      o.textContent=`${nomor}. ${nama}`;
      if(nomor===id)o.selected=true;
      select.appendChild(o);
    });

    select.onchange=e=>{
      const i=+e.target.value;
      location.href=`/surat/${i}-${getSlugName(i)}/`;
    };
  }

  const res = await fetch(`https://equran.id/api/v2/surat/${id}`);
  const json = await res.json();
  const s = json.data;

  const slug=slugify(s.namaLatin);
  const canonical=`${location.origin}/surat/${id}-${slug}/`;
  document.title=`Surat ${s.namaLatin} (${s.arti}) | Al-Qur'an`;

  const desc=`Baca Surat ${s.namaLatin} (${s.arti}) lengkap ${s.jumlahAyat} ayat, teks Arab, terjemah Indonesia, dan audio.`;
  document.querySelector('meta[name="description"]')?.setAttribute('content',desc);
  document.getElementById('canonicalLink').href=canonical;

  setMeta('property','og:title',`Surat ${s.namaLatin} | Al-Qur'an`);
  setMeta('property','og:description',desc);
  setMeta('property','og:url',canonical);
  setMeta('property','og:image',`${location.origin}/assets/img/cover.jpg`);

  titleLatin.textContent = `${s.nomor}. ${OVERRIDE_LATIN[s.nomor] || s.namaLatin}`;

  const suratOverride = OVERRIDE_SURAT[id] || {};
  titleArab.innerHTML = suratOverride.arab || s.nama;
  titleArti.textContent = `${OVERRIDE_ARTI[id] || s.arti}`;
  info.textContent=`${s.jumlahAyat} Ayat • ${s.tempatTurun}`;

  content.innerHTML='';
  ayatEls=[];

  s.ayat.forEach((a,i)=>{
    const el=document.createElement('div');
    el.className='ayat';
    el.innerHTML=`
      <button class="play">
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 2l14 8-14 8z"/>
        </svg>
      </button>
      <div class="arab">
        <span class="ayah-text">${a.teksArab}</span>
        ۝${toArabic(a.nomorAyat)}
      </div>
      <div class="latin">${a.teksLatin}</div>
      <div class="arti">${a.teksIndonesia}</div>
    `;
    el.querySelector('.play').onclick=()=>playAyat(i);
    content.appendChild(el);
    ayatEls.push(el);
  });

  const last=localStorage.getItem(`lastAyatSurah${id}`);
  if(last!==null)setActiveAyat(+last);
}

function toArabic(n){
  return n.toString().replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
}

function slugify(n){
  return n.toLowerCase()
          .replace(/['’]/g,'')
          .replace(/\s+/g,'-');
}

load();

