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

  console.log('extensiones.js conectado correctamente ✅');

})();

/* ============================================================
   SISTEMA EQUIPO CON NIVELES (mascotas)
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

  if (typeof MASCOTA_GEAR_DEFS !== 'undefined') {
    if (!MASCOTA_GEAR_DEFS.botas) {
      MASCOTA_GEAR_DEFS.botas = { name: 'Botas del Viento', icon: '👢', desc: 'Aumenta la probabilidad de golpe crítico', stat: 'critico', pct: 5, bonus: '+5% Crítico' };
    }
    if (!MASCOTA_GEAR_DEFS.corona) {
      MASCOTA_GEAR_DEFS.corona = { name: 'Corona Legendaria', icon: '👑', desc: 'El poder del Rey del Bingo', stat: 'todas', pct: 6, bonus: '+6% Vida/Ataque/Defensa' };
    }
  }

  const GEAR_LVL_CFG = {
    collar:   { maxLvl: 5, pctPerLvl: 5,  costGold: 400, costGems: 0,  iconClass: 'ic-collar',   label: 'Vida',    badge: 'TV' },
    armadura: { maxLvl: 5, pctPerLvl: 6,  costGold: 500, costGems: 0,  iconClass: 'ic-armadura', label: 'Defensa', badge: 'TD' },
    amuleto:  { maxLvl: 5, pctPerLvl: 7,  costGold: 600, costGems: 0,  iconClass: 'ic-amuleto',  label: 'Ataque',  badge: 'TA' },
    botas:    { maxLvl: 5, pctPerLvl: 5,  costGold: 550, costGems: 0,  iconClass: 'ic-botas',    label: 'Crítico', badge: 'TC' },
    corona:   { maxLvl: 5, pctPerLvl: 3,  costGold: 0,   costGems: 25, iconClass: 'ic-corona',   label: 'Todo',    badge: 'TT' },
  };

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

  window.mascotaGearMults = function (id) {
    const g = getMascotaGear(id);
    const lv = getGearLevels(id);
    let vida = 1, ataque = 1, defensa = 1;
    function pctOf(slot) { return (GEAR_LVL_CFG[slot].pctPerLvl * lv[slot]) / 100; }
    if (g.collar) vida += pctOf('collar');
    if (g.armadura) defensa += pctOf('armadura');
    if (g.amuleto) ataque += pctOf('amuleto');
    if (g.corona) { vida += pctOf('corona'); ataque += pctOf('corona'); defensa += pctOf('corona'); }
    const equipCount = Object.keys(MASCOTA_GEAR_DEFS).filter(s => g[s]).length;
    const setPct = setBonusPct(equipCount) / 100;
    if (setPct > 0) { vida += setPct; ataque += setPct; defensa += setPct; }
    return { vida, ataque, defensa };
  };

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

    .card-rojo .b-cell.marked, .card-azul .b-cell.marked,
    .card-verde .b-cell.marked, .card-amarillo .b-cell.marked{
      background:radial-gradient(circle at 35% 30%, #ff6b5e, #d32f2f 70%) !important;
      border-color:#a30000 !important; color:#fff !important;
      border-radius:50% !important; box-shadow:inset 0 -2px 4px rgba(0,0,0,.25), 0 1px 3px rgba(0,0,0,.4);
    }

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
   MÁXIMO DE CARTONES: 10
   ============================================================ */
(function () {
  function setupMaxTenCards() {
    if (typeof QUICK_CARD_STEPS === 'undefined' || typeof ROOMS === 'undefined') return;

    QUICK_CARD_STEPS.length = 0;
    QUICK_CARD_STEPS.push(1, 2, 4, 8, 10);

    ROOMS.forEach(room => {
      if (room.cardCosts && room.cardCosts[1] && room.cardCosts[10] === undefined) {
        room.cardCosts[10] = room.cardCosts[1] * 10;
      }
    });

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

    const slider = document.getElementById('quick-card-slider');
    if (slider) slider.max = String(QUICK_CARD_STEPS.length - 1);

    document.querySelectorAll('#lobby-modal p').forEach(p => {
      if (p.textContent.includes('hasta 16 tarjetas')) {
        p.textContent = p.textContent.replace('hasta 16 tarjetas', 'hasta 10 tarjetas');
      }
    });

    document.querySelectorAll('.qb-max').forEach(btn => {
      btn.textContent = btn.textContent.replace('(16)', '(10)');
    });

    if (typeof window.refreshCardCostLabels === 'function' && !window._mhRefreshLabelsWired) {
      const originalRefreshCardCostLabels = window.refreshCardCostLabels;
      window.refreshCardCostLabels = function () {
        originalRefreshCardCostLabels.apply(this, arguments);
        const el = document.getElementById('cost-label-10');
        if (!el) return;
        const btn = el.closest('.card-opt-btn');
        const available = !selectedRoom || !selectedRoom.cardCosts || selectedRoom.cardCosts[10] !== undefined;
        const cost = (selectedRoom && selectedRoom.cardCosts) ? selectedRoom.cardCosts[10] : undefined;
        if (!available) {
          el.innerText = 'No disponible';
          if (btn) { btn.style.opacity = '0.35'; btn.style.cursor = 'not-allowed'; btn.onclick = null; btn.classList.remove('selected'); }
          return;
        }
        if (btn) { btn.style.opacity = ''; btn.style.cursor = ''; btn.onclick = () => selectCardCount(10, btn); }
        if (cost === undefined) { el.innerText = 'Premio x10 (¡Máximo!)'; return; }
        const discount = (typeof vipCardCostDiscount === 'function') ? vipCardCostDiscount() : 0;
        const finalCost = Math.round(cost * (1 - discount));
        el.innerText = discount > 0 ? `🪙 ${finalCost} (antes ${cost})` : `🪙 ${finalCost}`;
      };
      window._mhRefreshLabelsWired = true;
      window.refreshCardCostLabels();
    }

    if (typeof window.quickMaxCards === 'function' && !window._mhQuickMaxWired) {
      window.quickMaxCards = function () {
        const slider2 = document.getElementById('quick-card-slider');
        if (slider2) slider2.value = QUICK_CARD_STEPS.length - 1;
        onQuickCardSlider(QUICK_CARD_STEPS.length - 1);
        showToast('⚡ Cartones al máximo (10).');
      };
      window._mhQuickMaxWired = true;
    }

    if (typeof chosenCardCount !== 'undefined' && chosenCardCount > 10) {
      chosenCardCount = 10;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMaxTenCards);
  } else {
    setupMaxTenCards();
  }
  setTimeout(setupMaxTenCards, 800);

  // Refuerzo: se vuelve a aplicar cada vez que se abre el lobby, por si
  // ese modal se pinta/actualiza después de la primera carga.
  if (typeof window.openBingoLobby === 'function' && !window._mhMaxTenLobbyWired) {
    const originalOpenBingoLobby = window.openBingoLobby;
    window.openBingoLobby = function () {
      const r = originalOpenBingoLobby.apply(this, arguments);
      setupMaxTenCards();
      return r;
    };
    window._mhMaxTenLobbyWired = true;
  }
})();

/* ============================================================
   BOTÓN MANUAL "¡BINGO!"
   ============================================================ */
(function () {
  function setupManualBingo() {
    if (window._mhManualBingoWired) return;
    if (typeof window.endRound !== 'function' || typeof window.handleBallDraw !== 'function' ||
        typeof window.focusCard !== 'function' || typeof window.startBingoGame !== 'function') return;

    const css = `
      .mh-bingo-shake{ animation: mhBingoShake .4s; }
      @keyframes mhBingoShake{
        0%,100%{ transform:translateX(0); } 20%{ transform:translateX(-6px); }
        40%{ transform:translateX(6px); } 60%{ transform:translateX(-4px); } 80%{ transform:translateX(4px); }
      }
      .mh-bingo-stamp-wrap{
        position:absolute; top:0; right:0; width:110px; height:110px;
        overflow:hidden; z-index:6; pointer-events:none; border-radius:8px;
      }
      .mh-bingo-stamp{
        position:absolute; top:16px; right:-34px; width:150px; padding:5px 0;
        text-align:center; transform:rotate(45deg);
        background:linear-gradient(135deg,#fff3c4,#ffd75e 35%,#d29922 75%,#a9760a);
        color:#3b2604; font-weight:900; font-size:13px; letter-spacing:3px;
        text-transform:uppercase; overflow:hidden;
        box-shadow:0 3px 8px rgba(0,0,0,.5);
        border-top:1px solid rgba(255,255,255,.7); border-bottom:1px solid rgba(0,0,0,.3);
        animation: mhStampRibbonIn .5s cubic-bezier(.34,1.56,.64,1);
      }
      .mh-bingo-stamp::after{
        content:''; position:absolute; top:0; left:-60%; width:35%; height:100%;
        background:linear-gradient(120deg, transparent, rgba(255,255,255,.65), transparent);
        animation: mhStampShine 1.3s ease-in-out .45s 1;
      }
      @keyframes mhStampRibbonIn{
        from{ transform:rotate(45deg) scale(0); opacity:0; }
        to{ transform:rotate(45deg) scale(1); opacity:1; }
      }
      @keyframes mhStampShine{ from{ left:-60%; } to{ left:130%; } }

      .bingo-card{ position:relative; }
      .mh-bingo-card-btn{
        display:block; width:100%; margin-top:6px; padding:8px;
        font-size:13px; font-weight:900; letter-spacing:1px; text-transform:uppercase;
        color:#1a1a1a; background:linear-gradient(180deg,#ffe58a,#d29922);
        border:2px solid #ffd75e; border-radius:99px; cursor:pointer;
        box-shadow:0 2px 0 #8a6a12, 0 3px 6px rgba(0,0,0,.35);
      }
      .mh-bingo-card-btn:active{ transform:translateY(1px); box-shadow:0 1px 0 #8a6a12; }
      .mh-bingo-card-btn.is-ready{
        animation: mhCardBtnPulse 1s ease-in-out infinite;
      }
      @keyframes mhCardBtnPulse{
        0%,100%{ box-shadow:0 2px 0 #8a6a12, 0 3px 6px rgba(0,0,0,.35), 0 0 0 rgba(255,215,94,.6); }
        50%{ box-shadow:0 2px 0 #8a6a12, 0 3px 6px rgba(0,0,0,.35), 0 0 14px rgba(255,215,94,.9); }
      }

      #mh-bingo-fullscreen{
        position:fixed; inset:0; z-index:99999;
        display:flex; align-items:center; justify-content:center;
        background:radial-gradient(circle at 50% 50%, rgba(0,0,0,.55), rgba(0,0,0,.82));
        opacity:0; pointer-events:none;
        animation: mhFsFade .9s ease forwards;
      }
      #mh-bingo-fullscreen .mh-fs-word{
        font-size:min(20vw,110px); font-weight:900; letter-spacing:6px;
        background:linear-gradient(180deg,#fff6cf,#ffd75e 45%,#d29922 80%,#a9760a);
        -webkit-background-clip:text; background-clip:text; color:transparent;
        text-shadow:0 6px 18px rgba(0,0,0,.5);
        transform:scale(.4) rotate(-6deg); opacity:0;
        animation: mhFsWordPop .9s cubic-bezier(.34,1.56,.64,1) forwards;
      }
      #mh-bingo-fullscreen .mh-fs-ray{
        position:absolute; inset:-20%; z-index:-1;
        background:conic-gradient(from 0deg, rgba(255,215,94,0) 0deg, rgba(255,215,94,.35) 8deg, rgba(255,215,94,0) 16deg);
        animation: mhFsSpin 1.4s linear infinite;
      }
      @keyframes mhFsFade{
        0%{ opacity:0; } 10%{ opacity:1; } 78%{ opacity:1; } 100%{ opacity:0; }
      }
      @keyframes mhFsWordPop{
        0%{ transform:scale(.4) rotate(-6deg); opacity:0; }
        55%{ transform:scale(1.12) rotate(2deg); opacity:1; }
        75%{ transform:scale(.96) rotate(-1deg); }
        100%{ transform:scale(1) rotate(0deg); opacity:1; }
      }
      @keyframes mhFsSpin{ to{ transform:rotate(360deg); } }

      #mh-bingo-grace-timer{
        position:fixed; top:10px; left:50%; transform:translateX(-50%);
        z-index:9998; max-width:92vw;
        display:flex; align-items:center; gap:8px;
        padding:9px 16px; border-radius:999px;
        background:linear-gradient(180deg,#2fae54,#1d7a3a);
        border:2px solid #7be3a0; color:#eafff0;
        font-weight:800; font-size:13px; text-align:center;
        box-shadow:0 4px 14px rgba(0,0,0,.45);
        animation: mhGraceIn .35s ease;
      }
      #mh-bingo-grace-timer .mh-grace-secs{
        display:inline-block; min-width:22px; text-align:center;
        background:rgba(0,0,0,.25); border-radius:999px; padding:2px 8px;
      }
      @keyframes mhGraceIn{ from{ opacity:0; transform:translate(-50%,-10px); } to{ opacity:1; transform:translate(-50%,0); } }

      #mh-round-timeout-timer{
        position:fixed; top:10px; left:50%; transform:translateX(-50%);
        z-index:9997; max-width:92vw;
        display:flex; align-items:center; gap:8px;
        padding:9px 16px; border-radius:999px;
        background:linear-gradient(180deg,#d97706,#9a4a06);
        border:2px solid #fcd34d; color:#fff7e6;
        font-weight:800; font-size:13px; text-align:center;
        box-shadow:0 4px 14px rgba(0,0,0,.45);
        animation: mhGraceIn .35s ease;
      }
      #mh-round-timeout-timer .mh-rt-secs{
        display:inline-block; min-width:22px; text-align:center;
        background:rgba(0,0,0,.25); border-radius:999px; padding:2px 8px;
      }
      #mh-round-timeout-timer.warn{ background:linear-gradient(180deg,#dc2626,#7f1d1d); border-color:#fca5a5; animation: mhCardBtnPulse 1s ease-in-out infinite; }

      /* Popup de "nadie ganó" — mismo lenguaje visual que el popup de
         victoria del juego (tarjeta clara, redondeada), pero compacto para
         que nunca se salga de la pantalla. */
      #mh-nowin-overlay{
        position:fixed; inset:0; z-index:99998;
        display:none; align-items:center; justify-content:center;
        background:rgba(0,0,0,.65); padding:16px; box-sizing:border-box;
      }
      #mh-nowin-overlay.active{ display:flex; }
      .mh-nowin-card{
        width:min(94vw,420px); max-height:92vh; overflow-y:auto; box-sizing:border-box;
        background:linear-gradient(180deg,#fff6dc,#ffe9ad);
        border-radius:18px; padding:18px 20px; text-align:center;
        box-shadow:0 12px 40px rgba(0,0,0,.5);
        color:#5c4200;
      }
      .mh-nowin-card h2{ margin:0 0 4px; font-size:19px; font-weight:900; color:#7a4a06; }
      .mh-nowin-card .mh-nowin-sub{ font-size:11.5px; color:#8a6a2e; font-weight:700; margin-bottom:10px; }
      .mh-nowin-icon{ font-size:40px; margin:4px 0 8px; }
      .mh-nowin-card .mh-win-bonus-box{ margin-top:6px; }
      .mh-nowin-btn{
        margin-top:14px; width:100%; padding:12px; border:none; border-radius:12px;
        background:linear-gradient(180deg,#2fae54,#1d7a3a); color:#fff;
        font-weight:900; font-size:14px; letter-spacing:.03em; cursor:pointer;
        box-shadow:0 3px 0 #12522a;
      }
      .mh-nowin-btn:active{ transform:translateY(1px); box-shadow:0 2px 0 #12522a; }
    `;
    const styleTag = document.createElement('style');
    styleTag.textContent = css;
    document.head.appendChild(styleTag);

    window._mhFocusedCardIndex = 0;
    const originalFocusCard = window.focusCard;
    window.focusCard = function (c) {
      window._mhFocusedCardIndex = c;
      return originalFocusCard.apply(this, arguments);
    };

    const originalStartBingoGame = window.startBingoGame;
    window.startBingoGame = function () {
      window._mhFocusedCardIndex = 0;
      window._mhRivalAlerted = false;
      window._mhRoundSettled = false;
      window._mhRoundFinalized = false;
      window._mhGraceActive = false;
      window._mhGraceWinnerCard = null;
      window._mhClaimedCardsOrder = [];
      clearGraceTimer();
      clearRoundTimeoutTimer();
      const result = originalStartBingoGame.apply(this, arguments);
      setTimeout(ensurePerCardButtons, 50);
      setTimeout(ensurePerCardButtons, 400);
      // Arranca el temporizador de 45s apenas empieza la partida real.
      startRoundTimeoutTimer();
      return result;
    };

    const originalEndRound = window.endRound;
    window.endRound = function (won) {
      if (window._mhBingoManualCall) {
        return originalEndRound.apply(this, arguments);
      }
      if (won === true) {
        return;
      }
      if (!window._mhRivalAlerted) {
        window._mhRivalAlerted = true;
        if (typeof showToast === 'function') {
          showToast('🤖 Tu rival ya completó su cartón, pero la partida sigue: ¡marca y presiona BINGO en tu tarjeta!');
        }
      }
    };

    function stampCard(cardObj) {
      try {
        if (!cardObj || !cardObj.cells || !cardObj.cells[0]) return;
        const cardDiv = cardObj.cells[0].closest('.bingo-card');
        if (!cardDiv || cardDiv.querySelector('.mh-bingo-stamp-wrap')) return;
        const wrap = document.createElement('div');
        wrap.className = 'mh-bingo-stamp-wrap';
        wrap.innerHTML = '<div class="mh-bingo-stamp">BINGO</div>';
        cardDiv.appendChild(wrap);
      } catch (e) {}
    }

    function playFullscreenBingo(onDone) {
      const old = document.getElementById('mh-bingo-fullscreen');
      if (old) old.remove();
      const overlay = document.createElement('div');
      overlay.id = 'mh-bingo-fullscreen';
      overlay.innerHTML = '<div class="mh-fs-ray"></div><div class="mh-fs-word">¡BINGO!</div>';
      document.body.appendChild(overlay);
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        overlay.remove();
        if (onDone) onDone();
      };
      overlay.addEventListener('animationend', finish);
      setTimeout(finish, 1300);
    }

    const MH_GRACE_SECONDS = 30;
    const MH_ROUND_TIMEOUT_SECONDS = 45;

    function clearRoundTimeoutTimer() {
      if (window._mhRoundTimeoutInterval) {
        clearInterval(window._mhRoundTimeoutInterval);
        window._mhRoundTimeoutInterval = null;
      }
      const bar = document.getElementById('mh-round-timeout-timer');
      if (bar) bar.remove();
    }

    // Termina la ronda cuando nadie completó ningún cartón: se paga SOLO
    // el 10% de lo gastado como devolución (ese es el "premio final" en
    // este caso). No activa el temporizador de gracia de 30s en absoluto
    // (ese es solo para cuando SÍ hay un bingo real).
    function endRoundNoWinner(motivo) {
      if (window._mhRoundFinalized || window._mhGraceActive) return;
      window._mhRoundFinalized = true;
      window._mhRoundSettled = true;
      clearRoundTimeoutTimer();
      clearGraceTimer();

      const costo = (typeof window._mhLastGameCost === 'number' && window._mhLastGameCost > 0)
        ? window._mhLastGameCost
        : (window._mhComputeTotalCost ? (window._mhComputeTotalCost() || 0) : 0);
      const refund = Math.max(0, Math.round(costo * 0.10));
      if (refund > 0 && typeof state !== 'undefined' && state) {
        state.gold = (state.gold || 0) + refund;
        if (typeof saveState === 'function') saveState();
        if (typeof refreshAllUI === 'function') refreshAllUI();
      }

      showNoWinnerPopup(motivo, costo, refund);

      window._mhBingoManualCall = true;
      try { endRound(false); } catch (e) {}
      window._mhBingoManualCall = false;
    }

    const an2 = (n) => Math.round(n || 0).toLocaleString('es');

    function ensureNoWinOverlay() {
      let ov = document.getElementById('mh-nowin-overlay');
      if (ov) return ov;
      ov = document.createElement('div');
      ov.id = 'mh-nowin-overlay';
      ov.innerHTML = `
        <div class="mh-nowin-card">
          <div class="mh-nowin-icon">⏱️</div>
          <h2 id="mh-nowin-title">Nadie completó el cartón</h2>
          <div class="mh-nowin-sub" id="mh-nowin-sub"></div>
          <div class="mh-win-bonus-box" id="mh-nowin-box"></div>
          <button type="button" class="mh-nowin-btn" id="mh-nowin-close-btn">Entendido</button>
        </div>`;
      document.body.appendChild(ov);
      ov.querySelector('#mh-nowin-close-btn').onclick = function () {
        ov.classList.remove('active');
      };
      return ov;
    }

    function showNoWinnerPopup(motivo, costo, refund) {
      try {
        const ov = ensureNoWinOverlay();
        const subEl = ov.querySelector('#mh-nowin-sub');
        subEl.textContent = motivo === 'tiempo'
          ? 'Se acabaron los 45 segundos sin ningún BINGO.'
          : 'Se acabaron las bolas sin ningún BINGO.';
        const box = ov.querySelector('#mh-nowin-box');
        box.innerHTML = `
          <div class="mh-win-row"><span>💸 Gastado en la partida:</span><span>🪙 ${an2(costo)}</span></div>
          <div class="mh-win-row bonus"><span>↩️ Devolución (10%):</span><span>+🪙 ${an2(refund)}</span></div>
          <div class="mh-win-row total"><span>💰 Total devuelto:</span><span>🪙 ${an2(refund)}</span></div>`;
        ov.classList.add('active');
        if (window._mhFitPopupCardToScreen) window._mhFitPopupCardToScreen(box);
      } catch (e) {}
    }

    function startRoundTimeoutTimer() {
      clearRoundTimeoutTimer();
      let secondsLeft = MH_ROUND_TIMEOUT_SECONDS;
      const bar = document.createElement('div');
      bar.id = 'mh-round-timeout-timer';
      bar.innerHTML = `⏱️ Si nadie hace BINGO, la partida termina en <span class="mh-rt-secs">${secondsLeft}</span>s`;
      document.body.appendChild(bar);
      window._mhRoundTimeoutInterval = setInterval(() => {
        // Si ya hubo un bingo real, este cronómetro deja de importar —
        // desde ahí manda el temporizador de gracia de 30s, ya programado.
        if (window._mhGraceActive || window._mhRoundFinalized) {
          clearRoundTimeoutTimer();
          return;
        }
        secondsLeft--;
        const secEl = bar.querySelector('.mh-rt-secs');
        if (secEl) secEl.textContent = Math.max(secondsLeft, 0);
        if (secondsLeft <= 10) bar.classList.add('warn');
        if (secondsLeft <= 0) {
          clearRoundTimeoutTimer();
          endRoundNoWinner('tiempo');
        }
      }, 1000);
    }
    window._mhStartRoundTimeoutTimer = startRoundTimeoutTimer;
    window._mhClearRoundTimeoutTimer = clearRoundTimeoutTimer;

    function clearGraceTimer() {
      if (window._mhGraceInterval) {
        clearInterval(window._mhGraceInterval);
        window._mhGraceInterval = null;
      }
      const bar = document.getElementById('mh-bingo-grace-timer');
      if (bar) bar.remove();
    }
    function updateGraceBarCount() {
      const bar = document.getElementById('mh-bingo-grace-timer');
      if (!bar) return;
      const countEl = bar.querySelector('.mh-grace-count');
      if (countEl) countEl.textContent = (window._mhClaimedCardsOrder || []).length;
    }
    function startGraceTimer() {
      clearGraceTimer();
      let secondsLeft = MH_GRACE_SECONDS;
      const bar = document.createElement('div');
      bar.id = 'mh-bingo-grace-timer';
      bar.innerHTML = '🏆 <span class="mh-grace-count">1</span> BINGO — cada bingo extra suma más premio — <span class="mh-grace-secs">' + secondsLeft + 's</span>';
      document.body.appendChild(bar);
      window._mhGraceInterval = setInterval(() => {
        secondsLeft--;
        const secEl = bar.querySelector('.mh-grace-secs');
        if (secEl) secEl.textContent = Math.max(secondsLeft, 0) + 's';
        if (secondsLeft <= 0) {
          finalizeRound();
        }
      }, 1000);
    }

    function finalizeRound() {
      if (window._mhRoundFinalized) return;
      window._mhRoundFinalized = true;
      window._mhRoundSettled = true;
      clearGraceTimer();
      clearRoundTimeoutTimer();
      const claimed = window._mhClaimedCardsOrder || [];
      if (claimed.length === 0) return;

      const mainCard = claimed[0];
      const extras = claimed.slice(1);
      roundWinPattern = mainCard.winPattern || roundWinPattern;

      // 🩹 FIX: acá faltaba entregar el premio principal — el temporizador de
      // gracia terminaba y la partida se quedaba trabada sin mostrar el popup
      // de premio. Ahora sí se llama a endRound(true) de verdad al finalizar.
      window._mhBingoManualCall = true;
      endRound(true);
      window._mhBingoManualCall = false;

      // Los cartones extra reclamados durante la gracia ya quedan
      // registrados (cuentan como "bingo confirmado" en pantalla), pero no
      // otorgan oro aparte: el único premio real es el que calcula el juego
      // original para el cartón principal (mostrado en el popup de arriba).
    }

    function claimCard(cardObj) {
      if (!cardObj || !cardObj.completed) return false;
      if (window._mhRoundFinalized) return false;
      if (cardObj._mhClaimed) return false;
      cardObj._mhClaimed = true;
      window._mhClaimedCardsOrder = window._mhClaimedCardsOrder || [];
      window._mhClaimedCardsOrder.push(cardObj);
      stampCard(cardObj);
      if (typeof window._mhSpeakBingoVoice === 'function') window._mhSpeakBingoVoice();
      playFullscreenBingo();
      if (!window._mhGraceActive) {
        window._mhGraceActive = true;
        clearRoundTimeoutTimer();
        startGraceTimer();
      } else {
        updateGraceBarCount();
      }
      return true;
    }

    function ensurePerCardButtons() {
      const list = (typeof playerCardData !== 'undefined' && playerCardData) || [];
      list.forEach((cardObj) => {
        if (!cardObj || !cardObj.cells || !cardObj.cells[0]) return;
        const cardDiv = cardObj.cells[0].closest('.bingo-card');
        if (!cardDiv) return;
        let btn = cardDiv.querySelector('.mh-bingo-card-btn');
        if (!btn) {
          btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'mh-bingo-card-btn';
          btn.textContent = '🎯 ¡BINGO!';
          btn.onclick = function (e) {
            e.stopPropagation();
            if (!claimCard(cardObj)) {
              btn.classList.remove('mh-bingo-shake');
              void btn.offsetWidth;
              btn.classList.add('mh-bingo-shake');
            }
          };
          cardDiv.appendChild(btn);
        }
        if (cardObj._mhClaimed) {
          btn.disabled = true;
          btn.textContent = '✅ Reclamado';
          btn.classList.remove('is-ready');
        } else {
          btn.classList.toggle('is-ready', !!cardObj.completed);
        }
      });
    }
    window._mhEnsurePerCardButtons = ensurePerCardButtons;

    const originalHandleBallDraw = window.handleBallDraw;
    window.handleBallDraw = function () {
      originalHandleBallDraw.apply(this, arguments);
      ensurePerCardButtons();
      if (typeof drawnNumbers !== 'undefined' && drawnNumbers.length >= 75 && !window._mhRoundFinalized) {
        if (window._mhGraceActive) {
          finalizeRound();
        } else {
          const list = (typeof playerCardData !== 'undefined' && playerCardData) || [];
          const anyCompleted = list.find(c => c.completed);
          if (anyCompleted) {
            anyCompleted._mhClaimed = true;
            window._mhClaimedCardsOrder = window._mhClaimedCardsOrder || [];
            window._mhClaimedCardsOrder.push(anyCompleted);
            window._mhGraceActive = true;
            clearRoundTimeoutTimer();
            stampCard(anyCompleted);
            finalizeRound();
          } else {
            // Se agotaron las 75 bolas sin que nadie complete nada: mismo
            // caso que el timeout de 45s (nadie ganó), misma devolución del 10%.
            endRoundNoWinner('bolas');
          }
        }
      }
    };

    setInterval(ensurePerCardButtons, 500);

    window._mhManualBingoWired = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupManualBingo);
  } else {
    setupManualBingo();
  }
  setTimeout(setupManualBingo, 800);
})();

/* ============================================================
   VOZ QUE CANTA CADA BOLA
   ============================================================ */
(function () {
  if (typeof window.handleBallDraw === 'function' && !window._mhBallVoiceWired) {
    const originalHandleBallDraw = window.handleBallDraw;
    window.handleBallDraw = function () {
      originalHandleBallDraw.apply(this, arguments);
      try {
        if (typeof drawnNumbers !== 'undefined' && drawnNumbers.length > 0 && window.speechSynthesis) {
          const n = drawnNumbers[drawnNumbers.length - 1];
          const letter = (typeof letterForNumber === 'function') ? letterForNumber(n) : '';
          speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(`${letter}, ${n}`);
          utter.lang = 'es-ES';
          utter.rate = 1;
          utter.volume = 0.9;
          speechSynthesis.speak(utter);
        }
      } catch (e) {}
    };
    window._mhBallVoiceWired = true;
  }
})();

/* ============================================================
   TIENDA DE VOCES DE BINGO
   ============================================================ */
(function () {
  const BINGO_VOICES = [
    { id: 'clasico',   name: 'Locutor Clásico',      price: 0,   currency: 'gold', pitch: 1.0, rate: 1.0,  phrase: '¡Bingo!' },
    { id: 'anfitrion', name: 'Anfitrión de Casino',   price: 150, currency: 'gold', pitch: 0.8, rate: 0.9,  phrase: '¡Bingo! Tenemos un ganador.' },
    { id: 'aguda',     name: 'Voz Aguda de Fiesta',   price: 150, currency: 'gold', pitch: 1.6, rate: 1.1,  phrase: '¡Bingooo! ¡Qué emoción!' },
    { id: 'robot',     name: 'Robot Arcade',          price: 250, currency: 'gold', pitch: 0.5, rate: 0.85, phrase: 'Bin. Go. Victoria confirmada.' },
    { id: 'dramatico', name: 'Eco Dramático',         price: 250, currency: 'gold', pitch: 1.1, rate: 0.65, phrase: 'Biiin... go...' },
    { id: 'multitud',  name: 'Grito de Multitud',     price: 350, currency: 'gold', pitch: 1.35, rate: 1.25, phrase: '¡BINGOOOO!' },
    { id: 'vip',       name: 'Presentador VIP',       price: 60,  currency: 'gems', pitch: 0.95, rate: 1.05, phrase: '¡Y eso es BINGO! Felicidades, campeón.' },
  ];

  function pickSpeechVoice() {
    try {
      const voices = window.speechSynthesis.getVoices() || [];
      if (!voices.length) return null;
      const esVoices = voices.filter(v => (v.lang || '').toLowerCase().startsWith('es'));
      return (esVoices[0] || voices[0]) || null;
    } catch (e) { return null; }
  }

  function speakVoiceProfile(v) {
    try {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(v.phrase);
      utter.lang = 'es-ES';
      utter.pitch = v.pitch;
      utter.rate = v.rate;
      utter.volume = 1;
      const voice = pickSpeechVoice();
      if (voice) utter.voice = voice;
      window.speechSynthesis.speak(utter);
    } catch (e) {}
  }

  function getVoiceState() {
    if (typeof state === 'undefined' || !state) return null;
    state.mhBingoVoices = state.mhBingoVoices || { owned: ['clasico'], selected: 'clasico' };
    if (!state.mhBingoVoices.owned.includes('clasico')) state.mhBingoVoices.owned.push('clasico');
    if (!state.mhBingoVoices.selected) state.mhBingoVoices.selected = 'clasico';
    return state.mhBingoVoices;
  }

  const css = `
    .mh-voice-shop-open-btn{
      display:block; width:100%; margin:0 0 10px; padding:10px;
      font-size:13px; font-weight:700; color:#e6c766; background:#1c2129;
      border:1px solid #d29922; border-radius:10px; cursor:pointer; text-align:center;
    }
    .mh-voice-shop-overlay{
      display:none; position:fixed; inset:0; background:rgba(13,17,23,0.88);
      z-index:4200; align-items:center; justify-content:center; padding:16px;
    }
    .mh-voice-shop-overlay.active{ display:flex; }
    .mh-voice-shop-box{
      width:100%; max-width:420px; max-height:82vh; overflow-y:auto;
      background:#161b22; border:1px solid #30363d; border-radius:14px; padding:16px;
    }
    .mh-voice-shop-header{ display:flex; align-items:center; justify-content:space-between; margin-bottom:4px; }
    .mh-voice-shop-header h3{ margin:0; color:#d29922; font-size:16px; }
    .mh-voice-shop-close{ cursor:pointer; color:#8b949e; font-size:18px; padding:2px 6px; }
    .mh-voice-shop-sub{ font-size:11px; color:#8b949e; margin:2px 0 12px; }
    .mh-voice-shop-list{ display:flex; flex-direction:column; gap:8px; }
    .mh-voice-row{
      display:flex; align-items:center; justify-content:space-between; gap:8px;
      background:#0d1117; border:1px solid #30363d; border-radius:10px; padding:9px 10px;
    }
    .mh-voice-name{ font-size:13px; font-weight:700; color:#c9d1d9; }
    .mh-voice-owned-tag{ font-size:9px; color:#3fb950; font-weight:700; }
    .mh-voice-price{ font-size:11px; color:#8b949e; margin-top:2px; }
    .mh-voice-actions{ display:flex; gap:6px; flex-shrink:0; }
    .mh-voice-btn{
      font-size:11px; font-weight:700; padding:6px 9px; border-radius:8px; cursor:pointer;
      border:1px solid #30363d; background:#21262d; color:#c9d1d9;
    }
    .mh-voice-preview{ color:#58a6ff; border-color:#1f6feb; }
    .mh-voice-buy{ color:#3b2604; background:linear-gradient(180deg,#ffe58a,#d29922); border-color:#ffd75e; }
    .mh-voice-selected{ color:#3fb950; border-color:#3fb950; background:#132318; cursor:default; }
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  function renderVoiceShop() {
    const vs = getVoiceState();
    const list = document.getElementById('mh-voice-shop-list');
    if (!vs || !list) return;
    list.innerHTML = BINGO_VOICES.map(v => {
      const owned = vs.owned.includes(v.id);
      const selected = vs.selected === v.id;
      const symbol = v.currency === 'gems' ? '💎' : '🪙';
      const priceLabel = v.price === 0 ? 'Gratis' : `${symbol} ${v.price}`;
      const actionBtn = selected
        ? `<button class="mh-voice-btn mh-voice-selected" disabled>✅ En uso</button>`
        : owned
          ? `<button class="mh-voice-btn" onclick="window._mhUseBingoVoice('${v.id}')">Usar</button>`
          : `<button class="mh-voice-btn mh-voice-buy" onclick="window._mhBuyBingoVoice('${v.id}')">Comprar ${priceLabel}</button>`;
      return `<div class="mh-voice-row">
          <div>
            <div class="mh-voice-name">${v.name}${owned && v.price > 0 ? ' <span class="mh-voice-owned-tag">· Adquirida</span>' : ''}</div>
            <div class="mh-voice-price">${owned ? '' : priceLabel}</div>
          </div>
          <div class="mh-voice-actions">
            <button class="mh-voice-btn mh-voice-preview" onclick="window._mhPreviewBingoVoiceById('${v.id}')">🔊 Escuchar</button>
            ${actionBtn}
          </div>
        </div>`;
    }).join('');
  }

  function updateVoiceShopButtonLabel() {
    const btn = document.getElementById('mh-voice-shop-open-btn');
    const vs = getVoiceState();
    if (!btn || !vs) return;
    const v = BINGO_VOICES.find(x => x.id === vs.selected) || BINGO_VOICES[0];
    btn.textContent = `🎙️ Voz de Bingo: ${v.name}`;
  }

  function ensureVoiceShopModal() {
    if (document.getElementById('mh-voice-shop-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'mh-voice-shop-overlay';
    overlay.className = 'mh-voice-shop-overlay';
    overlay.innerHTML = `
      <div class="mh-voice-shop-box">
        <div class="mh-voice-shop-header">
          <h3>🎙️ Tienda de Voces de Bingo</h3>
          <span class="mh-voice-shop-close" onclick="window._mhCloseVoiceShop()">✕</span>
        </div>
        <p class="mh-voice-shop-sub">Escucha cada voz antes de comprarla. La que elijas es la que grita "¡BINGO!" cuando reclamas la victoria.</p>
        <div id="mh-voice-shop-list" class="mh-voice-shop-list"></div>
      </div>`;
    document.body.appendChild(overlay);
  }

  function ensureVoiceShopButton() {
    if (document.getElementById('mh-voice-shop-open-btn')) return;
    const anchor = document.getElementById('bonus-summary');
    if (!anchor) return;
    const btn = document.createElement('button');
    btn.id = 'mh-voice-shop-open-btn';
    btn.className = 'mh-voice-shop-open-btn';
    btn.type = 'button';
    btn.onclick = function () {
      ensureVoiceShopModal();
      renderVoiceShop();
      document.getElementById('mh-voice-shop-overlay').classList.add('active');
    };
    anchor.insertAdjacentElement('beforebegin', btn);
    updateVoiceShopButtonLabel();
  }

  window._mhCloseVoiceShop = function () {
    const el = document.getElementById('mh-voice-shop-overlay');
    if (el) el.classList.remove('active');
  };

  window._mhPreviewBingoVoiceById = function (id) {
    const v = BINGO_VOICES.find(x => x.id === id);
    if (v) speakVoiceProfile(v);
  };

  window._mhBuyBingoVoice = function (id) {
    const v = BINGO_VOICES.find(x => x.id === id);
    const vs = getVoiceState();
    if (!v || !vs || vs.owned.includes(id)) return;
    const balance = v.currency === 'gems' ? (state.gems || 0) : (state.gold || 0);
    if (balance < v.price) {
      showToast(v.currency === 'gems' ? '❌ No tienes suficientes 💎 diamantes.' : '❌ No tienes suficiente 🪙 oro.');
      return;
    }
    if (v.currency === 'gems') state.gems -= v.price; else state.gold -= v.price;
    vs.owned.push(id);
    vs.selected = id;
    saveState();
    if (typeof refreshAllUI === 'function') refreshAllUI();
    showToast(`🎙️ ¡Voz "${v.name}" adquirida y activada!`);
    renderVoiceShop();
    updateVoiceShopButtonLabel();
  };

  window._mhUseBingoVoice = function (id) {
    const vs = getVoiceState();
    if (!vs || !vs.owned.includes(id)) return;
    vs.selected = id;
    saveState();
    renderVoiceShop();
    updateVoiceShopButtonLabel();
    const v = BINGO_VOICES.find(x => x.id === id);
    if (v) showToast(`🎙️ Voz activa: "${v.name}"`);
  };

  window._mhSpeakBingoVoice = function () {
    const vs = getVoiceState();
    const v = BINGO_VOICES.find(x => x.id === (vs && vs.selected)) || BINGO_VOICES[0];
    speakVoiceProfile(v);
  };

  function setup() {
    ensureVoiceShopButton();
    updateVoiceShopButtonLabel();
    if (typeof window.openBingoLobby === 'function' && !window._mhVoiceShopLobbyWired) {
      const originalOpenBingoLobby = window.openBingoLobby;
      window.openBingoLobby = function () {
        const r = originalOpenBingoLobby.apply(this, arguments);
        ensureVoiceShopButton();
        updateVoiceShopButtonLabel();
        return r;
      };
      window._mhVoiceShopLobbyWired = true;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
  setTimeout(setup, 800);
  setTimeout(updateVoiceShopButtonLabel, 1800);
})();

/* ============================================================
   DESGLOSE DEL PREMIO EN EL POPUP: PREMIO BASE + BONUS + BONO DE SALA
   ------------------------------------------------------------
   "Premio base" = sala × cartones × patrón (lo que da el juego
   sin nada activado). "Bonus" = todo lo que ya venía multiplicado
   en el premio real por VIP/apuesta/mascota. "Bono de Sala" = el
   bono FIJO que vos configuraste por sala (Clásica 2000, Oro 3000,
   Neón 4000, Fuego 5000, Espacial 8000, Aurora 10000), que se
   suma aparte y de verdad a tu oro, no es solo visual.
   ============================================================ */
(function () {
  const css = `
    .mh-win-bonus-box{
      margin-top:8px; padding:7px 10px; border-radius:10px;
      background:rgba(35,134,54,.1); border:1px solid rgba(35,134,54,.35);
      text-align:left;
    }
    .mh-win-row{ display:flex; justify-content:space-between; font-size:10.5px; font-weight:800; margin:2px 0; color:#5c4200; line-height:1.25; }
    .mh-win-row.bonus span:last-child{ color:#1d7a3a; }
    .mh-win-row.sala span:last-child{ color:#8a5a00; }
    .mh-win-row.total{ border-top:1px solid rgba(90,60,0,.25); padding-top:4px; margin-top:4px; font-size:11.5px; }
    .mh-win-row.total span:last-child{ color:#8a5a00; font-size:13px; }
    /* La tarjeta del popup se estaba saliendo por arriba de la pantalla en
       celulares/horizontal por el contenido extra que agregamos — se limita
       su alto máximo y se deja con scroll interno propio, sin tocar el
       diseño original del juego. */
    #win-popup-gold, #win-popup-extra{ margin-top:2px !important; margin-bottom:2px !important; }

    /* === Rediseño "V3 Type Hero" del popup de victoria === */
    @keyframes mhBingoPulse{0%,100%{filter:drop-shadow(0 0 6px rgba(255,215,0,.55))}50%{filter:drop-shadow(0 0 16px rgba(255,215,0,.9))}}
    @keyframes mhStarPop{0%{transform:scale(0) rotate(-25deg);opacity:0}55%{transform:scale(1.15) rotate(6deg);opacity:1}100%{transform:scale(1) rotate(0deg);opacity:1}}
    @keyframes mhCoinBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
    @keyframes mhShine{0%{background-position:-200% 0}100%{background-position:200% 0}}
    .mh-win2-wrap{ margin-top:6px; text-align:center; font-family:inherit; }
    .mh-win2-badge{
      display:inline-flex; align-items:center; gap:6px; padding:4px 12px; border-radius:999px;
      background:rgba(0,0,0,.35); border:1px solid rgba(255,255,255,.15);
      font-size:9.5px; font-weight:800; letter-spacing:.14em; color:#d7fbe8; text-transform:uppercase;
    }
    .mh-win2-badge .dot{ width:6px; height:6px; border-radius:50%; background:#2ecc71; }
    .mh-win2-title{ position:relative; margin:10px 0 4px; }
    .mh-win2-bingo-text{
      display:inline-block; font-weight:900; font-size:34px; letter-spacing:.03em;
      color:#ffe45a; -webkit-text-stroke:2px #3d2600;
      text-shadow:0 3px 0 #b8860b,0 5px 0 #5c4300,0 6px 0 #000,0 10px 18px rgba(0,0,0,.7),0 0 20px rgba(255,215,0,.6);
      animation:mhBingoPulse 2s ease-in-out infinite;
    }
    .mh-win2-star{ position:absolute; font-weight:900; font-size:11px; padding:3px 7px; border-radius:8px; border:2px solid #000; color:#000; animation:mhStarPop .5s ease-out both; }
    .mh-win2-star-pow{ left:2%; top:-6px; background:#ff4d6d; transform:rotate(-14deg); animation-delay:.05s; }
    .mh-win2-star-boom{ right:2%; top:-2px; background:#3fd0ff; transform:rotate(12deg); animation-delay:.2s; }
    .mh-win2-star-win{ left:50%; bottom:-14px; transform:translateX(-50%) rotate(-6deg); background:#ffe45a; animation-delay:.35s; }
    .mh-win2-sub{
      display:inline-flex; align-items:center; gap:6px; margin-top:10px; padding:5px 12px; border-radius:999px;
      background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1);
      font-size:10px; font-weight:800; letter-spacing:.1em; color:#c9c9d6; text-transform:uppercase;
    }
    .mh-win2-sub .dot2{ width:5px; height:5px; border-radius:50%; background:#2ecc71; }
    .mh-win2-total-card{
      margin-top:14px; padding:12px 14px; border-radius:18px; text-align:left; position:relative; overflow:hidden;
      background:linear-gradient(135deg, rgba(255,196,0,.18), rgba(255,140,0,.10));
      border:1px solid rgba(255,196,0,.35);
    }
    .mh-win2-total-top{ display:flex; align-items:center; gap:10px; }
    .mh-win2-coin{ font-size:26px; animation:mhCoinBounce 1.2s ease-in-out infinite; }
    .mh-win2-total-label{ font-size:10px; font-weight:900; letter-spacing:.12em; color:#c98a1f; }
    .mh-win2-total-num{ font-size:26px; font-weight:900; color:#2b1900; letter-spacing:.01em; }
    .mh-win2-slot-tag{ margin-left:auto; align-self:flex-start; font-size:8.5px; font-weight:900; letter-spacing:.14em; background:rgba(0,0,0,.35); color:#ffe45a; padding:3px 8px; border-radius:999px; }
    .mh-win2-segments{ display:grid; grid-template-columns:repeat(6,1fr); gap:4px; margin-top:10px; }
    .mh-win2-segments span{ height:4px; border-radius:999px; background:linear-gradient(90deg,#ffe45a,#ffb400); }
    .mh-win2-xp-card{ margin-top:8px; padding:10px 14px; border-radius:16px; display:flex; align-items:center; gap:10px; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); text-align:left; }
    .mh-win2-xp-icon{ font-size:24px; }
    .mh-win2-xp-label{ font-size:9.5px; font-weight:900; letter-spacing:.12em; color:#8a8a9a; }
    .mh-win2-xp-num{ font-size:18px; font-weight:900; color:#fff; }
    .mh-win2-detail-card{ margin-top:10px; padding:10px 12px 4px; border-radius:16px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); text-align:left; }
    .mh-win2-detail-title{ font-size:9.5px; font-weight:900; letter-spacing:.14em; color:#8a8a9a; margin-bottom:8px; text-transform:uppercase; }
    .mh-win2-row{ display:flex; align-items:center; gap:10px; padding:8px 6px; border-radius:12px; margin-bottom:6px; background:rgba(255,255,255,.02); }
    .mh-win2-row.bonus{ background:rgba(217,70,239,.10); }
    .mh-win2-row.sala{ background:rgba(255,255,255,.05); }
    .mh-win2-row.guarantee{ background:rgba(46,204,113,.10); }
    .mh-win2-icon{ width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:16px; flex:0 0 auto; background:rgba(0,0,0,.25); }
    .mh-win2-row.bonus .mh-win2-icon{ background:linear-gradient(135deg,#d946ef,#7e22ce); }
    .mh-win2-row.guarantee .mh-win2-icon{ background:linear-gradient(135deg,#2ecc71,#178a4c); }
    .mh-win2-row-txt{ flex:1; min-width:0; }
    .mh-win2-row-label{ font-size:11.5px; font-weight:900; color:#fff; line-height:1.2; }
    .mh-win2-row-sub{ font-size:9.5px; color:#8a8a9a; margin-top:1px; }
    .mh-win2-row-amt{ font-size:15px; font-weight:900; color:#fff; white-space:nowrap; }
    .mh-win2-row.bonus .mh-win2-row-amt{ color:#f0abfc; }
    .mh-win2-row.guarantee .mh-win2-row-amt{ color:#7bf1a8; }
    .mh-win2-tag{ display:inline-block; margin-left:6px; font-size:7.5px; font-weight:900; padding:1px 5px; border-radius:999px; background:#e879f9; color:#2b0033; vertical-align:1px; }

    /* === Retema del popup real (win-popup-box) a fondo oscuro === */
    .win-popup-box{
      background:linear-gradient(180deg,#1c1c26,#100f16) !important;
      border-color:#3a3a4a !important;
      box-shadow:0 0 40px rgba(0,0,0,.6), 0 0 0 1px rgba(255,215,0,.15) inset !important;
      max-height:88vh !important; overflow-y:auto !important;
    }
    .win-popup-banner, .win-popup-rewards{ display:none !important; }
    .win-popup-close{ background:rgba(255,255,255,.12) !important; color:#fff !important; }
    #win-popup-subtitle{
      margin-top:8px !important; font-size:34px !important; font-weight:900 !important;
      letter-spacing:.03em; color:#ffe45a !important; -webkit-text-stroke:2px #3d2600;
      text-shadow:0 3px 0 #b8860b,0 5px 0 #5c4300,0 6px 0 #000,0 10px 18px rgba(0,0,0,.7),0 0 20px rgba(255,215,0,.6) !important;
      animation:mhBingoPulse 2s ease-in-out infinite; position:relative;
    }
    .win-popup-box .game-action-btn{
      background:linear-gradient(180deg,#FFF176,#FFD700,#FF8A00) !important;
      color:#2b1900 !important; border:3px solid #000 !important; font-weight:900 !important;
    }
    .mh-win2-title-stars{ position:relative; display:block; height:0; }
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  const an = (n) => Math.round(n).toLocaleString('es');

  // (La función de bono fijo por sala se sacó de acá: ver el nuevo sistema de
  // "Patrón Especial del Turno" más abajo, que reemplaza al Bono de Sala.)

  // IMPORTANTE: el Bono de Sala se acredita ACÁ, adentro de openWinPopup,
  // no envolviendo endRound. openWinPopup solo se llama UNA VEZ, en el
  // momento exacto en que la victoria ya fue confirmada de verdad (tu
  // sistema de "presionar BINGO" llama a endRound(true) varias veces
  // internamente para bloquear victorias no confirmadas, y envolver
  // endRound directamente hacía que el bono se sumara de más o en el
  // momento equivocado — por eso el total salía mal).
  if (typeof window.openWinPopup === 'function' && !window._mhWinBreakdownWired) {
    const originalOpenWinPopup = window.openWinPopup;
    window.openWinPopup = function (info) {
      info = info || {};
      const result = originalOpenWinPopup(info);
      try {
        const gameReward = info.gold || 0;
        const roomBase = (typeof selectedRoom !== 'undefined' && selectedRoom && selectedRoom.baseWinReward) || 0;
        const cardsPlayed = (typeof playerCardData !== 'undefined' && playerCardData && playerCardData.length)
          || (typeof chosenCardCount !== 'undefined' ? chosenCardCount : 1);
        const patternMult = (typeof roundWinPattern !== 'undefined' && roundWinPattern && roundWinPattern.mult) || 1;

        let basePrize = Math.round(roomBase * cardsPlayed * patternMult);
        if (!(basePrize > 0) || basePrize > gameReward) basePrize = gameReward;
        const bonusMultis = Math.max(0, gameReward - basePrize);

        // 🎯 Bono de Sala nuevo: +20% del premio, SOLO si ganaste con el
        // patrón especial anunciado antes de empezar la ronda (una fila al
        // azar o las 4 esquinas — se elige cada vez que abrís el lobby). Si
        // ganás de cualquier otra forma, el premio normal se paga igual,
        // pero sin este extra.
        const winningPatternId = (typeof roundWinPattern !== 'undefined' && roundWinPattern && roundWinPattern.id) || null;
        const specialId = window._mhSpecialPatternId || null;
        const specialLabel = window._mhSpecialPatternLabel || '';
        const matchedSpecial = specialId && winningPatternId === specialId;
        const roomBonus = matchedSpecial ? Math.round(gameReward * 0.20) : 0;
        if (roomBonus > 0 && typeof state !== 'undefined' && state) {
          state.gold = (state.gold || 0) + roomBonus;
          if (typeof saveState === 'function') saveState();
          if (typeof refreshAllUI === 'function') refreshAllUI();
        }
        let total = gameReward + roomBonus;

        // 🛡️ GARANTÍA MÍNIMA: si ganaste, el total pagado nunca puede ser
        // MENOR a lo que gastaste para entrar a esta partida (cartones +
        // apuesta). El Bonus (VIP/apuesta/mascota) es un premio EXTRA
        // aparte, no cuenta para calcular el piso: la garantía solo mira
        // Premio base + Bono de Sala. Así, el Bonus SIEMPRE se suma
        // completo encima del resultado, gane o no la garantía.
        const costoPartida = (typeof window._mhLastGameCost === 'number' && window._mhLastGameCost > 0)
          ? window._mhLastGameCost
          : (window._mhComputeTotalCost ? window._mhComputeTotalCost() : null);
        const floorAmount = basePrize + roomBonus; // sin el Bonus extra
        let guaranteeTopUp = 0;
        if (typeof costoPartida === 'number' && costoPartida > 0 && floorAmount < costoPartida) {
          guaranteeTopUp = costoPartida - floorAmount;
          if (typeof state !== 'undefined' && state) {
            state.gold = (state.gold || 0) + guaranteeTopUp;
            if (typeof saveState === 'function') saveState();
            if (typeof refreshAllUI === 'function') refreshAllUI();
          }
          total += guaranteeTopUp;
        }

        const xpGained = info.xp || 0;

        // Actualiza el número grande original (queda oculto, pero otras
        // partes del juego pueden seguir leyéndolo) y arma el nuevo diseño
        // "V3 Type Hero" en su lugar.
        const goldEl = document.getElementById('win-popup-gold');
        if (goldEl) { goldEl.innerText = '+' + an(total); goldEl.style.display = 'none'; }

        // El título real del popup (#win-popup-subtitle) ya dice "¡BINGO!"
        // (forzado más arriba en este archivo); acá solo le agregamos las
        // estrellitas POW/BOOM/WIN encima, sin tocar el texto que el juego
        // ya puso.
        const subtitleTitleEl = document.getElementById('win-popup-subtitle');
        if (subtitleTitleEl && !subtitleTitleEl.querySelector('.mh-win2-star')) {
          const bingoText = subtitleTitleEl.textContent;
          subtitleTitleEl.innerHTML = `<span>${escapeHtml(bingoText)}</span>
            <span class="mh-win2-star mh-win2-star-pow">POW!</span>
            <span class="mh-win2-star mh-win2-star-boom">BOOM!</span>
            <span class="mh-win2-star mh-win2-star-win">WIN!</span>`;
        }

        const extraEl = document.getElementById('win-popup-extra');
        if (extraEl && extraEl.parentElement) {
          extraEl.style.display = 'none';
          let wrap = document.getElementById('mh-win2-wrap');
          if (!wrap) {
            wrap = document.createElement('div');
            wrap.id = 'mh-win2-wrap';
            wrap.className = 'mh-win2-wrap';
            extraEl.insertAdjacentElement('afterend', wrap);
          }

          const subtitle = matchedSpecial
            ? `¡${escapeHtml(specialLabel).toUpperCase()} COMPLETADO!`
            : '¡CARTÓN COMPLETADO!';

          let detailRows = `<div class="mh-win2-row"><div class="mh-win2-icon">🎯</div><div class="mh-win2-row-txt"><div class="mh-win2-row-label">Premio base</div><div class="mh-win2-row-sub">Cartón completo</div></div><div class="mh-win2-row-amt">${an(basePrize)}</div></div>`;
          if (bonusMultis > 0) {
            detailRows += `<div class="mh-win2-row bonus"><div class="mh-win2-icon">🎁</div><div class="mh-win2-row-txt"><div class="mh-win2-row-label">Bonus<span class="mh-win2-tag">EXTRA</span></div><div class="mh-win2-row-sub">VIP / apuesta / mascota</div></div><div class="mh-win2-row-amt">+${an(bonusMultis)}</div></div>`;
          }
          if (matchedSpecial) {
            detailRows += `<div class="mh-win2-row sala"><div class="mh-win2-icon">🏛️</div><div class="mh-win2-row-txt"><div class="mh-win2-row-label">Bono de Sala</div><div class="mh-win2-row-sub">${escapeHtml(specialLabel)} ✓ +20%</div></div><div class="mh-win2-row-amt">+${an(roomBonus)}</div></div>`;
          } else if (specialLabel) {
            detailRows += `<div class="mh-win2-row"><div class="mh-win2-icon">🏛️</div><div class="mh-win2-row-txt"><div class="mh-win2-row-label">Bono de Sala</div><div class="mh-win2-row-sub">No (necesitabas ${escapeHtml(specialLabel)})</div></div><div class="mh-win2-row-amt">—</div></div>`;
          }
          if (guaranteeTopUp > 0) {
            detailRows += `<div class="mh-win2-row guarantee"><div class="mh-win2-icon">🛡️</div><div class="mh-win2-row-txt"><div class="mh-win2-row-label">Garantía mínima</div><div class="mh-win2-row-sub">Completa hasta lo gastado</div></div><div class="mh-win2-row-amt">+${an(guaranteeTopUp)}</div></div>`;
          }

          wrap.innerHTML = `
            <div class="mh-win2-sub"><span class="dot2"></span>${subtitle}</div>
            <div class="mh-win2-total-card">
              <div class="mh-win2-total-top">
                <div class="mh-win2-coin">🪙</div>
                <div>
                  <div class="mh-win2-total-label">GANANCIA TOTAL</div>
                  <div class="mh-win2-total-num">${an(total)}</div>
                </div>
                <div class="mh-win2-slot-tag">BINGO</div>
              </div>
              <div class="mh-win2-segments">${'<span></span>'.repeat(6)}</div>
            </div>
            <div class="mh-win2-xp-card">
              <div class="mh-win2-xp-icon">⭐</div>
              <div>
                <div class="mh-win2-xp-label">EXPERIENCIA</div>
                <div class="mh-win2-xp-num">+${an(xpGained)} XP</div>
              </div>
            </div>
            <div class="mh-win2-detail-card">
              <div class="mh-win2-detail-title">Detalle del premio</div>
              ${detailRows}
            </div>
          `;
          fitPopupCardToScreen(wrap);
        }
      } catch (e) {}
      return result;
    };
    window._mhWinBreakdownWired = true;
  }

  // La tarjeta del popup se salía por arriba de la pantalla en celulares u
  // horizontal porque el contenido que agregamos la hacía más alta que el
  // viewport. Busca la "tarjeta" real (el recuadro angosto, no el overlay
  // de fondo que ocupa toda la pantalla) y le pone un alto máximo con
  // scroll propio, sin tocar nada del diseño original si no hace falta.
  function fitPopupCardToScreen(fromEl) {
    try {
      let el = fromEl;
      for (let i = 0; i < 8 && el; i++) {
        el = el.parentElement;
        if (!el || el === document.body) break;
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.width < window.innerWidth * 0.96) {
          el.style.maxHeight = '92vh';
          el.style.overflowY = 'auto';
          el.style.boxSizing = 'border-box';
          break;
        }
      }
    } catch (e) {}
  }
  window._mhFitPopupCardToScreen = fitPopupCardToScreen;
})();


/* ============================================================
   COSTO TOTAL VISIBLE SOBRE EL BOTÓN "COMENZAR BINGO"
   ------------------------------------------------------------
   Muestra, justo antes del botón verde, cuánto se va a gastar
   en total (costo de cartones + costo de la apuesta elegida) y
   avisa que se descuenta del saldo al confirmar. Usa las mismas
   funciones reales del juego (currentCardEntryCost, CONFIG,
   state.gold) así que el número siempre es el costo real —no
   un valor fijo—, y ya sabés que startBingoGame() SÍ descuenta
   ese monto de tu saldo al arrancar la partida.
   ============================================================ */
(function () {

  const css = `
    .mh-cost-banner{
      display:flex; align-items:center; justify-content:space-between; gap:10px;
      margin:8px 0; padding:11px 14px; border-radius:12px;
      background:rgba(34,197,94,.08); border:1px solid rgba(34,197,94,.35);
    }
    .mh-cost-banner .lbl{ font-size:11px; color:#8b949e; font-weight:700; }
    .mh-cost-banner .val{ font-size:15px; color:#4ade80; font-weight:900; }
    .mh-cost-banner.low{ background:rgba(248,113,113,.08); border-color:rgba(248,113,113,.4); }
    .mh-cost-banner.low .val{ color:#f87171; }
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  const an = (n) => n.toLocaleString('es');

  function computeTotalCost() {
    if (typeof currentCardEntryCost !== 'function' || typeof selectedRoom === 'undefined') return null;
    if (!selectedRoom) return null;
    const entryCost = currentCardEntryCost();
    const tier = (CONFIG.betTiers || [])[selectedBetTierIndex] || { cost: 0 };
    return entryCost + (tier.cost || 0);
  }
  // Se expone para que el bloque de "premio potencial" pueda comparar
  // el premio mínimo posible contra lo que realmente vas a gastar.
  window._mhComputeTotalCost = computeTotalCost;

  function ensureCostBanner() {
    const btn = document.querySelector('.game-action-btn[onclick="startBingoGame()"]');
    if (!btn) return;
    let banner = document.getElementById('mh-cost-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'mh-cost-banner';
      banner.className = 'mh-cost-banner';
      btn.insertAdjacentElement('beforebegin', banner);
    }
    const total = computeTotalCost();
    if (total === null) return;
    const alcanza = (state.gold || 0) >= total;
    banner.classList.toggle('low', !alcanza);
    banner.innerHTML = `<span class="lbl">💸 Vas a gastar</span><span class="val">🪙 ${an(total)}${!alcanza ? ' · Saldo insuficiente' : ''}</span>`;
  }

  // Se refresca cada vez que cambian cartones, apuesta, sala, etc.
  ['selectCardCount', 'selectBetTier', 'openBingoLobby', 'updateRiskReturnBox'].forEach(fnName => {
    if (typeof window[fnName] === 'function' && !window['_mhCostWired_' + fnName]) {
      const original = window[fnName];
      window[fnName] = function () {
        const r = original.apply(this, arguments);
        ensureCostBanner();
        return r;
      };
      window['_mhCostWired_' + fnName] = true;
    }
  });

  // Guarda el costo REAL de la partida justo cuando arranca (cartones +
  // apuesta elegidos en ese momento), para poder compararlo después
  // contra el premio pagado, sin importar si la selección cambia luego.
  if (typeof window.startBingoGame === 'function' && !window._mhCostCaptureWired) {
    const originalStartForCost = window.startBingoGame;
    window.startBingoGame = function () {
      window._mhLastGameCost = computeTotalCost();
      return originalStartForCost.apply(this, arguments);
    };
    window._mhCostCaptureWired = true;
  }

  function setupCostBanner() { ensureCostBanner(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCostBanner);
  } else {
    setupCostBanner();
  }
  setTimeout(setupCostBanner, 800);
  setInterval(ensureCostBanner, 1500); // por si cambia el saldo (compras, recompensas) mientras está abierto el lobby
})();
(function () {
  const BINGO_VOICES = [
    { id: 'clasico',   name: 'Locutor Clásico',      price: 0,   currency: 'gold', pitch: 1.0, rate: 1.0,  phrase: '¡Bingo!' },
    { id: 'anfitrion', name: 'Anfitrión de Casino',   price: 150, currency: 'gold', pitch: 0.8, rate: 0.9,  phrase: '¡Bingo! Tenemos un ganador.' },
    { id: 'aguda',     name: 'Voz Aguda de Fiesta',   price: 150, currency: 'gold', pitch: 1.6, rate: 1.1,  phrase: '¡Bingooo! ¡Qué emoción!' },
    { id: 'robot',     name: 'Robot Arcade',          price: 250, currency: 'gold', pitch: 0.5, rate: 0.85, phrase: 'Bin. Go. Victoria confirmada.' },
    { id: 'dramatico', name: 'Eco Dramático',         price: 250, currency: 'gold', pitch: 1.1, rate: 0.65, phrase: 'Biiin... go...' },
    { id: 'multitud',  name: 'Grito de Multitud',     price: 350, currency: 'gold', pitch: 1.35, rate: 1.25, phrase: '¡BINGOOOO!' },
    { id: 'vip',       name: 'Presentador VIP',       price: 60,  currency: 'gems', pitch: 0.95, rate: 1.05, phrase: '¡Y eso es BINGO! Felicidades, campeón.' },
  ];

  function pickSpeechVoice() {
    try {
      const voices = window.speechSynthesis.getVoices() || [];
      if (!voices.length) return null;
      const esVoices = voices.filter(v => (v.lang || '').toLowerCase().startsWith('es'));
      return (esVoices[0] || voices[0]) || null;
    } catch (e) { return null; }
  }

  function speakVoiceProfile(v) {
    try {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(v.phrase);
      utter.lang = 'es-ES';
      utter.pitch = v.pitch;
      utter.rate = v.rate;
      utter.volume = 1;
      const voice = pickSpeechVoice();
      if (voice) utter.voice = voice;
      window.speechSynthesis.speak(utter);
    } catch (e) {}
  }

  function getVoiceState() {
    if (typeof state === 'undefined' || !state) return null;
    state.mhBingoVoices = state.mhBingoVoices || { owned: ['clasico'], selected: 'clasico' };
    if (!state.mhBingoVoices.owned.includes('clasico')) state.mhBingoVoices.owned.push('clasico');
    if (!state.mhBingoVoices.selected) state.mhBingoVoices.selected = 'clasico';
    return state.mhBingoVoices;
  }

  const css = `
    .mh-voice-shop-open-btn{
      display:block; width:100%; margin:0 0 10px; padding:10px;
      font-size:13px; font-weight:700; color:#e6c766; background:#1c2129;
      border:1px solid #d29922; border-radius:10px; cursor:pointer; text-align:center;
    }
    .mh-voice-shop-overlay{
      display:none; position:fixed; inset:0; background:rgba(13,17,23,0.88);
      z-index:4200; align-items:center; justify-content:center; padding:16px;
    }
    .mh-voice-shop-overlay.active{ display:flex; }
    .mh-voice-shop-box{
      width:100%; max-width:420px; max-height:82vh; overflow-y:auto;
      background:#161b22; border:1px solid #30363d; border-radius:14px; padding:16px;
    }
    .mh-voice-shop-header{ display:flex; align-items:center; justify-content:space-between; margin-bottom:4px; }
    .mh-voice-shop-header h3{ margin:0; color:#d29922; font-size:16px; }
    .mh-voice-shop-close{ cursor:pointer; color:#8b949e; font-size:18px; padding:2px 6px; }
    .mh-voice-shop-sub{ font-size:11px; color:#8b949e; margin:2px 0 12px; }
    .mh-voice-shop-list{ display:flex; flex-direction:column; gap:8px; }
    .mh-voice-row{
      display:flex; align-items:center; justify-content:space-between; gap:8px;
      background:#0d1117; border:1px solid #30363d; border-radius:10px; padding:9px 10px;
    }
    .mh-voice-name{ font-size:13px; font-weight:700; color:#c9d1d9; }
    .mh-voice-owned-tag{ font-size:9px; color:#3fb950; font-weight:700; }
    .mh-voice-price{ font-size:11px; color:#8b949e; margin-top:2px; }
    .mh-voice-actions{ display:flex; gap:6px; flex-shrink:0; }
    .mh-voice-btn{
      font-size:11px; font-weight:700; padding:6px 9px; border-radius:8px; cursor:pointer;
      border:1px solid #30363d; background:#21262d; color:#c9d1d9;
    }
    .mh-voice-preview{ color:#58a6ff; border-color:#1f6feb; }
    .mh-voice-buy{ color:#3b2604; background:linear-gradient(180deg,#ffe58a,#d29922); border-color:#ffd75e; }
    .mh-voice-selected{ color:#3fb950; border-color:#3fb950; background:#132318; cursor:default; }
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  function renderVoiceShop() {
    const vs = getVoiceState();
    const list = document.getElementById('mh-voice-shop-list');
    if (!vs || !list) return;
    list.innerHTML = BINGO_VOICES.map(v => {
      const owned = vs.owned.includes(v.id);
      const selected = vs.selected === v.id;
      const symbol = v.currency === 'gems' ? '💎' : '🪙';
      const priceLabel = v.price === 0 ? 'Gratis' : `${symbol} ${v.price}`;
      const actionBtn = selected
        ? `<button class="mh-voice-btn mh-voice-selected" disabled>✅ En uso</button>`
        : owned
          ? `<button class="mh-voice-btn" onclick="window._mhUseBingoVoice('${v.id}')">Usar</button>`
          : `<button class="mh-voice-btn mh-voice-buy" onclick="window._mhBuyBingoVoice('${v.id}')">Comprar ${priceLabel}</button>`;
      return `<div class="mh-voice-row">
          <div>
            <div class="mh-voice-name">${v.name}${owned && v.price > 0 ? ' <span class="mh-voice-owned-tag">· Adquirida</span>' : ''}</div>
            <div class="mh-voice-price">${owned ? '' : priceLabel}</div>
          </div>
          <div class="mh-voice-actions">
            <button class="mh-voice-btn mh-voice-preview" onclick="window._mhPreviewBingoVoiceById('${v.id}')">🔊 Escuchar</button>
            ${actionBtn}
          </div>
        </div>`;
    }).join('');
  }

  function updateVoiceShopButtonLabel() {
    const btn = document.getElementById('mh-voice-shop-open-btn');
    const vs = getVoiceState();
    if (!btn || !vs) return;
    const v = BINGO_VOICES.find(x => x.id === vs.selected) || BINGO_VOICES[0];
    btn.textContent = `🎙️ Voz de Bingo: ${v.name}`;
  }

  function ensureVoiceShopModal() {
    if (document.getElementById('mh-voice-shop-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'mh-voice-shop-overlay';
    overlay.className = 'mh-voice-shop-overlay';
    overlay.innerHTML = `
      <div class="mh-voice-shop-box">
        <div class="mh-voice-shop-header">
          <h3>🎙️ Tienda de Voces de Bingo</h3>
          <span class="mh-voice-shop-close" onclick="window._mhCloseVoiceShop()">✕</span>
        </div>
        <p class="mh-voice-shop-sub">Escucha cada voz antes de comprarla. La que elijas es la que grita "¡BINGO!" cuando reclamas la victoria.</p>
        <div id="mh-voice-shop-list" class="mh-voice-shop-list"></div>
      </div>`;
    document.body.appendChild(overlay);
  }

  function ensureVoiceShopButton() {
    if (document.getElementById('mh-voice-shop-open-btn')) return;
    const anchor = document.getElementById('bonus-summary');
    if (!anchor) return;
    const btn = document.createElement('button');
    btn.id = 'mh-voice-shop-open-btn';
    btn.className = 'mh-voice-shop-open-btn';
    btn.type = 'button';
    btn.onclick = function () {
      ensureVoiceShopModal();
      renderVoiceShop();
      document.getElementById('mh-voice-shop-overlay').classList.add('active');
    };
    anchor.insertAdjacentElement('beforebegin', btn);
    updateVoiceShopButtonLabel();
  }

  window._mhCloseVoiceShop = function () {
    const el = document.getElementById('mh-voice-shop-overlay');
    if (el) el.classList.remove('active');
  };

  window._mhPreviewBingoVoiceById = function (id) {
    const v = BINGO_VOICES.find(x => x.id === id);
    if (v) speakVoiceProfile(v);
  };

  window._mhBuyBingoVoice = function (id) {
    const v = BINGO_VOICES.find(x => x.id === id);
    const vs = getVoiceState();
    if (!v || !vs || vs.owned.includes(id)) return;
    const balance = v.currency === 'gems' ? (state.gems || 0) : (state.gold || 0);
    if (balance < v.price) {
      showToast(v.currency === 'gems' ? '❌ No tienes suficientes 💎 diamantes.' : '❌ No tienes suficiente 🪙 oro.');
      return;
    }
    if (v.currency === 'gems') state.gems -= v.price; else state.gold -= v.price;
    vs.owned.push(id);
    vs.selected = id;
    saveState();
    if (typeof refreshAllUI === 'function') refreshAllUI();
    showToast(`🎙️ ¡Voz "${v.name}" adquirida y activada!`);
    renderVoiceShop();
    updateVoiceShopButtonLabel();
  };

  window._mhUseBingoVoice = function (id) {
    const vs = getVoiceState();
    if (!vs || !vs.owned.includes(id)) return;
    vs.selected = id;
    saveState();
    renderVoiceShop();
    updateVoiceShopButtonLabel();
    const v = BINGO_VOICES.find(x => x.id === id);
    if (v) showToast(`🎙️ Voz activa: "${v.name}"`);
  };

  // Voz que se dispara de verdad al reclamar BINGO (llamada desde la
  // sección del botón manual de BINGO, más arriba en este archivo).
  window._mhSpeakBingoVoice = function () {
    const vs = getVoiceState();
    const v = BINGO_VOICES.find(x => x.id === (vs && vs.selected)) || BINGO_VOICES[0];
    speakVoiceProfile(v);
  };

  function setup() {
    ensureVoiceShopButton();
    updateVoiceShopButtonLabel();
    if (typeof window.openBingoLobby === 'function' && !window._mhVoiceShopLobbyWired) {
      const originalOpenBingoLobby = window.openBingoLobby;
      window.openBingoLobby = function () {
        const r = originalOpenBingoLobby.apply(this, arguments);
        ensureVoiceShopButton();
        updateVoiceShopButtonLabel();
        return r;
      };
      window._mhVoiceShopLobbyWired = true;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
  setTimeout(setup, 800);
  setTimeout(updateVoiceShopButtonLabel, 1800); // por si el state tarda en cargar (Firestore)
})();

/* ============================================================
   TABLA DE BONOS POR SALA
   ------------------------------------------------------------
   Panel informativo (botón + modal) que muestra cuánto bono se
   gana según la cantidad de cartas jugadas en cada sala. Fórmula:
   bono = cartas × valor base de la sala.

   Salas normales (hasta 10 cartas):
     Clásica 2.000/carta · Oro 3.000/carta · Neón 4.000/carta · Fuego 5.000/carta
   Salas premium (límite reducido, hasta 4 cartas):
     Espacial 8.000/carta · Aurora 10.000/carta

   Es solo informativo (no descuenta ni entrega nada): muestra al
   jugador la tabla para que sepa qué gana antes de jugar. Se abre
   con un botón junto al resumen de bonos de la sala de Bingo.
   ============================================================ */
(function () {

  const css = `
    .mh-bt-openbtn{
      display:flex; align-items:center; justify-content:center; gap:6px;
      width:100%; margin:8px 0; padding:10px 12px; border-radius:12px; cursor:pointer;
      font-size:11.5px; font-weight:800; letter-spacing:.03em; color:#c9d1d9;
      background:#161b22; border:1px solid #30363d;
    }
    .mh-bt-overlay{
      position:fixed; inset:0; z-index:9998; background:rgba(0,0,0,.72);
      display:none; align-items:center; justify-content:center; padding:14px;
    }
    .mh-bt-overlay.active{ display:flex; }
    .mh-bt-box{
      background:#0d1117; border:1px solid #30363d; border-radius:16px;
      max-width:440px; width:100%; max-height:86vh; overflow:auto;
      font-family:'Geist',system-ui,-apple-system,sans-serif; color:#c9d1d9;
    }
    .mh-bt-head{ display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border-bottom:1px solid #21262d; position:sticky; top:0; background:#0d1117; }
    .mh-bt-head h3{ margin:0; font-size:14px; font-weight:800; color:#fff; }
    .mh-bt-close{ cursor:pointer; color:#8b949e; font-size:16px; padding:2px 6px; }
    .mh-bt-sub{ font-size:11px; color:#8b949e; padding:0 16px; margin-top:10px; }
    .mh-bt-formula{ margin:10px 16px; padding:9px 12px; border-radius:10px; background:rgba(35,134,54,.1); border:1px solid rgba(35,134,54,.35); font-size:11px; color:#4ac26b; font-weight:700; text-align:center; }
    .mh-bt-tablewrap{ overflow-x:auto; margin:10px 16px 4px; border-radius:10px; border:1px solid #21262d; }
    .mh-bt-table{ width:100%; min-width:420px; border-collapse:collapse; font-size:12.5px; }
    .mh-bt-table thead tr{ background:#238636; color:#fff; font-size:10.5px; letter-spacing:.05em; text-transform:uppercase; }
    .mh-bt-table th{ text-align:right; font-weight:700; padding:9px 12px; border-right:1px solid rgba(255,255,255,.1); }
    .mh-bt-table th:first-child{ text-align:left; width:70px; }
    .mh-bt-table td{ text-align:right; padding:8px 12px; border-right:1px solid #21262d; border-bottom:1px solid #21262d; font-family:'Geist Mono',monospace; }
    .mh-bt-table td:first-child{ text-align:left; font-weight:700; color:#fff; }
    .mh-bt-table tbody tr:nth-child(even){ background:rgba(28,33,40,.6); }
    .mh-bt-table tbody tr.max{ background:rgba(241,224,90,.07); }
    .mh-bt-table tbody tr.max td:first-child{ color:#f1e05a; }
    .mh-bt-maxtag{ font-size:9px; margin-left:6px; padding:1px 6px; border-radius:8px; background:rgba(241,224,90,.15); color:#f1e05a; font-weight:800; }
    .mh-bt-premium-note{ font-size:10px; color:#8b949e; padding:8px 16px 16px; text-align:center; }
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  const an = (n) => n.toLocaleString('es');

  // Salas normales: hasta 10 cartas.
  const ROOMS_NORMAL = [
    { key: 'clasica', label: 'Clásica 2k', base: 2000 },
    { key: 'oro',     label: 'Oro 3k',     base: 3000 },
    { key: 'neon',    label: 'Neón 4k',    base: 4000 },
    { key: 'fuego',   label: 'Fuego 5k',   base: 5000 },
  ];
  const MAX_NORMAL = 10;

  // Salas premium: límite reducido, hasta 4 cartas.
  const ROOMS_PREMIUM = [
    { key: 'espacial', label: 'Espacial 8k', base: 8000 },
    { key: 'aurora',   label: 'Aurora 10k',  base: 10000 },
  ];
  const MAX_PREMIUM = 4;

  function buildTable(rooms, maxCartas) {
    let head = `<tr><th>Cartas</th>${rooms.map(r => `<th>${r.label}</th>`).join('')}</tr>`;
    let rows = '';
    for (let c = 1; c <= maxCartas; c++) {
      const isMax = c === maxCartas;
      rows += `<tr class="${isMax ? 'max' : ''}">
          <td>${c}${isMax ? '<span class="mh-bt-maxtag">MAX</span>' : ''}</td>
          ${rooms.map(r => `<td>${an(c * r.base)}</td>`).join('')}
        </tr>`;
    }
    return `<table class="mh-bt-table"><thead>${head}</thead><tbody>${rows}</tbody></table>`;
  }

  function ensureBonusTableModal() {
    if (document.getElementById('mh-bt-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'mh-bt-overlay';
    overlay.className = 'mh-bt-overlay';
    overlay.innerHTML = `
      <div class="mh-bt-box">
        <div class="mh-bt-head">
          <h3>📊 Tabla de Bonos por Sala</h3>
          <span class="mh-bt-close" onclick="window._mhCloseBonusTable()">✕</span>
        </div>
        <div class="mh-bt-sub">Desliza horizontal para ver todas las salas</div>
        <div class="mh-bt-formula">Fórmula: Bono = Cartas × Valor base de la sala</div>
        <div class="mh-bt-tablewrap">${buildTable(ROOMS_NORMAL, MAX_NORMAL)}</div>
        <div class="mh-bt-tablewrap">${buildTable(ROOMS_PREMIUM, MAX_PREMIUM)}</div>
        <div class="mh-bt-premium-note">⚡ Salas premium con límite reducido (máx. ${MAX_PREMIUM} cartas)</div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) window._mhCloseBonusTable(); });
  }

  window._mhCloseBonusTable = function () {
    const el = document.getElementById('mh-bt-overlay');
    if (el) el.classList.remove('active');
  };

  window._mhOpenBonusTable = function () {
    ensureBonusTableModal();
    document.getElementById('mh-bt-overlay').classList.add('active');
  };

  function ensureBonusTableButton() {
    if (document.getElementById('mh-bt-open-btn')) return;
    const anchor = document.getElementById('bonus-summary');
    if (!anchor) return;
    const btn = document.createElement('button');
    btn.id = 'mh-bt-open-btn';
    btn.className = 'mh-bt-openbtn';
    btn.type = 'button';
    btn.textContent = '📊 Ver tabla de bonos por sala';
    btn.onclick = window._mhOpenBonusTable;
    anchor.insertAdjacentElement('beforebegin', btn);
  }

  function setupBonusTable() {
    ensureBonusTableButton();
    if (typeof window.openBingoLobby === 'function' && !window._mhBonusTableLobbyWired) {
      const original = window.openBingoLobby;
      window.openBingoLobby = function () {
        const r = original.apply(this, arguments);
        ensureBonusTableButton();
        return r;
      };
      window._mhBonusTableLobbyWired = true;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupBonusTable);
  } else {
    setupBonusTable();
  }
  setTimeout(setupBonusTable, 800);
})();

/* ============================================================
   PATRÓN ESPECIAL DEL TURNO → BONO DE SALA (+20%)
   ------------------------------------------------------------
   Cada vez que entrás al lobby de una sala, se elige al azar UN
   patrón especial para esa ronda: o una fila concreta (varía
   cada vez) o las 4 esquinas. Se anuncia ANTES de empezar, junto
   a la apuesta.

   Si ganás completando justo ESE patrón → Bono de Sala +20% del
   premio (se ve y se paga en el popup de victoria).
   Si ganás de cualquier OTRA forma (columna, diagonal, otra fila,
   cartón lleno) → el premio normal se paga igual, pero SIN el
   Bono de Sala. Bono de sala y premio por ganar son cosas
   distintas, como pediste.
   ============================================================ */
(function () {

  const css = `
    .mh-special-banner{
      display:flex; flex-direction:column; gap:2px;
      margin:8px 0; padding:11px 14px; border-radius:12px;
      background:rgba(56,189,248,.08); border:1px solid rgba(56,189,248,.35);
    }
    .mh-special-banner b{ color:#7dd3fc; }
    .mh-special-banner .sub{ font-size:9.5px; color:#8b949e; }
    #mh-special-pattern-banner-ingame{ margin:8px 0 4px; padding:8px 12px; font-size:11px; text-align:center; }
    .mh-special-cell{
      position:relative !important;
      box-shadow:0 0 0 2px #fbbf24, 0 0 14px 2px rgba(251,191,36,.85) !important;
      animation: mhSpecialPulse 1.1s ease-in-out infinite;
      z-index:2;
    }
    .mh-special-cell::after{
      content:''; position:absolute; top:2px; right:2px; width:8px; height:8px;
      border-radius:50%; background:#fbbf24; box-shadow:0 0 6px #fbbf24; pointer-events:none;
    }
    @keyframes mhSpecialPulse{ 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.07); } }
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  const ROW_LABELS = ['Fila 1 (arriba)', 'Fila 2', 'Fila 3 (centro)', 'Fila 4', 'Fila 5 (abajo)'];
  const LETTER_NAMES = ['B', 'I', 'N', 'G', 'O'];

  // Suma el patrón "4 Números" (bloque de 2x2, un clásico del bingo) como
  // forma real de ganar — antes solo existían Línea/Columna/Diagonal/
  // Esquinas/Cartón Lleno. Se agrega UNA sola vez al arreglo real del juego
  // (WIN_PATTERNS), así que a partir de ahora también cuenta como bingo
  // válido en cualquier partida, no solo cuando es el patrón especial.
  if (typeof WIN_PATTERNS !== 'undefined' && !WIN_PATTERNS.some(p => p.id === 'stamp0')) {
    const stampBlocks = [
      { id: 'stamp0', cells: [0, 1, 5, 6] },     // esquina superior izquierda
      { id: 'stamp1', cells: [3, 4, 8, 9] },     // esquina superior derecha
      { id: 'stamp2', cells: [15, 16, 20, 21] }, // esquina inferior izquierda
      { id: 'stamp3', cells: [18, 19, 23, 24] }, // esquina inferior derecha
    ];
    stampBlocks.forEach(b => WIN_PATTERNS.push({ id: b.id, label: '4 Números', cells: b.cells, mult: 0.3 }));
  }

  // Calcula las casillas de cada modo directamente sobre una grilla 5x5
  // (índices 0-24, fila por fila), SIN depender de que WIN_PATTERNS del
  // juego base tenga exactamente esos mismos ids. Así el punto dorado
  // nunca falla aunque los nombres internos del juego sean otros.
  function cellsForPattern(tipo, i) {
    if (tipo === 'diagonal') {
      return i === 0 ? [0, 6, 12, 18, 24] : [4, 8, 12, 16, 20];
    }
    if (tipo === 'fila') {
      return [5 * i, 5 * i + 1, 5 * i + 2, 5 * i + 3, 5 * i + 4];
    }
    if (tipo === 'esquinas') {
      return [0, 4, 20, 24];
    }
    if (tipo === 'cartonlleno') {
      return Array.from({ length: 25 }, (_, k) => k);
    }
    if (tipo === 'columna') {
      return [i, 5 + i, 10 + i, 15 + i, 20 + i];
    }
    // 4numeros
    const stampCells = [[0, 1, 5, 6], [3, 4, 8, 9], [15, 16, 20, 21], [18, 19, 23, 24]];
    return stampCells[i];
  }

  // Elige al azar UNO de los 6 modos que pediste: Diagonal, Fila, 4 Esquinas,
  // Cartón Lleno, Columna de una letra, o 4 Números.
  // Se llama en CADA partida nueva (no solo al abrir el lobby), para que
  // sea realmente aleatorio ronda a ronda y no se quede pegado en uno solo.
  function pickSpecialPattern() {
    const tipos = ['diagonal', 'fila', 'esquinas', 'cartonlleno', 'columna', '4numeros'];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    if (tipo === 'diagonal') {
      const i = Math.random() < 0.5 ? 0 : 1;
      window._mhSpecialPatternId = i === 0 ? 'diag1' : 'diag2';
      window._mhSpecialPatternLabel = 'Diagonal';
      window._mhSpecialPatternCells = cellsForPattern('diagonal', i);
    } else if (tipo === 'fila') {
      const i = Math.floor(Math.random() * 5);
      window._mhSpecialPatternId = 'row' + i;
      window._mhSpecialPatternLabel = ROW_LABELS[i];
      window._mhSpecialPatternCells = cellsForPattern('fila', i);
    } else if (tipo === 'esquinas') {
      window._mhSpecialPatternId = 'corners';
      window._mhSpecialPatternLabel = '4 Esquinas';
      window._mhSpecialPatternCells = cellsForPattern('esquinas');
    } else if (tipo === 'cartonlleno') {
      window._mhSpecialPatternId = 'full';
      window._mhSpecialPatternLabel = 'Cartón Lleno';
      window._mhSpecialPatternCells = cellsForPattern('cartonlleno');
    } else if (tipo === 'columna') {
      const i = Math.floor(Math.random() * 5);
      window._mhSpecialPatternId = 'col' + i;
      window._mhSpecialPatternLabel = `Todos los "${LETTER_NAMES[i]}"`;
      window._mhSpecialPatternCells = cellsForPattern('columna', i);
    } else {
      const i = Math.floor(Math.random() * 4);
      window._mhSpecialPatternId = 'stamp' + i;
      window._mhSpecialPatternLabel = '4 Números';
      window._mhSpecialPatternCells = cellsForPattern('4numeros', i);
    }
    console.log('🎲 Modo especial de esta partida:', window._mhSpecialPatternLabel, window._mhSpecialPatternId);
  }

  // Marca con un punto dorado + brillo pulsante las casillas que hacen
  // falta para el patrón especial de esta ronda, en TODOS tus cartones.
  function highlightSpecialCells() {
    try {
      document.querySelectorAll('.mh-special-cell').forEach(el => el.classList.remove('mh-special-cell'));
      const idxList = window._mhSpecialPatternCells || [];
      const list = (typeof playerCardData !== 'undefined' && playerCardData) || [];
      list.forEach(cardObj => {
        if (!cardObj || !cardObj.cells) return;
        idxList.forEach(i => {
          const cell = cardObj.cells[i];
          if (cell) cell.classList.add('mh-special-cell');
        });
      });
    } catch (e) {}
  }

  function ensureSpecialBanner() {
    const anchor = document.getElementById('bonus-summary');
    if (!anchor) return;
    let banner = document.getElementById('mh-special-pattern-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'mh-special-pattern-banner';
      banner.className = 'mh-special-banner';
      anchor.insertAdjacentElement('beforebegin', banner);
    }
    banner.innerHTML = `
      <span>🎯 Para ganar el <b>Bono de Sala (+20%)</b> completa: <b>${escapeHtml(window._mhSpecialPatternLabel || '')}</b></span>
      <span class="sub">Se marca con un punto dorado en tus cartones. Si ganás de otra forma, tu premio normal se paga igual — solo que sin este extra.</span>`;
  }

  // Mismo cartel, pero visible DURANTE la partida (arriba de las bolas), ya
  // que una vez que empieza el juego el de la pantalla anterior desaparece.
  function ensureSpecialBannerInGame() {
    const anchor = document.querySelector('#active-game-area .battle-status');
    if (!anchor) return;
    let banner = document.getElementById('mh-special-pattern-banner-ingame');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'mh-special-pattern-banner-ingame';
      banner.className = 'mh-special-banner';
      anchor.insertAdjacentElement('afterend', banner);
    }
    banner.innerHTML = `<span>🎯 Bono de Sala (+20%) si completás: <b>${escapeHtml(window._mhSpecialPatternLabel || '')}</b></span>`;
    highlightSpecialCells();
  }

  function setupSpecialPattern() {
    if (typeof window.openBingoLobby === 'function' && !window._mhSpecialPatternLobbyWired) {
      const original = window.openBingoLobby;
      window.openBingoLobby = function () {
        const r = original.apply(this, arguments);
        // Vista previa en el lobby (se puede volver a sortear justo al
        // arrancar la partida real, así que esto es solo orientativo).
        if (!window._mhSpecialPatternId) pickSpecialPattern();
        ensureSpecialBanner();
        return r;
      };
      window._mhSpecialPatternLobbyWired = true;
    }
    if (typeof window.startBingoGame === 'function' && !window._mhSpecialPatternStartWired) {
      const originalStart = window.startBingoGame;
      window.startBingoGame = function () {
        const r = originalStart.apply(this, arguments);
        // Sorteo REAL, uno nuevo en cada partida que arranca de verdad,
        // sin importar si volviste a pasar por el lobby o no.
        pickSpecialPattern();
        ensureSpecialBannerInGame();
        return r;
      };
      window._mhSpecialPatternStartWired = true;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSpecialPattern);
  } else {
    setupSpecialPattern();
  }
  setTimeout(setupSpecialPattern, 800);

  // Refresco periódico: si el juego vuelve a dibujar las cartas (extra
  // ball, nuevo cartón de mascota, etc.) el punto dorado se vuelve a poner.
  setInterval(() => {
    const area = document.getElementById('active-game-area');
    if (area && area.style.display !== 'none') highlightSpecialCells();
  }, 1200);
})();

/* ============================================================
   "PREMIO POTENCIAL ESTIMADO" HONESTO (rango, no un solo número)
   ------------------------------------------------------------
   El cartel original asumía el mejor caso posible (como si fueras
   a ganar con Cartón Lleno, el patrón de más valor) y lo mostraba
   como "36.000+" — dando a entender que ibas a ganar ESO como
   mínimo. En la práctica la mayoría de los bingos se ganan con
   patrones más chicos (Línea, Columna, 4 Esquinas) que valen
   bastante menos, así que terminabas ganando mucho menos de lo
   prometido. Ahora se muestra el RANGO real: desde el patrón de
   menor valor hasta el de mayor valor, calculado con las mismas
   variables que ya usa tu juego (nada inventado).
   ============================================================ */
(function () {
  function fixRewardEstimate() {
    try {
      const rewardEl = document.getElementById('risk-reward-value');
      if (!rewardEl || typeof selectedRoom === 'undefined' || !selectedRoom) return;
      const tier = (CONFIG.betTiers || [])[selectedBetTierIndex] || { cost: 0, mult: 1 };
      const vipBonus = 1 + state.vipCards * (CONFIG.vipBonusPerCard / 100);
      const roomBaseReward = (selectedRoom && selectedRoom.baseWinReward) || CONFIG.baseWinReward;
      const mults = WIN_PATTERNS.map(p => p.mult);
      const minMult = Math.min(...mults);
      const maxMult = Math.max(...mults);
      const common = roomBaseReward * chosenCardCount * vipBonus * (pendingMultiplier > 1 ? pendingMultiplier : 1) * (tier.mult || 1);
      let minReward = Math.round(common * minMult);
      const maxReward = Math.round(common * maxMult);
      // La Garantía Mínima (ver popup de victoria) asegura que si ganás,
      // el premio real nunca queda por debajo de lo que gastás — así que
      // el número de "mínimo" que se muestra acá ya lo tiene en cuenta.
      const costoEstimado = window._mhComputeTotalCost ? window._mhComputeTotalCost() : null;
      if (typeof costoEstimado === 'number' && costoEstimado > 0 && minReward < costoEstimado) {
        minReward = costoEstimado;
      }
      rewardEl.innerText = `🪙 ${minReward.toLocaleString('es')} – ${maxReward.toLocaleString('es')}`;
      rewardEl.title = 'Si ganás, el premio real nunca queda por debajo de lo que gastaste en esta partida (Garantía Mínima incluida)';
    } catch (e) {}
  }

  if (typeof window.updateRiskReturnBox === 'function' && !window._mhRiskFixWired) {
    const original = window.updateRiskReturnBox;
    window.updateRiskReturnBox = function () {
      const r = original.apply(this, arguments);
      fixRewardEstimate();
      return r;
    };
    window._mhRiskFixWired = true;
  }
})();


/* ============================================================
   REDISEÑO PERMANENTE DEL LOBBY ("Selecciona tus Cartones")
   EN 3 COLUMNAS, PARA QUE ENTRE TODO EN PANTALLA SIN DESLIZAR
   ------------------------------------------------------------
   No se recrea nada de cero (para no romper funciones del
   juego): se MUEVEN los mismos elementos reales (cartones,
   velocidad, apuesta, costo, botón jugar, etc.) a una nueva
   distribución en 3 columnas, todo en una sola fila. Como son
   los mismos elementos (mismos id/onclick), todo sigue
   funcionando igual.
   Columna 1: cartones + duplicar/máx.
   Columna 2: velocidad + apuesta + bono de sala
   Columna 3: costo/premio + botón jugar + voz/tabla de bonos
   ============================================================ */
(function () {
  const css = `
    #lobby-modal.mh-lobby-redesign{ padding:10px 12px !important; }
    #lobby-modal.mh-lobby-redesign > p,
    #lobby-modal.mh-lobby-redesign #jackpot-banner,
    #lobby-modal.mh-lobby-redesign #mh-cost-banner,
    #lobby-modal.mh-lobby-redesign .quick-bet-slider-row{ display:none !important; }
    #lobby-modal.mh-lobby-redesign h3{ margin:0 0 6px !important; font-size:13px !important; text-align:center; }
    #lobby-modal.mh-lobby-redesign{ max-height:100vh !important; overflow:hidden !important; }

    .mh-lobby-cols{ display:grid; grid-template-columns:1.18fr 1.1fr 0.82fr; gap:6px; align-items:start; overflow:hidden; }
    .mh-lobby-col{ background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.08); border-radius:10px; padding:6px; height:100%; box-sizing:border-box; min-width:0; overflow:hidden; }
    .mh-lobby-col .option-group{ margin:7px 0 0 !important; }
    .mh-lobby-col .option-group:first-child{ margin-top:0 !important; }
    .mh-lobby-col .option-group-label{ font-size:10px !important; margin-bottom:4px !important; }
    .mh-lobby-col .option-row{ gap:4px !important; flex-wrap:wrap; }
    .mh-lobby-col .opt-chip{ padding:6px 3px !important; font-size:9.5px !important; }

    .mh-lobby-col .cards-options-grid:not(#bet-tier-options){ gap:5px !important; margin:0 !important; grid-template-columns:1fr 1fr !important; }
    .mh-lobby-col .cards-options-grid:not(#bet-tier-options) .card-opt-btn{ padding:10px 3px !important; font-size:12.5px !important; font-weight:800; }
    .mh-lobby-col .cards-options-grid:not(#bet-tier-options) .card-opt-btn span{ display:none !important; }
    .mh-lobby-col .quick-bet-panel{ padding:0 !important; margin:6px 0 0 !important; }
    .mh-lobby-col .quick-bet-actions{ display:grid !important; grid-template-columns:1fr !important; gap:5px !important; margin-top:0 !important; }
    .mh-lobby-col .quick-bet-actions button{ padding:7px 3px !important; font-size:9.5px !important; }

    #bet-tier-options.mh-compact-tiers{ grid-template-columns:1fr 1fr !important; gap:5px !important; }
    #bet-tier-options.mh-compact-tiers .card-opt-btn{ padding:6px 3px !important; font-size:9.8px !important; }
    #bet-tier-options.mh-compact-tiers .card-opt-btn span{ display:block !important; font-size:7.6px !important; margin-top:1px !important; opacity:.8; }

    .mh-lobby-highlight{
      margin-top:6px !important; padding:5px 6px !important; border-radius:8px !important;
      background:linear-gradient(90deg,#ff4d4d,#ff9966) !important; border:none !important; color:#fff !important;
      font-size:8.5px !important; font-weight:800 !important; text-align:center !important; line-height:1.25;
      max-height:34px !important; overflow:hidden !important;
    }
    .mh-lobby-highlight span.sub,
    #mh-special-pattern-banner .sub{ display:none !important; }

    #risk-return-box{ display:flex !important; flex-direction:column !important; gap:3px !important; margin:0 !important; }
    .mh-lobby-col .risk-return-item{ padding:4px !important; }
    .mh-lobby-col .risk-return-label{ font-size:7px !important; }
    .mh-lobby-col .risk-return-value{ font-size:11px !important; }
    .mh-lobby-col .game-action-btn{ width:100% !important; padding:7px 4px !important; margin:5px 0 0 !important; font-size:10.5px !important; }

    .mh-lobby-extras{ display:flex; flex-direction:column; align-items:stretch; gap:3px; margin-top:5px; }
    .mh-lobby-extras #mh-voice-shop-open-btn,
    .mh-lobby-extras #mh-bt-open-btn{ font-size:7.3px !important; padding:3px 4px !important; margin:0 !important; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .mh-lobby-extras #bonus-summary{ font-size:6.5px !important; margin:0 !important; }
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  function applyLobbyRedesign() {
    try {
      const modal = document.getElementById('lobby-modal');
      if (!modal) return;
      modal.classList.add('mh-lobby-redesign');

      let colsWrap = document.getElementById('mh-lobby-cols');
      if (!colsWrap) {
        const h3 = modal.querySelector('h3');
        colsWrap = document.createElement('div');
        colsWrap.id = 'mh-lobby-cols';
        colsWrap.className = 'mh-lobby-cols';
        const col1 = document.createElement('div');
        col1.className = 'mh-lobby-col';
        const col2 = document.createElement('div');
        col2.className = 'mh-lobby-col';
        const col3 = document.createElement('div');
        col3.className = 'mh-lobby-col';
        colsWrap.appendChild(col1);
        colsWrap.appendChild(col2);
        colsWrap.appendChild(col3);
        if (h3) h3.insertAdjacentElement('afterend', colsWrap);
        else modal.insertBefore(colsWrap, modal.firstChild);

        // Columna 1: cartones + duplicar/máx.
        const cardsGrid = modal.querySelector('.cards-options-grid:not(#bet-tier-options)');
        const quickBetPanel = modal.querySelector('.quick-bet-panel');
        if (cardsGrid) col1.appendChild(cardsGrid);
        if (quickBetPanel) col1.appendChild(quickBetPanel);

        // Columna 2: velocidad + apuesta + bono de sala
        const speedOptions = document.getElementById('speed-options');
        const speedGroup = speedOptions ? speedOptions.closest('.option-group') : null;
        const betTierOptions = document.getElementById('bet-tier-options');
        const betTierGroup = betTierOptions ? betTierOptions.closest('.option-group') : null;
        if (speedGroup) col2.appendChild(speedGroup);
        if (betTierGroup) {
          col2.appendChild(betTierGroup);
          if (betTierOptions) betTierOptions.classList.add('mh-compact-tiers');
        }
        const specialBanner = document.getElementById('mh-special-pattern-banner');
        if (specialBanner) {
          specialBanner.classList.add('mh-lobby-highlight');
          col2.appendChild(specialBanner);
        }

        // Columna 3: costo/premio + botón jugar + voz/tabla de bonos
        const riskBox = document.getElementById('risk-return-box');
        const jugarBtn = modal.querySelector('.game-action-btn[onclick="startBingoGame()"]');
        if (riskBox) col3.appendChild(riskBox);
        if (jugarBtn) {
          jugarBtn.innerText = '🚀 ¡Jugar!';
          col3.appendChild(jugarBtn);
        }
        let extrasWrap = document.getElementById('mh-lobby-extras');
        if (!extrasWrap) {
          extrasWrap = document.createElement('div');
          extrasWrap.id = 'mh-lobby-extras';
          extrasWrap.className = 'mh-lobby-extras';
        }
        col3.appendChild(extrasWrap);
        ['mh-voice-shop-open-btn', 'mh-bt-open-btn', 'bonus-summary'].forEach(id => {
          const el = document.getElementById(id);
          if (el) extrasWrap.appendChild(el);
        });
      }
    } catch (e) {}
  }

  if (typeof window.openBingoLobby === 'function' && !window._mhLobbyRedesignWired) {
    const original = window.openBingoLobby;
    window.openBingoLobby = function () {
      const r = original.apply(this, arguments);
      applyLobbyRedesign();
      return r;
    };
    window._mhLobbyRedesignWired = true;
  }
})();


/* ============================================================
   BOTONES CIRCULARES FLOTANTES (event-fab 🎉, admin-fab 🔧,
   neon-aura-fab 🌟): NO deben aparecer sobre el Bingo (tapaban
   "Selecciona tus Cartones") y en Inicio deben quedar fijos en
   un lugar que no tape nada (antes quedaban ocultos siempre en
   main-screen por compartir clase con isla/pet-battle, y cuando
   se mostraban, su posición pegada abajo tapaba "Explora Mi Isla"
   y las insignias).
   ------------------------------------------------------------
   1) Reposicionados arriba (debajo de la barra de stats), en el
      hueco vacío antes del panel de Nivel / de las insignias.
   2) mh-hide-fabs ahora se controla para la lista completa de
      pantallas donde deben ocultarse (se agrega game-screen).
   3) Se re-habilitan específicamente en Inicio (main-screen)
      aunque comparta la clase no-scroll-fixed-screen con
      isla/pet-battle (que sí deben seguir ocultándolos).
   ============================================================ */
(function () {
  const css = `
    .event-fab{ top:96px !important; bottom:auto !important; left:12px !important; }
    .admin-fab{ top:154px !important; bottom:auto !important; left:14px !important; }
    #neon-aura-fab{ top:96px !important; bottom:auto !important; right:12px !important; }

    body.no-scroll-fixed-screen:has(#main-screen.active):not(.mh-hide-fabs) .event-fab,
    body.no-scroll-fixed-screen:has(#main-screen.active):not(.mh-hide-fabs) .admin-fab,
    body.no-scroll-fixed-screen:has(#main-screen.active):not(.mh-hide-fabs) #neon-aura-fab{
      display:flex !important;
    }
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  const HIDE_FABS_SCREENS = ['game-screen', 'mascota-screen', 'isla-screen', 'pet-battle-screen'];

  if (typeof window.goToScreen === 'function' && !window._mhFabVisibilityWired) {
    const original = window.goToScreen;
    window.goToScreen = function (screenId, isReplace) {
      const r = original.apply(this, arguments);
      try {
        document.body.classList.toggle('mh-hide-fabs', HIDE_FABS_SCREENS.includes(screenId));
      } catch (e) {}
      return r;
    };
    window._mhFabVisibilityWired = true;
  }
})();
