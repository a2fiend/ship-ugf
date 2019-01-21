import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { Utils } from '../../providers/core/app/utils';

/**
 * Generated class for the ProgressUploadComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'progress-upload',
  templateUrl: 'progress-upload.html'
})
export class ProgressUploadComponent {

  message: string = "";
  distance: number = 0;
  nowDistance: number = 0;
  animationText: any;
  intervalLoading: any;
  requestAnimationFrame: any;
  constructor(
    public mEvent: Events
  ) {
    this.message = "Đang tải ảnh lên ..";
  }

  ngAfterViewInit() {
    

    this.mEvent.subscribe("run_loading",()=>{
      setTimeout(() => {
        this.distance = Utils.randomIntFromInterval(10, 30);
        this.doTransForm(this.distance);
        this.runDistance();
  
        setTimeout(() => {
          this.intervalLoading = setInterval(() => {
            if (this.distance >= 90) {
              clearInterval(this.intervalLoading);
            }
            this.distance = Utils.randomIntFromInterval(this.distance, 90);
            if (this.distance >= 90) {
              clearInterval(this.intervalLoading);
            }

            console.log(this.distance);
            if(this.distance > this.nowDistance){
              this.doTransForm(this.distance);
              this.runDistance();
            }
           
          }, 3000);
        }, 2000);
  
      }, 300);
    })

    this.mEvent.subscribe("done-loading", () => {
      this.mEvent.unsubscribe("done-loading");
      if (this.intervalLoading) clearInterval(this.intervalLoading);
      if (this.requestAnimationFrame) cancelAnimationFrame(this.requestAnimationFrame);
      if (this.animationText) clearInterval(this.animationText);
      this.onLoadDataDone();
    });
  }

  runDistance() {
    let time = 1000 / (this.distance - this.nowDistance);
    this.animationText = setInterval(() => {
      this.nowDistance++;
      if (this.nowDistance == this.distance || this.nowDistance >= 100) {
        this.message = "Tải ảnh lên thành công";
        clearInterval(this.animationText);
      }
    }, time)
  }

  doTransForm(distance) {
    this.distance = distance;
    let element = document.getElementById("progressAnimatedID");
    if (element) {
      this.requestAnimationFrame = requestAnimationFrame(() => {
        element.style.transform = "scale(" + distance * 0.01 + ",1)";
      })
    }
  }

  onLoadDataDone() {
      this.doTransForm(100);
      this.runDistance();
      setTimeout(() => {
       
        this.mEvent.publish("hide-progress");
      }, 2000);
  }

}
