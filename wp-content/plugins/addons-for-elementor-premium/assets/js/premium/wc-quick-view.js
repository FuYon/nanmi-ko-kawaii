( function ( $ ) {

    if (typeof lae_ajax_object === 'undefined' || typeof lae_js_vars === 'undefined') {
        return false;
    }

    /**
     * Open quick view.
     */
    $( document ).on( 'click', '.lae-quick-view', function ( e ) {
        e.preventDefault();

        var $this = $( this ),
            product_id = $( this ).data( 'product_id' );

        $.fancybox.open( {
            src: lae_ajax_object.ajax_url + '?action=lae_product_quick_view&product_id=' + product_id,
            type: 'ajax',
            opts: {
                afterLoad: function ( instance, current ) {

                    qvContent = $( '#lae-qv-content' );
                    // Variation Form
                    var formVariation = qvContent.find( '.variations_form' );

                    formVariation.trigger( 'check_variations' );
                    formVariation.trigger( 'reset_image' );

                    var variationForm = qvContent.find( '.variations_form' );

                    if (variationForm.length > 0) {
                        variationForm.wc_variation_form();
                        variationForm.find( 'select' ).change();
                    }

                    var sliderWrapper = qvContent.find( '.lae-qv-images' );

                    if (sliderWrapper.find( 'li' ).length > 1) {
                        sliderWrapper.flexslider( {
                            animation: "slide",
                            selector: 'ul.lae-qv-slides > li',

                        } );
                    }

                    // If grouped product
                    var grouped = qvContent.find( 'form.grouped_form' );
                    if (grouped) {
                        var groupedProductUrl = qvContent.find( 'form.grouped_form' ).attr( 'action' );
                        grouped.find( '.group_table, button.single_add_to_cart_button' ).hide();
                        grouped.append( ' <a href="' + groupedProductUrl + '" class="button">' + lae_js_vars.grouped_text + '</a>' );
                    }
                }
            }

        } );

    } );

    /**
     * AddToCartHandler class.
     */
    var laeQVAddToCartHandler = function () {
        $( document.body )
            .on( 'click', '#lae-qv-content .product:not(.product-type-external) .single_add_to_cart_button', this.onAddToCart )
            .on( 'added_to_cart', this.updateButton );
    };

    /**
     * Handle the add to cart event.
     */
    laeQVAddToCartHandler.prototype.onAddToCart = function ( e ) {
        e.preventDefault();

        var button = $( this ),
            productId = $( this ).val(),
            variationId = $( 'input[name="variation_id"]' ).val(),
            quantity = $( 'input[name="quantity"]' ).val(),
            variationForm = $( this ).closest( '.variations_form' ),
            variations = variationForm.find( 'select[name^=attribute]' ),
            item = {};

        button.removeClass( 'added' );
        button.addClass( 'loading' );

        if (!variations.length) {
            variations = variationForm.find( '[name^=attribute]:checked' );
        }

        if (!variations.length) {
            variations = variationForm.find( 'input[name^=attribute]' );
        }

        variations.each( function () {
            var $this = $( this ),
                attributeName = $this.attr( 'name' ),
                attributevalue = $this.val(),
                index,
                attributeTaxName;

            $this.removeClass( 'error' );

            if (attributevalue.length === 0) {
                index = attributeName.lastIndexOf( '_' );
                attributeTaxName = attributeName.substring( index + 1 );
                $this.addClass( 'required error' ).before( 'Please select ' + attributeTaxName + '' );
            } else {
                item[attributeName] = attributevalue;
            }
        } );

        // Ajax action.
        if (variationId != '') {
            $.ajax( {
                url: lae_ajax_object.ajax_url,
                type: 'POST',
                data: {
                    action: 'lae_add_cart_single_product',
                    product_id: productId,
                    variation_id: variationId,
                    variation: item,
                    quantity: quantity
                },

                success: function ( results ) {
                    $( document.body ).trigger( 'wc_fragment_refresh' );
                    $( document.body ).trigger( 'added_to_cart', [ results.fragments, results.cart_hash, button ] );

                    // Redirect to cart option
                    if (wc_add_to_cart_params.cart_redirect_after_add === 'yes') {
                        window.location = wc_add_to_cart_params.cart_url;
                        return;
                    }
                }
            } );
        } else {
            $.ajax( {
                url: lae_ajax_object.ajax_url,
                type: 'POST',
                data: {
                    action: 'lae_add_cart_single_product',
                    product_id: productId,
                    quantity: quantity
                },

                success: function ( results ) {
                    $( document.body ).trigger( 'wc_fragment_refresh' );
                    $( document.body ).trigger( 'added_to_cart', [ results.fragments, results.cart_hash, button ] );

                    // Redirect to cart option
                    if (lae_js_vars.cart_redirect_after_add === 'yes') {
                        window.location = lae_js_vars.cart_url;
                        return;
                    }
                }
            } );
        }
    };

    /**
     * Update cart page elements after add to cart events.
     */
    laeQVAddToCartHandler.prototype.updateButton = function ( e, fragments, cart_hash, $button ) {
        $button = typeof $button === 'undefined' ? false : $button;

        if ($button) {
            $button.removeClass( 'loading' );
            $button.addClass( 'added' );

            // View cart text.
            if (!lae_js_vars.is_cart && $button.parent().find( '.added_to_cart' ).length === 0) {
                $button.after( ' <a href="' + lae_js_vars.cart_url + '" class="added_to_cart wc-forward" title="' +
                    lae_js_vars.view_cart + '">' + lae_js_vars.view_cart + '</a>' );
            }
        }
    };

    /**
     * Init laeAddToCartHandler.
     */
    new laeQVAddToCartHandler();

} )( jQuery );