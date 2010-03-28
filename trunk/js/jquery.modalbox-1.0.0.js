/*
* jQuery modalBox plugin <http://code.google.com/p/jquery-modalbox-plugin/> 
* @requires jQuery v1.2.6 or later 
* is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
/*
	Example / set custom localized strings:
	---------------------------------------
	<script type="text/javascript">
		var modalboxLocalizedStrings = {
			messageCloseWindow				: 'Fenster schliessen',
			messageAjaxLoader				: 'Bitte warten<br>Ihre Anfrage wird verarbeitet.',
			errorMessageIfNoDataAvailable	: '<strong>Keine Inhalte verf&uuml;gbar!</strong>',
			errorMessageXMLHttpRequest		: 'Ein technischer Fehler (XML-Http-Request Status "500") verhindert den Aufruf der Seite.<br /><br />Bitte versuchen Sie es sp&auml;ter noch einmal',
			errorMessageTextStatusError		: 'Ein technischer Fehler (AJAX-Anfrage fehlgeschlagen) verhindert den Aufruf der Seite.<br /><br />Bitte versuchen Sie es sp&auml;ter noch einmal'
		};
	</script>
*/
(function($){
	
	var getCurrentVersionOfJQUERY = jQuery.fn.jquery;
	var checkIeVersion5 = (navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion) == 4 && navigator.appVersion.indexOf("MSIE 5.5") != -1);
	var checkIeVersion6 = (navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion) == 4 && navigator.appVersion.indexOf("MSIE 6.0") != -1);
	var obsoleteBrowsers = false;
	if (jQuery.browser.msie && (checkIeVersion5 || checkIeVersion6)) {
		obsoleteBrowsers = true;
	}
	
	jQuery.fn.modalBox = function(globaloptions) {
		
		
		/*
			Example 1 / Show hidden content:
			------------------------------------
			<a class="openmodalbox" href="javascript:void(0);">
				Demolink / Content from &quot;span.modalboxContent&quot;
				<span class="modalboxContent">
					<!-- put HTML-Content here -->
				</span>
			</a>
			
			Example 2 / Show hidden content:
			------------------------------------
			<div id="yourOwnContentContainer" style="display:none;">
				<!-- put HTML-Content here -->
			</div>
			<a class="defineYoutOwnClassHere" href="javascript:void(0);">
				Demolink / Content from Custom Container &quot;div#yourOwnContentContainer&quot;
			</a>
			<script type="text/javascript">
				jQuery(document).ready(function(){
					jQuery("a.defineYoutOwnClassHere").modalBox({
						getStaticContentFrom : "#yourOwnContentContainer"
					});
				});
			</script>
			
			Example 3 / Ajax Link:
			------------------------------------
			<a class="openmodalbox" href="javascript:void(0);">
				Demolink / Ajax Link
				<input type="hidden" name="ajaxhref" value="yourcustomtemplate.html" />
			</a>
			
			Example 4 / Ajax Form:
			------------------------------------
			<form ction="" method="post">
				<input class="defaultInputsubmit openmodalbox" type="submit" value="open Form Content in modalBox" />
			</form>
			
			Example 5 / URL Direct Call:
			------------------------------------
			jQuery.fn.modalBox({ directCallURI: 'http://www.youruri.de' });
		*/
		
		
		globaloptions = jQuery.extend({
			setModalboxContainer				: '#modalBox',
			setModalboxBodyContainer			: '#modalBoxBody',
			setModalboxBodyContentContainer		: '.modalBoxBodyContent',
			setFaderLayer						: '#modalBoxFaderLayer',
			setAjaxLoader						: '#modalBoxAjaxLoader',
			setModalboxCloseButtonContainer 	: '#modalBoxCloseButton',
			
			getStaticContentFromInnerContainer	: '.modalboxContent',
			getStaticContentFrom				: null,
			
			setNameOfHiddenAjaxInputField		: 'ajaxhref',
			
			killModalboxOnlyWithCloseButton		: false,
			
			setTypeOfFaderLayer					: 'black', // options: white, black, disable
			setStylesOfFaderLayer				: {
				white			: 'background-color:#fff; filter:alpha(opacity=60); -moz-opacity:0.6; opacity:0.6;',
				black			: 'background-color:#000; filter:alpha(opacity=40); -moz-opacity:0.4; opacity:0.4;',
				transparent 	: 'background-color:transparent;'
			},
			
			setModalboxLayoutContainer_Begin	: '<div class="modalboxStyleContainerTopLeft"><div class="modalboxStyleContainerTopRight"><div class="modalboxStyleContainerContent">',
			setModalboxLayoutContainer_End		: '</div></div></div><div class="modalboxStyleContainerBottomLeft"><div class="modalboxStyleContainerBottomRight"></div></div>',
			setModalboxLayoutContainer_Begin_ObsoleteBrowsers : '<div class="modalboxStyleContainerTopRight"><div class="modalboxStyleContainerContent">',
			setModalboxLayoutContainer_End_ObsoleteBrowsers : '</div></div><div class="modalboxStyleContainerBottomRight"></div><div class="modalboxStyleContainerTopLeft"></div><div class="modalboxStyleContainerBottomLeft"></div>',
			
			localizedStrings					: {
				messageCloseWindow					: 'Close Window',
				messageAjaxLoader					: 'Please wait',
				errorMessageIfNoDataAvailable		: '<strong>No content available!</strong>',
				errorMessageXMLHttpRequest			: 'Error: XML-Http-Request Status "500"',
				errorMessageTextStatusError			: 'Error: AJAX Request failed'
			},
			
			minimalTopSpacingOfModalbox 		: 50,
			usejqueryuidragable					: false,
			
			directCallURI						: null
		}, globaloptions || {});
		
		
		
		// get custom localized strings if available
		if( typeof(modalboxLocalizedStrings) !== "undefined" ){
			if( modalboxLocalizedStrings !== "" ){
				globaloptions.localizedStrings = {
					messageCloseWindow				: modalboxLocalizedStrings["messageCloseWindow"],
					messageAjaxLoader				: modalboxLocalizedStrings["messageAjaxLoader"],
					errorMessageIfNoDataAvailable	: modalboxLocalizedStrings["errorMessageIfNoDataAvailable"],
					errorMessageXMLHttpRequest		: modalboxLocalizedStrings["errorMessageXMLHttpRequest"],
					errorMessageTextStatusError		: modalboxLocalizedStrings["errorMessageTextStatusError"]
				}
			}
		}
		
		
		if( globaloptions.directCallURI ){
			openModalBox({
				type	: 'ajax',
				source 	: globaloptions.directCallURI,
				data	: ''
			});
		}
		
		
		
		/************ initializeModalBox - BEGIN ************/
		var doNotBindEventsOnWindowResize = false;
				
		jQuery(window).resize(function(){
			centerModalBox();
			doNotBindEventsOnWindowResize = true;
		});
		
		
		if( !doNotBindEventsOnWindowResize ){
			if( getCurrentVersionOfJQUERY == "1.2.6" ){//jQuery 1.2.6 don't know .live()
				jQuery(this).unbind("click").bind("click", function(event){
					prepareModalbox({
						event 	: event,
						element : jQuery(this)
					});
				});
			} else {
				jQuery(this).die("click").live("click", function(event){
					prepareModalbox({
						event 	: event,
						element : jQuery(this)
					});
				});
			}
		}
		/************ initializeModalBox - END ************/
		
		
		
		/************ prepareModalbox - END ************/
		function prepareModalbox(settings){
			
			
			settings = jQuery.extend({// default settings
				event 	: null,
				element : null
			}, settings || {});
			
			
			if( settings.event && settings.element ){
				
				var currentEvent 	=  settings.event;
				var elementObj		= settings.element;
				
				var doNotOpenModalBoxContent = false;
				var isFormSubmit = false;
				
				if( elementObj.is("input") ){
					var source 		= elementObj.parents('form').attr('action');
					var data		= elementObj.parents('form').serialize();
					var type		= 'ajax';
					isFormSubmit 	= true;
					currentEvent.preventDefault();
				} else if ( jQuery("input[name$='" + globaloptions.setNameOfHiddenAjaxInputField + "']", elementObj).size() != 0 ) {
					var source 		= jQuery("input[name$='" + globaloptions.setNameOfHiddenAjaxInputField + "']", elementObj).val();
					var data		= '';
					var type		= 'ajax';
					currentEvent.preventDefault();
				} else if ( jQuery(globaloptions.getStaticContentFromInnerContainer, elementObj).size() != 0 ) {
					if ( jQuery(globaloptions.getStaticContentFromInnerContainer + " img", elementObj).size() != 0 ) {
						var currentImageObj = jQuery(globaloptions.getStaticContentFromInnerContainer + " img", elementObj);
					}
					var source 		= '';
					var data		= jQuery(globaloptions.getStaticContentFromInnerContainer, elementObj).html();
					var type		= 'static';
					currentEvent.preventDefault();
				} else if ( globaloptions.getStaticContentFrom ) {
					var source 		= '';
					var data		= jQuery(globaloptions.getStaticContentFrom).html();
					var type		= 'static';
					currentEvent.preventDefault();
				} else {
					doNotOpenModalBoxContent = true;
				}
				
				if( !doNotOpenModalBoxContent ){
					openModalBox({
						type				: type,
						element 			: elementObj,
						source 				: source,
						data				: data,
						loadImagePreparer 	: {
							currentImageObj 	: currentImageObj,
							finalizeModalBox 	: false
						}
					});
				}
				
				if( isFormSubmit ){
					return false;
				}
			}
		}
		/************ prepareModalbox - END ************/
		
		
		
		/************ simpleScrollTo - BEGIN ************/
		function simpleScrollTo(settings){
			
			/*
				Example:
				-----------------------------
				simpleScrollTo({
					targetElement : "#footer"
				});
			*/
	
			settings = jQuery.extend({// default settings
				targetElement	: null,
				typeOfAnimation	: "swing", // options: linear, swing, easing
				animationSpeed	: 800
			}, settings || {});

			if( settings.targetElement ){
				jQuery("html:not(:animated), body:not(:animated)").animate({ scrollTop: jQuery(settings.targetElement).offset().top }, settings.animationSpeed, settings.typeOfAnimation );
			}
		}
		/************ initializeModalBox - BEGIN ************/
		
		
		
		/************ ajaxRedirect - BEGIN ************/
		function ajaxRedirect(settings){


			settings = jQuery.extend({// default settings
				ar_XMLHttpRequest	: null,
				ar_textStatus		: null,
				ar_errorThrown		: null,
				targetContainer		: null,
				ar_enableDebugging	: false
			}, settings || {});
			
			
			// ~~~~~~~~~ global settings - BEGIN ~~~~~~~~~ //
			var XMLHttpRequest 	= settings.ar_XMLHttpRequest;
			var textStatus 		= settings.ar_textStatus;
			var errorThrown 	= settings.ar_errorThrown;
			// ~~~~~~~~~ global settings - END ~~~~~~~~~ //
			
			
			if ( XMLHttpRequest && textStatus != "error" ) {
				
				if( XMLHttpRequest.status == 403 ){
					
					var redirect = XMLHttpRequest.getResponseHeader("Location");
					if( typeof redirect !== "undefined" ) {
						location.href = redirect;
					}
					
				} else if ( XMLHttpRequest.status == 500 && settings.targetContainer ){
					
					addErrorMessage({
						errorMessage 	: globaloptions.localizedStrings["errorMessageXMLHttpRequest"],
						targetContainer	: settings.targetContainer
					});
				}
				
				if( settings.ar_enableDebugging ){
					console.log( "XMLHttpRequest.status: " + XMLHttpRequest.status );
				}
				
			} else if ( textStatus == "error" ) {
				
				if ( settings.targetContainer ){
					addErrorMessage({
						errorMessage 	: globaloptions.localizedStrings["errorMessageTextStatusError"],
						targetContainer	: settings.targetContainer
					});
				}
				
				if( settings.ar_enableDebugging ){
					console.log( "textStatus: " + textStatus );
				}
			} else {
				// no errors
			}
			
			
			function addErrorMessage(settings){

				settings = jQuery.extend({// default settings
					errorMessage 	: null,
					targetContainer	: null
				}, settings || {});
				
				if( settings.errorMessage && settings.targetContainer ){
					
					var errorMessageContainer	= '';
					errorMessageContainer += '<div class="simleModalboxErrorBox"><div class="simleModalboxErrorBoxContent">';
					errorMessageContainer += settings.errorMessage;
					errorMessageContainer += '</div></div>';
					
					jQuery(settings.targetContainer).removeAttr("style").html( errorMessageContainer );
					if( jQuery(settings.targetContainer).parents(globaloptions.setModalboxContainer).size() > 0 ){
						jQuery(globaloptions.setAjaxLoader).remove();
						centerModalBox();
					}
					
				}
			}
			
			
		}
		/************ ajaxRedirect - END ************/
		
		
		
		/************ addAjaxUrlParameter - BEGIN ************/
		function addAjaxUrlParameter(settings){


			settings = jQuery.extend({// default settings
				currentURL 			: '',
				addParameterName 	: 'ajaxContent',
				addParameterValue 	: 'true'
			}, settings || {});
			
			var currentURL = settings.currentURL;
				
			if( currentURL.indexOf(settings.addParameterName) != -1){
				currentURL = currentURL;
			} else {
				if( currentURL.indexOf("?") != -1){
					var currentSeparator = "&";
				} else {
					var currentSeparator = "?";
				}
				currentURL = currentURL + currentSeparator + settings.addParameterName + '=' + settings.addParameterValue;
			}
			
			return currentURL;
			
		}
		/************ addAjaxUrlParameter - END ************/
		
		
		
		/************ cleanupSelectorName - END ************/
		function cleanupSelectorName(settings){
		
			settings = jQuery.extend({
				replaceValue : ''
			}, settings || {});
			
			var currentReturnValue 	= settings.replaceValue;
			currentReturnValue 		= currentReturnValue.replace(/[#]/g, "");
			currentReturnValue 		= currentReturnValue.replace(/[.]/g, "");
			
			return currentReturnValue;
			
		}
		/************ cleanupSelectorName - END ************/
		
		
		
		/************ imagePreparer - END ************/
		function imagePreparer(settings){
		
			
			settings = jQuery.extend({
				type				: settings.type,
				element 			: settings.element,
				source 				: settings.source,
				data				: settings.data,
				loadImagePreparer 	: {
					currentImageObj 	: settings.loadImagePreparer["currentImageObj"],
					finalizeModalBox 	: settings.loadImagePreparer["finalizeModalBox"]
				},
				nameOfImagePreloaderContainer 	: "imagePreparerLoader"
			}, settings || {});
			
			
			if( settings.loadImagePreparer["currentImageObj"] ){
				
				
				jQuery(globaloptions.getStaticContentFromInnerContainer).css({ 
					visibility: "hidden", 
					display: "block" 
				});
				
				
				var getWidthOfCurrentImage 	= jQuery(settings.loadImagePreparer["currentImageObj"]).width();
				var getHeightOfCurrentImage = jQuery(settings.loadImagePreparer["currentImageObj"]).height();
				
				
				jQuery(globaloptions.getStaticContentFromInnerContainer).removeAttr("style");
				
				
				openModalBox({
					type				: settings.type,
					element 			: settings.element,
					source 				: settings.source,
					data				: settings.data,
					loadImagePreparer 	: {
						currentImageObj 				: settings.loadImagePreparer["currentImageObj"],
						widthOfImage					: getWidthOfCurrentImage,
						heightOfImage					: getHeightOfCurrentImage,
						finalizeModalBox 				: true,
						nameOfImagePreloaderContainer 	: settings.nameOfImagePreloaderContainer
					}
				});
			}
		}
		/************ imagePreparer - END ************/
		
		
		
		/************ addCloseButtonFunctionality - END ************/
		function addCloseButtonFunctionality(){
			var createCloseButtonFunctionality = '';
			createCloseButtonFunctionality += '<script type="text/javascript">';
				createCloseButtonFunctionality += 'jQuery(document).ready(function(){ jQuery(".closeModalBox", "' + globaloptions.setModalboxContainer + '").click(function(){ closeModalBox({layerContainer:\'' + globaloptions.setFaderLayer + '\', setModalboxContainer:\'' + globaloptions.setModalboxContainer + '\' }); }); });';
			createCloseButtonFunctionality += '</script>';
			jQuery(globaloptions.setModalboxContainer).append( createCloseButtonFunctionality );
		}
		/************ addCloseButtonFunctionality - END ************/
		
		
		
		/************ openModalBox - BEGIN ************/
		function openModalBox(settings){
		
			settings = jQuery.extend({
				type				: null,
				element 			: null,
				source 				: null,
				data				: null,
				loadImagePreparer 	: {
					currentImageObj 				: null,
					widthOfImage					: null,
					heightOfImage					: null,
					finalizeModalBox 				: false,
					nameOfImagePreloaderContainer 	: null
				},
				eMessageNoData		: globaloptions.localizedStrings["errorMessageIfNoDataAvailable"],
				onSuccess			: function(){
					addCloseButtonFunctionality();
					return false;
				}
			}, settings || {});
			
			
			if( !settings.data && settings.eMessageNoData ){
				settings.data = settings.eMessageNoData;
			}
			
			
			if( settings.loadImagePreparer["currentImageObj"] && !settings.loadImagePreparer["finalizeModalBox"] ){
				
				imagePreparer({
					type				: settings.type,
					element 			: settings.element,
					source 				: settings.source,
					data				: settings.data,
					loadImagePreparer 	: settings.loadImagePreparer
				});
				
			} else {
			
				if( settings.type ){
					
					
					if( settings.source ){
						settings.source = addAjaxUrlParameter({
							currentURL : settings.source
						});
					}
					
					
					if( settings.element ){
						if( jQuery(settings.element).hasClass("wideStyle") ){
							var setModalboxClassName = "wide";
						} else if( jQuery(settings.element).hasClass("middleStyle") ){
							var setModalboxClassName = "middle";
						} else if( jQuery(settings.element).hasClass("smallStyle") ){
							var setModalboxClassName = "small";
						} else if( settings.loadImagePreparer["nameOfImagePreloaderContainer"] ){
							var setModalboxClassName = "auto";
							var prepareCustomWidthOfModalBox = 'width:' + Math.abs( settings.loadImagePreparer["widthOfImage"] + 40 ) + 'px; ';
							prepareCustomWidthOfModalBox += 'height:' + Math.abs( settings.loadImagePreparer["heightOfImage"] + 40 ) + 'px; ';
						} else {
							var setModalboxClassName = "";
							var prepareCustomWidthOfModalBox = "";
						}
					}
					
					
					//~~~~ create Modalbox first - BEGIN ~~~~//
					if( jQuery(globaloptions.setModalboxContainer).size() == 0 ){
						showFaderLayer();
					} else {
						closeModalBox({
							layerContainer		: globaloptions.setFaderLayer,
							setModalboxContainer: globaloptions.setModalboxContainer
						});
					}
					
					
					var prepareNameOfModalboxContainer = cleanupSelectorName({
						replaceValue : globaloptions.setModalboxContainer
					});
					
					var prepareNameOfModalboxBodyContainer = cleanupSelectorName({
						replaceValue : globaloptions.setModalboxBodyContainer
					});
					
					var prepareNameOfModalboxContentContainer = cleanupSelectorName({
						replaceValue : globaloptions.setModalboxBodyContentContainer
					});
					
					var prepareNameOfCloseButtonContainer = cleanupSelectorName({
						replaceValue : globaloptions.setModalboxCloseButtonContainer
					});
					
					var prepareNameOfAjaxLoader = cleanupSelectorName({
						replaceValue : globaloptions.setAjaxLoader
					});
					
					
					var createModalboxContainer = '';
					createModalboxContainer += '<div id="' + prepareNameOfModalboxContainer + '" class="' + setModalboxClassName + '" style="' + prepareCustomWidthOfModalBox +  '">';
						createModalboxContainer += '<div id="' + prepareNameOfModalboxBodyContainer + '">';
							
							/* Default Design, Part 1 - BEGIN */
							if ( obsoleteBrowsers ) {
								createModalboxContainer += globaloptions.setModalboxLayoutContainer_Begin_ObsoleteBrowsers;
							} else {
								createModalboxContainer += globaloptions.setModalboxLayoutContainer_Begin;
							}
							/* Default Design, Part 1 - END */
								
								createModalboxContainer += '<div class="' + prepareNameOfModalboxContentContainer + '">';
									createModalboxContainer += '<div id="' + prepareNameOfAjaxLoader + '">' + globaloptions.localizedStrings["messageAjaxLoader"] + '</div>';
								createModalboxContainer += '</div>';
								
							/* Default Design, Part 2 - BEGIN */
							if ( obsoleteBrowsers ) {
								createModalboxContainer += globaloptions.setModalboxLayoutContainer_End_ObsoleteBrowsers;
							} else {
								createModalboxContainer += globaloptions.setModalboxLayoutContainer_End;
							}
							/* Default Design, Part 2 - END */
							
							//createModalboxContainer += '<div id="' + prepareNameOfCloseButtonContainer + '"><a href="javascript:closeModalBox({layerContainer:\'' + globaloptions.setFaderLayer + '\', setModalboxContainer:\'' + globaloptions.setModalboxContainer + '\' });" class="closeModalBox"><span class="closeModalBox">' + globaloptions.localizedStrings["messageCloseWindow"] + '</span></a></div>';
							createModalboxContainer += '<div id="' + prepareNameOfCloseButtonContainer + '"><a href="javascript:void(0);" class="closeModalBox"><span class="closeModalBox">' + globaloptions.localizedStrings["messageCloseWindow"] + '</span></a></div>';
						createModalboxContainer += '</div>';
					createModalboxContainer += '</div>';
					
					
					jQuery("body").append(createModalboxContainer);
					
					/*~~~ Note: the height of "div.modalboxStyleContainerTopLeft" will be set in function centerModalBox() for obsolete browsers like ie6 ~~~*/
					
					//~~~~ create Modalbox first - END ~~~~//
					
					
					switch (settings.type) {
						
						case 'static':{
						
							jQuery(globaloptions.setAjaxLoader).hide();
							jQuery(globaloptions.setModalboxBodyContentContainer, globaloptions.setModalboxContainer).html(settings.data);
							
							if ( obsoleteBrowsers ) {
								centerModalBox();
							}
							
							settings.onSuccess();
							
							break;
							
						} case 'ajax':{
						
							jQuery.ajax({
								type	: 'POST',
								url		: settings.source,
								data	: settings.data,
								success	: function(data, textStatus){
									
									jQuery(globaloptions.setAjaxLoader).hide();
									jQuery(globaloptions.setModalboxBodyContentContainer, globaloptions.setModalboxContainer).append(data);
									centerModalBox();
									
									settings.onSuccess();
								},
								error	: function(XMLHttpRequest, textStatus, errorThrown){
									ajaxRedirect({ 
										ar_XMLHttpRequest	: XMLHttpRequest,
										ar_textStatus		: textStatus,
										ar_errorThrown		: errorThrown,
										targetContainer		: globaloptions.setModalboxContainer + " " + globaloptions.setModalboxBodyContentContainer
									});
								}
							});
							
							break;
						}
					}
					if ( !obsoleteBrowsers ) {
						centerModalBox();
					}
				}
			}
		}
		/************ openModalBox - END ************/
		
		
		
		/************ centerModalBox - BEGIN ************/
		function centerModalBox(){
		
			if( jQuery(globaloptions.setModalboxContainer).size() != 0 ){
				
				if( jQuery("body a.modalBoxTopLink").size() == 0 ){
					jQuery("body").prepend('<a class="modalBoxTopLink"></a>');
				}
				
				var setPositionLeft = parseInt( jQuery(window).width() - jQuery(globaloptions.setModalboxContainer).width() ) / 2;
				if( setPositionLeft <= 0 ){
					setPositionLeft = 0;
				}
				
				var setPositionTop 	= parseInt( jQuery(window).height() - jQuery(globaloptions.setModalboxContainer).height() - 70 ) / 2;
				
				if (jQuery.browser.msie) {
					var scrollPositionTop = document.documentElement.scrollTop;
				} else {
					var scrollPositionTop = window.pageYOffset;
				}
				scrollPositionTop = scrollPositionTop + setPositionTop;
				
				
				if (jQuery.browser.msie && parseInt(jQuery.browser.version) < 7) {
						
					jQuery(globaloptions.setModalboxContainer).css({
						position	: "absolute",
						left		: setPositionLeft + 'px',
						display		: "block"
					});
					
					simpleScrollTo({
						targetElement : "a.modalBoxTopLink"
					});
					
				} else {
					
					if( setPositionTop <= 0 ){
						
						jQuery(globaloptions.setModalboxContainer).css({
							position	: "absolute",
							left		: setPositionLeft + 'px',
							top			: globaloptions.minimalTopSpacingOfModalbox + 'px',
							display		: "block"
						});
						
						simpleScrollTo({
							targetElement : "a.modalBoxTopLink"
						});
						
					} else {
					
						jQuery(globaloptions.setModalboxContainer).css({
							position: "fixed",
							left	: setPositionLeft + 'px',
							top		: setPositionTop + 'px',
							display	: "block"
						});
					}
				}
				
				if( globaloptions.usejqueryuidragable ){
					jQuery(globaloptions.setModalboxContainer).draggable("destroy").draggable({ opacity: false, iframeFix: true, refreshPositions: true });
				}
				
				showFaderLayer();
			}
			
			if ( obsoleteBrowsers ) {
				var getHeightOfTopRightContainer = jQuery("div.modalboxStyleContainerTopRight", globaloptions.setModalboxContainer).height();
				jQuery("div.modalboxStyleContainerTopLeft", globaloptions.setModalboxContainer).height( getHeightOfTopRightContainer );
			}
			
		}
		/************ centerModalBox - END ************/
		
		
		
		/************ showFaderLayer - BEGIN ************/
		function showFaderLayer(){
		
			
			if( globaloptions.setTypeOfFaderLayer == "white" ){
				var setStyleOfFaderLayer = globaloptions.setStylesOfFaderLayer["white"];
			} else if ( globaloptions.setTypeOfFaderLayer == "black" ){
				var setStyleOfFaderLayer = globaloptions.setStylesOfFaderLayer["black"];
			} else {//globaloptions.setTypeOfFaderLayer == "disable"
				var setStyleOfFaderLayer = globaloptions.setStylesOfFaderLayer["transparent"];
			}
			
			
			var currentFaderObj = jQuery(globaloptions.setFaderLayer);
				
			if ( currentFaderObj.size() == 0 ) {
				
				var prepareNameOfFaderLayer = cleanupSelectorName({
					replaceValue : globaloptions.setFaderLayer
				});
				
				jQuery("body").append('<div id="' + prepareNameOfFaderLayer + '" style="' + setStyleOfFaderLayer + '"></div><!--[if lte IE 6.5]><iframe class="modalBoxIe6layerfix"></iframe><![endif]-->');
				
				jQuery("iframe.modalBoxIe6layerfix").css({
					width 	: Math.abs( jQuery(globaloptions.setFaderLayer).width() - 1) + 'px',
					height 	: Math.abs( jQuery(globaloptions.setFaderLayer).height() - 1) + 'px'
				});
				
				if( !globaloptions.killModalboxOnlyWithCloseButton ){
					jQuery(globaloptions.setFaderLayer).unbind("click").bind("click", function(){
						closeModalBox({
							layerContainer		: globaloptions.setFaderLayer,
							setModalboxContainer: globaloptions.setModalboxContainer
						});
					});
				}
				
				jQuery(window).resize(function(){
					if ( jQuery(globaloptions.setFaderLayer).is(':visible') ) {
						showFaderLayer();
					}
				});
			} else if ( currentFaderObj.size() != 0 && !currentFaderObj.is(':visible') ){
				currentFaderObj.show();
			}
		}
		/************ showFaderLayer - END ************/
		
	};
	
	
	jQuery(document).ready(function(){//default Initializing
		if( jQuery(".openmodalbox").size() != 0 ){
			jQuery(".openmodalbox").modalBox();
		}
	});
	
	
})(jQuery);



function closeModalBox(settings){
	
	settings = jQuery.extend({
		layerContainer					: null,
		setModalboxContainer			: null
	}, settings || {});
	
	
	if( settings.layerContainer && settings.setModalboxContainer ){
		jQuery(settings.layerContainer).remove();
		jQuery(settings.setModalboxContainer).remove();
		jQuery("iframe.modalBoxIe6layerfix").remove();
	}
}