import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FilterKeyPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'filtercity',
})
export class FilterCityPipe implements PipeTransform {

  transform(value: any, key: string) {
    let fValues = value;
    if (key && key != "") {

      if (value.length > 0) {
        fValues = value.filter(item => {
          return item.Name.indexOf(key) > -1;
        })
      }
    }

    return fValues;
  }
}
