import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SeedComponent } from './seed.component';
import { SeedService } from './seed.service';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { MomentModule } from 'angular2-moment';
import { MarkdownModule } from 'angular2-markdown';


@NgModule({
	declarations: [
	  SeedComponent, 
	],
	imports: [
	  CommonModule, HttpModule,  VirtualScrollModule, MomentModule, MarkdownModule.forRoot()
	],
	providers:[ SeedService ],
	exports: [SeedComponent]
  })
  export class SeedModule {}
