import * as THREE from 'three';
import overlayVertexShader from './shaders/overlay/vertex.glsl';
import overlayFragmentShader from './shaders/overlay/fragment.glsl';

export const overlay = Object.create (null);

overlay.init = function (_experiment) {
  this.experiment = _experiment;
  this.scene = this.experiment.scene;

  this.setGeometry ();
  this.setMaterial ();
  this.setMesh ();
};

overlay.setGeometry = function () {
  this.geometry = new THREE.PlaneGeometry (2, 2, 1, 1);
};

overlay.setMaterial = function () {
  this.material = new THREE.ShaderMaterial ({
    transparent: true,
    depthTest: false,
    uniforms:
      {
        uAlpha: {value: 0.2},
        uColor: {value: new THREE.Color (0xf2e318)},
      },
    vertexShader: overlayVertexShader,
    fragmentShader: overlayFragmentShader,
  });
};

overlay.setMesh = function () {
  this.mesh = new THREE.Mesh (this.geometry, this.material);
  this.mesh.frustumCulled = false;
  this.scene.add (this.mesh);
};
