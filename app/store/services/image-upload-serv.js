'use strict';
angular.module('store')
.factory('ImageUpload', function ($log, $q, $ionicActionSheet, $ionicPopup, Config, BusyLoader, IonicClosePopupService) {

  $log.log('Hello from your Service: ImageUpload in module store');

  return {
    getImageSource: function () {
      var q = $q.defer();
      if (ionic.Platform.isIOS()) {
        var buttons = [];
        buttons.push({text: 'Camera'});
        buttons.push({text: 'Gallery'});
        $ionicActionSheet.show({
          buttons: buttons,
          titleText: 'Select source',
          cancelText: 'Cancel',
          cancel: function (err) {
            q.reject(err);
          },
          buttonClicked: function (index) {
            if (index > 0) {
              $log.log('Gallery');
              q.resolve(1);
            } else {
              $log.log('Camera');
              q.resolve(0);
            }

            // $log.log(ctrl.product.sizes[index]);
            return true;
          }
        });
      } else {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Select source', // String. The title of the popup.
          cancelText: 'Gallery', // String (default: 'Cancel'). The text of the Cancel button.
          cancelType: 'button-energized', // String (default: 'button-default'). The type of the Cancel button.
          okText: 'Camera', // String (default: 'OK'). The text of the OK button.
          okType: 'button-energized', // String (default: 'button-positive'). The type of the OK button.
        });
        IonicClosePopupService.register(confirmPopup);

        confirmPopup.then(function (res) {
          if (res === false) {
            $log.log('Gallery');
            q.resolve(1);
          } else if (res === true) {
            $log.log('Camera');
            q.resolve(0);
          } else {
            q.reject('Pop up closed');
          }
        })
        .catch(function (err) {
          $log.log(err);
          q.reject(err);
        });
      }

      return q.promise;
    },
    getPicture: function (source) {
      var q = $q.defer();
      var sourceType = navigator.camera.PictureSourceType.CAMERA;
      if (source > 0) {
        // Gallery
        sourceType = navigator.camera.PictureSourceType.SAVEDPHOTOALBUM;
      }
      var options = {
        quality: 100,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: sourceType,
        encodingType: navigator.camera.EncodingType.JPEG,
        correctOrientation: true,
        saveToPhotoAlbum: true,
        targetWidth: 800,
        targetHeight: 800,
        cameraDirection: 1,
        allowEdit: true
      };
      navigator.camera.getPicture(function (result) {
        q.resolve(result);
      }, function (err) {
        q.reject(err);
      }, options);

      return q.promise;
    },
    uploadToCloudinary: function (url) {
      BusyLoader.show();
      var q = $q.defer();
      var timestamp = Math.floor(Date.now() / 1000);
      var cloudnaryCredential = {};
      // eslint-disable-next-line camelcase
      cloudnaryCredential.api_key = Config.ENV.CLOUDINARY.API_KEY;
      // eslint-disable-next-line camelcase
      cloudnaryCredential.timestamp = timestamp;
      // eslint-disable-next-line no-undef
      // eslint-disable-next-line camelcase
      cloudnaryCredential.upload_preset = 'xnln9ol0';

      // eslint-disable-next-line no-undef
      var options = new FileUploadOptions();
      options.fileKey = 'file';
      options.fileName = url.substr(url.lastIndexOf('/') + 1);
      options.mimeType = 'image/jpeg';
      options.chunkedMode = true;
      options.params = cloudnaryCredential;

      // eslint-disable-next-line no-undef
      var fileTransfer = new FileTransfer();
      fileTransfer.upload(
        url,
        encodeURI('https://api.cloudinary.com/v1_1/' + Config.ENV.CLOUDINARY.CLOUD_NAME + '/image/upload'),
        function (response) {
          q.resolve(JSON.parse(response.response).url);
        },
        function (err) {
          q.reject(err);
        },
        options
      );
      return q.promise;
    }
  };
});
