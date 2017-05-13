// 敌机类型
enum enemyType {
    small,
    normal,
    big
}

class Enemy extends FlyingObject {
    public constructor( enemyType ) {
        super();
        this.createEnemy( enemyType );
    }

    private type: enemyType;

    private createEnemy( type: enemyType ): Enemy {
        var theEnemy: Enemy;
        var width: number;
        var height: number;
        var speed: number;
        var hp: number;
        var imgSrc: string;
        switch ( type ) {
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
        this.model = new egret.Bitmap( RES.getRes( imgSrc ) );
        this.model.width = width;
        this.model.height = height;
        this.model.anchorOffsetX = this.model.width / 2;
        this.model.anchorOffsetY = this.model.height / 2;
        this.model.y = -height;
        this.model.x = Math.random() * ( 320 - width ) + ( width / 2 );
        return theEnemy;
    }
    // 销毁
    public destroy(): egret.Bitmap[] {
        var destroyAnimation: egret.Bitmap[] = [];
        var danimationyImgSrc: string;
        switch ( this.type ) {
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
        for ( var i = 1; i <= 4; i++ ) {
            var destroyAnimationFrame = new egret.Bitmap( RES.getRes( danimationyImgSrc + i ) );
            destroyAnimationFrame = new egret.Bitmap( RES.getRes( danimationyImgSrc + i ) );
            destroyAnimationFrame.width = this.model.width;
            destroyAnimationFrame.height = this.model.height;
            destroyAnimationFrame.anchorOffsetX = this.model.width / 2;
            destroyAnimationFrame.anchorOffsetY = this.model.height / 2;
            destroyAnimationFrame.x = this.model.x;
            destroyAnimationFrame.y = this.model.y;
            destroyAnimation.push( destroyAnimationFrame );
        }
        return destroyAnimation;
    }

    // 是否被销毁
    public isDestroyed(): boolean {
        var outOfStage: boolean = this.model.y - this.model.height / 2 > 568 ? true : false;
        var shotDown: boolean = this.hp <= 0 ? true : false;
        return outOfStage || shotDown;
    }
}
