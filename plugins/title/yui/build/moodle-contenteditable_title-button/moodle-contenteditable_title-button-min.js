YUI.add("moodle-contenteditable_title-button",function(e,t){M.contenteditable_title=M.contenteditable_title||{init:function(e){var t=function(e,t){e.preventDefault(),M.editor_contenteditable.is_active(t)||M.editor_contenteditable.focus(t),document.execCommand("formatBlock",!1,"<h1>")},n=function(e,t){e.preventDefault(),M.editor_contenteditable.is_active(t)||M.editor_contenteditable.focus(t),document.execCommand("formatBlock",!1,"<h2>")},r=function(e,t){e.preventDefault(),M.editor_contenteditable.is_active(t)||M.editor_contenteditable.focus(t),document.execCommand("formatBlock",!1,"<blockquote>")},i=function(e,t){e.preventDefault(),M.editor_contenteditable.is_active(t)||M.editor_contenteditable.focus(t),document.execCommand("formatBlock",!1,"<p>")},s="<h1>"+M.util.get_string("h1","contenteditable_title")+"</h1>",o="<h2>"+M.util.get_string("h2","contenteditable_title")+"</h2>",u="<p>&nbsp;&nbsp;&nbsp;&nbsp;"+M.util.get_string("blockquote","contenteditable_title")+"</p>",a="<p>"+M.util.get_string("p","contenteditable_title")+"</p>";M.editor_contenteditable.add_toolbar_menu(e.elementid,"title",e.icon,[{text:s,handler:t},{text:o,handler:n},{text:u,handler:r},{text:a,handler:i}])}}},"@VERSION@",{requires:["node"]});
