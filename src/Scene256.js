import UNEXPECTED_ERROR_MESSAGE from './UNEXPECTED_ERROR_MESSAGE';

class Scene256 {
  constructor() {
    this.entities_ = [];
    this.systems_ = [];
    this.indexes_ = [];

    this.componentNumberDict_ = {};
    this.numberOfRegisteredComponents_ = 0;

    this.globals = {};
  }

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

  addEntity(entity) {
    const bitmask = this.getBitmask_(Object.keys(entity));
    Object.defineProperty(entity, 'bitmask_', {
      value: bitmask,
      writable: true,
      enumerable: false,
      configurable: false,
    });

    this.entities_.push(entity);
    for (const index of this.indexes_) {
      if (Scene256.subset_(index.bitmask, bitmask)) {
        index.entities.push(entity);
      }
    }
  }

  addSystem(system) {
    const { componentNames, update } = system;
    const bitmask = this.getBitmask_(componentNames);
    let index = this.indexes_
      .find(index => Scene256.equals_(index.bitmask, bitmask));
    if (!index) {
      index = {
        dependents: 0,
        bitmask,
        entities: this.entities_
          .filter(entity => Scene256.subset_(bitmask, entity.bitmask_)),
      };
      this.indexes_.push(index);
    }
    index.dependents++;
    this.systems_.push({
      index,
      update,
      rawRef: system,
    });
  }

  removeEntity(entity) {
    const arraysToUpdate = this.indexes_
      .map(index => index.entities)
      .concat([this.entities_]);
    for (const array of arraysToUpdate) {
      const i = array.indexOf(entity);
      if (i !== -1) {
        array.splice(i, 1);
      }
    }
  }

  removeEntityByNullification(entity) {
    const arraysToUpdate = this.indexes_
      .map(index => index.entities)
      .concat([this.entities_]);
    for (const array of arraysToUpdate) {
      const i = array.indexOf(entity);
      if (i !== -1) {
        array[i] = null;
      }
    }
  }

  removeSystem(system) {
    const i = this.systems_
      .findIndex(optimizedSystem => optimizedSystem.rawRef === system);
    if (i === -1) {
      throw new Error('System not in scene.');
    }
    const optimizedSystem = this.systems_[i];
    const { index } = optimizedSystem;
    index.dependents--;
    if (index.dependents === 0) {
      const i = this.indexes_.indexOf(index);
      if (i === -1) {
        throw new Error(
          'Could not find index in scene. '
          + UNEXPECTED_ERROR_MESSAGE
        );
      }
      this.indexes_.splice(i, 1);
    }
    this.systems_.splice(i, 1);
  }

  update() {
    for (const optimizedSystem of this.systems_) {
      const { index, update } = optimizedSystem;
      update(index.entities, this);
    }
  }

  getBitmask_(componentNames) {
    const mask = new Int32Array(8);
    for (const componentName of componentNames) {
      const number = this.getComponentNumber_(componentName);
      const quotient = ~~(number / 32);
      const remainder = number % 32;
      mask[quotient] |= (1 << remainder);
    }
    return mask;
  }

  getComponentNumber_(componentName) {
    if (componentName in this.componentNumberDict_) {
      return this.componentNumberDict_[componentName];
    }
    const number = this.numberOfRegisteredComponents_;
    if (number === 256) {
      throw new RangeError('Maximum number of component types (256) reached.');
    }
    this.numberOfRegisteredComponents_++;
    this.componentNumberDict_[componentName] = number;
    return number;
  }
}

export default Scene256;
