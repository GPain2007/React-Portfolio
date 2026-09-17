// Manual mock for the `three` package.
//
// Why this mock exists (see README.md "Testing Three.js and Motion"):
// jsdom (Jest's DOM implementation) has no WebGL/GPU context, so the real
// `three` renderer throws as soon as it tries to create one. Our components
// only need to (a) mount without crashing, (b) clean up on unmount, and
// (c) expose the plain-object math (position/rotation) our components read
// back — they never need pixels on screen. This mock provides just that
// surface so component *behavior* (props, DOM structure, event handlers)
// can be unit tested in isolation from the rendering engine.
class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  normalize() {
    return this;
  }
}

class Object3D {
  constructor() {
    this.children = [];
    this.position = {
      x: 0,
      y: 0,
      z: 0,
      set: (x, y, z) => {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
      },
    };
    this.rotation = { x: 0, y: 0, z: 0 };
    this.scale = {
      x: 1,
      y: 1,
      z: 1,
      setScalar: (s) => {
        this.scale.x = s;
        this.scale.y = s;
        this.scale.z = s;
      },
    };
  }
  add(child) {
    this.children.push(child);
    return this;
  }
}

class Scene extends Object3D {}
class Group extends Object3D {}

class Camera extends Object3D {
  updateProjectionMatrix() {}
}
class OrthographicCamera extends Camera {
  constructor(left, right, top, bottom, near, far) {
    super();
    Object.assign(this, { left, right, top, bottom, near, far });
  }
}
class PerspectiveCamera extends Camera {
  constructor(fov, aspect, near, far) {
    super();
    Object.assign(this, { fov, aspect, near, far });
  }
}

class Clock {
  getDelta() {
    return 0.016;
  }
}

class WebGLRenderer {
  constructor() {
    this.domElement = document.createElement("canvas");
  }
  setPixelRatio() {}
  setSize() {}
  render() {}
  dispose() {}
}

class BufferAttribute {
  constructor(array, itemSize) {
    this.array = array;
    this.itemSize = itemSize;
    this.needsUpdate = false;
  }
}

class BufferGeometry {
  constructor() {
    this.attributes = {};
  }
  setAttribute(name, attribute) {
    this.attributes[name] = attribute;
    return this;
  }
  dispose() {}
}

class PointsMaterial {
  constructor(params = {}) {
    Object.assign(this, params);
  }
  dispose() {}
}

class Points extends Object3D {
  constructor(geometry, material) {
    super();
    this.geometry = geometry;
    this.material = material;
  }
}

class CanvasTexture {
  dispose() {}
}

class IcosahedronGeometry {
  dispose() {}
}

class MeshBasicMaterial {
  constructor(params = {}) {
    Object.assign(this, params);
  }
  dispose() {}
}

class Mesh extends Object3D {
  constructor(geometry, material) {
    super();
    this.geometry = geometry;
    this.material = material;
  }
}

module.exports = {
  Vector3,
  Object3D,
  Scene,
  Group,
  Camera,
  OrthographicCamera,
  PerspectiveCamera,
  Clock,
  WebGLRenderer,
  BufferAttribute,
  BufferGeometry,
  PointsMaterial,
  Points,
  CanvasTexture,
  IcosahedronGeometry,
  MeshBasicMaterial,
  Mesh,
  AdditiveBlending: "AdditiveBlending",
};
