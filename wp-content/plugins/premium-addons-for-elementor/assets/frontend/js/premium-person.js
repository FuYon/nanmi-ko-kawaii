(function($){
    $(window).on('elementor/frontend/init', function () {

        var PremiumTeamMembersHandler = elementorModules.frontend.handlers.Base.extend({

            getDefaultSettings: function () {

                return {
                    slick: {
                        infinite: true,
                        rows: 0,
                        prevArrow: '<a type="button" data-role="none" class="carousel-arrow carousel-prev" aria-label="Next" role="button" style=""><i class="fas fa-angle-left" aria-hidden="true"></i></a>',
                        nextArrow: '<a type="button" data-role="none" class="carousel-arrow carousel-next" aria-label="Next" role="button" style=""><i class="fas fa-angle-right" aria-hidden="true"></i></a>',
                        draggable: true,
                        pauseOnHover: true,
                    },
                    selectors: {
                        multiplePersons: '.multiple-persons',
                        person: '.premium-person-container',
                        imgContainer: '.premium-person-image-container',
                        imgWrap: '.premium-person-image-wrap'

                    }
                }
            },

            getDefaultElements: function () {

                var selectors = this.getSettings('selectors');

                return {
                    $multiplePersons: this.$element.find(selectors.multiplePersons),
                    $persons: this.$element.find(selectors.person),
                    $imgWrap: this.$element.find(selectors.imgWrap),
                }

            },
            bindEvents: function () {
                this.run();
            },
            getSlickSettings: function () {

                var settings = this.getElementSettings(),
                    rtl = this.elements.$multiplePersons.data("rtl"),
                    colsNumber = settings.persons_per_row,
                    colsTablet = settings.persons_per_row_tablet,
                    colsMobile = settings.persons_per_row_mobile;

                return Object.assign(this.getSettings('slick'), {

                    slidesToShow: parseInt(100 / colsNumber.substr(0, colsNumber.indexOf('%'))),
                    slidesToScroll: parseInt(100 / colsNumber.substr(0, colsNumber.indexOf('%'))),
                    responsive: [{
                        breakpoint: 1025,
                        settings: {
                            slidesToShow: parseInt(100 / colsTablet.substr(0, colsTablet.indexOf('%'))),
                            slidesToScroll: 1
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: parseInt(100 / colsMobile.substr(0, colsMobile.indexOf('%'))),
                            slidesToScroll: 1
                        }
                    }
                    ],
                    autoplay: settings.carousel_play,
                    rtl: rtl ? true : false,
                    autoplaySpeed: settings.speed || 5000,

                });


            },

            runEqualHeight: function () {

                var $persons = this.elements.$persons,
                    $imgWrap = this.elements.$imgWrap;

                var selectors = this.getSettings('selectors'),
                    heights = new Array();

                $persons.each(function (index, person) {
                    $(person).imagesLoaded(function () { }).done(function () {

                        var imageHeight = $(person).find(selectors.imgContainer).outerHeight();

                        heights.push(imageHeight);
                    });
                });

                $persons.imagesLoaded(function () { }).done(function () {
                    var maxHeight = Math.max.apply(null, heights);
                    $imgWrap.css("height", maxHeight + "px");
                });

            },

            run: function () {

                var $multiplePersons = this.elements.$multiplePersons;

                if (!$multiplePersons.length) return;

                var carousel = this.getElementSettings('carousel');

                if (carousel)
                    $multiplePersons.slick(this.getSlickSettings());

                if ($multiplePersons.hasClass("premium-person-style1")) return;

                if ("yes" !== $multiplePersons.data("persons-equal")) return;

                this.runEqualHeight();

            }

        });

        elementorFrontend.elementsHandler.attachHandler('premium-addon-person', PremiumTeamMembersHandler);
    });
})(jQuery);