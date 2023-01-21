import {Component,OnInit,Input,AfterViewInit,ViewChild,ElementRef} from '@angular/core';

import { foHandle2D, foGlyph2D, cPoint2D, foCollection, foPage, foObject, Screen2D, Action, RuntimeType } from '../foundry/public_api';

export class dpmPage extends foPage implements AfterViewInit {
  @ViewChild('canvas', {static: false}) canvasRef: ElementRef;
  @Input()
  public pageWidth = 1800;
  @Input()
  public pageHeight = 1000;



  message: Array<any> = [];
  screen2D: Screen2D = new Screen2D();

  constructor(
    properties?: any,
    subcomponents?: Array<foGlyph2D>,
    parent?: foObject
  ) {
    super(properties, subcomponents, parent);
  }

  public ngAfterViewInit() {
    this.width = this.pageWidth;
    this.height = this.pageHeight;

    this.screen2D.setRoot(
      this.canvasRef.nativeElement,
      this.pageWidth,
      this.pageHeight
    );


    this.screen2D.render = (ctx: CanvasRenderingContext2D) => {
      this.render(ctx);
    };

    this.screen2D.go();
  }

  resizeRoot(width, height){
    this.width = this.pageWidth = width;
    this.height = this.pageHeight = height;

    this.screen2D.resizeRoot(
      this.pageWidth,
      this.pageHeight
    );
  }

  doClear() {
    this.clearPage();
    this.message = [];
  }


  doPageEventSetup() {
    this.addEventHooks();

    this.onMouseLocationChanged = (
      loc: cPoint2D,
      state: string,
      keys?: any
    ): void => {
      this.mouseLoc = loc;
      this.mouseLoc.state = state;
      this.mouseLoc.keys = keys;
    };
  }

  addEventHooks() {
    this.onItemHoverEnter = (
      loc: cPoint2D,
      shape: foGlyph2D,
      keys?: any
    ): void => {
      this.message = [];
      this.message.push(`Hover (${loc.x},${loc.y}) Enter`);
      shape && this.message.push(shape.globalToLocal(loc.x, loc.y));
      this.message.push(shape);

      if (shape) {
        shape.drawHover = shape.drawHighlight;
        shape.setupHoverEnterDraw && shape.setupHoverEnterDraw();
      }
    };

    this.onItemHoverExit = (
      loc: cPoint2D,
      shape: foGlyph2D,
      keys?: any
    ): void => {
      this.message = [];
      this.message.push(`Hover (${loc.x},${loc.y}) Exit`);
      shape && this.message.push(shape.globalToLocal(loc.x, loc.y));
      this.message.push(shape);

      if (shape) {
        shape.drawHover = undefined;
        shape.setupHoverExitDraw && shape.setupHoverExitDraw();
      }
    };

    this.onItemOverlapEnter = (
      loc: cPoint2D,
      shape: foGlyph2D,
      shapeUnder: foGlyph2D,
      keys?: any
    ): void => {
      this.message = [];
      this.message.push(`Overlap (${loc.x},${loc.y}) Enter`);
      shape && this.message.push(shape.globalToLocal(loc.x, loc.y));
      this.message.push(shape);

      if (shapeUnder) {
        shapeUnder.drawHover = shape.drawHighlightOverlap;
        shape.setupOverlapEnterDraw && shape.setupOverlapEnterDraw();
      }
    };

    this.onItemOverlapExit = (
      loc: cPoint2D,
      shape: foGlyph2D,
      shapeUnder: foGlyph2D,
      keys?: any
    ): void => {
      this.message = [];
      this.message.push(`Overlap (${loc.x},${loc.y}) Exit`);
      shape && this.message.push(shape.globalToLocal(loc.x, loc.y));
      this.message.push(shape);

      if (shapeUnder) {
        shapeUnder.drawHover = undefined;
        shape.setupOverlapExitDraw && shape.setupOverlapExitDraw();
      }
    };

    this.onHandleHoverEnter = (
      loc: cPoint2D,
      handle: foHandle2D,
      keys?: any
    ): void => {
      // let shape = handle.myParentGlyph();

      this.message = [];
      // this.message.push(`Hover (${loc.x},${loc.y}) Enter  ${shape.myName}`);
      // shape && this.message.push(shape.globalToLocal(loc.x, loc.y));
      // this.message.push(shape);
      this.message.push(
        `Handle Hover (${loc.x},${loc.y}) Enter ${handle && handle.myName}`
      );
      handle && this.message.push(handle.globalToLocal(loc.x, loc.y));
      // this.message.push(handle);
    };

    this.onTrackHandles = (
      loc: cPoint2D,
      handles: foCollection<foHandle2D>,
      keys?: any
    ): void => {
      this.message = [];
      handles.forEach(handle => {
        // if (handle.hitTest(loc)) {
        // foObject.beep();
        // }
        this.message.push(
          `onTrackHandles (${loc.x},${loc.y}) Move ${handle && handle.myName}`
        );
        handle && this.message.push(handle.globalToLocal(loc.x, loc.y));
      });
    };

    this.onHandleMoving = (
      loc: cPoint2D,
      handle: foHandle2D,
      keys?: any
    ): void => {
      // let shape = handle.myParentGlyph();

      this.message = [];
      // this.message.push(`Hover (${loc.x},${loc.y}) Move  ${shape.myName}`);
      // shape && this.message.push(shape.globalToLocal(loc.x, loc.y));
      // this.message.push(shape);
      this.message.push(
        `Handle Hover (${loc.x},${loc.y}) Move ${handle && handle.myName}`
      );
      handle && this.message.push(handle.globalToLocal(loc.x, loc.y));
      // this.message.push(handle);
    };

    this.onHandleHoverExit = (
      loc: cPoint2D,
      handle: foHandle2D,
      keys?: any
    ): void => {
      // let shape = handle.myParentGlyph();

      this.message = [];
      // this.message.push(`Hover (${loc.x},${loc.y}) Exit ${shape.myName}`);
      // shape && this.message.push(shape.globalToLocal(loc.x, loc.y));
      // this.message.push(shape);
      this.message.push(
        `Handle Hover (${loc.x},${loc.y}) Exit ${handle && handle.myName}`
      );
      handle && this.message.push(handle.globalToLocal(loc.x, loc.y));
      // this.message.push(handle);
    };
  }
}
