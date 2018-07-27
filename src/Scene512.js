import Scene from './Scene';

class Scene512 extends Scene {
  static maxComponentTypes_ = 512;

  static equals_(a, b) {
    return a[0] === b[0]
      && a[1] === b[1]
      && a[2] === b[2]
      && a[3] === b[3]
      && a[4] === b[4]
      && a[5] === b[5]
      && a[6] === b[6]
      && a[7] === b[7]
      && a[8] === b[8]
      && a[9] === b[9]
      && a[10] === b[10]
      && a[11] === b[11]
      && a[12] === b[12]
      && a[13] === b[13]
      && a[14] === b[14]
      && a[15] === b[15];
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
      && (~a[7] | b[7]) === -1
      && (~a[8] | b[8]) === -1
      && (~a[9] | b[9]) === -1
      && (~a[10] | b[10]) === -1
      && (~a[11] | b[11]) === -1
      && (~a[12] | b[12]) === -1
      && (~a[13] | b[13]) === -1
      && (~a[14] | b[14]) === -1
      && (~a[15] | b[15]) === -1;
  }
}

export default Scene512;
