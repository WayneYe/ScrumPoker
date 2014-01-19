$(function() {
  var loginForm = $('#loginForm');
  loginForm.on("shown.bs.modal", function() {
    var loginName = $("#txt-nickname"),
    roomName = $("#txt-room-name"),
    stories = $("#txt-stories"),
    roomForm = $("#f");

    $.each([roomName, stories, loginName], function (idx, formCtrl) {
      formCtrl.hasErr = true;
      formCtrl.blur(function (e) {
        validate(formCtrl);
      });
    });

    $("#btnLogin").on("click", function(e) {
      e.preventDefault();

      var hasErr = false;
      $.each([roomName, stories, loginName], function (idx, formCtrl) {
        if(formCtrl.hasErr) {
          console.log(formCtrl.attr("id") + " cannot be blank");
          hasErr = true;
      }});

      if(hasErr) return;

      $.cookie("LoginName", loginName);
      roomForm.submit();
    });
  });

  // Binding events
  loginForm.keydown(function (evt) {
    if (evt.keyCode == 13) $('#btnLogin').click();
  });

  loginForm.modal({ "backdrop" : "static", "keyboard" : false, "show" : true });

  function validate(formCtrl) {
    var formGrp = formCtrl.parents(".form-group");
    if(!$.trim(formCtrl.val())) {
      formGrp.removeClass('has-success');
      formGrp.addClass('has-error');
      formCtrl.hasErr = true;
    }
    else {
      formGrp.removeClass('has-error');
      formGrp.addClass('has-success');
      formCtrl.hasErr = false;
    }
  }
});
