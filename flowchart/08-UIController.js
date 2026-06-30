/*************************************************************************/

class UIController {
  constructor(canvas, engine, renderer) {
    this.canvas = canvas;
    this.engine = engine;
    this.renderer = renderer;
    this.grid = grid;
    this.positionMoveInit = {x:0, y:0};
    this.positionCompInit = {x:0, y:0};

    this.canvas.addEventListener('mousedown', e => this._onDown(e));
    window.addEventListener('mousemove', e => this._onMove(e));
    window.addEventListener('mouseup', e => this._onUp(e));
    window.addEventListener("resize", e => this._resizeCanvas());
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") { this._escape(); }
      if (event.key === "Delete") { this._delete(); }
      if (drawMode === null) {
        if (event.key === 's' || event.key === 'S') { simulationStep(); }
      }
      this.renderer.draw();
    });
  }

  _delete() {
    if ((drawMode === 'Move') && (componentMove)) {
       this.engine.deleteComponent(componentMove);
    }
  }

  _escape() {
    drawMode = null;
    componentMove = null;
    if (editPipe) {
      this.engine.deleteComponent(editPipe)
    }
    editPipe = null;
    pipeMove = null;
    initPos = null;
  }

  _resizeCanvas(e) {
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');
    const width = window.innerWidth*canvasScale;
    const height = (window.innerHeight - 35)*canvasScale ;
    canvas.width  = (width < minCanvasWidth) ? minCanvasWidth : width;
    canvas.height = (height < minCanvasHeight) ? minCanvasHeight : height;
    canvas.style.width = this.canvas.width/canvasScale + 'px';
    canvas.style.height  = this.canvas.height/canvasScale + 'px';
    ctx.scale(canvasScale, canvasScale);
    this.renderer.draw();
  }

  _getMousePos(e) {
    const r = this.canvas.getBoundingClientRect();
    const position = {x:e.clientX - r.left, y:e.clientY - r.top};
    mousePosition = position;
    return position;
  }

  _onDown(e) {
    let position = this._getMousePos(e);

    // Activate manual valves
    for (const comp of this.engine.components) {
      if (['Valve32b', 'Valve32m', 'Valve22m', 'Valve42m', 'Valve52m'].includes(comp.type)
          && comp.nearPushButton(position)) {
        if (comp.active) comp.active = false;
        else comp.active = true;
      }
    }

    // Edit Options component mode
    if (drawMode === 'Options') {
      for (const comp of this.engine.components) {
        if (comp.near(position)) {
          if (comp.type === 'Text') {
            componentEdit = comp;
            textPromptAssign('text', 'Text:');
            break;
          }
          if (comp.type === 'ValveFlow') {
            componentEdit = comp;
            textPromptAssign('conductance', 'Conductance (10-1000):');
            break;
          }
          if (comp.type === 'Compressor') {
            componentEdit = comp;
            textPromptAssign('pressure', 'Pressure (0.5 - ' + compressorPressure + ' bar):');
            break;
          }
          if (['Valve32r', 'Roller'].includes(comp.type)) {
            componentEdit = comp;
            textPromptAssign('reference', 'Reference:');
            break;
          }
          if (['Cylinder1', 'Cylinder2'].includes(comp.type)) {
            componentEdit = comp;
            textPromptAssign('massLoad', 'Mass Load (kg):');
            break;
          }
        }
      }
      this.renderer.draw();
    }

    // Flip component mode
    if (drawMode === 'Flip') {
      for (const comp of this.engine.components) {
        if (comp.near(position)) {
          if (['Manometer', 'ValveNret', 'Valve22m', 'Valve32b',
               'Valve32m', 'Valve32r',  'Valve32p', 'Valve32ps'].includes(comp.type)) {
            comp.flip();
            break;
          }
        }
      }
      this.renderer.draw();
    }


    // Delete component mode
    if (drawMode === 'Delete') {
      let deleteComp = null;
      for (const comp of this.engine.components) {
        if (comp.near(position)) {
          deleteComp = comp;
          break;
        }
      }
      if (deleteComp) {
        this.engine.deleteComponent(deleteComp);
      }
      this.renderer.draw();
    }


    // Draw component mode
    if (drawMode === 'component') {
      let comp = null;
      if (componentType === 'Compressor') comp = new Compressor(position);
      if (componentType === 'Manometer') comp = new Manometer(position);
      if (componentType === 'Escape') comp = new Escape(position);
      if (componentType === 'Text') comp = new Text(position);
      if (componentType === 'Cylinder1') comp = new Cylinder1(position);
      if (componentType === 'Cylinder2') comp = new Cylinder2(position);
      if (componentType === 'Valve22m') comp = new Valve22m(position);
      if (componentType === 'Valve32b') comp = new Valve32b(position);
      if (componentType === 'Valve32m') comp = new Valve32m(position);
      if (componentType === 'Valve32p') comp = new Valve32p(position);
      if (componentType === 'Valve32ps') comp = new Valve32ps(position);
      if (componentType === 'Valve32r') comp = new Valve32r(position);
      if (componentType === 'Roller') comp = new Roller(position);
      if (componentType === 'Valve42m') comp = new Valve42m(position);
      if (componentType === 'Valve52m') comp = new Valve52m(position);
      if (componentType === 'Valve52p') comp = new Valve52p(position);
      if (componentType === 'ValveNret') comp = new ValveNret(position);
      if (componentType === 'ValveFlow') comp = new ValveFlow(position);
      if (componentType === 'ValveOr') comp = new ValveOr(position);
      if (componentType === 'ValveAnd') comp = new ValveAnd(position);

      // Draw Text
      if (componentType === 'Text') {
        componentEdit = comp;
        textPromptAssign('text', 'Text:');
      }
      if (['Valve32r', 'Roller'].includes(componentType)) {
        componentEdit = comp;
        textPromptAssign('reference', 'Reference:');
      }

      // Draw pipe
      if (componentType === 'Pipe') {
        if (initPos === null) {
          initPos = position;
          editPipe = new Pipe(initPos, initPos);
          comp = editPipe;
          editPipe.color = selectedColor;
        }
        else {
          editPipe.moveEnd(position);
          editPipe.color = '#000';
          if (editPipe.init.x === editPipe.end.x &&
              editPipe.init.y === editPipe.end.y) {
            this.engine.deleteComponent(editPipe);
          }
          editPipe = null;
          initPos = null;
        }
      }

      // Add component and redraw
      if (comp !== null) {
        this.engine.addComponent(comp);
      }
      this.renderer.draw();
    }

    // Move component mode
    if (drawMode === 'Move') {
      if (componentMove !== null) {
        componentMove.selected = false;
        if (pipeMove === 'init')
          componentMove.moveInit(position);
        else if (pipeMove === 'end')
          componentMove.moveEnd(position);
        else {
          const x = position.x - this.positionMoveInit.x + this.positionCompInit.x;
          const y = position.y - this.positionMoveInit.y + this.positionCompInit.y;
          componentMove.move(x, y);
          this.positionMoveInit = {x:0, y:0};
          this.positionCompInit = {x:0, y:0};
        }
        componentMove = null;
        pipeMove = null;
      }
      else {
        for (const comp of this.engine.components) {
          const near = comp.near(position);
          if (near) {
            componentMove = comp;
            this.positionMoveInit.x = position.x;
            this.positionMoveInit.y = position.y;
            this.positionCompInit.x = comp.x;
            this.positionCompInit.y = comp.y;
            componentMove.selected = true;
            if (componentMove.type === 'Pipe') {
              pipeMove = near;
            }
            break;
          }
        }
      }
      this.renderer.draw();
    }
    this.renderer.drawPosition(position);
  }

  _onMove(e){
    let position = this._getMousePos(e);

    if ((drawMode === 'component') && (componentType === 'Pipe') && (initPos !== null)) {
      editPipe.moveEnd(position);
      this.renderer.draw();
    }

    if ((drawMode === 'Move') && (componentMove)) {
      if (pipeMove === 'init') {
        componentMove.moveInit(position);
      }
      else if (pipeMove === 'end') {
        componentMove.moveEnd(position);
      }
      else {
        const x = position.x - this.positionMoveInit.x + this.positionCompInit.x;
        const y = position.y - this.positionMoveInit.y + this.positionCompInit.y;
        componentMove.move(x, y);
      }
      this.renderer.draw();
    }
    this.renderer.drawPosition(position);
  }

  _onUp(e){
  }

}
