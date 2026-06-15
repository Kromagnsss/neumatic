/************************ MAIN ************************/
const aboutWindowClose = document.getElementById('aboutCloseBtn');
const textPrompt = document.getElementById('textPrompt');
const textInput = document.getElementById('textInput');
const messageInput = document.getElementById('messageInput');

const engine = new Engine();
const renderer = new Renderer(canvas, engine);
const ui = new UIController(canvas, engine, renderer);
let last = performance.now();


function firstSetupApp() {
  ui._resizeCanvas();
  navigatorLang();

  let config = query_read();
  for(let i = 0; i < config.length; i++) {
    let line = config[i];
    if (line.length === 2 && line[0] === 'loadFile') {
      openFile('./' + line[1]);
    }
  }
}


firstSetupApp();

aboutWindowClose.onclick = () => aboutWindow.close();


function snap(v, gr=grid) {
  return Math.round(v/gr)*gr;
}


function textPromptAssign(key, message) {
  textPromptDialog(componentEdit.options[key], message);

  textPrompt.addEventListener('close', () => {
    if (textPrompt.returnValue !== 'cancel' && componentEdit) {
      const text = textInput.value.trim();
      if (text.length > 0) {
        componentEdit.options[key] = text;
        componentEdit.validateOptions();
      }
      componentEdit = null;
      renderer.draw();
    }
  }, { once: true });
}


function textPromptDialog(content='Text', message='Value:') {
  textInput.value = content;
  messageInput.innerText = message;
  textPrompt.showModal();
}


// Read query string from URL
function query_read() {
  var url = document.location.href.split('?');
  if (url.length < 2)
    return [];
  var values = url[1].split('&');
  var vars = [];
  for(i=0; i<values.length; i++) {
    var value = values[i].split('=');
    if (value.length != 2) continue;
    vars.push(value);
  }
  return vars;
}

// Confirm close window
function closeConfirm() {
  return translations[globalLang]['closeConfirm'];
}
