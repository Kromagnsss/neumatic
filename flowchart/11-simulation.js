

/************************ SIMULATION ************************/

function simulationInit() {
  drawMode = null;
  engine.createNodes();
  animationID = requestAnimationFrame(simulationRender);
  simulationActive = true;
}

function simulationStep() {
  drawMode = null;
  stepTime = 250;

  if (simulationActive !== true) {
    simulationInit();
  }
  if (animationID === null) {
    animationID = requestAnimationFrame(simulationRender);
  }
}

function simulationStop() {
  drawMode = null;
  simulationActive = false;
  if (animationID !== null) {
    cancelAnimationFrame(animationID);
    animationID = null;
  }
}

function simulationContinue() {
  drawMode = null;
  simulationActive = true;
  if (animationID === null) {
    animationID = requestAnimationFrame(simulationRender);
  }
}

function simulationReset() {
  simulationStop();
  for (const comp of engine.components) {
    comp.reset();
  }
  engine.createNodes();
  renderer.draw();
}


function simulationRender(ms) {
  if (ms - simulationTime > 50) {
    simulationTime = ms - 50;
  }

  animationTime = ms - simulationTime;
  const init = performance.now();

  // Ejecutar tantos pasos de 1 ms como quepan en el tiempo acumulado
  while (simulationTime < ms) {
    engine.render(0.001);
    simulationTime += 1;
    if (stepTime && stepTime > 0)
      stepTime -= 1;
  }

  if (stepTime === 0) {
    stepTime = null;
    animationID = null;
  }

  // Aquí solo dibujas el estado actual (una vez por frame)
  if (simulationActive) {
    renderer.draw();
  }

  renderTime = 100*(performance.now() - init)/animationTime;
  animationLoad = animationLoad * 0.95 + renderTime * 0.05;

  if (animationID && simulationActive) {
    requestAnimationFrame(simulationRender);
  }
}
let animationLoad = 0;
let animationID = null;
let simulationTime = 0;
let animationTime = 0;
let accumulator = 0;

