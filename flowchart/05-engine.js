/*************************************************************************/

class Engine {

  constructor() {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.components = [];
    this.nodes = [];
  }

  render(dt) {
    for (const comp of this.components) {
      comp.update(this.ctx, this, dt);
    }
  }

  createNodes() {
    this.nodes = [];
    for (const comp of this.components) {
      for (const pos of comp.vias()) {
        if (this.findNode(pos) === null) {
          const newnode = new Node(pos);
          this.nodes.push(newnode);
        }
      }
    }
  }

  findNode(pos) {
    for (const node of this.nodes) {
      if ((node.x === pos.x) && (node.y === pos.y)) {
        return node;
      }
    }
    return null;
  }

  haveTeacherComp() {
    for (const comp of this.components) {
      if (parseInt(comp.timestamp, 16) <= minTimestamp) {
        return true;
      }
    }
    return false;
  }

  addComponent(comp){
    this.components.push(comp);
  }

  deleteComponent(comp) {
    const index = this.components.indexOf(comp);
    this.components.splice(index, 1);
  }

  reset() {
    this.components = [];
  }

  step(){
  }
}