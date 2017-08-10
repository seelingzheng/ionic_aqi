import { Component } from '@angular/core';

/**
 * Generated class for the Map3dComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'map3d',
  templateUrl: 'map3d.html'
})
export class Map3dComponent {

  text: string;

  constructor() {
    console.log('Hello Map3dComponent Component');
    this.text = 'Hello World';
  }

}
