
/************************ FILE OPERATIONS ************************/

function swapScreen() {
  const elem = document.documentElement;
  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }
  }
}

function aboutWindowShow() {
  const aboutWindow = document.getElementById('aboutWindow');
  const aboutWindowTitle = document.querySelector('#aboutWindow h2');

  console.log('Picuino Pneumatic Simulator v' + programVersion);
  console.log('Copyright © 2025 Carlos Félix Pardo Martín.');
  aboutWindowTitle.innerHTML = 'Picuino Pneumatic Simulator v' + programVersion;
  aboutWindow.showModal();
}

function resetEditor() {
   engine.reset();
   renderer.draw();
}

function loadSchema(schematicJSON) {
  if (!schematicJSON) return;
  const data = JSON.parse(schematicJSON);
  const header = data.slice(0, 1)[0];
  const schematic = data.slice(1, -1);
  const footer = data.slice(-1)[0];
  const hashData = cyrb53(JSON.stringify(data.slice(0, -1)));
  if (footer.hash !== hashData) {
     console.log('Corrupted file!');
     return;
  }

  let components = [];
  for (const comp of schematic) {
    newcomp = null;
    if (comp.type === 'Compressor') newcomp = new Compressor({x:comp.x, y:comp.y});
    if (comp.type === 'Manometer')  newcomp = new Manometer({x:comp.x, y:comp.y});
    if (comp.type === 'Escape')     newcomp = new Escape({x:comp.x, y:comp.y});
    if (comp.type === 'Cylinder1')  newcomp = new Cylinder1({x:comp.x, y:comp.y});
    if (comp.type === 'Cylinder1Out') newcomp = new Cylinder1Out({x:comp.x, y:comp.y});
    if (comp.type === 'Cylinder2')  newcomp = new Cylinder2({x:comp.x, y:comp.y});
    if (comp.type === 'Valve22m')   newcomp = new Valve22m({x:comp.x, y:comp.y});
    if (comp.type === 'Valve32b')   newcomp = new Valve32b({x:comp.x, y:comp.y});
    if (comp.type === 'Valve32m')   newcomp = new Valve32m({x:comp.x, y:comp.y});
    if (comp.type === 'Valve32p')   newcomp = new Valve32p({x:comp.x, y:comp.y});
    if (comp.type === 'Valve32ps')  newcomp = new Valve32ps({x:comp.x, y:comp.y});
    if (comp.type === 'Valve42m')   newcomp = new Valve42m({x:comp.x, y:comp.y});
    if (comp.type === 'Valve52m')   newcomp = new Valve52m({x:comp.x, y:comp.y});
    if (comp.type === 'Valve52p')   newcomp = new Valve52p({x:comp.x, y:comp.y});
    if (comp.type === 'ValveFlow')  newcomp = new ValveFlow({x:comp.x, y:comp.y});
    if (comp.type === 'PressureReducer') newcomp = new PressureReducer({x:comp.x, y:comp.y});
    if (comp.type === 'BackPressureRegulator') newcomp = new BackPressureRegulator({x:comp.x, y:comp.y});
    if (comp.type === 'PneumaticFilter') newcomp = new PneumaticFilter({x:comp.x, y:comp.y});
    if (comp.type === 'TestPort') newcomp = new TestPort({x:comp.x, y:comp.y});
    if (comp.type === 'VisualIndicator') newcomp = new VisualIndicator({x:comp.x, y:comp.y});
    if (comp.type === 'AirTank') newcomp = new AirTank({x:comp.x, y:comp.y});
    if (comp.type === 'ValveOr')    newcomp = new ValveOr({x:comp.x, y:comp.y});
    if (comp.type === 'ValveAnd')   newcomp = new ValveAnd({x:comp.x, y:comp.y});
    if (comp.type === 'Text')       newcomp = new Text({x:comp.x, y:comp.y});
    if (comp.type === 'Valve32r')   newcomp = new Valve32r({x:comp.x, y:comp.y});
    if (comp.type === 'Roller')     newcomp = new Roller({x:comp.x, y:comp.y});
    if (comp.type === 'ValveNret')     newcomp = new ValveNret({x:comp.x, y:comp.y});
    if (comp.type === 'Pipe')       newcomp = new Pipe(comp.init, comp.end);
    if (newcomp) {
      Object.assign(newcomp.options, comp.options);
      newcomp.validateOptions();
      newcomp.timestamp = comp.stamp;
      components.push(newcomp);
    }
  }
  return components;
}


async function openSchema() {
  let schematic = null;
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    const schematic = await file.text();
    components = loadSchema(schematic);
    if (components) {
      engine.components = components;
      engine.createNodes();
      renderer.draw();
    }
  };
  input.click();
  engine.createNodes();
}


async function openFile(filename) {
  try {
    const answer = await fetch(filename);

    if (!answer.ok) {
      throw new Error("Could not read the file");
    }
    const schematic = await answer.text();
    components = loadSchema(schematic);
    if (components) {
      engine.components = components;
      engine.createNodes();
      renderer.draw();
    }
  } catch (error) {
    console.error("Error:", error);
  }
}


async function savePNG(filename = "image.png") {
  renderer.draw();

  const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
  if (!blob) {
    console.error("Error generating PNG image.");
    return;
  }
  
  if ("showSaveFilePicker" in window) {
    // Chrome / Edge
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{description: "PNG", accept: {"image/png": [".png"]}}]
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    }
    catch (err) {
      if (err.name === "AbortError")
        return;
      console.error(err);
    }
  }
  else {
    // Firefox
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }
}


function saveSchema(rol) {
  let schematic = [{
    type: 'Schematic',
    program: 'Picuino Pneumatic Simulator',
    version: programVersion,
  }];
  for (const comp of engine.components) {
    let data = comp.serialize();
    if (rol === 'teacher') {
      data.stamp = '1000000000';
    }
    schematic.push(data);
  }
  schematicJSON = JSON.stringify(schematic);
  const hash = cyrb53(schematicJSON);
  schematic.push({type:'hash', hash});
  schematicJSONHash = JSON.stringify(schematic);
  const blob = new Blob([schematicJSONHash], { type: 'text/plain;charset=utf-8' });
  saveJSON(blob);
}


async function saveJSON(blob, filename = 'neumatic.txt') {
  if ("showSaveFilePicker" in window) {
    // Chrome / Edge
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{description: "Text", accept: {"text/plain": [".txt"]}}]
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    }
    catch (err) {
      if (err.name === "AbortError")
        return;
      console.error(err);
    }
  }
  else {
    // Firefox
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }
}
