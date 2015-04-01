Modaliraptor
=============

A modal plugin that is highly configurable without being too opinionated about style and transition. This plugin relies completely on you for styling so it can provide functionality while staying out of your way so you can create what you need withuout jumping over hurdles.

## Using the plugin

### Initialization

Select the elements you want tooltips enacted on.

```javascript
$('a').modaliraptor();  
// or  
$('.custom-select-class').modaliraptor();  

// With custom options.  
$('.custom-select-class').modaliraptor({  
	showEvent: 'click',  
	showClass: 'active' // defaults to 'show'
});
```

### Calling Modal Methods

```javascript
$(.custom-select-class).modaliraptor('show');

/**
	Arguments can be passed as a single string or in an array for multiple arguments.
	Below, this tells the modal to hide and says there is no event data, but still trigger
	HTML5 History.
**/
$(.custom-select-class).modaliraptor('hide', [false, true]);
```

### Select All Instances of the Modaliraptor or Those With Certain Properties

```javascript
$(':modalPlugin');
// or to only select modals with urls
$(':modalUrl');

// Select instances with certain properties
$(':modalPlugin("isOpen")');
// or properties with certain values
$(':modalPlugin("isOpen:false")');
```

## Default Modal HTML

```html
<div class="mdr-overlay">
	<div class="modal">
		<a href="#" class="close-btn" data-close-modal="">Close</a>
		<div class="content">
			[Your content]
		</div>
	</div>
</div>
```

## Options

Here are the options you can set globally or on an indivdual basis through multiple initializations or by adding ```data-modal-options``` to initialized elements. When using the data attribute the options must be passed as json like so:

```html
<a href="//nicenicejpg.com/600/400" data-modal-options='{"modalUrl": "vanilla-ice"}'>Image Modal w/ URL</a>
```

##### overlayClass
The class applied to the main container. Can be used to change the overall modal style.

Type: `string`  
Default: `'mdr-overlay'`

##### overlayModifier
An extra class or classes applied to the main container in addition to the main overlay class. Can be used to change the overall modal style. Multiple classes should be separated by a space.

Type: `string`  
Default: `'mdr-overlay'`  
Example : `'modify-1 modify-2'`

##### overlayAttrs
Any attributes to be applied to the main container. Multiple attributes should be separated by a space. Great for applying a special ID to an overlay container. Can't be used for "inline" modals. Attributes for "inline" modals must be applied to the modal HTML directly.

Type: `string`  
Default: `''`  
Example: `'id="modal-1" aria-hidden="true"'`  

##### modalClass
The class applied to the modal container. Can be used to change the overall modal style.

Type: `string`  
Default: `'modal'`

##### modalModifier
An extra class or classes applied to the modal container in addition to the main modal class. Can be used to change the overall modal style. Multiple classes should be separated by a space.

Type: `string`  
Default: `''`  
Example : `'modify-1'`

##### modalAttrs
Any attributes to be applied to the modal container. Multiple attributes should be separated by a space. Great for applying a special ID to a modal container.

Type: `string`  
Default: `''`  
Example: `'id="special-modal"'`  

##### dataOptName
The name of the data attribute to be used to pass custom options on the initialized element. When using on an item remember to add `data-` as a prefix. For example the default would be added as `data-modal-options` to an element.

Type: `string`  
Default: `'modal-options'`  
Example: `'my-modal-options"'`  

##### contentType
The type of content to be inserted into the modal. The default is an image modal where the image url should be the `src` attribute of the initialized element.

Type: `string`  
Default: `'image'`  
Options:  
  
* `inline` - If you would like to use modal HTML rendered by the server pass this option and set the modal ID to the `src` attribute of the initialized element.  
* `iframe` - Used for any modal content that will be primarily an iframe such as YouTube videos, Google Maps, etc. Set the iframe link to the `src` attribute of the initialized element.  
* `ajax` - Used for pulling in HTML from another page. Set the ajax url to the `src` attribute of the initialized element. Can be used in conjuction with `ajaxContext` to only pull specific elements into the modal.  
* `custom` - Used to pass custom HTML or text into the modal. Set the custom content with the `customContent` option.  

##### contentClass
The class applied to the content container.

Type: `string`  
Default: `'content'`


##### contentModifier
An extra class or classes applied to the content container in addition to the main container class. Multiple classes should be separated by a space.

Type: `string`  
Default: `''`  
Example : `'modify-1'`

##### contentAttrs
Any attributes to be applied to the content container. Multiple attributes should be separated by a space. Great for applying a special ID to a content container.

Type: `string`  
Default: `''`  
Example: `'id="special-content"'`  

##### modalTemplate
Used for overriding the default modal template HTML. If the `overlay`, `modal`, or `content` containers are given different classes be sure to pass those as the appropriate options.

Type: `string`  
Default: `null`  
Example: `'<div class="mdr-custom-overlay"><div class="modal-header"><a href="#" class="close-btn" data-close-modal>Close <i class="fa fa-times"></i></a><ul><li><a href="#" class="fa fa-bomb"></a></li><li><a href="#" class="fa fa-folder"></a></li></ul></div><div class="modal"><div class="content"></div></div></div>'`  

##### customContent
Used to display custom content in the modal. Must also set `contentType: 'inline'`. Pass in HTML or just text.

Type: `string`  
Default: `null`  
Example : `'<p>Hey I'm a modal</p>'`

##### ajaxSettings
If special ajax settings are required pass those here. The `url` property is set to the initialized element's `src` by default. The default ajax object that only contains the `url` will be extended with the passed object so setting `url` here as well isn't necessary. All other settings are default jQuery `$.ajax` settings seen [here](http://api.jquery.com/jquery.ajax/).  

Type: `object`  
Default: `{}`  
Example : `{dataType: 'json'}`

##### ajaxContext
Used to only include specific elements when pulling in HTML from another page.

Type: `string`  
Default: `null`  
Example : `'p, .some-class'` 

##### showClass
The class applied to the main container when the modal is active. Mainly used to show/transition the modal using CSS.

Type: `string`  
Default: `'show'`  
Example : `'active'`

##### showEvent
The event attached to the initialized element used to show the modal.

Type: `string`  
Default: `'click'`  
Options : `'hover'`  

##### evtNamespace
Used to give a custom namespace to attached modal events. Ideal for making sure other code doesn't remove modal specific events.

Type: `string`  
Default: `'ally.modal'`  

##### closeBtnContent
Set custom text or HTML on the modal's close button. Will be wrapped in an anchor tag by default. Useful for adding an icon to the close button.

Type: `string`  
Default: `Close`  
Example : `'Close <i class="close-icon"></i>'`

##### closeBtnClass
The class applied to close button anchor tag.

Type: `string`  
Default: `'close-btn'`  

##### closeBtnAttrs
Attributes applied to the close button anchor tag. The default is also the selector used to attach the "hide" events to. If this is changed make sure the close button has the right class or attribute that is included in the `closeModal` selector.

Type: `string`  
Default: `'data-close-modal'`  
Example : `'rel="close-modal"'`

##### closeModal
The selector used to close the modal. By default the `data-close-modal` attribute is used to close the modal. This event is delegated from the main modal container so any child element with this selector could be used to close the modal. If this is changed make sure this selector is included in `closeBtnAttrs`.

Type: `string`  
Default: `'[data-close-modal]'`  
Example : `'.my-modal-closer'`

##### clickOutsideToHide
Option to allow the modal to be hidden by clicking outside the modal container. Note: if CSS sets the modal container to be 100% height/width of the window this won't work.

Type: `boolean`  
Default: `true`  

##### autoShow
Option to force the modal to be be shown on page load. If the url has the hash url of another modal on the page that modal will override the "auto show" modal.

Type: `boolean`  
Default: `false`  

##### keepClosedId
This option is used in conjuction with the `autoShow` option. If it is set, when the user closes the modal the modal will not "auto show" for a specified duration of time.

Type: `string`  
Default: `false`  
Example: `my-modal`  

##### closedDuration
The amount of time, in days, an "auto-show" modal will not automatically show after the user has closed it.

Type: `number`  
Default: `30`  

##### modalUrl
To link to or activate HTML5 History on a modal set this option to the url hash for the modal. This option will be applied as a hash at the end of a url when the modal is open. It allows back/forward button functionality to navigate away from or to the modal. A [history polyfill](https://github.com/devote/HTML5-History-API) is required for this to work in IE9 and below.

Type: `string`  
Default: `null`  
Example: `my-modal-url`  

##### ie8Center
Choose whether to center a modal in IE8 with inline `left` and `top` styles. If left `true` this will only happen in IE8. All modern browsers should take advantage of the proper CSS centering method below which will center any container, even if they are percentage based.

```css
.modal {
	position: fixed;
	left: 50%;
	top: 50%;
	-webkit-transform: translateX(-50%) translateY(-50%);
	-ms-transform: translateX(-50%) translateY(-50%);
	transform: translateX(-50%) translateY(-50%);
}
```

Type: `boolean`  
Default: `true`  

##### onCreate, onOpen, onClose
Set functions for different modal events. The `onCreate` function is called after the modal HTML is attached to the page. It is possible, however, for ajaxed content to not be available in the DOM yet. If this is required, set functions to the `success` or `error` properties in the `ajaxSettings` option object.

Type: `function`  
Default: `$.noop`