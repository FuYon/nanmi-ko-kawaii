(function ($) {

    var PremiumCarouselHandler = function ($scope, $) {

        var $carouselElem = $scope.find(".premium-carousel-wrapper"),
            settings = $($carouselElem).data("settings"),
            isEdit = elementorFrontend.isEditMode();

        function slideToShow(slick) {

            var slidesToShow = slick.options.slidesToShow,
                windowWidth = $(window).width();
            if (windowWidth > settings.tabletBreak) {
                slidesToShow = settings.slidesDesk;
            }
            if (windowWidth <= settings.tabletBreak) {
                slidesToShow = settings.slidesTab;
            }
            if (windowWidth <= settings.mobileBreak) {
                slidesToShow = settings.slidesMob;
            }
            return slidesToShow;

        }

        //Get templates content on the editor page
        if (isEdit) {

            $carouselElem.find(".item-wrapper").each(function (index, slide) {

                var templateID = $(slide).data("template");

                if (undefined !== templateID) {
                    $.ajax({
                        type: "GET",
                        url: PremiumSettings.ajaxurl,
                        dataType: "html",
                        data: {
                            action: "get_elementor_template_content",
                            templateID: templateID
                        }
                    }).success(function (response) {

                        var data = JSON.parse(response).data;

                        if (undefined !== data.template_content) {

                            $(slide).html(data.template_content);
                            $carouselElem.find(".premium-carousel-inner").slick("refresh");

                        }
                    });
                }
            });

        }

        $carouselElem.on("init", function (event) {

            event.preventDefault();

            setTimeout(function () {
                resetAnimations("init");
            }, 500);

            $(this).find("item-wrapper.slick-active").each(function () {
                var $this = $(this);
                $this.addClass($this.data("animation"));
            });

            $(".slick-track").addClass("translate");

        });

        $carouselElem.find(".premium-carousel-inner").slick({
            vertical: settings.vertical,
            slidesToScroll: settings.slidesToScroll,
            slidesToShow: settings.slidesToShow,
            responsive: [{
                breakpoint: settings.tabletBreak,
                settings: {
                    slidesToShow: settings.slidesTab,
                    slidesToScroll: settings.slidesTab,
                    swipe: settings.touchMove,
                }
            },
            {
                breakpoint: settings.mobileBreak,
                settings: {
                    slidesToShow: settings.slidesMob,
                    slidesToScroll: settings.slidesMob,
                    swipe: settings.touchMove,
                }
            }
            ],
            useTransform: true,
            fade: settings.fade,
            infinite: settings.infinite,
            speed: settings.speed,
            autoplay: settings.autoplay,
            autoplaySpeed: settings.autoplaySpeed,
            rows: 0,
            draggable: settings.draggable,
            rtl: settings.rtl,
            adaptiveHeight: settings.adaptiveHeight,
            pauseOnHover: settings.pauseOnHover,
            centerMode: settings.centerMode,
            centerPadding: settings.centerPadding,
            arrows: settings.arrows,
            prevArrow: $carouselElem.find(".premium-carousel-nav-arrow-prev").html(),
            nextArrow: $carouselElem.find(".premium-carousel-nav-arrow-next").html(),
            dots: settings.dots,
            variableWidth: settings.variableWidth,
            cssEase: settings.cssEase,
            customPaging: function () {
                var customDot = $carouselElem.find(".premium-carousel-nav-dot").html();
                return customDot;
            }
        });

        if (settings.variableWidth) {
            $carouselElem.find(".elementor-container").css("flex-wrap", "nowrap");
        }

        function resetAnimations(event) {

            var $slides = $carouselElem.find(".slick-slide");

            if ("init" === event)
                $slides = $slides.not(".slick-current");

            $slides.find(".animated").each(function (index, elem) {

                var settings = $(elem).data("settings");

                if (!settings)
                    return;

                if (!settings._animation && !settings.animation)
                    return;

                var animation = settings._animation || settings.animation;

                $(elem).removeClass("animated " + animation).addClass("elementor-invisible");
            });
        };

        function triggerAnimation() {

            $carouselElem.find(".slick-active .elementor-invisible").each(function (index, elem) {

                var settings = $(elem).data("settings");

                if (!settings)
                    return;

                if (!settings._animation && !settings.animation)
                    return;

                var delay = settings._animation_delay ? settings._animation_delay : 0,
                    animation = settings._animation || settings.animation;

                setTimeout(function () {
                    $(elem).removeClass("elementor-invisible").addClass(animation +
                        ' animated');
                }, delay);
            });
        }

        $carouselElem.on("afterChange", function (event, slick, currentSlide) {

            var slidesScrolled = slick.options.slidesToScroll,
                slidesToShow = slideToShow(slick),
                centerMode = slick.options.centerMode,
                slideToAnimate = currentSlide + slidesToShow - 1;

            //Trigger Aniamtions for the current slide
            triggerAnimation();

            if (slidesScrolled === 1) {
                if (!centerMode === true) {
                    var $inViewPort = $(this).find("[data-slick-index='" + slideToAnimate +
                        "']");
                    if ("null" != settings.animation) {
                        $inViewPort.find("p, h1, h2, h3, h4, h5, h6, span, a, img, i, button")
                            .addClass(settings.animation).removeClass(
                                "premium-carousel-content-hidden");
                    }
                }
            } else {
                for (var i = slidesScrolled + currentSlide; i >= 0; i--) {
                    $inViewPort = $(this).find("[data-slick-index='" + i + "']");
                    if ("null" != settings.animation) {
                        $inViewPort.find("p, h1, h2, h3, h4, h5, h6, span, a, img, i, button")
                            .addClass(settings.animation).removeClass(
                                "premium-carousel-content-hidden");
                    }
                }
            }
        });

        $carouselElem.on("beforeChange", function (event, slick, currentSlide) {

            //Reset Aniamtions for the other slides
            resetAnimations();

            var $inViewPort = $(this).find("[data-slick-index='" + currentSlide + "']");

            if ("null" != settings.animation) {
                $inViewPort.siblings().find(
                    "p, h1, h2, h3, h4, h5, h6, span, a, img, i, button").removeClass(
                        settings.animation).addClass(
                            "premium-carousel-content-hidden");
            }
        });

        if (settings.vertical) {

            var maxHeight = -1;

            elementorFrontend.elements.$window.on('load', function () {
                $carouselElem.find(".slick-slide").each(function () {
                    if ($(this).height() > maxHeight) {
                        maxHeight = $(this).height();
                    }
                });
                $carouselElem.find(".slick-slide").each(function () {
                    if ($(this).height() < maxHeight) {
                        $(this).css("margin", Math.ceil(
                            (maxHeight - $(this).height()) / 2) + "px 0");
                    }
                });
            });
        }
        var marginFix = {
            element: $("a.ver-carousel-arrow"),
            getWidth: function () {
                var width = this.element.outerWidth();
                return width / 2;
            },
            setWidth: function (type) {
                type = type || "vertical";
                if (type == "vertical") {
                    this.element.css("margin-left", "-" + this.getWidth() + "px");
                } else {
                    this.element.css("margin-top", "-" + this.getWidth() + "px");
                }
            }
        };
        marginFix.setWidth();
        marginFix.element = $("a.carousel-arrow");
        marginFix.setWidth("horizontal");

        $(document).ready(function () {

            settings.navigation.map(function (item, index) {

                if (item) {

                    $(item).on("click", function () {

                        var currentActive = $carouselElem.find(".premium-carousel-inner").slick("slickCurrentSlide");

                        if (index !== currentActive) {
                            $carouselElem.find(".premium-carousel-inner").slick("slickGoTo", index)
                        }

                    })
                }

            })
        })

    };

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/premium-carousel-widget.default', PremiumCarouselHandler);
    });
})(jQuery);

