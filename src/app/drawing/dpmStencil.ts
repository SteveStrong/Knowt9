
import { Tools, Action, foStencilLibrary, RuntimeType, foGlyph2D } from '../foundry/public_api';
import { foObject, Lifecycle, globalWorkspace } from '../foundry/public_api';
import { dpmText2DCircle, dpmText2DHex, dpmText2DRhombus, dpmText2DBubble, dpmShape2D, dpmShape1D, dpmText2D, dpmImage2D, dpmCommonService } from './dpmCore';

import { TweenLite, Back, Power0 } from 'gsap';

export let dpmStencil: foStencilLibrary = new foStencilLibrary();

dpmStencil.define<dpmText2D>('dpmRectangleShape', dpmText2D, {
  fontSize: 12,
  color: 'white',
  opacity: 1.0,
  background: 'purple',
  text: '?',
  width: 125,
  height: 75
});

dpmStencil.define<dpmText2DCircle>('dpmCircleShape', dpmText2DCircle, {
  fontSize: 12,
  color: 'white',
  opacity: 1.0,
  background: 'purple',
  text: '?',
  width: 125,
  height: 125
});




dpmStencil.define<dpmText2DHex>('dpmHexShape', dpmText2DHex, {
  fontSize: 15,
  color: 'white',
  background: 'orange',
  text: '?',
  width: 150,
  height: 100
});



dpmStencil.define<dpmText2DRhombus>('dpmRhombusShape', dpmText2DRhombus, {
  fontSize: 15,
  color: 'white',
  background: 'green',
  text: '?',
  width: 125,
  height: 125
});

dpmStencil.define<dpmText2DBubble>('dpmBubbleShape', dpmText2DBubble, {
  fontSize: 20,
  color: 'yellow',
  background: 'purple',
  text: '?',
  width: 200,
  height: 200
});

dpmStencil.define<dpmShape1D>('dpmLink', dpmShape1D, {
  color: 'black',
  height: 3,
  radius: 75,
});


dpmStencil.define<dpmText2D>('dpmTextBlock', dpmText2D, {
  fontSize: 15,
  color: 'black',
  background: 'white',
  text: '?',
  width: 50,
  height: 50
});


dpmStencil.factory<foGlyph2D>('dpmConnection', function(spec?: any, parent?: any) {
  let factory = this.myName;
  let properties = Tools.union({factory}, spec);
  let know = dpmStencil.find('dpmLink');
  let subKnow = dpmStencil.find('dpmTextBlock');

  const shape = know.makeComponent(parent, properties);

  const list = [
    { x: 0.5 * shape.width, y: 2.0 * shape.height },
  ];


  const hSpec = {
    x: function() {
      if ( this.myParent() ) {
        let context = this.myParent();
        return context.center().cX + 100;
      }
      return 0.0;
    },
    y: function() {
      if ( this.myParent() ) {
        let context = this.myParent();
        return context.center().cY;
      }
      return 0.0;
    },
    color: 'blue', //shape.color,
    height:  0.5 * shape.height,
    width: 0.5 * shape.width,
    fontSize: 40,
    isHitable: false,
    text: function() {
      if ( this.myParent() ) {
        let context = this.myParent(); //.context;
        return context ? `${context.text}` : '';
      }
      return '';
    }
  };



  // const children = list.map(item => {
  //   const handle = subKnow
  //     .makeComponent(shape, hSpec)
  //     .show();
  //   handle.edge = item;
  //   return handle;
  // });

  return shape;
});

dpmStencil.factory<foGlyph2D>('dpmDocument', function(
  spec?: any,
  parent?: any
) {
  let factory = this.myName;
  let properties: any = Tools.union({ factory }, spec);

  let know = dpmStencil.find(spec.shape);
  know = know || dpmStencil.find('dpmCircleShape');

  const shape = know.makeComponent(parent, properties);
  // shape.opacity = .3;

  const list = [
    { x: 0, y: 0 },
    { x: shape.width, y: 0 }
    // { x: shape.width, y: shape.height },
    // { x: 0, y: shape.height }
  ];

  const hSpec = {
    x: shape.pinX(),
    y: shape.pinY(),
    color: shape.color,
    height:  0.5 * shape.height,
    width: 0.5 * shape.width,
    isHitable: false,
    text: function() {
      if ( this.myParent() ) {
        let context = this.myParent().context;
        return context ? `${context.subText[this.index]}` : '';
      }
      return '';
    }
  };

  // const children = list.map(item => {
  //   const handle = know
  //     .makeComponent(shape, hSpec)
  //     .hide();
  //   handle.edge = item;
  //   return handle;
  // });

  // function OpenClose(value: boolean) {
  //   children.forEach(child => {
  //     let { x, y } = value ? child.edge : hSpec;
  //     dpmCommonService.easeToLocation(child, x, y, value, 0.2, Power0.easeNone);
  //   });
  // }

  // shape.setupHoverEnterDraw = () => {
  //   const postDraw = (ctx: CanvasRenderingContext2D): void => {
  //     OpenClose(true);
  //     shape.postDraw = undefined;
  //   };
  //   shape.postDraw = postDraw;
  // };

  // shape.setupHoverExitDraw = () => {
  //   const postDraw = (ctx: CanvasRenderingContext2D): void => {
  //     OpenClose(false);
  //     shape.postDraw = undefined;
  //   };
  //   shape.postDraw = postDraw;
  // };


  return shape;
});


