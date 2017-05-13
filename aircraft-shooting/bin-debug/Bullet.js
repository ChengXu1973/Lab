var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(x, y) {
        _super.call(this);
        this.createBullet(x, y);
    }
    var d = __define,c=Bullet,p=c.prototype;
    p.createBullet = function (x, y) {
        var theBullet;
        this.speed = -10;
        this.hp = 1;
        this.model = new egret.Bitmap(RES.getRes("bullet"));
        this.model.width = 6;
        this.model.height = 14;
        this.model.anchorOffsetX = this.model.width / 2;
        this.model.anchorOffsetY = this.model.height / 2;
        this.model.x = x;
        this.model.y = y;
        return theBullet;
    };
    return Bullet;
}(FlyingObject));
egret.registerClass(Bullet,'Bullet');
