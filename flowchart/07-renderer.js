/*************************************************************************/

class Renderer{
  constructor(canvas, engine){
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.engine = engine;
    this.selectedId = null;
  }

  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.textAlign = "start";
    ctx.font = textFont;
    ctx.fillStyle = '#aaa';
    ctx.fillText('Picuino Pneumatic Simulator v' + programVersion, 8, 18);
    this.drawPosition(mousePosition);

    for (const comp of this.engine.components) {
      comp.draw(ctx);
    }
  }

  drawPosition(position) {
    const ctx = this.ctx;
    if (this.engine.haveTeacherComp()) {
      ctx.fillStyle = '#fff';
    }
    else {
      ctx.fillStyle = '#afa';
    }
    ctx.fillRect(this.canvas.width*0.5-76, 5, 76, 18);
    if (position !== null) {
      ctx.textAlign = 'center';
      ctx.font = textFont;
      ctx.fillStyle = '#aaa';
      ctx.fillText(Math.round(position.x) + ',' + Math.round(position.y),
                   this.canvas.width*0.5-38, 18);
      ctx.textAlign = 'left';
    }
  }
}