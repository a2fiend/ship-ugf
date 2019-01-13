import { Pipe, PipeTransform } from '@angular/core';
import { ORDER_TYPE } from '../../providers/app-module/app-constants';

/**
 * Generated class for the OrderTypePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'orderType',
})
export class OrderTypePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number) {
    if(value == ORDER_TYPE.CONFIRMING){
      return "Đang chờ xét duyệt";
    }
    else if(value == ORDER_TYPE.CONFIRMED){
      return "Đã xét duyệt";
    }
    else if(value == ORDER_TYPE.COMPLETE){
      return "Đã hoàn thành";
    }
  }
}
