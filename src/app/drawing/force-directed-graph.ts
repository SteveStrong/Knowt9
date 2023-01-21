import { EventEmitter } from '@angular/core';
import * as fs from '../foundry/models/force';

const FORCES = {
  LINKS: 1 / 800,
  COLLISION: 45,
  CHARGE: -.1
};

export class ForceDirectedGraph {
  public ticker: EventEmitter<fs.forceSimulation<any, any>> = new EventEmitter();
  public simulation: fs.forceSimulation<any, any>;

  public nodes: any = [];
  public links: any[] = [];

  constructor(nodes, links, options: { width, height }) {
    this.nodes = nodes;
    this.links = links;
  }


  private initNodes() {
    this.simulation.nodes(this.nodes);
  }

  private initLinks() {
    this.simulation.force('links',
    fs.forceLink(this.links)
        .strength(d => {
          let source = d.source;
          let target = d.target;
          return FORCES.LINKS * source.springDistance(target);
        })
    );
  }

  initSimulation(options) {
    if (!options || !options.width || !options.height) {
      throw new Error('missing options when initializing simulation');
    }

    /** Creating the simulation */
    if (!this.simulation) {
      const ticker = this.ticker;

      this.simulation = fs.forceSimulation();

      this.simulation.force('charge',
        fs.forceManyBody()
            .strength(d => FORCES.CHARGE * d.chargeRadius())
        );

      this.simulation.force('collide',
        fs.forceCollide()
            .strength(d => FORCES.COLLISION)
            .radius(d => d.collisionRadius()) //.iterations(2)
        );

      // Connecting the d3 ticker to an angular event emitter
      this.simulation.on('tick', function () {
        ticker.emit(this);
      });

      this.initNodes();
      this.initLinks();
    }

    /** Updating the central force of the simulation */
    this.simulation.force('centers', fs.forceCenter(options.width / 2, options.height / 2));

    /** Restarting the simulation internal timer */
    this.restart();
  }

  stop() {
    if ( this.simulation) {
      this.simulation.stop();
    }
    this.simulation = null;
  }

  private restart() {
    if ( this.simulation) {
      this.simulation.alpha(1.0);
      this.simulation.restart();
    }
  }
}
