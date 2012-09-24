function ShareLinkPopup() {
  TeamPoker.UI.WidgetBase.call(this);

  var shareLinkPopup = null;
  this.init = function() {
    var header = $("<h3>").text("Copy the room link below and share to teammates"),
    lbl = $("<label>").attr("class", "control-label").attr("for", "txt-room-link").text("Room Link"),
    txtRoomLink = $("<input>").attr("type", "text").attr("class", "span3").attr("readonly","readonly").attr("id", "txt-room-link").val(location.href),
    body = $("<div>").attr("id", "share-link").append(lbl).append(txtRoomLink),
    btnDismiss = $("<a>").attr("href", "javascript:void(0);").attr("data-dismiss", "modal").attr("class", "btn btn-primary").text("Dismiss");

    shareLinkPopup = new TeamPoker.UI.PopUp('shareLinkPopup', header, body, btnDismiss);
    shareLinkPopup.onShown.push(function() {
      txtRoomLink.select(); 
    });
    txtRoomLink.click(function() {
      $(this).select();
    });
    shareLinkPopup.init();

    return this;
  };

  this.show = function() {
    shareLinkPopup.show(); 
  };

  this.hide = function() {
    shareLinkPopup.hide(); 
  };
}

ShareLinkPopup.prototype = Object.create(TeamPoker.UI.WidgetBase.prototype);
TeamPoker.UI.ShareLinkPopup = ShareLinkPopup;
