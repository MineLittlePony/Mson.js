// import { Mson } from './mson_loader';
// import { objUtils } from './obj_utils';
// import { VectorUtils } from './render/vector_utils';
// import { fixedLength } from './fixtures';
//=====================================================//
//                 The base types
(_ => {
  function present(a) {
    return !!a;
  }

  Mson.addElementType('mson:box', (loader, body, locals, model) => {
    return {
      from: locals.array(fixedLength(body.from, 3)),
      size: locals.array(fixedLength(body.size, 3)),
      texture: loader.getTexture(body.texture || [], model.texture),
      stretch: fixedLength(body.stretch, 3),
      mirror: body.mirror
    };
  }, function(parent, context) {
    context.cube(
      VectorUtils.add(this.from, VectorUtils.scale(this.stretch, -1)),
      VectorUtils.add(this.size, VectorUtils.scale(this.stretch, 1)),
      this.texture || parent.texture, this.mirror);
  });
  Mson.addElementType('mson:compound', (loader, body, locals, model, defineName) => {
    const element = {
      center: locals.array(fixedLength(body.center, 3)),
      offset: locals.array(fixedLength(body.offset, 3)),
      rotate: locals.array(fixedLength(body.rotate, 3)),
      mirror: fixedLength(body.mirror, 3, false),
      visible: body.visible !== false,
      texture: locals.obj(loader.getTexture(body.texture, model.texture)),
      children: loadChildren(body.children),
      cubes: body.cubes ? body.cubes
          .map(cube => loader.getElement(cube, 'mson:box', model, locals, defineName))
          .filter(present) : []
    };
    if (body.name) {
      defineName(body.name, element);
    }
    function loadChildren(children) {
      return children ? objUtils.map(children,
        value => loader.getElement(value, 'mson:compound', model, locals, defineName),
        Array.isArray(children) ? (key => `unnamed_member_${key}`) : (key => key)
      ) : {};
    }

    return element;
  }, function(parent, context) {
    if (!this.visible) {
      console.log('skip render compound');
      return;
    }

    context.group(this.offset, this.center, this.rotate, sub => {
      Object.values(this.children).forEach(child => child.render(this, sub));
      this.cubes.forEach(cube => cube.render(this, sub));
    });
  });
})();
