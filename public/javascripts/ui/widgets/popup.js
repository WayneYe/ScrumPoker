function PopUp(id, header, body, footer, classStr, backdrop) {
    TeamPoker.UI.WidgetBase.call(this);

    var me = this, wrapper = null;
    this.init = function () {
        classStr = classStr || "modal fade";
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

        var 
        modalDialog = $("<div>").attr("class", "modal-dialog"),
        modalContent = $("<div>").attr("class", "modal-content"),
        headerWrapper = $("<div>").attr("class", "modal-header").append(header),
        bodyWrapper = $("<div>").attr("class", "modal-body").append(body),
        footerWrapper = $("<div>").attr("class", "modal-footer").append(footer);

        appendContent(modalContent, [headerWrapper,bodyWrapper,footerWrapper]); 
        appendContent(modalDialog, modalContent);
        wrapper.append(modalDialog);

        this.WidgetDOM = wrapper;
        this.base.init.call(this);
    };
    this.show = function () {

        this.WidgetDOM.modal({
            "backdrop"  : backdrop,
            "keyboard"  : false,
            "show"      : true                 
        });

        this.WidgetDOM.on("show.bs.modal", function() { 
            if(me.onShow.length)
                me.onShow.forEach(function (evtHandler) {
                    evtHandler();
                });
        });
        this.WidgetDOM.on("shown.bs.modal", function() {
            if(me.onShown.length)
                me.onShown.forEach(function (evtHandler) {
                    evtHandler();
                });
        });
        this.WidgetDOM.on("hide.bs.modal", function() {
            if(me.onHide.length)
                me.onHide.forEach(function (evtHandler) {
                    evtHandler();
                });
        });
        this.WidgetDOM.on("hidden.bs.modal", function() { 
            $(this).remove(); // remove the actual elements from the DOM when fully hidden
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
