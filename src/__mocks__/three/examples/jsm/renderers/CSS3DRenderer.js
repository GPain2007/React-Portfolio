// Manual mock for three's CSS3DRenderer/CSS3DObject.
//
// Unlike the WebGL renderer, CSS3DRenderer's whole job in real life is to
// keep a plain DOM element in sync with a THREE.Object3D's transform. That
// means the *real* implementation is DOM-only and jsdom-safe already — the
// only reason to mock it here is speed and to avoid depending on three's
// internal matrix math in a component test. This mock keeps the one piece of
// behavior JobCarousel.test.js relies on: appending each object's element
// into the renderer's domElement so the job cards are actually queryable
// (and clickable) the same way they would be in a real browser.
class CSS3DObject {
  constructor(element) {
    this.element = element;
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
  }
}

class CSS3DRenderer {
  constructor() {
    this.domElement = document.createElement("div");
  }

  setSize() {}

  render(scene) {
    const walk = (object3D) => {
      if (object3D.element && !this.domElement.contains(object3D.element)) {
        this.domElement.appendChild(object3D.element);
      }
      (object3D.children || []).forEach(walk);
    };
    (scene.children || []).forEach(walk);
  }
}

module.exports = { CSS3DObject, CSS3DRenderer };
