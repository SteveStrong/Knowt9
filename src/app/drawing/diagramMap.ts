import {
  foStencilLibrary,
  foShape2D,
  foPage,
  RuntimeType,
  shape2DNames,
  foNode,
  foCollection
} from '../foundry/public_api';

import { foLibrary, foComponent, Tools } from '../foundry/public_api';

export let KnowledgeDomain: foLibrary = new foLibrary().defaultName();

KnowledgeDomain.concepts.define('question', foComponent, {
  label: '???',
  text: function() {
    return this.label;
  }
});

KnowledgeDomain.concepts.define('datasource', foComponent, {
  location: '???',
  text: function() {
    return this.type + ':' + this.name;
  }
});

export class DiagramMapCommon {
  constructor(data: any) {
    this.override(data);
  }

  override(data: any) {
    Object.keys(data).forEach(key => {
      this[key] = data[key];
    });
  }
}

export class DiagramMap extends DiagramMapCommon {
  guidKey: string;
  label: string;
  author: string;
  email: string;
  lastChange: Date;

  presentation: any;
  knowledge: Array<any>;
  context: Array<any>;
  providence: Array<any>;

  modelLookup = {};

  root: foComponent = new foComponent({
    myName: 'Root'
  });

  constructor(data: any) {
    super(data);
    this.lastChange = new Date(data.lastChange);
  }

  public reHydrate(json: any) {
    this.override(json);
    return this;
  }

  createKnowledgeModel() {
    this.knowledge.forEach(item => {
      const { id, type, position, from, to } = item;

      const concept = KnowledgeDomain.concepts.find(type);
      if (!concept) {
        return;
      }

      const obj = concept.makeComponent(this.root, item) as foComponent;
      this.modelLookup[id] = obj;
    });
  }

  public renderToPagezzz(stencil: foStencilLibrary, page: foPage) {
    const nodes = [
      { id: 10, type: 'mmDerived', title: 'People', x: 100, y: 422 },
      { id: 11, type: 'mmSource', title: 'Cell Towers', x: 300, y: 222 },
      { id: 11, type: 'mmSource', title: 'Hurricane', x: 300, y: 222 },
      { id: 12, type: 'mmCompute', title: 'Are there People?', x: 592, y: 498 },
      {
        id: 12,
        type: 'mmCompute',
        title: 'Where is the dammage?',
        x: 592,
        y: 498
      },
      {
        id: 13,
        type: 'mmQuestion',
        title: 'Where are the People?',
        x: 300,
        y: 622
      },
      { id: 13, type: 'mmOperator', title: 'intersect', x: 300, y: 622 },
      {
        id: 13,
        type: 'mmRecommend',
        title: 'People may be in danger!',
        x: 300,
        y: 622
      },
      {
        id: 13,
        type: 'mmInference',
        title: 'Where are the People?',
        x: 300,
        y: 622
      }
    ];

    const example = [
      { type: 'mmQuestion', title: 'Where is the disaster?', x: 100, y: 422 },
      {
        type: 'mmQuestion',
        title: 'What is the disaster type?',
        x: 300,
        y: 222
      },
      {
        type: 'mmQuestion',
        title: 'Are there people in the area?',
        x: 300,
        y: 222
      },
      { type: 'mmQuestion', title: 'Where are people?', x: 592, y: 498 },
      { type: 'mmQuestion', title: 'Are people near damage?', x: 592, y: 498 },
      {
        type: 'mmQuestion',
        title: 'Are the people in danger?',
        x: 300,
        y: 622
      },
      { type: 'mmQuestion', title: 'Is there damage?', x: 300, y: 622 },
      {
        type: 'mmQuestion',
        title: 'What are the types of damage?',
        x: 300,
        y: 622
      },
      { type: 'mmQuestion', title: 'Where is damage?', x: 300, y: 622 },

      {
        type: 'mmQuestion',
        title: 'Are people near damaged POI?',
        x: 300,
        y: 622
      },
      {
        type: 'mmQuestion',
        title: 'Are the damaged POI dangerous?',
        x: 300,
        y: 622
      },
      {
        type: 'mmQuestion',
        title: 'Where are the people who need help?',
        x: 300,
        y: 622
      },
      {
        type: 'mmQuestion',
        title: 'What are the points of interest?',
        x: 300,
        y: 622
      },

      {
        type: 'mmQuestion',
        title: 'Where are the points of interest?',
        x: 300,
        y: 622
      },
      { type: 'mmQuestion', title: 'Are POIs near damage?', x: 300, y: 622 },
      { type: 'mmQuestion', title: 'Are POI damaged?', x: 300, y: 622 }
    ];

    const shapeNodes = [];
    example.forEach(item => {
      const mmType = stencil.find(item.type);
      if (!mmType) {
        return;
      }

      const obj = mmType
        .makeComponent(page, {
          text: item.title
        })
        .dropAt(item.x, item.y);
      shapeNodes.push(obj);
    });

    const shapeLinks = [{ source: 1, target: 2 }, { source: 3, target: 4 }];

    return {
      nodes: shapeNodes,
      links: shapeLinks
    };
  }

  renderToPageSample(stencil: foStencilLibrary, page: foPage, data: any) {
    const presentation = {
      myName: 'unknown',
      myType: 'DrawingComponent',
      subcomponents: [
        {
          myName: 'unknown',
          myGuid: 'a32e0fe0-60a6-4d14-851b-013c75f3934e',
          concept: 'mmLink',
          factory: 'mmConnection',
          x: 1089,
          y: 477.5,
          from: '9b500dcc-3298-4d97-b653-b19a4b155432',
          to: 'c09d1030-8516-459f-9d64-130c95d87884'
        },
        {
          myName: 'unknown',
          myGuid: 'b09a4c49-0107-490f-ec44-8ce2cb0bbf83',
          concept: 'mmLink',
          factory: 'mmConnection',
          x: 873.5,
          y: 254,
          from: 'e7fe0a13-4345-4aa0-ab4f-d199f1e2e45f',
          to: 'd34420c9-231b-4c56-d7e6-69f7ee10a875'
        },
        {
          myName: 'unknown',
          myGuid: '329088e3-7423-4b82-95a6-aba3097a405c',
          concept: 'mmLink',
          factory: 'mmConnection',
          x: 877.5,
          y: 476.5,
          from: 'e7fe0a13-4345-4aa0-ab4f-d199f1e2e45f',
          to: 'eb0b4496-400d-4ca6-f8a8-5e1beb8c6281'
        },
        {
          myName: 'unknown',
          myGuid: 'e84e09ca-6e71-4493-d96a-439c4982b6c4',
          concept: 'mmLink',
          factory: 'mmConnection',
          x: 984,
          y: 589,
          from: 'eb0b4496-400d-4ca6-f8a8-5e1beb8c6281',
          to: '9b500dcc-3298-4d97-b653-b19a4b155432'
        },
        {
          myName: 'unknown',
          myGuid: '6ee5f28c-241a-463f-a6b8-ae47e72e6475',
          concept: 'mmLink',
          factory: 'mmConnection',
          x: 762.5,
          y: 591.5,
          from: 'fa21248a-a326-43e6-e21d-f880b5497c66',
          to: 'eb0b4496-400d-4ca6-f8a8-5e1beb8c6281'
        },
        {
          myName: 'unknown',
          myGuid: '86576dfa-f3a2-40a3-89f1-8714a4e6d330',
          concept: 'mmLink',
          factory: 'mmConnection',
          x: 525.5,
          y: 594.5,
          from: '43096734-d5f5-48da-9f98-17f43c80e615',
          to: 'fa21248a-a326-43e6-e21d-f880b5497c66'
        },
        {
          myName: 'unknown',
          myGuid: '120149c3-281a-4cb5-fdee-e3104299b05a',
          concept: 'mmLink',
          factory: 'mmConnection',
          x: 248.5,
          y: 480.5,
          from: '6f924ffe-c7c8-4289-9b28-7776f342a1c1',
          to: '43096734-d5f5-48da-9f98-17f43c80e615'
        },
        {
          myName: 'unknown',
          myGuid: '4d295f76-82f1-497b-b0ff-e4b2b0398fe9',
          concept: 'mmLink',
          factory: 'mmConnection',
          x: 1369.5,
          y: 364.5,
          from: 'cec1fc99-6f57-4d9f-c464-9ab2a8ae8796',
          to: '6f8448f9-25bb-4c9e-b3af-41664829ea06'
        },
        {
          myName: 'unknown',
          myGuid: '63ff3a99-ab3b-48b9-a2f4-d5c78ee039cb',
          concept: 'mmLink',
          factory: 'mmConnection',
          x: 1178.5,
          y: 367,
          from: 'c09d1030-8516-459f-9d64-130c95d87884',
          to: 'cec1fc99-6f57-4d9f-c464-9ab2a8ae8796'
        },
        {
          myName: 'unknown',
          myGuid: '414f144e-e6ce-4e6c-d4bf-c29214b47eb5',
          concept: 'mmLink',
          factory: 'mmConnection',
          x: 980,
          y: 257,
          from: 'd34420c9-231b-4c56-d7e6-69f7ee10a875',
          to: 'c09d1030-8516-459f-9d64-130c95d87884'
        },
        {
          myName: 'unknown',
          myGuid: '567836c2-0def-430a-aab1-ccbc173e0668',
          concept: 'mmLink',
          factory: 'mmConnection',
          x: 1279,
          y: 255.5,
          from: 'a9431a25-ad0a-4876-deb2-c36175fea21a',
          to: '6f8448f9-25bb-4c9e-b3af-41664829ea06'
        },
        {
          myName: 'unknown',
          myGuid: 'b8dc64b8-0929-40ee-ba03-61c12636c40b',
          concept: 'mmLink',
          factory: 'mmConnection',
          x: 979,
          y: 147,
          from: 'd34420c9-231b-4c56-d7e6-69f7ee10a875',
          to: 'a9431a25-ad0a-4876-deb2-c36175fea21a'
        },
        {
          myName: 'unknown',
          myGuid: 'f7d55a1b-cd52-4c46-ac4d-11c5968c3635',
          concept: 'mmLink',
          factory: 'mmConnection',
          x: 771.5,
          y: 144.5,
          from: 'f671b813-e35d-4920-ecc6-33e281217f09',
          to: 'd34420c9-231b-4c56-d7e6-69f7ee10a875'
        },
        {
          myName: 'unknown',
          myGuid: '71b76ff4-b45b-47ff-c07b-2cb54e0734d4',
          concept: 'mmLink',
          factory: 'mmConnection',
          x: 563,
          y: 143,
          from: 'ce2325e1-90a9-4a6f-a4a8-e0905e4f726b',
          to: 'f671b813-e35d-4920-ecc6-33e281217f09'
        },
        {
          myName: 'unknown',
          myGuid: 'fdf235b5-8848-4069-b1e2-a96059676141',
          concept: 'mmLink',
          factory: 'mmConnection',
          x: 273,
          y: 253.5,
          from: '6f924ffe-c7c8-4289-9b28-7776f342a1c1',
          to: 'ce2325e1-90a9-4a6f-a4a8-e0905e4f726b'
        },
        {
          myName: 'unknown',
          myGuid: 'c3a0eaf2-db26-4b20-8e8d-08b746499bb3',
          concept: 'mmLink',
          factory: 'mmConnection',
          x: 770,
          y: 363,
          from: '61ff332f-ca02-49f1-ce6d-0b020d0d5c63',
          to: 'e7fe0a13-4345-4aa0-ab4f-d199f1e2e45f'
        },
        {
          myName: 'unknown',
          myGuid: '68c21cf3-b42e-4519-9fec-2400dcf8f9fb',
          concept: 'mmLink',
          factory: 'mmConnection',
          x: 574.5,
          y: 365,
          from: 'edf319c2-0949-4643-ce98-6ce9db33de26',
          to: '61ff332f-ca02-49f1-ce6d-0b020d0d5c63'
        },
        {
          myName: 'unknown',
          myGuid: '1327e04d-b03d-4878-af25-178e9745512d',
          concept: 'mmLink',
          factory: 'mmConnection',
          x: 383.5,
          y: 366,
          from: '45fe5652-0fb8-4f81-ce16-7d39bf7f6a3b',
          to: 'edf319c2-0949-4643-ce98-6ce9db33de26'
        },
        {
          myName: 'unknown',
          myGuid: 'd0e066d7-1233-4bb1-9792-30003fae7df3',
          concept: 'mmLink',
          factory: 'mmConnection',
          x: 187,
          y: 365,
          from: '6f924ffe-c7c8-4289-9b28-7776f342a1c1',
          to: '45fe5652-0fb8-4f81-ce16-7d39bf7f6a3b'
        },
        {
          myName: 'unknown',
          myGuid: '45fe5652-0fb8-4f81-ce16-7d39bf7f6a3b',
          concept: 'mmQNode',
          factory: 'mmQuestion',
          text: 'What is the disaster type?',
          x: 282,
          y: 366
        },
        {
          myName: 'unknown',
          myGuid: 'ce2325e1-90a9-4a6f-a4a8-e0905e4f726b',
          concept: 'mmQNode',
          factory: 'mmQuestion',
          text: 'Are there people in the area?',
          x: 454,
          y: 143
        },
        {
          myName: 'unknown',
          myGuid: 'f671b813-e35d-4920-ecc6-33e281217f09',
          concept: 'mmQNode',
          factory: 'mmQuestion',
          text: 'Where are people?',
          x: 672,
          y: 143
        },
        {
          myName: 'unknown',
          myGuid: '6f8448f9-25bb-4c9e-b3af-41664829ea06',
          concept: 'mmQNode',
          factory: 'mmQuestion',
          text: 'Where are the people who need help?',
          x: 1471,
          y: 363
        },
        {
          myName: 'unknown',
          myGuid: '6f924ffe-c7c8-4289-9b28-7776f342a1c1',
          concept: 'mmQNode',
          factory: 'mmQuestion',
          text: 'Where is the disaster?',
          x: 92,
          y: 364
        },
        {
          myName: 'unknown',
          myGuid: '43096734-d5f5-48da-9f98-17f43c80e615',
          concept: 'mmQNode',
          factory: 'mmQuestion',
          text: 'What are the points of interest?',
          x: 405,
          y: 597
        },
        {
          myName: 'unknown',
          myGuid: 'd34420c9-231b-4c56-d7e6-69f7ee10a875',
          concept: 'mmQNode',
          factory: 'mmQuestion',
          text: 'Are people near damage?',
          x: 871,
          y: 146
        },
        {
          myName: 'unknown',
          myGuid: 'edf319c2-0949-4643-ce98-6ce9db33de26',
          concept: 'mmQNode',
          factory: 'mmQuestion',
          text: 'Is there damage?',
          x: 485,
          y: 366
        },
        {
          myName: 'unknown',
          myGuid: '61ff332f-ca02-49f1-ce6d-0b020d0d5c63',
          concept: 'mmQNode',
          factory: 'mmQuestion',
          text: 'What are the types of damage?',
          x: 664,
          y: 364
        },
        {
          myName: 'unknown',
          myGuid: 'e7fe0a13-4345-4aa0-ab4f-d199f1e2e45f',
          concept: 'mmQNode',
          factory: 'mmQuestion',
          text: 'Where is damage?',
          x: 876,
          y: 362
        },
        {
          myName: 'unknown',
          myGuid: 'eb0b4496-400d-4ca6-f8a8-5e1beb8c6281',
          concept: 'mmQNode',
          factory: 'mmQuestion',
          text: 'Are POIs near damage?',
          x: 879,
          y: 591
        },
        {
          myName: 'unknown',
          myGuid: 'fa21248a-a326-43e6-e21d-f880b5497c66',
          concept: 'mmQNode',
          factory: 'mmQuestion',
          text: 'Where are the points of interest?',
          x: 646,
          y: 592
        },
        {
          myName: 'unknown',
          myGuid: 'a9431a25-ad0a-4876-deb2-c36175fea21a',
          concept: 'mmQNode',
          factory: 'mmQuestion',
          text: 'Are the people in danger?',
          x: 1087,
          y: 148
        },
        {
          myName: 'unknown',
          myGuid: 'cec1fc99-6f57-4d9f-c464-9ab2a8ae8796',
          concept: 'mmQNode',
          factory: 'mmQuestion',
          text: 'Are the damaged POI dangerous?',
          x: 1268,
          y: 366
        },
        {
          myName: 'unknown',
          myGuid: '9b500dcc-3298-4d97-b653-b19a4b155432',
          concept: 'mmQNode',
          factory: 'mmQuestion',
          text: 'Are POI damaged?',
          x: 1089,
          y: 587
        },
        {
          myName: 'unknown',
          myGuid: 'c09d1030-8516-459f-9d64-130c95d87884',
          concept: 'mmQNode',
          factory: 'mmQuestion',
          text: 'Are people near damaged POI?',
          x: 1089,
          y: 368
        }
      ]
    };

    const shapeNodes = [];
    const shapeLinks = [];
    const lookup = {};
    const links = [];

    const subcomponents = presentation.subcomponents;

    subcomponents.forEach(item => {
      const { from, to } = item;

      const mmConcept = stencil.find(item.factory);
      if (mmConcept) {
        const obj = mmConcept.makeComponent(page, item);
        if (from || to) {
          links.push(obj);
        } else {
          obj.dropAt(item.x, item.y);
          // obj.text += `: (${item.factory})`;
          lookup[obj.myGuid] = obj;
          shapeNodes.push(obj);
        }
      }
    });

    links.forEach(link => {
      const source = lookup[link.from];
      const sink = lookup[link.to];

      link.glueStartTo(source, shape2DNames.center);
      link.glueFinishTo(sink, shape2DNames.center);
      page.moveToBottom(link);

      shapeLinks.push({
        source: source,
        target: sink
      });
    });

    return {
      nodes: shapeNodes,
      links: shapeLinks
    };
  }


  renderElasticGraphDataToPage(
    stencil: foStencilLibrary,
    page: foPage,
    data: any,
    drawingSpec: any
  ) {
    const shapeNodes = [];
    const shapeLinks = [];
    const links = [];

    const vertices = data.vertices;
    const connections = data.connections;

    const dpmNode = stencil.find('dpmDocument');
    const dpmLink = stencil.find('dpmConnection');

    let { Shape1, Shape2, ShapeFill, ShapeBroder } = drawingSpec;

    let delta = 100;
    let step = 0;
    vertices.forEach(item => {

      if ( Shape1.isType(item.field)) {
        item.shape = 'dpmCircleShape';
      }
      if ( Shape2.isType(item.field)) {
        item.shape = 'dpmRhombusShape';
      }


      const obj = dpmNode.makeComponent(page, item);
      //obj.text = `${step} - ${item.term}`;
      obj.text = `${item.term}`;

      obj.dropAt(
        Tools.randomInt(delta, page.width - delta),
        Tools.randomInt(delta, page.height - delta)
      );

      step++;
      shapeNodes.push(obj);
    });

    connections.forEach(conn => {
      const source = shapeNodes[conn.source];
      const target = shapeNodes[conn.target];

      if (!source || !target) {
        console.log('no link');
        return;
      }

      const link = dpmLink.makeComponent(page, conn);
      link.text = `${conn.doc_count}`;

      link.glueStartTo(source, shape2DNames.center);
      link.glueFinishTo(target, shape2DNames.center);
      page.moveToBottom(link);

      shapeLinks.push({
        source: source,
        target: target
      });
    });

    return {
      nodes: shapeNodes,
      links: shapeLinks
    };
  }
}
