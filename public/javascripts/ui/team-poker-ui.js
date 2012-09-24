TeamPoker.UIManager = {
    ParticipantsList : $("#participants"),
    StoryPointer: null,
    PokerQueue: null,
    VoteResultDialog: null,
    IsCreatingRoom: location.pathname === '/',
    init: function (){
        $("#btn-logout").click(function (e){
            e.preventDefault();
            TeamPoker.logout();
            location.reload();
        });

        if($.cookie("LoginName")) {
            (new TeamPoker.UI.ShareLinkPopup()).init().show();
            TeamPoker.login($.cookie("LoginName"));
        }
        else {
            var loginForm = new TeamPoker.UI.LoginForm();
            loginForm.init();
            loginForm.show();
        }

        $("#btnViewResult").click(TeamPoker.viewVoteResult);

        // Inits UI widgets
        this.PokerQueue = new TeamPoker.UI.PokerQueue();
        this.PokerQueue.init();
        this.PokerQueue.ListenerQueue["USER-VOTE"] = [function(votedVal) {
            $("#vote-status #spVoteVal").text(votedVal);
            $("#vote-status").show();
            TeamPoker.vote(votedVal);
        }];
        this.PokerQueue.show();
    },
    loadRoomInfo : function (roomInfo){
        this.initStoryTable(roomInfo);
        this.refreshParticipantsList(roomInfo.ParticipantCollection);
    },
    initStoryTable: function (roomInfo) {
        _(roomInfo.StoryCollection).each(function(storyInfo, id) {
            TeamPoker.UIManager.addStoryRow({ Id: id, Title: storyInfo.Title, Point: storyInfo.Point });
        });

        if(roomInfo.CurrentVotingStory) {
            TeamPoker.CurrentVotingStory = roomInfo.CurrentVotingStory;
            this.setStoryPointer(roomInfo.CurrentVotingStory);
        }
        else
            this.setStoryPointer(parseInt($("#story-table > tbody > tr:first").attr("story-id")));

        $("#btn-add-story").click(function() {
            TeamPoker.UIManager.addStoryRow();
        });
    },
    setStoryPointer: function(storyId) {
        TeamPoker.CurrentVotingStory = storyId;

        if(this.StoryPointer) this.StoryPointer.remove();

        var pointer = $("<div>").attr("id", "pointer").attr("class", "label label-info").attr("draggable","true").text(' ← ');
        // jQuery has it own dragstart which is incompatible with HTML5 native DnD
        pointer[0].addEventListener("dragstart", function(e) {
            e.dataTransfer.effectAllowed = 'move';
            //e.dataTransfer.setData("foo", "bar");
        });

        this.StoryPointer = pointer;
        $("#story-table > tbody > tr[story-id="+storyId+"] > td:eq(2)").append(pointer);
    },
    addStoryRow: function (story) {
        var storyTableBody = document.getElementById("story-table").tBodies[0],
            newRow = storyTableBody.insertRow(0),
            storyCell = $(newRow.insertCell(0)),
            pointCell = $(newRow.insertCell(1)),
            votingCell = $(newRow.insertCell(2));

        if(story) {
            storyCell.html(story.Title);
            if(story.Point) pointCell.html(story.Point);
            $(newRow).attr("story-id", story.Id);
        }
        else {
            var prevStoryId = $("#story-table > tbody > tr:last").attr("story-id") || 0;
            $(newRow).attr("story-id", parseInt(prevStoryId) + 1);
            // If the row added just now was the very first one, then append the pointer to it.
            if(prevStoryId === 0) 
                this.setStoryPointer($(newRow.cells[2]));
        }

        storyTableBody.appendChild(newRow);
        this.bindEventForStoryRow(newRow);
        if(!story) $(newRow.cells[0]).click();
    },
    bindEventForStoryRow: function(row) {
        $([row.cells[0], row.cells[1]]).on("click", TeamPoker.UIManager.changeStoryContent);
        $([row.cells[0], row.cells[1]]).on("mouseover", function () {
            $(this).tooltip({ title: "Click to edit" });
        });
        $(row.cells[2]).popover({ title: "Currently Voting", content: "Drag the arrow up/down to target the story which is currently voting for." });
        this.makeCellDraggable(row.cells[2]);
    },
    makeCellDraggable: function(cell) {
        cell.addEventListener("dragover", function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            $(this).addClass("dragover");
        });
        cell.addEventListener("dragleave", function(e) {
            //e.preventDefault();
            $(this).removeClass("dragover");
        });
        cell.addEventListener("drop", function(e) {
            //console.log(e.dataTransfer.getData("foo"));
            $(this).removeClass("dragover");
            $(this).append(TeamPoker.UIManager.StoryPointer);

            TeamPoker.setCurrentStory(parseInt($(this).parent().attr("story-id")));
        });
    },
    changeStoryContent: function (e) {
        var curTableCell = $(this),
            storyId = parseInt($(this).parent().attr("story-id")),
            oldVal = $(this).html(),
            textbox = $("<input>").attr("type", "text").val($(this).text());
            
        $(this).tooltip("hide");
        curTableCell.off("click");
        textbox.on("blur", function(evt) {
            var updatedVal = $(this).val();
            if(updatedVal !== oldVal) {
                var storyKey = "";
                if(this.parentElement.cellIndex === 0)
                    TeamPoker.updateStoryInfo(storyId, { Title:  updatedVal });
                else if(this.parentElement.cellIndex === 1)
                    TeamPoker.updateStoryInfo(storyId, { Point:  updatedVal });
            }
            curTableCell.html($(this).val());
            curTableCell.on("click", TeamPoker.UIManager.changeStoryContent);
        });
        curTableCell.html('');
        curTableCell.append(textbox);
        textbox.focus();
    },
    updateStoryInfo: function(storyInfo) {
        if($("#story-table > tbody > tr[story-id="+storyInfo.Id+"]").length) { // Existing story
            if('Title' in storyInfo.Val)
                $("#story-table > tbody > tr[story-id="+storyInfo.Id+"] > td:eq(0)").html(storyInfo.Val.Title);
            else if("Point" in storyInfo.Val)
                $("#story-table > tbody > tr[story-id="+storyInfo.Id+"] > td:eq(1)").html(storyInfo.Val.Point);
        }
        else
            this.addStoryRow({ Id: storyInfo.Id, Title: storyInfo.Val.Title, Point: storyInfo.Val.Point });
    },
    refreshParticipantsList: function(participantCollection) {
        TeamPoker.UIManager.ParticipantsList.html('');
        _(participantCollection).each(function(name, id) {
            var newParticipantLabel = $("<span>").attr("class", "participaint label label-inverse").attr("id", id).text(name);
            TeamPoker.UIManager.ParticipantsList.append(newParticipantLabel);
        });
    },
    removeFromParticipantsList : function (leftParticipantId){
        TeamPoker.UIManager.ParticipantsList.find("span[id=" + leftParticipantId + "]").remove();
    },
    showPokerbar: function () {
        $("#vote-status").hide();
        this.PokerQueue.show();
    },
    displayVoteResult : function(voteStatus) {
        console.log("Displaying vote result: ");
        console.log(voteStatus);

        var currentStoryTitle = $("#story-table > tbody > tr[story-id="+TeamPoker.CurrentVotingStory+"] > td:eq(0)").html();
        
        this.VoteResultDialog = new TeamPoker.UI.VoteResultDialog(currentStoryTitle, voteStatus);
        this.VoteResultDialog.init();
        this.VoteResultDialog.ListenerQueue["RE-VOTE"] = [ function() {
                TeamPoker.UIManager.updateStoryInfo({ Id: TeamPoker.CurrentVotingStory, Val: {Point: '' }});
                TeamPoker.UIManager.showPokerbar();
                TeamPoker.reVote();
            }
        ];
        this.VoteResultDialog.ListenerQueue["SAVE-POINT"] = [ function(point) {
                TeamPoker.UIManager.updateStoryInfo({ Id: TeamPoker.CurrentVotingStory, Val: {Point: point }});
                TeamPoker.savePoint(point);
            }
        ];
        this.VoteResultDialog.show();
    },
    revoteForStory: function(id) {
        this.updateStoryInfo({ Id: id, Val: { Point: '' } });
        this.showPokerbar();
        if(this.VoteResultDialog)
            this.VoteResultDialog.hide();
    },
    savePointForStory: function(id, point) {
        this.updateStoryInfo({ Id: id, Val: { Point: point } });
        if(this.VoteResultDialog)
            this.VoteResultDialog.hide();
    },

    cleanUp: function() {
        sessionStorage.clear();
    }
};

$(document).ready(function () {
    TeamPoker.UIManager.init();
});

$(window).on('beforeunload', function() {
    return 'You are about to leave Team Poker...';
});

$(window).unload(function() {
  alert("UNLOAD!!!");
    TeamPoker.logout();
    TeamPoker.UIManager.cleanUp();
});
