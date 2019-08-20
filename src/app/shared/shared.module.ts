import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagePickerComponent } from './image-picker/image-picker.component';
import { IonicModule } from '@ionic/angular';
import { StatisticComponent } from './statistic/statistic.component';



@NgModule({
  declarations: [ImagePickerComponent, StatisticComponent],
  imports: [
    CommonModule, IonicModule
  ],
  exports: [ImagePickerComponent, StatisticComponent]
})
export class SharedModule { }
