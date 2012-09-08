function PopUp(id, header, body, footer, classStr, backdrop) {
    TeamPoker.UI.WidgetBase.call(this);

    var me = this, wrapper = null;
    this.init = function () {
        classStr = classStr || "modal hide fade";
        backdrop = backdrop || "static";

        wrapper = $("<div>").attr("id", id).attr("class", classStr);

        var appendContent = function(parent, content) {
            if($.isArray(content)) { 
                $.each(content, function(idx, subContent) {
                    parent.append(subContent);
                });
            }
            else
                parent.append(content);
        };

        var headerWrapper = $("<div>").attr("class", "modal-header"),
        bodyWrapper = $("<div>").attr("class", "modal-body"),
        footerWrapper = $("<div>").attr("class", "modal-footer");

        appendContent(headerWrapper, header); 
        appendContent(bodyWrapper, body); 
        appendContent(footerWrapper, footer); 

        wrapper.append(headerWrapper).append(bodyWrapper).append(footerWrapper);
        this.WidgetDOM = wrapper;
        this.base.init.call(this);
    };
    this.show = function () {

        this.WidgetDOM.modal({
            "backdrop"  : backdrop,
            "keyboard"  : true,
            "show"      : true                 
        });

        this.WidgetDOM.on("hidden", function() {  // remove the actual elements from the DOM when fully hidden
            $(this).remove();
        });
        this.WidgetDOM.on("show", function() { 
            if(me.onShow.length)
                me.onShow.forEach(function (evtHandler) {
                    evtHandler();
                });
        });
        this.WidgetDOM.on("shown", function() {
            if(me.onShown.length)
                me.onShown.forEach(function (evtHandler) {
                    evtHandler();
                });
        });
        this.WidgetDOM.on("hide", function() {
            if(me.onHide.length)
                me.onHide.forEach(function (evtHandler) {
                    evtHandler();
                });
        });
        this.WidgetDOM.on("hidden", function() { 
            if(me.onHidden.length)
                me.onHidden.forEach(function (evtHandler) {
                    evtHandler();
                });
        });
    };

    this.hide = function() {
        this.WidgetDOM.modal('hide');
    };

    this.onShow   = [];
    this.onShown  = [];
    this.onHide   = [];
    this.onHidden = [];
}

PopUp.prototype = Object.create(TeamPoker.UI.WidgetBase.prototype);

TeamPoker.UI.PopUp = PopUp;
