

/************************ COMPARE FILES ************************/
function compareFilesShow() {
  const compareWindow = document.getElementById('compareWindow');
  const compareWindowTitle = document.querySelector('#compareFiles h2');
  compareWindow.showModal();
}

function compareWindowClose() {
  const compareWindow = document.getElementById('compareWindow');
  compareWindow.close();
}

async function compareWindowReport() {
  const inputFiles = Array.from(document.getElementById('compareFileInput').files);
  const compareResults = document.getElementById('compareResults');

  const jsons = [];
  for (const file of inputFiles) {
    const json = await readJSON(file);
    jsons.push(json);
  }
  reportErrors(inputFiles, jsons);
}

function readJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        // Captura errores de formato JSON
        const data = JSON.parse(reader.result);
        resolve(data);
      } catch (err) {
        resolve([]);
      }
    }
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function testJSON(json) {
  if (json.length === 0)
    return false;
  const footer = json.slice(-1)[0];
  const hashData = cyrb53(JSON.stringify(json.slice(0, -1)));
  if (footer.hash !== hashData) {
    return false;
  }
  return true;
}

function testTeacher(json) {
  if (json.length === 0)
    return 0;
  let comps = 0;
  for(let i = 1; i < json.length-1; i++) {
    if (json[i].stamp <= '1900000000') comps++;
  }
  return comps;
}

function reportErrors(files, jsons) {
  let removeFiles = [];
  let htmlcode = [];
  htmlcode.push('<hr><p><strong>Corrupted files:</strong></p><table>');
  for (let i = 0; i < files.length; i++) {
    const valid = testJSON(jsons[i]);
    if (!valid) {
      htmlcode.push('<tr><td>' + files[i].name + '</td><td>Corrupted file.</td></tr>');
      removeFiles.push(i);
    }
  }
  files = files.filter((_, index) => !removeFiles.includes(index));
  jsons = jsons.filter((_, index) => !removeFiles.includes(index));

  htmlcode.push('</table><p><strong>Teacher files:</strong></p><table>');
  for (let i = 0; i < files.length; i++) {
    const teacherComps = testTeacher(jsons[i]);
    if (teacherComps > 0) {
      htmlcode.push('<tr><td>' + files[i].name + '</td><td>' + teacherComps + '</td><td>Teacher Components inside.</td></tr>');
      removeFiles.push(i);
    }
  }
  //files = files.filter((_, index) => !removeFiles.includes(index));
  //jsons = jsons.filter((_, index) => !removeFiles.includes(index));
  htmlcode.push('</table>');

  database = {};
  for (let i = 0; i < files.length; i++) {
    const json = jsons[i];
    const filename = files[i].name;
    for(let j = 1; j < json.length - 1; j++) {
      const stamp = json[j].stamp + '+' + json[j].type;
      if (!database[stamp]) {
        database[stamp] = [];
      }
      if (!database[stamp].includes(filename)) {
        database[stamp].push(filename);
      }
    }
  }
  htmlcode.push('<p><strong>Shared components:</strong></p><table>');
  const timestamps = Object.keys(database).sort();
  for (let i = 0; i < timestamps.length; i++) {
    if (database[timestamps[i]].length > 1) {
      htmlcode.push('<tr><td>' + timestamps[i] + '</td><td>' + database[timestamps[i]] + '.</td></tr>');
    }
  }
  htmlcode.push('</table><hr>');
  compareResults.innerHTML = htmlcode.join('\n');
  console.log(htmlcode.join('\n'))
}

