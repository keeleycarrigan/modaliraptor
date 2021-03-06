;(function ($, window, document, undefined) {
    var pluginName = 'allyModal',
        isIE8 = !+'\v1',
        defaults = {
            overlayClass: 'ally-overlay',
            overlayModifier: '',
            overlayAttrs: '',
            modalClass: 'modal',
            modalModifier: '',
            modalAttrs: '',
            dataOptName: 'modal-options',
            contentType: 'image',
            contentClass: 'content',
            contentModifier: '',
            contentAttrs: '',
            modalTemplate: null,
            customContent: null,
            ajaxSettings: {},
            ajaxContext: null,
            showClass: 'show',
            showEvent: 'click',
            evtNamespace: 'ally.modal',
            closeBtnContent: 'Close',
            closeBtnClass: 'close-btn',
            closeBtnAttrs: 'data-close-modal',
            closeModal: '[data-close-modal]',
            clickOutsideToHide: true,
            isOpen: false,
            autoShow: false,
            keepClosedId: false,
            closedDuration: 30,
            modalUrl: null,
            ie8Center: true,
            onCreate: $.noop,
            onOpen: $.noop,
            onClose: $.noop
        },
        isPluginType = function (el) {
            return typeof($(el).data('plugin_' + pluginName)) === 'object';
        },
        checkModalData = function () {
            // For IE8
            Date.now = Date.now || function () { return +new Date; };

            var storedData = JSON.parse(localStorage.getItem('allyModal'))
                currentDate = Date.now();

            if (storedData && storedData.keepClosed) {
                for (var key in storedData.keepClosed) {
                    if (storedData.keepClosed.hasOwnProperty(key)) {
                        if (storedData.keepClosed[key] <= currentDate) {
                            delete storedData.keepClosed[key];

                            storedData = JSON.stringify(storedData);

                            localStorage.setItem('allyModal', storedData);
                        }
                    }
                }
            }
        },
        escClose = function (e) {
            if (!e.keyCode || e.keyCode === 27) {
                $(':modalPlugin("isOpen")')[pluginName]('hide', [false, true]);
            }
        },
        initModalEnv = function () {
            var location = window.history.location || window.location; // For History Polyfill

            $(document).on('keyup', escClose);
            checkModalData();

            $(window).on('popstate.modal.history', function (e) {
                // Just close the open one!
                $(':modalPlugin("isOpen")')[pluginName]('hide');

                if (history.state && history.state.modal) {
                    $(':modalUrl("' + history.state.modal + '")')[pluginName]('show');   
                }
                
            });
        },
        getTrueValue = function (val) {
            if (isNaN(parseInt(val, 10))) {
                switch (val) {
                case 'null':
                    return null;
                    break;
                case 'true':
                    return true;
                    break;
                case 'false':
                    return false;
                    break;
                case 'undefined':
                    return undefined;
                    break;
                default:
                    return val;
                    break;    
                }
            }

            return parseInt(val, 10);
        };

    initModalEnv();

    $.extend($.expr[':'], {
        modalPlugin: function (el, index, meta) {
            if (meta[3] && isPluginType(el)) {
                var inputOpts = meta[3].split(':'),
                    pluginOpts = $.data(el, 'plugin_' + pluginName)['options'][inputOpts[0]];

                if (inputOpts.length > 1) {
                    return pluginOpts === getTrueValue(inputOpts[1]);
                } else {
                    return pluginOpts;
                }
            } else {
                return isPluginType(el);    
            }
        },
        modalUrl: function (el, index, meta) {
            if (isPluginType(el)) {
                var modalUrl = $.data(el, 'plugin_' + pluginName)['options']['modalUrl'];

                // This check allows selection by ':modalUrl' OR ':modalUrl("url")'
                if (meta[3]) {
                    return modalUrl === meta[3];    
                } else {
                    return typeof(modalUrl) !== 'undefined';
                }
            }

            return false;
        }
    });

    function Plugin(element, options) {
        this.el = element;
        this.$el = $(this.el);
        this.options = $.extend({}, defaults, options);

        var dataOptions = this.$el.data(this.options.dataOptName),
            nameSpace;

        if (dataOptions) {
            this.options = $.extend({}, this.options, dataOptions);
        }

        nameSpace = '.' + $.trim(this.options.evtNamespace);

        /**
            This is to so the user can set all modals to click and then individually
            set some to hover or vice versa. It's also so the user doesn't have to worry
            about event namespacing and can just set 'click' or 'hover'.
        **/
        this.options['showEvent'] = this.options.showEvent === 'click' ? 'click' + nameSpace : 'mouseover' + nameSpace;

        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {
        init: function () {
            this.buildModal();
        },
        showConditions: function () {
            var urlHash = window.location.hash,
                modalUrl = this.options.modalUrl,
                storedData = JSON.parse(localStorage.getItem('allyModal')),
                keepClosed = storedData && storedData.keepClosed && storedData.keepClosed.hasOwnProperty(this.options.keepClosedId);

            return (modalUrl && urlHash.split('#')[1] === modalUrl) || (this.options.autoShow && urlHash === '' && !keepClosed);
        },
        processCustomTemplate: function (html) {
            this.$overlay = $(html).addClass(this.options.overlayModifier);
            this.$modal = this.$overlay.find('.' + this.options.modalClass).addClass(this.options.modalModifier);
            this.$content = this.$overlay.find('.' + this.options.contentClass).addClass(this.options.contentModifier);
            this.$closeBtn = this.$overlay.find('.' + this.options.closeBtnClass);
        },
        buildContent: function() {
            var content = this.getContent(),
                self = this;

            if (typeof(content.success) === 'function') {
                content
                .done(function (data) {
                    var ajaxContent;

                    if (self.options.ajaxContext) {
                        ajaxContent = $(data).find(self.options.ajaxContext);

                        if (ajaxContent.length < 1) {
                            ajaxContent = $(data).filter(self.options.ajaxContext);
                        }
                    } else {
                        ajaxContent = data;
                    }

                    self.$content.append(ajaxContent);
                })
                .fail(function () {
                    self.$content.append('<p>Request Failed</p>');
                });

            } else {
                self.$content.append(content);
            }
        },
        buildModal: function () {
            if (this.options.contentType === 'inline') {
                /** To make an inline modal set the href of the modal link to the id of the inline modal html **/
                this.processCustomTemplate(this.$el.attr('href'));
            } else {
                if (this.options.modalTemplate) {
                    this.processCustomTemplate(this.options.modalTemplate);

                    $('body').append(this.$overlay);
                } else {
                    this.$overlay = $('<div class="' + $.trim(this.options.overlayClass + ' ' + this.options.overlayModifier) + '" ' + this.options.overlayAttrs + '></div>');
                    this.$modal = $('<div class="' + $.trim(this.options.modalClass + ' ' + this.options.modalModifier) + '" ' + this.options.modalAttrs + '></div>');
                    this.$content = $('<div class="' + $.trim(this.options.contentClass + ' ' + this.options.contentModifier) + '" ' + this.options.contentAttrs + '></div>');
                    this.$closeBtn = $('<a href="#" class="' + this.options.closeBtnClass + '" ' + this.options.closeBtnAttrs + '>' + this.options.closeBtnContent + '</a>');

                    $('body').append(this.$overlay.append(this.$modal.append([this.$closeBtn, this.$content])));
                }

                this.buildContent();
            }

            this.attachEvents();

            if (this.showConditions()) {
                this.show();
            }

            this.options.onCreate();

        },
        attachEvents: function () {
            this.$el.on(this.options.showEvent, {self: this}, this.show);
            this.$overlay.on('click', this.options.closeModal, {self: this}, this.hide);

            if (this.options.clickOutsideToHide) {
                // So you can click outside the modal to close overlay.
                this.$overlay.on('click', {self: this}, this.overlayHide);
            }
        },
        getContent: function () {
            var srcUrl = this.$el.attr('href'),
                content;

            switch (this.options.contentType) {
            case 'image':
                return $('<img>', {'src': srcUrl});

                break;
            case 'iframe':
                return $('<iframe>', {'src': srcUrl});

                break;
            case 'ajax':
                var customSettings = $.extend({url: srcUrl}, this.options.ajaxSettings);
                
                return $.ajax(customSettings);

                break;
            case 'custom':
            default:
                return this.options.customContent;

                break;
            }

        },
        storeClosed: function () {
            var storedData = JSON.parse(localStorage.getItem('allyModal')),
                closeId = this.options.keepClosedId,
                currentDate = new Date(),
                endDate = new Date().setDate(currentDate.getDate() + this.options.closedDuration),
                closedData;

            if (!storedData) {
                storedData = { 'keepClosed': {} };
            }

            storedData.keepClosed[this.options.keepClosedId] = endDate;

            closedData = JSON.stringify(storedData);

            localStorage.setItem('allyModal', closedData);
        },
        centerInIE8: function () {
            var $win = $(window),
                leftPos = ($win.width() - this.$modal.width()) / 2,
                topPos = ($win.height() - this.$modal.height()) / 2;

            this.$modal.css({'left': leftPos, 'top': topPos});
        },
        show: function (e) {
            var self = e ? e.data.self : this;

            // Make sure another modal isn't open if one is auto opened & there's a url hash.
            $(':modalPlugin("isOpen")')[pluginName]('hide');

            if (e) {
                e.preventDefault();

                if (self.options.modalUrl) {
                    history.pushState({modal: self.options.modalUrl}, null, '#' + self.options.modalUrl);
                }
            }

            self.options.onOpen();
            self.$overlay.addClass(self.options.showClass);
            self.options.isOpen = true;

            if (isIE8 && self.options.ie8Center) {
                self.centerInIE8();
            }
        },
        hide: function (e, triggerHistory) {
            var self = e ? e.data.self : this;

            if (e || triggerHistory) {
                if (e) { e.preventDefault(); }
                // This resets the url and history
                if (self.options.modalUrl) {
                    /**
                        This check is for when the user goes to a linked modal directly, and
                        presses the 'close' button on the modal instead of pressing 'back'.
                    **/
                    if (history.state) {
                        history.go(-1);
                    } else {
                        history.replaceState(null, null, window.location.pathname);   
                    }
                }
            }

            if (self.options.keepClosedId) {
                self.storeClosed();
            }

            self.options.onClose();
            self.$overlay.removeClass(self.options.showClass);
            self.options.isOpen = false;
        },
        overlayHide: function (e) {
            e.preventDefault();

            var self = e.data.self;

            if (e.target === self.$overlay[0]) {
                self.hide(e);
            }
        },
        destroy: function () {
            $(window).off('popstate.modal.history')
            this.$el.off(this.options.showEvent);
            this.$overlay.remove();
        },
        create: function () {
            this.init();
        }
    };

    $.fn[pluginName] = function (options, args) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            } else if ($.isFunction(Plugin.prototype[options]) && options.indexOf('_') < 0) {
                // Possibly be refactored, but allows passing multiple arguments to methods
                var thePlugin = $.data(this, 'plugin_' + pluginName);
                // So IE8 doesn't freak out if you don't pass anything to apply as an argument.
                args = args || [];

                thePlugin[options].apply(thePlugin, args);
            }
        });
    };

})(jQuery, window, document);