(function () {
    var $ = jQuery;

    function handleLiveEditor () {

        $('.eicon-close, #pa-insert-live-temp').on('click', function () {
            $('.premium-live-editor-iframe-modal').css('display', 'none');
            minimizeModal($('.premium-live-editor-iframe-modal .premium-expand'));
        });

        $('#pa-insert-live-temp').on('click', function () {
            $('body').attr('data-pa-liveeditor-load', 'true');
        });

        $('.premium-live-editor-iframe-modal .premium-expand').on('click', function () {

            if ( $(this).find(' > i').hasClass('eicon-frame-expand') ) {
                $(this).find('i.eicon-frame-expand').removeClass('eicon-frame-expand').addClass('eicon-frame-minimize').attr('title', 'Minimize');
                $('.premium-live-editor-iframe-modal').addClass('premium-modal-expanded');

            } else {
                minimizeModal(this);
            }
        });

        elementor.channels.editor.on('createLiveTemp', function (e) {
            var widgetId = getTemplateKey(e),
                modalContainer = $('.premium-live-editor-iframe-modal'),
                paIframe = modalContainer.find("#pa-live-editor-control-iframe"),
                lightboxLoading = modalContainer.find(".dialog-lightbox-loading"),
                lightboxType = modalContainer.find(".dialog-type-lightbox"),
                tempSelectorId = e.model.attributes.name.split('_live')[0],
                liveTempId = ['premium_content_toggle_second_content_templates', 'fixed_template', 'right_side_template'].includes(tempSelectorId) ? 'live_temp_content_extra' : 'live_temp_content',
                settingsToChange = {};

            // multiscroll has two temps in each repeater item => both temps will have the same id so we need to distinguish one of them.
            if ('right_side_template' === tempSelectorId ) {
                widgetId += '2';
            }

            // show modal.
            lightboxType.show();
            modalContainer.show();
            lightboxLoading.show();
            paIframe.contents().find("#elementor-loading").show();
            paIframe.css("z-index", "-1");

            $.ajax({
                type: 'POST',
                url: liveEditor.ajaxurl,
                dataType: 'JSON',
                data: {
                    action: 'handle_live_editor',
                    security: liveEditor.nonce,
                    key: widgetId,
                },
                success: function (res) {

                    paIframe.attr("src", res.data.url);
                    $('#premium-live-temp-title').val(res.data.title);

                    paIframe.on("load", function () {
                        lightboxLoading.hide();
                        paIframe.show();
                        modalContainer.find('.premium-live-editor-title').css('display','flex');
                        paIframe.contents().find("#elementor-loading").hide();
                        paIframe.css("z-index", "1");
                    });

                    clearInterval(window.paLiveEditorInterval);

                    window.paLiveEditorInterval = setInterval(function () {

                        var  loadTemplate = $('body').attr('data-pa-liveeditor-load');

                        if ('true' === loadTemplate ) {
                            $('body').attr('data-pa-liveeditor-load', 'false');

                            settingsToChange[ tempSelectorId ] = '';
                            settingsToChange[ liveTempId ] = res.data.id;

                            $e.run('document/elements/settings', { container: e.container, settings: settingsToChange, options: { external: !0 } });

                            var tempTitle = $('#premium-live-temp-title').val();

                            if (tempTitle && tempTitle !== res.data.title ) {
                                updateTemplateTitle(tempTitle, res.data.id);
                            }
                        }
                    }, 1000);
                },
                error: function (err) {
                    console.log(err);
                }
            });
        });
    }

    /**
     * Generate the temp key
     * @param {Object} e click event
     * @return {string}
     */
    function getTemplateKey( e ) {
        var widget = e.options.container.view.$el,
            control_id = e._parent.model.attributes._id ? e._parent.model.attributes._id : e.model.cid;

        return widget.data('id') + control_id;
    }

    function minimizeModal( _this ) {

        $(_this).find('i.eicon-frame-minimize').removeClass('eicon-frame-minimize').addClass('eicon-frame-expand').attr('title', 'Expand');
        $('.premium-live-editor-iframe-modal').removeClass('premium-modal-expanded');
    }

    function updateTemplateTitle( title, id ) {

        $.ajax({
            type: 'POST',
            url: liveEditor.ajaxurl,
            dataType: 'JSON',
            data: {
                action: 'update_template_title',
                security: liveEditor.nonce,
                title: title,
                id: id
            },
            success: function (res) {
                console.log( 'Template Title Updated.');
            },
            error: function (err) {
                console.log(err);
            }
        });
    }

    $(window).on('elementor:init', handleLiveEditor);

})(jQuery);