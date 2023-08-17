(function ($) {
    "use strict";

    if (!$.apusThemeExtensions)
        $.apusThemeExtensions = {};
    
    function ApusThemeCore() {
        var self = this;
        self.init();
    };

    ApusThemeCore.prototype = {
        /**
         *  Initialize
         */
        init: function() {
            var self = this;
            
            // slick init
            self.initSlick($("[data-carousel=slick]"));

            // Unveil init
            setTimeout(function(){
                self.layzyLoadImage();
            }, 500);

            // isoto
            self.initIsotope();
            self.initCounterUp();

            // Sticky Header
            self.intChangeHeaderMarginTop();
            self.initHeaderSticky();

            // back to top
            self.backToTop();

            // popup image
            self.popupImage();

            self.preloadSite();
            
            self.initGmap3();

            $('[data-toggle="tooltip"]').tooltip();

            // perfectScrollbar
            $('.main-menu-top').perfectScrollbar();

            // roadmap
            self.roadMapInit();
            
            setTimeout(function(){
                self.initVcrtl();
            }, 100);
            $(window).resize(function(){
                self.initVcrtl();
            });

            self.initPopupNewsletter();

            self.initMobileMenu();

            
            $('#primary-menu li a').on( 'click', function(e){
                var id = $(this).attr('href');
                if (id.match("^#")) {
                    if ( $(id).length > 0 ) {
                        $('html, body').animate({scrollTop: $(id).offset().top-100 }, 800);
                        return false;
                    }
                } else if(  id != '#'){
                    window.location.href = id;
                }
            });

            self.particlesInit();

            self.loadExtension();
        },
        /**
         *  Extensions: Load scripts
         */
        loadExtension: function() {
            var self = this;
            
            if ($.apusThemeExtensions.shop) {
                $.apusThemeExtensions.shop.call(self);
            }
            
        },
        initSlick: function(element) {
            var self = this;
            element.each( function(){
                var config = {
                    infinite: false,
                    arrows: $(this).data( 'nav' ),
                    dots: $(this).data( 'pagination' ),
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    prevArrow:"<button type='button' class='slick-arrow slick-prev pull-left'><i class='fa fa-angle-left' aria-hidden='true'></i></span><span class='textnav'>"+itok_opts.previous+"</span></button>",
                    nextArrow:"<button type='button' class='slick-arrow slick-next pull-right'><span class='textnav'>"+itok_opts.next+"</span><i class='fa fa-angle-right' aria-hidden='true'></i></button>",
                };
            
                var slick = $(this);
                if( $(this).data('items') ){
                    config.slidesToShow = $(this).data( 'items' );
                    config.slidesToScroll = $(this).data( 'items' );
                }
                if( $(this).data('infinite') ){
                    config.infinite = true;
                }
                if( $(this).data('vertical') ){
                    config.vertical = true;
                }
                if( $(this).data('rows') ){
                    config.rows = $(this).data( 'rows' );
                }
                if( $(this).data('asnavfor') ){
                    config.asNavFor = $(this).data( 'asnavfor' );
                }
                if( $(this).data('slidestoscroll') ){
                    config.slidesToScroll = $(this).data( 'slidestoscroll' );
                }
                if( $(this).data('focusonselect') ){
                    config.focusOnSelect = $(this).data( 'focusonselect' );
                }
                if ($(this).data('large')) {
                    var desktop = $(this).data('large');
                } else {
                    var desktop = config.items;
                }
                if ($(this).data('smalldesktop')) {
                    var smalldesktop = $(this).data('smalldesktop');
                } else {
                    if ($(this).data('large')) {
                        var smalldesktop = $(this).data('large');
                    } else{
                        var smalldesktop = config.items;
                    }
                }
                if ($(this).data('medium')) {
                    var medium = $(this).data('medium');
                } else {
                    var medium = config.items;
                }
                if ($(this).data('smallmedium')) {
                    var smallmedium = $(this).data('smallmedium');
                } else {
                    var smallmedium = 2;
                }
                if ($(this).data('extrasmall')) {
                    var extrasmall = $(this).data('extrasmall');
                } else {
                    var extrasmall = 1;
                }
                if ($(this).data('smallest')) {
                    var smallest = $(this).data('smallest');
                } else {
                    var smallest = 1;
                }
                config.responsive = [
                    {
                        breakpoint: 321,
                        settings: {
                            slidesToShow: smallest,
                            slidesToScroll: smallest,
                        }
                    },
                    {
                        breakpoint: 481,
                        settings: {
                            slidesToShow: extrasmall,
                            slidesToScroll: extrasmall,
                        }
                    },
                    {
                        breakpoint: 769,
                        settings: {
                            slidesToShow: smallmedium,
                            slidesToScroll: smallmedium
                        }
                    },
                    {
                        breakpoint: 981,
                        settings: {
                            slidesToShow: medium,
                            slidesToScroll: medium
                        }
                    },
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: smalldesktop,
                            slidesToScroll: smalldesktop
                        }
                    },
                    {
                        breakpoint: 1501,
                        settings: {
                            slidesToShow: desktop,
                            slidesToScroll: desktop
                        }
                    }
                ];
                if ( $('html').attr('dir') == 'rtl' ) {
                    config.rtl = true;
                }

                $(this).slick( config );

            } );

            // Fix owl in bootstrap tabs
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                var target = $(e.target).attr("href");
                var $slick = $("[data-carousel=slick]", target);

                if ($slick.length > 0 && $slick.hasClass('slick-initialized')) {
                    $slick.slick('refresh');
                }
                self.layzyLoadImage();
            });
        },
        layzyLoadImage: function() {
            $(window).off('scroll.unveil resize.unveil lookup.unveil');
            var $images = $('.image-wrapper:not(.image-loaded) .unveil-image'); // Get un-loaded images only
            if ($images.length) {
                $images.unveil(1, function() {
                    $(this).load(function() {
                        $(this).parents('.image-wrapper').first().addClass('image-loaded');
                        $(this).removeAttr('data-src');
                        $(this).removeAttr('data-srcset');
                        $(this).removeAttr('data-sizes');
                    });
                });
            }

            var $images = $('.product-image:not(.image-loaded) .unveil-image'); // Get un-loaded images only
            if ($images.length) {
                $images.unveil(1, function() {
                    $(this).load(function() {
                        $(this).parents('.product-image').first().addClass('image-loaded');
                    });
                });
            }
        },
        initCounterUp: function() {
            if($('.counterUp').length > 0){
                $('.counterUp').counterUp({
                    delay: 10,
                    time: 800
                });
            }
        },
        initIsotope: function() {
            $('.isotope-items').each(function(){  
                var $container = $(this);
                
                $container.imagesLoaded( function(){
                    $container.isotope({
                        itemSelector : '.isotope-item',
                        transformsEnabled: true,         // Important for videos
                        masonry: {
                            columnWidth: $container.data('columnwidth')
                        }
                    }); 
                });
            });

            /*---------------------------------------------- 
             *    Apply Filter        
             *----------------------------------------------*/
            $('.isotope-filter li a').on('click', function(){
               
                var parentul = $(this).parents('ul.isotope-filter').data('related-grid');
                $(this).parents('ul.isotope-filter').find('li a').removeClass('active');
                $(this).addClass('active');
                var selector = $(this).attr('data-filter'); 
                $('#'+parentul).isotope({ filter: selector }, function(){ });
                
                return(false);
            });
        },
        changeHeaderMarginTop: function() {
            if ($(window).width() > 991) {
                if ( $('.main-sticky-header').length > 0 ) {
                    var header_height = $('.main-sticky-header').outerHeight();
                    $('.main-sticky-header-wrapper').css({'height': header_height});
                }
            }
        },
        intChangeHeaderMarginTop: function() {
            var self = this;
            setTimeout(function(){
                self.changeHeaderMarginTop();
            }, 50);
            $(window).resize(function(){
                self.changeHeaderMarginTop();
            });
        },
        initHeaderSticky: function() {
            var self = this;
            var main_sticky = $('.main-sticky-header');
            setTimeout(function(){
                if ( main_sticky.length > 0 ){
                    if ($(window).width() > 991) {
                        var _menu_action = main_sticky.offset().top;
                        $(window).scroll(function(event) {
                            self.headerSticky(main_sticky, _menu_action);
                        });
                        self.headerSticky(main_sticky, _menu_action);
                    }
                }
            }, 50);
        },
        headerSticky: function(main_sticky, _menu_action) {
            if( $(document).scrollTop() > _menu_action ){
                main_sticky.addClass('sticky-header');
            }else{
                main_sticky.removeClass('sticky-header');
            }
        },
        backToTop: function () {
            $(window).scroll(function () {
                if ($(this).scrollTop() > 400) {
                    $('#back-to-top').addClass('active');
                } else {
                    $('#back-to-top').removeClass('active');
                }
            });
            $('#back-to-top').on('click', function () {
                $('html, body').animate({scrollTop: '0px'}, 800);
                return false;
            });
        },
        popupImage: function() {
            // popup
            $(".popup-image").magnificPopup({type:'image'});
            $('.popup-video').magnificPopup({
                disableOn: 700,
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 160,
                preloader: false,
                fixedContentPos: false
            });

            $('.widget-gallery').each(function(){
                var tagID = $(this).attr('id');
                $('#' + tagID).magnificPopup({
                    delegate: '.popup-image-gallery',
                    type: 'image',
                    tLoading: 'Loading image #%curr%...',
                    mainClass: 'mfp-img-mobile',
                    gallery: {
                        enabled: true,
                        navigateByImgClick: true,
                        preload: [0,1] // Will preload 0 - before current, and 1 after the current image
                    }
                });
            });
        },
        preloadSite: function() {
            // preload page
            if ( $('body').hasClass('apus-body-loading') ) {
                var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;
                var preloader = $('#preloader');

                if (!isMobile) {
                    setTimeout(function() {
                        preloader.addClass('preloaded');
                    }, 800);
                    setTimeout(function() {
                        preloader.remove();
                        $('body').removeClass('apus-body-loading');
                    }, 2000);
                } else {
                    preloader.remove();
                    $('body').removeClass('apus-body-loading');
                }
                
            }
        },
        initGmap3: function() {
            // gmap 3
            $('.apus-google-map').each(function(){
                var lat = $(this).data('lat');
                var lng = $(this).data('lng');
                var zoom = $(this).data('zoom');
                var id = $(this).attr('id');
                if ( $(this).data('marker_icon') ) {
                    var marker_icon = $(this).data('marker_icon');
                } else {
                    var marker_icon = '';
                }
                $('#'+id).gmap3({
                    map:{
                        options:{
                            "draggable": true
                            ,"mapTypeControl": true
                            ,"mapTypeId": google.maps.MapTypeId.ROADMAP
                            ,"scrollwheel": false
                            ,"panControl": true
                            ,"rotateControl": false
                            ,"scaleControl": true
                            ,"streetViewControl": true
                            ,"zoomControl": true
                            ,"center":[lat, lng]
                            ,"zoom": zoom
                            ,'styles': $(this).data('style')
                        }
                    },
                    marker:{
                        latLng: [lat, lng],
                        options: {
                            icon: marker_icon,
                        }
                    }
                });

            });
        },
        initVcrtl: function() {
            if( jQuery('html').attr('dir') == 'rtl' ){
                jQuery('[data-vc-full-width="true"]').each( function(i,v){
                    jQuery(this).css('right' , jQuery(this).css('left') ).css( 'left' , 'auto');
                });
            }
        },
        initPopupNewsletter: function() {
            var self = this;
            // popup newsletter
            setTimeout(function(){
                var hiddenmodal = self.getCookie('hiddenmodal');
                if (hiddenmodal == "") {
                    jQuery('#popupNewsletterModal').modal('show');
                }
            }, 3000);
            $('#popupNewsletterModal').on('hidden.bs.modal', function () {
                self.setCookie('hiddenmodal', 1, 30);
            });
        },
        initMobileMenu: function() {
            
            // mobile menu
            $('.btn-offcanvas, .btn-toggle-canvas').on('click', function (e) {
                e.stopPropagation();
                $('.apus-offcanvas').toggleClass('active');
                $('.over-dark').toggleClass('active');
            });
            $('body').on('click', function() {
                if ($('.apus-offcanvas').hasClass('active')) {
                    $('.apus-offcanvas').toggleClass('active');
                    $('.over-dark').toggleClass('active');
                }
            });
            $('.apus-offcanvas').on('click', function(e) {
                e.stopPropagation();
            });

            $("#main-mobile-menu .icon-toggle").on('click', function(){
                $(this).parent().find('> .sub-menu').slideToggle();
                if ( $(this).find('i').hasClass('fa-plus') ) {
                    $(this).find('i').removeClass('fa-plus').addClass('fa-minus');
                } else {
                    $(this).find('i').removeClass('fa-minus').addClass('fa-plus');
                }
                return false;
            } );

            // sidebar mobile
            $('.sidebar-right, .sidebar-left').perfectScrollbar();
            $('body').on('click', '.mobile-sidebar-btn', function(){
                if ( $('.sidebar-left').length > 0 ) {
                    $('.sidebar-left').toggleClass('active');
                } else if ( $('.sidebar-right').length > 0 ) {
                    $('.sidebar-right').toggleClass('active');
                }
                $('.mobile-sidebar-panel-overlay').toggleClass('active');
            });
            $('body').on('click', '.mobile-sidebar-panel-overlay, .close-sidebar-btn', function(){
                if ( $('.sidebar-left').length > 0 ) {
                    $('.sidebar-left').removeClass('active');
                } else if ( $('.sidebar-right').length > 0 ) {
                    $('.sidebar-right').removeClass('active');
                }
                $('.mobile-sidebar-panel-overlay').removeClass('active');
            });
        },
        setCookie: function(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires+";path=/";
        },
        getCookie: function(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
            }
            return "";
        },
        roadMapInit: function() {
            var self = this;
            self.roadMap();
            $(window).resize(function(){
                self.roadMap();
            });
        },
        roadMap: function() {
            if ( $('.widget-roadmaps').length > 0 ) {
                $('.widget-roadmaps .roadmap-point').each(function(){
                    var $this = $(this);
                    var left = $this.data('left');
                    if ($(window).width() > 991) {
                        $this.css({
                            'left': left + '%'
                        });
                    } else {
                        $this.css({
                            'top': left + '%'
                        });
                    }
                });
            }
        },
        particlesInit: function() {
            if( $('#particles-js').length > 0 && typeof particlesJS !== 'undefined' ){
                particlesJS("particles-js", {
                    particles:{
                      number:{value:50,density:{enable:!0,value_area:800}},
                      color:{value:"#00c0fa"},
                      shape:{type:"circle",opacity:.2,stroke:{width:0,color:"#2b56f5"},polygon:{nb_sides:5},image:{src:"img/github.svg",width:100,height:100}},
                      opacity:{value:.3,random:!1,anim:{enable:!1,speed:1,opacity_min:.12,sync:!1}},
                      size:{value:6,random:!0,anim:{enable:!1,speed:40,size_min:.08,sync:!1}},
                      line_linked:{enable:!0,distance:150,color:"#2b56f5",opacity:.3,width:1.3},
                      move:{enable:!0,speed:6,direction:"none",random:!1,straight:!1,out_mode:"out",bounce:!1,attract:{enable:!1,rotateX:600,rotateY:1200}}},
                      interactivity:{detect_on:"canvas",events:{onhover:{enable:!0,mode:"repulse"},onclick:{enable:!0,mode:"push"},resize:!0},
                        modes:{grab:{distance:400,line_linked:{opacity:1}},
                          bubble:{distance:400,size:40,duration:2,opacity:8,speed:3},
                          repulse:{distance:200,duration:.4},
                          push:{particles_nb:4},
                          remove:{particles_nb:2}
                        }
                    },
                    retina_detect:!0
                });
            }
        }
    }

    $.apusThemeCore = ApusThemeCore.prototype;
    
    
    $.fn.wrapStart = function(numWords){
        return this.each(function(){
            var $this = $(this);
            var node = $this.contents().filter(function(){
                return this.nodeType == 3;
            }).first(),
            text = node.text().trim(),
            first = text.split(' ', 1).join(" ");
            if (!node.length) return;
            node[0].nodeValue = text.slice(first.length);
            node.before('<b>' + first + '</b>');
        });
    };

    $(document).ready(function() {
        // Initialize script
        new ApusThemeCore();

        $('.mod-heading .widget-title > span').wrapStart(1);
    });

})(jQuery);

