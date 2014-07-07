angular.module('lcs.directives', [])
	.directive('progressBar', function () {
		return {
			restrict: 'E',
			template: '<div class="progress-bar-animated"><div class="ball"></div><div class="ball"></div><div class="ball"></div><div class="ball"></div><div class="ball"></div><div class="ball"></div><div class="ball"></div></div>'
		};
	})