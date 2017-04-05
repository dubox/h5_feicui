/**
 * Created by wzm on 14-10-8.
 */
//cc.SPRITE_DEBUG_DRAW = 1;
var canChangePage = true;
var curScene = null;
var MainScene = cc.Scene.extend({
    listener: null,
    accelListener: null,
    currentIndex: 0,
    sceneList: [],
    ctor: function () {
        this._super();
    },
    onEnter: function () {
        this._super();
        this.initUI();
        this.addTouch();
        this.initHideEvent();
        curScene = this;
        initMusic();
        playMusic(true);
//        this.addAccel();
    },
    initUI: function () {

        //背景色
        var bgLayer = new cc.LayerColor(cc.color(11, 15, 36, 255));
        this.addChild(bgLayer, 0);

        /*水印
        var logo = new cc.Sprite(res.logo1);
        logo.setPosition(cc.pAdd(cc.visibleRect.center, cc.p(0, 0)));
        logo.setOpacity(50);
        this.addChild(logo, 1);
        */

        this.arrow = new cc.Sprite(res.arrow);
        this.arrow.setPosition(cc.pAdd(cc.visibleRect.bottom, cc.p(0, 50)));
        var posY = this.arrow.y;
        var arrowAction = cc.repeatForever(cc.sequence(cc.spawn(cc.moveTo(0.8, cc.p(this.arrow.x, posY + 30)).easing(cc.easeIn(0.5)), cc.fadeOut(1)), cc.delayTime(0.8), cc.callFunc(function () {
            this.arrow.y = this.arrow.y - 30;
            this.arrow.opacity = 255;
        }, this)));
        this.arrow.runAction(arrowAction);
        //this.addChild(this.arrow, 1);

        /**
        this.menuItemToggle = new cc.MenuItemToggle(new cc.MenuItemImage(res.bgm), new cc.MenuItemImage(res.bgm), this.toggleMusicCallback, this);
        this.menuItemToggle.setPosition(cc.pAdd(cc.visibleRect.topRight, cc.p( - 70, -70)));
		this.menuItemToggle.scale = 0.7;
        var togglemenu = new cc.Menu(this.menuItemToggle);
        togglemenu.anchorX = 0;
        togglemenu.anchorY = 0;
        togglemenu.x = 0;
        togglemenu.y = 0;
		
        this.addChild(togglemenu, 1);
         **/

        this.animLayer = new cc.Layer();
        this.addChild(this.animLayer);
        this.sceneList.push(new Layer1());
        this.sceneList.push(new Layer2());
        this.sceneList.push(new Layer3());
        this.sceneList.push(new Layer4());
        this.sceneList.push(new Layer5());
        this.sceneList.push(new Layer6());
        this.sceneList.push(new Layer7());
        this.sceneList.push(new Layer8());
        this.sceneList.push(new Layer9());
        this.sceneList.push(new Layer10());
        for (var i = 0; i < this.sceneList.length; i++) {
            var scene = this.sceneList[i];
            scene.anchorX = 0;
            scene.anchorY = 0;
            scene.x = 0;
            scene.y = 0;
            if (this.currentIndex != i) {
                scene.setVisible(false);
            }
            this.animLayer.addChild(scene, this.sceneList.length - i);
        }
    },
    initHideEvent: function () {
        cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function () {
            playMusic(true);
        });
        cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function () {
            playMusic(false);
        });

    },
    toggleMusicCallback: function (sender) {
        if (sender.getSelectedIndex() == 0) {
            playMusic(true);
        } else {
            playMusic(false);
        }
    },
    togleArrow: function (status) {
        if (status) {
            this.arrow.visible = true;
        }
        else {
            this.arrow.visible = false;
        }
    },
    addTouch: function () {
        var self = this;
        self.listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            startPosY: 0,
            onTouchBegan: function (touch, event) {
                this.startPosY = touch.getLocation().y;
                return true;
            },
            onTouchMoved: function (touch, event) {

            },
            onTouchEnded: function (touch, event) {
                if (musicPlayStatus) {
                    playMusic(true);
                }
                if (canChangePage) {
                    var delta = touch.getLocation().y - this.startPosY;
                    if (delta > 15 && self.currentIndex < self.sceneList.length - 1) {
                        self.changePage(++self.currentIndex, true);
                    } else if (delta < -15 && self.currentIndex > 0) {
                        self.changePage(--self.currentIndex, false);
                    }
                }
            },
            onTouchCancelled: function (touch, event) {

            }
        });
        cc.eventManager.addListener(self.listener, self);
    },
    addAccel: function () {
        var self = this;
        cc.inputManager.setAccelerometerInterval(1 / 30);
        cc.inputManager.setAccelerometerEnabled(true);
        this.accelListener = {
            event: cc.EventListener.ACCELERATION,
            callback: function (acc, event) {
                for (var i = 0; i < self.sceneList.length; ++i) {
                    self.sceneList[i].accelEvent(acc, event);
                }
            }
        }
        cc.eventManager.addListener(this.accelListener, self);
    },
    changePage: function (index, next) {
        canChangePage = false;
        var scene = next ? this.sceneList[index - 1] : this.sceneList[index + 1];
        if (index == this.sceneList.length-1) {
            this.togleArrow(false);
        } else {
            this.togleArrow(true);
        }
        var nextPage = function () {
            scene.visible = false;
            this.sceneList[index].visible = true;
            this.sceneList[index].appear();
        };
        if (scene) {
            scene.disappear(nextPage, this);
        }
    }
});


var act_shake = function (speed,move,repeat) {

    speed = speed || 0.05;
    move = move || cc.p(8, 8);

    var move = cc.moveBy(speed, move);
    var move_back = move.reverse();
    var move_seq = cc.sequence(move, move_back);
    if(!repeat)
    return move_seq.repeatForever();
    return move_seq.repeat(repeat);
}


var Layer1 = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.initUI();
    },
    onEnter: function () {
        this._super();
        //this.appear();
        this.addTouch();
    },
    scale:function () {
        return cc.winSize.width / this.bg.width;
    },
    initUI: function () {


        canChangePage = false;
        this.accLayer = new cc.Layer();
        this.accLayer.anchorX = 0;
        this.accLayer.anchorY = 0;
        this.accLayer.x = 0;
        this.accLayer.y = 0;
        this.addChild(this.accLayer);

        this.bg = new cc.Sprite(res.bg1);
        //this.bg.setOpacity(50);
        this.bg.anchorX = 0;
        this.bg.anchorY = 0;
        this.bg.scale = this.scale();
        //this.bg.scaleY = cc.winSize.height / this.bg.height;
        this.addChild(this.bg, 0);



        this.rocket = new cc.Sprite();
        //this.rocket.setContentSize();
        this.rocket.scale = this.scale();
        this.rocket.setPosition(cc.pAdd(cc.visibleRect.bottom, cc.p(0, 330)));
        this.addChild(this.rocket, 1);

        //火箭
        this.p1_1 = new cc.Sprite(res.p1_1);
        this.rocket.addChild(this.p1_1 ,1);

        //火焰
        this.p1_2 = new cc.Sprite(res.p1_2);
        this.p1_2.anchorY = 1;
        this.p1_2.scale = 0;
        this.p1_2.setPosition( cc.p(15, -215));
        this.rocket.addChild(this.p1_2 ,0);

        //烟雾
        this.p1_3 = new cc.Sprite(res.p1_3);
        this.p1_3.setOpacity(150);
        this.p1_3.scale = 0.1;
        this.p1_3.setPosition(cc.pAdd(cc.visibleRect.bottom, cc.p(0,  150)));
        this.addChild(this.p1_3 ,2);

        //阴影
        this.p1_4 = new cc.Sprite(res.p1_4);
        this.p1_4.scale = this.scale();
        this.p1_4.setPosition(cc.pAdd(cc.visibleRect.bottom, cc.p(0,  100)));
        this.addChild(this.p1_4 ,0);

        //按钮
        this.p1_5 = new cc.Sprite(res.p1_5);
        this.p1_5.scale = this.scale();
        this.p1_5.setPosition(cc.pAdd(cc.visibleRect.bottom, cc.p(0,  150)));
        this.addChild(this.p1_5 ,2);

        //
        var label = cc.LabelTTF.create("长按屏幕 发射火箭", "Arial", 30);
        label.setPosition(cc.pAdd(cc.visibleRect.bottom, cc.p(0,  50)));
        this.addChild(label, 2);


        this.rocketStatus = 0; //0 初始；1 启动；2 运行；3 暂停；4 飞走


    },

    getBezier:function () {
        var     start = cc.p(this.rocket.getPosition())  ,
            ctrl1 = cc.p(cc.pAdd(this.rocket.getPosition() , cc.p(0,200))),
            ctrl2 = cc.p(cc.pAdd(this.rocket.getPosition() , cc.p(0,350))),
            end = cc.p(cc.pAdd(this.rocket.getPosition() , cc.p(250,300)));

        var dn = new cc.DrawNode();
        //drawCubicBezier(origin, control1, control2, destination, segments, lineWidth, color)
        dn.drawCubicBezier(start , ctrl1 ,ctrl2 ,end ,29,2,cc.color( 233, 64, 65, 155));
        //this.addChild(dn, 1);

        var Segment1 = new cc.DrawNode();
        Segment1.drawSegment(start , ctrl1,1,cc.color( 233, 64, 65, 155));
        //this.addChild(Segment1, 1);

        var Segment2 = new cc.DrawNode();
        Segment2.drawSegment(ctrl2 , end ,1,cc.color( 233, 64, 65, 155));
        //this.addChild(Segment2, 1);


        var controlPoints = [ ctrl1,
            ctrl2,
            end ];

        return bezierForward = cc.bezierTo(2, controlPoints);
    },


    //火箭飞行
    runRocket:function () {


        var _this = this;
        var bg_scale = _this.scale();


        var st = setInterval(function () {

            if(_this.rocketStatus != 2){clearInterval(st);return;}

            if(_this.rocket.getPositionY() <= cc.visibleRect.center.y - 150){
                //第一阶段 ： 火箭离地 飞到屏幕中间
                _this.rocket.runAction(cc.moveBy(0.5,0,100) )
            }else if( (_this.bg.getPositionY()+_this.bg.height * bg_scale) >= cc.visibleRect.top.y + 100){
                //第二阶段 ： 火箭不动 背景往下走
                _this.bg.runAction(cc.moveBy(0.5,0,-100));
            }else {
                //第三阶段 ： 火箭延贝塞尔曲线飞走 消失
                _this.rocketStatus = 4;
                _this.rocket.runAction(
                    cc.sequence(
                        cc.spawn(cc.moveBy(1,0,150),new cc.scaleBy(1,0.05,0.05)),

                        cc.callFunc(function () {
                            _this.rocket.runAction(cc.spawn(
                                _this.getBezier(),
                                new cc.scaleTo(2,0,0),
                                new cc.rotateBy(2,106,106)

                            ));
                        })
                    ));
                clearInterval(st);
            }

        },500);

        //阴影动画
        this.p1_4.runAction(
            cc.sequence(cc.delayTime(0.5),cc.spawn(

                new cc.FadeTo(0.6, 0),
                new cc.scaleTo(1,2,1)
            ))
            )
    },

    //火箭启动
    startRocket:function () {

        this.rocketStatus = 1;

        var _this = this;

        //背景动画
        this.bg.runAction(act_shake(0,0,20));
        //烟雾动画
        _this.p1_3.runAction(
            cc.spawn(
                new cc.scaleTo(2,2,2),
                cc.sequence(new cc.FadeTo(0.5, 255) ,cc.delayTime(0.5), new cc.FadeTo(1, 0))
            )
        );
        //火焰动画
        _this.p1_2.runAction(new cc.scaleTo(2,1,1));
        _this.p1_2.runAction(act_shake(0,cc.p(4,8)));

        setTimeout(function () {

            if(_this.listener.touchStatus != 1){_this.rocketStatus = 3;return;}

            _this.rocketStatus = 2;
            _this.runRocket();
        },1500);
    },
    addTouch: function () {
        var self = this;
        self.listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            startPosY: 0,
            startTime: 0,
            touchStatus:0,
            onTouchBegan: function (touch, event) {
                var _this = this;
                _this.touchStatus = 1;
                //this.startPosY = touch.getLocation().y;
                if(self.rocketStatus == 0){
                    var d = new Date();
                    this.startTime = d.getTime();
                    setTimeout(function () {
                        if(!_this.touchStatus)return false;
                        self.startRocket();
                    },500);

                }else if(self.rocketStatus == 3){
                    self.rocketStatus = 2;
                    self.runRocket();
                }


                return true;
            },
            onTouchMoved: function (touch, event) {

            },
            onTouchEnded: function (touch, event) {
                this.touchStatus = 0;

                if(self.rocketStatus == 2){
                    self.rocketStatus = 3;

                }
            },
            onTouchCancelled: function (touch, event) {

            }
        });
        cc.eventManager.addListener(self.listener, self);
    },
    accelEvent: function (acc, event) {
        if (this.visible) {
            movArea(acc, this.accLayer);
        }
    },
    appear: function () {
        var bgAction = cc.sequence(new cc.FadeTo(1.0, 255), cc.callFunc(function () {




            this.p1_2.act = cc.sequence(cc.delayTime(0.3),cc.spawn(new cc.FadeTo(1, 255),cc.moveTo(1,cc.pAdd(cc.visibleRect.top, cc.p(-60, -cc.winSize.height / 6)))));
            this.p1_2.runAction(this.p1_2.act);

            this.p1_3.act = cc.sequence(cc.delayTime(1.3),cc.spawn(new cc.FadeTo(1, 255)));
            this.p1_3.runAction(this.p1_3.act);

            this.p1_4.act = cc.sequence(cc.delayTime(1.3),cc.spawn(new cc.FadeTo(1, 255),cc.scaleTo(1,1)));
            this.p1_4.runAction(this.p1_4.act);


            this.p1_1.act = cc.sequence(cc.delayTime(3.3),cc.spawn(new cc.FadeTo(0.5, 255),cc.scaleTo(0.5,1)));
            this.p1_1.runAction(this.p1_1.act);

        }, this), cc.delayTime(3.3), cc.callFunc(function () {
            canChangePage = true;
        }, this));
        this.bg.runAction(bgAction);

    },
    disappear: function (callback, target) {

        var action = cc.sequence(new cc.FadeTo(0.5, 0), cc.callFunc(function () {

            this.p1_1.runAction(new cc.FadeOut(0.5));
            this.p1_2.runAction(new cc.FadeOut(0.5));
            this.p1_3.runAction(new cc.FadeOut(0.5));
            this.p1_4.runAction(new cc.FadeOut(0.5));
            this.p1_5.runAction(new cc.FadeOut(0.5));
        }, this), cc.delayTime(0), cc.callFunc(function () {

            if (target && callback) {
                callback.call(target);
            }
        }, this));
        this.bg.runAction(action);
    }
});
var Layer2 = cc.Layer.extend({
    ctor: function () {
        this._super();
    },
    onEnter: function () {
        this._super();
        
		this.initUI();
        //this.appear();
    },
    initUI: function () {
        this.accLayer = new cc.Layer();
        this.accLayer.anchorX = 0;
        this.accLayer.anchorY = 0;
        this.accLayer.x = 0;
        this.accLayer.y = 0;
        this.addChild(this.accLayer);

        this.bg = new cc.Sprite(res.bg2);
        this.bg.scaleX = cc.winSize.width / this.bg.width;
        this.bg.scaleY = cc.winSize.height / this.bg.height;
        this.bg.setPosition(cc.visibleRect.center);
        this.bg.setOpacity(50);this.addChild(this.bg, 0);

        this.p2_1 = new cc.Sprite(res.p2_1);
        this.p2_1.setPosition( cc.p(-this.p2_1.width / 2, cc.winSize.height / 4));
        this.addChild(this.p2_1);

        this.p2_2 = new cc.Sprite(res.p2_2);
        this.p2_2.scaleX = cc.winSize.width / this.p2_2.width;
        this.p2_2.setOpacity(0);
        this.p2_2.setPosition( cc.pAdd(cc.visibleRect.bottom, cc.p(this.p2_2.width / 2 + 10, cc.winSize.height / 4 +15)));
        this.addChild(this.p2_2);

        this.p2_3 = new cc.Sprite(res.p2_3);
        this.p2_3.setPosition( cc.pAdd(cc.visibleRect.bottom, cc.p(0,  -55)));
        this.addChild(this.p2_3);

        this.p1_1 = new cc.Sprite(res.p1_1);
        this.p1_1.setOpacity(0);
        this.p1_1.setPosition( cc.pAdd(cc.visibleRect.bottom, cc.p(195, cc.winSize.height / 4 -15)));
        this.addChild(this.p1_1);

    },
    accelEvent: function (acc, event) {
        if (this.visible) {
            movArea(acc, this.accLayer);
        }
    },
    appear: function () {

        var bgAction = cc.sequence(new cc.FadeIn(1), cc.callFunc(function () {

            this.p2_1.act = cc.sequence(cc.delayTime(0.3),cc.moveTo(1,cc.pAdd(cc.visibleRect.bottom, cc.p(-this.p2_1.width / 2-5, cc.winSize.height / 4))));
            this.p2_1.runAction(this.p2_1.act);
            this.p2_2.act = cc.sequence(cc.delayTime(1.3),cc.spawn(new cc.FadeIn(1),cc.scaleTo(1,1)));
            this.p2_2.runAction(this.p2_2.act);
            this.p2_3.act = cc.sequence(cc.delayTime(2.3),cc.moveTo(1,cc.pAdd(cc.visibleRect.bottom, cc.p(0, cc.winSize.height / 4 -55))));
            this.p2_3.runAction(this.p2_3.act);
            this.p1_1.act = cc.sequence(cc.delayTime(3.3),new cc.FadeIn(1));
            this.p1_1.runAction(this.p1_1.act);

        }, this), cc.delayTime(0.8), cc.callFunc(function () {

            canChangePage = true;
        }, this));
        this.bg.runAction(bgAction);
    },
    disappear: function (callback, target) {

        var bgAction = cc.sequence(cc.spawn(new cc.FadeOut(0.5)), cc.callFunc(function () {


            this.p2_1.runAction(this.p2_1.act.reverse());
            this.p2_2.runAction(new cc.FadeOut(0.5));
            this.p2_3.runAction(this.p2_3.act.reverse());
            this.p1_1.runAction(this.p1_1.act.reverse());

        }, this), cc.delayTime(0.8), cc.callFunc(function () {

            if (target && callback) {
                callback.call(target);
            }
        }, this));
        this.bg.runAction(bgAction);
    }
});
var Layer3 = cc.Layer.extend({
    ctor: function () {
        this._super();
    },
    onEnter: function () {
        this._super();
        this.initUI();
//        this.appear();
    },
    initUI: function () {

        this.accLayer = new cc.Layer();
        this.accLayer.anchorX = 0;
        this.accLayer.anchorY = 0;
        this.accLayer.x = 0;
        this.accLayer.y = 0;
        this.addChild(this.accLayer);

        this.bg = new cc.Sprite(res.bg3);
        this.bg.scaleX = cc.winSize.width / this.bg.width;
        this.bg.scaleY = cc.winSize.height / this.bg.height;
        this.bg.setPosition(cc.visibleRect.center);
        this.bg.setOpacity(50);this.addChild(this.bg, 0);

        this.p3_1 = new cc.Sprite(res.p3_1);
        this.p3_1.setPosition( cc.pAdd(cc.visibleRect.topRight, cc.p(-250,this.p3_1.height/2)));
        this.addChild(this.p3_1);

        this.p3_2 = new cc.Sprite(res.p3_2);
        this.p3_2.scaleY = 3;
        this.p3_2.setOpacity(0);
        this.p3_2.setPosition( cc.pAdd(cc.visibleRect.topRight, cc.p(-250, -this.p3_1.height -30 - this.p3_2.height/2)));
        this.addChild(this.p3_2);

        this.p3_3 = new cc.Sprite(res.p3_3);
        this.p3_3.setPosition( cc.pAdd(cc.visibleRect.topRight, cc.p(-180, this.p3_3.height/2)));
        this.addChild(this.p3_3);

        this.p1_1 = new cc.Sprite(res.p1_1);
        this.p1_1.setOpacity(0);
        this.p1_1.setPosition( cc.pAdd(cc.visibleRect.topRight, cc.p(-120, -this.p3_3.height)));
        this.addChild(this.p1_1);


    },
    accelEvent: function (acc, event) {
        if (this.visible) {
            movArea(acc, this.accLayer);
        }
    },
    appear: function () {//20,50,80,100


        var action = cc.sequence(new cc.FadeIn(1), cc.callFunc(function () {

            this.p3_1.act = cc.sequence(cc.delayTime(0.3),cc.moveTo(1,cc.pAdd(cc.visibleRect.topRight, cc.p(-250,-this.p3_1.height/2 -30))));
            this.p3_1.runAction(this.p3_1.act);
            this.p3_2.act = cc.sequence(cc.delayTime(1.3),cc.spawn(new cc.FadeIn(1),cc.scaleTo(1,1)));
            this.p3_2.runAction(this.p3_2.act);
            this.p3_3.act = cc.sequence(cc.delayTime(2.3),cc.moveTo(1,cc.pAdd(cc.visibleRect.topRight, cc.p(-180, -this.p3_3.height/2 -50))));
            this.p3_3.runAction(this.p3_3.act);
            this.p1_1.act = cc.sequence(cc.delayTime(3.3),new cc.FadeIn(1));
            this.p1_1.runAction(this.p1_1.act);
        }, this), cc.delayTime(0.8), cc.callFunc(function () {

            canChangePage = true;
        }, this));
        this.bg.runAction(action);
    },
    disappear: function (callback, target) {

        var bgAction = cc.sequence(cc.spawn(new cc.FadeOut(0.5)), cc.callFunc(function () {


            this.p3_1.runAction(this.p3_1.act.reverse());
            this.p3_2.runAction(new cc.FadeOut(0.5));
            this.p3_3.runAction(this.p3_3.act.reverse());
            this.p1_1.runAction(this.p1_1.act.reverse());

        }, this), cc.delayTime(0.8), cc.callFunc(function () {

            if (target && callback) {
                callback.call(target);
            }
        }, this));
        this.bg.runAction(bgAction);
    }
});
var Layer4 = cc.Layer.extend({
    ctor: function () {
        this._super();
    },
    onEnter: function () {
        this._super();
        this.initUI();
//        this.appear();
    },
    initUI: function () {

        this.accLayer = new cc.Layer();
        this.accLayer.anchorX = 0;
        this.accLayer.anchorY = 0;
        this.accLayer.x = 0;
        this.accLayer.y = 0;
        this.addChild(this.accLayer);

        this.bg = new cc.Sprite(res.bg4);
        this.bg.scaleX = cc.winSize.width / this.bg.width;
        this.bg.scaleY = cc.winSize.height / this.bg.height;
        this.bg.setPosition(cc.visibleRect.center);
        this.bg.setOpacity(50);this.addChild(this.bg, 0);

        this.p4_1 = new cc.Sprite(res.p4_1);
        this.p4_1.setOpacity(0);
        this.p4_1.setPosition( cc.pAdd(cc.visibleRect.top, cc.p(-50,-300)));
        this.addChild(this.p4_1);

        this.p4_2 = new cc.Sprite(res.p4_2);
        //this.p4_2.scaleY = 3;
        this.p4_2.setOpacity(0);
        this.p4_2.setPosition( cc.pAdd(cc.visibleRect.top, cc.p(30, -200)));
        this.addChild(this.p4_2);

        this.p4_3 = new cc.Sprite(res.p4_3);
        this.p4_3.scale = 0;
        this.p4_3.setPosition( cc.pAdd(cc.visibleRect.top, cc.p(30, -405)));
        this.addChild(this.p4_3);

        this.p4_4 = new cc.Sprite(res.p4_4);
        this.p4_4.setOpacity(100);
        this.p4_4.setPosition( cc.pAdd(cc.visibleRect.top, cc.p(200, 100)));
        this.addChild(this.p4_4);

        this.p1_1 = new cc.Sprite(res.p1_1);
        this.p1_1.setOpacity(0);
        this.p1_1.setPosition( cc.pAdd(cc.visibleRect.top, cc.p(120, -410)));
        this.addChild(this.p1_1);


    },
    accelEvent: function (acc, event) {
        if (this.visible) {
            movArea(acc, this.accLayer);
        }
    },
    appear: function () {//20,50,80,100


        var action = cc.sequence(new cc.FadeIn(1), cc.callFunc(function () {
/**/
            this.p4_1.act = cc.sequence(cc.delayTime(0.3), new cc.FadeIn(1));
            this.p4_1.runAction(this.p4_1.act);
            this.p4_2.act = cc.sequence(cc.delayTime(1.3),new cc.FadeIn(1));
            this.p4_2.runAction(this.p4_2.act);
            this.p4_3.act = cc.sequence(cc.delayTime(2.3),cc.scaleTo(1,1));
            this.p4_3.runAction(this.p4_3.act);
            this.p4_4.act = cc.sequence(cc.delayTime(2.3),cc.moveTo(2,cc.pAdd(cc.visibleRect.topLeft, cc.p(-100,-cc.winSize.width/2 -100))),cc.moveTo(0,cc.pAdd(cc.visibleRect.top, cc.p(200, 100))));
            this.p4_4.runAction(this.p4_4.act);
            this.p1_1.act = cc.sequence(cc.delayTime(3.3),new cc.FadeIn(1));
            this.p1_1.runAction(this.p1_1.act);

        }, this), cc.delayTime(0.8), cc.callFunc(function () {

            canChangePage = true;
        }, this));
        this.bg.runAction(action);
    },
    disappear: function (callback, target) {

        var bgAction = cc.sequence(cc.spawn(new cc.FadeOut(0.5)), cc.callFunc(function () {


            this.p4_1.runAction(this.p4_1.act.reverse());
            this.p4_2.runAction(this.p4_2.act.reverse());
            this.p4_3.runAction(cc.scaleTo(1,0));
            this.p4_4.runAction(this.p4_4.act);
            this.p1_1.runAction(this.p1_1.act.reverse());

        }, this), cc.delayTime(0.8), cc.callFunc(function () {

            if (target && callback) {
                callback.call(target);
            }
        }, this));
        this.bg.runAction(bgAction);
    }
});
var Layer5 = cc.Layer.extend({
    ctor: function () {
        this._super();
    },
    onEnter: function () {
        this._super();
        this.initUI();
//        this.appear();
    },
    initUI: function () {

        this.accLayer = new cc.Layer();
        this.accLayer.anchorX = 0;
        this.accLayer.anchorY = 0;
        this.accLayer.x = 0;
        this.accLayer.y = 0;
        this.addChild(this.accLayer);

        this.bg = new cc.Sprite(res.bg5);
        this.bg.scaleX = cc.winSize.width / this.bg.width;
        this.bg.scaleY = cc.winSize.height / this.bg.height;
        this.bg.setPosition(cc.visibleRect.center);
        this.bg.setOpacity(50);this.addChild(this.bg, 0);

        this.p5_1 = new cc.Sprite(res.p5_1);
        this.p5_1.setOpacity(0);
        this.p5_1.setPosition( cc.pAdd(cc.visibleRect.top, cc.p(-50,-this.p5_1.height*2)));
        this.addChild(this.p5_1);

        this.p5_2 = new cc.Sprite(res.p5_2);
        this.p5_2.setOpacity(0);
        this.p5_2.setPosition( cc.pAdd(cc.visibleRect.top, cc.p(20,-this.p5_1.height*2)));
        this.addChild(this.p5_2);

        this.p5_3 = new cc.Sprite(res.p5_3);
        this.p5_3.setOpacity(0);
        this.p5_3.setPosition( cc.pAdd(cc.visibleRect.top, cc.p(20, -this.p5_1.height*2 - 37)));
        this.addChild(this.p5_3);

        this.p1_1 = new cc.Sprite(res.p1_1);
        this.p1_1.setOpacity(0);
        this.p1_1.setPosition( cc.pAdd(cc.visibleRect.top, cc.p(100,-this.p5_1.height*2 - 130)));
        this.addChild(this.p1_1);


    },
    accelEvent: function (acc, event) {
        if (this.visible) {
            movArea(acc, this.accLayer);
        }
    },
    appear: function () {//20,50,80,100


        var action = cc.sequence(new cc.FadeIn(1), cc.callFunc(function () {
/**/
            this.p5_1.act = cc.sequence(cc.delayTime(0.3),new cc.FadeIn(1));
            this.p5_1.runAction(this.p5_1.act);
            this.p5_2.act = cc.sequence(cc.delayTime(1.3),new cc.FadeIn(1));
            this.p5_2.runAction(this.p5_2.act);
            this.p5_3.act = cc.sequence(cc.delayTime(2.3),new cc.FadeIn(1));
            this.p5_3.runAction(this.p5_3.act);
            this.p1_1.act = cc.sequence(cc.delayTime(3.3),new cc.FadeIn(0.5));
            this.p1_1.runAction(this.p1_1.act);
        }, this), cc.delayTime(0.8), cc.callFunc(function () {

            canChangePage = true;
        }, this));
        this.bg.runAction(action);
    },
    disappear: function (callback, target) {

        var bgAction = cc.sequence(cc.spawn(new cc.FadeOut(0.5)), cc.callFunc(function () {


            this.p5_1.runAction(this.p5_1.act.reverse());
            this.p5_2.runAction(new cc.FadeOut(0.5));
            this.p5_3.runAction(this.p5_3.act.reverse());
            this.p1_1.runAction(this.p1_1.act.reverse());

        }, this), cc.delayTime(0.8), cc.callFunc(function () {

            if (target && callback) {
                callback.call(target);
            }
        }, this));
        this.bg.runAction(bgAction);
    }
});

var Layer6 = cc.Layer.extend({
    ctor: function () {
        this._super();
    },
    onEnter: function () {
        this._super();
        this.initUI();
//        this.appear();
    },
    initUI: function () {

        this.accLayer = new cc.Layer();
        this.accLayer.anchorX = 0;
        this.accLayer.anchorY = 0;
        this.accLayer.x = 0;
        this.accLayer.y = 0;
        this.addChild(this.accLayer);

        this.bg = new cc.Sprite(res.bg6);
        this.bg.scaleX = cc.winSize.width / this.bg.width;
        this.bg.scaleY = cc.winSize.height / this.bg.height;
        this.bg.setPosition(cc.visibleRect.center);
        this.bg.setOpacity(50);this.addChild(this.bg, 0);

        this.p6_1 = new cc.Sprite(res.p6_1);
        this.p6_1.setOpacity(0);
        this.p6_1.setPosition( cc.pAdd(cc.visibleRect.top, cc.p(-50,-this.p6_1.height*2)));
        this.addChild(this.p6_1);

        this.p6_2 = new cc.Sprite(res.p6_2);
        this.p6_2.setOpacity(0);
        this.p6_2.setPosition( cc.pAdd(cc.visibleRect.top, cc.p(20,-this.p6_1.height*2)));
        this.addChild(this.p6_2);

        this.p6_3 = new cc.Sprite(res.p6_3);
        this.p6_3.setOpacity(0);
        this.p6_3.setPosition( cc.pAdd(cc.visibleRect.top, cc.p(20, -this.p6_1.height*2 - 37)));
        this.addChild(this.p6_3);

        this.p1_1 = new cc.Sprite(res.p1_1);
        this.p1_1.setOpacity(0);
        this.p1_1.setPosition( cc.pAdd(cc.visibleRect.top, cc.p(100,-this.p6_1.height*2 - 130)));
        this.addChild(this.p1_1);


    },
    accelEvent: function (acc, event) {
        if (this.visible) {
            movArea(acc, this.accLayer);
        }
    },
    appear: function () {//20,50,80,100


        var action = cc.sequence(new cc.FadeIn(1), cc.callFunc(function () {
            /**/
            this.p6_1.act = cc.sequence(cc.delayTime(0.3),new cc.FadeIn(1));
            this.p6_1.runAction(this.p6_1.act);
            this.p6_2.act = cc.sequence(cc.delayTime(1.3),new cc.FadeIn(1));
            this.p6_2.runAction(this.p6_2.act);
            this.p6_3.act = cc.sequence(cc.delayTime(2.3),new cc.FadeIn(1));
            this.p6_3.runAction(this.p6_3.act);
            this.p1_1.act = cc.sequence(cc.delayTime(3.3),new cc.FadeIn(0.5));
            this.p1_1.runAction(this.p1_1.act);
        }, this), cc.delayTime(0.8), cc.callFunc(function () {

            canChangePage = true;
        }, this));
        this.bg.runAction(action);
    },
    disappear: function (callback, target) {

        var bgAction = cc.sequence(cc.spawn(new cc.FadeOut(0.5)), cc.callFunc(function () {


            this.p6_1.runAction(this.p6_1.act.reverse());
            this.p6_2.runAction(new cc.FadeOut(0.5));
            this.p6_3.runAction(this.p6_3.act.reverse());
            this.p1_1.runAction(this.p1_1.act.reverse());

        }, this), cc.delayTime(0.8), cc.callFunc(function () {

            if (target && callback) {
                callback.call(target);
            }
        }, this));
        this.bg.runAction(bgAction);
    }
});

var Layer7 = cc.Layer.extend({
    ctor: function () {
        this._super();
    },
    onEnter: function () {
        this._super();
        this.initUI();
//        this.appear();
    },
    initUI: function () {

        this.accLayer = new cc.Layer();
        this.accLayer.anchorX = 0;
        this.accLayer.anchorY = 0;
        this.accLayer.x = 0;
        this.accLayer.y = 0;
        this.addChild(this.accLayer);

        this.bg = new cc.Sprite(res.bg7);
        this.bg.scaleX = cc.winSize.width / this.bg.width;
        this.bg.scaleY = cc.winSize.height / this.bg.height;
        this.bg.setPosition(cc.visibleRect.center);
        this.bg.setOpacity(50);this.addChild(this.bg, 0);

        this.p7_1 = new cc.Sprite(res.p7_1);
        this.p7_1.setOpacity(0);
        this.p7_1.setPosition( cc.pAdd(cc.visibleRect.bottom, cc.p(0,-200)));
        this.addChild(this.p7_1);

        this.p7_2 = new cc.Sprite(res.p7_2);
        this.p7_2.setOpacity(0);
        this.p7_2.scale = 5;
        this.p7_2.setPosition( cc.pAdd(cc.visibleRect.bottom, cc.p(0,200)));
        this.addChild(this.p7_2);


        //this.p1_1 = new cc.Sprite(res.p1_1);
        //this.p1_1.setOpacity(0);
        //this.p1_1.setPosition( cc.pAdd(cc.visibleRect.top, cc.p(100,-this.p6_1.height*2 - 130)));
        //this.addChild(this.p1_1);


    },
    accelEvent: function (acc, event) {
        if (this.visible) {
            movArea(acc, this.accLayer);
        }
    },
    appear: function () {//20,50,80,100


        var action = cc.sequence(new cc.FadeIn(1), cc.callFunc(function () {
            /**/
            this.p7_1.act = cc.sequence(cc.delayTime(0.3),cc.spawn(new cc.FadeIn(1),cc.moveTo(1, cc.pAdd(cc.visibleRect.bottom, cc.p(0,230)))));
            this.p7_1.runAction(this.p7_1.act);
            this.p7_2.act = cc.sequence(cc.delayTime(0.3),cc.spawn(new cc.FadeIn(1),cc.moveTo(1, cc.pAdd(cc.visibleRect.bottom, cc.p(-60,60))),cc.scaleTo(1,1)));
            this.p7_2.runAction(this.p7_2.act);


        }, this), cc.delayTime(0.8), cc.callFunc(function () {

            canChangePage = true;
        }, this));
        this.bg.runAction(action);
    },
    disappear: function (callback, target) {

        var bgAction = cc.sequence(cc.spawn(new cc.FadeOut(0.5)), cc.callFunc(function () {


            this.p7_1.runAction(new cc.FadeOut(0.5));
            this.p7_2.runAction(new cc.FadeOut(0.5));

        }, this), cc.delayTime(0.8), cc.callFunc(function () {

            if (target && callback) {
                callback.call(target);
            }
        }, this));
        this.bg.runAction(bgAction);
    }
});


var Layer8 = cc.Layer.extend({
    ctor: function () {
        this._super();
    },
    onEnter: function () {
        this._super();
        this.initUI();
//        this.appear();
    },
    initUI: function () {

        this.accLayer = new cc.Layer();
        this.accLayer.anchorX = 0;
        this.accLayer.anchorY = 0;
        this.accLayer.x = 0;
        this.accLayer.y = 0;
        this.addChild(this.accLayer);

        this.bg = new cc.Sprite(res.bg8);
        this.bg.scaleX = cc.winSize.width / this.bg.width;
        this.bg.scaleY = cc.winSize.height / this.bg.height;
        this.bg.setPosition(cc.visibleRect.center);
        this.bg.setOpacity(50);this.addChild(this.bg, 0);

        this.p8_1 = new cc.Sprite(res.p8_1);
        this.p8_1.setOpacity(0);
        this.p8_1.setPosition( cc.pAdd(cc.visibleRect.top, cc.p(-50,-this.p8_1.height)));
        this.addChild(this.p8_1);

        this.p8_2 = new cc.Sprite(res.p8_2);
        this.p8_2.setOpacity(0);
        this.p8_2.setPosition( cc.pAdd(cc.visibleRect.top, cc.p(10,-this.p8_1.height - 100)));
        this.addChild(this.p8_2);

        this.p8_3 = new cc.Sprite(res.p8_3);
        this.p8_3.setOpacity(50);
        this.p8_3.scale = 8;
        this.p8_3.setPosition( cc.pAdd(cc.visibleRect.top, cc.p(10, -this.p8_1.height - 130)));
        this.addChild(this.p8_3);

        this.p1_1 = new cc.Sprite(res.p1_1);
        this.p1_1.setOpacity(0);
        this.p1_1.setPosition( cc.pAdd(cc.visibleRect.top, cc.p(50,-this.p8_1.height - 180)));
        this.addChild(this.p1_1);


    },
    accelEvent: function (acc, event) {
        if (this.visible) {
            movArea(acc, this.accLayer);
        }
    },
    appear: function () {//20,50,80,100


        var action = cc.sequence(new cc.FadeIn(1), cc.callFunc(function () {
            /**/
            this.p8_1.act = cc.sequence(cc.delayTime(0.3),new cc.FadeIn(1));
            this.p8_1.runAction(this.p8_1.act);
            this.p8_2.act = cc.sequence(cc.delayTime(1.3),new cc.FadeIn(1));
            this.p8_2.runAction(this.p8_2.act);
            this.p8_3.act = cc.sequence(cc.delayTime(2.3),cc.spawn(new cc.FadeIn(1),cc.scaleTo(1,1)));
            this.p8_3.runAction(this.p8_3.act);
            this.p1_1.act = cc.sequence(cc.delayTime(3.3),new cc.FadeIn(0.5));
            this.p1_1.runAction(this.p1_1.act);
        }, this), cc.delayTime(0.8), cc.callFunc(function () {

            canChangePage = true;
        }, this));
        this.bg.runAction(action);
    },
    disappear: function (callback, target) {

        var bgAction = cc.sequence(cc.spawn(new cc.FadeOut(0.5)), cc.callFunc(function () {


            this.p8_1.runAction(new cc.FadeOut(0.5));
            this.p8_2.runAction(new cc.FadeOut(0.5));
            this.p8_3.runAction(new cc.FadeOut(0.5));
            this.p1_1.runAction(new cc.FadeOut(0.5));

        }, this), cc.delayTime(0.8), cc.callFunc(function () {

            if (target && callback) {
                callback.call(target);
            }
        }, this));
        this.bg.runAction(bgAction);
    }
});


var Layer9 = cc.Layer.extend({
    ctor: function () {
        this._super();
    },
    onEnter: function () {
        this._super();
        this.initUI();
//        this.appear();
    },
    initUI: function () {

        this.accLayer = new cc.Layer();
        this.accLayer.anchorX = 0;
        this.accLayer.anchorY = 0;
        this.accLayer.x = 0;
        this.accLayer.y = 0;
        this.addChild(this.accLayer);

        this.bg = new cc.Sprite(res.bg9);
        this.bg.scaleX = cc.winSize.width / this.bg.width;
        this.bg.scaleY = cc.winSize.height / this.bg.height;
        this.bg.setPosition(cc.visibleRect.center);
        this.bg.setOpacity(50);this.addChild(this.bg, 0);



    },
    accelEvent: function (acc, event) {
        if (this.visible) {
            movArea(acc, this.accLayer);
        }
    },
    appear: function () {//20,50,80,100


        var action = cc.sequence(new cc.FadeIn(1), cc.callFunc(function () {
            /**/

        }, this), cc.delayTime(0.8), cc.callFunc(function () {

            canChangePage = true;
        }, this));
        this.bg.runAction(action);
    },
    disappear: function (callback, target) {

        var bgAction = cc.sequence(cc.spawn(new cc.FadeOut(0.5)), cc.callFunc(function () {


        }, this), cc.delayTime(0.8), cc.callFunc(function () {

            if (target && callback) {
                callback.call(target);
            }
        }, this));
        this.bg.runAction(bgAction);
    }
});



var Layer10 = cc.Layer.extend({
    ctor: function () {
        this._super();
    },
    onEnter: function () {
        this._super();
        this.initUI();
//        this.appear();
    },
    initUI: function () {

        this.accLayer = new cc.Layer();
        this.accLayer.anchorX = 0;
        this.accLayer.anchorY = 0;
        this.accLayer.x = 0;
        this.accLayer.y = 0;
        this.addChild(this.accLayer);

        this.bg = new cc.Sprite(res.bg10);
        this.bg.scaleX = cc.winSize.width / this.bg.width;
        this.bg.scaleY = cc.winSize.height / this.bg.height;
        this.bg.setPosition(cc.visibleRect.center);
        this.bg.setOpacity(50);this.addChild(this.bg, 0);



    },
    accelEvent: function (acc, event) {
        if (this.visible) {
            movArea(acc, this.accLayer);
        }
    },
    appear: function () {//20,50,80,100


        var action = cc.sequence(new cc.FadeIn(1), cc.callFunc(function () {
            /**/

        }, this), cc.delayTime(0.8), cc.callFunc(function () {

            canChangePage = true;
        }, this));
        this.bg.runAction(action);
    },
    disappear: function (callback, target) {

        var bgAction = cc.sequence(cc.spawn(new cc.FadeOut(0.5)), cc.callFunc(function () {


        }, this), cc.delayTime(0.8), cc.callFunc(function () {

            if (target && callback) {
                callback.call(target);
            }
        }, this));
        this.bg.runAction(bgAction);
    }
});














var movArea = function (acc, node) {
    var curx = node.x + 20 * acc.x;
    var cury = node.y + 20 * acc.y;
    node.x = Math.abs(curx) < 7 ? curx : node.x;
    node.y = Math.abs(cury) < 7 ? cury : node.y;

}
/************************************************************************************************************************************/
var reclick = true;
var isSuccess = false;
var musicPlayStatus = true;
var getById = function (id) {
    return document.getElementById(id);
}
var moveIn = function () {
    var obj = getById();
}
function hasClass(ele, cls) {
    var result = ele && ele.className && (ele.className.search(new RegExp('(\\s|^)' + cls + '(\\s|$)')) != -1);
    return !!result;
}

function addClass(ele, cls) {
    if (!hasClass(ele, cls) && ele)
        ele.className += " " + cls;
}

function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
    }
}

window["onOkClick"] = function () {
    var alertItem = getById("alertItem");
    removeClass(alertItem, "alertAnimIn");
    addClass(alertItem, "alertAnimOut");
    setTimeout(function () {
        addClass(alertItem, "hide");
        if (isSuccess) {
            isSuccess = false;
            window["onCloseClick"]();
            if (curScene) {
                curScene.changePage(++curScene.currentIndex, true);
            }
        }
    }, 280);
}
var initMusic = function () {
    var audio = getById("myAudio");
    //audio.src = "res/bg.mp3";
}
var playMusic = function (status) {
    var audio = getById("myAudio");
    if (status) {
        if (audio.paused) {
            //audio.play();
            musicPlayStatus = true;
        }
    } else {
        if (!audio.paused) {
            audio.pause();
            musicPlayStatus = false;
        }
    }
}


function log(s) {
    console.log(s);
}