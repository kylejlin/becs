import Scene from './Scene';

class Scene128 extends Scene {
  static maxComponentTypes_ = 128;

  static equals_(a, b) {
    return a[0] === b[0]
      && a[1] === b[1]
      && a[2] === b[2]
      && a[3] === b[3];
  }

  // Checks if a ⊆ b
  static subset_(a, b) {
    return (~a[0] | b[0]) === -1
      && (~a[1] | b[1]) === -1
      && (~a[2] | b[2]) === -1
      && (~a[3] | b[3]) === -1;
  }
}

export default Scene128;
