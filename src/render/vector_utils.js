/*export*/ const VectorUtils = (_ => {
    
  function toRadians(deg) {
    return deg * Math.PI / 180;
  }
  
  function rotX(vec, rad) {
    return [
      vec[0],
      vec[1] * Math.cos(rad) - vec[2] * Math.sin(rad),
      vec[2] * Math.cos(rad) - vec[2] * Math.sin(rad)
    ];
  }
  function rotY(vec, rad) {
    return [
      vec[2] * Math.sin(rad) + vec[0] * Math.cos(rad),
      vec[1],
      vec[2] * Math.cos(rad) - vec[0] * Math.sin(rad)
    ];
  }
  function rotZ(vec, rad) {
    return [
      vec[0] * Math.cos(rad) - vec[1] * Math.sin(rad),
      vec[0] * Math.sin(rad) + vec[1] * Math.cos(rad),
      vec[2]
    ];
  }
  function relative(vec, origin, func) {
    vec = add(vec, scale(origin, -1));
    return add(func(vec), origin);
  }
  
  function rotateX(vec, origin, deg) {
    return relative(vec, origin, v => rotX(v, toRadians(deg)));
  }
  
  function rotateY(vec, origin, deg) {
    return relative(vec, origin, v => rotY(v, toRadians(deg)));
  }
  
  function rotateZ(vec, origin, deg) {
    return relative(vec, origin, v => rotZ(v, toRadians(deg)));
  }
  
  function rotate(vec, origin, rot) {
    return relative(vec, origin, v => {
      v = rotZ(v, toRadians(rot[2]));
      v = rotY(v, toRadians(rot[1]));
      v = rotX(v, toRadians(rot[0]));
      return v;
    });
  }
  
  function add(one, two) {
    return one.map((a, i) => a + two[i]);
  }
  function multiply(vec, mult) {
    return vec.map((a, i) => a * mult[i]);
  }
  function scale(vec, scale) {
    return vec.map(a => a * scale);
  }
  function modulus(vec, mod) {
    return vec.map((a, i) => a % mod[i]);
  }

  return {
    rotate,
    rotateX,
    rotateY,
    rotateZ,
    add,
    multiply,
    modulus,
    scale
  }
})();
