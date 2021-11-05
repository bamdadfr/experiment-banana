import * as THREE from 'three';
import { experiment } from './experiment';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const camera = Object.create (null);

camera.init = function (_options) {
  // Options
  this.experiment = experiment;
  this.config = this.experiment.config;
  this.debug = this.experiment.debug;
  this.time = this.experiment.time;
  this.sizes = this.experiment.sizes;
  this.targetElement = this.experiment.targetElement;
  this.scene = this.experiment.scene;

  // Set up
  this.mode = 'default'; // default | debug

  this.setInstance ();
  this.setModes ();
};

camera.setInstance = function () {
  // Set up
  this.instance = new THREE.PerspectiveCamera (25, this.config.width / this.config.height, 0.1, 150);

  this.instance.position.set (
    0,
    0,
    20,
  );

  this.instance.rotation.set (
    0,
    0,
    0,
    'YXZ',
  );

  this.scene.add (this.instance);
};

camera.setModes = function () {
  this.modes = {};

  // Default
  this.modes.default = {};
  this.modes.default.instance = this.instance.clone ();
  this.modes.default.instance.rotation.reorder ('YXZ');

  // Debug
  this.modes.debug = {};
  this.modes.debug.instance = this.instance.clone ();
  // this.modes.debug.instance.rotation.reorder ('YXZ');
  // this.modes.debug.instance.position.set (5, 5, 5);

  this.modes.debug.orbitControls = new OrbitControls (this.modes.debug.instance, this.targetElement);
  this.modes.debug.orbitControls.enabled = this.modes.debug.active;
  this.modes.debug.orbitControls.screenSpacePanning = true;
  this.modes.debug.orbitControls.enableKeys = false;
  this.modes.debug.orbitControls.zoomSpeed = 0.25;
  this.modes.debug.orbitControls.enableDamping = true;
  this.modes.debug.orbitControls.update ();
};

camera.resize = function () {
  this.instance.aspect = this.config.width / this.config.height;
  this.instance.updateProjectionMatrix ();

  this.modes.default.instance.aspect = this.config.width / this.config.height;
  this.modes.default.instance.updateProjectionMatrix ();

  this.modes.debug.instance.aspect = this.config.width / this.config.height;
  this.modes.debug.instance.updateProjectionMatrix ();
};

camera.update = function () {
  // Update debug orbit controls
  this.modes.debug.orbitControls.update ();

  // Apply coordinates
  this.instance.position.copy (this.modes[this.mode].instance.position);
  this.instance.quaternion.copy (this.modes[this.mode].instance.quaternion);
  this.instance.updateMatrixWorld (); // To be used in projection
};

camera.destroy = function () {
  this.modes.debug.orbitControls.destroy ();
};
