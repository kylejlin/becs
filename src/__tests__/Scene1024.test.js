import Scene1024 from '../Scene1024';
import System from '../System';
import DestructorSystem from '../DestructorSystem';

test('systems work correctly', () => {
  const scene = new Scene1024();
  const [bob, joe, larry] = [
    {
      Position: { x: 0, y: 0, z: 0 },
      Name: { name: 'Bob' },
    },
    {
      Position: { x: 0, y: 0, z: 0 },
      Velocity: { x: 1, y: 0, z: 0 },
      Name: { name: 'Joe' },
    },
    {
      Position: { x: 0, y: 10, z: 0 },
      Velocity: { x: 0, y: 5, z: 8 },
      Name: { name: 'Larry' },
    }
  ];
  scene.addEntity(bob);
  scene.addEntity(joe);
  const inertia = new System(
    ['Position', 'Velocity'],
    (entities) => {
      for (const ent of entities) {
        ent.Position.x += ent.Velocity.x;
        ent.Position.y += ent.Velocity.y;
        ent.Position.z += ent.Velocity.z;
      }
    }
  );
  scene.addSystem(inertia);
  scene.addEntity(larry);
  expect(scene).toMatchSnapshot({}, 'initial scene');
  scene.update();
  expect(scene).toMatchSnapshot({}, 'with inertia added');
  scene.removeEntity(joe);
  scene.update();
  expect(scene).toMatchSnapshot({}, 'with joe removed');
  scene.removeSystem(inertia);
  scene.update();
  expect(scene).toMatchSnapshot({}, 'with inertia removed');
});

test('destructors work correctly', () => {
  let freed = null;

  const scene = new Scene1024();
  const [bob, joe, larry] = [
    {
      Position: { x: 0, y: 0, z: 0 },
      Name: { name: 'Bob' },
    },
    {
      Position: { x: 0, y: 0, z: 0 },
      Velocity: { x: 1, y: 0, z: 0 },
      Name: { name: 'Joe' },
    },
    {
      Position: { x: 0, y: 10, z: 0 },
      Velocity: { x: 0, y: 5, z: 8 },
      Name: { name: 'Larry' },
    }
  ];
  scene.addEntity(bob);
  scene.addEntity(joe);
  const freer = new DestructorSystem(
    ['Position', 'Velocity', 'Name'],
    (entity) => {
      freed = entity.Name.name;
    }
  );
  scene.addDestructorSystem(freer);
  scene.removeEntity(joe);
  expect(freed).toEqual('Joe');
  freed = null;
  scene.removeEntity(bob);
  expect(freed).toEqual(null);
  scene.addEntity(larry);
  scene.removeEntity(larry);
  expect(freed).toEqual('Larry');
});
