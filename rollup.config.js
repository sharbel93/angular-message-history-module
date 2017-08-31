export default {
	entry: 'dist/index.js',
	dest: 'dist/bundles/angular-message-history-module.umd.js',
	sourceMap: false,
	format: 'umd',
	moduleName: 'ng.angular-message-history-module',
	globals: {
		'@angular/core': 'ng.core',
		'@angular/common': 'ng.common',
		'@angular/http': 'ng.http',
		'rxjs/Observable': 'Rx',
		'rxjs/ReplaySubject': 'Rx',
		'rxjs/add/operator/map': 'Rx.Observable.prototype',
		'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
		'rxjs/add/observable/fromEvent': 'Rx.Observable',
		'rxjs/add/observable/of': 'Rx.Observable',
		'angular2-virtual-scroll/dist': 'virtual-scroll',
		'time-ago-pipe': 'time-ago-pipe'
	}
}