function LoginForm() {
    TeamPoker.UI.WidgetBase.call(this);

    var loginForm = null;
    this.init = function() {
        var header = $("<h3>").text("Team Poker - Please input your name"),
        txtNickname = $("<input>").attr("type", "text").attr("class", "span2").attr("placeholder","Input your name here").attr("autofocus", "").attr("id", "txt-nickname"),
        spErr = $("<span>").attr("class", "hide ipt-err").text("Nick name is required!"),
        body = $("<div>").attr("class", "form-row").append($("<label>").attr("class", "control-label").attr("for", "txt-nickname").text("Nick Name")).append(txtNickname).append(spErr),
        btnLogin = $("<a>").attr("href", "javascript:void(0);").attr("class", "btn btn-primary").text("Join");

        loginForm = new TeamPoker.UI.PopUp('loginForm', header, body, btnLogin);
        loginForm.onShown.push(function() {
            txtNickname.focus();
        });
        btnLogin.click(function(e) {
            var loginName = txtNickname.val();

            if(!loginName) {
                spErr.show();
                return;
            }
            else
                spErr.hide();

            TeamPoker.login(loginName);
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
