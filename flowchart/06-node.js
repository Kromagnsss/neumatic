/*************************************************************************/

class Node {
  constructor(pos) {
    this.volume = 10; // cm3
    this.pressure = airPressure; // bar
    this.mass = this.pressure * this.volume;
    this.x = pos.x;
    this.y = pos.y;
  }

  addAir(q) {
    this.mass += q;
    this.pressure = this.mass / this.volume;
  }
}