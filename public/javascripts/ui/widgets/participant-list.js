function ParticipantList() {
    TeamPoker.UI.WidgetBase.call(this);

    var me = this;
    this.ParticipantsList = $("#participants");
    this.init = function(participantCollection) {
        me.ParticipantsList.html('');
        _(participantCollection).each(function(name, id) {
            me.addParticipant(id, name);
        });

        this.WidgetDOM = this.ParticipantsList;
        //this.base.init.call(this, $("#pokerbar-wrapper"));
    };

    this.show = function() {
        //this.base.show.call(this);
        //$("#pokerbar > .poker").tooltip({});
    };
    this.addParticipant = function (id, name) {
        var newParticipantLabel = $("<span>").attr("class", "participant").attr("id", id).text(name);
        this.ParticipantsList.append(newParticipantLabel);
    };
    this.removeFromParticipantsList = function (leftParticipantId){
        this.ParticipantsList.find("span[id=" + leftParticipantId + "]").remove();
    };
    this.updateVoteStatus = function (voterId) {
        this.ParticipantsList.find(".participant[id=" + voterId + "]").addClass("voted");
    };
    this.resetVoteStatus = function (voterId) {
        this.ParticipantsList.find(".participant").removeClass("voted");
    };
}

ParticipantList.prototype = Object.create(TeamPoker.UI.WidgetBase.prototype);

TeamPoker.UI.ParticipantList = ParticipantList;
