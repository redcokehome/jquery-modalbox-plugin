# Introduction #

jQuery modalBox is a simple jQuery plugin that provides a multiple customizable modal dialog. This Plugin is written in JavaScript on top of the jQuery library and shows inline content, content served through AJAX and single images.


  * Requires jQuery v1.7.1 or later
  * Take a look at the [demo page](http://opensource.steffenhollstein.de/templates/modalbox/).


## 1. Integration ##

Include the following script and stylesheet in your head of your HTML-Document:
```
<head>
    <link type="text/css" rel="stylesheet" href="jquery.modalbox.css" />
    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script type="text/javascript" src="jquery.modalbox-1.5.0-min.js"></script>
</head>
```

For own translations bind following script block. The default locale is english.
```
<script type="text/javascript">
/* <![CDATA[ */
    var modalboxGlobalDefaults = {
        localizedStrings : {
            messageCloseWindow : 'Fenster schliessen',
            messageAjaxLoader : 'Bitte warten<br />Ihre Anfrage wird verarbeitet.',
            errorMessageIfNoDataAvailable : '<strong>Keine Inhalte verf&uuml;gbar!</strong>',
            errorMessageXMLHttpRequest : 'Ein technischer Fehler (XML-Http-Request Status "500") verhindert den Aufruf der Seite.
            <br /><br />
            Bitte versuchen Sie es sp&auml;ter noch einmal',
            errorMessageTextStatusError : 'Ein technischer Fehler (AJAX-Anfrage fehlgeschlagen) verhindert den Aufruf der Seite.
            <br /><br />
            Bitte versuchen Sie es sp&auml;ter noch einmal'
        }
    };
/* ]]> */
</script>
```


## 2. Initialization ##

The default initialization is set by the class "openmodalbox" triggered on an element:
```
<a class="openmodalbox" href="javascript:void(0);">
    Demolink
    <span class="modalboxContent">
        My Custom Content...
    </span>
</a>
```

Initialize custom Elements:
```
<script type="text/javascript">
/* <![CDATA[ */
    jQuery(document).ready(function(){
        jQuery("a.defineYoutOwnClassHere").modalBox();
    });
/* ]]> */
</script>
<a class="defineYoutOwnClassHere" href="javascript:void(0);">
    Demolink
    <span class="modalboxContent">
        My Custom Content...
    </span>
</a>
```

Initialization of modalBox with optional parameter options:
```
<script type="text/javascript">
/* <![CDATA[ */
    jQuery(document).ready(function(){
        jQuery(".openmodalbox").modalBox({
            setTypeOfFaderLayer    : 'black', // options: white, black, disable
            killModalboxWithCloseButtonOnly : true, // options: true, false (close the modal box with close button only),
            setStylesOfFaderLayer : {// define the opacity and color of fader layer here
                white : 'background-color:#fff; filter:alpha(opacity=60); -moz-opacity:0.6; opacity:0.6;',
                black : 'background-color:#000; filter:alpha(opacity=40); -moz-opacity:0.4; opacity:0.4;',
                transparent : 'background-color:transparent;'
            },
            minimalTopSpacingOfModalbox : 50 // sets the minimum space between modalbox and visible area in the browser window
        });
    });
/* ]]> */
</script>
```


## Show hidden Content ##

**Example 1**
```
<a class="openmodalbox" href="javascript:void(0);">
    Demolink
    <span class="modalboxContent">
        <h3>Test Modalbox</h3><br />
        Identius, ora Disicio...
    </span>
</a>


<div class="openmodalbox">
    Click here
    <div class="modalboxContent">
        <a href="javascript:alert('It works.');">Click again</a>
    </div>
</div>
```

**Example 2**
```
<div id="yourOwnContentContainer" style="display:none;">
    <h3>Test Modalbox</h3><br />
    Identius, ora Disicio...
</div>
<a class="defineYoutOwnClassHere" href="javascript:void(0);">
    Demolink
    <span class="modalboxContent">
        <h3>Test Modalbox</h3><br />
        Identius, ora Disicio...
    </span>
</a>
<script type="text/javascript">
/* <![CDATA[ */
    jQuery(document).ready(function(){
        jQuery("a.defineYoutOwnClassHere").modalBox({
            getStaticContentFrom : "#yourOwnContentContainer"
        });
    });
/* ]]> */
</script>
```


## AJAX ##

**Via input hidden field "ajaxhref"**
```
<a class="openmodalbox" href="javascript:void(0);">
    Demolink
    <input type="hidden" name="ajaxhref" value="testinclude.php?test=tester" />
</a>
```

**Via Attribute "rel"**
```
<a class="openmodalbox" rel="ajax:testinclude.php?test=tester" href="javascript:void(0);">
    Demolink
</a>
```

**forms / the form submit button can be the type "submit/button/image"**
```
<form id="myTestForm" name="myTestForm" action="testinclude.php" method="post">
    <input class="openmodalbox" type="submit" value="open Form Content in modalBox" />
</form>
```

**Reload Ajax Content in modal layer / requires jQuery v1.3.2 or later**

Case: you have initialized a modalBox where you want to reload content again.
```
<a class="openmodalbox" href="javascript:void(0);">
    Reload content from ajaxhref
    <input type="hidden" name="ajaxhref" 
        value="inc_ajaxinclude_3.php" 
    />
</a>

<a class="openmodalbox" href="javascript:void(0);">
    Reload hidden content
    <span class="modalboxContent">
        <h3>Test - reload hidden content</h3><br />
        Identius, ora Disicio...
    </span>
</a>
```


## Pictures ##

**Via Attribute "href" / Image Only:**
```
<a class="openmodalbox" href="demopicture_kalexis_newzealand_6930.JPG">
    Demolink
</a>
```


**Via Attribute "href" / Linked Image:**
```
<a class="openmodalbox" href="demopicture_kalexis_newzealand_6930.JPG?link[http://www.yourlink.com]">
    Demolink
</a>
```


**Via Attribute "rel" / Image Only:**
```
<a class="openmodalbox" href="javascript:void(0);" rel="demopicture_kalexis_newzealand_6930.JPG">
    Demolink
</a>
```


**Via Attribute "rel" / Linked Image:**
```
<a class="openmodalbox" href="javascript:void(0);" rel="demopicture_kalexis_newzealand_6930.JPG?link[http://www.yourlink.com]">
    Demolink
</a>
```


## Custom close button ##
```
<a class="closeModalBox" href="javascript:void(0);">
    Close Modalbox
</a>

<input class="closeModalBox" type="button" 
    name="customCloseButton" 
    value="Custom Close Button / Button" 
/>

<div class="closeModalBox">
    Custom Close Button / Other
</div>
```


## Call a custom function before layer will be shown ##

```
<a class="testlink" href="javascript:void(0);">
    Demolink
    <input type="hidden" name="ajaxhref" value="inc_ajaxinclude_1.php" />
</a>
<script type="text/javascript">
/* <![CDATA[ */
    jQuery(document).ready(function(){
        jQuery("a.testlink").modalBox({
            callFunctionBeforeShow : function(){
                alert("confirm this");
                return true;
            }
        });
    });
/* ]]> */
</script>
```



## Call a custom function after layer is shown ##

```
<a class="testlink" href="javascript:void(0);">
    Demolink
    <input type="hidden" name="ajaxhref" value="inc_ajaxinclude_1.php" />
</a>
<script type="text/javascript">
/* <![CDATA[ */
    jQuery(document).ready(function(){
        jQuery("a.testlink").modalBox({
            callFunctionAfterShow : function(){
                alert("Modalbox is complete");
            }
        });
    });
/* ]]> */
</script>
```


## Call a custom function before layer will be closed ##

```
<a class="testlink" href="javascript:void(0);">
    Demolink
    <input type="hidden" name="ajaxhref" value="inc_ajaxinclude_1.php" />
</a>
<script type="text/javascript">
/* <![CDATA[ */
    jQuery(document).ready(function(){
        jQuery("a.testlink").modalBox({
            callFunctionBeforeHide : function(){
                alert("Hiding Layer after confirming this");
            }
        });
    });
/* ]]> */
</script>
```


## Call a custom function after layer is closed ##

```
<a class="testlink" href="javascript:void(0);">
    Demolink
    <input type="hidden" name="ajaxhref" value="inc_ajaxinclude_1.php" />
</a>
<script type="text/javascript">
/* <![CDATA[ */
    jQuery(document).ready(function(){
        jQuery("a.testlink").modalBox({
            callFunctionAfterHide : function(){
                alert("The modalbox is closed completly");
            }
        });
    });
/* ]]> */
</script>
```



## Special functionalities ##

Initializes a modalBox from any javascript function.

**Direct call via "source" (AJAX)**
```
<script type="text/javascript">
/* <![CDATA[ */
    jQuery(document).ready(function(){
        jQuery.fn.modalBox({ 
            directCall: { 
                source : 'inc_ajaxinclude_1.php?test=tester'
            }
        });
    });
/* ]]> */
</script>
```

**Direct call via "data" (push static content)**
```
<script type="text/javascript">
/* <![CDATA[ */
    jQuery(document).ready(function(){
        jQuery.fn.modalBox({ 
            directCall: { 
                data : '<div class="testclass"><p>test</p></div>'
            }
        });
    });
/* ]]> */
</script>
```

**Direct call via "element" (get content from HTML Element)**
```
<div id="testDirectCallHtmlContent" style="display:none;">
    Test content
</div>
<script type="text/javascript">
/* <![CDATA[ */
    jQuery(document).ready(function(){
        jQuery.fn.modalBox({ 
            directCall: { 
                element : '#testDirectCallHtmlContent'
            }
        });
    });
/* ]]> */
</script>
```

**Direct call via "image" (get content from HTML Element)**
```
<script type="text/javascript">
/* <![CDATA[ */
    jQuery(document).ready(function(){
        jQuery.fn.modalBox({ 
            directCall: { 
                image : 'demopicture_kalexis_newzealand_6930.JPG',
                imageLink : 'http://www.yourlink.com'
            }
        });
    });
/* ]]> */
</script>
```





&lt;hr/&gt;


# Methods #
**Method "close". Close the modalBox from everywhere.**
```
<script type="text/javascript">
/* <![CDATA[ */
    jQuery.fn.modalBox("close");
/* ]]> */
</script>
```

**Method "center". Repositioning the modalBox.**
```
<script type="text/javascript">
/* <![CDATA[ */
    jQuery.fn.modalBox("center");
/* ]]> */
</script>
```





&lt;hr/&gt;


# Optional parameter options #
**setTypeOfFadingLayer**
  * type: string
  * default value: `'black'`
  * options: white, black, disable
**setStylesOfFadingLayer**
  * type: array/string
  * default value:
    1. `white: 'background-color:#fff; filter:alpha(opacity=60); -moz-opacity:0.6; opacity:0.6;'`,
    1. `black: 'background-color:#000; filter:alpha(opacity=40); -moz-opacity:0.4; opacity:0.4;'`,
    1. `transparent: 'background-color:transparent;'`,
    1. `custom: null`
  * description: define the opacity and color of fader layer here
**disablingClickToClose**
  * type: boolean
  * default value: true
  * options: true, false
**disablingTheOverlayClickToClose**
  * type: boolean
  * default value: true
  * options: true, false
**minimalTopSpacing**
  * type: integer
  * default value: 50
  * description: sets the minimum space between modalbox and visible area in the browser window
**setModalboxLayoutContainer\_Begin**
  * type: string
  * default value: `'<div class="modalboxStyleContainerTopLeft"><div class="modalboxStyleContainerTopRight"><div class="modalboxStyleContainerContent">'`
  * description:
**setModalboxLayoutContainer\_End**
  * type: string
  * default value: `'</div></div></div><div class="modalboxStyleContainerBottomLeft"><div class="modalboxStyleContainerBottomRight"></div></div>'`
  * description:
**selectorModalboxContainer**
  * type: string
  * default value: `'#modalBox'`
  * description:
**selectorModalboxBodyContainer**
  * type: string
  * default value: `'#modalBoxBody'`
  * description:
**selectorModalboxBodyContentContainer**
  * type: string
  * default value: `'.modalBoxBodyContent'`
  * description:
**selectorFadingLayer**
  * type: string
  * default value: `'#modalBoxFaderLayer'`
  * description:
**selectorAjaxLoader**
  * type: string
  * default value: `'#modalBoxAjaxLoader'`
  * description:
**selectorCloseModalBox**
  * type: string
  * default value: `'.closeModalBox'`
  * description:
**selectorModalboxCloseContainer**
  * type: string
  * default value: `'#modalBoxCloseButton'`
  * description:
**selectorModalboxContentContainer**
  * type: string
  * default value: `'.modalboxContent'`
  * description:
**selectorHiddenAjaxInputField**
  * type: string
  * default value: `'ajaxhref'`
  * description:
**selectorPreCacheContainer**
  * type: string
  * default value: `'#modalboxPreCacheContainer'`
  * description:
**selectorImageLink**
  * type: string
  * default value: `'.modalBoxImageLink'`
  * description:
**selectorImageNoLink**
  * type: string
  * default value: `'.modalBoxImageNoLink'`
  * description:
**setWidthOfModalLayer**
  * type: integer
  * default value: null
  * description: set the the outher width of modalbox container
**customClassName**
  * type: string
  * default value: null
  * description: add a custom class to the outher DIV-Container
**positionLeft**
  * type: integer
  * default value: null
  * description: set the left position of modalbox
**positionTop**
  * type: integer
  * default value: null
  * description: set the topposition of modalbox
**effectType\_show\_fadingLayer**
  * type: array
  * default value: ['fade', 'fast']
  * options: ['show'] or ['fade', 'fast']
**effectType\_hide\_fadingLayer**
  * type: array
  * default value: ['fade', 'fast']
  * options: ['hide'] or ['fade', 'fast']
**effectType\_show\_modalBox**
  * type: array
  * default value: ['show']
  * options: ['show'] or ['fade', 'fast']
**effectType\_hide\_modalBox**
  * type: array
  * default value: ['hide']
  * options: ['hide'] or ['fade', 'fast']
**ajax\_type**
  * type: string
  * default value: 'POST'
  * description: define the type of ajax request to make "POST" or "GET"
**ajax\_contentType**
  * type: string
  * default value: 'application/x-www-form-urlencoded; charset=utf-8'
  * description: set the charset of ajax request
**callFunctionBeforeShow**
  * type: function
  * default value: function(){ return true; }
  * description: call a custom function before layer will be shown. return value must be "true" to finalize modal layer
**callFunctionAfterShow**
  * type: function
  * default value: function(){}
  * description: call a custom function after layer is shown
**callFunctionBeforeHide**
  * type: function
  * default value: function(){}
  * description: call a custom function before layer will be closed
**callFunctionAfterHide**
  * type: function
  * default value: function(){}
  * description: call a custom function after closing layer




&lt;hr/&gt;


# Release Notes #
**2013-03-21 / 1.5.0**
  * JS / Replace deprecated event handlers .die() and .live() by .off() and .on()

**2013-02-09 / 1.4.4**
  * JS / Fixed Error "ReferenceError: customWidth is not defined" in function "clean()"

**2013-01-20 / 1.4.3**
  * JS / fixed infinity loop of callback function "callFunctionAfterShow"

**2013-01-02 / 1.4.2**
  * JS / fixed loading of image only content
  * JS / extend the method "close" with optional parameter "customClass" and "customWidth"
  * CSS / Update "jquery.modalbox-basic.css" (img.modalBoxImagePreload, img.modalBoxImageLoadingSuccessful)

**2012-04-03 / 1.4.1**
  * JS / Add new Optional Parameter "disablingClickToClose"
  * JS / Rename Optional Parameter "minimalTopSpacingOfModalbox" to "minimalTopSpacing"
  * JS / Rename Optional Parameter "killModalboxWithCloseButtonOnly" to "disablingTheOverlayClickToClose"
  * CSS / Styles for "div#modalBox.disablingClickToClose"

**2012-04-01 / 1.4.0**
  * JS / add new Option "Image Link"
  * JS / change event binding (.live to .bind) of close methods
  * CSS / add default styles for "a.modalBoxImageLink", "img.modalBoxImageNoLink"

**2012-02-12 / 1.3.0**
  * JS / add new Method "center" to repositioning Modalbox
  * JS / add new functionality to show Single Gallery Image
  * JS / add new option "image" for "directCall"
  * JS / add new option for loading ajax content via attribute "rel"

**2011-06-02 / 1.2.1**
  * JS / add new method "dragBox". It will not be necessary to using jQuery UI Draggable PlugIn.

**2010-12-30 / 1.2.0**
  * JS / renew callback functions. new options : callFunctionBeforeShow, callFunctionAfterShow, callFunctionBeforeHide, callFunctionAfterHide
  * JS / change the type of method encapsulation and architecture. collect all plugin's methods in the object literal "methods".
  * JS / new options for fading effects (effectType\_show\_fadingLayer, effectType\_hide\_fadingLayer, effectType\_show\_modalBox, effectType\_hide\_modalBox)

**2010-11-29 / 1.1.7**
  * JS / fix multiple event calls after closing modalBox

**2010-11-29 / 1.1.6**
  * JS / add new option "callFunctionAfterClosedLayer"
  * JS / re-new centering and fading of modal box

**2010-11-28 / 1.1.5**
  * JS / remove no more needed Parameter "eMessageNoData"
  * JS / center modalBox after displaying fading layer
  * CSS / add new skin "precious-white"

**2010-11-14 / 1.1.4**
  * JS / fix positioning of modal box on window resize

**2010-11-14 / 1.1.3**
  * JS / fix process "callFunctionAfterSuccess"
  * JS / fix fadeIn/fadeOut for IE-Browsers (disable fading of opacity)
  * JS / remove functionalities of obsolete Browser "Internet Explorer 6"
  * JS / add new optional parameter "ajax\_type" and "ajax\_contentType" for ajax submit
  * JS / renew the styling container because of simplifying css
  * CSS / simplify css - using image sprites

**2010-11-09 / 1.1.2**
  * JS / jQuery 1.2.6 is not longer supported
  * JS / change handling of default options
  * JS / attribut "positionLeft" and "positionTop" must be a Integer Value

**2010-11-05 / 1.1.1**
  * JS / add options "fadeInActive" + "fadeOutActive"
  * JS / fix positioning of large content

**2010-10-24 / 1.1.0**
  * JS / add options "positionLeft" + "positionTop"
  * JS / add option "customClassName"

**2010-05-02 / 1.0.9**
  * JS / update image preparer : trap multiple images
  * JS / update "directCall" width option "element"
  * JS / initialize close event if ajax call has errors
  * CSS / add basic style for .modalgallery

**2010-04-16 / 1.0.8**
  * CSS: skin support
  * CSS: added jquery.modalbox-skin-default.css and jquery.modalbox-skin-rounded-black.css
  * JS: fix custom localizing

**2010-04-14 / 1.0.7**
  * JS: added pre-cache functionality

**2010-04-14 / 1.0.6**
  * CSS/JS: renew IE6 Layer fix
  * add new parameter "setWidthOfModalLayer" to set width of modalBox

**2010-04-11 / 1.0.5**
  * CSS: styling close button
  * JS / bugfixing: remove comma seperator

**2010-04-11 / 1.0.4**
  * CSS: add styling for "emphasis"
  * JS / add option "custom" for parameter "setTypeOfFaderLayer"
  * JS / add option "custom" for parameter "setStylesOfFaderLayer"
  * JS / add check for class "emphasis"

**2010-04-05 / 1.0.3**
  * expand direct call: "source" or "data" can be set
  * default initializing: remove not needed check of size()

**2010-03-29 / 1.0.1**
  * JS: add events "jQuery.fn.modalBox.close" and "jQuery.fn.modalBox.clean"
  * CSS: add default reset for modalBox Container (needed if no global reset is set in customer css)

**2010-03-28 / 1.0.0**
  * initial commit of jquery.modalbox-1.0.0