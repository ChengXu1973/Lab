class FlyingObject {
    public constructor() {
    }
    // 图片
    public model: egret.Bitmap;
    // 生命值
    protected hp: number;
    // 飞行速度
    protected speed: number;
    // 移动
    public move(): void {
        this.model.y += this.speed;
    }
    // 生命值计算
    public hit(): void {
        this.hp--;
    }
    // 是否被销毁
    public isDestroyed(): boolean {
        var outOfStage: boolean = this.model.height / 2 + this.model.y < 0 ? true : false;
        var shotDown: boolean = this.hp <= 0 ? true : false;
        return outOfStage || shotDown;
    }
}
