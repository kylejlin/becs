import Scene from './Scene';

class Scene64 extends Scene {
  static maxComponentTypes_ = 64;

  static equals_(a, b) {
    return a[0] === b[0]
      && a[1] === b[1];
  }

  // Checks if a ⊆ b
  static subset_(a, b) {
    return (~a[0] | b[0]) === -1
      && (~a[1] | b[1]) === -1;
  }
}

export default Scene64;
