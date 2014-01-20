function ShareLinkPopup() {
  TeamPoker.UI.WidgetBase.call(this);

  var shareLinkPopup = null;
  this.init = function() {
    var header = $("<h3>").text("Copy the room link below and share to teammates"),
    lbl = $("<label>").attr("class", "control-label").attr("for", "txt-room-link").text("Room Link"),
    txtRoomLink = $("<input>").attr("type", "text").attr("class", "form-control").attr("readonly","readonly").attr("id", "txt-room-link").val(location.href),
    copyBtn = $("<a>").attr("class", "btn btn-primary").attr("id", "btn-copy").attr("data-clipboard-target", "txt-room-link").text("Copy"),
    modalBody = $("<div>").attr("id", "share-link").append(lbl).append(txtRoomLink).append(copyBtn),
    btnDismiss = $("<a>").attr("href", "javascript:void(0);").attr("data-dismiss", "modal").attr("class", "btn btn-primary").text("Dismiss");


    shareLinkPopup = new TeamPoker.UI.PopUp('shareLinkPopup', header, modalBody, btnDismiss);
    shareLinkPopup.onShown.push(function() {
      txtRoomLink.select(); 
    });
    txtRoomLink.click(function() {
      $(this).select();
    });
    shareLinkPopup.init();

    // Inits ZeroClipboard 
    ZeroClipboard.config( { moviePath: 'javascripts/vendor/ZeroClipboard.swf' } );
    var client = new ZeroClipboard(document.getElementById("btn-copy"));
    client.glue(document.getElementById("btn-copy"));

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
