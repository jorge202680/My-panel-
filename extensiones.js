/* ============================================================
   extensiones.js
   ------------------------------------------------------------
   Archivo CONECTOR. Se enlaza desde index.html con una sola
   línea, justo antes de </body>:

       <script src="extensiones.js"></script>

   A partir de esa línea, TODO lo que escribas acá abajo puede:
   - Leer y modificar el "state" del juego (monedas, mascotas,
     nivel, etc.) igual que si estuviera en el archivo grande.
   - Llamar cualquier función que ya exista allá (showToast,
     saveState, equiparMascotaActual, mhOpenGearModal, etc.)
   - Agregar botones, pantallas, estilos o mejorar cosas que
     ya existen, sin duplicar ni romper nada del original.

   REGLA DE ORO: index.html carga primero, y recién cuando ya
   terminó de definir todas sus funciones, se carga este
   archivo. Por eso todo acá abajo puede "ver" lo de arriba,
   pero no al revés (el archivo grande no sabe que este existe,
   a menos que vos lo llames desde acá).

   Cómo agregar algo nuevo: copiá el patrón de los ejemplos de
   abajo y sumá tu propia función dentro del IIFE.
   ============================================================ */

(function () {

  // ---- EJEMPLO: agregar estilos nuevos sin tocar el CSS original ----
  const css = `
    /* Poné acá cualquier CSS nuevo o que sobreescriba algo existente */
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  // ---- EJEMPLO: agregar una función nueva propia ----
  // function miFuncionNueva() {
  //   showToast('¡Funciona desde el archivo conectado!');
  // }
  // window.miFuncionNueva = miFuncionNueva; // la hace visible para onclick="" en el HTML

  // ---- EJEMPLO: mejorar/envolver una función que ya existe ----
  // Esto ejecuta primero lo original y después le agrega algo extra,
  // sin borrar ni reescribir el código de allá.
  //
  // if (typeof window.renderMascotaScreen === 'function') {
  //   const original = window.renderMascotaScreen;
  //   window.renderMascotaScreen = function (...args) {
  //     original(...args);
  //     // acá tu agregado extra
  //   };
  // }

  console.log('extensiones.js conectado correctamente ✅');

})();

/* ============================================================
   SISTEMA EQUIPO CON NIVELES (mascotas)
   ------------------------------------------------------------
   Amplía el modal EQUIPO original (Collar Guardián, Armadura
   Ónix, Amuleto Fuego) sumando 2 objetos nuevos (Botas del
   Viento, Corona Legendaria) y un sistema de NIVELES: cada
   objeto equipado se puede MEJORAR gastando 🪙 oro (💎 gemas
   para la Corona Legendaria), subiendo su % de bono hasta
   nivel 5. Incluye modal de confirmación de gasto, contador de
   EQUIPADOS y bonus de set cuando los 5 están equipados.

   Usa el state y las funciones reales de tu app (state.gold,
   state.gems, saveState, getMascotaGear, toggleMascotaGear,
   MASCOTA_GEAR_DEFS) así que descuenta recursos de verdad y
   queda guardado/sincronizado como el resto de tus datos.
   ============================================================ */
(function () {

  const css = `
    #mh-sheet-ov .mh-sheet-card{
      background:rgba(13,26,32,.94) !important;
      border:1px solid rgba(0,255,204,.3) !important;
      border-radius:22px !important;
      box-shadow:0 0 0 1px rgba(0,255,204,.15), 0 0 40px rgba(0,255,204,.18), inset 0 1px 0 rgba(255,255,255,.1) !important;
      backdrop-filter:blur(20px) !important;
    }
    .mh-gear-item{
      position:relative;
      padding:12px !important;
      border-radius:16px !important;
      gap:12px !important;
      margin-bottom:10px !important;
      border:1px solid rgba(255,255,255,.06) !important;
      background:rgba(0,0,0,.28) !important;
      flex-wrap:wrap !important;
    }
    .mh-gear-item.on{
      background:linear-gradient(135deg, rgba(0,255,204,.08), rgba(0,180,255,.05)) !important;
      border-color:rgba(0,255,204,.35) !important;
      box-shadow:0 0 18px rgba(0,255,204,.15), inset 0 1px 0 rgba(255,255,255,.06) !important;
    }
    .mh-gear-ic{
      width:44px !important;
      height:44px !important;
      border-radius:12px !important;
      font-size:21px !important;
      border:1px solid rgba(255,255,255,.15) !important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.12) !important;
    }
    .mh-gear-ic.ic-collar{ background:linear-gradient(160deg,#5eead4,#0f766e) !important; }
    .mh-gear-ic.ic-armadura{ background:linear-gradient(160deg,#93c5fd,#1e3a5f) !important; }
    .mh-gear-ic.ic-amuleto{ background:linear-gradient(160deg,#fca5a5,#b91c1c) !important; }
    .mh-gear-ic.ic-botas{ background:linear-gradient(160deg,#fcd34d,#d97706) !important; }
    .mh-gear-ic.ic-corona{ background:linear-gradient(160deg,#d8b4fe,#7e22ce) !important; }
    .mh-gear-name{ font-size:13.5px !important; letter-spacing:.02em !important; }
    .mh-gear-badge{ display:inline-block; font-size:8.5px; font-weight:900; letter-spacing:.06em; color:#9ef3e3; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12); border-radius:999px; padding:1px 7px; vertical-align:middle; }
    .mh-gear-bonus{ font-size:10.5px !important; margin-top:2px !important; font-weight:900 !important; }
    .mh-gear-bonus.on{ color:#5eead4 !important; }
    .mh-gear-bonus .arrow-next{ color:#6b7d8f; font-weight:700; }
    .mh-gear-desc{ font-size:10px !important; margin-top:1px !important; color:#6b7d8f !important; }
    .mh-gear-switch{ width:48px !important; height:27px !important; }
    .mh-gear-switch.on{ background:linear-gradient(90deg,#22d3ee,#2dd4bf) !important; box-shadow:0 0 12px rgba(45,212,191,.6) !important; }
    .mh-gear-knob{ width:21px !important; height:21px !important; }
    .mh-gear-lvlrow{ width:100%; display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top:8px; padding-top:8px; border-top:1px solid rgba(255,255,255,.06); }
    .mh-gear-pips{ display:flex; align-items:center; gap:6px; }
    .mh-gear-pip{ width:8px; height:8px; transform:rotate(45deg); border-radius:2px; background:rgba(255,255,255,.12); }
    .mh-gear-pip.filled{ background:#22d3ee; box-shadow:0 0 6px rgba(34,211,238,.8); }
    .mh-gear-lvltxt{ font-size:10px; font-weight:900; letter-spacing:.06em; color:#9ef3e3; }
    .mh-gear-upbtn{
      font-size:10px; font-weight:900; letter-spacing:.06em; color:#000;
      background:linear-gradient(90deg,#fcd34d,#fbbf24,#f97316);
      border:1px solid rgba(255,236,150,.8); border-radius:999px; padding:7px 13px; cursor:pointer;
      box-shadow:0 0 14px rgba(251,191,36,.5), inset 0 1px 0 rgba(255,255,255,.6);
    }
    .mh-gear-upbtn.max{ background:rgba(255,255,255,.06); color:#6b7d8f; border-color:rgba(255,255,255,.1); box-shadow:none; }
    .mh-gear-statgrid{ display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:12px; }
    .mh-gear-statcard{ border-radius:14px; padding:10px 6px; text-align:center; backdrop-filter:blur(6px); }
    .mh-gear-statcard.vida{ background:linear-gradient(160deg,rgba(16,35,29,.9),rgba(13,30,24,.9)); border:1px solid rgba(52,211,153,.25); box-shadow:0 0 0 1px rgba(0,255,160,.08); }
    .mh-gear-statcard.ataque{ background:linear-gradient(160deg,rgba(38,26,20,.9),rgba(31,21,16,.9)); border:1px solid rgba(251,146,60,.25); box-shadow:0 0 0 1px rgba(255,120,69,.08); }
    .mh-gear-statcard.defensa{ background:linear-gradient(160deg,rgba(20,30,47,.9),rgba(18,26,42,.9)); border:1px solid rgba(56,189,248,.25); box-shadow:0 0 0 1px rgba(90,168,255,.08); }
    .mh-gear-static{ width:26px; height:26px; margin:0 auto 4px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px; }
    .mh-gear-statcard.vida .mh-gear-static{ background:linear-gradient(160deg,#6ee7b7,#0d9488); }
    .mh-gear-statcard.ataque .mh-gear-static{ background:linear-gradient(160deg,#fdba74,#dc2626); }
    .mh-gear-statcard.defensa .mh-gear-static{ background:linear-gradient(160deg,#7dd3fc,#4338ca); }
    .mh-gear-statlbl{ font-size:8.5px; letter-spacing:.1em; color:#6b7d8f; text-transform:uppercase; font-weight:800; }
    .mh-gear-statval{ font-size:12.5px; font-weight:900; color:#fff; margin-top:1px; }
    .mh-gear-statpct{ font-size:9.5px; font-weight:900; margin-top:2px; }
    .mh-gear-statcard.vida .mh-gear-statpct{ color:#5eead4; }
    .mh-gear-statcard.ataque .mh-gear-statpct{ color:#fb923c; }
    .mh-gear-statcard.defensa .mh-gear-statpct{ color:#7dd3fc; }
    .mh-gear-statbase{ font-size:8px; color:#4b5a6b; margin-top:1px; }
    .mh-gear-statshead{ display:flex; align-items:center; justify-content:space-between; margin-top:14px; margin-bottom:2px; }
    .mh-gear-statshead-title{ font-size:10.5px; font-weight:900; letter-spacing:.1em; color:#9ef3e3; }
    .mh-gear-setpill{ display:flex; align-items:center; gap:5px; font-size:9px; font-weight:900; color:#9ef3e3; background:rgba(0,255,204,.06); border:1px solid rgba(0,255,204,.3); border-radius:999px; padding:5px 11px; box-shadow:0 0 10px rgba(0,255,204,.15); }
    .mh-gear-headcount{ text-align:right; }
    .mh-gear-headcount-lbl{ font-size:8px; letter-spacing:.14em; color:#6b7d8f; font-weight:800; }
    .mh-gear-headcount-val{ font-size:20px; font-weight:900; color:#5eead4; line-height:1.1; }
    .mh-gear-summary{ display:flex; justify-content:space-between; align-items:center; font-size:11px; color:#9ef3e3; font-weight:900; letter-spacing:.06em; margin-top:12px; padding:9px 12px; border-radius:12px; background:rgba(0,255,204,.06); border:1px solid rgba(0,255,204,.18); }
    .mh-gear-setbox{ margin-top:8px; text-align:center; font-size:11px; font-weight:900; padding:9px; border-radius:12px; letter-spacing:.02em; }
    .mh-gear-setbox.off{ color:#6b7d8f; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.06); }
    .mh-gear-setbox.on{ color:#fde68a; background:linear-gradient(90deg,rgba(251,191,36,.12),rgba(249,115,22,.12)); border:1px solid rgba(251,191,36,.4); box-shadow:0 0 16px rgba(251,191,36,.2); }
    .mh-gear-critrow{ display:flex; gap:8px; margin-top:8px; }
    .mh-gear-critcard{ flex:1; display:flex; align-items:center; gap:8px; border-radius:14px; padding:10px 12px; background:linear-gradient(160deg,rgba(41,30,15,.9),rgba(31,23,13,.9)); border:1px solid rgba(251,191,36,.25); box-shadow:0 0 0 1px rgba(255,180,0,.08); }
    .mh-gear-critcard .mh-gear-statval{ color:#fcd34d; }
    .mh-gear-bonustotal{ flex:1; border-radius:14px; padding:10px 12px; background:rgba(0,0,0,.25); border:1px solid rgba(255,255,255,.08); }
    .mh-gear-bonusbar{ width:100%; height:6px; border-radius:999px; background:rgba(255,255,255,.08); margin:6px 0 4px; overflow:hidden; }
    .mh-gear-bonusbar-fill{ height:100%; background:linear-gradient(90deg,#22d3ee,#2dd4bf); box-shadow:0 0 8px rgba(45,212,191,.6); }
    .mh-gear-bonusval{ font-size:10.5px; font-weight:900; color:#9ef3e3; }
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  // ---- 2 objetos nuevos, sumados a los 3 que ya existían ----
  if (typeof MASCOTA_GEAR_DEFS !== 'undefined') {
    if (!MASCOTA_GEAR_DEFS.botas) {
      MASCOTA_GEAR_DEFS.botas = { name: 'Botas del Viento', icon: '👢', desc: 'Aumenta la probabilidad de golpe crítico', stat: 'critico', pct: 5, bonus: '+5% Crítico' };
    }
    if (!MASCOTA_GEAR_DEFS.corona) {
      MASCOTA_GEAR_DEFS.corona = { name: 'Corona Legendaria', icon: '👑', desc: 'El poder del Rey del Bingo', stat: 'todas', pct: 6, bonus: '+6% Vida/Ataque/Defensa' };
    }
  }

  // Config de niveles: cuánto sube el % por nivel y cuánto cuesta mejorar.
  // badge = sigla que se muestra al lado del nombre: TV=Vida, TD=Defensa, TA=Ataque, TC=Crítico, TT=Todo
  const GEAR_LVL_CFG = {
    collar:   { maxLvl: 5, pctPerLvl: 5,  costGold: 400, costGems: 0,  iconClass: 'ic-collar',   label: 'Vida',    badge: 'TV' },
    armadura: { maxLvl: 5, pctPerLvl: 6,  costGold: 500, costGems: 0,  iconClass: 'ic-armadura', label: 'Defensa', badge: 'TD' },
    amuleto:  { maxLvl: 5, pctPerLvl: 7,  costGold: 600, costGems: 0,  iconClass: 'ic-amuleto',  label: 'Ataque',  badge: 'TA' },
    botas:    { maxLvl: 5, pctPerLvl: 5,  costGold: 550, costGems: 0,  iconClass: 'ic-botas',    label: 'Crítico', badge: 'TC' },
    corona:   { maxLvl: 5, pctPerLvl: 3,  costGold: 0,   costGems: 25, iconClass: 'ic-corona',   label: 'Todo',    badge: 'TT' },
  };

  // Bonus de set progresivo: no hace falta tener los 5 para empezar a ganar algo.
  function setBonusPct(equipCount) {
    if (equipCount >= 5) return 10;
    if (equipCount >= 3) return 5;
    return 0;
  }

  function getGearLevels(id) {
    if (!state.mascotaGearLvl) state.mascotaGearLvl = {};
    if (!state.mascotaGearLvl[id]) state.mascotaGearLvl[id] = {};
    const lv = state.mascotaGearLvl[id];
    Object.keys(GEAR_LVL_CFG).forEach(slot => { if (!lv[slot]) lv[slot] = 1; });
    return lv;
  }

  function gearUpgradeCost(slot, nextLvl) {
    const cfg = GEAR_LVL_CFG[slot];
    return { gold: cfg.costGold * nextLvl, gems: cfg.costGems * nextLvl };
  }

  // Recalcula los % reales según el nivel de cada objeto (reemplaza el
  // cálculo original que usaba un % fijo).
  window.mascotaGearMults = function (id) {
    const g = getMascotaGear(id);
    const lv = getGearLevels(id);
    let vida = 1, ataque = 1, defensa = 1;
    function pctOf(slot) { return (GEAR_LVL_CFG[slot].pctPerLvl * lv[slot]) / 100; }
    if (g.collar) vida += pctOf('collar');
    if (g.armadura) defensa += pctOf('armadura');
    if (g.amuleto) ataque += pctOf('amuleto');
    if (g.corona) { vida += pctOf('corona'); ataque += pctOf('corona'); defensa += pctOf('corona'); }
    // Bonus de set progresivo: 3/5 equipados = +5%, 5/5 = +10%.
    const equipCount = Object.keys(MASCOTA_GEAR_DEFS).filter(s => g[s]).length;
    const setPct = setBonusPct(equipCount) / 100;
    if (setPct > 0) { vida += setPct; ataque += setPct; defensa += setPct; }
    return { vida, ataque, defensa };
  };

  // ---- CRÍTICO: stat nuevo e independiente de vida/ataque/defensa ----
  // Base 5% para toda mascota + lo que sumen las Botas del Viento por nivel
  // + el mismo bonus de set progresivo (3/5 = +5%, 5/5 = +10%) que ya usan
  // los otros stats. Tope 100%.
  const CRITICO_BASE_PCT = 5;
  window.mascotaCriticoPct = function (id) {
    const g = getMascotaGear(id);
    const lv = getGearLevels(id);
    let critico = CRITICO_BASE_PCT;
    if (g.botas) critico += GEAR_LVL_CFG.botas.pctPerLvl * lv.botas;
    const equipCount = Object.keys(MASCOTA_GEAR_DEFS).filter(s => g[s]).length;
    critico += setBonusPct(equipCount);
    return Math.min(100, critico);
  };

  window.mhOpenGearModal = function () {
    const owned = getOwnedMascota(mascotaHeroSelectedId);
    if (!owned) { showToast('❌ Primero debes adquirir esta mascota.'); return; }
    mhOpenSheet(`
        <div class="mh-sheet-head" style="justify-content:space-between">
            <div style="display:flex;align-items:center;gap:10px">
                <div class="mh-sheet-ic">🪖</div>
                <div><div class="mh-sheet-title">EQUIPO</div><div class="mh-sheet-sub">Objetos equipables · Nivel Pro</div></div>
            </div>
            <div class="mh-gear-headcount">
                <div class="mh-gear-headcount-lbl">EQUIPADOS</div>
                <div class="mh-gear-headcount-val" id="mh-gear-headcount-val">0/5</div>
            </div>
        </div>
        <div id="mh-gear-modal-body"></div>
        <button class="mh-sheet-close" onclick="mhCloseSheet()" style="margin-top:10px">CERRAR</button>`);
    mhRenderGearModal();
  };

  function mhConfirmUpgrade(id, slot) {
    const lv = getGearLevels(id);
    const cfg = GEAR_LVL_CFG[slot];
    if (lv[slot] >= cfg.maxLvl) return;
    const nextLvl = lv[slot] + 1;
    const cost = gearUpgradeCost(slot, nextLvl);
    let old = document.getElementById('mh-gear-upgrade-confirm');
    if (old) old.remove();
    // Se busca la tarjeta del panel EQUIPO ya abierto (mh-sheet-card) para
    // meter la confirmación ADENTRO de ese mismo panel, no como overlay de
    // pantalla completa por fuera de él.
    const sheetCard = document.querySelector('#mh-sheet-ov .mh-sheet-card');
    if (!sheetCard) return;
    sheetCard.style.position = 'relative';
    const modal = document.createElement('div');
    modal.id = 'mh-gear-upgrade-confirm';
    modal.style.cssText = 'position:absolute;inset:0;z-index:50;background:rgba(4,10,16,.88);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px;border-radius:22px;';
    modal.innerHTML = `<div style="background:rgba(13,26,32,.96);border:1px solid rgba(0,255,204,.3);border-radius:20px;padding:20px;max-width:270px;width:100%;text-align:center;box-shadow:0 0 40px rgba(0,255,204,.2), inset 0 1px 0 rgba(255,255,255,.08);">
        <div style="font-size:11px;letter-spacing:.14em;color:#9ef3e3;font-weight:900;margin-bottom:6px">MEJORA DE BONUS</div>
        <div style="font-size:13px;color:#fff;font-weight:800;margin-bottom:12px">${escapeHtml(MASCOTA_GEAR_DEFS[slot].name)} → Nivel ${nextLvl}</div>
        <div style="font-size:15px;font-weight:900;color:#fde68a;margin-bottom:2px">${cost.gold ? cost.gold.toLocaleString('es') + ' 🪙' : cost.gems + ' 💎'}</div>
        <div style="font-size:9.5px;letter-spacing:.08em;color:#6b7d8f;margin-bottom:16px">SE DESCONTARÁ AL CONFIRMAR</div>
        <div style="display:flex;gap:10px;justify-content:center;">
          <button style="flex:1;background:rgba(255,255,255,.06);color:#fff;font-weight:900;font-size:11px;letter-spacing:.06em;border:1px solid rgba(255,255,255,.1);border-radius:999px;padding:11px 6px;cursor:pointer" onclick="document.getElementById('mh-gear-upgrade-confirm').remove()">CANCELAR</button>
          <button style="flex:1;background:linear-gradient(90deg,#22d3ee,#2dd4bf);color:#04201c;font-weight:900;font-size:11px;letter-spacing:.06em;border:1px solid rgba(255,255,255,.4);border-radius:999px;padding:11px 6px;cursor:pointer;box-shadow:0 0 14px rgba(45,212,191,.5)" onclick="mhDoUpgrade('${id}','${slot}')">CONFIRMAR</button>
        </div>
      </div>`;
    sheetCard.appendChild(modal);
  }

  function mhDoUpgrade(id, slot) {
    const lv = getGearLevels(id);
    const cfg = GEAR_LVL_CFG[slot];
    const nextLvl = lv[slot] + 1;
    const cost = gearUpgradeCost(slot, nextLvl);
    if (cost.gold && (state.gold || 0) < cost.gold) { showToast('❌ Oro insuficiente'); return; }
    if (cost.gems && (state.gems || 0) < cost.gems) { showToast('❌ Diamantes insuficientes'); return; }
    if (cost.gold) state.gold -= cost.gold;
    if (cost.gems) state.gems -= cost.gems;
    lv[slot] = nextLvl;
    saveState();
    const m = document.getElementById('mh-gear-upgrade-confirm');
    if (m) m.remove();
    showToast(`✅ ${MASCOTA_GEAR_DEFS[slot].name} subió a Nivel ${nextLvl}`);
    if (typeof mhRenderGearModal === 'function') mhRenderGearModal();
    if (typeof renderMascotaScreen === 'function') renderMascotaScreen();
    if (typeof refreshAllUI === 'function') refreshAllUI();
  }
  window.mhConfirmUpgrade = mhConfirmUpgrade;
  window.mhDoUpgrade = mhDoUpgrade;

  // Reemplaza el render del modal EQUIPO por la versión con niveles.
  window.mhRenderGearModal = function () {
    const box = document.getElementById('mh-gear-modal-body');
    if (!box) return;
    const info = mhGetCombatStats(mascotaHeroSelectedId);
    if (!info) return;
    const { cs } = info;
    const g = getMascotaGear(mascotaHeroSelectedId);
    const lv = getGearLevels(mascotaHeroSelectedId);

    const items = Object.keys(MASCOTA_GEAR_DEFS).map(slot => {
      const def = MASCOTA_GEAR_DEFS[slot];
      const cfg = GEAR_LVL_CFG[slot];
      const on = !!g[slot];
      const nivel = lv[slot];
      const pctActual = cfg.pctPerLvl * nivel;
      const pctSiguiente = cfg.pctPerLvl * Math.min(nivel + 1, cfg.maxLvl);
      const maxed = nivel >= cfg.maxLvl;
      const nextCost = maxed ? null : gearUpgradeCost(slot, nivel + 1);
      const pips = Array.from({ length: cfg.maxLvl }).map((_, i) =>
        `<span class="mh-gear-pip ${i < nivel ? 'filled' : ''}"></span>`).join('');
      return `<div class="mh-gear-item ${on ? 'on' : ''}">
          <div class="mh-gear-ic ${cfg.iconClass}">${def.icon}</div>
          <div style="flex:1">
              <div class="mh-gear-name">${escapeHtml(def.name)} <span class="mh-gear-badge">${cfg.badge}</span></div>
              <div class="mh-gear-bonus ${on ? 'on' : 'off'}">+${pctActual}% ${escapeHtml(cfg.label)} ${!maxed ? `<span class="arrow-next">→ +${pctSiguiente}%</span>` : ''}</div>
              <div class="mh-gear-desc">${escapeHtml(def.desc)}</div>
          </div>
          <button onclick="toggleMascotaGear('${mascotaHeroSelectedId}','${slot}')" class="mh-gear-switch ${on ? 'on' : 'off'}"><div class="mh-gear-knob"></div></button>
          <div class="mh-gear-lvlrow">
              <div class="mh-gear-pips">${pips}<span class="mh-gear-lvltxt">LVL ${nivel}/${cfg.maxLvl}</span></div>
              ${maxed
                ? `<button class="mh-gear-upbtn max" disabled>MÁXIMO</button>`
                : `<button class="mh-gear-upbtn" onclick="mhConfirmUpgrade('${mascotaHeroSelectedId}','${slot}')">MEJORAR</button>`}
          </div>
      </div>`;
    }).join('');

    const equipCount = Object.keys(MASCOTA_GEAR_DEFS).filter(s => g[s]).length;
    const setPct = setBonusPct(equipCount);
    document.querySelectorAll('#mh-gear-headcount-val').forEach(el => el.textContent = equipCount + '/5');

    // "Base" = stat sin el bono de equipo, para mostrarla debajo del valor final.
    const gearMult = mascotaGearMults(mascotaHeroSelectedId);
    const baseVida = Math.round(cs.vidaMax / gearMult.vida);
    const baseAtaque = Math.round(cs.ataque / gearMult.ataque);
    const baseDefensa = Math.round(cs.defensa / gearMult.defensa);
    const pctVida = Math.round((gearMult.vida - 1) * 100);
    const pctAtaque = Math.round((gearMult.ataque - 1) * 100);
    const pctDefensa = Math.round((gearMult.defensa - 1) * 100);
    const critico = window.mascotaCriticoPct(mascotaHeroSelectedId);

    box.innerHTML = items + `
        <div class="mh-gear-statshead">
            <span class="mh-gear-statshead-title">ESTADÍSTICAS ACTUALES</span>
            ${setPct > 0 ? `<span class="mh-gear-setpill">⚡ SET EQUIPO +${setPct}% TODO</span>` : ''}
        </div>
        <div class="mh-gear-statgrid">
            <div class="mh-gear-statcard vida">
                <div class="mh-gear-static">❤️</div>
                <div class="mh-gear-statlbl">VIDA</div>
                <div class="mh-gear-statval">${cs.vidaMax.toLocaleString('es')}</div>
                ${pctVida > 0 ? `<div class="mh-gear-statpct">+${pctVida}%</div>` : ''}
                <div class="mh-gear-statbase">base ${baseVida.toLocaleString('es')}</div>
            </div>
            <div class="mh-gear-statcard ataque">
                <div class="mh-gear-static">⚔️</div>
                <div class="mh-gear-statlbl">ATAQUE</div>
                <div class="mh-gear-statval">${cs.ataque.toLocaleString('es')}</div>
                ${pctAtaque > 0 ? `<div class="mh-gear-statpct">+${pctAtaque}%</div>` : ''}
                <div class="mh-gear-statbase">base ${baseAtaque.toLocaleString('es')}</div>
            </div>
            <div class="mh-gear-statcard defensa">
                <div class="mh-gear-static">🛡️</div>
                <div class="mh-gear-statlbl">DEFENSA</div>
                <div class="mh-gear-statval">${cs.defensa.toLocaleString('es')}</div>
                ${pctDefensa > 0 ? `<div class="mh-gear-statpct">+${pctDefensa}%</div>` : ''}
                <div class="mh-gear-statbase">base ${baseDefensa.toLocaleString('es')}</div>
            </div>
        </div>
        <div class="mh-gear-critrow">
            <div class="mh-gear-critcard">
                <div class="mh-gear-static" style="margin:0">⚡</div>
                <div style="flex:1">
                    <div class="mh-gear-statlbl">CRÍTICO</div>
                    <div class="mh-gear-statval">${critico}%</div>
                </div>
                <div class="mh-gear-statbase">base ${CRITICO_BASE_PCT}%</div>
            </div>
            <div class="mh-gear-bonustotal">
                <div class="mh-gear-statlbl">BONUS TOTAL</div>
                <div class="mh-gear-bonusbar"><div class="mh-gear-bonusbar-fill" style="width:${Math.min(100, critico)}%"></div></div>
                <div class="mh-gear-bonusval">${critico}% ACTIVO</div>
            </div>
        </div>`;
  };

  // ---- Conecta el % de Crítico a la Arena de Batalla de verdad ----
  // Envuelve pbComputeDamage (ya calcula daño elemental) sin tocar nada de
  // lo original: después del cálculo normal, tira el dado del crítico según
  // el % real de la mascota atacante, y si sale, multiplica el daño. Reusa
  // el flag "isCrit" que el juego ya usa para los efectos visuales de golpe
  // crítico (pbPlayHitEffect, pbShowDamage, etc.), así el golpe se ve y se
  // siente como crítico de verdad, no solo en el número.
  const CRIT_DAMAGE_MULT = 1.5;
  if (typeof window.pbComputeDamage === 'function' && !window._mhCriticoWired) {
    const originalComputeDamage = window.pbComputeDamage;
    window.pbComputeDamage = function (attacker, defender, skillMult, isUltimate, skillTier, attackElement) {
      const result = originalComputeDamage(attacker, defender, skillMult, isUltimate, skillTier, attackElement);
      try {
        const atkId = attacker && attacker.def && attacker.def.id;
        const critPct = (atkId && typeof window.mascotaCriticoPct === 'function') ? window.mascotaCriticoPct(atkId) : CRITICO_BASE_PCT;
        if (result.dmg > 0 && Math.random() * 100 < critPct) {
          result.dmg = Math.round(result.dmg * CRIT_DAMAGE_MULT);
          result.isCrit = true;
        }
      } catch (e) {}
      return result;
    };
    window._mhCriticoWired = true;
  }

})();

/* ============================================================
   FRANJA DE "NUEVA ACTUALIZACIÓN" ARRIBA
   ------------------------------------------------------------
   El juego ya detecta solo cuando hay una versión nueva (revisa
   cada 5 min y al volver a la pestaña) y activa el botón flotante
   #update-fab. Esto NO toca esa detección: solo agrega una franja
   fija arriba de la pantalla que aparece/desaparece en espejo con
   ese mismo botón, para que sea más visible. El usuario sigue
   jugando normal; la franja queda ahí hasta que toca "ACTUALIZAR"
   (usa la misma applyAppUpdate() que ya existe).
   ============================================================ */
(function () {

  const css = `
    #mh-update-banner{
      display:none; position:fixed; top:0; left:0; right:0; z-index:3000;
      align-items:center; justify-content:center; gap:10px;
      background:linear-gradient(90deg,#22d3ee,#2dd4bf); color:#04201c;
      font-weight:900; font-size:12.5px; letter-spacing:.02em;
      padding:10px 14px; box-shadow:0 2px 12px rgba(0,0,0,.35);
    }
    #mh-update-banner.show{ display:flex; }
    #mh-update-banner .mh-upd-btn{
      background:#04201c; color:#5eead4; border:none; border-radius:999px;
      padding:6px 14px; font-weight:900; font-size:11px; letter-spacing:.04em; cursor:pointer;
    }
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  if (!document.getElementById('mh-update-banner')) {
    const bar = document.createElement('div');
    bar.id = 'mh-update-banner';
    bar.innerHTML = `<span>🆕 Hay una nueva actualización</span><button class="mh-upd-btn" onclick="applyAppUpdate()">ACTUALIZAR</button>`;
    document.body.appendChild(bar);
  }

  const fab = document.getElementById('update-fab');
  if (fab) {
    const syncBanner = () => {
      const banner = document.getElementById('mh-update-banner');
      if (banner) banner.classList.toggle('show', fab.classList.contains('active'));
    };
    syncBanner();
    new MutationObserver(syncBanner).observe(fab, { attributes: true, attributeFilter: ['class'] });
  }

})();

/* ============================================================
   TARJETAS DE BINGO ESTILO CLÁSICO
   ------------------------------------------------------------
   Solo CSS: no toca generateAllCards ni la lógica del juego.
   - Fondo blanco tipo cartón real, con borde celeste.
   - Encabezado B-I-N-G-O con cada letra de un color (azul, rojo,
     verde, violeta, rojo), como un cartón de bingo tradicional.
   - Números marcados como bolita roja con número blanco, en vez
     del relleno de color plano que traía cada tarjeta.
   - Casilla FREE con estrella dorada en vez del texto "FREE".
   ============================================================ */
(function () {

  const css = `
    .bingo-card{
      background:linear-gradient(160deg,#eef4ff,#dbe8ff) !important;
      border:3px solid #3b6fe0 !important;
      box-shadow:0 3px 10px rgba(0,0,0,.35);
    }
    .bingo-header-row{
      background:transparent !important; gap:3px !important; padding:0 !important;
    }
    .bingo-header-row span{
      color:#fff !important; border-radius:5px; padding:3px 0; font-size:10px !important;
    }
    .bingo-header-row span:nth-child(1){ background:#2e6bff; }
    .bingo-header-row span:nth-child(2){ background:#e53935; }
    .bingo-header-row span:nth-child(3){ background:#2fa84f; }
    .bingo-header-row span:nth-child(4){ background:#9c27b0; }
    .bingo-header-row span:nth-child(5){ background:#e53935; }

    .bingo-grid{ gap:3px !important; }
    .b-cell{
      background:#ffffff !important; border:1px solid #c7d6f5 !important;
      color:#16233f !important; font-weight:900 !important; border-radius:5px !important;
    }

    /* Bolita roja para los números marcados, igual en las 4 tarjetas de color */
    .card-rojo .b-cell.marked, .card-azul .b-cell.marked,
    .card-verde .b-cell.marked, .card-amarillo .b-cell.marked{
      background:radial-gradient(circle at 35% 30%, #ff6b5e, #d32f2f 70%) !important;
      border-color:#a30000 !important; color:#fff !important;
      border-radius:50% !important; box-shadow:inset 0 -2px 4px rgba(0,0,0,.25), 0 1px 3px rgba(0,0,0,.4);
    }

    /* Casilla FREE con estrella dorada */
    .b-cell.free{ color:transparent !important; position:relative; background:#fff8e1 !important; border-color:#f2c94c !important; }
    .b-cell.free::after{
      content:'⭐'; position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
      font-size:13px; color:#f2b90c;
    }
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

})();

/* ============================================================
   AL GANAR SIEMPRE DICE "¡BINGO!"
   ------------------------------------------------------------
   El popup de victoria mostraba el nombre del patrón que
   completaste (ej: "LÍNEA", "DIAGONAL", "CARTÓN LLENO") como
   título. Esto envuelve openWinPopup para forzar siempre el
   título "¡BINGO!", sin tocar el resto (oro, xp, pozo, etc.).
   ============================================================ */
(function () {
  if (typeof window.openWinPopup === 'function' && !window._mhBingoTitleWired) {
    const originalOpenWinPopup = window.openWinPopup;
    window.openWinPopup = function (info) {
      const patched = Object.assign({}, info, { title: '¡BINGO!' });
      return originalOpenWinPopup(patched);
    };
    window._mhBingoTitleWired = true;
  }
})();

/* ============================================================
   MÁXIMO DE CARTONES: 10 (antes 16)
   ------------------------------------------------------------
   No toca la lógica del juego, solo reordena la selección:
   - Saca la opción "12 Cartones".
   - Convierte el botón "16 Cartones" en "10 Cartones".
   - Ajusta QUICK_CARD_STEPS (array real que usa el juego) y el
     slider para que el máximo real sea 10, no solo visual.
   - Agrega el precio de 10 cartones a cada sala, calculado igual
     que los demás (precio por cartón × 10), así el costo no
     queda en 0 al elegir 10.
   ============================================================ */
(function () {
  function setupMaxTenCards() {
    if (window._mhMaxTenCardsWired) return;
    if (typeof QUICK_CARD_STEPS === 'undefined' || typeof ROOMS === 'undefined') return;

    // 1) Steps reales que usa el juego para calcular/premiar: [1,2,4,8,10]
    QUICK_CARD_STEPS.length = 0;
    QUICK_CARD_STEPS.push(1, 2, 4, 8, 10);

    // 2) Precio de 10 cartones en cada sala = precio de 1 cartón × 10
    ROOMS.forEach(room => {
      if (room.cardCosts && room.cardCosts[1] && room.cardCosts[10] === undefined) {
        room.cardCosts[10] = room.cardCosts[1] * 10;
      }
    });

    // 3) Botones: sacar "12", convertir "16" en "10"
    const grid = document.querySelector('.cards-options-grid');
    if (grid) {
      const btn12 = grid.querySelector('[onclick="selectCardCount(12, this)"]');
      if (btn12) btn12.remove();
      const btn16 = grid.querySelector('[onclick="selectCardCount(16, this)"]');
      if (btn16) {
        btn16.setAttribute('onclick', 'selectCardCount(10, this)');
        const span = btn16.querySelector('span');
        if (span) span.id = 'cost-label-10';
        btn16.childNodes[0].nodeValue = '10 Cartones';
      }
    }

    // 4) Slider: máximo real ahora tiene 5 pasos (índices 0..4)
    const slider = document.getElementById('quick-card-slider');
    if (slider) slider.max = String(QUICK_CARD_STEPS.length - 1);

    // 5) Texto descriptivo de "hasta 16" -> "hasta 10"
    document.querySelectorAll('#lobby-modal p').forEach(p => {
      if (p.textContent.includes('hasta 16 tarjetas')) {
        p.textContent = p.textContent.replace('hasta 16 tarjetas', 'hasta 10 tarjetas');
      }
    });

    // 6) Si alguien quedó con más de 10 elegidos de antes, lo bajamos a 10
    if (typeof chosenCardCount !== 'undefined' && chosenCardCount > 10) {
      chosenCardCount = 10;
    }

    window._mhMaxTenCardsWired = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMaxTenCards);
  } else {
    setupMaxTenCards();
  }
  // Por si el lobby se arma/repinta después de cargar la página
  setTimeout(setupMaxTenCards, 800);
})();
