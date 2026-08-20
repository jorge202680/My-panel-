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
   BINGO AUTOMÁTICO POR PATRÓN (multi-bingo por cartón)
   ------------------------------------------------------------
   Antes la ronda tenía UN solo patrón ganador sorteado al azar
   (línea, diagonal, esquinas, columna, cartón lleno o 4 números)
   y cada cartón podía reclamarlo UNA sola vez con un botón
   manual "¡BINGO!". Ahora se compara el cartón, en cada cambio,
   contra TODOS los patrones reales del juego (WIN_PATTERNS) —
   así que si marcás una línea en la B, eso ya cuenta como un
   BINGO; si después completás también la diagonal, cuenta como
   OTRO BINGO más en el mismo cartón, y así sucesivamente,
   siempre que ese patrón puntual no se haya cobrado antes en esa
   partida. Se valida solo (sin botón) apenas el patrón queda
   completo, y sigue funcionando hasta que se acaben los 90s o
   las 75 bolas.
   ============================================================ */
(function () {
  function setupAutoBingo() {
    if (window._mhAutoBingoWired) return;
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
      /* Insignia pasiva (no es un botón, no hace falta tocarla) que muestra
         cuántos BINGO ya lleva ese cartón en la partida actual. */
      .mh-bingo-count-badge{
        display:none; align-items:center; justify-content:center; gap:5px;
        width:100%; margin-top:6px; padding:7px;
        font-size:12px; font-weight:900; letter-spacing:.5px; text-transform:uppercase;
        color:#3b2604; background:linear-gradient(180deg,#ffe58a,#d29922);
        border:2px solid #ffd75e; border-radius:99px;
        box-shadow:0 2px 0 #8a6a12, 0 3px 6px rgba(0,0,0,.35);
      }
      .mh-bingo-count-badge.show{ display:flex; }

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
      @keyframes mhGraceIn{ from{ opacity:0; transform:translate(-50%,-10px); } to{ opacity:1; transform:translate(-50%,0); } }
      @keyframes mhCardBtnPulse{
        0%,100%{ box-shadow:0 4px 14px rgba(0,0,0,.45), 0 0 0 rgba(255,215,94,.6); }
        50%{ box-shadow:0 4px 14px rgba(0,0,0,.45), 0 0 14px rgba(255,215,94,.9); }
      }

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
      window._mhClaimedCardsOrder = [];
      const _mhCardList = (typeof playerCardData !== 'undefined' && playerCardData) || [];
      // 🩹 Cada cartón lleva su propia lista de patrones ya cobrados en ESTA
      // partida (Set de ids, ej. "row2", "diag1", "col0", "full"...). Se
      // reinicia siempre que arranca una partida nueva.
      _mhCardList.forEach(c => { if (c) c._mhClaimedPatterns = new Set(); });
      clearGraceTimer();
      clearRoundTimeoutTimer();
      const result = originalStartBingoGame.apply(this, arguments);
      setTimeout(refreshAllBingoBadges, 50);
      setTimeout(refreshAllBingoBadges, 400);
      setTimeout(wireCellMarkObserver, 500);
      // Arranca el único cronómetro de la ronda (90s) apenas empieza la
      // partida real. Ya no hay un segundo temporizador de "gracia" de
      // 30s aparte: este mismo reloj corre entero, haya o no BINGO en
      // el medio.
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
          showToast('🤖 Tu rival ya completó su cartón, pero la partida sigue: ¡seguí marcando tu tarjeta!');
        }
      }
    };

    // 🩹 CLAVE para que se puedan hacer varios BINGO en el mismo cartón:
    // el juego original, dentro de handleBallDraw(), hace
    // "if (cardObj.completed) return;" antes de marcar números nuevos en
    // cada cartón — es decir que apenas evaluateCardPatterns() marca un
    // cartón como completed=true (al completar el PRIMER patrón), ese
    // cartón deja de recibir marcas automáticas para siempre en esa
    // ronda, aunque el sorteo de bolas siga. Sin este parche, ningún
    // cartón podía llegar nunca a un segundo patrón, por más que la
    // ronda no se cortara. Acá se "reabre" el cartón apenas el juego
    // termina de evaluarlo, para que el marcado automático de las
    // bolas siguientes lo siga teniendo en cuenta.
    if (typeof window.evaluateCardPatterns === 'function' && !window._mhEvalPatternsWired) {
      window._mhEvalPatternsWired = true;
      const originalEvaluateCardPatterns = window.evaluateCardPatterns;
      window.evaluateCardPatterns = function (cardObj) {
        const result = originalEvaluateCardPatterns.apply(this, arguments);
        if (cardObj && cardObj.completed) {
          cardObj.completed = false;
        }
        return result;
      };
    }

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

    const MH_ROUND_TIMEOUT_SECONDS = 90;

    function clearRoundTimeoutTimer() {
      if (window._mhRoundTimeoutInterval) {
        clearInterval(window._mhRoundTimeoutInterval);
        window._mhRoundTimeoutInterval = null;
      }
      const bar = document.getElementById('mh-round-timeout-timer');
      if (bar) bar.remove();
    }

    // Termina la ronda cuando nadie completó ningún patrón: se paga SOLO
    // el 10% de lo gastado como devolución (ese es el "premio final" en
    // este caso).
    function endRoundNoWinner(motivo) {
      if (window._mhRoundFinalized) return;
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
          ? `Se acabaron los ${MH_ROUND_TIMEOUT_SECONDS} segundos sin ningún BINGO.`
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
      bar.innerHTML = `⏱️ Tiempo restante de la partida: <span class="mh-rt-secs">${secondsLeft}</span>s`;
      document.body.appendChild(bar);
      window._mhRoundTimeoutInterval = setInterval(() => {
        // Único reloj de la ronda: sigue corriendo entero aunque ya haya
        // uno o más BINGO reclamados, para que se pueda seguir marcando
        // y sumando más BINGO hasta que se acabe el tiempo de verdad.
        if (window._mhRoundFinalized) {
          clearRoundTimeoutTimer();
          return;
        }
        secondsLeft--;
        const secEl = bar.querySelector('.mh-rt-secs');
        if (secEl) secEl.textContent = Math.max(secondsLeft, 0);
        if (secondsLeft <= 10) bar.classList.add('warn');
        if (secondsLeft <= 0) {
          clearRoundTimeoutTimer();
          const claimed = window._mhClaimedCardsOrder || [];
          if (claimed.length > 0) {
            finalizeRound();
          } else {
            endRoundNoWinner('tiempo');
          }
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

    function finalizeRound() {
      if (window._mhRoundFinalized) return;
      window._mhRoundFinalized = true;
      window._mhRoundSettled = true;
      clearGraceTimer();
      clearRoundTimeoutTimer();
      const claimed = window._mhClaimedCardsOrder || [];
      if (claimed.length === 0) return;

      const first = claimed[0];
      roundWinPattern = first.pattern || roundWinPattern;

      // El premio "oficial" del popup del juego (con animación, XP, Bono de
      // Sala, garantía mínima, etc.) se paga UNA sola vez, con el PRIMER
      // patrón validado en la ronda — igual que antes. Cada BINGO extra que
      // se haya hecho durante la partida (otra línea, la diagonal, etc.) ya
      // recibió su propio premio real al momento de completarse — ver
      // awardPatternBingo() más abajo — así que acá no hay que pagarles
      // nada de nuevo, solo cerrar la ronda con el popup principal.
      window._mhBingoManualCall = true;
      endRound(true);
      window._mhBingoManualCall = false;
    }

    // Calcula el premio con la MISMA fórmula real que usa endRound() para
    // el premio oficial (sala × cartones × patrón × bono VIP × multiplicador
    // de apuesta × bonus de mascota) — así un BINGO extra paga justo, no
    // una versión recortada sin VIP/apuesta/mascota.
    function computeCardPrize(pattern) {
      try {
        const vipBonus = 1 + ((typeof state !== 'undefined' && state && state.vipCards) || 0) *
          (((typeof CONFIG !== 'undefined' && CONFIG && CONFIG.vipBonusPerCard) || 0) / 100);
        const usedMultiplier = (typeof pendingMultiplier !== 'undefined' && pendingMultiplier) || 1;
        const betMult = (typeof activeBetMultiplier !== 'undefined' && activeBetMultiplier) || 1;
        const roomBase = (typeof selectedRoom !== 'undefined' && selectedRoom && selectedRoom.baseWinReward) ||
          ((typeof CONFIG !== 'undefined' && CONFIG && CONFIG.baseWinReward) || 0);
        const mascotBonus = (typeof getMascotBonusTotals === 'function')
          ? getMascotBonusTotals() : { goldMult: 1, powerMult: 1 };
        const cardsPlayed = (typeof playerCardData !== 'undefined' && playerCardData && playerCardData.length) ||
          (typeof chosenCardCount !== 'undefined' && chosenCardCount) || 1;
        const patternMult = (pattern && pattern.mult) ||
          (typeof roundWinPattern !== 'undefined' && roundWinPattern && roundWinPattern.mult) || 1;
        return Math.max(0, Math.round(
          roomBase * cardsPlayed * patternMult * vipBonus * usedMultiplier * betMult *
          (mascotBonus.goldMult || 1) * (mascotBonus.powerMult || 1)
        ));
      } catch (e) {
        return 0;
      }
    }

    function isCellMarked(cardObj, idx) {
      const cell = cardObj.cells && cardObj.cells[idx];
      if (!cell) return false;
      return cell.classList.contains('marked') || cell.classList.contains('free');
    }

    // 🩹 NÚCLEO DEL PEDIDO: antes había UN solo patrón ganador por ronda y
    // cada cartón lo podía reclamar una única vez. Ahora se compara cada
    // cartón contra TODOS los patrones activos del juego real
    // (getActivePatterns(), la misma función que usa tu motor — línea por
    // línea, columna por columna, ambas diagonales, 4 esquinas, cartón
    // lleno) y el que ya esté completo Y no se haya cobrado todavía en
    // esta partida se valida solo, sin apretar ningún botón. Se usa
    // getActivePatterns() en vez de la lista cruda para respetar también
    // la regla real de "4 Esquinas" (solo cuenta dentro de las primeras 8
    // bolas cantadas). Así, en el mismo cartón, hacer una línea en la B
    // cuenta como un BINGO, y más tarde completar también la diagonal
    // cuenta como OTRO BINGO — y así sucesivamente hasta que se acaben
    // los 90s o las 75 bolas.
    function scanForNewBingos() {
      if (window._mhRoundFinalized) return;
      const patterns = (typeof getActivePatterns === 'function')
        ? getActivePatterns()
        : (typeof WIN_PATTERNS !== 'undefined' ? WIN_PATTERNS : null);
      if (!patterns || !patterns.length) return;
      const list = (typeof playerCardData !== 'undefined' && playerCardData) || [];
      list.forEach((cardObj) => {
        if (!cardObj || !cardObj.cells || !cardObj.cells.length) return;
        cardObj._mhClaimedPatterns = cardObj._mhClaimedPatterns || new Set();
        patterns.forEach((pattern) => {
          if (!pattern || !pattern.id || !pattern.cells || !pattern.cells.length) return;
          if (cardObj._mhClaimedPatterns.has(pattern.id)) return;
          if (pattern.cells.every((idx) => isCellMarked(cardObj, idx))) {
            awardPatternBingo(cardObj, pattern);
          }
        });
      });
    }

    function awardPatternBingo(cardObj, pattern) {
      if (window._mhRoundFinalized) return;
      cardObj._mhClaimedPatterns = cardObj._mhClaimedPatterns || new Set();
      if (cardObj._mhClaimedPatterns.has(pattern.id)) return;
      cardObj._mhClaimedPatterns.add(pattern.id);
      window._mhClaimedCardsOrder = window._mhClaimedCardsOrder || [];
      const isFirstOfRound = window._mhClaimedCardsOrder.length === 0;
      window._mhClaimedCardsOrder.push({ cardObj: cardObj, pattern: pattern });
      stampCard(cardObj);
      updateBingoBadge(cardObj);
      if (typeof window._mhSpeakBingoVoice === 'function') window._mhSpeakBingoVoice();
      playFullscreenBingo();

      // El primer BINGO de la ronda se paga al final (junto con el popup
      // oficial de victoria, en finalizeRound). Cada BINGO EXTRA en la
      // misma partida (otro patrón, mismo o distinto cartón) paga premio
      // real al toque, sin esperar a que termine el tiempo.
      if (!isFirstOfRound) {
        const extraPrize = computeCardPrize(pattern);
        if (extraPrize > 0 && typeof state !== 'undefined' && state) {
          state.gold = (state.gold || 0) + extraPrize;
          if (typeof saveState === 'function') saveState();
          if (typeof refreshAllUI === 'function') refreshAllUI();
        }
        if (typeof showToast === 'function') {
          const label = pattern.label || 'patrón';
          showToast('🎯 ¡BINGO extra (' + label + ')! +🪙 ' + Math.round(extraPrize).toLocaleString('es'));
        }
      }
    }

    // Insignia pasiva (no un botón — no hace falta tocar nada) que muestra
    // cuántos BINGO ya lleva ese cartón en la partida actual.
    function updateBingoBadge(cardObj) {
      try {
        if (!cardObj || !cardObj.cells || !cardObj.cells[0]) return;
        const cardDiv = cardObj.cells[0].closest('.bingo-card');
        if (!cardDiv) return;
        let badge = cardDiv.querySelector('.mh-bingo-count-badge');
        if (!badge) {
          badge = document.createElement('div');
          badge.className = 'mh-bingo-count-badge';
          cardDiv.appendChild(badge);
        }
        const count = (cardObj._mhClaimedPatterns && cardObj._mhClaimedPatterns.size) || 0;
        if (count > 0) {
          badge.textContent = '🏆 ' + count + (count === 1 ? ' BINGO' : ' BINGOS');
          badge.classList.add('show');
        } else {
          badge.classList.remove('show');
        }
      } catch (e) {}
    }

    function refreshAllBingoBadges() {
      const list = (typeof playerCardData !== 'undefined' && playerCardData) || [];
      list.forEach(updateBingoBadge);
    }
    window._mhRefreshAllBingoBadges = refreshAllBingoBadges;

    // Reacciona apenas se marca/desmarca una celda (tap manual del
    // jugador), sin esperar al próximo intervalo — así el BINGO se valida
    // casi al instante en vez de tardar hasta 500ms.
    // 🩹 FIX (congelamiento): este observador vigila cambios de clase en
    // TODO el bloque de tarjetas — pero la propia insignia "🏆 X BINGOS"
    // (updateBingoBadge) también vive ahí adentro y le cambia la clase
    // "show" cada vez que se actualiza. Sin filtrar, eso hacía que el
    // observador se disparara a sí mismo en bucle sin parar (cada
    // actualización de la insignia contaba como "cambio", así que volvía
    // a llamar a scanForNewBingos()/refreshAllBingoBadges(), que volvía a
    // tocar la insignia, que volvía a disparar el observador...), lo que
    // saturaba el navegador y congelaba TODO (el reloj, el sorteo
    // automático, todo). Ahora se ignoran los cambios que no sean
    // justo en una celda de número (.b-cell) — así solo reacciona a
    // marcas reales del jugador, nunca a sus propios elementos.
    function wireCellMarkObserver() {
      if (window._mhCellMarkObserverWired) return;
      const container = document.querySelector('#active-game-area .cards-container');
      if (!container) return;
      const obs = new MutationObserver((mutations) => {
        const isRealCellChange = mutations.some((m) => {
          const t = m.target;
          return t && t.classList && t.classList.contains('b-cell');
        });
        if (!isRealCellChange) return;
        scanForNewBingos();
        refreshAllBingoBadges();
      });
      obs.observe(container, { attributes: true, attributeFilter: ['class'], subtree: true });
      window._mhCellMarkObserverWired = true;
    }

    const originalHandleBallDraw = window.handleBallDraw;
    window.handleBallDraw = function () {
      originalHandleBallDraw.apply(this, arguments);
      scanForNewBingos();
      refreshAllBingoBadges();
      if (typeof drawnNumbers !== 'undefined' && drawnNumbers.length >= 75 && !window._mhRoundFinalized) {
        const claimedSoFar = window._mhClaimedCardsOrder || [];
        if (claimedSoFar.length > 0) {
          finalizeRound();
        } else {
          // Se agotaron las 75 bolas sin que nadie complete ningún patrón:
          // mismo caso que el timeout de 90s (nadie ganó), misma devolución del 10%.
          endRoundNoWinner('bolas');
        }
      }
    };

    setInterval(() => { scanForNewBingos(); refreshAllBingoBadges(); }, 500);

    window._mhManualBingoWired = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAutoBingo);
  } else {
    setupAutoBingo();
  }
  setTimeout(setupAutoBingo, 800);
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
    .event-fab{ top:-9999px !important; bottom:auto !important; left:-9999px !important; right:auto !important; width:30px !important; height:30px !important; font-size:14px !important; }
    .admin-fab{ top:-9999px !important; bottom:auto !important; left:-9999px !important; right:auto !important; width:26px !important; height:26px !important; font-size:12px !important; }
    #neon-aura-fab{ top:-9999px !important; bottom:auto !important; right:auto !important; left:-9999px !important; width:30px !important; height:30px !important; font-size:14px !important; }

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

  /* Los 3 botones (cohete, llave y estrella) van juntos, en fila,
     pegados debajo del pill "VIP" (#display-user) de Inicio. Se
     calcula la posición real con getBoundingClientRect en vez de un
     valor fijo, para que no dependa del tamaño de pantalla ni se
     corran a otro lado. */
  function positionFabGroup() {
    try {
      const badge = document.getElementById('display-user');
      const star = document.getElementById('neon-aura-fab');
      const rocket = document.querySelector('.event-fab');
      const wrench = document.querySelector('.admin-fab');
      const main = document.getElementById('main-screen');
      if (!badge || !star || !main || !main.classList.contains('active')) return;
      const r = badge.getBoundingClientRect();
      if (!r.width && !r.height) return;
      const top = r.bottom + 6;
      const starW = star.offsetWidth || 30;
      const gap = 6;
      star.style.setProperty('top', top + 'px', 'important');
      star.style.setProperty('left', (r.right - starW) + 'px', 'important');
      star.style.setProperty('right', 'auto', 'important');
      let cursor = r.right - starW - gap;
      if (rocket) {
        const w = rocket.offsetWidth || 30;
        cursor -= w;
        rocket.style.setProperty('top', top + 'px', 'important');
        rocket.style.setProperty('left', cursor + 'px', 'important');
        rocket.style.setProperty('right', 'auto', 'important');
        cursor -= gap;
      }
      if (wrench) {
        const w = wrench.offsetWidth || 26;
        cursor -= w;
        wrench.style.setProperty('top', top + 'px', 'important');
        wrench.style.setProperty('left', cursor + 'px', 'important');
        wrench.style.setProperty('right', 'auto', 'important');
      }
    } catch (e) {}
  }

  if (typeof window.goToScreen === 'function' && !window._mhFabVisibilityWired) {
    const original = window.goToScreen;
    window.goToScreen = function (screenId, isReplace) {
      const r = original.apply(this, arguments);
      try {
        document.body.classList.toggle('mh-hide-fabs', HIDE_FABS_SCREENS.includes(screenId));
      } catch (e) {}
      setTimeout(positionFabGroup, 60);
      return r;
    };
    window._mhFabVisibilityWired = true;
  }

  window.addEventListener('resize', positionFabGroup);
  window.addEventListener('orientationchange', function () { setTimeout(positionFabGroup, 200); });
  if (!window._mhNeonFabLoopWired) {
    setInterval(positionFabGroup, 1200);
    window._mhNeonFabLoopWired = true;
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', positionFabGroup);
  } else {
    positionFabGroup();
  }
})();



/* ============================================================
   REDISEÑO DE INICIO (main-screen), estilo "vidrio" (glass):
   - Se quita la mascota (pollito) del centro.
   - La órbita circular de accesos se convierte en una grilla de
     tarjetas de vidrio (3 columnas), con ícono grande + etiqueta.
   - El panel de Nivel se convierte en tarjeta de vidrio oscura,
     con el bono XP dividido en 3 chips (antes era 1 sola línea).
   - Los botones "Bingo Automático" / "Mi Isla" pasan a tener un
     círculo con el ícono a la izquierda y el texto al lado.
   ============================================================ */
(function () {
  const css = `
    #main-screen .hero-mascot,
    #main-screen .hero-sparkle{ display:none !important; }

    #main-screen .hero-orbit{
      width:100% !important; max-width:none !important; aspect-ratio:auto !important;
      height:100% !important; min-height:0 !important; max-height:100% !important;
      display:flex !important; align-items:center !important; justify-content:center !important;
      overflow:hidden !important;
    }
    #main-screen .hero-orbit-ring{
      position:static !important; inset:auto !important; animation:none !important;
      display:grid !important;
      grid-auto-flow:column !important;
      grid-template-rows:repeat(2,1fr) !important;
      grid-auto-columns:104px !important;
      gap:7px !important;
      width:100% !important; max-width:none !important; height:100% !important; margin:0 !important;
      overflow-x:auto !important; overflow-y:hidden !important;
      -webkit-overflow-scrolling:touch;
      scroll-snap-type:x proximity;
      padding:2px 4px !important;
      box-sizing:border-box !important;
    }
    #main-screen .hero-badge{
      position:static !important; top:auto !important; left:auto !important; margin:0 !important;
      width:104px !important; height:auto !important; transform:none !important;
      scroll-snap-align:start;
    }
    #main-screen .hb-inner{
      width:100% !important; height:100% !important; display:flex !important; flex-direction:column !important;
      align-items:center !important; justify-content:center !important; gap:5px !important;
      border-radius:16px !important; position:relative !important; overflow:hidden !important;
      border:1px solid rgba(255,255,255,.4) !important; backdrop-filter:blur(6px);
      box-shadow:0 6px 14px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.35) !important;
      animation:none !important; transform:none !important;
    }
    @keyframes counterSpin{ from{ transform:none; } to{ transform:none; } }
    @keyframes orbitSpin{ from{ transform:none; } to{ transform:none; } }
    #main-screen .hb-inner::before{
      content:''; position:absolute; top:9px; right:9px; width:13px; height:2px;
      background:rgba(255,255,255,.75); border-radius:2px;
      box-shadow:0 4px 0 rgba(255,255,255,.75), 0 8px 0 rgba(255,255,255,.75);
    }
    #main-screen .hb-inner .hb-icon{ font-size:26px !important; filter:drop-shadow(0 2px 3px rgba(0,0,0,.3)); }
    #main-screen .hb-inner .hb-label{ font-size:9.5px !important; font-weight:800 !important; text-transform:uppercase; letter-spacing:.3px; text-shadow:0 1px 2px rgba(0,0,0,.35) !important; }

    #main-screen .hb-c0 .hb-inner{ background:linear-gradient(160deg, rgba(255,143,179,.45), rgba(224,35,79,.32)) !important; }
    #main-screen .hb-c1 .hb-inner{ background:linear-gradient(160deg, rgba(185,140,240,.45), rgba(110,64,201,.32)) !important; }
    #main-screen .hb-c2 .hb-inner{ background:linear-gradient(160deg, rgba(123,224,138,.45), rgba(46,160,67,.32)) !important; }
    #main-screen .hb-c3 .hb-inner{ background:linear-gradient(160deg, rgba(255,224,138,.45), rgba(210,153,34,.32)) !important; }
    #main-screen .hb-c4 .hb-inner{ background:linear-gradient(160deg, rgba(143,214,255,.45), rgba(31,143,214,.32)) !important; }
    #main-screen .hb-c5 .hb-inner{ background:linear-gradient(160deg, rgba(227,156,255,.45), rgba(162,63,214,.32)) !important; }
    #main-screen .hb-c6 .hb-inner{ background:linear-gradient(160deg, rgba(255,158,110,.45), rgba(217,72,15,.32)) !important; }
    #main-screen .hb-c7 .hb-inner{ background:linear-gradient(160deg, rgba(255,240,122,.45), rgba(255,160,0,.32)) !important; }
    #main-screen .hb-c8 .hb-inner{ background:linear-gradient(160deg, rgba(255,216,102,.45), rgba(137,87,229,.32)) !important; }

    #main-screen .userlvl-widget{
      background:rgba(15,18,28,.55) !important; backdrop-filter:blur(10px);
      border:1px solid rgba(255,255,255,.18) !important; border-radius:20px !important;
      padding:12px 16px !important;
    }
    #main-screen .userlvl-badge{ font-size:15px !important; }
    #main-screen .userlvl-bar-bg{ height:18px !important; border-radius:20px !important; background:rgba(255,255,255,.08) !important; border:none !important; }
    #main-screen .userlvl-bar-fill{ border-radius:20px !important; box-shadow:0 0 10px rgba(255,216,102,.6); }

    #main-screen .mh-xp-chips{ display:flex !important; gap:6px !important; margin-top:8px !important; }
    #main-screen .mh-xp-chip{
      flex:1; display:flex; flex-direction:column; align-items:center; gap:2px;
      background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.16);
      border-radius:12px; padding:6px 4px; font-size:9px; font-weight:800; color:#fff;
      text-shadow:0 1px 2px rgba(0,0,0,.4);
    }
    #main-screen .mh-xp-chip .mh-xp-chip-ico{ font-size:14px; }

    #main-screen .hero-cta-inner{ text-align:left !important; padding:8px 14px !important; }
    #main-screen .mh-cta-row{ display:flex !important; align-items:center !important; gap:10px !important; }
    #main-screen .mh-cta-icon{
      flex-shrink:0; width:38px; height:38px; border-radius:50%;
      background:rgba(255,255,255,.25); border:1px solid rgba(255,255,255,.5);
      display:flex; align-items:center; justify-content:center; font-size:19px;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.5);
    }
    #main-screen .mh-cta-text .hc-sub{ letter-spacing:2px !important; }
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  function restyleCta(selector, icon, sub, main) {
    const cta = document.querySelector(selector);
    if (!cta || cta._mhCtaRestyled) return;
    const inner = cta.querySelector('.hero-cta-inner');
    if (!inner) return;
    inner.innerHTML =
      '<div class="mh-cta-row">' +
      '<div class="mh-cta-icon">' + icon + '</div>' +
      '<div class="mh-cta-text"><div class="hc-sub">' + sub + '</div><div class="hc-main">' + main + '</div></div>' +
      '</div>';
    cta._mhCtaRestyled = true;
  }

  function applyHomeRedesign() {
    try {
      restyleCta('.hero-cta[onclick*="game-screen"]', '🚀', 'ÚNETE A', 'BINGO AUTOMÁTICO');
      restyleCta('.hero-cta[onclick*="isla-screen"]', '🏝️', 'EXPLORA', 'MI ISLA');
    } catch (e) {}
  }

  function rebuildXPChips() {
    try {
      const bonusEl = document.getElementById('userlvl-bonus-text');
      if (!bonusEl) return;
      let vB = 0, cB = 0;
      if (typeof window.vipRankXPBonusPercent === 'function') vB = window.vipRankXPBonusPercent();
      if (typeof window.cardXPBonusPercent === 'function') cB = window.cardXPBonusPercent();
      if (!vB && !cB) {
        const raw = bonusEl.getAttribute('data-raw') || bonusEl.innerText;
        const mV = raw.match(/VIP\s*\+([\d.]+)%/);
        const mC = raw.match(/Cartones\s*\+(\d+)%/);
        if (mV) vB = parseFloat(mV[1]);
        if (mC) cB = parseFloat(mC[1]);
      }
      let chips = document.getElementById('mh-xp-chips');
      if (!chips) {
        chips = document.createElement('div');
        chips.id = 'mh-xp-chips';
        chips.className = 'mh-xp-chips';
        bonusEl.insertAdjacentElement('afterend', chips);
      }
      if (vB > 0 || cB > 0) {
        bonusEl.style.display = 'none';
        chips.style.display = 'flex';
        chips.innerHTML =
          '<div class="mh-xp-chip"><span class="mh-xp-chip-ico">⚡</span>Bono XP +' + vB.toFixed(1) + '%</div>' +
          '<div class="mh-xp-chip"><span class="mh-xp-chip-ico">💎</span>VIP +' + vB.toFixed(1) + '%</div>' +
          '<div class="mh-xp-chip"><span class="mh-xp-chip-ico">🃏</span>Cartones +' + cB + '%</div>';
      } else {
        chips.style.display = 'none';
      }
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyHomeRedesign);
  } else {
    applyHomeRedesign();
  }

  if (typeof window.renderUserLevelWidget === 'function' && !window._mhXPChipsWired) {
    const original = window.renderUserLevelWidget;
    window.renderUserLevelWidget = function () {
      const r = original.apply(this, arguments);
      rebuildXPChips();
      return r;
    };
    window._mhXPChipsWired = true;
  }
})();


/* ============================================================
   PANTALLA DE JUEGO (Bingo en vivo): máximo bajado de 16 a 2
   cartones (cambio real en index.html). Aquí solo el layout:
   - Los cartones (ahora máx. 2) se muestran uno al lado del otro
     en vez de apilados, y se oculta la tira de pestañas (ya no
     hace falta con solo 2).
   - Se agrega una columna de bolas recientes a la izquierda del
     cartón (la actual grande arriba + últimas 4 abajo) y un panel
     a la derecha con "Bolas restantes" + tablero de números
     cantados (estilo cartón de control), usando los datos reales
     del sorteo (drawnNumbers / letterForNumber).
   Nota: esta app declara el Bingo automático (no hay botón manual
   "BINGO!"/"FAST DAUB" como en la imagen de referencia — acá el
   cartón se marca y valida solo), así que esos dos botones no se
   agregan para no simular una acción que no existe.
   ============================================================ */
(function () {
  const css = `
    /* 🩹 FIX: antes esto parpadeaba solo el color del texto (blanco↔amarillo)
       sobre fondo blanco, pensado para cuando .flash-new se ponía sobre una
       celda YA marcada (círculo rojo) — ahí alcanzaba con algo sutil.
       Ahora el marcado es MANUAL: .flash-new se usa para avisar "este
       número salió, tocalo" en una celda blanca sin marcar todavía, así
       que el parpadeo de solo texto casi no se nota. Se cambia a un
       parpadeo de fondo + borde bien visible (sin duplicar el look del
       círculo rojo de marcado). */
    .b-cell.flash-new{
      animation: mhNumberBlink .6s ease-in-out infinite !important;
      position:relative !important; z-index:2 !important;
    }
    @keyframes mhNumberBlink{
      0%,100%{ background:#ffffff !important; border-color:#c7d6f5 !important; color:#16233f !important; box-shadow:none !important; transform:scale(1) !important; }
      50%{ background:#ffd23f !important; border-color:#f2a900 !important; color:#3a2600 !important; box-shadow:0 0 10px 3px rgba(255,210,63,.85) !important; transform:scale(1.08) !important; }
    }
    /* 🩹 FIX: antes tenía "display:flex !important" fijo e incondicional
       acá, lo que anulaba el display:none que pone la app cuando esta
       zona no debe verse (por ej. mientras estás en el modal de apuesta
       Sencillo/Doble/Triple/Múltiple, antes de arrancar la partida) —
       por eso el área de juego en vivo quedaba pegada visible abajo.
       Ahora solo se fuerza flex cuando la propia app NO la tiene oculta
       con display:none; si la oculta, se respeta. */
    #active-game-area:not([style*="display: none"]):not([style*="display:none"]){
      display:flex !important; flex-wrap:wrap !important; align-items:flex-start !important; gap:6px !important;
    }
    #active-game-area .battle-status{ order:1; flex-basis:100% !important; }
    #active-game-area .tombola-wrap{ display:none !important; }
    /* 🩹 FIX: el círculo de bolas duplicado arriba era #history-strip, la
       tira original de la app (ya venía de antes). Como ahora tenemos
       nuestra propia columna de historial (#mh-ball-history-col) con la
       misma info, se oculta la original para que no aparezcan las dos. */
    #active-game-area .history-strip{ display:none !important; }
    #active-game-area .ball-callout-container{ order:2; flex:0 0 78px !important; margin:0 !important; }
    #active-game-area .card-tabs-strip{ display:none !important; }
    #active-game-area #mh-ball-history-col{ order:3; flex:0 0 60px !important; display:flex; flex-direction:column; gap:5px; align-items:center; padding-top:4px; }
    #active-game-area .cards-container{ order:4; display:flex !important; flex-direction:row !important; flex:1 1 auto !important; gap:6px !important; overflow:hidden !important; justify-content:center !important; align-content:flex-start !important; }
    /* 🩹 FIX: con "flex:1 1 0" la tarjeta crece para llenar todo el
       ancho libre — con 2 tarjetas se reparten bien, pero con 1 sola
       se estiraba enorme (y por el aspect-ratio:1 de cada celda, la
       tarjeta terminaba más alta que la pantalla y se cortaba abajo).
       Se le pone un máximo de ancho fijo para que no crezca de más,
       juegues con 1 o con 2. Es un ancho fijo (260px); el ajuste real
       para que TODO entre en pantalla (tarjetas, bolas y tabla) lo hace
       fitGameScreen() en JS más abajo, escalando el bloque completo, no
       cambiando este número.
    */
    #active-game-area .cards-container .bingo-card{
      flex:0 0 260px !important; max-width:260px !important;
      width:260px !important; min-width:0 !important; box-sizing:border-box !important;
    }
    /* 🩹 FIX 2: lo de arriba no alcanzaba con 1 sola tarjeta porque el
       juego recalcula el tamaño de la GRILLA interna (.bingo-grid) y de
       cada celda (.b-cell) en píxeles fijos según el ancho disponible
       del contenedor — y como con 1 tarjeta ese ancho es mayor, calcula
       celdas más grandes y la tarjeta termina siendo más ancha que los
       260px de arriba (el max-width no puede achicar una grilla con
       columnas en px fijos). Se fuerza la grilla a columnas flexibles
       (1fr) y las celdas a ancho automático, para que siempre quepan
       dentro del ancho de la tarjeta, sea 1 o 2 tarjetas. */
    #active-game-area .cards-container .bingo-card .bingo-grid{
      display:grid !important; grid-template-columns:repeat(5,1fr) !important; width:100% !important;
    }
    #active-game-area .cards-container .bingo-card .b-cell{
      width:auto !important; height:auto !important; aspect-ratio:1 / 1 !important;
    }
    #active-game-area #mh-call-panel{ order:5; flex:0 0 150px !important; }
    #active-game-area .chat-panel{ order:6; flex-basis:100% !important; }
    /* 🩹 FIX 5: TODA la pantalla de juego en vivo debe entrar en una
       sola vista, sin scroll ni movimiento — el alto real lo mide y
       aplica fitGameScreen() en JS (más abajo), acá solo se prepara el
       terreno para que ese alto en px realmente se respete y no se
       desborde. */
    body.no-scroll-fixed-screen{ overflow:hidden !important; position:fixed !important; inset:0 !important; width:100% !important; }
    #active-game-area{ box-sizing:border-box !important; }

    #mh-ball-history-col .mh-hist-ball{
      border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center;
      font-weight:900; color:#fff; border:3px solid rgba(255,255,255,.85);
      box-shadow:0 2px 6px rgba(0,0,0,.5), inset 0 2px 4px rgba(255,255,255,.35);
      line-height:1.05;
    }
    #mh-ball-history-col .mh-hist-ball .mh-hist-letter{ font-size:.55em; opacity:.9; }
    #mh-ball-history-col .mh-hist-ball .mh-hist-num{ font-size:1.1em; }
    #mh-call-panel{
      background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); border-radius:10px;
      padding:6px; font-size:8.5px; box-sizing:border-box;
    }
    #mh-call-panel .mh-remaining{
      text-align:center; font-weight:900; font-size:10.5px; color:#ffd866; margin-bottom:5px;
    }
    #mh-call-grid{ display:grid; grid-template-columns:repeat(5,1fr); gap:2px; }
    #mh-call-grid .mh-cg-head{ text-align:center; font-weight:900; font-size:8px; border-radius:3px; color:#fff; padding:1px 0; }
    #mh-call-grid .mh-cg-cell{
      text-align:center; font-size:7px; padding:2px 0; border-radius:3px; color:#8b949e; background:rgba(255,255,255,.04);
    }
    #mh-call-grid .mh-cg-cell.called{
      background:#d29922; color:#1a1200; font-weight:900;
    }
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  const LETTER_COLORS = { B: '#e0234f', I: '#d29922', N: '#2ea043', G: '#1f8fd6', O: '#a23fd6' };

  /* 🩹 FIX 3 (refuerzo por JS): si el juego original setea el ancho de
     .bingo-card / .bingo-grid / .b-cell por JS con prioridad "important"
     directo en el atributo style (style.setProperty(..., 'important')),
     eso le gana a nuestro <style> aunque tenga !important. Por eso además
     se re-aplican estos valores por JS cada vez que el DOM de las
     tarjetas cambia, así siempre quedan pisados los de arriba. Esto solo
     fija un ancho BASE fijo (no depende de cuánto espacio quede en la
     pantalla) — el que realmente ajusta todo para que entre entero es
     fitGameScreen(), más abajo, escalando el bloque completo.
  */
  function forceCardSizing() {
    const container = document.querySelector('#active-game-area .cards-container');
    if (container) {
      container.style.setProperty('display', 'flex', 'important');
      container.style.setProperty('flex-direction', 'row', 'important');
      container.style.setProperty('flex-wrap', 'nowrap', 'important');
      container.style.setProperty('gap', '6px', 'important');
      container.style.setProperty('justify-content', 'center', 'important');
    }
    const cardW = '260px';
    document.querySelectorAll('#active-game-area .cards-container .bingo-card').forEach(card => {
      card.style.setProperty('max-width', cardW, 'important');
      card.style.setProperty('width', cardW, 'important');
      card.style.setProperty('flex', '0 0 ' + cardW, 'important');
      const grid = card.querySelector('.bingo-grid');
      if (grid) {
        grid.style.setProperty('display', 'grid', 'important');
        grid.style.setProperty('grid-template-columns', 'repeat(5, 1fr)', 'important');
        grid.style.setProperty('width', '100%', 'important');
      }
      card.querySelectorAll('.b-cell').forEach(cell => {
        cell.style.setProperty('width', 'auto', 'important');
        cell.style.setProperty('height', 'auto', 'important');
      });
    });
  }

  /* 🩹 FIX 5/6: "que no se mueva / entre en una sola pantalla, con la
     tabla completa hasta el 75" — el intento anterior solo achicaba el
     ANCHO de las tarjetas, pero el panel de "bolas restantes" (con toda
     la tabla 1-75) no se achicaba con ellas, así que cuando no entraba
     completo se cortaba (se veía solo hasta el número 70 más o menos).

     🩹 FIX 7: el primer intento de arreglar eso envolvía #active-game-area
     en un <div> nuevo (moviéndolo de lugar en el DOM) para poder reducir
     el bloque entero con un transform — pero mover ese elemento de lugar
     rompía el arranque del sorteo automático (la partida se quedaba
     trabada en "Sorteo automático en curso..." sin avanzar). Ahora se
     logra el mismo resultado (reducir TODO el bloque como una unidad,
     tabla incluida) SIN mover nada de lugar: se usa la propiedad CSS
     "zoom", que a diferencia de "transform: scale()" sí reduce el tamaño
     real de layout del elemento (no solo lo visual), así que su propio
     alto ya queda achicado de verdad — no hace falta ningún envoltorio
     ni recortar nada por separado. */
  /* 🩹 FIX 8: el cálculo anterior dividía "budget / naturalHeight" UNA
     sola vez para sacar el zoom — pero el zoom cambia cuánto espacio
     "efectivo" tienen las tarjetas/panel para acomodarse en fila (a
     menos zoom, más espacio CSS disponible), así que el alto real ya
     zoomeado casi nunca es exactamente proporcional al alto a tamaño
     completo. Esa única cuenta se quedaba corta y terminaba achicando
     de más, dejando espacio libre sin usar abajo. Ahora se prueba un
     zoom candidato y se mide el alto REAL ya con ese zoom puesto (no
     una cuenta matemática), ajustando de a poco hasta acercarse al
     límite justo — así las tarjetas quedan lo más grandes posible sin
     dejar de entrar completas. */
  function fitGameScreen() {
    const area = document.getElementById('active-game-area');
    if (!area) return;
    const cs = window.getComputedStyle(area);
    if (cs.display === 'none') return;

    forceCardSizing();
    area.style.setProperty('overflow', 'hidden', 'important');

    const vh = (window.visualViewport ? window.visualViewport.height : window.innerHeight);

    let zoomLevel = 1;
    let h = 0;
    const budget = (() => {
      area.style.setProperty('zoom', '1', 'important');
      const top = area.getBoundingClientRect().top;
      return Math.max(120, Math.floor(vh - top - 6));
    })();

    for (let i = 0; i < 8; i++) {
      area.style.setProperty('zoom', zoomLevel.toFixed(3), 'important');
      h = area.getBoundingClientRect().height;
      if (h <= budget || zoomLevel <= 0.42) break;
      // Margen de seguridad chico (3%) para converger sin pasarse de
      // largo y necesitar demasiadas vueltas.
      zoomLevel = Math.max(0.42, zoomLevel * (budget / h) * 0.97);
    }
  }

  if (!window._mhCardSizingObserverWired) {
    window._mhCardSizingObserverWired = true;
    // 🩹 FIX 4: antes esto dependía 100% de un MutationObserver + el CSS
    // ganándole por especificidad — y en algún escenario (con 1 sola
    // tarjeta) algo seguía ganando esa pelea. En vez de seguir adivinando
    // QUÉ regla gana, ahora se refuerza el tamaño por JS cada 300ms sin
    // parar mientras la pantalla de juego esté visible — así no importa
    // qué otra cosa esté tocando el estilo, esto siempre lo vuelve a
    // pisar poco después. fitGameScreen() además recalcula el ancho real
    // de tarjeta según el espacio disponible en cada pasada.
    const cardObserver = new MutationObserver(() => fitGameScreen());
    const wireCardObserver = () => {
      const container = document.querySelector('#active-game-area .cards-container');
      if (!container) return;
      cardObserver.observe(container, { childList: true, subtree: true });
      fitGameScreen();
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', wireCardObserver);
    } else {
      wireCardObserver();
    }
    setTimeout(wireCardObserver, 800);
    setInterval(fitGameScreen, 300);
    window.addEventListener('resize', fitGameScreen);
    window.addEventListener('orientationchange', () => setTimeout(fitGameScreen, 200));
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', fitGameScreen);
    }
  }

  function ensurePanels() {
    const area = document.getElementById('active-game-area');
    if (!area) return;
    if (!document.getElementById('mh-ball-history-col')) {
      const col = document.createElement('div');
      col.id = 'mh-ball-history-col';
      area.appendChild(col);
    }
    if (!document.getElementById('mh-call-panel')) {
      const panel = document.createElement('div');
      panel.id = 'mh-call-panel';
      panel.innerHTML =
        '<div class="mh-remaining" id="mh-remaining-text">75 BOLAS RESTANTES</div>' +
        '<div id="mh-call-grid"></div>';
      area.appendChild(panel);
      const grid = panel.querySelector('#mh-call-grid');
      ['B', 'I', 'N', 'G', 'O'].forEach(l => {
        const head = document.createElement('div');
        head.className = 'mh-cg-head';
        head.style.background = LETTER_COLORS[l];
        head.textContent = l;
        grid.appendChild(head);
      });
      for (let row = 0; row < 15; row++) {
        [1, 16, 31, 46, 61].forEach(base => {
          const n = base + row;
          const cell = document.createElement('div');
          cell.className = 'mh-cg-cell';
          cell.id = 'mh-cg-' + n;
          cell.textContent = n;
          grid.appendChild(cell);
        });
      }
    }
  }

  function refreshCallPanel() {
    try {
      ensurePanels();
      fitGameScreen();
      if (typeof drawnNumbers === 'undefined') return;
      const drawn = drawnNumbers || [];
      const remaining = Math.max(0, 75 - drawn.length);
      const rtext = document.getElementById('mh-remaining-text');
      if (rtext) rtext.textContent = remaining + ' BOLAS RESTANTES';
      document.querySelectorAll('#mh-call-grid .mh-cg-cell.called').forEach(c => {
        if (!drawn.includes(parseInt(c.id.replace('mh-cg-', ''), 10))) c.classList.remove('called');
      });
      drawn.forEach(n => {
        const cell = document.getElementById('mh-cg-' + n);
        if (cell) cell.classList.add('called');
      });
      const col = document.getElementById('mh-ball-history-col');
      if (col && typeof letterForNumber === 'function') {
        const last = drawn.slice(-5).reverse();
        col.innerHTML = last.map((n, i) => {
          const l = letterForNumber(n);
          const size = i === 0 ? 42 : 28;
          const fs = i === 0 ? 15 : 10;
          return '<div class="mh-hist-ball" style="width:' + size + 'px;height:' + size + 'px;font-size:' + fs + 'px;background:' + LETTER_COLORS[l] + ';border-color:' + LETTER_COLORS[l] + ';">' +
            '<span class="mh-hist-letter">' + l + '</span><span class="mh-hist-num">' + n + '</span></div>';
        }).join('');
      }
    } catch (e) {}
  }

  ['handleBallDraw', 'generateAllCards', 'startBingoGame'].forEach(fnName => {
    if (typeof window[fnName] === 'function' && !window['_mhCallPanelWired_' + fnName]) {
      const original = window[fnName];
      window[fnName] = function () {
        const r = original.apply(this, arguments);
        setTimeout(refreshCallPanel, 30);
        return r;
      };
      window['_mhCallPanelWired_' + fnName] = true;
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', refreshCallPanel);
  } else {
    refreshCallPanel();
  }
})();

/* ============================================================
   PANTALLA DE BINGO FIJA (no debe moverse / scrollear)
   ------------------------------------------------------------
   Ojo: game-screen tiene 3 sub-vistas (#room-select-view,
   #lobby-modal, #active-game-area) y solo la última es la
   partida jugándose de verdad — las otras dos (elegir sala,
   elegir apuesta) tienen que poder scrollear normal. Por eso NO
   se engancha a goToScreen (fijaría las 3), sino que se observa
   directamente cuándo #active-game-area pasa a display:block
   (ver openBingoLobby / botón "Comenzar Bingo" en index.html) y
   ahí sí se agrega body.no-scroll-fixed-screen — el mismo
   mecanismo que ya usan Isla y Arena — y se saca apenas se sale
   de esa vista.
   ============================================================ */
(function () {
  function wireFixedGameScreen() {
    if (window._mhFixedGameScreenWired) return;
    const area = document.getElementById('active-game-area');
    if (!area) return;
    function syncFixedClass() {
      const isPlaying = area.style.display !== 'none' && area.style.display !== '';
      document.body.classList.toggle('no-scroll-fixed-screen', isPlaying);
    }
    const observer = new MutationObserver(syncFixedClass);
    observer.observe(area, { attributes: true, attributeFilter: ['style'] });
    syncFixedClass();
    window._mhFixedGameScreenWired = true;
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireFixedGameScreen);
  } else {
    wireFixedGameScreen();
  }
  setTimeout(wireFixedGameScreen, 800);
})();

/* ============================================================
   APAGAR EL PARPADEO DE NÚMEROS DE LA TARJETA AL TOCARLO
   ------------------------------------------------------------
   La app original ya hace exactamente esto: le pone .flash-new
   a cada casilla recién marcada (parpadeo con newNumberFlash) y
   la saca cuando el jugador toca esa celda — ver el onclick que
   ya trae cada celda en index.html. No hace falta duplicar nada
   acá; este bloque queda solo para asegurarse de que el toque
   siga funcionando aunque el resto de la app cambie el layout.
   ============================================================ */
(function () {
  function wireTapToStopFlash() {
    if (window._mhTapFlashWired) return;
    const grid = document.getElementById('active-game-area');
    if (!grid) return;
    grid.addEventListener('click', function (e) {
      const cell = e.target.closest('.b-cell.flash-new');
      if (cell) cell.classList.remove('flash-new');
    });
    window._mhTapFlashWired = true;
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireTapToStopFlash);
  } else {
    wireTapToStopFlash();
  }
  setTimeout(wireTapToStopFlash, 800);
})();

/* ============================================================
   NÚMEROS YA CANTADOS: cambiarles el color aunque no estén
   marcados/tocados todavía
   ------------------------------------------------------------
   Antes solo existía .flash-new, que parpadea el número recién
   cantado por un ratito y se apaga apenas lo tocás — pero un
   número que salió hace varias bolas y todavía no tocaste queda
   igual que uno que nunca salió (negro), así que no hay forma de
   saber de un vistazo cuáles ya salieron sin ir mirando el panel
   de bolas restantes. Acá se compara, en cada celda de cada
   cartón, el número que muestra contra la lista real de bolas ya
   cantadas (drawnNumbers) y si ya salió (y esa celda todavía no
   está marcada/tocada) se le pone un color distinto de forma
   PERMANENTE, no un parpadeo — se mantiene así hasta que la
   marques o hasta la próxima partida.
   ============================================================ */
(function () {
  const css = `
    .b-cell.mh-called-num:not(.marked):not(.free){
      color:#e0234f !important;
    }
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  function syncCalledNumbers() {
    try {
      if (typeof drawnNumbers === 'undefined') return;
      const drawn = drawnNumbers || [];
      if (!drawn.length) return;
      const drawnSet = new Set(drawn);
      document.querySelectorAll('.bingo-card .b-cell').forEach(cell => {
        if (cell.classList.contains('free')) return;
        const m = (cell.textContent || '').match(/\d+/);
        if (!m) return;
        const num = parseInt(m[0], 10);
        cell.classList.toggle('mh-called-num', drawnSet.has(num));
      });
    } catch (e) {}
  }

  ['handleBallDraw', 'generateAllCards', 'startBingoGame'].forEach(fnName => {
    if (typeof window[fnName] === 'function' && !window['_mhCalledNumWired_' + fnName]) {
      const original = window[fnName];
      window[fnName] = function () {
        const r = original.apply(this, arguments);
        setTimeout(syncCalledNumbers, 30);
        return r;
      };
      window['_mhCalledNumWired_' + fnName] = true;
    }
  });

  if (!window._mhCalledNumIntervalWired) {
    window._mhCalledNumIntervalWired = true;
    setInterval(syncCalledNumbers, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncCalledNumbers);
  } else {
    syncCalledNumbers();
  }
})();

/* ============================================================
   🛠️ EDITOR DE PANTALLA (mover / achicar / agrandar cualquier
   bloque de CUALQUIER pantalla de la app, a mano)
   ------------------------------------------------------------
   Botón flotante propio (independiente del panel de administrador
   real, que vive en tu index.html y no puedo tocar desde acá sin
   arriesgarme a romperlo a ciegas). Al activar el modo edición,
   tocás cualquier bloque de la pantalla que estés viendo (juego,
   mascotas, tienda, lo que sea) y aparecen controles para
   moverlo y cambiarle el tamaño con botones +/-, con un mini
   cronómetro de posición en vivo. Todo lo que ajustés queda
   guardado en ESTE celular (localStorage) y se vuelve a aplicar
   solo cada vez que abrís esa pantalla — no hace falta pedirme
   que te lo retoque yo cada vez.

   Limitaciones a tener en cuenta:
   - Se guarda en PORCENTAJES del ancho/alto de pantalla (no en
     píxeles fijos) para que no se rompa en celulares de otra
     medida — pero no es magia: un ajuste pensado para tu pantalla
     puede no quedar igual de perfecto en una pantalla MUY distinta.
   - Se guarda solo en este celular (no en la nube), así que por
     ahora es tu calibración de prueba, no algo que ya vean todos
     los jugadores.
   - Si un bloque ya se mueve solo por su cuenta (por ejemplo algo
     que gira o flota con su propia animación), moverlo acá puede
     chocar con esa animación — mejor no tocar esos con el editor.
   ============================================================ */
(function () {
  function setupLayoutEditor() {
    if (window._mhLayoutEditorWired) return;
    window._mhLayoutEditorWired = true;

    const LS_KEY = 'mh_layout_overrides_v1';
    const STEP_OPTIONS = [0.5, 1, 2, 5];

    const css = `
      .mh-editor-admin-btn{
        display:block; width:100%; padding:12px; margin-top:8px; border:none; border-radius:10px;
        font-weight:900; font-size:13.5px; cursor:pointer;
      }
      .mh-editor-admin-btn.on{ background:linear-gradient(180deg,#ffe58a,#d29922); color:#2a1c00; }
      .mh-editor-admin-btn.off{ background:linear-gradient(180deg,#3a3010,#1c1804); color:#ffd75e; border:1px solid #ffd75e; }
      .mh-editor-admin-btn.danger{ background:#5b2222; color:#ffd8d8; font-size:12px; padding:9px; }
      .mh-editor-admin-note{ font-size:11.5px; color:#8b949e; margin:8px 0; line-height:1.5; }
      .mh-editor-banner{
        position:fixed; top:8px; left:50%; transform:translateX(-50%);
        z-index:99991; background:rgba(20,16,4,.9); border:1px solid #ffd75e;
        color:#ffe9ad; font-size:11.5px; font-weight:800; padding:6px 12px;
        border-radius:999px; display:none; align-items:center; gap:8px;
        box-shadow:0 3px 10px rgba(0,0,0,.5);
      }
      .mh-editor-banner.show{ display:flex; }
      .mh-editor-banner button{
        border:none; background:rgba(255,255,255,.12); color:#ffe9ad;
        font-size:11px; font-weight:800; padding:3px 8px; border-radius:999px; cursor:pointer;
      }
      .mh-editor-selected{ outline:2px dashed #ffd75e !important; outline-offset:2px !important; }
      /* 🩹 Antes ocupaba casi toda la pantalla (ancho completo + hasta
         60vh de alto) y no dejaba ver lo que estabas editando. Ahora es
         un panel chico, fijo en una esquina, que no tapa el resto. */
      .mh-editor-toolbar{
        position:fixed; right:6px; bottom:6px; z-index:99992;
        width:172px; background:rgba(15,12,3,.97); border:1px solid #ffd75e; border-radius:10px;
        padding:6px; box-sizing:border-box; color:#ffe9ad;
        box-shadow:0 4px 14px rgba(0,0,0,.6); display:none;
        max-height:44vh; overflow-y:auto;
      }
      .mh-editor-toolbar.show{ display:block; }
      .mh-editor-toolbar.minimized{ width:auto; max-height:none; padding:0; }
      .mh-editor-toolbar.minimized .mh-et-body{ display:none; }
      .mh-editor-toolbar .mh-et-head{ display:flex; align-items:center; justify-content:space-between; gap:4px; margin-bottom:4px; }
      .mh-editor-toolbar.minimized .mh-et-head{ margin-bottom:0; padding:6px 8px; }
      .mh-editor-toolbar .mh-et-title{ font-size:9px; font-weight:800; opacity:.75; word-break:break-all; line-height:1.2; flex:1; }
      .mh-editor-toolbar .mh-et-min-btn{
        flex-shrink:0; border:none; background:rgba(255,255,255,.12); color:#ffe9ad;
        width:18px; height:18px; border-radius:5px; font-size:11px; line-height:1; cursor:pointer;
      }
      .mh-editor-toolbar .mh-et-row{ display:flex; align-items:center; gap:3px; margin-bottom:4px; }
      .mh-editor-toolbar .mh-et-label{ font-size:9px; font-weight:700; width:28px; flex-shrink:0; }
      .mh-editor-toolbar button.mh-et-btn{
        flex:1; border:none; border-radius:6px; padding:5px 0; font-size:11px; font-weight:900;
        background:linear-gradient(180deg,#3a3010,#1c1804); color:#ffd75e; cursor:pointer;
      }
      .mh-editor-toolbar button.mh-et-btn:active{ background:linear-gradient(180deg,#ffe58a,#d29922); color:#2a1c00; }
      .mh-editor-toolbar .mh-et-readout{ font-size:8.5px; opacity:.7; text-align:right; flex:0 0 auto; width:38px; }
      .mh-editor-toolbar .mh-et-steps{ display:flex; gap:2px; margin-bottom:4px; }
      .mh-editor-toolbar .mh-et-step{
        flex:1; border:1px solid rgba(255,215,94,.4); background:transparent; color:#ffe9ad;
        border-radius:5px; padding:3px 0; font-size:8.5px; font-weight:800; cursor:pointer;
      }
      .mh-editor-toolbar .mh-et-step.active{ background:#ffd75e; color:#2a1c00; border-color:#ffd75e; }
      .mh-editor-toolbar .mh-et-actions{ display:flex; gap:3px; margin-top:4px; }
      .mh-editor-toolbar .mh-et-actions button{
        flex:1; border:none; border-radius:6px; padding:6px 0; font-size:9px; font-weight:800; cursor:pointer;
      }
      .mh-editor-toolbar .mh-et-reset{ background:#5b2222; color:#ffd8d8; }
      .mh-editor-toolbar .mh-et-close{ background:#234a2c; color:#d8ffe0; }
    `;
    const styleTag = document.createElement('style');
    styleTag.textContent = css;
    document.head.appendChild(styleTag);

    // 🩹 Ahora que tenemos el index.html real: ya existen funciones
    // globales de Firestore (fsGet/fsSet/waitForFirebase) — así que en
    // vez de guardar el diseño SOLO en este celular, se sube también a
    // la nube (colección "config", documento "layoutOverrides"), igual
    // que el resto de la configuración del admin (config/main,
    // config/admin). Así, una vez que ajustás algo, lo ven TODOS los
    // jugadores, no solo vos. Se guarda en localStorage además como
    // respaldo rápido (por si no hay conexión en ese momento).
    let layoutCache = null;

    function localLoad() {
      try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch (e) { return {}; }
    }
    function localSave(data) {
      try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch (e) {}
    }
    async function cloudLoad() {
      try {
        if (typeof waitForFirebase === 'function') await waitForFirebase();
        if (typeof fsGet !== 'function') return null;
        const doc = await fsGet('config', 'layoutOverrides');
        return (doc && doc.data) ? doc.data : null;
      } catch (e) { return null; }
    }
    async function cloudSave(data) {
      try {
        if (typeof fsSet !== 'function') return;
        await fsSet('config', 'layoutOverrides', { data: data, updatedAt: Date.now() });
      } catch (e) {}
    }
    function loadAll() {
      if (layoutCache) return layoutCache;
      layoutCache = localLoad();
      return layoutCache;
    }
    function saveAll(data) {
      layoutCache = data;
      localSave(data);
      cloudSave(data);
    }
    async function initLayoutFromCloud() {
      const cloud = await cloudLoad();
      if (cloud) {
        layoutCache = cloud;
        localSave(cloud);
        reapplyForCurrentScreen();
      }
    }
    window._mhInitLayoutFromCloud = initLayoutFromCloud;

    function currentScreenKey() {
      const el = document.querySelector('[id$="-screen"].active');
      return (el && el.id) || 'global';
    }
    function screenScopeEl() {
      return document.querySelector('[id$="-screen"].active') || document.body;
    }

    // Genera una "ruta" razonablemente estable para un elemento dentro de
    // su pantalla (tag + clases fijas + posición entre hermanos del mismo
    // tag), ignorando clases que cambian solas (active, marked, called,
    // show, warn, nuestras propias mh-editor-*, etc.) para no perder el
    // rastro del bloque de un toque al otro.
    const VOLATILE_CLASSES = ['active', 'marked', 'free', 'called', 'show', 'warn', 'flash-new', 'is-ready', 'mh-called-num'];
    function stableClassList(node) {
      if (!node.className || typeof node.className !== 'string') return '';
      return node.className.split(/\s+/)
        .filter(c => c && !c.startsWith('mh-editor') && !VOLATILE_CLASSES.includes(c))
        .sort().join('.');
    }
    function elementKey(el) {
      const scopeEl = screenScopeEl();
      let node = el;
      const parts = [];
      let guard = 0;
      while (node && node !== scopeEl && node.parentElement && guard < 30) {
        guard++;
        const tag = node.tagName.toLowerCase();
        const cls = stableClassList(node);
        const siblings = Array.from(node.parentElement.children).filter(s => s.tagName === node.tagName);
        const idx = siblings.indexOf(node);
        parts.unshift(tag + (cls ? '.' + cls : '') + '@' + idx);
        node = node.parentElement;
      }
      return parts.join('>');
    }
    function findByKey(key) {
      const scopeEl = screenScopeEl();
      if (!key) return null;
      const parts = key.split('>');
      let node = scopeEl;
      for (const part of parts) {
        const atIdx = part.lastIndexOf('@');
        if (atIdx < 0) return null;
        const sel = part.slice(0, atIdx);
        const idx = parseInt(part.slice(atIdx + 1), 10);
        const tag = sel.split('.')[0];
        const siblings = Array.from(node.children).filter(s => s.tagName.toLowerCase() === tag);
        if (!siblings[idx]) return null;
        node = siblings[idx];
      }
      return node;
    }

    function applyOverride(el, ov) {
      if (!el || !ov) return;
      const vw = window.innerWidth, vh = window.innerHeight;
      const dx = ((ov.dxPct || 0) / 100) * vw;
      const dy = ((ov.dyPct || 0) / 100) * vh;
      el.style.setProperty('transform', 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)', 'important');
      if (ov.wPct) el.style.setProperty('width', (ov.wPct / 100 * vw).toFixed(1) + 'px', 'important');
      if (ov.hPct) el.style.setProperty('height', (ov.hPct / 100 * vh).toFixed(1) + 'px', 'important');
      el.classList.add('mh-editor-has-override');
    }

    function reapplyForCurrentScreen() {
      const all = loadAll();
      const screenKey = currentScreenKey();
      const screenData = all[screenKey];
      if (!screenData) return;
      Object.keys(screenData).forEach((key) => {
        const el = findByKey(key);
        if (el) applyOverride(el, screenData[key]);
      });
    }

    // 🩹 "Solo se queda en login" — el botón de activar edición cerraba
    // el panel llamando a closeAdminPanel(), pero esa función de tu app
    // NO es un simple "cerrar este cartel": además te desloguea del todo
    // (isAdmin=false, currentUser=null, state=null) y te tira siempre al
    // login-screen, sea cual sea la pantalla en la que estabas antes de
    // entrar al admin. Por eso quedabas atascado ahí. Ahora se guarda en
    // qué pantalla/sesión estabas ANTES de abrir el admin (openAdminPanel
    // pisa currentUser/isAdmin con los valores del admin), y al activar
    // el editor se restaura exactamente eso — sin cerrar sesión.
    if (typeof window.openAdminPanel === 'function' && !window._mhAdminOpenWired) {
      window._mhAdminOpenWired = true;
      const originalOpenAdminPanel = window.openAdminPanel;
      window.openAdminPanel = function () {
        const activeScreen = document.querySelector('.screen.active');
        window._mhPrevScreenId = (activeScreen && activeScreen.id) || 'main-screen';
        window._mhPrevCurrentUser = (typeof currentUser !== 'undefined') ? currentUser : null;
        window._mhPrevIsAdmin = (typeof isAdmin !== 'undefined') ? isAdmin : false;
        return originalOpenAdminPanel.apply(this, arguments);
      };
    }
    function returnFromAdminWithoutLogout() {
      try {
        if (typeof currentUser !== 'undefined') currentUser = window._mhPrevCurrentUser;
        if (typeof isAdmin !== 'undefined') isAdmin = !!window._mhPrevIsAdmin;
        const target = window._mhPrevScreenId || 'main-screen';
        if (typeof goToScreen === 'function' && document.getElementById(target)) {
          goToScreen(target, true);
        } else {
          document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
          const el = document.getElementById(target);
          if (el) el.classList.add('active');
        }
        // openAdminPanel oculta la barra inferior a mano — goToScreen no la
        // vuelve a mostrar, así que se restaura acá.
        const bottomNav = document.getElementById('bottom-nav');
        if (bottomNav) bottomNav.style.display = 'flex';
      } catch (e) {}
    }

    // -------- UI --------
    // El punto de entrada ahora es una pestaña nueva DENTRO de tu panel de
    // administrador real (.admin-tabs / .admin-body), no un botón aparte
    // — así usa la misma contraseña/candado que ya tiene tu panel, sin
    // inventar un acceso paralelo.
    function injectAdminEditorTab() {
      if (window._mhEditorAdminTabWired) return;
      const tabsWrap = document.querySelector('#admin-screen .admin-tabs');
      const bodyWrap = document.querySelector('#admin-screen .admin-body');
      if (!tabsWrap || !bodyWrap) return;
      window._mhEditorAdminTabWired = true;

      const tabBtn = document.createElement('div');
      tabBtn.className = 'admin-tab';
      tabBtn.dataset.tab = 'editor';
      tabBtn.textContent = '🛠️ Editor';
      tabBtn.onclick = function () { switchAdminTab('editor', tabBtn); };
      tabsWrap.appendChild(tabBtn);

      const section = document.createElement('div');
      section.className = 'admin-section';
      section.id = 'admin-editor';
      section.innerHTML = `
        <div class="admin-group">
          <div class="admin-group-title">🛠️ Editor de Pantalla</div>
          <div class="mh-editor-admin-note">
            Movés y achicás/agrandás cualquier bloque de cualquier pantalla
            de la app (juego, mascotas, tienda, etc.) a mano. Se guarda en
            porcentaje de pantalla y se sube a la nube — se aplica para
            todos los jugadores, no solo en este celular.
            <br><br>
            💡 Atajo: mantené apretado el botón 🔧 (donde sea que aparezca)
            para activar el editor DIRECTO en esa misma pantalla, sin
            pasar por acá.
          </div>
          <button type="button" class="mh-editor-admin-btn off" id="mh-editor-toggle-btn">▶️ Activar modo edición</button>
          <div class="mh-editor-admin-note" id="mh-editor-cloud-status">☁️ Estado: cargando…</div>
          <button type="button" class="mh-editor-admin-btn danger" id="mh-editor-reset-screen-btn">🗑️ Borrar ajustes de ESTA pantalla</button>
          <button type="button" class="mh-editor-admin-btn danger" id="mh-editor-reset-all-btn">🗑️ Borrar TODOS los ajustes guardados</button>
        </div>`;
      bodyWrap.appendChild(section);

      section.querySelector('#mh-editor-toggle-btn').addEventListener('click', () => {
        const turningOn = !window._mhEditorModeOn;
        setEditorMode(turningOn);
        if (turningOn) {
          returnFromAdminWithoutLogout();
        }
      });
      section.querySelector('#mh-editor-reset-screen-btn').addEventListener('click', () => {
        const all = loadAll();
        const screenKey = currentScreenKey();
        if (!all[screenKey]) { alert('Esta pantalla no tiene ajustes guardados.'); return; }
        if (!confirm('¿Borrar todos los ajustes guardados de "' + screenKey + '"?')) return;
        delete all[screenKey];
        saveAll(all);
        alert('Listo. Volvé a entrar a esa pantalla para ver los cambios.');
      });
      section.querySelector('#mh-editor-reset-all-btn').addEventListener('click', () => {
        if (!confirm('¿Borrar TODOS los ajustes guardados de TODAS las pantallas? Esto no se puede deshacer.')) return;
        saveAll({});
        alert('Listo, se borró todo.');
      });
    }
    const adminTabInterval = setInterval(() => {
      injectAdminEditorTab();
      if (window._mhEditorAdminTabWired) clearInterval(adminTabInterval);
    }, 1000);
    injectAdminEditorTab();

    const banner = document.createElement('div');
    banner.className = 'mh-editor-banner';
    banner.innerHTML = '✏️ Modo edición — tocá un bloque <button id="mh-editor-exit">Salir</button>';
    document.body.appendChild(banner);

    const toolbar = document.createElement('div');
    toolbar.className = 'mh-editor-toolbar';
    toolbar.innerHTML = `
      <div class="mh-et-head">
        <div class="mh-et-title" id="mh-et-title">—</div>
        <button type="button" class="mh-et-min-btn" id="mh-et-min-btn">－</button>
      </div>
      <div class="mh-et-body">
        <div class="mh-et-steps" id="mh-et-steps"></div>
        <div class="mh-et-row">
          <div class="mh-et-label">Mover</div>
          <button class="mh-et-btn" data-act="left">⬅️</button>
          <button class="mh-et-btn" data-act="up">⬆️</button>
          <button class="mh-et-btn" data-act="down">⬇️</button>
          <button class="mh-et-btn" data-act="right">➡️</button>
        </div>
        <div class="mh-et-row">
          <div class="mh-et-label">Ancho</div>
          <button class="mh-et-btn" data-act="w-">－</button>
          <button class="mh-et-btn" data-act="w+">＋</button>
          <div class="mh-et-readout" id="mh-et-w">—</div>
        </div>
        <div class="mh-et-row">
          <div class="mh-et-label">Alto</div>
          <button class="mh-et-btn" data-act="h-">－</button>
          <button class="mh-et-btn" data-act="h+">＋</button>
          <div class="mh-et-readout" id="mh-et-h">—</div>
        </div>
        <div class="mh-et-actions">
          <button class="mh-et-reset" data-act="reset">↩️ Reset</button>
          <button class="mh-et-close" data-act="close">✅ Listo</button>
        </div>
      </div>
    `;
    document.body.appendChild(toolbar);
    toolbar.querySelector('#mh-et-min-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const nowMin = !toolbar.classList.contains('minimized');
      toolbar.classList.toggle('minimized', nowMin);
      toolbar.querySelector('#mh-et-min-btn').textContent = nowMin ? '＋' : '－';
    });
    const stepsWrap = toolbar.querySelector('#mh-et-steps');
    STEP_OPTIONS.forEach((s, i) => {
      const b = document.createElement('button');
      b.className = 'mh-et-step' + (i === 1 ? ' active' : '');
      b.textContent = s + '%';
      b.dataset.step = s;
      b.onclick = () => {
        stepsWrap.querySelectorAll('.mh-et-step').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        window._mhEditorStep = s;
      };
      stepsWrap.appendChild(b);
    });
    window._mhEditorStep = STEP_OPTIONS[1];

    let selectedEl = null;
    let selectedKey = null;

    function currentOverride() {
      const all = loadAll();
      const screenKey = currentScreenKey();
      all[screenKey] = all[screenKey] || {};
      all[screenKey][selectedKey] = all[screenKey][selectedKey] || { dxPct: 0, dyPct: 0, wPct: 0, hPct: 0 };
      return { all, screenKey, ov: all[screenKey][selectedKey] };
    }

    function updateReadout() {
      if (!selectedEl) return;
      const rect = selectedEl.getBoundingClientRect();
      toolbar.querySelector('#mh-et-w').textContent = Math.round(rect.width) + 'px';
      toolbar.querySelector('#mh-et-h').textContent = Math.round(rect.height) + 'px';
    }

    function selectElement(el) {
      if (selectedEl) selectedEl.classList.remove('mh-editor-selected');
      selectedEl = el;
      selectedKey = elementKey(el);
      selectedEl.classList.add('mh-editor-selected');
      const label = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (stableClassList(el) ? '.' + stableClassList(el) : '');
      toolbar.querySelector('#mh-et-title').textContent = label;
      toolbar.classList.add('show');
      toolbar.classList.remove('minimized');
      toolbar.querySelector('#mh-et-min-btn').textContent = '－';
      updateReadout();
    }
    function deselect() {
      if (selectedEl) selectedEl.classList.remove('mh-editor-selected');
      selectedEl = null;
      selectedKey = null;
      toolbar.classList.remove('show');
    }

    toolbar.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-act]');
      if (!btn || !selectedEl) return;
      const act = btn.dataset.act;
      const step = window._mhEditorStep;
      const { all, screenKey, ov } = currentOverride();

      if (act === 'left') ov.dxPct -= step;
      else if (act === 'right') ov.dxPct += step;
      else if (act === 'up') ov.dyPct -= step;
      else if (act === 'down') ov.dyPct += step;
      else if (act === 'w-' || act === 'w+') {
        if (!ov.wPct) ov.wPct = (selectedEl.getBoundingClientRect().width / window.innerWidth) * 100;
        ov.wPct = Math.max(3, ov.wPct + (act === 'w+' ? step : -step));
      } else if (act === 'h-' || act === 'h+') {
        if (!ov.hPct) ov.hPct = (selectedEl.getBoundingClientRect().height / window.innerHeight) * 100;
        ov.hPct = Math.max(3, ov.hPct + (act === 'h+' ? step : -step));
      } else if (act === 'reset') {
        delete all[screenKey][selectedKey];
        selectedEl.style.removeProperty('transform');
        selectedEl.style.removeProperty('width');
        selectedEl.style.removeProperty('height');
        saveAll(all);
        updateReadout();
        return;
      } else if (act === 'close') {
        deselect();
        return;
      }

      saveAll(all);
      applyOverride(selectedEl, ov);
      updateReadout();
    });

    function isEditorOwnElement(el) {
      return !!el.closest('.mh-editor-banner, .mh-editor-toolbar, #admin-editor, #admin-screen');
    }

    // 🩹 "Para qué quiero mover el login" — tocar el fondo vacío de una
    // pantalla (el contenedor grande con clase "screen", o cualquier
    // elemento con id que termine en "-screen") seleccionaba la pantalla
    // ENTERA, algo que nunca tiene sentido mover/achicar. Ahora esos
    // toques se ignoran — solo se puede seleccionar un bloque real de
    // adentro (un cartón, un botón, un panel, etc.).
    function isScreenRoot(el) {
      if (!el) return false;
      if (el.classList && el.classList.contains('screen')) return true;
      if (el.id && el.id.endsWith('-screen')) return true;
      return false;
    }

    document.addEventListener('click', (e) => {
      if (!window._mhEditorModeOn) return;
      if (isEditorOwnElement(e.target)) return;
      if (isScreenRoot(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof showToast === 'function') {
          showToast('👆 Tocá un bloque real (un cartón, un botón, un panel) — no el fondo de la pantalla.');
        }
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      selectElement(e.target);
    }, true);

    function syncAdminToggleBtn() {
      const btn = document.getElementById('mh-editor-toggle-btn');
      if (!btn) return;
      if (window._mhEditorModeOn) {
        btn.textContent = '⏹️ Desactivar modo edición';
        btn.classList.remove('off');
        btn.classList.add('on');
      } else {
        btn.textContent = '▶️ Activar modo edición';
        btn.classList.remove('on');
        btn.classList.add('off');
      }
    }

    function setEditorMode(on) {
      window._mhEditorModeOn = on;
      banner.classList.toggle('show', on);
      if (!on) deselect();
      syncAdminToggleBtn();
    }

    banner.querySelector('#mh-editor-exit').addEventListener('click', () => setEditorMode(false));

    // 🩹 "En todo lados que aparezca el botón administrador, para poder
    // editar en cualquier sitio" — el 🔧 (.admin-fab) es un único botón
    // fijo que aparece en casi todas las pantallas de la app. Ahora,
    // MANTENIÉNDOLO APRETADO (pulsación larga) activa el editor
    // directamente en la pantalla en la que ya estás — sin abrir el
    // panel completo ni navegar a ningún lado. Un toque corto sigue
    // abriendo el panel de administrador normal, como siempre.
    function wireAdminFabLongPress() {
      if (window._mhAdminFabLongPressWired) return;
      const fabBtn = document.querySelector('.admin-fab');
      if (!fabBtn) return;
      window._mhAdminFabLongPressWired = true;

      const LONG_PRESS_MS = 550;
      let pressTimer = null;
      let longPressFired = false;

      function startPress() {
        longPressFired = false;
        pressTimer = setTimeout(async () => {
          longPressFired = true;
          try {
            if (window._mhEditorModeOn) {
              setEditorMode(false);
              return;
            }
            let savedPass = null;
            try {
              savedPass = (typeof getAdminPassword === 'function') ? await getAdminPassword() : null;
            } catch (e) {}
            if (savedPass) {
              const attempt = prompt('🛠️ Editor de pantalla — contraseña de administrador:');
              if (attempt !== savedPass) return;
            }
            setEditorMode(true);
            if (typeof showToast === 'function') {
              showToast('🛠️ Editor activado en esta pantalla — tocá un bloque.');
            }
          } catch (e) {}
        }, LONG_PRESS_MS);
      }
      function cancelPress() {
        if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
      }

      fabBtn.addEventListener('pointerdown', startPress);
      fabBtn.addEventListener('pointerup', cancelPress);
      fabBtn.addEventListener('pointerleave', cancelPress);
      fabBtn.addEventListener('pointercancel', cancelPress);
      // Si fue pulsación larga, se bloquea el tap normal (que abriría el
      // modal real de admin) para que no se disparen los dos a la vez.
      fabBtn.addEventListener('click', (e) => {
        if (longPressFired) {
          e.preventDefault();
          e.stopImmediatePropagation();
          longPressFired = false;
        }
      }, true);
    }
    const adminFabInterval = setInterval(() => {
      wireAdminFabLongPress();
      if (window._mhAdminFabLongPressWired) clearInterval(adminFabInterval);
    }, 800);
    wireAdminFabLongPress();

    setInterval(reapplyForCurrentScreen, 700);
    const screenObserver = new MutationObserver((mutations) => {
      const relevant = mutations.some(m => m.target && m.target.id && m.target.id.endsWith('-screen'));
      if (relevant) setTimeout(reapplyForCurrentScreen, 30);
    });
    document.querySelectorAll('[id$="-screen"]').forEach(s => {
      screenObserver.observe(s, { attributes: true, attributeFilter: ['class'] });
    });
    reapplyForCurrentScreen();
    // Trae lo que ya esté guardado en la nube (si otro dispositivo ya
    // ajustó algo, o vos mismo desde otra sesión) y lo aplica encima de
    // lo local apenas esté disponible, y actualiza el texto de estado en
    // la pestaña del admin.
    initLayoutFromCloud().then(() => {
      const statusEl = document.getElementById('mh-editor-cloud-status');
      if (statusEl) statusEl.textContent = '☁️ Estado: sincronizado con la nube';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLayoutEditor);
  } else {
    setupLayoutEditor();
  }
  setTimeout(setupLayoutEditor, 800);
})();
