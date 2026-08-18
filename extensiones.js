/* ============================================================
   extensiones.js — DISEÑO HOME TIPO CAPTURA (pollito + arcoiris)
   ============================================================ */
(function(){
  const css = `
  /* FONDO ARCOIRIS COMO EN CAPTURA */
  #main-screen{
    background: linear-gradient(120deg, #ff7b7b 0%, #ff9f4d 12%, #ffdd57 28%, #7ee787 45%, #7ec8ff 65%, #a78bfa 82%, #ff8fd6 100%) !important;
    min-height: 100vh;
    padding: 8px 10px 12px !important;
  }
  #main-screen .hero-rainbow-bg,
  #main-screen .hero-spotlight,
  #main-screen .hero-confetti,
  #main-screen .hero-title-wrap,
  #main-screen .hero-sparkle,
  #main-screen .hero-orbit-ring{
    display:none !important;
  }

  /* TOPBAR PILLS */
  #main-screen .hero-topbar{
    display:flex; gap:8px; align-items:center;
    margin: 4px 4px 6px; background: transparent !important;
  }
  #main-screen .hero-pill{
    background: rgba(0,0,0,.28) !important;
    border: 1px solid rgba(255,255,255,.35) !important;
    backdrop-filter: blur(10px);
    border-radius: 999px !important;
    padding: 6px 14px !important;
    font-size: 13px !important; font-weight: 900 !important;
    color:#fff !important;
    box-shadow: 0 2px 8px rgba(0,0,0,.2), inset 0 1px 0 rgba(255,255,255,.3);
  }
  #main-screen .hero-pill:last-of-type{
    margin-left:auto !important;
    background: rgba(0,0,0,.32) !important;
  }
  #main-screen .logout-btn{ display:none !important; }

  /* LAYOUT PRINCIPAL - 3 COLUMNAS */
  #main-screen .mh-home-layout{
    display:grid;
    grid-template-columns: 200px 1fr 340px;
    gap:12px;
    align-items:start;
    margin-top:6px;
  }
  @media (max-width: 900px){
    #main-screen .mh-home-layout{
      grid-template-columns: 160px 1fr 260px;
    }
  }

  /* COL IZQ - NIVEL + CTAS */
  #main-screen .mh-col-left{
    display:flex; flex-direction:column; gap:10px;
  }
  #main-screen .userlvl-widget{
    background: rgba(12,18,32,.82) !important;
    border:1px solid rgba(255,255,255,.18) !important;
    border-radius:18px !important;
    padding:10px 12px !important;
    backdrop-filter: blur(12px);
    box-shadow: 0 8px 24px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.12);
  }
  #main-screen .userlvl-top-row{ display:flex; justify-content:space-between; font-size:12px; font-weight:800; color:#fff; }
  #main-screen .userlvl-badge{ color:#fff !important; }
  #main-screen .userlvl-badge::before{ content:'⭐ '; }
  #main-screen .userlvl-xp-text{ font-size:10px !important; opacity:.9; }
  #main-screen .userlvl-bar-bg{
    height:16px !important; border-radius:999px !important; margin-top:6px !important;
    background: rgba(255,255,255,.15) !important; overflow:hidden; border:none !important;
  }
  #main-screen .userlvl-bar-fill{
    background: linear-gradient(90deg, #a855f7, #ec4899) !important;
    border-radius:999px !important; box-shadow: 0 0 12px rgba(236,72,153,.7);
    position:relative;
  }
  #main-screen .mh-xp-chips{ display:flex !important; gap:6px !important; margin-top:8px !important; }
  #main-screen .mh-xp-chip{
    flex:1; background: rgba(0,0,0,.35); border:1px solid rgba(255,255,255,.15);
    border-radius:999px; padding:5px 4px; font-size:9px; font-weight:800; color:#fff;
    text-align:center; backdrop-filter: blur(6px);
  }

  /* BOTONES CTA IZQUIERDA */
  #main-screen .mh-cta-big{
    border-radius:18px !important; padding:14px 12px !important; border:1px solid rgba(255,255,255,.5) !important;
    display:flex; align-items:center; gap:10px; cursor:pointer; font-weight:900; color:#fff;
    text-shadow: 0 1px 2px rgba(0,0,0,.4); box-shadow: 0 6px 16px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.5);
    backdrop-filter: blur(6px); transition: transform .12s;
  }
  #main-screen .mh-cta-big:active{ transform: scale(.97); }
  #main-screen .mh-cta-pink{
    background: linear-gradient(135deg, #ff6eb0, #b24dff) !important;
  }
  #main-screen .mh-cta-green{
    background: linear-gradient(135deg, #34d399, #0ea75a) !important;
  }
  #main-screen .mh-cta-ic{
    width:36px; height:36px; border-radius:50%; background: rgba(255,255,255,.3);
    display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0;
    border:1px solid rgba(255,255,255,.6);
  }

  /* COL CENTRO - MASCOTA */
  #main-screen .mh-col-center{
    display:flex; align-items:center; justify-content:center; position:relative; min-height:220px;
  }
  #main-screen .mh-mascot-wrap{
    position:relative; width:170px; height:170px; display:flex; align-items:center; justify-content:center;
    filter: drop-shadow(0 12px 18px rgba(0,0,0,.35));
    animation: mhFloat 3s ease-in-out infinite;
  }
  #main-screen .mh-mascot-wrap .mh-chick{
    font-size:110px; line-height:1;
  }
  #main-screen .mh-mascot-crown{
    position:absolute; top:2px; left:50%; transform:translateX(-10%); font-size:38px; filter:drop-shadow(0 2px 4px rgba(0,0,0,.4));
  }
  @keyframes mhFloat{ 0%,100%{ transform: translateY(0)} 50%{ transform: translateY(-8px)} }

  /* COL DERECHA - GRID 4x2 */
  #main-screen .mh-col-right{
    display:grid; grid-template-columns: repeat(4, 1fr); gap:8px;
  }
  #main-screen .mh-home-btn{
    aspect-ratio: 0.85; border-radius:16px; padding:6px; display:flex; flex-direction:column;
    align-items:center; justify-content:space-between; cursor:pointer;
    background: rgba(255,255,255,.22); border:1px solid rgba(255,255,255,.45);
    backdrop-filter: blur(8px); box-shadow: 0 4px 12px rgba(0,0,0,.15), inset 0 1px 0 rgba(255,255,255,.6);
    transition: transform .12s;
  }
  #main-screen .mh-home-btn:active{ transform: scale(.96); }
  #main-screen .mh-home-btn .mh-hb-ic{
    flex:1; width:100%; display:flex; align-items:center; justify-content:center; font-size:28px;
    filter: drop-shadow(0 2px 3px rgba(0,0,0,.2));
  }
  #main-screen .mh-home-btn .mh-hb-lb{
    font-size:9px; font-weight:900; color:#2d2d2d; background: rgba(255,255,255,.85);
    border-radius:6px; padding:2px 6px; letter-spacing:.3px; text-transform:uppercase;
    box-shadow: 0 1px 2px rgba(0,0,0,.15);
  }
  /* colores suaves por tipo */
  #main-screen .mh-home-btn.hb-pink{ background: linear-gradient(160deg, rgba(255,255,255,.35), rgba(255,110,176,.35)); }
  #main-screen .mh-home-btn.hb-yellow{ background: linear-gradient(160deg, rgba(255,255,255,.35), rgba(255,220,100,.45)); }
  #main-screen .mh-home-btn.hb-purple{ background: linear-gradient(160deg, rgba(255,255,255,.35), rgba(167,139,250,.45)); }
  #main-screen .mh-home-btn.hb-blue{ background: linear-gradient(160deg, rgba(255,255,255,.35), rgba(120,200,255,.45)); }
  #main-screen .mh-home-btn.hb-green{ background: linear-gradient(160deg, rgba(255,255,255,.35), rgba(120,230,150,.45)); }
  #main-screen .mh-home-btn.hb-orange{ background: linear-gradient(160deg, rgba(255,255,255,.35), rgba(255,170,100,.45)); }

  /* Ocultar CTAs viejos */
  #main-screen .hero-cta{ display:none !important; }
  #main-screen .hero-orbit{ display:none !important; }
  `;

  const styleTag = document.createElement('style');
  styleTag.id = 'mh-home-captura-style';
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  function buildHome(){
    const main = document.getElementById('main-screen');
    if(!main || main._mhCapturaBuilt) return;
    const rainbow = main.querySelector('.hero-rainbow-bg');
    const topbar = main.querySelector('.hero-topbar');
    const lvlWidget = main.querySelector('.userlvl-widget');
    if(!topbar || !lvlWidget) return;

    // crear layout
    const layout = document.createElement('div');
    layout.className = 'mh-home-layout';
    
    // COL IZQ
    const colL = document.createElement('div');
    colL.className = 'mh-col-left';
    colL.appendChild(lvlWidget);

    // CTAs nuevos como en captura
    const ctaBingo = document.createElement('div');
    ctaBingo.className = 'mh-cta-big mh-cta-pink';
    ctaBingo.innerHTML = '<div class="mh-cta-ic">🚀</div><div><div style="font-size:11px;opacity:.9">ÚNETE A</div><div style="font-size:13px;line-height:1.1">BINGO<br>AUTOMÁTICO</div></div>';
    ctaBingo.onclick = () => { if(window.navTabTo) navTabTo('game-screen'); else if(window.openBingoLobby) openBingoLobby(); };

    const ctaIsla = document.createElement('div');
    ctaIsla.className = 'mh-cta-big mh-cta-green';
    ctaIsla.innerHTML = '<div class="mh-cta-ic">🌴</div><div style="font-size:13px;line-height:1.1">EXPLORA MI<br>ISLA</div>';
    ctaIsla.onclick = () => { if(window.navTabTo) navTabTo('isla-screen'); };

    colL.appendChild(ctaBingo);
    colL.appendChild(ctaIsla);

    // COL CENTRO - Pollito
    const colC = document.createElement('div');
    colC.className = 'mh-col-center';
    colC.innerHTML = '<div class="mh-mascot-wrap"><div class="mh-mascot-crown">👑</div><div class="mh-chick">🐥</div></div>';
    // Si tienes imagen del pollito, reemplaza el emoji por <img src="./pollito.png">

    // COL DERECHA - 8 botones como captura
    const colR = document.createElement('div');
    colR.className = 'mh-col-right';
    const btns = [
      {lb:'MASCOTAS', ic:'🐾', c:'hb-pink', act:()=> navTabTo('mascota-screen')},
      {lb:'PASE', ic:'🎫', c:'hb-yellow', act:()=> navTabTo('vippass-screen')},
      {lb:'VIP', ic:'👑', c:'hb-purple', act:()=> { if(window.openVipProgressModal) openVipProgressModal(); }},
      {lb:'MISIONES', ic:'🎯', c:'hb-blue', act:()=> navTabTo('missions-screen')},
      {lb:'CARTELES', ic:'📋', c:'hb-blue', act:()=> navTabTo('campaign-screen')},
      {lb:'BANDEJA', ic:'✉️', c:'hb-green', act:()=> { if(window.openInbox) openInbox(); else navTabTo('store-screen'); }},
      {lb:'RECOMPENSAS', ic:'🎁', c:'hb-yellow', act:()=> { if(window.openDailyRewardsModal) openDailyRewardsModal(); }},
      {lb:'TIENDA', ic:'🛒', c:'hb-green', act:()=> navTabTo('store-screen')},
    ];
    btns.forEach(b=>{
      const el = document.createElement('div');
      el.className = 'mh-home-btn '+b.c;
      el.innerHTML = '<div class="mh-hb-ic">'+b.ic+'</div><div class="mh-hb-lb">'+b.lb+'</div>';
      el.onclick = b.act;
      colR.appendChild(el);
    });

    layout.appendChild(colL);
    layout.appendChild(colC);
    layout.appendChild(colR);

    // insertar después del topbar
    const appVersion = document.getElementById('app-version-label');
    if(appVersion) appVersion.remove();
    topbar.insertAdjacentElement('afterend', layout);

    // Re-enganchar chips XP
    setTimeout(()=>{
      if(typeof window.renderUserLevelWidget==='function') window.renderUserLevelWidget();
    },200);

    main._mhCapturaBuilt = true;
    console.log('Home captura construido ✅');
  }

  // Intentos múltiples porque main-screen carga async
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', buildHome);
  } else {
    buildHome();
  }
  // reintentar al navegar al home
  const obs = new MutationObserver(()=>{
    const m = document.getElementById('main-screen');
    if(m && m.classList.contains('active')) buildHome();
  });
  obs.observe(document.body, {attributes:true, subtree:true, attributeFilter:['class']});
  setInterval(buildHome, 1500);

  // Topbar dinámico con valores reales
  function syncTopbar(){
    try{
      const gold = document.getElementById('res-gold');
      const gem = document.getElementById('res-gem');
      const display = document.getElementById('display-user');
      if(!gold) return;
      // pills ya existen, solo actualizar formato como captura
      const gVal = gold.textContent || gold.innerText;
      const dVal = gem ? (gem.textContent) : '0';
      // Si quieres formato 23,194,498 como captura, el juego ya lo hace
    }catch(e){}
  }
  setInterval(syncTopbar, 1000);
})();
