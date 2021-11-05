import * as THREE from 'three';
import { experiment } from './experiment';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { banana } from './components/banana';

export const renderer = Object.create (null);

renderer.init = function (_options = {}) {
  this.experiment = experiment;
  this.config = this.experiment.config;
  this.debug = this.experiment.debug;
  this.stats = this.experiment.stats;
  this.time = this.experiment.time;
  this.sizes = this.experiment.sizes;
  this.scene = this.experiment.scene;
  this.camera = this.experiment.camera;

  this.usePostprocess = false;

  this.setInstance ();
  this.setPostProcess ();
};

renderer.setInstance = function () {
  this.clearColor = '#010101';

  // Renderer
  this.instance = new THREE.WebGLRenderer ({
    alpha: false,
    antialias: true,
  });
  this.instance.domElement.style.position = 'absolute';
  this.instance.domElement.style.top = 0;
  this.instance.domElement.style.left = 0;
  this.instance.domElement.style.width = '100%';
  this.instance.domElement.style.height = '100%';

  // this.instance.setClearColor(0x414141, 1)
  this.instance.setClearColor (this.clearColor, 1);
  this.instance.setSize (this.config.width, this.config.height);
  this.instance.setPixelRatio (this.config.pixelRatio);
  // this.instance.setClearColor (0xf2e318, 1);

  // this.instance.physicallyCorrectLights = true
  // this.instance.gammaOutPut = true
  // this.instance.outputEncoding = THREE.sRGBEncoding
  // this.instance.shadowMap.type = THREE.PCFSoftShadowMap
  // this.instance.shadowMap.enabled = false
  // this.instance.toneMapping = THREE.ReinhardToneMapping
  // this.instance.toneMapping = THREE.ReinhardToneMapping
  // this.instance.toneMappingExposure = 1.3

  this.context = this.instance.getContext ();

  // Add stats panel
  if (this.stats) {
    this.stats.setRenderPanel (this.context);
  }
};

renderer.setPostProcess = function () {
  this.postProcess = {};

  /**
   * Render pass
   */
  this.postProcess.renderPass = new RenderPass (this.scene, this.camera.instance);

  /**
   * Effect composer
   */
  const RenderTargetClass = this.config.pixelRatio >= 2 ? THREE.WebGLRenderTarget : THREE.WebGLMultisampleRenderTarget;
  // const RenderTargetClass = THREE.WebGLRenderTarget
  this.renderTarget = new RenderTargetClass (
    this.config.width,
    this.config.height,
    {
      generateMipmaps: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
      encoding: THREE.sRGBEncoding,
    },
  );
  this.postProcess.composer = new EffectComposer (this.instance, this.renderTarget);
  this.postProcess.composer.setSize (this.config.width, this.config.height);
  this.postProcess.composer.setPixelRatio (this.config.pixelRatio);

  this.postProcess.composer.addPass (this.postProcess.renderPass);
};

renderer.resize = function () {
  // Instance
  this.instance.setSize (this.config.width, this.config.height);
  this.instance.setPixelRatio (this.config.pixelRatio);

  // Post process
  this.postProcess.composer.setSize (this.config.width, this.config.height);
  this.postProcess.composer.setPixelRatio (this.config.pixelRatio);
};

renderer.update = function () {
  if (this.stats) {
    this.stats.beforeRender ();
  }

  if (this.usePostprocess) {
    this.postProcess.composer.render ();
  } else {
    this.instance.render (this.scene, this.camera.instance);
  }

  if (this.stats) {
    this.stats.afterRender ();
  }

  banana.rotate ();
};

renderer.destroy = function () {
  this.instance.renderLists.dispose ();
  this.instance.dispose ();
  this.renderTarget.dispose ();
  this.postProcess.composer.renderTarget1.dispose ();
  this.postProcess.composer.renderTarget2.dispose ();
};
