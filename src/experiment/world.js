import * as THREE from 'three';
import { experiment } from './experiment';
import { banana } from './components/banana';

export const world = Object.create (null);

world.init = function (_options) {
  this.experiment = experiment;
  this.config = this.experiment.config;
  this.scene = this.experiment.scene;
  this.resources = this.experiment.resources;

  this.resources.on ('groupEnd', (_group) => {
    if (_group.name === 'base') {
      this.setBanana ();
      // this.setDummy ();
    }
  });
};

world.setDummy = function () {
  const cube = new THREE.Mesh (
    new THREE.BoxGeometry (1, 1, 1),
    new THREE.MeshBasicMaterial ({map: this.resources.items.lennaTexture}),
  );
  this.scene.add (cube);
};

world.setBanana = function () {
  this.banana = banana;
  this.banana.init (this.experiment);
};

world.resize = function () {
};

world.update = function () {
};

world.destroy = function () {
};
