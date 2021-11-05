import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export const banana = Object.create (null);

banana.init = function (_experiment) {
  this.experiment = _experiment;
  this.debug = this.experiment.debug;
  this.time = this.experiment.time;
  this.scene = this.experiment.scene;

  this.group = new THREE.Group ();
  this.scene.add (this.group);

  this.setLight ();
  this.setAmbientLight ();

  this.load ();
  // this.debug ();
};

banana.load = function () {
  // Instantiate Draco Loader
  const dracoLoader = new DRACOLoader ();
  dracoLoader.setDecoderPath ('draco/');
  dracoLoader.setDecoderConfig ({type: 'js'});

  // Instantiate GLTF Loader
  const gltfLoader = new GLTFLoader ();
  gltfLoader.setDRACOLoader (dracoLoader);

  // Start loading the model
  gltfLoader.load (
    'assets/banana.glb',
    (_gltf) => {
      this.setModel (_gltf);
      // this.trigger ('loaded');
    },
  );
};

banana.setLight = function () {
  this.light = {};

  this.light.color = '#64723d';
  this.light.position = new THREE.Vector3 (0, 1, 0);
  this.light.intensity = 3;

  // Instance
  this.light.instance = new THREE.PointLight (this.light.color, 1, 0, 1.5);
  this.light.instance.castShadow = true;
  this.light.instance.shadow.camera.near = 0.1;
  this.light.instance.shadow.camera.far = 100;
  this.light.instance.shadow.mapSize.x = 1024;
  this.light.instance.shadow.mapSize.y = 1024;
  this.scene.add (this.light.instance);
};

banana.setAmbientLight = function () {
  const light = new THREE.AmbientLight (0xFFFFFF, 1.1);
  this.scene.add (light);
};

banana.setModel = function (model) {
  this.model = model.scene;
  // this.model.translateX (-2);
  this.model.translateY (-3);
  this.scene.add (this.model);
};

banana.rotate = function () {
  if (!this.model) return;
  this.model.rotation.y -= 0.008;
  // this.model.rotation.z -= 0.01;
  console.log (this.model.position);
};

banana.debug = function () {
  this.debugFolder = this.debug.addFolder ({
    title: 'environment',
    expanded: false,
  });

  this.debugFolder
    .addInput (
      this.light,
      'color',
      {view: 'color'},
    )
    .on ('change', () => {
      this.light.instance.color.set (this.light.color);
    });

  this.debugFolder
    .addInput (
      this.light,
      'intensity',
      {min: 0, max: 10},
    );

  this.debugFolder
    .addInput (
      this.light.instance,
      'decay',
      {min: 0, max: 10},
    );

  this.debugFolder
    .addInput (
      this.light.position,
      'y',
      {min: 0, max: 10},
    );
};
