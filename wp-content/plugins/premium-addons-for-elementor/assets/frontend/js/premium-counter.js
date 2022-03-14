(function ($) {

    var PremiumCounterHandler = function ($scope, $) {

        var $counterElement = $scope.find(".premium-counter");

        elementorFrontend.waypoint($counterElement, function () {

            var counterSettings = $counterElement.data(),
                incrementElement = $counterElement.find(".premium-counter-init"),
                iconElement = $counterElement.find(".icon");

            $(incrementElement).numerator(counterSettings);

            $(iconElement).addClass("animated " + iconElement.data("animation"));

        });

    };

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/premium-counter.default', PremiumCounterHandler);
    });
 })(jQuery);

