
/* ============================================================
   extensiones.js — FIX HOME CAPTURA v2 (corrige pantalla vacía)
   ============================================================ */
(function(){
  document.getElementById('mh-home-captura-style')?.remove();
  const css = `
  #main-screen{
    background: linear-gradient(120deg, #ff7b7b 0%, #ff9f4d 12%, #ffdd57 28%, #7ee787 45%, #7ec8ff 65%, #a78bfa 82%, #ff8fd6 100%) !important;
    min-height: 100vh !important; padding: 8px 10px 12px !important;
  }
  #main-screen .hero-rainbow-bg{ display:block !important; background: transparent !important; position: relative !important; }
  #main-screen .hero-spotlight, #main-screen .hero-confetti, #main-screen .hero-title-wrap, #main-screen .hero-sparkle{ display:none !important; }
  #main-screen .hero-orbit, #main-screen .hero-orbit-ring, #main-screen .hero-cta{ display:none !important; }
  #main-screen .hero-topbar{ display:flex !important; gap:8px !important; align-items:center !important; margin: 4px 4px 10px !important; background: transparent !important; z-index:10 !important; position:relative !important; }
  #main-screen .hero-pill{ background: rgba(0,0,0,.28) !important; border: 1px solid rgba(255,255,255,.35) !important; backdrop-filter: blur(10px) !important; border-radius: 999px !important; padding: 6px 14px !important; font-size: 13px !important; font-weight: 900 !important; color:#fff !important; }
  #main-screen .logout-btn, #app-version-label{ display:none !important; }
  #main-screen .mh-home-layout{ display:grid !important; grid-template-columns: 210px 1fr 360px !important; gap:12px !important; align-items:start !important; margin-top:6px !important; position:relative !important; z-index:5 !important; }
  #main-screen .mh-col-left{ display:flex !important; flex-direction:column !important; gap:10px !important; }
  #main-screen .userlvl-widget{ display:block !important; background: rgba(12,18,32,.82) !important; border:1px solid rgba(255,255,255,.18) !important; border-radius:18px !important; padding:10px 12px !important; backdrop-filter: blur(12px) !important; margin:0 !important; }
  #main-screen .userlvl-top-row{ display:flex !important; justify-content:space-between !important; font-size:12px !important; font-weight:800 !important; color:#fff !important; }
  #main-screen .userlvl-bar-bg{ height:16px !important; border-radius:999px !important; margin-top:6px !important; background: rgba(255,255,255,.18) !important; border:none !important; }
  #main-screen .userlvl-bar-fill{ background: linear-gradient(90deg, #a855f7, #ec4899) !important; border-radius:999px !important; }
  #main-screen .mh-xp-chips{ display:flex !important; gap:6px !important; margin-top:8px !important; }
  #main-screen .mh-xp-chip{ flex:1; background: rgba(0,0,0,.35); border:1px solid rgba(255,255,255,.15); border-radius:999px; padding:5px 4px; font-size:9px; font-weight:800; color:#fff; text-align:center; }
  #main-screen .mh-cta-big{ border-radius:18px !important; padding:14px 12px !important; border:1px solid rgba(255,255,255,.5) !important; display:flex !important; align-items:center !important; gap:10px !important; cursor:pointer; font-weight:900 !important; color:#fff !important; box-shadow: 0 6px 16px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.5) !important; }
  #main-screen .mh-cta-pink{ background: linear-gradient(135deg, #ff6eb0, #b24dff) !important; }
  #main-screen .mh-cta-green{ background: linear-gradient(135deg, #34d399, #0ea75a) !important; }
  #main-screen .mh-cta-ic{ width:36px; height:36px; border-radius:50%; background: rgba(255,255,255,.3); display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; border:1px solid rgba(255,255,255,.6); }
  #main-screen .mh-col-center{ display:flex !important; align-items:center !important; justify-content:center !important; min-height:240px !important; }
  #main-screen .mh-mascot-wrap{ position:relative; width:180px; height:180px; display:flex; align-items:center; justify-content:center; filter: drop-shadow(0 12px 18px rgba(0,0,0,.35)); animation: mhFloat 3s ease-in-out infinite; }
  #main-screen .mh-chick{ font-size:115px; line-height:1; }
  #main-screen .mh-mascot-crown{ position:absolute; top:2px; left:50%; transform:translateX(-10%); font-size:40px; }
  @keyframes mhFloat{ 0%,100%{ transform: translateY(0)} 50%{ transform: translateY(-8px)} }
  #main-screen .mh-col-right{ display:grid !important; grid-template-columns: repeat(4, 1fr) !important; gap:8px !important; }
  #main-screen .mh-home-btn{ aspect-ratio: 0.9; border-radius:16px; padding:6px; display:flex; flex-direction:column; align-items:center; justify-content:space-between; cursor:pointer; background: rgba(255,255,255,.28); border:1px solid rgba(255,255,255,.55); backdrop-filter: blur(8px); }
  #main-screen .mh-home-btn .mh-hb-ic{ flex:1; width:100%; display:flex; align-items:center; justify-content:center; font-size:28px; }
  #main-screen .mh-home-btn .mh-hb-lb{ font-size:8.5px; font-weight:900; color:#222; background: rgba(255,255,255,.9); border-radius:6px; padding:2px 5px; text-transform:uppercase; text-align:center; }
  `;
  const styleTag = document.createElement('style');
  styleTag.id = 'mh-home-captura-style';
  styleTag.textContent = css;
  document.head.appendChild(styleTag);
  function buildHome(){
    const main = document.getElementById('main-screen');
    if(!main) return;
    if(main.querySelector('.mh-home-layout')) return;
    const topbar = main.querySelector('.hero-topbar');
    const lvlWidget = main.querySelector('.userlvl-widget');
    if(!topbar || !lvlWidget) return;
    const layout = document.createElement('div');
    layout.className = 'mh-home-layout';
    const colL = document.createElement('div'); colL.className = 'mh-col-left'; colL.appendChild(lvlWidget);
    const ctaBingo = document.createElement('div'); ctaBingo.className = 'mh-cta-big mh-cta-pink';
    ctaBingo.innerHTML = '<div class="mh-cta-ic">🚀</div><div><div style="font-size:10px;opacity:.9">ÚNETE A</div><div style="font-size:12px;line-height:1.05">BINGO AUTOMÁTICO</div></div>';
    ctaBingo.onclick = () => window.navTabTo && navTabTo('game-screen');
    const ctaIsla = document.createElement('div'); ctaIsla.className = 'mh-cta-big mh-cta-green';
    ctaIsla.innerHTML = '<div class="mh-cta-ic">🌴</div><div style="font-size:12px;line-height:1.05">EXPLORA MI<br>ISLA</div>';
    ctaIsla.onclick = () => window.navTabTo && navTabTo('isla-screen');
    colL.appendChild(ctaBingo); colL.appendChild(ctaIsla);
    const colC = document.createElement('div'); colC.className = 'mh-col-center';
    colC.innerHTML = '<div class="mh-mascot-wrap"><div class="mh-mascot-crown">👑</div><div class="mh-chick">🐥</div></div>';
    const colR = document.createElement('div'); colR.className = 'mh-col-right';
    const btns = [
      {lb:'MASCOTAS', ic:'🐾', act:()=> navTabTo && navTabTo('mascota-screen')},
      {lb:'PASE', ic:'🎫', act:()=> navTabTo && navTabTo('vippass-screen')},
      {lb:'VIP', ic:'👑', act:()=> window.openVipProgressModal && openVipProgressModal()},
      {lb:'MISIONES', ic:'🎯', act:()=> navTabTo && navTabTo('missions-screen')},
      {lb:'CARTELES', ic:'📋', act:()=> navTabTo && navTabTo('campaign-screen')},
      {lb:'BANDEJA', ic:'✉️', act:()=> navTabTo && navTabTo('store-screen')},
      {lb:'RECOMPENSAS', ic:'🎁', act:()=> window.openDailyRewardsModal && openDailyRewardsModal()},
      {lb:'TIENDA', ic:'🛒', act:()=> navTabTo && navTabTo('store-screen')},
    ];
    btns.forEach(b=>{ const el=document.createElement('div'); el.className='mh-home-btn'; el.innerHTML='<div class="mh-hb-ic">'+b.ic+'</div><div class="mh-hb-lb">'+b.lb+'</div>'; el.onclick=b.act; colR.appendChild(el); });
    layout.appendChild(colL); layout.appendChild(colC); layout.appendChild(colR);
    topbar.insertAdjacentElement('afterend', layout);
  }
  document.addEventListener('DOMContentLoaded', buildHome);
  setTimeout(buildHome, 300); setTimeout(buildHome, 1000); setTimeout(buildHome, 2500);
  const obs = new MutationObserver(buildHome);
  obs.observe(document.body, {attributes:true, subtree:true, attributeFilter:['class']});
  setInterval(()=>{ const m=document.getElementById('main-screen'); if(m && m.classList.contains('active') && !m.querySelector('.mh-home-layout')) buildHome(); }, 800);
})();
