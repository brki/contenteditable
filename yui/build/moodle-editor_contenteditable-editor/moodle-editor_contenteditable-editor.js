YUI.add('moodle-editor_contenteditable-editor', function (Y, NAME) {

M.editor_contenteditable = M.editor_contenteditable || {
    /**
     * List of attached button handlers to prevent duplicates.
     */
    buttonhandlers : {},

    /**
     * List of YUI overlays for custom menus.
     */
    menus : {},

    /**
     * List of attached menu handlers to prevent duplicates.
     */
    menuhandlers : {},

    /**
     * List of file picker options for specific editor instances.
     */
    filepickeroptions : {},

    /**
     * List of buttons and menus that have been added to the toolbar.
     */
    widgets : {},

    /**
     * Toggle a menu.
     * @param event e
     */
    showhide_menu_handler : function(e) {
        e.preventDefault();
        var disabled = this.getAttribute('disabled');
        var overlayid = this.getAttribute('data-menu');
        var overlay = M.editor_contenteditable.menus[overlayid];

        if (overlay.get('visible') || disabled) {
            overlay.hide();
        } else {
            overlay.show();
        }

    },

    buttonclicked_handler : function(e) {
        var elementid = this.getAttribute('data-editor');
        var plugin = this.getAttribute('data-plugin');
        var handler = this.getAttribute('data-handler');
        var overlay = M.editor_contenteditable.menus[plugin + '_' + elementid];


        if (overlay) {
            overlay.hide();
        }

        if (M.editor_contenteditable.is_enabled(elementid, plugin)) {
            // Pass it on.
            handler = M.editor_contenteditable.buttonhandlers[handler];
            return handler(e, elementid);
        }
    },

    /**
     * Determine if the specified toolbar button/menu is enabled.
     * @param string elementid, the element id of this editor.
     * @param string plugin, the plugin that created the button/menu.
     */
    is_enabled : function(elementid, plugin) {
        var element = Y.one('#' + elementid + '_toolbar .contenteditable_' + plugin + '_button');

        return !element.hasAttribute('disabled');
    },
    /**
     * Disable all buttons and menus in the toolbar.
     * @param string elementid, the element id of this editor.
     */
    disable_all_widgets : function(elementid) {
        var plugin, element;
        for (plugin in M.editor_contenteditable.widgets) {
            element = Y.one('#' + elementid + '_toolbar .contenteditable_' + plugin + '_button');

            if (element) {
                element.setAttribute('disabled', 'true');
            }
        }
    },

    /**
     * Enable a single widget in the toolbar.
     * @param string elementid, the element id of this editor.
     * @param string plugin, the name of the plugin that created the widget.
     */
    enable_widget : function(elementid, plugin) {
        var element = Y.one('#' + elementid + '_toolbar .contenteditable_' + plugin + '_button');

        if (element) {
            element.removeAttribute('disabled');
        }
    },

    /**
     * Enable all buttons and menus in the toolbar.
     * @param string elementid, the element id of this editor.
     */
    enable_all_widgets : function(elementid) {
        var plugin, element;
        for (plugin in M.editor_contenteditable.widgets) {
            element = Y.one('#' + elementid + '_toolbar .contenteditable_' + plugin + '_button');

            if (element) {
                element.removeAttribute('disabled');
            }
        }
    },

    /**
     * Add a button to the toolbar belonging to the editor for element with id "elementid".
     * @param string elementid - the id of the textarea we created this editor from.
     * @param string plugin - the plugin defining the button
     * @param string icon - the html used for the content of the button
     * @handler function handler- A function to call when the button is clicked.
     */
    add_toolbar_menu : function(elementid, plugin, icon, entries) {
        var toolbar = Y.one('#' + elementid + '_toolbar');
        var button = Y.Node.create('<button class="contenteditable_' + plugin + '_button contenteditable_hasmenu" ' +
                                    'data-editor="' + Y.Escape.html(elementid) + '" ' +
                                    'data-menu="' + plugin + '_' + elementid + '" >' +
                                    icon +
                                    '</button>');

        toolbar.append(button);

        // Save the name of the plugin.
        M.editor_contenteditable.widgets[plugin] = plugin;

        var menu = Y.Node.create('<div class="contenteditable_' + plugin + '_menu' +
                                 ' contenteditable_menu" data-editor="' + Y.Escape.html(elementid) + '"></div>');

        var i = 0, entry = {};

        for (i = 0; i < entries.length; i++) {
            entry = entries[i];

            menu.append(Y.Node.create('<div class="contenteditable_menuentry">' +
                                       '<a href="#" class="contenteditable_' + plugin + '_action_' + i + '" ' +
                                       'data-editor="' + Y.Escape.html(elementid) + '" ' +
                                       'data-plugin="' + Y.Escape.html(plugin) + '" ' +
                                       'data-handler="' + Y.Escape.html(plugin + '_action_' + i) + '">' +
                                       entry.text +
                                       '</a>' +
                                       '</div>'));
            if (!M.editor_contenteditable.buttonhandlers[plugin + '_action_' + i]) {
                Y.one('body').delegate('click', M.editor_contenteditable.buttonclicked_handler, '.contenteditable_' + plugin + '_action_' + i);
                M.editor_contenteditable.buttonhandlers[plugin + '_action_' + i] = entry.handler;
            }
        }

        if (!M.editor_contenteditable.buttonhandlers[plugin]) {
            Y.one('body').delegate('click', M.editor_contenteditable.showhide_menu_handler, '.contenteditable_' + plugin + '_button');
            M.editor_contenteditable.buttonhandlers[plugin] = true;
        }

        var overlay = new Y.Overlay({
            bodyContent : menu,
            visible : false,
            width: '2em',
            align: {node: button, points: [Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.BL]}
        });

        M.editor_contenteditable.menus[plugin + '_' + elementid] = overlay;
        overlay.render();
    },

    /**
     * Add a button to the toolbar belonging to the editor for element with id "elementid".
     * @param string elementid - the id of the textarea we created this editor from.
     * @param string plugin - the plugin defining the button
     * @param string icon - the html used for the content of the button
     * @handler function handler- A function to call when the button is clicked.
     */
    add_toolbar_button : function(elementid, plugin, icon, handler) {
        var toolbar = Y.one('#' + elementid + '_toolbar');
        var button = Y.Node.create('<button class="contenteditable_' + plugin + '_button" ' +
                                   'data-editor="' + Y.Escape.html(elementid) + '" ' +
                                   'data-plugin="' + Y.Escape.html(plugin) + '" ' +
                                   'data-handler="' + Y.Escape.html(plugin) + '">' +
                                    icon +
                                    '</button>');

        toolbar.append(button);

        // We only need to attach this once.
        if (!M.editor_contenteditable.buttonhandlers[plugin]) {
            Y.one('body').delegate('click', M.editor_contenteditable.buttonclicked_handler, '.contenteditable_' + plugin + '_button');
            M.editor_contenteditable.buttonhandlers[plugin] = handler;
        }

        // Save the name of the plugin.
        M.editor_contenteditable.widgets[plugin] = plugin;

    },

    is_active : function(elementid) {
        var selection = M.editor_contenteditable.get_selection();

        if (selection.length) {
            selection = selection.pop();
        }

        var node = null;
        if (selection.parentElement) {
            node = Y.one(selection.parentElement());
        } else {
            node = Y.one(selection.startContainer);
        }

        return node && node.ancestor('#' + elementid + 'editable') !== null;
    },

    focus : function(elementid) {
        Y.one('#' + elementid + 'editable').focus();
    },

    init : function(params) {
        var textarea = Y.one('#' +params.elementid);
        var contenteditable = Y.Node.create('<div id="' + params.elementid + 'editable" ' +
                                            'contenteditable="true" ' +
                                            'spellcheck="true" ' +
                                            'class="editor_contenteditable"/>');
        var cssfont = '';
        var toolbar = Y.Node.create('<div class="editor_contenteditable_toolbar" id="' + params.elementid + '_toolbar"/>');

        // Bleh - why are we sent a url and not the css to apply directly?
        var css = Y.io(params.content_css, { sync: true });
        var pos = css.responseText.indexOf('font:');
        if (pos) {
            cssfont = css.responseText.substring(pos + 'font:'.length, css.responseText.length - 1);
            contenteditable.setStyle('font', cssfont);
        }
        contenteditable.setStyle('min-height', (1.2 * (textarea.getAttribute('rows') - 1)) + 'em');

        // Copy text to editable div.
        contenteditable.append(textarea.get('value'));

        // Add the toolbar to the page.
        textarea.get('parentNode').insert(toolbar, textarea);
        // Add the editable div to the page.
        textarea.get('parentNode').insert(contenteditable, textarea);
        // Hide the old textarea.
        textarea.hide();

        // Copy the current value back to the textarea when focus leaves us.
        contenteditable.on('blur', function() {
            textarea.set('value', contenteditable.getHTML());
        });

        // Save the file picker options for later.
        M.editor_contenteditable.filepickeroptions[params.elementid] = params.filepickeroptions;
    },

    show_filepicker : function(elementid, type, callback) {
        Y.use('core_filepicker', function (Y) {
            var options = M.editor_contenteditable.filepickeroptions[elementid][type];

            options.formcallback = callback;
            options.editor_target = Y.one(elementid);

            M.core_filepicker.show(Y, options);
        });
    },

    get_selection : function() {
        if (window.getSelection) {
            var sel = window.getSelection();
            var ranges = [], i = 0;
            for (i = 0; i < sel.rangeCount; i++) {
                ranges.push(sel.getRangeAt(i));
            }
            return ranges;
        } else if (document.selection) {
            // IE < 9
            if (document.selection.createRange) {
                return document.selection.createRange();
            }
        }
        return false;
    },

    set_selection : function(selection) {
        var sel, i;

        if (window.getSelection) {
            sel = window.getSelection();
            sel.removeAllRanges();
            for (i = 0; i < selection.length; i++) {
                sel.addRange(selection[i]);
            }
        } else if (document.selection) {
            // IE < 9
            if (selection.select) {
                selection.select();
            }
        }
    }

};



}, '@VERSION@', {"requires": ["node", "io", "overlay", "escape"]});
