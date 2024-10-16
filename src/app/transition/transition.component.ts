import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as Marzipano from 'marzipano';
import {urls} from '../data';
import construct = Reflect.construct;

@Component({
  selector: 'app-transition',
  templateUrl: './transition.component.html',
  styleUrls: ['./transition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransitionComponent implements OnInit, AfterViewInit {

  @ViewChild('pano') pano: ElementRef;

  imageIndex = 0;
  enableOrientation = true;
  view: any;

  prevYaw = 0;
  prevPitch = 0;

  constructor() {
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (orientation) => {
        if (orientation && this.enableOrientation) {
          const yaw = Marzipano.util.degToRad(orientation.alpha);
          const pitch = Marzipano.util.degToRad(orientation.beta);
          const roll = Marzipano.util.degToRad(orientation.gamma);
          const current = this.rotateEuler({yaw, pitch, roll});
          console.log('current.yaw', this.prevYaw);
          const yawOffset = current.yaw - this.prevYaw;
          const pitchOffset = current.pitch - this.prevPitch;
          this.view.offsetYaw(yawOffset);
          this.view.offsetPitch(pitchOffset);
          this.prevYaw = current.yaw;
          this.prevPitch = current.pitch;
        }
      });
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.rerender();
  }

  cabin(): void {
    this.imageIndex = 0;
    const pano = this.pano.nativeElement;
    // pano.innerHTML = '';
    this.rerender();
  }

  field(): void {
    this.imageIndex = 1;
    this.rerender();
  }

  golf(): void {
    this.imageIndex = 2;
    this.rerender();
  }

  deviceMode(event): void {
    this.enableOrientation = true;
    console.log('its device mode');
    this.rerenderDevice();
  }

  touchMode(event): void {
    this.enableOrientation = false;
    console.log('its not device mode');
    this.rerender();
  }

  private rerender(): void {
    const panoElement = this.pano.nativeElement;

    const viewerOpts = {
      controls: {
        mouseViewMode: 'drag'
      }
    };
    const viewer = new Marzipano.Viewer(panoElement, viewerOpts);

    const limiter = Marzipano.RectilinearView.limit.traditional(2048, 120 * Math.PI / 180);
    this.view = new Marzipano.RectilinearView({yaw: Math.PI}, limiter);

    const geometry = new Marzipano.EquirectGeometry([{width: 4000}]);

    const source = Marzipano.ImageUrlSource.fromString(urls[this.imageIndex]);

    const scene1 = viewer.createScene({
      source,
      geometry,
      view: this.view,
      pinFirstLevel: true
    });
    scene1.switchTo({
      transitionDuration: 600
    });
  }

  private rerenderDevice(): void {
    const panoElement = this.pano.nativeElement;

    const viewerOpts = {
      controls: {
        mouseViewMode: 'drag'
      }
    };
    const viewer = new Marzipano.Viewer(panoElement, viewerOpts);

    const limiter = Marzipano.RectilinearView.limit.traditional(2048, 120 * Math.PI / 180);
    this.view = new Marzipano.RectilinearView({yaw: Math.PI}, limiter);

    const geometry = new Marzipano.EquirectGeometry([{width: 4000}]);

    const source = Marzipano.ImageUrlSource.fromString(urls[this.imageIndex]);

    const scene1 = viewer.createScene({
      source,
      geometry,
      view: this.view,
      pinFirstLevel: true
    });

    scene1.switchTo({
      transitionDuration: 600
    });
  }

  private rotateEuler(euler): any {
    let heading = 0;
    let bank = 0;
    let attitude = 0;
    const ch = Math.cos(euler.yaw);
    const sh = Math.sin(euler.yaw);
    const ca = Math.cos(euler.pitch);
    const sa = Math.sin(euler.pitch);
    const cb = Math.cos(euler.roll);
    const sb = Math.sin(euler.roll);

    const matrix = [
      sh * sb - ch * sa * cb, -ch * ca, ch * sa * sb + sh * cb,
      ca * cb, -sa, -ca * sb, sh * sa * cb + ch * sb, sh * ca, -sh * sa * sb + ch * cb
    ]; // Includes 90-degree rotation around z axis

    /* [m00 m01 m02] 0 1 2
     * [m10 m11 m12] 3 4 5
     * [m20 m21 m22] 6 7 8 */

    if (matrix[3] > 0.9999) {
      // Deal with singularity at north pole
      heading = Math.atan2(matrix[2], matrix[8]);
      attitude = Math.PI / 2;
      bank = 0;
    } else if (matrix[3] < -0.9999) {
      // Deal with singularity at south pole
      heading = Math.atan2(matrix[2], matrix[8]);
      attitude = -Math.PI / 2;
      bank = 0;
    } else {
      heading = Math.atan2(-matrix[6], matrix[0]);
      bank = Math.atan2(-matrix[5], matrix[4]);
      attitude = Math.asin(matrix[3]);
    }

    return {
      yaw: heading,
      pitch: attitude,
      roll: bank,
    };
  }

}
