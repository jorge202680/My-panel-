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
      background:linear-gradient(160deg,#12232a,#0a1418) !important;
      border:1px solid rgba(0,255,204,.2) !important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.06) !important;
    }
    .mh-gear-name{ font-size:13.5px !important; letter-spacing:.02em !important; }
    .mh-gear-bonus{ font-size:10.5px !important; margin-top:2px !important; font-weight:900 !important; }
    .mh-gear-bonus.on{ color:#5eead4 !important; }
    .mh-gear-desc{ font-size:10px !important; margin-top:1px !important; color:#6b7d8f !important; }
    .mh-gear-switch{ width:48px !important; height:27px !important; }
    .mh-gear-switch.on{ background:linear-gradient(90deg,#22d3ee,#2dd4bf) !important; box-shadow:0 0 12px rgba(45,212,191,.6) !important; }
    .mh-gear-knob{ width:21px !important; height:21px !important; }
    .mh-gear-lvlrow{ width:100%; display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top:8px; padding-top:8px; border-top:1px solid rgba(255,255,255,.06); }
    .mh-gear-lvlbadge{ font-size:10px; font-weight:900; letter-spacing:.08em; color:#9ef3e3; background:rgba(0,255,204,.08); border:1px solid rgba(0,255,204,.25); border-radius:20px; padding:3px 9px; }
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
    .mh-gear-summary{ display:flex; justify-content:space-between; align-items:center; font-size:11px; color:#9ef3e3; font-weight:900; letter-spacing:.06em; margin-top:12px; padding:9px 12px; border-radius:12px; background:rgba(0,255,204,.06); border:1px solid rgba(0,255,204,.18); }
    .mh-gear-setbox{ margin-top:8px; text-align:center; font-size:11px; font-weight:900; padding:9px; border-radius:12px; letter-spacing:.02em; }
    .mh-gear-setbox.off{ color:#6b7d8f; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.06); }
    .mh-gear-setbox.on{ color:#fde68a; background:linear-gradient(90deg,rgba(251,191,36,.12),rgba(249,115,22,.12)); border:1px solid rgba(251,191,36,.4); box-shadow:0 0 16px rgba(251,191,36,.2); }
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  // ---- 2 objetos nuevos, sumados a los 3 que ya existían ----
  if (typeof MASCOTA_GEAR_DEFS !== 'undefined') {
    if (!MASCOTA_GEAR_DEFS.botas) {
      MASCOTA_GEAR_DEFS.botas = { name: 'Botas del Viento', icon: '👢', desc: 'Aumenta la resistencia máxima', stat: 'defensa', pct: 8, bonus: '+8% Defensa' };
    }
    if (!MASCOTA_GEAR_DEFS.corona) {
      MASCOTA_GEAR_DEFS.corona = { name: 'Corona Legendaria', icon: '👑', desc: 'El poder del Rey del Bingo', stat: 'todas', pct: 6, bonus: '+6% Vida/Ataque/Defensa' };
    }
  }

  // Config de niveles: cuánto sube el % por nivel y cuánto cuesta mejorar.
  const GEAR_LVL_CFG = {
    collar:   { maxLvl: 5, pctPerLvl: 5,  costGold: 400, costGems: 0  },
    armadura: { maxLvl: 5, pctPerLvl: 6,  costGold: 500, costGems: 0  },
    amuleto:  { maxLvl: 5, pctPerLvl: 7,  costGold: 600, costGems: 0  },
    botas:    { maxLvl: 5, pctPerLvl: 6,  costGold: 550, costGems: 0  },
    corona:   { maxLvl: 5, pctPerLvl: 8,  costGold: 0,   costGems: 25 },
  };

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
    if (g.botas) defensa += pctOf('botas');
    if (g.corona) { vida += pctOf('corona'); ataque += pctOf('corona'); defensa += pctOf('corona'); }
    // Bonus de set: los 5 objetos equipados a la vez → +10% extra a todo.
    const equipCount = Object.keys(MASCOTA_GEAR_DEFS).filter(s => g[s]).length;
    if (equipCount >= 5) { vida += 0.10; ataque += 0.10; defensa += 0.10; }
    return { vida, ataque, defensa };
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
      const maxed = nivel >= cfg.maxLvl;
      const nextCost = maxed ? null : gearUpgradeCost(slot, nivel + 1);
      return `<div class="mh-gear-item ${on ? 'on' : ''}">
          <div class="mh-gear-ic">${def.icon}</div>
          <div style="flex:1">
              <div class="mh-gear-name">${escapeHtml(def.name)}</div>
              <div class="mh-gear-bonus ${on ? 'on' : 'off'}">+${pctActual}% ${escapeHtml(def.stat === 'todas' ? 'Vida/Ataque/Defensa' : def.stat)}</div>
              <div class="mh-gear-desc">${escapeHtml(def.desc)}</div>
          </div>
          <button onclick="toggleMascotaGear('${mascotaHeroSelectedId}','${slot}')" class="mh-gear-switch ${on ? 'on' : 'off'}"><div class="mh-gear-knob"></div></button>
          <div class="mh-gear-lvlrow">
              <span class="mh-gear-lvlbadge">LVL ${nivel}${maxed ? ' (MÁX)' : '/' + cfg.maxLvl}</span>
              ${maxed
                ? `<button class="mh-gear-upbtn max" disabled>NIVEL MÁXIMO</button>`
                : `<button class="mh-gear-upbtn" onclick="mhConfirmUpgrade('${mascotaHeroSelectedId}','${slot}')">MEJORAR · ${nextCost.gold ? nextCost.gold.toLocaleString('es') + '🪙' : nextCost.gems + '💎'}</button>`}
          </div>
      </div>`;
    }).join('');

    const equipCount = Object.keys(MASCOTA_GEAR_DEFS).filter(s => g[s]).length;
    const setOn = equipCount >= 5;

    box.innerHTML = items + `
        <div class="mh-gear-statgrid">
            <div class="mh-gear-statcard vida">
                <div class="mh-gear-static">❤️</div>
                <div class="mh-gear-statlbl">VIDA</div>
                <div class="mh-gear-statval">${cs.vidaMax.toLocaleString('es')}</div>
            </div>
            <div class="mh-gear-statcard ataque">
                <div class="mh-gear-static">⚔️</div>
                <div class="mh-gear-statlbl">ATAQUE</div>
                <div class="mh-gear-statval">${cs.ataque.toLocaleString('es')}</div>
            </div>
            <div class="mh-gear-statcard defensa">
                <div class="mh-gear-static">🛡️</div>
                <div class="mh-gear-statlbl">DEFENSA</div>
                <div class="mh-gear-statval">${cs.defensa.toLocaleString('es')}</div>
            </div>
        </div>
        <div class="mh-gear-summary"><span>EQUIPADOS</span><span>${equipCount}/5</span></div>
        <div class="mh-gear-setbox ${setOn ? 'on' : 'off'}">${setOn ? '⚡ El poder del Rey del Bingo — bonus de set +10% activo' : 'Sin bonus de set (equipá los 5 objetos)'}</div>`;
  };

})();
