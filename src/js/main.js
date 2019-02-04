// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
require("angular");

var app = angular.module("common-core-search", []);

app.controller("commonCoreController", ["$scope", function($scope) {
  $scope.districtData = districtData;
  var all = districtData;

  $scope.districts = window.districtData;
  $scope.selected = all;
  $scope.schoolName = "";

  // Set Seattle Public Schools as default view
  $scope.city = $scope.districts.filter(function(d) {
    if (d.city == "Seattle") {
      return d;
    }
  })[0];

  //update selected from the district dropdown
  $scope.$watch("city", function() {
    $scope.schoolName = "";
    $scope.school = $scope.city;
  });
}]);

app.directive("typeSelect", function() {
  return {
    template: `
      <input ng-model="selection" placeholder="Enter district or county">
      <div class="completion">
        <div class="options">
          <a class="option" ng-repeat="option in filtered" ng-click="setValue(option)">
            {{option.city}} <span ng-if="option.county">({{option.county}})</span>
          </a>
        </div>
        <div class="nothing" ng-if="filtered.length == 0">
          <i class="fa fa-search"></i> No results found.
        </div>
      </div>
    `,
    restrict: "E",
    scope: {
      options: "=",
      model: "="
    },
    link: function(scope, element, attr) {
      var el = element[0];
      var input = el.querySelector("input");
      var cachedValue;
      var setValue = true;

      input.addEventListener("focus", function() {
        cachedValue = input.value;
        input.value = "";
        element.addClass("show-completion");
        scope.filtered = scope.options;
        setValue = false;
        scope.$apply();
      });

      // closes the drow-down menu after user clicks on something
      input.addEventListener("blur", function() {
        setTimeout(() => element.removeClass("show-completion"), 300);
        if (!input.value || !setValue) input.value = cachedValue;
      });

      input.addEventListener("keyup", function(e) {
        if (!input.value) {
          scope.filtered = scope.options;
          return;
        }
        var regex = new RegExp(input.value, "i");
        scope.filtered = scope.options.filter(d => d.city.match(regex));
        if (e.keyCode == 13) {
          input.blur();
          scope.setValue(scope.filtered[0]);
        }
        // scope.filtered = scope.filtered.slice(0, 10);
        scope.$apply();
      });

      scope.$watch("model", function() {
        var option = scope.options.filter(o => o == scope.model);
        option = option.pop();
        var label;
        if (!option) {
          // label = "Seattle Public Schools (King)";
          label = "Enter district or county"
        } else {
          label = option.city;
        }
        input.value = label;
      });

      scope.setValue = function(option) {
        setValue = true;
        // console.log("set", option);
        if (!option.city) return;
        input.value = option.city;
        scope.model = option;
      }
    }
  }
});
