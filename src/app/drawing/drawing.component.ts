import { Component, OnInit, Input,AfterViewInit,ViewChild,HostListener,ElementRef} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { saveAs } from 'file-saver';

// https://stackblitz.com/edit/canvas-example?file=app%2Fapp.component.ts

import { ForceDirectedGraph } from './force-directed-graph';

import { Lifecycle } from '../foundry/models/foLifecycle';
import { globalWorkspace } from '../foundry/models/foWorkspace.model';

import { foShape2D,cPoint2D,shape2DNames,foWorkspace,foSelectionBuffer,foPage,foModel,foNode,foCollection} from '../foundry/public_api';

import { Toast, EmitterService } from '../shared/emitter.service';

import { dpmPage } from './dpmPage';
import { dpmStencil } from './dpmStencil';

import { Tools, Action, foStencilLibrary, RuntimeType, foGlyph2D } from '../foundry/public_api';
import { dpmText2DCircle, dpmText2DHex, dpmText2DRhombus, dpmText2DBubble, dpmShape2D, dpmShape1D, dpmText2D, dpmImage2D, dpmCommonService } from './dpmCore';


@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.scss']
})
export class DrawingComponent extends dpmPage implements OnInit, AfterViewInit {
  backgroundImage = new Image(); // Using optional size for image
  workspace: foWorkspace = globalWorkspace;
  model: foModel;
  data: foCollection<any>;

  graph: ForceDirectedGraph;

  myStencil: foStencilLibrary = new foStencilLibrary();


  constructor() { 
    super();

    EmitterService.processCommands(this);

    // EmitterService.registerCommand(this, 'Redraw', ( args, source ) => {
    //   this.clearPage();
      
    //   const force = mapper.renderElasticGraphDataToPage(dpmStencil, this, this.data, source);
    //   this.autoLayout(force);
    // });

    this.backgroundImage.src = '/assets/world_map_image.png';
  }

  onResize(event) {

    this.resizeRoot(window.innerWidth, window.innerHeight);

    if ( this.graph) {
     // this.graph.initSimulation(this.options);
      //this.graph.restart();
    }
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  ngOnInit() {
    //this.color = 'gray';
    globalWorkspace.setName('Domain Model');
    this.workspace.stencil.add(dpmStencil);

    this.model = new foModel().defaultName('Documents');
    this.workspace.model.addItem('default', this.model);
    this.workspace.document.pages.add(this);


    // this.service.getApril().subscribe( data => {
    //   this.april = data;
    // });

    this.doPageEventSetup();
    //this.initSelectionEvents();

//https://medium.com/netscape/visualizing-data-with-angular-and-d3-209dde784aeb

    this.defaultConnectType = dpmStencil.creationFunction('mmConnection');

    //this.resizeRoot(window.innerWidth, window.innerHeight);

    const oShape = new  foShape2D({
      x: 200,
      y: 300,
      width: 200,
      height: 100
    });
    oShape.addAsSubcomponent(this)
    //oShape.dropAt(500,400)

    const master1 = this.myStencil.define<dpmText2DCircle>('CircleShape', dpmText2DCircle, {
      fontSize: 12,
      color: 'white',
      opacity: 1.0,
      background: 'purple',
      text: 'Hello Steve',
      width: 125,
      height: 125
    });

    master1.makeComponent(this).dropAt(500, 200);

    const master2 = this.myStencil.factory<foGlyph2D>('newshape', function(
      spec?: any,
      parent?: any
    ) {
      let factory = this.myName;
      let properties: any = Tools.union({ factory }, spec);
    
      let know = spec && dpmStencil.find(spec.shape);
      know = know || dpmStencil.find('dpmCircleShape');
    
      const shape = know.makeComponent(parent, properties);
      shape.opacity = .3;
    // alert("we are in factory")
    
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

    master2.makeComponent(this, null, _=> {
      alert("then complete")
    }).dropAt(800, 200);


    // this.service.getElasticGraphData().subscribe( data => {
    //   this.data = data;
    // });

  }

  get options() {
    const delta = 100;
    return  {
      width: window.innerWidth - delta,
      height: window.innerHeight - delta
    };
  }

  autoLayout({nodes, links}){
    let count = 100;
    this.graph = new ForceDirectedGraph(nodes, links, this.options);

    this.graph.ticker.subscribe(d => {
      nodes.forEach(item => item.updateGlue());
      count--;
      if ( count < 0){
        this.graph.stop();
      }
    });

   this.graph.initSimulation(this.options);
  }

  doSaveWorkspace() {
    this.workspace.SaveFileAs(this.model.myName, '.json', result => {
      Toast.info('saved', result.filename);
    });
  }

  doLoadWorkspace() {
    this.workspace.openFile(result => {
      Toast.info('open', result.filename);
      this.workspace.reHydratePayload(result.payload);
    });
  }

  doSavePage() {
    this.workspace.SaveInstanceAs(this, this.model.myName, '.json', result => {
      Toast.info('saved', result.filename);
    });
  }

  doLoadPage() {
    this.workspace.LoadInstanceFrom(this.model.myName, '.json', result => {
      Toast.info('loaded', result.filename);
    });
  }

}
