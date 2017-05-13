var FlyingObject = (function () {
    function FlyingObject() {
    }
    var d = __define,c=FlyingObject,p=c.prototype;
    // 移动
    p.move = function () {
        this.model.y += this.speed;
    };
    // 生命值计算
    p.hit = function () {
        this.hp--;
    };
    // 是否被销毁
    p.isDestroyed = function () {
        var outOfStage = this.model.height / 2 + this.model.y < 0 ? true : false;
        var shotDown = this.hp <= 0 ? true : false;
        return outOfStage || shotDown;
    };
    return FlyingObject;
}());
egret.registerClass(FlyingObject,'FlyingObject');
