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
    .mh-gear-item{
      padding:14px !important;
      border-radius:18px !important;
      gap:14px !important;
      margin-bottom:12px !important;
      border:1px solid rgba(255,255,255,.08) !important;
      background:rgba(255,255,255,.035) !important;
      flex-wrap:wrap !important;
    }
    .mh-gear-item.on{
      background:rgba(0,255,208,.10) !important;
      border-color:rgba(0,255,208,.45) !important;
      box-shadow:0 0 20px rgba(0,255,208,.18) !important;
    }
    .mh-gear-ic{
      width:52px !important;
      height:52px !important;
      border-radius:14px !important;
      font-size:24px !important;
      background:#0b0f1c !important;
      border:1px solid rgba(255,255,255,.12) !important;
    }
    .mh-gear-name{ font-size:14.5px !important; }
    .mh-gear-bonus{ font-size:11px !important; margin-top:2px !important; }
    .mh-gear-desc{ font-size:10.5px !important; margin-top:1px !important; }
    .mh-gear-switch{ width:54px !important; height:30px !important; }
    .mh-gear-knob{ width:24px !important; height:24px !important; }
    .mh-gear-lvlrow{ width:100%; display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top:8px; padding-top:8px; border-top:1px dashed rgba(255,255,255,.1); }
    .mh-gear-lvlbadge{ font-size:10.5px; font-weight:900; color:#ffd166; background:rgba(255,209,102,.12); border:1px solid rgba(255,209,102,.35); border-radius:8px; padding:2px 7px; }
    .mh-gear-upbtn{ font-size:10.5px; font-weight:900; color:#0c2b02; background:linear-gradient(90deg,#22c55e,#16a34a); border:none; border-radius:9px; padding:6px 12px; cursor:pointer; }
    .mh-gear-upbtn.max{ background:#3a3f4a; color:#9aa3b5; }
    .mh-gear-upcost{ font-size:10px; color:#8b9dc3; }
    .mh-gear-summary{ display:flex; justify-content:space-between; font-size:11px; color:#fff; font-weight:800; margin-top:4px; }
    .mh-gear-setbox{ margin-top:8px; text-align:center; font-size:11px; font-weight:800; padding:8px; border-radius:10px; }
    .mh-gear-setbox.off{ color:#8b9dc3; background:rgba(255,255,255,.04); }
    .mh-gear-setbox.on{ color:#ffd166; background:rgba(255,209,102,.12); border:1px solid rgba(255,209,102,.4); }
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
    const modal = document.createElement('div');
    modal.id = 'mh-gear-upgrade-confirm';
    modal.style.cssText = 'position:fixed;inset:0;z-index:5000;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;padding:16px;';
    modal.innerHTML = `<div style="background:#12151c;border:1px solid #2a2f3a;border-radius:16px;padding:18px;max-width:300px;width:100%;text-align:center;">
        <div style="font-size:14px;font-weight:900;color:#fff;margin-bottom:4px">MEJORA DE BONUS</div>
        <div style="font-size:12px;color:#8b9dc3;margin-bottom:10px">${escapeHtml(MASCOTA_GEAR_DEFS[slot].name)} → Nivel ${nextLvl}</div>
        <div style="font-size:13px;font-weight:800;color:#ffd166;margin-bottom:2px">COSTO: ${cost.gold ? cost.gold.toLocaleString('es') + ' 🪙' : cost.gems + ' 💎'}</div>
        <div style="font-size:10px;color:#8b9dc3;margin-bottom:14px">SE DESCONTARÁ AL CONFIRMAR</div>
        <div style="display:flex;gap:10px;justify-content:center;">
          <button style="flex:1;background:#3a3f4a;color:#fff;font-weight:900;border:none;border-radius:10px;padding:10px 6px;cursor:pointer" onclick="document.getElementById('mh-gear-upgrade-confirm').remove()">CANCELAR</button>
          <button style="flex:1;background:linear-gradient(90deg,#22c55e,#16a34a);color:#0c2b02;font-weight:900;border:none;border-radius:10px;padding:10px 6px;cursor:pointer" onclick="mhDoUpgrade('${id}','${slot}')">CONFIRMAR</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
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
        <div class="mh-sheet-box" style="margin-top:2px">
            <span>ESTADÍSTICAS ACTUALES</span>
            <div class="mh-gear-summary" style="color:#fff"><span>Vida Máx</span><span>${cs.vidaMax.toLocaleString('es')}</span></div>
            <div class="mh-gear-summary" style="color:#8a5cff"><span>Ataque</span><span>${cs.ataque.toLocaleString('es')}</span></div>
            <div class="mh-gear-summary" style="color:#00b4ff"><span>Defensa</span><span>${cs.defensa.toLocaleString('es')}</span></div>
            <div class="mh-gear-summary" style="color:#ffd166;margin-top:8px;padding-top:6px;border-top:1px dashed rgba(255,255,255,.1)"><span>EQUIPADOS</span><span>${equipCount}/5</span></div>
        </div>
        <div class="mh-gear-setbox ${setOn ? 'on' : 'off'}">${setOn ? '⚡ El poder del Rey del Bingo — bonus de set +10% activo' : 'Sin bonus de set (equipá los 5 objetos)'}</div>`;
  };

})();
