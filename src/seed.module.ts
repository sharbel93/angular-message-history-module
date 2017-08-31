import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SeedComponent } from './seed.component';
import { SeedService } from './seed.service';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { TimeAgoPipe } from 'time-ago-pipe';



@NgModule({
	declarations: [
	  SeedComponent, TimeAgoPipe
	],
	imports: [
	  CommonModule, HttpModule,  VirtualScrollModule
	],
	providers:[ SeedService ],
	exports: [SeedComponent]
  })
  export class SeedModule {}
