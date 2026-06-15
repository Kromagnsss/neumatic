/*************************  MENU  *************************/
document.addEventListener("click", (e) => {
  const trigger = e.target.closest(".menu-titulo, .has-submenu > a");

  // Click out of menu? close all
  if (!trigger) {
    document.querySelectorAll(".submenu").forEach(sm =>
      sm.classList.remove("active")
    );
    return;
  }

  const submenu = trigger.nextElementSibling;
  if (!submenu || !submenu.classList.contains("submenu")) return;

  // Cerrar submenús hermanos
  const siblings = trigger.parentElement.parentElement
    .querySelectorAll(":scope > li > .submenu");

  siblings.forEach(sm => {
    if (sm !== submenu) sm.classList.remove("active");
  });

  submenu.classList.toggle("active");
});


/* menu actions */
document.addEventListener("click", (e) => {
  const item = e.target.closest("a[data-action]");
  if (!item) return;

  const action = item.dataset.action;

  const actions = {
    fSwap: () => { swapScreen() },
    fNew: () => { resetEditor() },
    fOpen: () => { openSchema(); },
    fSaveStudent: () => { saveSchema('student'); },
    fSaveTeacher: () => { saveSchema('teacher'); },
    fSavePNG: () => { savePNG(); },
    fCompare: () => { compareFilesShow(); },
    enLang: () => { enLang(); },
    esLang: () => { esLang(); },
    fAbout: () => { aboutWindowShow(); },

    cPipe: () =>      { simulationStop(); drawMode='component'; componentType='Pipe'; },
    cPress: () =>     { simulationStop(); drawMode='component'; componentType='Compressor'; },
    cManometer: () => { simulationStop(); drawMode='component'; componentType='Manometer'; },
    cEscape: () =>    { simulationStop(); drawMode='component'; componentType='Escape'; },
    cText: () =>      { simulationStop(); drawMode='component'; componentType='Text'; },
    cValve22m: () =>  { simulationStop(); drawMode='component'; componentType='Valve22m'; },
    cValve32b: () =>  { simulationStop(); drawMode='component'; componentType='Valve32b'; },
    cValve32m: () =>  { simulationStop(); drawMode='component'; componentType='Valve32m'; },
    cValve32r: () =>  { simulationStop(); drawMode='component'; componentType='Valve32r'; },
    cRoller: () =>    { simulationStop(); drawMode='component'; componentType='Roller'; },
    cValve32p: () =>  { simulationStop(); drawMode='component'; componentType='Valve32p'; },
    cValve42m: () =>  { simulationStop(); drawMode='component'; componentType='Valve42m'; },
    cValve52m: () =>  { simulationStop(); drawMode='component'; componentType='Valve52m'; },
    cValve52p: () =>  { simulationStop(); drawMode='component'; componentType='Valve52p'; },
    cValveOr: () =>   { simulationStop(); drawMode='component'; componentType='ValveOr'; },
    cValveAnd: () =>  { simulationStop(); drawMode='component'; componentType='ValveAnd'; },
    cValveNret: () => { simulationStop(); drawMode='component'; componentType='ValveNret'; },
    cValveFlow: () => { simulationStop(); drawMode='component'; componentType='ValveFlow'; },
    cCylinder1: () => { simulationStop(); drawMode='component'; componentType='Cylinder1'; },
    cCylinder2: () => { simulationStop(); drawMode='component'; componentType='Cylinder2'; },

    eDelete: () => { simulationStop(); drawMode='Delete'; },
    eMove: () => { simulationStop(); drawMode='Move'; },
    eOptions: () => { simulationStop(); drawMode='Options'; },
    eFlip: () => { simulationStop(); drawMode='Flip'; },

    sInit: () => { simulationInit(); },
    sStep: () => { simulationStep(); },
    sStop: () => { simulationStop(); },
    sContinue: () => { simulationContinue(); },
    sReset: () => { simulationReset(); },
  };

  actions[action]?.();

  // Close submenus after action
  document.querySelectorAll(".submenu").forEach(sm =>
    sm.classList.remove("active")
  );
});