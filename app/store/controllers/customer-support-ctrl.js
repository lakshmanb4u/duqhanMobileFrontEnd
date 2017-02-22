'use strict';
angular.module('store')
.controller('CustomerSupportCtrl', function ($log, $state, $rootScope, Store) {

  /* Storing contextual this in a variable for easy access */

  var ctrl = this;

  $log.log('Hello from your Controller: ProfileCtrl in module store:. This is your controller:', ctrl);

  /*====================================================
  =            Support question and answers            =
  ====================================================*/

  /*----------  Initialize faq object  ----------*/

  ctrl.faqs = [];

  /*----------  Get the whole faq data from json  ----------*/

  ctrl.getFAQ = function () {
    ctrl.faqs = [];
    if ($state.params.p) {
      $log.log('found id');
      ctrl.faqs = JSON.parse($state.params.p);
      angular.forEach(ctrl.faqs, function (value, key) {
        if (ctrl.faqs[key].child) {
          ctrl.faqs[key].child = JSON.stringify(ctrl.faqs[key].child);
        }
      });
      $log.log(ctrl.faqs);
    } else {
      Store.getFAQ()
      .then(function (response) {
        ctrl.faqs = response.data;
        angular.forEach(ctrl.faqs, function (value, key) {
          ctrl.faqs[key].child = JSON.stringify(ctrl.faqs[key].child);
        });
        $log.log('not found id');
        $log.log(ctrl.faqs);
      })
      .catch(function (response) {
        $log.log(response);
      });
    }
  };

  ctrl.getFAQ();

  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
    $log.log('toState:', toState);
    $log.log('toState:', toParams);
    if (toState.name === 'store.customersupport') {
      ctrl.getFAQ();
    }
  });

  /*=====  End of Support question and answers  ======*/
});
