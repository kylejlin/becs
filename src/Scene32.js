import Scene from './Scene';

class Scene32 extends Scene {
  static maxComponentTypes_ = 32;

  static equals_(a, b) {
    return a[0] === b[0];
  }

  // Checks if a ⊆ b
  static subset_(a, b) {
    return (~a[0] | b[0]) === -1;
  }
}

export default Scene32;
