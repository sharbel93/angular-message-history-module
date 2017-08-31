import { Component, Input ,OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { SeedService } from './seed.service';
import { ChangeEvent } from 'angular2-virtual-scroll';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


export interface MsgSlack {
    type?: string;
    user?: string;
    text?: string;
    ts?: string;
    username?: string;
    subtype?: string;
  }

  export interface Msg {
    messages: MsgSlack[];
  }

@Component({
	selector: 'seed-component',
	template: `
	<h2>{{title}}</h2>
	
	<div class="status">
		Showing <span class="badge badge-pill badge-default">{{indices?.start + 1}}</span> - <span class="badge badge-pill badge-default">{{indices?.end}}</span> of <span class="badge badge-pill badge-default">{{scrollItems?.length}}</span>
		<span>({{scrollItems?.length}} nodes)</span>
	</div>
	
	<virtual-scroll
	[items]="scrollItems" (end)="fetchMore($event)" (update)="buffer = $event" style="height: 75vh; 
	display: block; 
	background-color: #D3D3D3;">
	
	<div class="col-xs-12 col-sm-12 col-md-12">
	  <!-- use scrollItems for testing in the ngfor -->
		<div *ngFor="let item of scrollItems" >
	  <div class="card card-outline-info mb-1 border-0 "  style="background-color:white">
		  <div class="card-header"  style="background-color:white"> 
			  <div class="row">
			  
				  <div class="col-xs-5 col-sm-5 col-md-5">
					  <h6 class="card-title">  
						  <ul class="list-inline">
							<li style="color:black">Time : {{item.ts * 1000 | date:'medium'}}</li> 
						  </ul>
						</h6>
				  </div>
	
				  <div class="col-xs-4 col-sm-4 col-md-4">
					  <h6 class="card-title">  
						<ul class="list-inline">
						  <li  style="color:black">User :{{item.user }} {{item.username}}</li> 
						</ul>
					  </h6>
					</div>
			  </div>
		  </div>
		<div class="card-block">
			<div class="row"  style="background-color:white">
			  <div  class="col-xs-12 col-sm-12 col-md-12">
				  <p class="card-text"  style="color:black">{{item.text}}</p>
			  </div>
			</div>
			
		  </div>
		  <div class="card-footer " style="background-color:white">
			  {{item.ts * 1000 | timeAgo }}
			</div>
	  </div>
		</div> 
		<div *ngIf="loading" class="loader">Loading...</div> 
	</div>
	</virtual-scroll>
	
		
	`,
	styles: [`
	virtual-scroll,
	[virtualScroll] {
	  overflow: hidden;
	  overflow-y: auto;
	  border: 1px solid  rgb(209, 218, 223);
	  height: 75vh;
	  display: block;
	}
		.loader {
			height: 4em;
			display:block;
			line-height:4em;
			text-align:center;
			position:relative;
		   background-color:#F6F6F9;
		  }
		  .loader:before {
			content: ' ';
			position: absolute;
			top: 0;
			left: 0;
			width: 20%;
			height: 2px;
			background: #0029FF;
			animation: loader-animation 2s ease-out infinite;
		  }
	
		  @keyframes loader-animation {
			0% {
			  transform: translate(0%);
			}
			100% {
			  transform: translate(500%);
			}
		  }
	
		  
	
	`]
})

export class SeedComponent implements OnInit, OnChanges{

	@Input()
	items: MsgSlack[];
   
	 indices: ChangeEvent;
	 buffer: MsgSlack[];
	 ms: MsgSlack;
	 scrollItems: MsgSlack[] = [];
   
	 protected readonly bufferSize: number = 10;
	 protected timer: any;
	 protected loading: boolean;

	 constructor(private _service: SeedService) {
	 }
   
	 protected slackMsg() {
	   this._service.getScrollMessages()
		 .subscribe(res => {
		   console.log(res.has_more); // boolean function true or false when more
		   console.log(res);
		   console.log(res.messages); // array
		   console.log(this.scrollItems.length);
		   this.scrollItems = res.messages;
   
		 });
	 }
   
   
	 ngOnInit() {
		this.slackMsg();
	 }
   
	 ngOnChanges(changes: SimpleChanges) {
	   this.reset();
	 }
   
	 protected reset() {
	  // this.fetchNextChunk(this.scrollItems.length, 10).then(chunk => this.scrollItems = chunk);
	  this.fetchNextChunk(0, this.bufferSize, this.indices.end).then(chunk => this.scrollItems = chunk);
	 }
   
	 protected fetchMore(event: ChangeEvent) {
	   this.indices = event;
	   if (event.end === this.scrollItems.length) {return; }
	   this.loading = true;
	   this.fetchNextChunk(this.scrollItems.length, this.bufferSize, event).then(chunk => {
	  this.scrollItems = this.scrollItems.concat(chunk);
	   this.loading = false;
   
	   }, () => this.loading = false);
	 }
   
	 protected fetchNextChunk(skip: number, limit: number, event?: any): Promise<MsgSlack[]> {
	   return new Promise((resolve, reject) => {
		 clearTimeout(this.timer);
		 this.timer = setTimeout(() => {
		   if (skip < this.scrollItems.length) {
			 return resolve(this.scrollItems.slice(skip + 1, skip + limit));
		   }
		   reject();
		 }, 3000 + Math.random() * 1000);
	   });
	 }
   
}