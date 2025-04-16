import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { IFCLoader } from 'web-ifc-three';

@Component({
  selector: 'app-bim-viewer',
  templateUrl: './bim-viewer.component.html',
  styleUrls: ['./bim-viewer.component.css']
})
export class BimViewerComponent implements OnInit {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  ngOnInit(): void {
    this.initThreeJS();
    this.loadBIMModel();
  }

  private initThreeJS(): void {
    // Set up scene, camera, and renderer
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    this.scene.add(light);
  }

  private loadBIMModel(): void {
    const ifcLoader = new IFCLoader();
    ifcLoader.load('assets/models/sample.ifc', (model) => {
      this.scene.add(model);
      this.animate();
    });
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }
}