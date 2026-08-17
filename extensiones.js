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
      const result = originalStartBingoGame.apply(this, arguments);
      setTimeout(ensurePerCardButtons, 50);
      setTimeout(ensurePerCardButtons, 400);
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
    const MH_EXTRA_BINGO_PCT = 0.25;
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
      const claimed = window._mhClaimedCardsOrder || [];
      if (claimed.length === 0) return;

      const mainCard = claimed[0];
      const extras = claimed.slice(1);
      roundWinPattern = mainCard.winPattern || roundWinPattern;

      const goldBefore = (typeof state !== 'undefined' && state && typeof state.gold === 'number') ? state.gold : null;
      window._mhBingoManualCall = true;
      endRound(true);
      window._mhBingoManualCall = false;

      if (extras.length && goldBefore !== null && typeof state !== 'undefined' && state) {
        const basePrize = Math.max(0, (state.gold || 0) - goldBefore);
        const bonusEach = Math.round(basePrize * MH_EXTRA_BINGO_PCT);
        if (bonusEach > 0) {
          extras.forEach((cardObj, i) => {
            setTimeout(() => {
              state.gold = (state.gold || 0) + bonusEach;
              if (typeof window.saveState === 'function') window.saveState();
              if (typeof showToast === 'function') {
                showToast('🎉 ¡Bingo extra! +🪙 ' + bonusEach.toLocaleString('es-PE'));
              }
            }, 1500 + i * 900);
          });
        }
      }
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
            stampCard(anyCompleted);
            finalizeRound();
          } else {
            window._mhRoundFinalized = true;
            window._mhRoundSettled = true;
            window._mhBingoManualCall = true;
            endRound(false);
            window._mhBingoManualCall = false;
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
      margin-top:12px; padding:10px 12px; border-radius:12px;
      background:rgba(35,134,54,.1); border:1px solid rgba(35,134,54,.35);
      text-align:left;
    }
    .mh-win-row{ display:flex; justify-content:space-between; font-size:12px; font-weight:800; margin:3px 0; color:#5c4200; }
    .mh-win-row.bonus span:last-child{ color:#1d7a3a; }
    .mh-win-row.sala span:last-child{ color:#8a5a00; }
    .mh-win-row.total{ border-top:1px solid rgba(90,60,0,.25); padding-top:6px; margin-top:6px; font-size:13px; }
    .mh-win-row.total span:last-child{ color:#8a5a00; font-size:15px; }
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  const an = (n) => Math.round(n).toLocaleString('es');

  // Bono fijo por sala, definido por vos. Cambiá acá los montos si querés ajustarlos.
  const ROOM_BONUS_CONFIG = {
    clasica:  { base: 2000  },
    oro:      { base: 3000  },
    neon:     { base: 4000  },
    fuego:    { base: 5000  },
    espacial: { base: 8000  },
    aurora:   { base: 10000 },
  };

  function calculateRoomBonus() {
    try {
      const roomKey = (typeof selectedRoom !== 'undefined' && selectedRoom && selectedRoom.id) ? selectedRoom.id.toLowerCase() : 'clasica';
      const cfg = ROOM_BONUS_CONFIG[roomKey] || ROOM_BONUS_CONFIG.clasica;
      return cfg.base; // valor fijo, no se multiplica por cartones
    } catch (e) { return 0; }
  }
  window.calculateRoomBonus = calculateRoomBonus;

  // Acredita el Bono de Sala de verdad (una sola vez, antes de que corra el
  // resto del flujo de victoria), y lo deja guardado para mostrarlo en el popup.
  if (typeof window.endRound === 'function' && !window._mhRoomBonusAwardWired) {
    const originalEndRound = window.endRound;
    window.endRound = function (won) {
      window._mhLastRoomBonus = 0;
      if (won === true && typeof state !== 'undefined' && state) {
        const bonusGold = calculateRoomBonus();
        if (bonusGold > 0) {
          state.gold = (state.gold || 0) + bonusGold;
          if (typeof saveState === 'function') saveState();
          window._mhLastRoomBonus = bonusGold;
        }
      }
      return originalEndRound.apply(this, arguments);
    };
    window._mhRoomBonusAwardWired = true;
  }

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
        const roomBonus = (typeof window._mhLastRoomBonus === 'number') ? window._mhLastRoomBonus : 0;
        const total = gameReward + roomBonus;

        // Actualiza el número grande del popup para que refleje el total real (incluye Bono de Sala)
        const goldEl = document.getElementById('win-popup-gold');
        if (goldEl) goldEl.innerText = '+' + an(total);

        const extraEl = document.getElementById('win-popup-extra');
        if (extraEl && extraEl.parentElement) {
          let box = document.getElementById('mh-win-bonus-box');
          if (!box) {
            box = document.createElement('div');
            box.id = 'mh-win-bonus-box';
            box.className = 'mh-win-bonus-box';
            extraEl.insertAdjacentElement('afterend', box);
          }
          let rows = `<div class="mh-win-row"><span>🎯 Premio base:</span><span>🪙 ${an(basePrize)}</span></div>`;
          if (bonusMultis > 0) rows += `<div class="mh-win-row bonus"><span>🎁 Bonus (VIP/apuesta/mascota):</span><span>+🪙 ${an(bonusMultis)}</span></div>`;
          if (roomBonus > 0) rows += `<div class="mh-win-row sala"><span>🏛️ Bono de Sala:</span><span>+🪙 ${an(roomBonus)}</span></div>`;
          rows += `<div class="mh-win-row total"><span>💰 Total:</span><span>🪙 ${an(total)}</span></div>`;
          box.innerHTML = rows;
        }
      } catch (e) {}
      return result;
    };
    window._mhWinBreakdownWired = true;
  }
})();
