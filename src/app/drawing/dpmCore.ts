import {
  foCollection,
  foPage,
  foHandle2D,
  cPoint2D,
  foGlyph
} from '../foundry/public_api';
import { cMargin, Screen2D, RuntimeType } from '../foundry/public_api';

import {
  Tools,
  foStencilLibrary,
  foGlyph2D,
  foConnectionPoint2D
} from '../foundry/public_api';
import {
  foShape2D,
  shape2DNames,
  foShape1D,
  foText2D,
  foImage2D
} from '../foundry/public_api';
import { foObject, Lifecycle, globalWorkspace } from '../foundry/public_api';

import { TweenMax, Power2, TimelineLite } from 'gsap';
import { TweenLite, Back } from 'gsap';

export class dpmCommonService {
  public static drawSquare(ctx: CanvasRenderingContext2D, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x1, y2);
    ctx.closePath();
    ctx.fill();
  }

  public static drawCircle(
    ctx: CanvasRenderingContext2D,
    x1,
    y1,
    radius: number = 100
  ) {
    ctx.beginPath();
    ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }

  public static openNewWindow(path: string, factor: number = 0.5) {
    const target = window.location.origin.toString() + path;
    const size = `width=${factor * window.innerWidth},height=${factor *
      window.innerHeight}`;
    window.open(target, 'newwindow', size);
  }

  public static deHydrate(obj: any, context?: any, deep: boolean = true) {
    const { from, to } = obj;
    const concept = obj.createdFrom && obj.createdFrom();
    const data = {
      myName: obj.myName,
      myGuid: obj.myGuid,
      concept: concept.myName,
      factory: obj.factory,
      text: obj.text,
      x: obj.x,
      y: obj.y,
      from: from,
      to: to,
      subcomponents: []
    };

    if (deep && obj.nodes.count) {
      data.subcomponents = obj.nodes.map(item => {
        const child = dpmCommonService.deHydrate(item, context, deep);
        return child;
      });
    } else {
      delete data.subcomponents;
    }
    return data;
  }

  public static easeToLocation(
    shape: foGlyph,
    x: number,
    y: number,
    show: boolean,
    time: number = 0.5,
    ease: any = Back.easeInOut
  ) {
    shape.isVisible = true;
    TweenLite.to(shape, time, {
      x: x,
      y: y,
      ease: ease
    })
      .eventCallback('onUpdate', () => {
        shape.move();
      })
      .eventCallback('onComplete', () => {
        shape.dropAt(x, y);
        shape.isVisible = show;
      });

    return shape;
  }
}

// ### foundation classes for mind map ###
export class dpmShape1D extends foShape1D {
  radius: number = 0;
  text: string = '';

  public drawHandles(ctx: CanvasRenderingContext2D) {}
  public drawConnectionPoints(ctx: CanvasRenderingContext2D) {}
  public drawPin(ctx: CanvasRenderingContext2D) {}

  public isDragable = (): boolean => {
    return false;
  }

  public drawOutline(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    // ctx.setLineDash([15, 5]);

    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = 'cyan';
    ctx.fillRect(0, 0, this.width, 2 * this.height);
    ctx.restore();

    ctx.lineWidth = this.thickness || 8;

    let { x: x1, y: y1 } = this.globalToLocalPoint(this.begin());
    let { x: x2, y: y2 } = this.globalToLocalPoint(this.end());

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    this.drawStart(ctx);
    this.drawEnd(ctx);

    ctx.save();

    ctx.textBaseline = 'bottom';
    ctx.font = '30px Georgia';
    this.drawText(ctx, this.text, 0.33 * this.width, 2.5 * this.height);
    this.drawText(ctx, this.text, 0.66 * this.width, 2.5 * this.height);
    ctx.restore();
  }

  public drawArrowHead(ctx: CanvasRenderingContext2D, x: number, size: number) {
    let length = 2 * size;
    let cx = x - length / 2;
    let cy = this.height / 2;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy + size);
    ctx.lineTo(cx + length, cy);
    ctx.lineTo(cx, cy - size);
    ctx.moveTo(cx, cy);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }

  public draw = (ctx: CanvasRenderingContext2D): void => {
    // let { x: x1, y: y1 } = this.globalToLocalPoint(this.begin());
    // let { x: x2, y: y2 } = this.globalToLocalPoint(this.end());
    // let center = this.pinLocation();

    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;

    // draw rectangle so things scale on mouse wheel zoom
    // using radius to put line at edge of circle
    ctx.fillRect(this.radius, 0, this.width - 2 * this.radius, this.height);

    // ctx.lineWidth = this.thickness || 1;
    // ctx.beginPath();
    // ctx.moveTo(x1, y1);
    // ctx.lineTo(x2, y2);
    // ctx.stroke();
    // ctx.closePath();

    // this.drawArrowHead(ctx, 0.25 * this.width);

    //SRS
    //this.drawArrowHead(ctx, 0.42 * this.width, 2.0 * this.height);

    // thdrawTextad(ctx, 0.50 * this.width, 2.0 * this.height);
    // this.drawArrowHead(ctx, 0.75 * this.width);

    // ctx.textAlign = "left" || "right" || "center" || "start" || "end";

    // ctx.textBaseline = "top" || "hanging" || "middle" || "alphabetic" || "ideographic" || "bottom";

    //   ctx.save();
    //  ctx.textAlign = 'center';
    //  ctx.textBaseline = 'bottom';
    //  ctx.font = '30px Georgia';
    // //  ctx.fillStyle = 'white';
    // //  ctx.fillRect(0.33 * this.width, 2.5 * this.height, 100, 100);
    // //  ctx.fillStyle = 'black';
    //  this.drawText(ctx, this.text, 0.33 * this.width, 2.5 * this.height);
    //  ctx.restore();
  }

  public drawSelected = (ctx: CanvasRenderingContext2D): void => {
    ctx.save();
    ctx.fillStyle = 'red';
    let height = this.height * 2;
    ctx.fillRect(
      this.radius,
      -height / 2,
      this.width - 2 * this.radius,
      height
    );
    //this.drawArrowHead(ctx, 0.50 * this.width, 2.0 * height);

    //  ctx.textBaseline = 'bottom';
    //  ctx.font = '30px Georgia';
    //  this.drawText(ctx, this.text, 0.33 * this.width, 2.5 * this.height);

    ctx.restore();
  }

  public deHydrate(context?: any, deep: boolean = true) {
    return dpmCommonService.deHydrate(this, context, deep);
  }
}
RuntimeType.define(dpmShape1D);

export class dpmImage2D extends foImage2D {
  public drawHandles(ctx: CanvasRenderingContext2D) {}
  public drawConnectionPoints(ctx: CanvasRenderingContext2D) {}
  public drawPin(ctx: CanvasRenderingContext2D) {}
}
RuntimeType.define(dpmImage2D);

export class dpmShape2D extends foShape2D {
  // pinX = (): number => 0.5 * this.width;
  // pinY = (): number => 0.5 * this.height;
  public drawHandles(ctx: CanvasRenderingContext2D) {}
  public drawConnectionPoints(ctx: CanvasRenderingContext2D) {}
  public drawPin(ctx: CanvasRenderingContext2D) {}

  public drawSelected = (ctx: CanvasRenderingContext2D): void => {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 8;
    this.drawOutline(ctx);
    //this.doOrbit(ctx);
  }

  public deHydrate(context?: any, deep: boolean = true) {
    return dpmCommonService.deHydrate(this, context, deep);
  }
}
RuntimeType.define(dpmShape2D);

export class dpmText2D extends foText2D {
  // pinX = (): number => 0.5 * this.width;
  // pinY = (): number => 0.5 * this.height;
  public drawHandles(ctx: CanvasRenderingContext2D) {}
  public drawConnectionPoints(ctx: CanvasRenderingContext2D) {}
  public drawPin(ctx: CanvasRenderingContext2D) {}

  public drawSelected = (ctx: CanvasRenderingContext2D): void => {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 8;
    this.drawOutline(ctx);
    this.doOrbit(ctx);
  }
  public maxTextWidth() {
    return this.width;
  }

  orbit: number = 0;

  doOrbit = (ctx: CanvasRenderingContext2D): void => {
    const radius = this.width * 0.65;
    const rads = this.orbit * foGlyph2D.DEG_TO_RAD;
    const x1 = this.pinX() + radius * Math.cos(rads);
    const y1 = this.pinY() + radius * Math.sin(rads);
    const x2 = this.pinX() - radius * Math.cos(rads);
    const y2 = this.pinY() - radius * Math.sin(rads);

    this.orbit += 3.0;
    if (this.orbit > 360) {
      this.orbit = 0;
    }

    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'red';
    ctx.lineWidth = 10;
    dpmCommonService.drawCircle(ctx, x1, y1, 5);
    dpmCommonService.drawCircle(ctx, x2, y2, 5);
    ctx.restore();
  }

  public deHydrate(context?: any, deep: boolean = true) {
    return dpmCommonService.deHydrate(this, context, deep);
  }
}
RuntimeType.define(dpmText2D);
// ### custom classes for mind map

export class dpmText2DCircle extends dpmText2D {
  public collisionRadius: () => number = () => {
    return (0.25 * this.width) / 2;
  }

  public chargeRadius: () => number = () => {
    return (0.25 * this.width) / 2;
  }

  public drawOutline(ctx: CanvasRenderingContext2D) {
    let center = this.pinLocation();
    ctx.beginPath();
    ctx.setLineDash([15, 5]);
    ctx.arc(center.x, center.y, this.width / 2, 0, 2 * Math.PI);
    ctx.stroke();
  }

  public drawBackground = (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = this.background;
    let center = this.pinLocation();
    ctx.beginPath();
    ctx.arc(center.x, center.y, this.width / 2, 0, 2 * Math.PI);
    ctx.fill();
  }
}
RuntimeType.define(dpmText2DCircle);

export class dpmText2DBubble extends dpmText2D {
  protected _closed: boolean = true;
  get isClosed(): boolean {
    return this._closed;
  }
  set isClosed(value: boolean) {
    this._closed = value;
  }

  public maxTextWidth() {
    return this.isClosed ? this.width : 3 * this.width;
  }

  public drawBubble(ctx: CanvasRenderingContext2D) {
    let center = this.pinLocation();
    const length = (this.isClosed ? 0 : this.width) / 2;

    ctx.beginPath();
    ctx.moveTo(center.x, 0);
    ctx.lineTo(center.x + length, 0);
    ctx.arc(
      center.x + length,
      center.y,
      this.height / 2,
      1.5 * Math.PI,
      0.5 * Math.PI
    );
    ctx.lineTo(center.x + length, this.height);
    ctx.lineTo(center.x - length, this.height);
    ctx.arc(
      center.x - length,
      center.y,
      this.height / 2,
      0.5 * Math.PI,
      1.5 * Math.PI
    );
    ctx.lineTo(center.x, 0);
  }

  public drawOutline(ctx: CanvasRenderingContext2D) {
    let center = this.pinLocation();
    ctx.beginPath();
    ctx.setLineDash([15, 5]);
    this.drawBubble(ctx);
    ctx.stroke();
    ctx.closePath();
  }

  public drawBackground = (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = this.background;
    this.drawBubble(ctx);
    ctx.fill();
    ctx.closePath();
  }
}
RuntimeType.define(dpmText2DBubble);

export class dpmText2DHex extends dpmText2D {
  drawShape(ctx: CanvasRenderingContext2D) {
    const poly = [
      0,
      0,
      this.width,
      0,
      1.1 * this.width,
      0.5 * this.height,
      this.width,
      this.height,
      0,
      this.height,
      -0.1 * this.width,
      0.5 * this.height,
      0,
      0
    ];

    ctx.moveTo(poly[0], poly[1]);
    for (let item = 2; item < poly.length - 1; item += 2) {
      ctx.lineTo(poly[item], poly[item + 1]);
    }
  }
  public drawSelected = (ctx: CanvasRenderingContext2D): void => {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 8;
    this.drawOutline(ctx);
  }

  public drawOutline(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.setLineDash([15, 5]);

    this.drawShape(ctx);

    ctx.stroke();
    ctx.closePath();
  }

  public drawBackground = (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = this.background;

    ctx.beginPath();
    this.drawShape(ctx);
    ctx.fill();
    ctx.closePath();
  }
}
RuntimeType.define(dpmText2DHex);

export class dpmText2DRhombus extends dpmText2DHex {
  drawShape(ctx: CanvasRenderingContext2D) {
    const poly = [
      0.25 * this.width,
      0,
      0.75 * this.width,
      0,
      1.1 * this.width,
      0.5 * this.height,
      0.75 * this.width,
      this.height,
      0.25 * this.width,
      this.height,
      -0.1 * this.width,
      0.5 * this.height,
      0.25 * this.width,
      0
    ];

    ctx.moveTo(poly[0], poly[1]);
    for (let item = 2; item < poly.length - 1; item += 2) {
      ctx.lineTo(poly[item], poly[item + 1]);
    }
  }
}
RuntimeType.define(dpmText2DRhombus);
