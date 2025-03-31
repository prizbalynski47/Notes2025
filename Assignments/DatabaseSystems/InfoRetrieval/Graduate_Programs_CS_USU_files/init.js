/*
	Document Outline
		Functions
		DOM Ready Items
		Other Listeners
*/

// Google Custom Search V2
/*(function() {
    var cx = '002010345775656436459:wr5ari_h9jw';
    var gcse = document.createElement('script'); gcse.type = 'text/javascript'; gcse.async = true;
    gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
        '//cse.google.com/cse.js?cx=' + cx;
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(gcse, s);
  })();*/

function showEmergencyMessage(message,location,link,title){
    //message = '<p class="h3 my-4 text-danger">Classes move online March 18. Most university facilities remain open.</p>';
    var button = '';
    if(link !== undefined){
        if(title === undefined){
            title = 'More Info';
        }
        button = '<div class="text-right"><a href="'+link+'" class="btn btn-danger">'+title+'</a></div>';
    }
    if(message !== undefined) {
        if (location === undefined || location == 1){
            $('header').before('<div class="bg-white text-danger py-3"><div class="container xl">'+message+button+'</div></div>');
        } else if(location == 2) {
            $('#content').before('<div class="alert-danger text-danger py-3"><div class="container xl">'+message+button+'</div></div>');
        }
    }
}

/*
	Initialize the walkthrough component
	This is called automatically on any elements with the class .walkthrough
*/
function initWalkthrough(el){
    var questions = el.find('.walkthrough-step:not(.terminator)').length;
    el.find('.walkthrough-current').text('1');
    el.find('.walkthrough-last').text(questions);
    el.find('.walkthrough-step').hide();
    el.find('.walkthrough-step.first-step').fadeIn();
    el.find('.walkthrough-reset').hide();
}

/*
	Will resize all .circle-stat elements on the page. Resizing means to adjust the font
	inside the element to fit within the bounds of the element.
	LMB
*/
function resizeCircleStat(){
    $('.circle-stat:not(.circle-stat-text)').each(function(){
        $(this).find('> div').css('font-size','');
        shrinkToFit($(this),$(this).find('> div'),.4);
    });
}

/*
	Recursive function that will shrink the text until it is about 40% pf the parent.
	The function shrinks the text by 95% and then tests again.
	It would be a good idea to add a counter to break out of the recursion because it's possible
	to overflow if the text is soo long.
	LMB
*/
function shrinkToFit(parent,label,multiplyer){
    if(parent.width()-(parent.width()*multiplyer) < label.width()){
        var size = label.css('font-size').replace('px','');
        label.css('font-size',size*.95);
        shrinkToFit(parent,label,multiplyer);
    }
}


/* Main navigation function */

//Hides any open collapsable nav dropdowns on the main navigation
function hideOpenCollapses(){
    var openCollapse = $('.offcanvas-collapse-sub.open');
    openCollapse.removeClass('open').css('overflow','auto');
    openCollapse.closest('.dropdown-menu.show').removeClass('show');
    openCollapse.closest('.dropdown.show').removeClass('show');
    openCollapse.find('.dropdown-menu.show').removeClass('show');
    openCollapse.closest('.dropdown').find('a.dropdown-toggle').attr('aria-expanded','false');
    openCollapse.closest('.dropdown').find('a.dropdown-toggle').focus();
}

//Shows the next collapsable nav dropdown based on element clicked on the main navigation
function showNextCollapse(el){
    el.nextAll('.offcanvas-collapse-sub').first().addClass('open');//Open the sub section
    el.closest('.offcanvas-collapse').css('overflow','inherit'); //Prevents strange scrolling
}

//Toggles navigation state based on a class on the body element
function toggleNavigation(){
    if($('body').hasClass('navOpen')){
        hideNavigation();
    } else {
        showNavigation();
    }
}

function hideNavigation(){
    $('body').css('overflow','visible').removeClass('navOpen');
    $('.offcanvas-collapse').removeClass('open');
    $('#offcanvas-backdrop').removeClass('backdrop');
    hideOpenCollapses();
    $('#offcanvas-backdrop.backdrop').removeClass('backdrop');
    $('.navbar-toggler').focus();
}

function showNavigation(){
    $('body').css('overflow','hidden').addClass('navOpen');
    $('.offcanvas-collapse').toggleClass('open');
    $('#offcanvas-backdrop').addClass('backdrop');
    setFocusTrap('#main-navbar');
}

/*
	Creates a listener so that the ESC button will close the correct navigation element on
	on the main navigation. Basically this adds ESC listener to the passed in element and calls
	the passing in callback function when ESC is pressed.
	LMB
*/
function initEscButton(el,callback){
    $(document).on('keydown',el,function(e){
        if(e.keyCode == 27){
            callback(e);
        }
    });
}

// Traps focus into modal overlay
function setFocusTrap(el){
    const  focusableElements =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const modal = document.querySelector(el); // select the modal by it's id

    const firstFocusableElement = modal.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
    const focusableContent = modal.querySelectorAll(focusableElements);
    const lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal


    document.addEventListener('keydown', function(e) {
        let isTabPressed = e.key === 'Tab' || e.keyCode === 9;

        if (!isTabPressed) {
            return;
        }

        if (e.shiftKey) { // if shift key pressed for shift + tab combination
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus(); // add focus for the last focusable element
                e.preventDefault();
            }
        } else { // if tab key is pressed
            if (document.activeElement === lastFocusableElement) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
                firstFocusableElement.focus(); // add focus for the first focusable element
                e.preventDefault();
            }
        }
    });

    firstFocusableElement.focus();
}



/*
	Simple function will count from 0 to "y" over the "ttl" duration. The text will be placed
	inside of the passed in "el"
	LMB
*/
function initiateAutoCounter(el, y, ttl){
    //var dur = y*14;
    el.html(0);
    var theNumber
    if(ttl < 1000) ttl = 1000;
    $({countNum: 0}).animate({
        countNum: y+1
    }, {
        duration: ttl,
        step: function(){
            // What todo on every count
            theNumber = Math.ceil(parseInt(this.countNum));
            if(el.data('comma') == true){
                theNumber = numberWithCommas(theNumber);
            }
            el.html(theNumber);
            var circleStat = el.closest('.circle-stat');
            if(circleStat){
                circleStat.find('> div').css('font-size','');
                shrinkToFit(circleStat,circleStat.find('> div'),.4);
            }
        },
        complete: function(){
            if(el.data('comma') == true){
                el.html(numberWithCommas(y));
            } else {
                el.html(y); //Just in case
            }
            resizeCircleStat();
        }
    });
}

/*
	Will reformat a number to have commas every three decimal places
	LMB
*/
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/*
	Function to initialize the 3 and 4 column carousels.
	Called automatically on elements with the .columnCarousel class
*/
function initColumnCarousel(el){
    /* Carousel Adjustment for 3 columns switching one at a time */
    var colClass;
    //Adjust DOM based on how many columns needed.
    switch(el.data('columns')){
        case 3:
            el.addClass('threeColumnCarousel');
            colClass = 'col-lg-4';
            break;
        case 4:
            el.addClass('fourColumnCarousel');
            colClass = 'col-lg-3';
            break;
    }
    el.append('<div id="imgLoader" class="d-none"></div>');
    el.find('.carousel-item').wrapInner('<div class="'+colClass+'"/>');
    if(el.find('.carousel-control').length == 0 && el.data('controls') != 'false'){
        var controls = '<a class="left carousel-control h2" href="'+el.attr('id')+'" data-slide="prev"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>';
        controls += '<a class="right carousel-control h2" href="'+el.attr('id')+'" data-slide="next"><i class="fa fa-chevron-right" aria-hidden="true"></i></a>';
        el.append(controls);
        el.find('.carousel-control').click(function(e){
            e.preventDefault();
            el.carousel($(this).data('slide'));
        });
    }
    el.find('.carousel-item').each(function(){
        var next = $(this).next();
        //If there is no next one, grab the first one as the "next" one
        if (!next.length) {
            next = $(this).siblings(':first');
        }
        //Add the next one's content to the inside of the current one
        next.children(':first-child').clone().addClass('d-none d-lg-block').appendTo($(this));

        //If there isn't a next one
        if (next.next().length > 0) {
            next.next().children(':first-child').clone().addClass('d-none d-lg-block').appendTo($(this));
        } else {
            $(this).siblings(':first').children(':first-child').clone().addClass('d-none d-lg-block').appendTo($(this));
        }
        if(el.data('columns') == 4){
            //If there isn't one two ahead
            if (next.next().next().length > 0) {
                next.next().next().children(':first-child').clone().addClass('d-none d-lg-block').appendTo($(this));
            } else if (next.next().length > 0) {
                $(this).siblings(':first').children(':first-child').clone().addClass('d-none d-lg-block').appendTo($(this));
            } else {
                $(this).siblings(':first').next().children(':first-child').clone().addClass('d-none d-lg-block').appendTo($(this));
            }
        }
    });
    setHeightAfterImagesLoad(el); //We have to do it this way because with images we can get odd results
    //We don't really want these rotating automatically. Maybe make this an option
    setTimeout(function(){
        el.carousel('pause');
    },2000);
}


/*
	Loads all of the images in a carousel so we can adjust the height of the carousel
	LMB
*/
function setHeightAfterImagesLoad(el){
    var total = el.find('img').length;
    if(total == 0){ fixCarouselHeight(el); }
    var newImg = new Image;
    el.find('img').each(function(){
        newImg.src = $(this).attr('src');
        if(newImg.src.search('undefined') > -1){
            newImg.src = $(this).data('src');
        }
        if(newImg.src.search('undefined') < 0){
            newImg.onload = function(){
                fixCarouselHeight(el);
            };
        }
    });
}

/*
	Sets the carousel height based on the tallest carousel item so that content after the carousel
	doesn't move as the user moves through the slides.
	LMB
*/
function fixCarouselHeight(el){
    var minHeight = 0;
    el.find('.carousel-item').each(function(){
        if(!$(this).hasClass('active')){
            $(this).addClass('carousel-item-next');
        }
        minHeight = (minHeight > $(this).height()) ? minHeight : $(this).height();
        if(!$(this).hasClass('active')){
            $(this).removeClass('carousel-item-next');
        }
    });
    el.find('.carousel-item').css('min-height',minHeight+'px');
}

/*
	Simple function to set the video source and trigger the load based on passed in variables.
	LMB
*/
function swapVideo(el,video){
    el.find('source').attr('src',video);
    el[0].load();
}

/*
	Load the player HTML
	LMB
*/
function playerHTML(src){
    return '<div><video muted playsinline><source src="'+src+'" type="video/mp4"/></video></div>';
}

/*
	Load the Controls HTML
	LMB
*/
function controlsHTML(){
    return '<div class="videoControls" role="button"><i class="fa-solid fa-circle-play fa-2x text-white" aria-label="Play/Pause Background Video" tabindex="0">&nbsp;</i></div>';
}

/*
	Triggered when a banner video ends. Will reload the looping background video.
	LMB
*/
function restartVideoLoop(video){
    var videoWrapper = video.closest('.video-banner');
    var loop = videoWrapper.data('loop');
    if(!videoWrapper.find('.video-banner-overlay').is('visible')){
        videoWrapper.trigger('restarting.usu.video-banner');
        if(loop){
            swapVideo(video,loop);
        }
        video.attr('controls',false).prop('muted',true);
        video.closest('.video-banner').find('.video-banner-overlay').fadeIn();
        video.closest('.video-banner').find('.video-banner-play').fadeIn();
        video.closest('.video-banner').find('.video-banner-content').fadeIn();
        video[0].currentTime = 0;
        video[0].play();
        videoWrapper.find('.videoControls').show();
    }
}

/*
	Initialization of looping banner videos.
*/
function initVideo(videoWrapper){
    videoWrapper.trigger('setup.usu.video-banner');
    var loop = videoWrapper.data('loop');
    var overlay = videoWrapper.data('overlay');
    var cropped = videoWrapper.data('cropped');
    var height = videoWrapper.data('height');
    var ratio = videoWrapper.data('ratio');
    //These two HAVE to be before the video variable is set
    videoWrapper.append(playerHTML(loop));
    videoWrapper.append(controlsHTML());

    var video = videoWrapper.find('video');

    //Setup DOM Inside Wrapper Based on Settings
    if(overlay !== false){
        videoWrapper.append('<div class="video-banner-overlay"></div>');
    }
    if(cropped && height){
        videoWrapper.addClass("video-banner-cropped");
        if(!videoWrapper.hasClass('jumbotron-full')){
            videoWrapper.css('height',height);
        }
    } else if(cropped){
        videoWrapper.addClass("video-banner-cropped");
    } else {
        switch(ratio){
            case '16by9': case '4by3':
                video.closest('div').addClass('embed-responsive embed-responsive-'+ratio);
                break;
            default:
                video.css('width','100%');
        }
        video.addClass('embed-responsive-item');
    }
    //Listener for Video Ended
    video.on('ended',function(){
        restartVideoLoop($(this));
    });
    videoWrapper.trigger('ready.usu.video-banner');
    setTimeout(function(){
        video[0].play().then(function(){
            videoWrapper.find('.videoControls').find('svg').removeClass('fa-circle-play').addClass('fa-circle-pause');
        });
    },500);
}

function initDatePicker(el){
    el.datetimepicker({
        format : "MM/DD/YYYY",
        allowInputToggle: true,
        ignoreReadonly: true
    });
}
function initDateTimePicker(el){
    el.datetimepicker({
        collapse: true,
        showClose: true,
        stepping: 5,
        allowInputToggle: true,
        ignoreReadonly: true
    });
}
function initTimePicker(el){
    el.datetimepicker({
        format : "hh:mm A",
        collapse: true,
        showClose: true,
        stepping: 5,
        allowInputToggle: true,
        ignoreReadonly: true
    });
}

/*
	Because video URLs may not have the autoplay parameters, this will add it if it
	doesn't exist. Also adds the JS API for tracking.
	LMB
*/
function makeYoutubeLinkAutoplay(link){
    if(link.search('/?')){
        link = link + 'autoplay=1&rel=0&enablejsapi=1';
    } else {
        link = link + '?autoplay=1&rel=0&enablejsapi=1';
    }
    return link;
}

function makeVimeoLinkAutoplay(link){
    if(link.search('/?')){
        link = link + 'autoplay=1&rel=0&enablejsapi=1';
    } else {
        link = link + '?autoplay=1&rel=0&enablejsapi=1';
    }
    return link;
}

/*
	For YT tracking on videos without the JS API enabled, we load this ourselves.
	LMB
*/
function addYTiFrameScriptForTracking(){
    if(!isJSLoaded('https://www.youtube.com/iframe_api')){
        var jsCode = document.createElement('script');
        jsCode.setAttribute('src', 'https://www.youtube.com/iframe_api');
        document.body.appendChild(jsCode);
    }
}

/*
	Will check if a specific script has been loaded on the page and if not, load it.
	LMB
*/
function isJSLoaded(url){
    if (!url) return false;
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length; i--;) {
        if (scripts[i].src == url) return true;
    }
    return false;
}

/*
	Function to load lazy loaded images. Called automatically on images with .img-lazy
	class, but can be called manually for other images.
	LMB
*/
function lazyLoadImg(el){
    //Load image to parent as background
    if(el.hasClass('img-lazy-bg')){
        var target = el.parent();
        if(el.data('target') !== undefined){
            target = el.closest(el.data('target'));
        }
        target.css({
            backgroundImage: 'url('+el.data('src')+')'
        });
        if(el.data('remove') == true){
            el.remove();
        } else {
            el.attr('src',el.data('src'));
        }
        //Fade in Image
    } else if(el.hasClass('img-lazy-fade')){
        el.hide().attr('src',el.data('src')).fadeIn();
        //Slide in Image
    } else if (el.hasClass('img-lazy-slide')){
        el.hide().attr('src',el.data('src'));
        el.css({
            opacity: 0,
            display: 'block',
            transform: 'translateY(20%)'
        });
        setTimeout(function(){
            el.css({
                transition: 'all 1s',
                transform: 'translateY(0%)',
                opacity: 1
            });
        },10);
        //Just load the image as normal
    } else {
        el.attr('src',el.data('src'));
    }
}

/*
	Used to extract the hashTag from a URL
	For the url usu.edu#hashTag
	getHashFromURL() will return "hashTag"
	LMB
*/
function getHashFromURL(){
    idx = $(location).attr('href').indexOf("#");
    return idx != -1 ? $(location).attr('href').substring(idx+1) : "";
}

/*
	Used to retrieve the value of a passed in URL parameter name from the current URL.
	For the url usu.edu?key=value.
	getUrlParameter('key') will return "value".
	LMB
*/
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/*
	Will return the full array of URL parameters from the passed in URL
	LMB
*/
function getUrlParameters(url){
    var params = {};
    var parser = document.createElement('a');
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
}

/*
	Will resize all jumbotrons on the page per their data attributes.
	A function so that it is easier to call on window.resize
	LMB
*/
function resizeJumbotrons(){
    $('.jumbotron-full').each(function(){
        resizeJumbotronFull($(this));
    });
}

/*
	Function to resize passed in jumbotron based on it's data attributes
	LMB
*/
function resizeJumbotronFull(el){
    var header = $('body > header').height();
    var nav = $('#master-nav').height();
    var setHeight = el.data('height');
    var xsHeight = el.data('xsheight');;
    var modifiedVH = 200;

    if(setHeight === undefined){
        setHeight = '300px';
        if(el.hasClass('jumbotron-title-bottom')){
            setHeight = '400px';
        }
    }
    if(xsHeight === undefined){
        xsHeight = 200;
    }
    el.css('height',setHeight);
    var vh = el.height();
    if(setHeight.search('vh') >= 0){
        modifiedVH = vh-header-nav;
        if(window.innerWidth < 577){
            modifiedVH = xsHeight;
        }
    } else {
        modifiedVH = vh;
        if(window.innerWidth < 577){
            modifiedVH = xsHeight;
        }

    }
    el.css('height',modifiedVH);
    setTimeout(function(){
        var minHeight = el.find('.jumbotron-content').height()+48;
        if(minHeight != 'NaN'){
            el.css('min-height',minHeight+'px');
        }
    },100);
}

/*
	Function will return true if the element is visible in the viewport
	LMB
*/
function isInView(element) {
    // get window height
    var windowHeight = window.innerHeight;
    // get number of pixels that the document is scrolled
    var scrollY = window.scrollY || window.pageYOffset;

    // get current scroll position (distance from the top of the page to the bottom of the current viewport)
    var scrollPosition = scrollY + windowHeight;
    // get element position (distance from the top of the page to the top of the element + 50)
    var elementPosition = element.getBoundingClientRect().top + scrollY + 50;

    // is scroll position greater than element position? (is element in view?)
    if (scrollPosition > elementPosition) {
        return true;
    }
    return false;
}

/*
	Function to create the recaptchaV2 element.
	Will create it in the element with the passed in ID.
	Will run the callback function on success.
*/
function runRecaptchaV2(id,callback){
    if(typeof callback === "function"){
        grecaptcha.render(id, {
            'sitekey' : '6LdyXb8UAAAAAHM-wtfWo6r3K61PMQ9wtkvswdvN',
            'callback': function(token){
                $.get('?reCaptchaTokenV2='+token,function(data){
                    if(typeof callback === "function"){
                        callback(data);
                    }
                });
            },
            'error-callback': function(){
                console.log('Error with Recaptcha');
            }
        });
    } else {
        grecaptcha.render(id, {'sitekey' : '6LdyXb8UAAAAAHM-wtfWo6r3K61PMQ9wtkvswdvN'});
    }
}

/*
	Function to create the recaptchaV3 invisible element.
	Runs callback after initialization.
	Callback should process the score for the user
	LMB
*/
function runRecaptcha(page,callback){
    var disclaimer = '<small class="text-muted d-block w-100 text-left pb-2">This site is protected by reCAPTCHA and the Google. ';
    disclaimer += '<a href="https://policies.google.com/privacy">Privacy Policy</a> and ';
    disclaimer += '<a href="https://policies.google.com/terms">Terms of Service</a> apply.</span>';
    disclaimer += '<style>.grecaptcha-badge { display:none !important; }</style>';
    $('#global-footer .right-list').after(disclaimer).closest('.col-12').css('flex-wrap','wrap');
    grecaptcha.ready(function() {
        grecaptcha.execute('6Lc3mrkUAAAAAAMJeRi9sq_8HJJunm4woue2Zvu1', {action: page}).then(function(token) {
            $.get('?reCaptchaToken='+token,function(data){
                if(typeof callback === "function"){
                    callback(data);
                }
            },'Text');
        });
    });
}

/*
	Function to resize an iframe or iframes container for cross-domain iframes.
	Uses postMessage from iframed window.
	Useful for when you have an iframe but you don't know the height or the height
	is inconsistent.
	LMB
*/
function resizeCrossDomainIframe(iframe, other_domain) {
    window.addEventListener('message', function(event) {
        if (event.origin !== other_domain) return; // only accept messages from the specified domain
        //if (isNaN(event.data)) return; // only accept something which can be parsed as a number
        var data = event.data;
        var padding = 30;
        if(data.padding != undefined){ padding = data.padding;}
        if (isNaN(data.height)) return;
        var height = parseInt(data.height);
        if(data.id !== undefined && data.id == iframe.closest('div').attr('id')){
            iframe.closest('div').animate({height: (height)+padding});
            iframe.animate({height: (height)+padding});
        } else if(data.id === undefined || data.id === null) {
            iframe.animate({height: (height)+padding});
        }
    }, false);
}

/*
	Seems like a duplicate of getUrlParameters. Could try to remove or merge by calling getUrlParameters from this function with window.location as the passed in variable.
*/
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

/* Set cookie for cookie disclaimer */
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=strict;";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/*
	Small function if you have a folder of images you want to make a gallery out of. Great for when you don't
	want to put all the DOM in there. Make a single div with path to the images, image extension name and quantity.
	Will loop through and output.
	LMB
*/
function buildLightGallery(el){
    var path = el.data('path');
    var to = el.data('to');
    var ext = el.data('ext');
    for (i = 1; i <= to; i++) {
        var html = '';
        html += "<div data-src='"+path+i+ext+"' class='m-2 pointer'>";
        html += "<img src='"+path+"thumb/"+i+ext+"' />";
        html += "</div>"
        el.append(html);
    }
    el.lightGallery();
}

//Focusable Extension to help with accessibility
jQuery.extend(jQuery.expr[':'], {
    focusable: function(el){
        return $(el).is('a, button, :input, [tabindex]');
    }
});



$(document).ready(function() {

    //Init all columncarousels on page
    $('.columnCarousel').each(function(){
        initColumnCarousel($(this));
    });

    //Build fat footer collapses to make HTML simpler
    $('#fat-footer .collapsed:not([data-toggle="collapse"])').each(function(){
        var selector = $(this);
        var uid = Math.floor(Math.random() * 99999);
        var collapsed = $(this).closest('.col-border').next('.collapse');
        selector.append(' <i class="fa-solid fa-caret-down"></i>');
        $(this).attr('role','button').attr('aria-expanded','false').attr('aria-controls','collapse-'+uid);
        collapsed.attr('id','collapse-'+uid);
        $(this).click(function(e){
            e.preventDefault();
            var collapsed = $(this).closest('.col-border').next('.collapse');
            collapsed.collapse('toggle');
        });
        collapsed.on('show.bs.collapse',function(){
            selector.find('.fa-caret-down').addClass('fa-rotate-180')
        });
        collapsed.on('hide.bs.collapse',function(){
            selector.find('.fa-caret-down').removeClass('fa-rotate-180');
        });
    });

    //Background video init
    $('.video-banner').each(function(){
        initVideo($(this));
    });

    //Play video banner when clicked
    $('.video-banner-play').click(function(e){
        e.preventDefault();
        var target = $($(this).data('target'));
        var player = target.find('video');
        if(target.data('video')){
            swapVideo(player,target.data('video'));
        }
        player[0].currentTime = 0;
        player[0].play();
        player.attr('controls',true).prop('muted',false);
        target.find('.video-banner-overlay').fadeOut();
        target.find('.video-banner-content').fadeOut();
        target.find('.videoControls').hide();
        target.closest('.video-banner').trigger('playing.usu.video-banner');
        if($(this).closest('.video-banner').length){
            $(this).fadeOut();
        }
    });

    //Toggle play/pause background video
    $('.videoControls').click(function(){
        var video = $(this).siblings('div').find('video')[0];
        var controls = $(this);
        if(video.paused){
            video.play().then(function(){
                controls.find('svg').removeClass('fa-circle-play').addClass('fa-circle-pause');
            });
        } else {
            video.pause();
            controls.find('svg').removeClass('fa-circle-pause').addClass('fa-circle-play');
        }
    });

    //Toggle play/pause background video on Enter button if focused
    $(document).on('keydown','.videoControls',function (e){
        if (e.keyCode == 13) {
            $('.videoControls svg').trigger('click');
        }
    });

    //Updated toggle play/pause background video
	$('.bg-video-controls').click(function(){
		var video = $(this).siblings('video')[0];
		var controls = $(this)[0];
		if(video.paused){
			video.play();
			controls.innerHTML = '<i class="fas fa-pause-circle fa-2x text-white"></i><span class="sr-only">Pause video</span>';
		} else {
			video.pause();
			controls.innerHTML = '<i class="fas fa-play-circle fa-2x text-white"></i><span class="sr-only">Play video</span>';
		}
	});

    //Show hide scroll to top button
    $(window).scroll(function () {
        //Show/hide scroll to top
        if($(this).scrollTop() > 100) {
            $('#back-to-top').fadeIn('slow');
        } else {
            $('#back-to-top').fadeOut('slow');
        }

        //Show Hide shadow and affix nav on scrolling
        var scroll = $(window).scrollTop();
        if(scroll == 0){
            $("#master-nav").removeClass("navbar-scroll");
        } else if (scroll > 200){
            $("#master-nav").addClass("navbar-scroll");
        } else {
            $("#master-nav").removeClass("navbar-scroll");
        }
    });

    //Trigger the auto counter on all elements with .countme class when they come into the viewport.
    (function(){
        $('.countme').each(function(){
            var el = $(this);
            $(window).scroll(function(){
                if(isInView(el[0])) {
                    if(!el.data('counted')){
                        el.data('counted',true);
                        initiateAutoCounter(el,el.data('number'),1500);
                    }
                }
            });
        });
        $(window).scroll();
    })();

    //Scroll the user to the top when clicking the back to top button
    $('#back-to-top').click(function(){
        $('body,html').animate({
            scrollTop : 0
        }, 500);
    });

    // Initialize Popovers
//     $('[data-toggle="popover"]').popover({trigger:"focus"});

    // Initialize Tooltips
//     $('[data-toggle="tooltip"]').tooltip();


    // Full screen search overlay
    $('#header-search-btn').click(function(){
        $('#search-overlay').fadeIn();
        setFocusTrap('#search-overlay');
        $('#search-overlay').addClass('searchOpen');
        //$('#search_terms').focus();
        $('#search-overlay').focus();
    });
    $('#offcanvas-search-btn').click(function(){
        $('#search-overlay').fadeIn();
        setFocusTrap('#search-overlay');
        $('#search-overlay').addClass('searchOpen');
        //$('#search_terms').focus();
        $('#search-overlay').focus();
    });
    $('#close-search').click(function(){
        $('#search-overlay').fadeOut();
        $('#search-overlay').removeClass('searchOpen');
        if($('body').hasClass('navOpen')){
            $('#offcanvas-search-btn').focus();
        }
        else {
            $('#header-search-btn').focus();
        }
    });
    //On radio click, adjust the placeholder text and the form action
    $("#search_form input[name=search_type]").click(function() {
        $("#search_terms").attr('placeholder',$(this).val());
        $("#search_form").attr('action',$(this).attr("page"));
    });
    $('#search_form').submit(function(){
        var string = $('#search_terms').val();
        var directory = $('#people').prop('checked');
        var action = $('#search_form').attr('action');
        $('input[name="search_type"]').prop('disabled',true);

    });
    //Trigger the first one on page load... this could probably just be done in the HTML
    $( "input[name=search_type]").first().trigger('click');


    /** Navigation Items **/
    /* Header navigation accessibility */

    /*Escape Button Listeners*/
    //Closes "Quick Links" slide down navigation on ESC
    initEscButton($('#site-header-nav'),function(e){
        $(e.target).closest('.collapse.show').collapse('hide');
        //if($('body').hasClass('navOpen')){
        //	$('.search-btn').focus();
        //}
        //$('.navbar-toggler').focus();
        if($('#search-overlay').hasClass('searchOpen')){
            $('#header-search-btn').focus();
        }
        else {
            $('#quick-links').focus();
        }
    });

    //Closes slide out navigation on ESC
    initEscButton($('.offcanvas-collapse.open .dropdown.show'),function(){
        if($('#search-overlay').hasClass('searchOpen')){
            $('#search-overlay').removeClass('searchOpen');
            $('#offcanvas-search-btn').focus();
        }
        else {
            if($('.offcanvas-collapse-sub').hasClass('open')){
                hideOpenCollapses();
            }
            else {
                hideNavigation();
            }
        }
    });

    //Closes search overlay on ESC
    initEscButton($('#search-overlay'),function(){
        $('#search-overlay').fadeOut();
        if($('body').hasClass('navOpen') && $('#search-overlay').hasClass('searchOpen')){
            $('#offcanvas-search-btn').focus();
        }
        else {
            if($('#search-overlay').hasClass('searchOpen')){
                $('#header-search-btn').focus();
            }
        }
    });

    //Select First Link when list is shown
    $('#site-header-nav .collapse').on('shown.bs.collapse',function(){
        setFocusTrap('#header-quicklinks');
    });

    /* Main Navigation */
    //Prevent menu from closing if you click on it but not on a link.
    $('#main-navbar .dropdown-menu').click(function(e){
        if(
            (!$('.offcanvas-collapse').hasClass('open') || //Any desktop click
                $(this).hasClass('dropdown-menu show')) && //Second Level (I think) Could be too inclusive
            !$(e.target).is('a') ){ //This can pickup anchors, so ignore anchors
            e.stopPropagation();
        }
    });

    /* Main Navigation offcanvas */
    //Any element with the data-toggle="offcanvas" can trigger the offcanvas navigation to show/hide
    $(document).on('click','[data-toggle="offcanvas"]',function (e) {
        e.preventDefault();
        toggleNavigation();
    });

    /*$('.dropdown-toggle:not([data-toggle="dropdown"])').click(function(){
        //$(this).find('.dropdown-toggle').toggleClass('open');
        $(this).closest('.dropdown').toggleClass('show').find('.dropdown-menu').toggleClass('show');
    });*/
    //I have no idea why I cannot capture this with the function above, it should work, but it doesn't like to work I believe because of a race condition
    //with BS or stop propagation stuff I can't find. In either case, this way works.
    $(document).on('keydown','.offcanvas-collapse.open > .navbar-nav > .dropdown > .dropdown-toggle, .offcanvas-collapse.open > .navbar-nav > .nav-item > a',function(e){
        if(e.keyCode == '27'){
            //e.stopPropagation(); //Don't think I need this really
            //hideNavigation(); //Removed BRW
        }
    });

    //Clicking a first level dropdown to slide out level 2
    $('.offcanvas-collapse .dropdown-toggle').on('click',function(e) {
        e.preventDefault();
        showNextCollapse($(this));
        if($('body').hasClass('navOpen')){
            setFocusTrap('.offcanvas-collapse-sub.open');
        }
    });

    //Clicking the back button on a level 2 navigation
    $('.offcanvas-collapse .offcanvas-back').on('click',function(e) {
        e.preventDefault();
        hideOpenCollapses();
    });
    $('#offcanvas-backdrop').click(function(){
        hideNavigation();
    });

    //'close' the navigation if open on window resize
    //We could do a check on screen size etc here if needed, but for now we'll just assume we want to close it for good mesaure.
    //It's better than the background sometimes staying after going from mobile to desktop
    /*$(window).resize(function(){
        if($('body').hasClass('navOpen')){
            //toggleNavigation();
        }
    });*/

    //If you open a nav item on desktop and then switch to mobile, the sub-nav will try to be exposed
    //This will remove the open class which will keep the nav closed when you switch
    $('#master-nav').on('hide.bs.dropdown','.dropdown',function(){
        $(this).find('.offcanvas-collapse-sub').removeClass('open');
    });



    /* Resize Script for Circle Stats */
    $(window).resize(function(){
        resizeCircleStat();
    });
    resizeCircleStat();
    /*  End Resize Circle Stat */


    /* Walkthrough Tool */
    $('.walkthrough').each(function(){
        initWalkthrough($(this));
    });
    //Clicking an "answer" in the walkthrough takes them to the next step.
    $(document).on('click','.walkthrough .answer',function(e){
        e.preventDefault();
        var nextStep = $($(this).data('target'));
        $(this).closest('.walkthrough-step').hide();
        nextStep.fadeIn();
        if(!nextStep.hasClass('terminator')){
            var current = Number($(this).closest('.walkthrough').find('.walkthrough-current').text())+1;
            $(this).closest('.walkthrough').find('.walkthrough-current').text(current);
        }
        $('.walkthrough-reset').fadeIn();
    });
    //Reset the walkthrough to the inital first state.
    $('.walkthrough-reset').click(function(){
        initWalkthrough($(this).closest('.walkthrough'));
    });
    //Adding dismissable for inlinealerts
    $(document).on('click','.close[data-dismiss="inlinealert"]',function(e){
        e.preventDefault();
        $(this).closest('.inlinealert').fadeOut();
    });
    /* End Walkthrough */
    $(document).on('click','.eventdetails-expand',function(e){
        e.preventDefault();
        var target = $(this).closest('.eventdetails').find('.eventdetails-description');
        (target.is(':visible')) ? target.slideUp() : target.slideDown();
    });

    /* Step Guide Expander */
    //This could just be a collapse, but this keeps it symantic
    $(document).on('click','.expand-step',function(){
        $(this).closest('.step-description').find('.step-details').collapse('toggle');
    });
    /* End Step Guide Expander */

    // Forms
    // Custom file browser
    $('.custom-file-input').on('change', function() {
        let fileName = $(this).val().split('\\').pop();
        let label = $(this).siblings('.custom-file-label');

        if (label.data('default-title') === undefined) {
            label.data('default-title', label.html());
        }

        if (fileName === '') {
            label.removeClass("selected").html(label.data('default-title'));
        } else {
            label.addClass("selected").html(fileName);
        }
    });

    //Triggers the color blend class to be default or based on data attributes
    $('.color-blend').each(function(){
        var startColor = $(this).data('colorstart');
        var stopColor = $(this).data('colorstop');
        if(startColor === undefined){
            startColor = '#2472b5';
        }
        if(stopColor === undefined){
            stopColor = '#384660';
        }
        var rotate = $(this).data('rotation');
        if(rotate === undefined){ rotate = 90;}
        $(this).css({
            background: 'linear-gradient('+rotate+'deg, '+startColor+' 0%, '+stopColor+' 100%)'
        });
    });

    // Date time picker
    //Date time picker is called on a page by page basis and must be init as such.
    $(".date").each(function(){
        initDatePicker($(this));
    });
    $(".datetime").each(function(){
        initDateTimePicker($(this));
    });
    $(".time").each(function(){
        initTimePicker($(this));
    });


    // Disable form submissions if there are invalid fields when using .needs-validation
    (function() {
        'use strict';
        window.addEventListener('load', function() {
            // Get the forms we want to add validation styles to
            var forms = document.getElementsByClassName('needs-validation');
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(forms, function(form) {
                form.addEventListener('submit', function(event) {
                    if (form.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add('was-validated');
                }, false);
            });
        }, false);
    })();

    // Cookie consent
    (function () {
        "use strict";

        var cookieAlert = document.querySelector(".cookiealert");
        var acceptCookies = document.querySelector(".acceptcookies");

        if (!cookieAlert) {
            return;
        }

        cookieAlert.offsetHeight; // Force browser to trigger reflow

        // Show the alert if we cant find the "acceptCookies" cookie
        if (!getCookie("acceptCookies")) {
            cookieAlert.classList.add("show");
            cookieAlert.classList.remove("d-none");
        }

        // When clicking on the agree button, create a 1 year
        // cookie to remember user's choice and close the banner
        acceptCookies.addEventListener("click", function () {
            setCookie("acceptCookies", true, 365);
            cookieAlert.classList.remove("show");
        });

        // Cookie functions from w3schools
        function setCookie(cname, cvalue, exdays) {
            //LMB
            /*
                Added this domain variable so the cookie will work on .org .com and other USU sites that aren't *.usu.edu
                usu.edu as a domain wasn't working on a .org site.
            */
            var domain = 'usu.edu';
            if(window.location.host.search('usu.edu') == -1){ //If we don't find usu.edu in the domain name, set the domain to match where we are
                domain = window.location.host;
            }
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;domain="+domain+";";
        }

        function getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
    })();

    /*
        When a inline-overlay-button is clicked, it's like a modal.
        Hides content defined by data-hide
        Shows content defined by data-target
        Shows the first/last dialog items
        Scrolls the user to the top of the content area
        Captures tab focus in a loop like a modal should for accessibility

        Closes the overaly when clicking elsewhere on the page or one of the close buttons
        Refocuses on the triggering element
        LMB
    */
    $(document).on('click','.inline-overlay-btn',function(e){
        //Don't link
        e.preventDefault();
        //Get the wrapper of the UI
        var wrapper = $(this).closest('.inline-overlay');
        //Set min-height just so it doesn't anmiate from 0
        wrapper.css('min-height',wrapper.height()+'px');
        wrapper.addClass('active');
        //use the data hide attribute if present to hide the desired content
        if($(this).data('hide') != undefined){
            wrapper.find($(this).data('hide')).hide();
            wrapper.find('.dialog-start,.dialog-end').data('show', $(this).data('hide'));
        } else {
            //Otherwise, hide all potential buttons in the wrapper
            //I don't think this is used anymore
            wrapper.find('.inline-overlay-btn').hide();
        }

        wrapper.find('.dialog-start,.dialog-end').fadeIn();
        if(!isInView(wrapper[0])){
            $('body,html').scrollTop(wrapper.offset().top - 150);
        }
        wrapper.find('.input-overlay-detail').hide();
        wrapper.find($(this).data('target')).slideDown(function(){
            wrapper.find('.dialog-start').focus();
        });
        $(document).mouseup(function(e){
            if(!wrapper.is(e.target) && wrapper.has(e.target).length === 0){
                if(!$(e.target).hasClass('.inline-overlay-btn')){
                    wrapper.find('.dialog-start').trigger('click');
                } else {
                    wrapper.removeClass('active');
                    wrapper.find('.inline-overlay-detail').hide();
                    if(wrapper.find('.dialog-start').data('show') != undefined){
                        var toShow = wrapper.find('.dialog-start').data('show');
                        wrapper.find(toShow).show();
                    } else {
                        wrapper.find('.inline-overlay-btn').show();
                    }
                    wrapper.find('.dialog-start').hide();
                    $(document).unbind('mouseup');
                }
            }
        });
    });

    $(document).on('click','.inline-overlay .dialog-start, .inline-overlay .dialog-end',function(e){
        e.preventDefault();
        var activeId = $(this).closest('.inline-overlay').find('.inline-overlay-detail:visible').attr('id');
        var originalTarget = $('*[data-target="#'+activeId+'"]');
        $(document).unbind('mouseup');
        var wrapper = $(this).closest('.inline-overlay');
        if($(this).data('show') != undefined){
            var toShow = $(this).data('show');
            setTimeout(function(){
                wrapper.find(toShow).fadeIn();
            },400);
        } else {
            wrapper.find('.inline-overlay-btn').fadeIn();
        }
        wrapper.find('.dialog-start, .dialog-end').hide();
        wrapper.removeClass('active');
        wrapper.find('.inline-overlay-detail').stop(true, true).fadeOut({ duration: 400, queue: false }).slideUp(400,function(){
            setTimeout(function(){

                //wrapper.attr('class','uiWrapper clearfix');
            },350);
        });
        setTimeout(function(){
            originalTarget.focus();
        },400);
    });

    $(document).on('keydown','.inline-overlay *:focusable',function(e){
        //Tab
        if (e.keyCode == 9) {
            e.stopPropagation();
            if(e.shiftKey){
                if($(this).hasClass('dialog-start')){
                    e.preventDefault();
                    $(this).closest('.inline-overlay').find('.dialog-end').focus();
                }
            } else {
                if($(this).hasClass('dialog-end')){
                    e.preventDefault();
                    $(this).closest('.inline-overlay').find('.dialog-start').focus();
                }
            }
        }
    });

    $(document).on('keydown','.inline-overlay.active',function(e){
        if(e.keyCode == 27){
            $(this).find('.dialog-start').click();
        }
    });

    $(document).on('keydown','.inline-overlay-btn',function(e){
        if(e.keyCode == 13){
            $(this).click();
        }
    });

    /*
        If a hash is in the URL will attempt to click the element with a matching data-anchorlink attribute.
        Ideal for when you want to permalink into a inline overaly or other similar type element like a collapse.
    */
    if(getHashFromURL() != ''){
        setTimeout(function(){
            $('[data-anchorlink="'+getHashFromURL()+'"]').trigger('click');
        },500);
    }

    /*
        Adjustments for timeline
    */
    $('.timeline-item').each(function(i){
        if(i % 2 == 0){
            $(this).addClass('left');
        }
    });
    $('.timeline .timeline-item,.timeline .timeline-year').each(function(){
        var el = $(this);
        $(window).scroll(function(){
            if(isInView(el[0])) {
                el.addClass('inView');
            }
        });
        $(window).trigger('scroll');
    });

    //Scroll to correct position accounting for navigation on pageload with hash
    var hash = getHashFromURL();
    if(hash != '' && $('#'+hash).length > 0){
        $('body,html').animate({scrollTop: $($('#'+hash)).offset().top-60});
    }

    if($('.nav-onpage').length > 0){
        $('body').css('position','relative');
        $('body').scrollspy({
            target: $('.nav-onpage').find('ul'),
            offset: 150
        });
    }
    //Add alert-link class to links inside alert per BS4 documentation
    $('body.ou #content .alert a:not(.btn)').addClass('alert-link');
});

/*
	Add class active to sidebar menu and open sub-menu based on url

$(document).ready(function() {
	var currentUrl= document.URL;
	var currentUrlEnd = currentUrl.split('/').filter(Boolean).pop();
	console.log(currentUrl);
	$( "#sub-menu-navbar li a" ).each(function() {
		  var thisUrl = $(this).attr('href');
		  var fileExt = thisUrl.indexOf('.php');
		  if (fileExt != -1) {
			  thisUrl = thisUrl.substr(0,fileExt);
		  }
		  var thisUrlEnd = thisUrl.split('/').filter(Boolean).pop();
		  //console.log(thisUrlEnd);
		  if(thisUrlEnd == currentUrlEnd){
		  $(this).closest('li').addClass('active');
		  $(this).parents('div.collapse').addClass('show');
		  $(this).parents('li.nav-item').children(':first-child').attr('aria-expanded','true');
		  $("#sub-menu-navbar").removeClass('show')
		  }
	});
});*/

$(document).ready(function() {
    var currentUrl = window.location.pathname;
    var currentUrlEnd = document.URL.split('/').filter(Boolean).pop();
    // console.log(currentUrl);
    if($('body').hasClass('ou')){ // For OU campus pages
        var lastUrlChar = currentUrl.substr(-1);
        //console.log(currentUrl,currentUrlEnd);
        if (lastUrlChar == '/') { // If the last character is not a slash
            currentUrl = currentUrl + 'index'; // Append index to it.
        }
    }
    var currentFullUrl = window.location.protocol + '//' + window.location.hostname + currentUrl; // rebuild the full current url
    // console.log(currentFullUrl);
    $('#sub-menu-navbar li a').each(function(){
        var $this = $(this);
        var thisUrl = $(this).attr('href');

        var fileExt = thisUrl.indexOf('.php');
        if (fileExt != -1) {
            thisUrl = thisUrl.substr(0,fileExt);
        }
        var thisFullUrl = window.location.protocol + '//' + window.location.hostname + thisUrl; // rebuild the menu full urls
        //console.log(thisFullUrl);
        // if the current path is like this link and if full urls are identical, make it active, open/close sub menus if needed
        if(thisUrl.indexOf(currentUrl) !== -1 && thisFullUrl == currentFullUrl){
            $(this).closest('li').addClass('active');
            $(this).parents('div.collapse').addClass('show');
            $(this).parents('li.nav-item').children(':first-child').attr('aria-expanded','true');
            $("#sub-menu-navbar").removeClass('show')
        }

    })
});

/*
	Add tracking script to YT videos on page that are using videoPlayer tool.
*/
$('.parentVideoPlayer').each(function(){
    if($(this).data('youtube')){
        addYTiFrameScriptForTracking();
    }
});

/*
	Triggers the parent video player component.
	Will load the video into the data-target or a general overlay if no target provided.
*/
$(document).on('click','.parentVideoPlayer',function(e){
    e.preventDefault();
    var carousel = $(this).closest('.carousel');
    var target = $($(this).data('target'));
    var modal = false;
    var remove = true;
    if($(this).data('remove') == false){
        remove = false;
    }
    if(target.length == 0){
        if($('#videoOverlay').length == 0){
            $('body').append('<div class="modal fade" tabindex="-1" role="dialog" id="videoOverlay"><div class="modal-dialog modal-dialog-centered" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"><div></div></div></div></div></div>');
        }
        target = $('#videoOverlay .modal-body div');
        modal = true;
    }
    var link = $(this).data('video');
    var html;
    if(!modal){
        if($(this).data('youtube')){
            link = makeYoutubeLinkAutoplay(link);
            html = '<div class="video-banner-wrapper"><iframe src="'+link+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen/></div>';
        } else if ($(this).data('kaltura')){
            html = '<div class="video-banner-wrapper"><iframe src="'+link+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen/></div>';
        } else if ($(this).data('vimeo')){
            link = makeVimeoLinkAutoplay(link);
            html = '<div class="video-banner-wrapper"><iframe src="'+link+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen/></div>';
        } else {
            html = '<div class="video-banner-wrapper"><video autoplay controls playsinline><source src="'+link+'"/></video></div>';
        }
        if(carousel.length){
            carousel.carousel('pause');
            target = carousel;
        } else {
            target.css('height',target.height());
            target.css('width',target.find('*').first().width());
            if(remove){
                $(this).css('opacity',0);
            }
        }
        target.addClass('showingVideo');
        target.html(html);
    } else {
        if($(this).data('youtube')){
            link = makeYoutubeLinkAutoplay(link);
            html = '<div class="embed-responsive-16by9 embed-responsive"><iframe src="'+link+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="embed-responsive-item"/></div>';
        } else if ($(this).data('vimeo')){
            link = makeVimeoLinkAutoplay(link);
            html = '<div class="embed-responsive-16by9 embed-responsive"><iframe src="'+link+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="embed-responsive-item"/></div>';
        } else if ($(this).data('kaltura')){
            html = '<div class="embed-responsive-16by9 embed-responsive"><iframe src="'+link+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="embed-responsive-item"/></div>';
        } else {
            html = '<div class="embed-responsive-16by9 embed-responsive"><video autoplay controls playsinline class="embed-responsive-item"><source src="'+link+'"/></video></div>';
        }
        target.html(html);
        setTimeout(function(){
            $('#videoOverlay').modal('show');
        },250);
    }
});

/*
	Removes the video from the DOM (so it stops) when closing the containing modal.
*/
$(document).on('hide.bs.modal','#videoOverlay',function(){
    $(this).find('.modal-body div').html('');
});

//Lazy Load Images
$(document).ready(function(){
    // Get all of the images that are marked up to lazy load
    const images = document.querySelectorAll('.img-lazy');
    // If the image gets within 50px in the Y axis, start the download.
    const config = {rootMargin: '0px 0px', threshold: 0.01	};
    if (!('IntersectionObserver' in window)) {
        $('.img-lazy').each(function(){
            lazyLoadImg($(this));
        });
    } else {
        // The observer for the images on the page
        let observer = new IntersectionObserver(function(entries){
            // Loop through the entries
            entries.forEach(function(entry){
                // Are we in viewport?
                if (entry.intersectionRatio > 0) {
                    // Stop watching and load the image
                    observer.unobserve(entry.target);
                    lazyLoadImg($(entry.target));
                }
            });
        }, config);
        images.forEach(function(image){
            observer.observe(image);
        });
    }
});

$(document).ready(function(){
    // Get all of the images that are marked up to lazy load
    const images = document.querySelectorAll('.onScrollRevert');
    // If the image gets within 50px in the Y axis, start the download.
    const config = {rootMargin: '0px 0px', threshold: 0.2	};
    if (!('IntersectionObserver' in window)) {
        $('.onScrollRevert').each(function(){
            $(this).addClass('onScrollVisible');
        });
    } else {
        // The observer for the images on the page
        let observer = new IntersectionObserver(function(entries){
            // Loop through the entries
            entries.forEach(function(entry){
                // Are we in viewport?
                if (entry.intersectionRatio > 0) {
                    // Stop watching and load the image
                    observer.unobserve(entry.target);
                    var timeouts = [0,50,100,150];
                    setTimeout(function(){
                        $(entry.target).addClass('onScrollVisible');
                    },timeouts[Math.floor(Math.random() * timeouts.length)]);
                }
            });
        }, config);
        images.forEach(function(image){
            observer.observe(image);
        });
    }
    $('.onHoverFloat').hover(function(){
        $(this).addClass('shadow-lg');
    }, function(){
        $(this).removeClass('shadow-lg');
    });
});

//Size Custom Jumbotrons
(function(){
    var resizeTimer;
    $(window).resize(function(){
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function(){
            resizeJumbotrons();
        },100);
    });
    resizeJumbotrons();
})();

/* FORM CHECK GROUP VALIDATION */
$('.form-check-required-group').closest('form').submit(function(){
    $('.form-check-required-group .form-check-input:invalid').closest('.form-check-required-group').find('[class*=invalid]').addClass('was-validated-feedback');
    $('.form-check-required-group .form-check-input:valid').closest('.form-check-required-group').find('[class*=valid]:not([class*=invalid])').addClass('was-validated-feedback');
});

$('.form-check-required-group .form-check-input').change(function(){
    var selected = false;
    var formCheckGroup = $(this).closest('.form-check-required-group');
    var invalidFeedback = formCheckGroup.find('[class*=invalid]');
    var validFeedback = formCheckGroup.find('[class*=valid]:not([class*=invalid])');
    var inputs = formCheckGroup.find('.form-check-input');
    inputs.each(function(){
        if($(this).prop('checked')){
            selected = true;
        }
    });

    if(selected) {
        inputs.each(function(){
            $(this).prop('required',false);
        });
        invalidFeedback.removeClass('was-validated-feedback');
        validFeedback.addClass('was-validated-feedback');
    } else {
        inputs.each(function(){
            $(this).prop('required',true);
        });
        invalidFeedback.addClass('was-validated-feedback');
        validFeedback.removeClass('was-validated-feedback');
    }
});

/*
	Toggle Text. Simple way to toggle a text string or icon based on data attributes so users
	don't need custom Javascript
	LMB
*/
$('.toggleText').each(function(){
    var events = $(this).data('event').split(',');
    var s1 = $(this).data('s1');
    var s2 = $(this).data('s2');
    var link = $(this);
    events.forEach(function(eventName){
        link.on(eventName,function(){
            if($(this).text().search(s1) > -1){
                $(this).text($(this).text().replace(s1,s2));
            } else {
                $(this).text($(this).text().replace(s2,s1));
            }
            if($(this).next('[class*=fa-angle]')){
                if($(this).next().hasClass('fa-angle-down')){
                    $(this).next().removeClass('fa-angle-down').addClass('fa-angle-up');
                } else {
                    $(this).next().removeClass('fa-angle-up').addClass('fa-angle-down');
                }
            }
        });
    });
});

/* Embed mini calendar */
$('.embedded-calendar').each(function(){
    var path = $(this).data('path');
    var type = $(this).data('type');
    rows = ($(this).data('rows') !== undefined) ? $(this).data('rows') : 5;
    if(path.includes('?')){
        path += '&'
    } else {
        path += '?';
    }
    console.log(path);
    $(this).load(path+'embedded='+type+'&path='+path+'&rows='+rows);
});

//Scroll on page adjusting for nav if nav-scrolling="yes"
$(document).on('click','[data-scrolling="yes"]',function(e){
    var id  = $(this).attr('href').substr($(this).attr('href').indexOf("#") + 1);
    if($('#'+id).length > 0){
        e.preventDefault();
        $('body,html').animate({scrollTop: $($('#'+id)).offset().top-60});
    }
});
/*

Was trying to lazy load images still when you click edit in OU
Not sure how to display images when in edit mode
if($('body').hasClass('edit-mode')){
	var OUEditModeObserver = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (mutation.addedNodes && mutation.addedNodes.length > 0) {
				// element added to DOM
				var hasClass = [].some.call(mutation.addedNodes, function(el) {
					return el.classList.contains('edit-mode');
				});
				if (hasClass) {
					// element has class `MyClass`
					$('.lazy-img').each(function(){
						lazyLoadImg($(this));
					});
				}
			}
		});
	});
	var config = {
		attributes: true,
		childList: true,
		characterData: true
	};
	OUEditModeObserver.observe(document.body, config);
}*/