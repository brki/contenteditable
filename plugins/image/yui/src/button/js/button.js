M.contenteditable_image = M.contenteditable_image || {
    dialogue : null,
    selection : null,
    init : function(params) {
        var display_chooser = function(e, elementid) {
            e.preventDefault();
            if (!M.editor_contenteditable.is_active(elementid)) {
                M.editor_contenteditable.focus(elementid);
            }
            M.contenteditable_image.selection = M.editor_contenteditable.get_selection();
            if (M.contenteditable_image.selection !== false) {
                var dialogue;
                if (!M.contenteditable_image.dialogue) {
                    dialogue = new M.core.dialogue({
                        visible: false,
                        modal: true,
                        close: true,
                        draggable: true
                    });
                } else {
                    dialogue = M.contenteditable_image.dialogue;
                }

                dialogue.set('bodyContent', M.contenteditable_image.get_form_content(elementid));
                dialogue.set('headerContent', M.util.get_string('createimage', 'contenteditable_image'));
                dialogue.render();
                dialogue.centerDialogue();
                M.contenteditable_image.dialogue = dialogue;

                var selectedText = M.editor_contenteditable.get_selection_text();
                var i = 0;

                Y.log(selectedText);
                var images = [];
                for (i = 0; i < selectedText.childNodes.length; i++) {
                    var child = selectedText.childNodes[0];
                    if (images.length === 0) {
                        if (child.nodeName.toLowerCase() === 'img') {
                            images[0] = child;
                        } else {
                            images = child.getElementsByTagName('img');
                        }
                    }
                }

                if (images.length > 0) {
                    var image = Y.one(images[0]);
                    var width = image.getAttribute('width');
                    var height = image.getAttribute('height');
                    if (width > 0) {
                        Y.one('#contenteditable_image_widthentry').set('value', width);
                    }
                    if (height > 0) {
                        Y.one('#contenteditable_image_heightentry').set('value', height);
                    }
                    Y.one('#contenteditable_image_preview').set('src', image.get('src'));
                    Y.one('#contenteditable_image_preview').setStyle('display', 'inline');
                    Y.one('#contenteditable_image_altentry').set('value', image.get('alt'));
                    Y.one('#contenteditable_image_urlentry').set('value', image.get('src'));
                }
                dialogue.show();
            }
        };

        M.editor_contenteditable.add_toolbar_button(params.elementid, 'image', params.icon, display_chooser, this);
    },
    open_browser : function(e) {
        var elementid = this.getAttribute('data-editor');
        e.preventDefault();

        M.editor_contenteditable.show_filepicker(elementid, 'image', M.contenteditable_image.browser_callback);
    },
    browser_callback : function(params) {
        if (params.url !== '') {
            var input = Y.one('#contenteditable_image_urlentry');
            input.set('value', params.url);
            input = Y.one('#contenteditable_image_altentry');
            input.set('value', params.file);

            // Auto set the width and height.
            var image = new Image();
            image.onload = function() {
                Y.one('#contenteditable_image_widthentry').set('value', this.width);
                Y.one('#contenteditable_image_heightentry').set('value', this.height);
                Y.one('#contenteditable_image_preview').set('src', this.src);
                Y.one('#contenteditable_image_preview').setStyle('display', 'inline');
            };
            image.src = params.url;
        }
    },
    set_image : function(e) {
        e.preventDefault();
        M.contenteditable_image.dialogue.hide();

        var input = e.currentTarget.get('parentNode').one('#contenteditable_image_urlentry');

        var url = input.get('value');
        input = e.currentTarget.get('parentNode').one('#contenteditable_image_altentry');
        var alt = input.get('value');
        input = e.currentTarget.get('parentNode').one('#contenteditable_image_widthentry');
        var width = input.get('value');
        input = e.currentTarget.get('parentNode').one('#contenteditable_image_heightentry');
        var height = input.get('value');
        if (url !== '' && alt !== '') {
            M.editor_contenteditable.set_selection(M.contenteditable_image.selection);
            var imagehtml = '<img src="' + Y.Escape.html(url) + '" alt="' + Y.Escape.html(alt) + '"';

            if (width) {
                imagehtml += ' width="' + Y.Escape.html(width) + '"';
            }
            if (height) {
                imagehtml += ' height="' + Y.Escape.html(height) + '"';
            }
            imagehtml += '"/>';

            if (document.selection && document.selection.createRange().pasteHTML) {
                document.selection.createRange().pasteHTML(imagehtml);
            } else {
                document.execCommand('insertHTML', false, imagehtml);
            }
        }
    },
    get_form_content : function(elementid) {
        var content = Y.Node.create('<form class="contenteditable_form">' +
                             '<label for="contenteditable_image_urlentry">' + M.util.get_string('enterurl', 'contenteditable_image') +
                             '</label>' +
                             '<input type="url" value="" id="contenteditable_image_urlentry" size="32"/>' +
                             '<label for="contenteditable_image_altentry">' + M.util.get_string('enteralt', 'contenteditable_image') +
                             '</label>' +
                             '<input type="text" value="" id="contenteditable_image_altentry" size="32" required="true"/>' +
                             '<label for="contenteditable_image_widthentry">' + M.util.get_string('width', 'contenteditable_image') +
                             '</label>' +
                             '<input type="text" value="" id="contenteditable_image_widthentry" size="10"/>' +
                             '<br/>' +
                             '<label for="contenteditable_image_heightentry">' + M.util.get_string('height', 'contenteditable_image') +
                             '</label>' +
                             '<input type="text" value="" id="contenteditable_image_heightentry" size="10"/>' +
                             '<label for="contenteditable_image_preview">' + M.util.get_string('preview', 'contenteditable_image') +
                             '</label>' +
                             '<img src="#" width="200" id="contenteditable_image_preview" alt="" style="display: none;"/>' +
                             '<hr/>' +
                             '<button id="openimagebrowser" data-editor="' + Y.Escape.html(elementid) + '">' +
                             M.util.get_string('browserepositories', 'contenteditable_image') +
                             '</button>' +
                             '<hr/>' +
                             '<button id="contenteditable_image_urlentrysubmit">' +
                             M.util.get_string('createimage', 'contenteditable_image') +
                             '</button>' +
                             '</form>' +
                             '<hr/>' + M.util.get_string('accessibilityhint', 'contenteditable_image'));

        content.one('#contenteditable_image_urlentrysubmit').on('click', M.contenteditable_image.set_image);
        content.one('#openimagebrowser').on('click', M.contenteditable_image.open_browser);
        return content;
    }
};
