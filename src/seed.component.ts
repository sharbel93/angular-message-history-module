import { Component, Input , OnChanges, SimpleChanges } from '@angular/core';
import { SeedService } from './seed.service';
import { ChangeEvent } from 'angular2-virtual-scroll';


export interface MsgSlack {
    text?: string;
    ts?: string;

  }

@Component({
	selector: 'seed-component',
	template: `
	< <virtual-scroll
  [items]="buffer"  (update)="scrollItems = $event" (end)="fetchMore($event)" style="height: 75vh; 
  display: block; background-color: #D3D3D3;">
  
<div class="row">
<div class="col-12 col-xs-12 col-sm-12 col-md-12">
        <div *ngFor="let item of myItems">
        <div class="card card-outline-info mb-1 border-0 "  style="background-color:white">
        <div class="card-header" style="background-color:white" Markdown>
                <div class="row">
                        <div class="col-12 col-xs-12 col-sm-12 col-md-12">
                        <h6><small><strong>{{item.ts * 1000 | date: 'fullDate'}}</strong></small></h6>
                        </div>
                </div>
               
        </div>
        <div class="card-block" style="background-color:white" Markdown>
        <ul class="list-group">
              <li class="list-group-item">
                      <div class="col-0 col-xs-0 col-sm-0 col-md-0">
                              <h6><small><strong>{{item.ts * 1000 | amDateFormat:'hh:mmA'}}</strong></small></h6>
                        </div>
                        <div class="col-10 col-xs-10 col-sm-10 col-md-10">
                 <p  class="card-text">{{item.text}}</p>
                        </div>
             </li>
        </ul>
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
  
        .card-text {
          overflow: hidden; 
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .card-text:hover {
          white-space: normal;
          height:auto;
         overflow: visible;
        }
	`]
})

export class SeedComponent implements  OnChanges{
	@Input() items: MsgSlack[];
	
		protected indices: ChangeEvent;
		protected buffer: MsgSlack[];
		protected scrollItems: MsgSlack[];
		protected myItems: MsgSlack[];
		protected readonly bufferSize: number = 10;
		protected timer: any;
		protected loading: boolean;
		constructor(private _service: SeedService) {
			this._service.getScrollMessages()
			.subscribe(res => {
				this.scrollItems = res.messages;
				this.myItems = res.messages;
			});
	}
	
	
	ngOnChanges(changes: SimpleChanges) {
		this.reset();
	}
	
	
		protected reset() {
			this.fetchNextChunk(0, this.bufferSize, {}).then(chunk => this.buffer = chunk);
		}
	
		protected fetchMore(event: ChangeEvent) {
			this.indices = event;
			if (event.end === this.buffer.length) {
				this.loading = true;
				this.fetchNextChunk(this.buffer.length, this.bufferSize, event).then(chunk => {
					this.buffer = this.buffer.concat(chunk);
					this.loading = false;
				}, () => this.loading = false);
			}
		}
	
		protected fetchNextChunk(skip: number, limit: number, event?: any): Promise< MsgSlack[]> {
			return new Promise((resolve, reject) => {
				clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					if (skip < this.items.length) {
						return resolve(this.items.slice(skip, skip + limit));
					}
					reject();
				}, 1000 + Math.random() * 1000);
			});
		}
	}