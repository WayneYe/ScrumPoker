function LoginForm() {
  TeamPoker.UI.WidgetBase.call(this);

  var loginForm = null;
  this.init = function() {
    var header = $("<h3>").text("Welcome to room: " + location.href.substring(location.href.lastIndexOf('/') + 1) + "! Please input your name"),
    txtNickname = $("<input>").attr("type", "text").attr("class", "form-control").attr("placeholder","Input your name here").attr("autofocus", "").attr("id", "txt-nickname"),
    body = $("<form>").attr("class", "form-horizontal").attr("role", "form").attr("id", "form-nickname").append($("<div>").attr("class", "form-group").append($("<label>").attr("class","control-label col-sm-3").attr("for", "txt-nickname").text("Nick Name")).append($("<div>").attr("class", "col-sm-8").append(txtNickname))),
    btnLogin = $("<a>").attr("href", "javascript:void(0);").attr("class", "btn btn-primary").text("Join this room!");

    loginForm = new TeamPoker.UI.PopUp('loginForm', header, body, btnLogin);
    loginForm.onShown.push(function() {
      txtNickname.focus();
      var formNickname = $("#form-nickname");
      formNickname.on("submit",function (e) {
        e.preventDefault();
      });
      txtNickname.blur(function () {
        if(!$.trim($(this).val())) {
          formNickname.removeClass("has-success");
          formNickname.addClass("has-error");
        }
        else {
          formNickname.removeClass("has-error");
          formNickname.addClass("has-success");
        }
      });
    });
    btnLogin.click(function(e) {
      var nickname = $.trim(txtNickname.val());
      if(!nickname) return;

      TeamPoker.login(nickname);
      loginForm.hide();    
    });
    loginForm.init();
    loginForm.WidgetDOM.keydown(function (evt) {
      if (evt.keyCode == 13) btnLogin.click();
    });
  };

  this.show = function() {
    loginForm.show(); 
  };

  this.hide = function() {
    loginForm.hide(); 
  };
}

LoginForm.prototype = Object.create(TeamPoker.UI.WidgetBase.prototype);
TeamPoker.UI.LoginForm = LoginForm;
