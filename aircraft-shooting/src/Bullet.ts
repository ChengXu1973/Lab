class Bullet extends FlyingObject {
    public constructor(x:number,y:number) {
        super();
        this.createBullet(x,y);
    }

    private createBullet( x: number, y: number): Bullet {
        var theBullet: Bullet;
        this.speed = -10;
        this.hp = 1;
        this.model = new egret.Bitmap( RES.getRes( "bullet" ) );
        this.model.width = 6;
        this.model.height = 14;
        this.model.anchorOffsetX = this.model.width / 2;
        this.model.anchorOffsetY = this.model.height / 2;
        this.model.x = x;
        this.model.y = y;
        return theBullet;
    }
}
