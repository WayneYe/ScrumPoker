TeamPoker.CurrentVoterName = '';
TeamPoker.CurrentVotingStory = 0;
TeamPoker.VoteInfo = function (name, value, storyId) {
    this.VoterName = name;
    this.VoteVal = value;
    this.StoryId = storyId;
}
TeamPoker.MessageType = {
    LoginCallback: 'LoginCallback',
    NewParticipaint: 'NewParticipaint',
    LeaveParticipaint: 'LeaveParticipaint',
    NewVoteInfo: 'NewVoteInfo',
    ViewVoteResult: 'ViewVoteResult'
};

TeamPoker.login = function () {
    TeamPoker.CurrentVoterName = $('#txtNickname').val();
    TeamPoker.SocketClient.sendMsg("login_event", TeamPoker.CurrentVoterName);
};
TeamPoker.loginCallback = function(data) {
    if(data.Success === 'true') {
        TeamPoker.UI.refreshParticipantsList(data.ParticipantsList);
    }
    else {
        alert("Login failed! Please try again:)");
    }
};
TeamPoker.newParticipantCallback = function(data) {
    TeamPoker.UI.refreshParticipantsList(data.ParticipantsList);
};

TeamPoker.vote = function (value) {
    var voteInfo = new TeamPoker.VoteInfo(TeamPoker.CurrentVoterName, value, TeamPoker.CurrentVotingStory);
    TeamPoker.SocketClient.sendMsg("vote_event", voteInfo);

};
TeamPoker.removeFromParticipantsList = function (leftParticipant){
    //$("#participaints").append(newPlaceHolder);
};
TeamPoker.viewVoteResult = function (data) {
    TeamPoker.SocketClient.sendMsg("view_result_event", '');
}
TeamPoker.viewVoteResultCallback = function (data) {
    // Marking special/high/low scores
    _(data.VoteStatus).each(function (voteInfo) {
        if(voteInfo.VoteVal === "?" || voteInfo.VoteVal === "0")
            voteInfo.SpecialScore = true;
        else
            voteInfo.VoteVal = parseFloat(voteInfo.VoteVal);
    });
    var allVotes = _.chain(data.VoteStatus).pluck("VoteVal").without("?", "0").sort(function (a,b) {return a-b}).uniq();
    if(allVotes.value().length > 2) {
        _(data.VoteStatus).each(function (voteInfo) {
            if(voteInfo.VoteVal === allVotes.first().value())
                voteInfo.LowScore = true;
            if(voteInfo.VoteVal === allVotes.last().value())
                voteInfo.HighScore = true;
        });
    }
    TeamPoker.UI.displayVoteResult(data.VoteStatus);
}

TeamPoker.SocketClient.addListener(TeamPoker.MessageType.LoginCallback, TeamPoker.loginCallback);
TeamPoker.SocketClient.addListener(TeamPoker.MessageType.NewParticipant, TeamPoker.newParticipantCallback);
TeamPoker.SocketClient.addListener(TeamPoker.MessageType.LeaveParticipaint, TeamPoker.removeFromParticipantsList);
TeamPoker.SocketClient.addListener(TeamPoker.MessageType.ViewVoteResult, TeamPoker.viewVoteResultCallback);
