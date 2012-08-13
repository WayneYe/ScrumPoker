TeamPoker.UI = TeamPoker.UI || {
    ParticipantsList : $("#participants"),
    Pointer: $("#pointer"),
    init: function (){
        $(".poker").tooltip({});
        $('.poker').hover( function () {
            $(this).addClass('activePoker');
            $(this).css('z-index', 100);
        }, function () {
            $(this).removeClass('activePoker');
            $(this).css('z-index', 0);
        });
        $('.poker').click(function (e) {
            $(this).tooltip("hide");
            var votedVal = $(this).attr("vote-value");
            $('#pokerbar').hide();
            $("#vote-status #spVoteVal").text(votedVal);
            $("#vote-status").show();
            TeamPoker.vote(votedVal);
        });

        var loginForm = $('#loginForm');
        loginForm.on("show", function() {
            $("#btnLogin").on("click", function(e) {
                var loginName = $("#txtNickname").val();

                if(!loginName) {
                    $("#errNoNickname").show();
                    return;
                }
                else {
                    $("#errNoNickname").hide();
                    TeamPoker.login(loginName);
                    loginForm.modal('hide');    
                }
            });
        });
        loginForm.on("shown", function() {
            $("#txtNickname").focus();
        });
        loginForm.keydown(function (evt) {
            if (evt.keyCode == 13) $('#btnLogin').click();
        });
        loginForm.on("hidden", function() {  // remove the actual elements from the DOM when fully hidden
            loginForm.remove();
        });
        
        if(!localStorage.LoginName)
            loginForm.modal({ "backdrop" : "static", "keyboard" : true, "show" : true });

        this.initStoryTable();
        $("#btnViewResult").click(TeamPoker.viewVoteResult);
    },
    initStoryTable: function (storiesList) {
        for (var story in storiesList)
            this.addStoryRow(story);

        $("#btn-add-story").click(function() {
            TeamPoker.UI.addStoryRow();
        });

        // jQuery has it own dragstart which is incompatible with HTML5 native DnD
        this.Pointer[0].addEventListener("dragstart", function(e) {
            e.dataTransfer.effectAllowed = 'move';
            //e.dataTransfer.setData("foo", "bar");
        });
    },
    addStoryRow: function (story) {
        var storyTableBody = document.getElementById("story-table").tBodies[0],
            newRow = storyTableBody.insertRow(),
            votingCell = $(newRow.insertCell()),
            pointCell = $(newRow.insertCell()),
            storyCell = $(newRow.insertCell());

        // Appends the created new row to table and binds events, eventually simulates clicks so that user can start editing easily.
        storyTableBody.appendChild(newRow);

        if(story) {
            storyCell.html(story.Title);
            $(newRow).attr("story-id", story.Id);
        }
        else {
            var prevStoryId = $("#story-table > tbody > tr:last").attr("story-id");
            $(newRow).attr("story-id", prevStoryId);
        }

        this.bindEventForStoryRow(newRow);
    },
    bindEventForStoryRow: function(row) {
        $([row.cells[0], row.cells[1]]).on("click", TeamPoker.UI.changeStoryContent);
        $([row.cells[0], row.cells[1]]).on("mouseover", function () {
            $(this).tooltip({ title: "Click to edit" });
        });
        $(row.cells[2]).popover({ title: "Currently Voting", content: "Drag the arrow up/down to target the story which is currently voting for." });
        this.makeCellDraggable(row.cells[2]);
    },
    makeCellDraggable: function(cell, pointer) {
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
            $(this).append(TeamPoker.UI.Pointer);
        });
    },
    changeStoryContent: function (e) {
        var curTableCell = $(this),
            textbox = $("<input>").attr("type", "text").val($(this).text());
            
        $(this).tooltip("hide");
        curTableCell.off("click");
        textbox.on("blur", function(evt) {
            curTableCell.html($(this).val());
            curTableCell.on("click", TeamPoker.UI.changeStoryContent);
        });
        curTableCell.html('');
        curTableCell.append(textbox);
        textbox.focus();
    },
    showPokerbar: function () {
        $("#vote-status").hide();
        $("pokerbar").show();
    },
    refreshParticipantsList : function (list){
        this.ParticipantsList.html('');
        _(list).each(function(item) {
            var newPlaceHolder = $("<span>").attr("class", "participaint label label-inverse").attr("id", item.id).text(item.name);
            TeamPoker.UI.ParticipantsList.append(newPlaceHolder);
        });
    },
    displayVoteResult : function(voteStatus) {
        console.log("Displaying vote result: ");
        console.log(voteStatus);
        var resultDialog = $('#voteResultWrapper');
        resultDialog.on("shown", function() {
            var animateVotedPoker = function (poker) {
                poker.css('opacity', 1);
                poker.css('webkitTransform', 'rotateY(360deg)');
                poker.css('-moz-Transform', 'rotateY(360deg)');
            }

            var animationQueue = [];
            _(voteStatus).each(function(voteInfo) {
                var voterName = voteInfo["VoterName"], voteVal = voteInfo["VoteVal"];
                var $votedPoker = $('<div class="votedPoker resultPoker"><div class="poker">' + voteVal + '</div><span>' + voterName + '</span></div>');

                //if (voteVal == '0' || voteVal == '?') {
                    //$votedPoker.bind('webkitTransitionEnd', function () {
                        //$(this).css('margin-top', '10px'); $(this).css('color', 'red') // Vibrates aliens $(this).vibrate('y', 10, 2, 100);
                    //}); 
                //}

                $votedPoker.bind('transitionend', 'webkitTransitionEnd', function () {
                    if(voteInfo.HighScore) {
                        $(this).addClass('highscore');
                        $(this).css('margin-top', '10px');
                    }
                    if(voteInfo.LowScore) {
                        $(this).addClass('lowscore');
                        $(this).css('margin-top', '30px');
                    }
                    if(voteInfo.SpecialScore) {
                        $(this).addClass('specialscore');
                    }
                });

                $('#voteResultPanel').append($votedPoker);
                animationQueue.push($votedPoker);
            });

            _(animationQueue).each(function (poker) {
                setTimeout(function () { animateVotedPoker(poker); }, 100);
            });
        });

        resultDialog.delegate("#btnSavePoint","click", function(e){
            e.preventDefault();
            console.log(this);
        });

        resultDialog.modal({                 
            "backdrop"  : "static",
            "keyboard"  : true,
            "show"      : true                 
        });
    }
};

$(document).ready(function () {
    TeamPoker.UI.init();
});
