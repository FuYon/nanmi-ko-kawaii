( function ( $ ) {


    var WidgetLAESliderHandler = function ( $scope, $ ) {

        var slider_elem = $scope.find( '.lae-slider' ).eq( 0 );

        var settings = slider_elem.data( 'settings' );

        var $slider = slider_elem.find( '.lae-flexslider' );

        $slider.flexslider( {
            selector: ".lae-slides > .lae-slide",
            animation: settings['slide_animation'],
            direction: settings['direction'],
            slideshowSpeed: settings['slideshow_speed'],
            animationSpeed: settings['animation_speed'],
            namespace: "lae-flex-",
            pauseOnAction: settings['pause_on_action'],
            pauseOnHover: settings['pause_on_hover'],
            controlNav: settings['control_nav'],
            directionNav: settings['direction_nav'],
            prevText: "Previous<span></span>",
            nextText: "Next<span></span>",
            smoothHeight: false,
            animationLoop: true,
            slideshow: settings['slideshow'],
            easing: "swing",
            randomize: settings['randomize'],
            animationLoop: settings['loop'],
            controlsContainer: "lae-slider"
        } );


    };


    // Make sure you run this code under Elementor..
    $( window ).on( 'elementor/frontend/init', function () {


        elementorFrontend.hooks.addAction( 'frontend/element_ready/lae-slider.default', WidgetLAESliderHandler );


    } );

} )( jQuery );