/*
   Team poker WebSocket server based on http://socket.io
   Written By Wayne Ye 07/20/2012 - http://wayneye.com
   */

var fs = require('fs')
    , _  = require('underscore')
    , routes = require('./routes')
    , colors = require('colors');

function SocketServer(app, io, roomInfo) {
    this.App = app;
    this.IO = io;
    this.RoomInfo = roomInfo;
}

SocketServer.prototype = {
    constructor: SocketServer,
    App: null,
    IO:  null,
    ParticipantId: 1,
    RoomInfo: {
        Name: "",
        Moderator: "",
        ParticipantCollection : {},
        StoryCollection : {},
        CurrentVotingStory: 1,
        VoteStatus : [],
    },
    MessageType : {
        Connected: 'Connected',
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
    },
    start : function() {
        var me = this;

        if(!this.App || !this.IO)
            throw "Cannot start socket server since App or IO is not initialized!!!";

        this.IO.sockets.on('connection', function (socket) {
            var TEAM_POKER_NAMESPACE = me.RoomInfo.Name;
            socket.emit(TEAM_POKER_NAMESPACE , { MsgType: me.MessageType.Connected, Data: "Welcome to room: \"" + me.RoomInfo.Name + "\"!" });

            socket.on('login_event', function(loginName) {
                console.log("New participant: " + loginName.bold.underline.blue);
                //socket.log.info("New participant: " + loginName);
                me.RoomInfo.ParticipantCollection[me.ParticipantId] = loginName;
                socket.emit(TEAM_POKER_NAMESPACE, { MsgType: me.MessageType.LoginCallback, Data: { Success: "true", ParticipantInfo: { Id: me.ParticipantId, Name: loginName }, RoomInfo: me.RoomInfo } });
                socket.broadcast.emit(TEAM_POKER_NAMESPACE, { MsgType: me.MessageType.NewParticipant, Data: { Id: me.ParticipantId, Name: loginName } });

                me.ParticipantId++;
            });
            socket.on('logout_event', function(id) {
                console.log("Logout event: " + id);
                if(_(me.RoomInfo.ParticipantCollection).has(id)) {
                    var leftParticipantName = me.RoomInfo.ParticipantCollection[id];
                    console.log("Left participant: " + leftParticipantName.bold.underline.cyan);
                    socket.broadcast.emit(TEAM_POKER_NAMESPACE, { MsgType: me.MessageType.LeaveParticipant, Data: { Id: id } });

                    delete me.RoomInfo.ParticipantCollection[id];
                    me.RoomInfo.VoteStatus = _.filter(me.RoomInfo.VoteStatus, function(voteInfo) {
                        return voteInfo.VoterId === id;
                    });
                }
            });

            socket.on('set_current_story_event', function(storyId) {
                me.RoomInfo.CurrentVotingStory = storyId;
                socket.broadcast.emit(TEAM_POKER_NAMESPACE, { MsgType: me.MessageType.SetCurrentStory, Data: { StoryId: storyId } });
            });

            socket.on('update_story_event', function(storyInfo) {
                var storyId = storyInfo.Id,
                val     = storyInfo.Val,
                storyKey = _(val).keys()[0];

                if(me.RoomInfo.StoryCollection[storyId])
                    me.RoomInfo.StoryCollection[storyId][storyKey] = _(val).values()[0];
                else { // Create a new story
                    me.RoomInfo.StoryCollection[storyId] = { Title: val.Title, Point: 0 };
                }

                socket.broadcast.emit(TEAM_POKER_NAMESPACE, { MsgType: me.MessageType.UpdateStoryInfo, Data: { StoryInfo: storyInfo } });
            });

            socket.on('vote_event', function(voteInfo) {
                console.log(["New vote for story: " + voteInfo.StoryId +", by: ", voteInfo.VoterName, ", value: ", voteInfo.VoteVal.bold.cyan, "."].join(''));
                me.RoomInfo.VoteStatus.push(voteInfo);
                me.broadCastToAll(socket, TEAM_POKER_NAMESPACE, { MsgType: me.MessageType.ParticipantVoted, Data: { VoterId: voteInfo.VoterId } });
            });

            socket.on('revote_event', function(storyId) {
                me.RoomInfo.StoryCollection[storyId]["Point"] = 0;
                me.RoomInfo.VoteStatus = _(me.RoomInfo.VoteStatus).reject(function (vs) { return vs.StoryId === storyId; });
                socket.broadcast.emit(TEAM_POKER_NAMESPACE, { MsgType: me.MessageType.Revote, Data: { Id: storyId } });
            });

            socket.on('save_point_event', function(data) {
                me.RoomInfo.StoryCollection[data.Id]["Point"] = data.Point;
                socket.broadcast.emit(TEAM_POKER_NAMESPACE, { MsgType: me.MessageType.SavePoint, Data: { Id: data.Id, Point: data.Point } });
            });

            socket.on('view_vote_result_event', function(storyId) {
                console.log("Broadcasting vote status to all clients for storyId: " + storyId.toString().bold.underline.red);
                console.log("Current Vote status: ");
                console.log(_(me.RoomInfo.VoteStatus));
                console.log("Filtered Vote status: ");
                var filteredVotingStatus = _(me.RoomInfo.VoteStatus).filter(function (vs) { return vs.StoryId === storyId; });
                console.log(filteredVotingStatus);
                me.broadCastToAll(socket, TEAM_POKER_NAMESPACE, { MsgType: me.MessageType.ViewVoteResult, Data: { VoteStatus: filteredVotingStatus } });
            });
        });

        this.IO.sockets.on('disconnect', function (socket) {
            //this.IO.sockets.emit(TEMM_POKET_CHANNEL, { MsgType: me.MessageType.LeaveParticipant, Data: { id: 0 } });
            this.IO.sockets.emit('user disconnected');
        });
    },
    broadCastToAll : function(socket, namespace, data) {
        socket.emit(namespace, data);
        socket.broadcast.emit(namespace, data);
    }
};

module.exports = SocketServer;
