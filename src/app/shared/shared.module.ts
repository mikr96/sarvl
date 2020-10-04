import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagePickerComponent } from './image-picker/image-picker.component';
import { IonicModule } from '@ionic/angular';
import { StatisticComponent } from './statistic/statistic.component';
import { CounterComponent } from './counter/counter.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageModalComponent } from './image-modal/image-modal.component';



@NgModule({
  declarations: [ImagePickerComponent, StatisticComponent, CreateEventComponent, ImageModalComponent, CounterComponent],
  imports: [
    CommonModule, IonicModule, ReactiveFormsModule
  ],
  entryComponents: [ImageModalComponent],
  exports: [ImagePickerComponent, StatisticComponent, CreateEventComponent, ImageModalComponent, CounterComponent]
})

export class SharedModule { }
