import UNEXPECTED_ERROR_MESSAGE from './UNEXPECTED_ERROR_MESSAGE';

class Scene {
  constructor() {
    this.entities_ = [];
    this.systems_ = [];
    this.indexes_ = [];

    this.componentNumberDict_ = {};
    this.numberOfRegisteredComponents_ = 0;

    this.globals = {};
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
      if (this.constructor.subset_(index.bitmask, bitmask)) {
        index.entities.push(entity);
      }
    }
  }

  addSystem(system) {
    const { componentNames, update } = system;
    const bitmask = this.getBitmask_(componentNames);
    let index = this.indexes_
      .find(index => this.constructor.equals_(index.bitmask, bitmask));
    if (!index) {
      index = {
        dependents: 0,
        bitmask,
        entities: this.entities_
          .filter(entity => this.constructor.subset_(bitmask, entity.bitmask_)),
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
    const mask = new Int32Array(this.constructor.maxComponentTypes_ >> 5);
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
    const maxComponentTypes = this.constructor.maxComponentTypes_;
    if (number === maxComponentTypes) {
      throw new RangeError('Maximum number of component types (' + maxComponentTypes + ') reached.');
    }
    this.numberOfRegisteredComponents_++;
    this.componentNumberDict_[componentName] = number;
    return number;
  }
}

export default Scene;
