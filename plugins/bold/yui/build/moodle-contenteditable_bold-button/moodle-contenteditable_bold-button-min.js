YUI.add("moodle-contenteditable_bold-button",function(e,t){var n=function(){n.superclass.constructor.apply(this,arguments)};n.NAME="contenteditable_bold",n.ATTRS={},e.extend(n,e.Base,{initializer:function(t){var n=e.one("#"+t.elementid+"_toolbar"),r=e.Node.create('<button class="contenteditable_bold_button" data-editor="'+t.elementid+'">'+t.icon+"</button>");n.append(r),M.contenteditable_bold.attached||(e.one("body").delegate("click",this.click,".contenteditable_bold_button"),M.contenteditable_bold.attached=!0)},click:function(e){e.preventDefault(),document.execCommand("bold",!1,null)}}),M.contenteditable_bold=M.contenteditable_bold||{},M.contenteditable_bold.init=function(e,t){return new n(e,t)}},"@VERSION@",{requires:["node"]});
