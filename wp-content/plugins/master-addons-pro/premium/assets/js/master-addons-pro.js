/*
* Frontend Script for Elementor
*/
; (function ($) {
    "use strict";

    var Master_Addons_Pro = {

    }
    $(window).on('elementor/frontend/init', function () {

        if (elementorFrontend.isEditMode()) {
            editMode = true;
        }

        // elementorFrontend.hooks.addAction('frontend/element_ready/jltma-product-review.default', Master_Addons_Pro.Product_Review);/

    });

})(jQuery);
