(function () {
    function WidgetBase () {
        this.base = WidgetBase.prototype;

        // UI events
        this.onShown = [];
        this.onHidden = [];

        // UI properties
        this.WidgetDOM = null;
        // Base properties
        this.ListenerQueue = {};
        // Base communication methods
        this.broadcastMessage = function (msgKey, data) {
            if(this.ListenerQueue[msgKey]) {
                this.ListenerQueue[msgKey].forEach(function(func) {
                    func(data);
                });
            }
        };
    }

    WidgetBase.prototype = {
        constructor: WidgetBase,

        // UI methods
        init: function (parent) {
            parent = parent || $(window);

            if(this.WidgetDOM) {
                parent.append(this.WidgetDOM);
            }
        },

        show: function () {
            if(!this.WidgetDOM)
                throw new Error("Cannot show this widget without seting WidgetDOM!");

            this.WidgetDOM.show();

            if(this.onShown.length)
                this.onShown.forEach(function (evtHandler) {
                    evtHandler();
                });
        },
        hide: function () {
            if(!this.WidgetDOM)
                throw new Error("Cannot show this widget without seting WidgetDOM!");

            this.WidgetDOM.hide();

            if(this.onHidden.length)
                this.onHidden.forEach(function (evtHandler) {
                    evtHandler();
                });
        } 
    };

    TeamPoker.UI.WidgetBase = WidgetBase;
})();
