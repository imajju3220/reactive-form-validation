import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {

    debugger;
    //this will run if value is not there
    //if (!value) return null;
    if (!value) {
      return null
    }
    if (!args || !args.length) {
      return value
    }

    const searchString = args.toString().toLowerCase();

    var returnValue = value.filter(function (item: any) {
      var searchValue = JSON.stringify(item.eventName).toLowerCase().includes(searchString) ||
        JSON.stringify(item.location).toLowerCase().includes(searchString)

      return searchValue;
    });

    return returnValue
  }
}
