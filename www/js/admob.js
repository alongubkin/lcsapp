var isMobile = {
    Android: function() {
        return /Android/i.test(navigator.userAgent);
    },
    BlackBerry: function() {
        return /BlackBerry/i.test(navigator.userAgent);
    },
    iOS: function() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    },
    Windows: function() {
        return /IEMobile/i.test(navigator.userAgent);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
    }
};

document.addEventListener("deviceready", function () {
  var admob_ios_key = 'ca-app-pub-2708584265734479/3881395540';
  var admob_android_key = 'ca-app-pub-2708584265734479/7188115543';
  var admob_wp8_key = 'ca-app-pub-2708584265734479/8311595140';
  
  var adId;
  
  if (isMobile.Android()) {
    adId = admob_android_key;
  } else if (isMobile.iOS()) {
    adId = admob_ios_key;
  } else if (isMobile.Windows()) {
    adId = admob_wp8_key;
  }
  
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