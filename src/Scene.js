import UNEXPECTED_ERROR_MESSAGE from './UNEXPECTED_ERROR_MESSAGE';

class Scene {
  constructor() {
    this.entities_ = [];
    this.systems_ = [];
    this.destructorSystems_ = [];
    this.indexes_ = [];

    this.componentNumberDict_ = {};
    this.numberOfRegisteredComponents_ = 0;

    this.globals = {};
  }

  addDestructorSystem(system) {
    const { componentNames, destroy } = system;
    const bitmask = this.getBitmask_(componentNames);
    let index = this.indexes_
      .find(index => this.constructor.equals_(index.bitmask, bitmask));
    if (!index) {
      index = {
        dependents: 0,
        destructors: [],
        bitmask,
        entities: this.entities_
          .filter(entity => this.constructor.subset_(bitmask, entity.bitmask_)),
      };
      this.indexes_.push(index);
    }
    index.dependents++;
    index.destructors.push(destroy);

    this.destructorSystems_.push({
      index,
      destroyRef: destroy,
      sysRef: system,
    });
  }

  addEntity(entity) {
    const bitmask = this.getBitmask_(Object.keys(entity));
    Object.defineProperties(entity, {
      bitmask_: {
        value: bitmask,
        writable: true,
        enumerable: false,
        configurable: false,
      },
      destructors_: {
        value: [],
        writable: false,
        enumerable: false,
        configurable: false,
      },
    });

    this.entities_.push(entity);
    for (const index of this.indexes_) {
      if (this.constructor.subset_(index.bitmask, bitmask)) {
        index.entities.push(entity);
      }
    }
  }

  addSystem(system) {
    const { filters, update } = system;
    const systemIndexes = [];
    for (const componentNames of filters) {
      const bitmask = this.getBitmask_(componentNames);
      let index = this.indexes_
        .find(index => this.constructor.equals_(index.bitmask, bitmask));
      if (!index) {
        index = {
          dependents: 0,
          destructors: [],
          bitmask,
          entities: this.entities_
            .filter(entity => this.constructor.subset_(bitmask, entity.bitmask_)),
        };
        this.indexes_.push(index);
      }
      index.dependents++;
      systemIndexes.push(index);
    }

    // TODO
    this.systems_.push({
      indexes: systemIndexes,
      entityArrays: systemIndexes.map(index => index.entities),
      update,
      rawRef: system,
    });
  }

  removeDestructorSystem(system) {
    const i = this.destructorSystems_
      .findIndex(destructorSystem => destructorSystem.sysRef === system);
    if (i === -1) {
      throw new Error('Destructor system not in scene.');
    }
    const destructorSystem = this.destructorSystems_[i];
    const { index, destroyRef } = destructorSystem;
    const j = index.destructors.indexOf(destroyRef);
    if (j === -1) {
      throw new Error(
        'Could not find destroy function in index. '
        + UNEXPECTED_ERROR_MESSAGE
      );
    }
    index.destructors.splice(j, 1);
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
    this.destructorSystems_.splice(i, 1);
  }

  removeEntity(entity) {
    const i = this.entities_.indexOf(entity);
    if (i === -1) {
      throw new Error('Entity not in system.');
    }
    this.entities_.splice(i, 1);

    for (const index of this.indexes_) {
      const i = index.entities.indexOf(entity);
      if (i !== -1) {
        for (const destroy of index.destructors) {
          destroy(entity, this);
        }
        index.entities.splice(i, 1);
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
    const { indexes } = optimizedSystem;
    for (const index of indexes) {
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
    }
    this.systems_.splice(i, 1);
  }

  update() {
    for (const optimizedSystem of this.systems_) {
      const { entityArrays, update } = optimizedSystem;
      update(entityArrays, this);
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
