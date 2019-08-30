import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagePickerComponent } from './image-picker/image-picker.component';
import { IonicModule } from '@ionic/angular';
import { StatisticComponent } from './statistic/statistic.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ImagePickerComponent, StatisticComponent, CreateEventComponent],
  imports: [
    CommonModule, IonicModule, ReactiveFormsModule
  ],
  exports: [ImagePickerComponent, StatisticComponent, CreateEventComponent]
})
export class SharedModule { }
