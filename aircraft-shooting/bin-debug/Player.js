var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        _super.call(this);
        this.createPlayer();
    }
    var d = __define,c=Player,p=c.prototype;
    p.createPlayer = function () {
        var thePlayer;
        this.speed = 0;
        this.hp = 1;
        this.model = new egret.Bitmap(RES.getRes("player"));
        this.model.width = 66;
        this.model.height = 80;
        this.model.anchorOffsetX = this.model.width / 2;
        this.model.anchorOffsetY = this.model.height / 2;
        this.model.x = 160;
        this.model.y = 568 - this.model.height / 2;
        return thePlayer;
    };
    return Player;
}(FlyingObject));
egret.registerClass(Player,'Player');
