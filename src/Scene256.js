import Scene from './Scene';

class Scene256 extends Scene {
  static maxComponentTypes_ = 256;
  
  static equals_(a, b) {
    return a[0] === b[0]
      && a[1] === b[1]
      && a[2] === b[2]
      && a[3] === b[3]
      && a[4] === b[4]
      && a[5] === b[5]
      && a[6] === b[6]
      && a[7] === b[7];
  }

  // Checks if a ⊆ b
  static subset_(a, b) {
    return (~a[0] | b[0]) === -1
      && (~a[1] | b[1]) === -1
      && (~a[2] | b[2]) === -1
      && (~a[3] | b[3]) === -1
      && (~a[4] | b[4]) === -1
      && (~a[5] | b[5]) === -1
      && (~a[6] | b[6]) === -1
      && (~a[7] | b[7]) === -1;
  }
}

export default Scene256;
