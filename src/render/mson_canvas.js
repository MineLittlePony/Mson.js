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

    const buffer = setupTransform(scene, getTransformer([0,0,0], [0,0,0], [0,0,0]), () => {
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
        return new Promise((resolve, reject) => {
          const loader = new THREE.TextureLoader();
          loader.load(url, tex => {
            currentTexture = new THREE.MeshBasicMaterial({
              map: texture
            });
            resolve(currentTexture);
          }, undefined, reject);
        });
      },
      getBuffer() {
        return buffer;
      }
    };
  }
  
  function setupTransform(scene, transformer, getBoundTexture) {
    let calls = [];
    return {
      getCallList() {
        return calls;
      },
      transform(translate, origin, rotate, func) {
        const child = setupTransform(
          scene, transformer.and(getTransformer(translate, origin, rotate)), getBoundTexture
        );
        calls.push(child);
        func(child);
      },
      clear() {
        calls = [];
      },
      cube(start, size, texture, mirror) {
        start = transformer.apply(start);

        console.log('appending cube');
        const [w, h, d] = size;

        const geometry = new THREE.BoxGeometry(w, h, d, 10, 10, 10);
        const material = getBoundTexture() || new THREE.MeshBasicMaterial({
          color: 0xfffff,
          wireframe: true
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = start[0];
        mesh.position.y = start[1];
        mesh.position.z = start[2];

        console.log(scene);
        calls.push({
          render() {
            scene.add(mesh);
          }
        });
        return this;
      },
      render() {
        calls.forEach(c => c.render());
      }
    };
  }

  function getTransformer(translate, origin, rotate) {
    function and(other) {
      return {
          apply: point => {
            return other.apply(this.apply(point));
          },
          and
        }
    }
    
    return {
      apply(point) {
        point = VectorUtils.add(point, translate);
        point = VectorUtils.add(point, origin);
        return VectorUtils.rotate(point, [0,0,0], rotate);
      },
      and
    };
  }

  return { createRenderer };
})();