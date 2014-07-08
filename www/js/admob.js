document.addEventListener("deviceready", function () {
  var admob_ios_key = '';
  var admob_android_key = 'ca-app-pub-2708584265734479/7188115543';
  var adId = (navigator.userAgent.indexOf('Android') >=0) ? admob_android_key : admob_ios_key;

  if (window.plugins && window.plugins.AdMob) {
    var am = window.plugins.AdMob;

    am.createBannerView({
      'publisherId': adId,
      'adSize': am.AD_SIZE.BANNER,
      'bannerAtTop': false,
      'overlap': false
    }, function() {
      am.requestAd(
        { 'isTesting': false }, 
        function () { am.showAd(true); }, 
        function(){ console.log('failed to request ad'); });
    }, function(){ console.log('failed to create banner view'); });
  }
}, false);