function VoteResultDialog(storyName, voteStatus) {
  TeamPoker.UI.WidgetBase.call(this);

  var voteResultDialog = null;
  this.init = function() {
    var header = [$("<h3>").text("Voting results for Story: "), $("<span>").text(storyName)],
    body = $("<div>").attr("id", "voteResultPanel"),
    txtStoryPoint = $("<input>").attr("type", "text").attr("class", "input-mini").attr("id", "txt-estimated-story-point").attr("size", "2").attr("autofocus", ""),
    spErr = $("<span>").attr("class", "hide ipt-err").text("Invalid story point!"),
    estimationWrapper = $("<div>").attr("id", "estimated-story-point-wrapper").append($("<strong>").append($("<span>").text("Let's decide the point: "))).append(txtStoryPoint).append(spErr), 
    revoteBtn = $("<a>").attr("href", "javascript:void(0);").attr("class", "btn btn-default").attr("data-dismiss", "modal").text("Re-vote"),
    savePointBtn = $("<a>").attr("href", "javascript:void(0);").attr("class", "btn btn-success").text("Save Point To Story"),
    footer = [estimationWrapper, revoteBtn, savePointBtn],
    me = this;

    voteResultDialog = new TeamPoker.UI.PopUp('vote-result-dialog', header, body, footer);
    voteResultDialog.init();
    voteResultDialog.onShown.push(function() {
      var animateVotedPoker = function (poker) {
        poker.css('opacity', 1);
        poker.css('webkitTransform', 'rotateY(360deg)');
        poker.css('-moz-Transform', 'rotateY(360deg)');
      };

      var animationQueue = [];
      _(voteStatus).each(function(voteInfo) {
        var voterName = voteInfo["VoterName"], voteVal = voteInfo["VoteVal"];
        var $votedPoker = $('<div class="votedPoker resultPoker"><div class="poker">' + voteVal + '</div><span>' + voterName + '</span></div>');

        $votedPoker.bind('transitionend webkitTransitionEnd', function () {
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

        body.append($votedPoker);
        animationQueue.push($votedPoker);
      });

      _(animationQueue).each(function (poker) {
        setTimeout(function () { animateVotedPoker(poker); }, 100);
      });
    });

    txtStoryPoint.blur(function() {
      if($.inArray($(this).val(), TeamPoker.Constants.POKER_VALUES) === -1) {
        spErr.removeClass("hide");
      }
      else {
        spErr.addClass("hide");
      }
    });
    revoteBtn.click(function(e){
      me.broadcastMessage("RE-VOTE");
    });
    savePointBtn.click(function(e){
      var storyPoint = $.trim(txtStoryPoint.val());
      if(storyPoint !== '' && $.inArray(storyPoint, TeamPoker.Constants.POKER_VALUES) >= 0) {
        me.broadcastMessage("SAVE-POINT", storyPoint);
        voteResultDialog.hide();
      }
      else {
        spErr.removeClass("hide");
      }
    });
  };

  this.show = function() {
    voteResultDialog.show(); 
  };

  this.hide = function() {
    voteResultDialog.hide(); 
  };
}

VoteResultDialog.prototype = Object.create(TeamPoker.UI.WidgetBase.prototype);
TeamPoker.UI.VoteResultDialog = VoteResultDialog;
