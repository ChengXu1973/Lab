// 敌机类型
var enemyType;
(function (enemyType) {
    enemyType[enemyType["small"] = 0] = "small";
    enemyType[enemyType["normal"] = 1] = "normal";
    enemyType[enemyType["big"] = 2] = "big";
})(enemyType || (enemyType = {}));
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(enemyType) {
        _super.call(this);
        this.createEnemy(enemyType);
    }
    var d = __define,c=Enemy,p=c.prototype;
    p.createEnemy = function (type) {
        var theEnemy;
        var width;
        var height;
        var speed;
        var hp;
        var imgSrc;
        switch (type) {
            case enemyType.big:
                hp = 12;
                speed = 3;
                width = 110;
                height = 164;
                imgSrc = "enemy3";
                break;
            case enemyType.normal:
                hp = 6;
                speed = 5;
                width = 46;
                height = 60;
                imgSrc = "enemy2";
                break;
            default:
                hp = 1;
                speed = 8;
                width = 34;
                height = 24;
                imgSrc = "enemy1";
                break;
        }
        this.type = type;
        this.speed = speed;
        this.hp = hp;
        this.model = new egret.Bitmap(RES.getRes(imgSrc));
        this.model.width = width;
        this.model.height = height;
        this.model.anchorOffsetX = this.model.width / 2;
        this.model.anchorOffsetY = this.model.height / 2;
        this.model.y = -height;
        this.model.x = Math.random() * (320 - width) + (width / 2);
        return theEnemy;
    };
    // 销毁
    p.destroy = function () {
        var destroyAnimation = [];
        var danimationyImgSrc;
        switch (this.type) {
            case enemyType.big:
                danimationyImgSrc = "enemy3_down";
                break;
            case enemyType.normal:
                danimationyImgSrc = "enemy2_down";
                break;
            default:
                danimationyImgSrc = "enemy1_down";
                break;
        }
        for (var i = 1; i <= 4; i++) {
            var destroyAnimationFrame = new egret.Bitmap(RES.getRes(danimationyImgSrc + i));
            destroyAnimationFrame = new egret.Bitmap(RES.getRes(danimationyImgSrc + i));
            destroyAnimationFrame.width = this.model.width;
            destroyAnimationFrame.height = this.model.height;
            destroyAnimationFrame.anchorOffsetX = this.model.width / 2;
            destroyAnimationFrame.anchorOffsetY = this.model.height / 2;
            destroyAnimationFrame.x = this.model.x;
            destroyAnimationFrame.y = this.model.y;
            destroyAnimation.push(destroyAnimationFrame);
        }
        return destroyAnimation;
    };
    // 是否被销毁
    p.isDestroyed = function () {
        var outOfStage = this.model.y - this.model.height / 2 > 568 ? true : false;
        var shotDown = this.hp <= 0 ? true : false;
        return outOfStage || shotDown;
    };
    return Enemy;
}(FlyingObject));
egret.registerClass(Enemy,'Enemy');
