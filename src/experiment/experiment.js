import * as THREE from 'three';
import { Pane } from 'tweakpane';
import { Time } from './utils/time';
import { Sizes } from './utils/sizes';
import { stats } from './utils/stats';

import { Resources } from './resources';
import { renderer } from './renderer';
import { camera } from './camera';
import { world } from './world';

import { assets } from './assets';
import { overlay } from './overlay';

export const experiment = Object.create (null);

experiment.instance = null;

experiment.init = function (_options = {}) {
  if (experiment.instance) {
    return experiment.instance;
  }
  experiment.instance = this;

  // options
  this.targetElement = _options.targetElement;

  if (!this.targetElement) {
    console.warn ('Missing \'targetElement\' property');
    return;
  }

  this.time = new Time ();
  this.sizes = new Sizes ();
  this.setConfig ();
  this.setDebug ();
  this.setStats ();
  this.setScene ();
  this.setCamera ();
  this.setRenderer ();
  this.setResources ();
  this.setWorld ();
  this.setOverlay ();

  this.sizes.on ('resize', () => {
    this.resize ();
  });

  this.update ();
};

experiment.setConfig = function () {
  this.config = {};

  // debug
  this.config.debug = window.location.hash === '#debug';

  // Pixel ratio
  this.config.pixelRatio = Math.min (Math.max (window.devicePixelRatio, 1), 2);

  // Width and height
  const boundings = this.targetElement.getBoundingClientRect ();
  this.config.width = boundings.width;
  this.config.height = boundings.height || window.innerHeight;
};

experiment.setDebug = function () {
  this.debug = new Pane ();
  this.debug.containerElem_.style.width = '320px';
  // this.debug.containerElem_.style.maxHeight = 'calc(100vh - 8px * 2)'
  // this.debug.containerElem_.style.overflowY = 'scroll'
  // this.debug.containerElem_.style.position = 'fixed'
};

experiment.setStats = function () {
  if (this.config.debug) {
    this.stats = stats;
    stats.init (true);
  }
};

experiment.setScene = function () {
  this.scene = new THREE.Scene ();
};

experiment.setCamera = function () {
  this.camera = camera;
  this.camera.init ();
};

experiment.setRenderer = function () {
  this.renderer = renderer;
  this.renderer.init ({rendererInstance: this.rendererInstance});
  this.targetElement.appendChild (this.renderer.instance.domElement);
};

experiment.setResources = function () {
  this.resources = new Resources (assets);
};

experiment.setWorld = function () {
  this.world = world;
  this.world.init ();
};

experiment.setOverlay = function () {
  this.overlay = overlay;
  overlay.init (this.instance);
};

experiment.update = function () {
  if (this.stats)
    this.stats.update ();

  this.camera.update ();

  if (this.world)
    this.world.update ();

  if (this.renderer)
    this.renderer.update ();

  window.requestAnimationFrame (() => {
    this.update ();
  });
};

experiment.resize = function () {
  // Config
  const boundings = this.targetElement.getBoundingClientRect ();
  this.config.width = boundings.width;
  this.config.height = boundings.height;

  this.config.pixelRatio = Math.min (Math.max (window.devicePixelRatio, 1), 2);

  if (this.camera)
    this.camera.resize ();

  if (this.renderer)
    this.renderer.resize ();

  if (this.world)
    this.world.resize ();
};

experiment.destroy = function () {

};
