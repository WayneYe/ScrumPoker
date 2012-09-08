function PokerQueue() {
    TeamPoker.UI.WidgetBase.call(this);

    this.init = function() {
        var pokerBar = $("<div>").attr("id", "pokerbar"),
        me = this;

        TeamPoker.Constants.POKER_VALUES.forEach(function(val) {
            var poker = $("<div>").attr("class", "poker").attr("title", val).attr("vote-value", val).text(val).css("margin-left", "-18px");
            poker.hover( function () {
                $(this).addClass('activePoker');
                $(this).css('z-index', 100);
            }, function () {
                $(this).removeClass('activePoker');
                $(this).css('z-index', 0);
            });
            poker.click(function (e) {
                $(this).tooltip("hide");
                var votedVal = $(this).attr("vote-value");
                pokerBar.hide();

                me.broadcastMessage("USER-VOTE", votedVal);
            });

            pokerBar.append(poker);
        });

        this.WidgetDOM = pokerBar;
        this.base.init.call(this, $("#pokerbar-wrapper"));
    };

    this.show = function() {
        this.base.show.call(this);
        $("#pokerbar > .poker").tooltip({});
    };
}

PokerQueue.prototype = Object.create(TeamPoker.UI.WidgetBase.prototype);

TeamPoker.UI.PokerQueue = PokerQueue;
