window.Array.prototype.distinctPush = function (item) {
    for (var key in this)
        if (this[key] == item)
            return;
        else {
            this.push(item);
            return;
        }
}

var TeamPoker = TeamPoker || function () { };
TeamPoker.CurrentPlayerName = '';
TeamPoker.WsClient = null;
TeamPoker.VoteInfo = function (playerName, voteValue) {
    this.PlayerName = playerName;
    this.VoteValue = voteValue;
}
TeamPoker.MessageType = {
    NewParticipaint: 'NewParticipaint',
    NewVoteInfo: 'NewVoteInfo'
};
TeamPoker.ClientMessage = function (type, data) {
    this.Type = type;
    this.Data = data;
};
TeamPoker.ServerStatus = function () {
    this.Players = [];
    this.VoteStatus = [];
};

TeamPoker.initUI = function () {
    $('.poker').hover(
        function () {
            $(this).addClass('activePoker');
            $(this).css('z-index', 100);
        },
        function () {
            $(this).removeClass('activePoker');
            $(this).css('z-index', 0);
        }
    );
    $('.poker').click(
        function (e) {
            var chosenPoker = $(this);
            var value = chosenPoker.text();
            TeamPoker.vote(value);
            $('#votebar').append(TeamPoker.Util.BuildStr('<span class="participaint">', TeamPoker.CurrentPlayerName, '</span> voted: <span class="votevalue">', value, '</span>.<br />'));
        }
    );
    $('#btnLogin').click(TeamPoker.login);
    $('#loginForm').keydown(function (evt) {
        if (evt.keyCode == 13) TeamPoker.login();
    });
}
TeamPoker.login = function () {
    $('#mask').hide();
    $('#loginForm').hide();

    TeamPoker.CurrentPlayerName = $('#txtNickname').val();
    //$('#participaints').text(TeamPoker.CurrentPlayerName);
    TeamPoker.connectToWsServer();
};
TeamPoker.connectToWsServer = function () {
    // Init Web Socket connect
    var WSURI = "ws://192.168.1.6:8888";
    TeamPoker.WsClient = new WebSocket(WSURI);

    TeamPoker.WsClient.onopen = function (evt) {
        console.log('Successfully connected to WebSocket server.');
        TeamPoker.joinGame();
    };
    TeamPoker.WsClient.onclose = function (evt) {
        console.log('Connection closed.');
    };
    TeamPoker.WsClient.onmessage = function (evt) {
        console.log('Retrived msg from server: ' + evt.data);
        TeamPoker.updateGameStatus(evt.data);
    };
    TeamPoker.WsClient.onerror = function (evt) {
        console.log('An error occured: ' + evt.data);
    };
};
TeamPoker.joinGame = function () {
    var joinGameMsg = new TeamPoker.ClientMessage(TeamPoker.MessageType.NewParticipaint, TeamPoker.CurrentPlayerName);

    TeamPoker.WsClient.send(JSON.stringify(joinGameMsg));
}
TeamPoker.vote = function (value) {
    var voteInfo = new TeamPoker.VoteInfo(TeamPoker.CurrentPlayerName, value);
    var voteMsg = new TeamPoker.ClientMessage(TeamPoker.MessageType.NewVoteInfo, voteInfo);
    TeamPoker.WsClient.send(JSON.stringify(voteMsg));

    $('#pokerbar').html('<p>Thank you for voting:)</p>');
};
TeamPoker.updateGameStatus = function (data) {
    console.log('Retrieve current game status: ' + data);

    var serverStatus = JSON.parse(data);
    $('#participaints').text(serverStatus.Players.join(', '));

    var voteStatesHTML = '';
    for (var i = 0; i < serverStatus.VoteStatus.length; i++)
        voteStatesHTML += TeamPoker.Util.BuildStr('<span class="participaint">' + serverStatus.VoteStatus[i].PlayerName, '</span> voted: <span class="votevalue">',
         serverStatus.VoteStatus[i].VoteValue, '</span>.<br />');

    $('#votebar').html(voteStatesHTML);
}

TeamPoker.Util = {};
TeamPoker.Util.BuildStr = function () {
    var tmp = [];
    for (idx in arguments) {
        tmp.push(arguments[idx]);
    }

    return tmp.join('');
}


$(document).ready(function () {
    TeamPoker.initUI();
});

