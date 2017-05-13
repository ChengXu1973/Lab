class Player extends FlyingObject {
    public constructor() {
        super();
        this.createPlayer();
    }

    private createPlayer(): Player {
        var thePlayer: Player;
        this.speed = 0;
        this.hp = 1;
        this.model = new egret.Bitmap( RES.getRes( "player" ) );
        this.model.width = 66;
        this.model.height = 80;
        this.model.anchorOffsetX = this.model.width / 2;
        this.model.anchorOffsetY = this.model.height / 2;
        this.model.x = 160;
        this.model.y = 568 - this.model.height / 2;
        return thePlayer;
    }
}
