/* global assert, suite, test, setup */
import * as helpers from '../../../helpers.js';
import { geometryNames } from 'core/geometry.js';
import primitives from 'extras/primitives/primitives/meshPrimitives.js';
import * as utils from 'utils/index.js';

suite('meshPrimitives', function () {
  setup(function createScene (done) {
    var self = this;
    var el = helpers.entityFactory();
    el.addEventListener('loaded', function () {
      self.sceneEl = el.sceneEl;
      done();
    });
  });

  test('registers a-box', function (done) {
    var el = document.createElement('a-box');
    this.sceneEl.appendChild(el);
    el.addEventListener('loaded', function () {
      assert.ok(el.isEntity);
      done();
    });
  });

  test('registers a-dodecahedron', function (done) {
    var el = document.createElement('a-dodecahedron');
    this.sceneEl.appendChild(el);
    el.addEventListener('loaded', function () {
      assert.ok(el.isEntity);
      done();
    });
  });

  test('registers a-box with mappings', function (done) {
    var el = document.createElement('a-box');
    this.sceneEl.appendChild(el);
    el.addEventListener('loaded', function () {
      el.setAttribute('color', 'red');
      el.setAttribute('depth', 5);
      el.setAttribute('side', 'back');
      setTimeout(function () {
        assert.equal(el.getAttribute('material').color, 'red');
        assert.equal(el.getAttribute('material').side, 'back');
        assert.equal(el.getAttribute('geometry').depth, 5);
        done();
      });
    });
  });

  test('registers every geometry', function () {
    function removeA (str) { return str.replace('a-', ''); }
    assert.shallowDeepEqual(
      Object.keys(primitives).map(removeA).map(utils.styleParser.toCamelCase),
      geometryNames);
  });
});
