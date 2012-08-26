var TeamPoker = TeamPoker || { };
TeamPoker.UI = TeamPoker.UI || { };

if('localStorage' in window && window['localStorage'] !== null) {
    Storage.prototype.setObject = function (key, value) {
        this.setItem(key, JSON.stringify(value));
    }

    Storage.prototype.getObject = function (key) {
        return this.getItem(key) && JSON.parse(this.getItem(key));
    }
}
