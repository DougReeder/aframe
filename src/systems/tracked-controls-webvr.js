var registerSystem = require('../core/system').registerSystem;
var utils = require('../utils');
var isWebXRAvailable = utils.device.isWebXRAvailable;

/**
 * Tracked controls system.
 * Maintain list with available tracked controllers.
 */
module.exports.System = registerSystem('tracked-controls-webvr', {
  init: function () {
    var self = this;

    this.controllers = [];
    this.isChrome = navigator.userAgent.indexOf('Chrome') !== -1;

    this.updateControllerList();
    this.throttledUpdateControllerList = utils.throttle(this.updateControllerList, 500, this);

    // Don't use WebVR if WebXR is available?
    if (isWebXRAvailable) { return; }

    if (!navigator.getVRDisplays) { return; }

    this.sceneEl.addEventListener('enter-vr', function () {
      navigator.getVRDisplays().then(function (displays) {
        if (displays.length) { self.vrDisplay = displays[0]; }
      });
    });
  },

  tick: function () {
    if (this.isChrome) {
      // Retrieve new controller handlers with updated state (pose, buttons...)
      this.updateControllerList();
    } else {
      this.throttledUpdateControllerList();
    }
  },

  /**
   * Update controller list.
   */
  updateControllerList: function () {
    try {
      var controllers = this.controllers;
      var gamepad;
      var gamepads;
      var i;
      var prevCount;

      gamepads = navigator.getGamepads && navigator.getGamepads();
      if (!gamepads) { return; }

      prevCount = controllers.length;
      controllers.length = 0;
      for (i = 0; i < gamepads.length; ++i) {
        gamepad = gamepads[i];
        if (gamepad && gamepad.pose) {
          controllers.push(gamepad);
        }
      }

      if (controllers.length !== prevCount) {
        this.el.emit('controllersupdated', undefined, false);
      }
    } catch (e) {
      if (e.name === 'SecurityError') {
        if (window.self === window.top) {
          console.warn('A-Frame requires additional permissions to list the gamepads. The HTTP `Permissions-Policy` header must not exclude this origin in the `gamepad` directive.', e);
        } else {
          console.warn('A-Frame requires additional permissions to list the gamepads. The iframe `allow` attribute must not block this origin.', e);
        }
      } else {
        console.error('Can\'t update controller list:', e);
      }
    }
  }
});
