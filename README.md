# becs - Bitmasked ECS
A fast and simple ECS library.
Uses bitmasking under the hood for a performance boost.

## Usage
```bash
npm install --save becs
```
```javascript
import {
  System,
  // Choose one from the following
  // depending on the size of your project:
  Scene32,
  Scene64,
  Scene128,
  Scene256,
  Scene512,
  Scene1024,
} from 'becs';
```

## Example
```javascript
import { System, Scene256 } from 'becs';

const scene = new Scene256();
scene.addEntity({
  Position: {
    x: 1,
    y: 2,
    z: 3,
  },
  Velocity: {
    x: 10,
    y: 0,
    z: 0,
  },
});
// Inertia
scene.addSystem(new System(
  ['Position', 'Velocity'],
  (entities, scene) => {
    const { dt } = scene.globals;
    for (const ent of entities) {
      ent.Position.x += ent.Velocity.x * dt;
      ent.Position.y += ent.Velocity.y * dt;
      ent.Position.z += ent.Velocity.z * dt;
    }
  }
));
// Logging
scene.addSystem(new System(
  ['Position'],
  (entities, scene) => {
    for (const ent of entities) {
      console.log(ent.Position);
    }
  }
));

let then = Date.now();
const gameLoop = () => {
  requestAnimationFrame(gameLoop);
  const now = Date.now();
  const dt = now - then;
  then = now;
  scene.globals.dt = dt;
  scene.update();
};
gameLoop();
```

## Provisional Docs
### `base class Scene`
```js
/// This is the base class for scenes.
/// You cannot (and should not) access it directly,
///   and must instead use its subclasses (e.g., Scene256).

/// The number in the name of each subclass (e.g., "256")
///   refers to the maximum number of component types the
///   scene can handle.
/// Choosing a smaller subclass (e.g., Scene32) should
///   have better performance, but the drawback is that
///   your scene won't be able to use as many component
///   types in your project.
/// Likewise, choosing a larger subclass (e.g., Scene1024)
///   will allow you to use more component types at the
///   cost of slower performance.
/// It is recommended to start off using Scene32 and
///   scale up size as your project grows.
class Scene {
  constructor() {}

  /// Adds destructor system to scene.
  /// The system.destroy() function is called every time an entity
  ///   with the specified components is removed from the scene.
  /// See class DestructorSystem {} for more information.
  addDestructorSystem(system) {}

  /// Adds entity to scene
  addEntity(entity) {}

  /// Adds system to scene
  addSystem(system) {}

  /// Removes destructor system from the scene.
  /// This is usually an expensive method, and you should avoid using it if
  ///   possible.
  expensivelyRemoveDestructorSystem(system) {}

  /// Removes entity from scene
  removeEntity(entity) {}

  /// Removes system from scene
  removeSystem(system) {}

  /// Calls system.update(entities, scene) on every system added to this scene.
  /// entities: an array of entities that have the specified components.
  /// scene: this scene.
  update() {}

  /// Arbitrary global data (e.g., delta-time), set by you.
  /// Note: This is a property, not a method.
  globals = {}
}
```

### `final class System`
```js
class System {
  /// @param componentNames: Array<string> - The components that each
  ///   entity handled by this system must have.
  /// @param update: function<T: Scene>(entities: Array<object>, scene: T) - The
  ///   updater function that will be called by Scene.prototype.update().
  constructor(componentNames, update) {}
}
```

### `final class DestructorSystem`
```js
/// A system that has a destroy function that is called every
///   time an entity with all the specified components is
///   removed from the scene.
class DestructorSystem {
  /// @param componentNames: Array<string> - The components that each
  ///   entity handled by this system must have.
  /// @param destroy: function<T: Scene>(entity: object, scene: T) - The
  ///   destructor function that will be called every time an entity with
  ///   all the components specified by componentNames is removed from the
  ///   scene.
  constructor(componentNames, destroy) {}
}
```

### `final class Scene32 extends Scene`
```js
/// A scene that can handle up to 32 different component types.
class Scene32 extends Scene {}
```

### `final class Scene64 extends Scene`
```js
/// A scene that can handle up to 64 different component types.
class Scene64 extends Scene {}
```

### `final class Scene128 extends Scene`
```js
/// A scene that can handle up to 128 different component types.
class Scene128 extends Scene {}
```

### `final class Scene256 extends Scene`
```js
/// A scene that can handle up to 256 different component types.
class Scene256 extends Scene {}
```

### `final class Scene512 extends Scene`
```js
/// A scene that can handle up to 512 different component types.
class Scene512 extends Scene {}
```

### `final class Scene1024 extends Scene`
```js
/// A scene that can handle up to 1024 different component types.
class Scene1024 extends Scene {}
```
