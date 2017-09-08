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

@Component({
	selector: 'seed-component',
	template: `
	<h2>{{title}}</h2>
	<div class="status">
	Showing <span class="badge badge-pill badge-default">({{myItems?.length}})</span> messages
  </div>
<virtual-scroll
[items]="scrollItems" (end)="fetchMore($event)" (update)="buffer = $event" style="height: 75vh; 
display: block; background-color: #D3D3D3;">
<div class="row">
			<div class="col-12 col-xs-12 col-sm-12 col-md-12">
<!-- use scrollItems for testing in the ngfor -->		
	<div *ngFor="let item of scrollItems" >
<div class="card card-outline-info mb-1 border-0 "  style="background-color:white">
		<div class="card-header"  style="background-color:white"> 
				<div class="row ">
						<div class="col-12 col-xs-12 col-sm-12 col-md-12">
												<div class="row">
													<div class="col-8 col-xs-8 col-sm-8 col-md-8"> <div *ngIf="item[0].length > 4"><h6>{{item[0][0]}}</h6></div> </div> 										 
												</div>
								<div class="row">
										<div class="col-6 col-xs-6 col-sm-6 col-md-6">
												<h6><small>{{item[1] * 1000 | date:'MMM dd'}} at {{item[1] * 1000 | date:'HH:mm'}} &bull; {{item[1]* 1000 | amTimeAgo }}</small> </h6>
										</div>						 
								</div> 
						</div>	
							</div>
				</div>
	<div class="card-block">
			<div class="row"  style="background-color:white">
				<div  class="col-12 col-xs-12 col-sm-12 col-md-12">
								<p class="card-text"  style="color:black" > {{item[0][4]}} </p>
										<p class="card-text"  style="color:black" > {{item[0][5]}} </p>
										<p class="card-text"  style="color:black" >{{item[0][6]}} </p>
										<p class="card-text"  style="color:black" >{{item[0][7]}} </p>
										<p class="card-text"  style="color:black" >{{item[0][8]}} </p>
										<p class="card-text"  style="color:black" > {{item[0][9]}} </p>
						<p class="card-text"  style="color:black" *ngIf="item[0].length == 1 ">{{item[0][0]}}{{item[0][1]}}{{item[0][2]}}{{item[0][3]}}{{item[0][4]}} </p>
				</div>
			</div>
			
		</div>
		<div class="card-footer " style="background-color:white">
			<div class="col-8 col-xs-8 col-sm-8 col-md-8"><h6><small> {{item[0][1]}} &bull;{{item[0][2]}}</small></h6></div>
			</div>
     </div> 
	  </div>
	 </div>
	</div>
	<div *ngIf="loading" class="loader">Loading...</div> 

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
   myItems: MsgSlack[];
	 indices: ChangeEvent;
	 buffer: MsgSlack[];
	 scrollItems: MsgSlack[] = [];
   
	 protected readonly bufferSize: number = 10;
	 protected timer: any;
	 protected loading: boolean;

	 constructor(private _service: SeedService) {
	 }
   
	 protected slackMsg() {
	   this._service.getScrollMessages()
		 .subscribe(res => {
			this.scrollItems = this.formatMsg(res.messages);
			this.myItems = res.messages;
   
		 });
	 }
   
   
	 ngOnInit() {
		this.slackMsg();
	 }
   
	 ngOnChanges(changes: SimpleChanges) {
	   this.reset();
	 }
   
	 protected reset() {
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
	 
	 protected formatMsg(msgs: any[]) {
		let arr: any[];
		arr = [];
		msgs.forEach(msg => {
			const m = msg.text.split('\n');
			const arrInner = [m, msg.ts];
			const p = msg.text;
					if (msg.subtype === 'bot_message') {
						arr.push(arrInner);
					}
		});
		return arr;
	}
}

