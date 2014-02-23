TeamPoker.CurrentVoterName = '';
TeamPoker.CurrentVoterId = 0;
TeamPoker.CurrentVotingStory = 0;
TeamPoker.MessageType = {
    LoginCallback: 'LoginCallback',
    NewParticipant: 'NewParticipant',
    LeaveParticipant: 'LeaveParticipant',
    ParticipantVoted: 'ParticipantVoted',
    SetCurrentStory: "SetCurrentStory",
    UpdateStoryInfo: "UpdateStoryInfo",
    ViewVoteResult: 'ViewVoteResult',
    Revote: 'Revote',
    SavePoint: "SavePoint",
    GameStatus: 'GameStatus'
};

TeamPoker.login = function (loginName) {
    TeamPoker.SocketClient.sendMsg("login_event", loginName);
};
TeamPoker.loginCallback = function(data) {
    if(data.Success === 'true') {
        TeamPoker.CurrentVoterId = data.ParticipantInfo.Id;
        TeamPoker.CurrentVoterName = data.ParticipantInfo.Name;

        TeamPoker.UIManager.loadRoomInfo(data.RoomInfo);
        sessionStorage.setObject("RoomInfo", data.RoomInfo);
    }
    else 
        alert("Oops! Some error occured result in Login attempt failed! Please try again:)");
};
TeamPoker.logout = function () {
    $.removeCookie("LoginName");
    TeamPoker.SocketClient.sendMsg("logout_event", TeamPoker.CurrentVoterId);
};
TeamPoker.newParticipantCallback = function(data) {
    TeamPoker.UIManager.newParticipant(data.Id, data.Name);
};
TeamPoker.leaveParticipantCallback = function(data) {
    TeamPoker.UIManager.leaveParticipant(data.Id);
};
TeamPoker.setCurrentStory = function(storyId) {
    TeamPoker.CurrentVotingStory = storyId;
    TeamPoker.SocketClient.sendMsg("set_current_story_event", storyId);
};
TeamPoker.setCurrentStoryCallback = function(data) {
    TeamPoker.UIManager.setStoryPointer(data.StoryId);
}
TeamPoker.updateStoryInfo = function(storyId, val) {
    TeamPoker.SocketClient.sendMsg("update_story_event", { Id: storyId, Val: val });
};
TeamPoker.updateStoryInfoCallback = function(data) {
    TeamPoker.UIManager.updateStoryInfo(data.StoryInfo);
};
TeamPoker.vote = function (value) {
    TeamPoker.SocketClient.sendMsg("vote_event", { StoryId: TeamPoker.CurrentVotingStory, VoterId: TeamPoker.CurrentVoterId, VoterName: TeamPoker.CurrentVoterName, VoteVal: value });
};
TeamPoker.voteCallback = function (data) {
    TeamPoker.UIManager.onUserVote(data.VoterId);
};
TeamPoker.viewVoteResult = function (data) {
    TeamPoker.SocketClient.sendMsg("view_vote_result_event", TeamPoker.CurrentVotingStory);
};
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

    TeamPoker.UIManager.displayVoteResult(data.VoteStatus);
};
TeamPoker.reVote = function() {
    TeamPoker.SocketClient.sendMsg("revote_event", TeamPoker.CurrentVotingStory);
};
TeamPoker.reVoteCallback = function(data) {
    TeamPoker.UIManager.revoteForStory(data.Id);
};
TeamPoker.savePoint = function(point) {
    TeamPoker.SocketClient.sendMsg("save_point_event", { Id: TeamPoker.CurrentVotingStory, Point: point });
};
TeamPoker.savePointCallback = function(data) {
    TeamPoker.UIManager.savePointForStory(data.Id, data.Point);
};

TeamPoker.SocketClient.addListener(TeamPoker.MessageType.LoginCallback, TeamPoker.loginCallback);
TeamPoker.SocketClient.addListener(TeamPoker.MessageType.GameStatus, TeamPoker.onLoadGameStatus);
TeamPoker.SocketClient.addListener(TeamPoker.MessageType.NewParticipant, TeamPoker.newParticipantCallback);
TeamPoker.SocketClient.addListener(TeamPoker.MessageType.LeaveParticipant, TeamPoker.leaveParticipantCallback);
TeamPoker.SocketClient.addListener(TeamPoker.MessageType.ParticipantVoted, TeamPoker.voteCallback);
TeamPoker.SocketClient.addListener(TeamPoker.MessageType.SetCurrentStory, TeamPoker.setCurrentStoryCallback);
TeamPoker.SocketClient.addListener(TeamPoker.MessageType.UpdateStoryInfo, TeamPoker.updateStoryInfoCallback);
TeamPoker.SocketClient.addListener(TeamPoker.MessageType.ViewVoteResult, TeamPoker.viewVoteResultCallback);
TeamPoker.SocketClient.addListener(TeamPoker.MessageType.Revote, TeamPoker.reVoteCallback);
TeamPoker.SocketClient.addListener(TeamPoker.MessageType.SavePoint, TeamPoker.savePointCallback);
