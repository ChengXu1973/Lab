/*
 * 游戏进程：加载资源-->初始化界面-->开始游戏：
 * setInterval(function() {
 *     render() {
 *         renderEnemy();
 *         renderBullet();
 *         renderPlayer();
 *     };
 *     update() {
 *         addNewEnemy();
 *         addNewBullet();
 *         hitTest();
 *         deleteInvalidEnemy();
 *         deleteInvalidBullet();
 *     };
 * },50)
 * -->结束游戏-->重新开始
 */

/* 
 * 后期改进思路：
 * 1.参数分离：部分数值写死在程序中，应将数据与逻辑进行分离便于为其维护扩展(静态变量数组)；
 * 2.分数显示：包括实时显示当前分数，在得分面板显示历史最高分，分数排行榜等等(本地缓存/服务器通信)；
 * 3.暂停按钮：暂停当前游戏(timer的stop事件)
 * 4.游戏音效：为游戏添加背景音乐以及子弹发射、击毁等音效，以及一个静音开关
 * 5.将得分面板以及开始画面的绘制部分封装进单独的类，使程序入口mian类里面的代码结构更简洁
 */

class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        this.addEventListener( egret.Event.ADDED_TO_STAGE, this.onAddToStage, this );
    }

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    private onAddToStage( event: egret.Event ) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild( this.loadingView );

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener( RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this );
        RES.loadConfig( "resource/default.res.json", "resource/" );
    }

    /**
     * 配置文件加载完成,开始预加载flight资源组。
     * configuration file loading is completed, start to pre-load the flight resource group
     */
    private onConfigComplete( event: RES.ResourceEvent ): void {
        RES.removeEventListener( RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this );
        RES.addEventListener( RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this );
        RES.addEventListener( RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this );
        RES.addEventListener( RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this );
        RES.addEventListener( RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this );
        RES.loadGroup( "flight" );
    }

    /**
     * flight资源组加载完成
     * flight resource group is loaded
     */
    private onResourceLoadComplete( event: RES.ResourceEvent ): void {
        if ( event.groupName == "flight" ) {
            this.stage.removeChild( this.loadingView );
            RES.removeEventListener( RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this );
            RES.removeEventListener( RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this );
            RES.removeEventListener( RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this );
            RES.removeEventListener( RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this );
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError( event: RES.ResourceEvent ): void {
        console.warn( "Url:" + event.resItem.url + " has failed to load" );
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError( event: RES.ResourceEvent ): void {
        //TODO
        console.warn( "Group:" + event.groupName + " has failed to load" );
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete( event );
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress( event: RES.ResourceEvent ): void {
        if ( event.groupName == "flight" ) {
            this.loadingView.setProgress( event.itemsLoaded, event.itemsTotal );
        }
    }

    /*
     * 资源加载完成，初始化游戏界面
     */

    // 背景图片
    private background: egret.Bitmap;
    // 玩家飞机
    private player: Player;
    // 敌方飞机 （注意：该值初始化为空数组编译为JS后才能调用push方法）
    private enemies: Array<Enemy> = [];
    // 敌方飞机被摧毁动画
    private enemyDestroyAnimation: any[] = [];
    // 子弹
    private bullets: Bullet[] = [];
    // 计分器
    private score: number = 0;
    // 计时器
    private timer: egret.Timer;
    // 时间戳
    private timeTick: number = 0;
    // 当前触摸状态，按下时，值为true
    private touchStatus: boolean = false;
    // 鼠标点击时，鼠标全局坐标与player.image的位置差
    private touchPosition: egret.Point = new egret.Point();
    // 触控位置的边界位置(根据玩家控制飞机大小以及画布大小决定)
    private touchPositionLimits: any = {
        left: 33,
        right: 287,
        top: 40,
        bottom: 528
    };

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene(): void {
        // 绘制起始页背景
        var startPage: egret.Bitmap = new egret.Bitmap( RES.getRes( "start-background" ) );
        startPage.x = 0;
        startPage.y = 0;
        this.addChild( startPage );
        // 添加开始按钮并注册点击开始游戏事件
        var startButton: egret.TextField = this.drawStartButton();
        startButton.touchEnabled = true;
        startButton.addEventListener( egret.TouchEvent.TOUCH_TAP, this.startGame, this );
    }

    // 绘制开始按钮
    private drawStartButton(): egret.TextField {
        var shape: egret.Shape = new egret.Shape();
        shape.graphics.beginFill( 0x000000, 0 );
        shape.graphics.lineStyle( 1, 0x222222 );
        shape.graphics.drawRoundRect( 110, 420, 100, 40, 10, 10 );
        shape.graphics.endFill();
        this.addChild( shape );
        var text: egret.TextField = new egret.TextField();
        text.text = "开始游戏";
        text.fontFamily = "MicroSoft YaHei";
        text.size = 16;
        text.bold = false;
        text.textColor = 0x000000;
        text.width = 320;
        text.textAlign = "center";
        text.y = 432;
        this.addChild( text );
        return text;
    }

    // 点击开始游戏
    private startGame(): void {
        // 清零分数
        this.score = 0;
        // 初始化背景
        this.background = new egret.Bitmap( RES.getRes( "background" ) );
        // 初始化玩家控制飞机
        this.player = new Player();
        this.player.model.touchEnabled = true;
        this.player.model.addEventListener( egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this );
        this.player.model.addEventListener( egret.TouchEvent.TOUCH_END, this.mouseUp, this );
        this.touchPosition.x = this.player.model.x;
        this.touchPosition.y = this.player.model.y;
        // 设置timer并逐帧渲染
        this.timer = new egret.Timer( 50, 0 );
        this.timer.start();
        this.timer.addEventListener( egret.TimerEvent.TIMER, this.renderPlane, this );
    }

    // 帧动画渲染
    private renderPlane( event: egret.Event ): void {
        // 清空舞台
        this.removeChildren();
        // 绘制游戏背景图片
        this.addChild( this.background );
        // 绘制敌机爆炸动画
        for ( var i = 0; i < this.enemyDestroyAnimation.length; i++ ) {
            if ( this.enemyDestroyAnimation[i].length != 0 ) {
                this.addChild( this.enemyDestroyAnimation[i][0] );
            }
        }
        // 绘制所有的子弹与敌方飞机
        for ( var i = 0; i < this.enemies.length; i++ ) {
            this.addChild( this.enemies[i].model );
        }
        for ( var i = 0; i < this.bullets.length; i++ ) {
            this.addChild( this.bullets[i].model );
        }
        // 绘制玩家控制的飞机
        this.addChild( this.player.model );
        // 进行下一帧动画数据更新
        this.updateData();
    }

    // 更新飞机以及子弹状态数据
    private updateData(): void {
        // 设置计时器
        this.timeTick += 1;
        this.timeTick = this.timeTick % 21; // time从0到20变化
        // 每秒生成3组子弹
        this.addNewBullet( this.timeTick );
        // 随机生成敌方飞机
        this.addNewEnemy( this.timeTick );
        // 判断碰撞
        this.hitTest();
        // 删除无效摧毁动画
        for ( var i = 0; i < this.enemyDestroyAnimation.length; i++ ) {
            if ( this.enemyDestroyAnimation[i].length == 0 ) {
                this.enemyDestroyAnimation.splice( i, 1 );
                i--;
                continue;
            }
            this.enemyDestroyAnimation[i].splice( 0, 1 );
        }
        // 删除无效敌机
        var tempEnemies: Enemy[] = [];
        for ( var i = 0; i < this.enemies.length; i++ ) {
            this.enemies[i].move();
            if ( !this.enemies[i].isDestroyed() ) {
                // 保存未摧毁敌机
                tempEnemies.push( this.enemies[i] );
            } else {
                // 添加被摧毁动画
                this.enemyDestroyAnimation.push( this.enemies[i].destroy() );
            }
        }
        this.enemies = tempEnemies;
        // 删除无效子弹
        var tempBullets: Bullet[] = [];
        for ( var i = 0; i < this.bullets.length; i++ ) {
            this.bullets[i].move();
            if ( !this.bullets[i].isDestroyed() ) {
                tempBullets.push( this.bullets[i] );
            }
        }
        this.bullets = tempBullets;
    }

    // 随机添加敌机
    private addNewEnemy( num: number ): void {
        var type: number = Math.floor( 2 * Math.random() * num );
        var newEnemy: any;
        switch ( type ) {
            case 10:
                newEnemy = new Enemy( enemyType.small );
                this.enemies.push( newEnemy );
                break;
            case 20:
                newEnemy = new Enemy( enemyType.normal );
                this.enemies.push( newEnemy );
                break;
            case 30:
                newEnemy = new Enemy( enemyType.big );
                this.enemies.push( newEnemy );
                break;
            default:
                break;
        }
    }

    // 添加新子弹
    private addNewBullet( num: number ): void {
        if ( num == 0 || num == 7 || num == 14 ) {
            var bulletLeft = new Bullet( this.player.model.x - 22, this.player.model.y - 18 );
            var bulletRight = new Bullet( this.player.model.x + 22, this.player.model.y - 18 );
            this.bullets.push( bulletLeft );
            this.bullets.push( bulletRight );
        }
    }

    // 碰撞检测
    private hitTest() {
        for ( var i = 0; i < this.enemies.length; i++ ) {
            // 检测敌机与子弹碰撞
            for ( var j = 0; j < this.bullets.length; j++ ) {
                var testPoint: any = {};
                testPoint.x = this.bullets[j].model.x;
                testPoint.y = this.bullets[j].model.y - this.bullets[j].model.height / 2;
                if ( testPoint.y > 0 ) {
                    var isHit: boolean = this.enemies[i].model.hitTestPoint( testPoint.x, testPoint.y );
                    if ( isHit ) {
                        this.enemies[i].hit();
                        this.bullets[j].hit();
                        this.score++;
                    }
                }
            }
            // 检测玩家控制飞机与敌机碰撞
            var testPoints: Array<any> = [];
            var baseX: number = this.player.model.x;
            var baseY: number = this.player.model.y;
            var sizeX: number = this.player.model.width;
            var sizeY: number = this.player.model.height;
            // 设置6个碰撞检测点
            testPoints[0] = { x: baseX, y: baseY + 1 * sizeY / 4 };
            testPoints[1] = { x: baseX + sizeX / 2, y: baseY + 3 * sizeY / 8 };
            testPoints[2] = { x: baseX - sizeX / 2, y: baseY + 3 * sizeY / 8 };
            testPoints[3] = { x: baseX - sizeX / 3, y: baseY + sizeY / 2 };
            testPoints[4] = { x: baseX + sizeX / 3, y: baseY + sizeY / 2 };
            testPoints[5] = { x: baseX, y: baseY - sizeY / 2 };
            for ( var m = 0; m < 6; m++ ) {
                var gameOver: boolean = this.enemies[i].model.hitTestPoint( testPoints[m].x, testPoints[m].y );
                // 发生碰撞游戏结束
                if ( gameOver ) {
                    this.endGame();
                    break;
                }
            }
        }
    }

    // 游戏结束
    private endGame() {
        // 清除游戏资源
        this.timer.stop();
        this.timer.removeEventListener( egret.TimerEvent.TIMER, this.renderPlane, this );
        this.player.model.removeEventListener( egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this );
        this.player.model.removeEventListener( egret.TouchEvent.TOUCH_END, this.mouseUp, this );
        this.stage.removeEventListener( egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this );
        this.enemies = [];
        this.bullets = [];
        this.enemyDestroyAnimation = [];
        this.timeTick = 0;
        this.touchStatus = false;
        this.player = null;
        // 显示得分板
        this.drawScoreboard();
    }

    // 显示得分与重新开始按钮
    private drawScoreboard() {
        // 显示得分板
        var scoreboard: egret.Shape = new egret.Shape();
        scoreboard.graphics.beginFill( 0xcccccc, 1 );
        scoreboard.graphics.lineStyle( 1, 0x222222, 1 );
        scoreboard.graphics.drawRoundRect( 60, 200, 200, 168, 10, 10 );
        scoreboard.graphics.moveTo( 60, 240 );
        scoreboard.graphics.lineTo( 260, 240 );
        scoreboard.graphics.endFill();
        this.addChild( scoreboard );
        // 得分板标题
        var scoreboardTitle: egret.TextField = new egret.TextField();
        scoreboardTitle.text = "飞机大战分数";
        scoreboardTitle.fontFamily = "MicroSoft YaHei";
        scoreboardTitle.size = 16;
        scoreboardTitle.bold = false;
        scoreboardTitle.textColor = 0x000000;
        scoreboardTitle.width = 320;
        scoreboardTitle.textAlign = "center";
        scoreboardTitle.y = 215;
        this.addChild( scoreboardTitle );
        // 显示得分
        var finalScore: egret.TextField = new egret.TextField();
        finalScore.text = this.score.toString();
        finalScore.fontFamily = "MicroSoft YaHei";
        finalScore.size = 18;
        finalScore.bold = false;
        finalScore.textColor = 0x000000;
        finalScore.width = 320;
        finalScore.textAlign = "center";
        finalScore.y = 265;
        this.addChild( finalScore );
        // 显示重新开始按钮
        var restart: egret.Shape = new egret.Shape();
        restart.graphics.beginFill( 0x000000, 0 );
        restart.graphics.lineStyle( 1, 0x222222 );
        restart.graphics.drawRoundRect( 110, 300, 100, 40, 10, 10 );
        restart.graphics.endFill();
        this.addChild( restart );
        var restartText: egret.TextField = new egret.TextField();
        restartText.text = "重新开始";
        restartText.fontFamily = "MicroSoft YaHei";
        restartText.size = 16;
        restartText.bold = false;
        restartText.textColor = 0x000000;
        restartText.width = 320;
        restartText.textAlign = "center";
        restartText.y = 313;
        this.addChild( restartText );
        // 绑定点击事件重新开始游戏
        restartText.touchEnabled = true;
        restartText.addEventListener( egret.TouchEvent.TOUCH_TAP, this.startGame, this );
    }

    /* 
     * 玩家控制飞机的鼠标交互事件
     */
    // 鼠标按下
    private mouseDown( evt: egret.TouchEvent ) {
        this.touchStatus = true;
        this.touchPosition.x = evt.stageX - this.player.model.x;
        this.touchPosition.y = evt.stageY - this.player.model.y;
        this.stage.addEventListener( egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this );
    }
    // 鼠标按下过程中移动
    private mouseMove( evt: egret.TouchEvent ) {
        if ( this.touchStatus ) {
            var unmodifiedX = evt.stageX - this.touchPosition.x;
            var unmodifiedY = evt.stageY - this.touchPosition.y;
            // 使玩家控制的飞机不超出边界
            unmodifiedX = unmodifiedX < this.touchPositionLimits.left ? this.touchPositionLimits.left : unmodifiedX;
            unmodifiedY = unmodifiedY < this.touchPositionLimits.top ? this.touchPositionLimits.top : unmodifiedY;
            unmodifiedX = unmodifiedX > this.touchPositionLimits.right ? this.touchPositionLimits.right : unmodifiedX;
            unmodifiedY = unmodifiedY > this.touchPositionLimits.bottom ? this.touchPositionLimits.bottom : unmodifiedY;
            // 更新飞机位置
            this.player.model.x = unmodifiedX;
            this.player.model.y = unmodifiedY;
        }
    }
    // 鼠标抬起
    private mouseUp( evt: egret.TouchEvent ) {
        this.touchStatus = false;
        this.stage.removeEventListener( egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this );
    }

}


