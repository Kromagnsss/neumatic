/*************************************************************************/
class ComponentBase {
  constructor(pos){
    this.timestamp = this.timestamp();
    this.x = snap(pos.x);
    this.y = snap(pos.y);
    this.type = 'ComponentBase';
    this.selected = false;
    this.grid = grid;
    this.options = {};
  }

  move(x, y) {
    this.x = snap(x, this.grid);
    this.y = snap(y, this.grid);
  }

  timestamp() {
    const seconds = Math.floor(Date.now()*0.1);
    return seconds.toString(16).toUpperCase();
  }

  near() {
    return null;
  }

  nearPos(a, b) {
    if ((Math.abs(a.x - b.x) <= nearDist) && (Math.abs(a.y - b.y) <= nearDist)) {
       return true;
    }
    else {
      return null;
    }
  }

  nearRect(a_x, a_y, b_x, b_y, pos) {
    const minX = Math.min(a_x, b_x);
    const maxX = Math.max(a_x, b_x);
    const minY = Math.min(a_y, b_y);
    const maxY = Math.max(a_y, b_y);
    if (pos.x >= minX && pos.x <= maxX &&
        pos.y >= minY && pos.y <= maxY) {
      return true;
    }
    return false;
  }

  draw(ctx){
  }

  validateOptions() {
  }

  drawPipe(ctx, color=defaultColor) {
    if (this.selected) color = selectedColor;

    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.fillRect(this.init.x-lineWidth, this.init.y-lineWidth, lineWidth*2, lineWidth*2);
    ctx.fillRect(this.end.x-lineWidth, this.end.y-lineWidth, lineWidth*2, lineWidth*2);
    ctx.moveTo(this.init.x, this.init.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.stroke();
  }

  drawPort(ctx, pos_x, pos_y, size_x, size_y, color=defaultColor) {
    if (this.selected) color = selectedColor;

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(pos_x, pos_y);
    ctx.lineTo(pos_x+size_x, pos_y+size_y);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fillRect(pos_x-lineWidth, pos_y-lineWidth, lineWidth*2, lineWidth*2);
  }

  drawArrow(ctx, init_x, init_y, end_x, end_y, color=defaultColor) {
    const arrowHeadSize = 8;
    const arrowAngle = Math.PI/10;
    const angle = Math.atan2(end_y - init_y, end_x - init_x);

    if (this.selected) color = selectedColor;

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    // Body line
    ctx.beginPath();
    ctx.moveTo(init_x, init_y);
    ctx.lineTo(end_x - arrowHeadSize * Math.cos(angle),
               end_y - arrowHeadSize * Math.sin(angle));
    ctx.stroke();

    // Arrow
    ctx.beginPath();
    ctx.moveTo(end_x, end_y);
    ctx.lineTo(end_x - arrowHeadSize * Math.cos(angle - arrowAngle),
               end_y - arrowHeadSize * Math.sin(angle - arrowAngle));
    ctx.lineTo(end_x - arrowHeadSize * Math.cos(angle + arrowAngle),
               end_y - arrowHeadSize * Math.sin(angle + arrowAngle));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  drawTap(ctx, init_x, init_y, end_x, end_y, color=defaultColor) {
    if (this.selected) color = selectedColor;

    const tapSize = 5;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(init_x, init_y);
    ctx.lineTo(end_x, end_y);
    ctx.moveTo(end_x-tapSize, end_y);
    ctx.lineTo(end_x+tapSize, end_y);
    ctx.stroke();
  }

  drawRectangle(ctx, init_x, init_y, end_x, end_y, color=defaultColor) {
    if (this.selected) color = selectedColor;

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.strokeRect(init_x, init_y, end_x-init_x, end_y-init_y);
    ctx.stroke();
  }

  drawCamera(ctx, init_x, init_y, end_x, end_y, color=defaultColor) {
    if (this.selected) color = selectedColor;

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(end_x, init_y + 10);
    ctx.lineTo(end_x, init_y);
    ctx.lineTo(init_x, init_y);
    ctx.lineTo(init_x, end_y);
    ctx.lineTo(end_x, end_y);
    ctx.lineTo(end_x, end_y - 10);
    ctx.stroke();
  };

  drawSpring(ctx, init_x, init_y, color=defaultColor) {
    if (this.selected) color = selectedColor;

    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(init_x, init_y);
    ctx.lineTo(init_x+5, init_y-10);
    ctx.lineTo(init_x+10, init_y);
    ctx.lineTo(init_x+15, init_y-10);
    ctx.lineTo(init_x+20, init_y);
    ctx.stroke();
  }

  drawPushLever(ctx, init_x, init_y, color=defaultColor) {
    if (this.selected) color = selectedColor;

    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(init_x, init_y);
    ctx.lineTo(init_x-20, init_y);
    ctx.lineTo(init_x-20, init_y-10);
    ctx.lineTo(init_x-13, init_y-10);
    ctx.lineTo(init_x-10, init_y-5);
    ctx.lineTo(init_x-7, init_y-10);
    ctx.lineTo(init_x, init_y-10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(init_x-20, init_y+5);
    ctx.lineTo(init_x-20, init_y-15);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(init_x-10, init_y-15);
    ctx.lineTo(init_x-10, init_y-10);
    ctx.stroke();
  }

  drawPushButton(ctx, init_x, init_y, color=defaultColor) {
    if (this.selected) color = selectedColor;

    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(init_x, init_y);
    ctx.lineTo(init_x-15, init_y);
    ctx.lineTo(init_x-15, init_y-10);
    ctx.lineTo(init_x, init_y-10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(init_x-15, init_y+5);
    ctx.lineTo(init_x-15, init_y-15);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(init_x-15, init_y-5, 10, Math.PI*0.5, Math.PI*1.5);
    ctx.stroke();
  }

  drawPushRoller(ctx, init_x, init_y, color=defaultColor) {
    if (this.selected) color = selectedColor;

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(init_x, init_y-4);
    ctx.lineTo(init_x-12, init_y-4);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(init_x, init_y+4);
    ctx.lineTo(init_x-12, init_y+4);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(init_x-16, init_y, 6, 0, Math.PI*2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(init_x-16, init_y, 1, 0, Math.PI*2);
    ctx.stroke();
  }

  drawPneuLeftPilot(ctx, posX, length, color=defaultColor) {
    if (this.selected) color = selectedColor;

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(posX-44, this.y-20);
    ctx.lineTo(this.x+length, this.y-20);
    ctx.stroke();
    this.drawRectangle(ctx, posX-30, this.y-27, posX-44, this.y-13, color);
    ctx.beginPath();
    ctx.moveTo(posX-44, this.y-27);
    ctx.lineTo(posX-34, this.y-20);
    ctx.lineTo(posX-44, this.y-13);
    ctx.stroke();
  };

  drawPneuRightPilot(ctx, posX, length, color=defaultColor) {
    if (this.selected) color = selectedColor;

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(posX+44, this.y-20);
    ctx.lineTo(this.x+length, this.y-20);
    ctx.stroke();
    this.drawRectangle(ctx, posX+30, this.y-27, posX+44, this.y-13, color);
    ctx.beginPath();
    ctx.moveTo(posX+44, this.y-27);
    ctx.lineTo(posX+34, this.y-20);
    ctx.lineTo(posX+44, this.y-13);
    ctx.stroke();
  }

  update(ctx, engine, dt) {}

  reset () {}

  colorPressure(pressure, bg = 0) {
    if (bg === 0) {
      let cp = 32 + Math.round(223 * Math.sqrt((pressure - airPressure) / (compressorPressure - airPressure)));
      return 'rgb(' + 0 + ',' + 0 + ',' + cp + ')';
    }
    else {
      let cp = 255 - Math.round(192 * ((pressure - airPressure) / (compressorPressure - airPressure)));
      return 'rgb(' + cp + ',' + cp + ',' + 255 + ')';
    }
  }

  computeFlow(node1, node2, conductance, dt) {
    const m1 = node1.mass;
    const m2 = node2.mass;
    const volume1 = node1.volume;
    const volume2 = node2.volume;

    function flow(m1, m2) {
      const dp = m1 / volume1 - m2 / volume2;
      return conductance * Math.sign(dp) * Math.sqrt(Math.abs(dp));
    }

    const q1 = flow(m1, m2);
    const k1_m = dt * q1;

    const q2 = flow(m1 - 0.5*k1_m, m2 + 0.5*k1_m);
    const k2_m = dt * q2;

    const q3 = flow(m1 - 0.5*k2_m, m2 + 0.5*k2_m);
    const k3_m = dt * q3;

    const q4 = flow(m1 - k3_m, m2 + k3_m);
    const k4_m = dt * q4;

    const dm = (k1_m + 2*k2_m + 2*k3_m + k4_m)/6;

    node1.mass -= dm;
    node2.mass += dm;

    node1.pressure = node1.mass / node1.volume;
    node2.pressure = node2.mass / node2.volume;
  }

  serialize() {
    return {type:this.type, stamp:this.timestamp, x:this.x, y:this.y, options:this.options};
  }
}