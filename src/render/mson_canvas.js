// import { VectorUtils } from './vector_utils';

/*export*/ const MsonCanvas = (_ => {
  
  function createRenderer(w, h) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w/h, 1, 10000);
    const gl = new THREE.WebGLRenderer();
    
    gl.setSize(w, h);
    camera.position.z = 1000;
    
    scene.scale.x = 32;
    scene.scale.y = -32;
    scene.scale.z = 32;

    let currentTexture;

    const buffer = setupTransform(scene, () => {
      return currentTexture;
    });
    let killed;
    (function renderLoop() {
      if (killed) {
        if (gl.domElement.parentNode) {
          gl.domElement.parentNode.removeChild(gl.domElement);
        }
        return;
      }
      requestAnimationFrame(renderLoop);
      scene.rotation.y += 0.02;
      gl.render(scene, camera);
    })();
    
    return {
      dispose() {
        killed = true;
      },
      reset() {
        buffer.clear();
      },
      getElement() {
        return gl.domElement;
      },
      bindTexture(url) {
        if (url.src) {
          return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            url.onload = function() {
              canvas.width = url.width;
              canvas.height = url.height;
              ctx.drawImage(url, 0, 0);
              currentTexture = new THREE.CanvasTexture(canvas);
              resolve(currentTexture);
            };
            url.onerror = () => reject();
          });
        }
        return new Promise((resolve, reject) => {
          const loader = new THREE.TextureLoader();
          loader.load(url, tex => {
            currentTexture = tex;
            resolve(currentTexture);
          }, undefined, reject);
        });
      },
      getBuffer() {
        return buffer;
      }
    };
  }

  function setupTransform(scene, getBoundTexture) {
    function createMesh(start, size, texture, mirror) {
      const [w, h, d] = size;
      
      start = VectorUtils.add(start, VectorUtils.scale(size, 0.5))

      const geometry = new THREE.BoxGeometry(w, h, d, 10, 10, 10);
      const tex = getBoundTexture();
      const material = new THREE.MeshBasicMaterial({
        color: 0xfffff,
        wireframe: true
      });
      //material.map.offset.set(texture.u / texture.width, texture.v / texture.height);

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = start[0];
      mesh.position.y = start[1];
      mesh.position.z = start[2];
      return mesh;
    }
    
    function createParent(translate, origin, rotate) {
      const parent = new THREE.Object3D();
        
      parent.position.x = origin[0];
      parent.position.y = origin[1];
      parent.position.z = origin[2];
      parent.rotation.x = rotate[0];
      parent.rotation.y = rotate[1];
      parent.rotation.z = rotate[2];
      return parent;
    }
    
    function setupSubTransform(parent) {
      return {
          group(translate, origin, rotate, func) {
          const p = createParent(translate, origin, rotate);
          parent.add(p);
          func(setupSubTransform(parent));
          return this;
        },
        cube(start, size, texture, mirror) {
          parent.add(createMesh(start, size, texture, mirror));
          return this;
        }
      };
    }
    
    let calls = [];
    return {
      getCallList() {
        return calls;
      },
      group(translate, origin, rotate, func) {
        const parent = createParent(translate, origin, rotate);

        calls.push(() => scene.add(parent));
        func(setupSubTransform(parent));
        return this;
      },
      clear() {
        calls = [];
      },
      cube(start, size, texture, mirror) {
        const mesh = createMesh(start, size, texture, mirror);
        calls.push(() => scene.add(mesh))
        return this;
      },
      render() {
        calls.forEach(c => c());
      }
    };
  }

  function getTransformer(translate, origin, rotate) {
    return {
      translate(point) {
        return point;
      },
      rotate(point) {
        return point;
      }
    };
  }

  return { createRenderer };
})();