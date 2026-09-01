/* ChainBloom documentation figures.
   Loaded only on pages that contain one. Every figure replaces a written
   fallback that already explains the same thing, so nothing is lost when this
   file does not run. Nothing here touches a wallet, a key, or the network. */

(function () {
  'use strict';

  var api = window.chainbloomDocs || {
    base: '/chainbloom',
    getState: function () {
      return { read: {}, checks: {} };
    },
    update: function () {},
    subscribe: function () {},
    announce: function () {},
    reducedMotion: function () {
      return false;
    },
  };

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var PALETTE = ['#7ee0bd', '#ff8b70', '#f4cc62', '#72aef8', '#c9a6ff', '#8fd694'];
  var registry = {};

  function register(name, mount) {
    registry[name] = mount;
  }

  function h(tag, attributes, children) {
    var node = document.createElement(tag);
    applyAttributes(node, attributes);
    appendChildren(node, children);
    return node;
  }

  function s(tag, attributes, children) {
    var node = document.createElementNS(SVG_NS, tag);
    applyAttributes(node, attributes);
    appendChildren(node, children);
    return node;
  }

  function applyAttributes(node, attributes) {
    if (!attributes) return;
    Object.keys(attributes).forEach(function (key) {
      var value = attributes[key];
      if (value === null || value === undefined || value === false) return;
      if (key === 'text') node.textContent = value;
      else if (key === 'html') node.innerHTML = value;
      else if (key === 'on') {
        Object.keys(value).forEach(function (event) {
          node.addEventListener(event, value[event]);
        });
      } else if (key === 'class') node.setAttribute('class', value);
      else node.setAttribute(key, String(value));
    });
  }

  function appendChildren(node, children) {
    if (!children) return;
    (Array.isArray(children) ? children : [children]).forEach(function (child) {
      if (child === null || child === undefined || child === false) return;
      node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    });
  }

  /** Build the shared chrome: title, simulation badge, stage, controls. */
  function frame(root, options) {
    root.innerHTML = '';
    var head = h('div', { class: 'demo-head' }, [
      h('p', { class: 'demo-title', text: options.title }),
      options.badge === false
        ? null
        : h('span', { class: 'demo-badge', text: options.badge || 'Simulation' }),
    ]);
    var stage = h('div', { class: 'demo-stage' });
    var controls = h('div', { class: 'demo-controls' });
    root.appendChild(head);
    root.appendChild(stage);
    root.appendChild(controls);
    if (options.caption) {
      root.appendChild(h('p', { class: 'demo-caption', text: options.caption }));
    }
    return { stage: stage, controls: controls, head: head };
  }

  function button(label, onClick, primary) {
    return h('button', {
      type: 'button',
      class: 'demo-button',
      'data-primary': primary ? '' : null,
      text: label,
      on: { click: onClick },
    });
  }

  /* ----------------------------------------------------- start-here picker */

  register('start-picker', function (root) {
    var parts = frame(root, {
      title: 'Choose what you want to do',
      badge: 'Saved on this device',
    });
    parts.controls.remove();
    var grid = h('div', { class: 'picker-grid' });
    var plan = h('div', { class: 'picker-plan' });
    parts.stage.replaceWith(grid);
    root.appendChild(plan);

    fetch(api.base + '/docs/journeys.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (journeys) {
        var cards = journeys.map(function (journey) {
          var card = h(
            'button',
            {
              type: 'button',
              class: 'picker-card',
              'aria-pressed': 'false',
              on: {
                click: function () {
                  api.update(function (state) {
                    state.journey = state.journey === journey.id ? null : journey.id;
                  });
                  api.announce(
                    'Path selected: ' +
                      journey.label +
                      '. ' +
                      journey.steps.length +
                      ' pages.',
                  );
                },
              },
            },
            [
              h('strong', { text: journey.label }),
              h('span', { text: journey.summary }),
              h('em', { text: journey.detail }),
            ],
          );
          grid.appendChild(card);
          return { card: card, journey: journey };
        });

        api.subscribe(function (state) {
          cards.forEach(function (entry) {
            entry.card.setAttribute(
              'aria-pressed',
              String(state.journey === entry.journey.id),
            );
          });
          var chosen = journeys.filter(function (journey) {
            return journey.id === state.journey;
          })[0];
          plan.innerHTML = '';
          if (!chosen) {
            plan.appendChild(
              h('p', {
                class: 'demo-caption',
                text: 'Pick one above and a reading path appears here. Your place is kept on this device only, and you never need an account.',
              }),
            );
            return;
          }
          var done = chosen.steps.filter(function (step) {
            return state.read[step.id];
          }).length;
          var minutes = chosen.steps.reduce(function (total, step) {
            return total + step.minutes;
          }, 0);
          plan.appendChild(
            h('p', {
              class: 'demo-caption',
              text:
                chosen.label +
                ' · ' +
                chosen.steps.length +
                ' pages · about ' +
                minutes +
                ' minutes · ' +
                done +
                ' read',
            }),
          );
          var list = h('ol');
          chosen.steps.forEach(function (step, index) {
            list.appendChild(
              h('li', {}, [
                h(
                  'a',
                  {
                    class: 'plan-row',
                    href: step.url,
                    'data-read': String(Boolean(state.read[step.id])),
                  },
                  [
                    h('span', {
                      class: 'plan-mark',
                      text: state.read[step.id] ? '✓' : String(index + 1),
                      'aria-hidden': 'true',
                    }),
                    h('span', { class: 'plan-text' }, [
                      h('strong', { text: step.title }),
                      h('span', { text: step.description }),
                    ]),
                    h('span', { class: 'plan-minutes', text: step.minutes + ' min' }),
                  ],
                ),
              ]),
            );
          });
          plan.appendChild(list);
        });
      })
      .catch(function () {
        plan.appendChild(
          h('p', {
            class: 'demo-caption',
            text: 'The reading paths could not be loaded. Every page is still reachable from the menu.',
          }),
        );
      });
  });

  /* ------------------------------------------------- how a world grows */

  var WORLD_STORY = [
    {
      at: 0,
      type: 'create',
      title: 'A world begins',
      note: 'One transaction opens the world "Dawn Chorus" with three paths, a window of 1,008 blocks, and up to 64 steps on each path. Nothing else exists yet.',
    },
    {
      at: 2,
      type: 'bloom',
      lane: 0,
      palette: 0,
      title: 'The first bloom',
      note: 'Someone adds a moment to path 1. The transaction spends the path’s output and creates the next one, so path 1 now has a first and a second link in its chain.',
    },
    {
      at: 3,
      type: 'bloom',
      lane: 1,
      palette: 1,
      title: 'A second voice',
      note: 'A different person adds to path 2. The two paths do not interfere: each one moves at its own pace.',
    },
    {
      at: 5,
      type: 'bloom',
      lane: 2,
      palette: 2,
      title: 'The third path opens',
      note: 'Path 3 joins. Three people are now writing three threads of the same story.',
    },
    {
      at: 7,
      type: 'bloom',
      lane: 0,
      palette: 3,
      title: 'Path 1 continues',
      note: 'A path can hold many moments. Each one is a separate confirmed step with its own place in the order.',
    },
    {
      at: 9,
      type: 'echo',
      lane: 1,
      from: 1,
      palette: 1,
      title: 'An echo answers an earlier moment',
      note: 'Path 2 points back at the first bloom on path 1. The echo names that earlier event, which is how a reply, a quotation, or a tribute becomes part of the record.',
    },
    {
      at: 12,
      type: 'meet',
      lanes: [0, 1],
      palette: 4,
      title: 'Two paths meet',
      note: 'One transaction spends the live output of path 1 and path 2, then gives each path a new one. They share a moment; neither is merged, sold, or absorbed.',
    },
    {
      at: 14,
      type: 'bloom',
      lane: 2,
      palette: 5,
      title: 'Path 3 keeps its own line',
      note: 'A path that was not part of the meeting is unaffected. It carries on exactly as before.',
    },
    {
      at: 17,
      type: 'close',
      lane: 0,
      title: 'One path completes',
      note: 'Path 1 is closed on purpose. Its output is spent with no successor, so it can never be extended again, and its whole history stays readable.',
    },
  ];

  register('world-growth', function (root) {
    var parts = frame(root, {
      title: 'How a world grows',
      caption:
        'A simulation. No wallet, no transaction, and no cost. Block numbers are relative to the block that opened the world.',
    });
    var laneX = [140, 350, 560];
    var top = 74;
    var rowHeight = 21;
    var view = s('svg', {
      viewBox: '0 0 700 500',
      role: 'img',
      'aria-label':
        'A world opening with three paths, blooms, an echo, a meeting, and one path completing.',
    });
    var layerLinks = s('g');
    var layerNodes = s('g');
    var status = h('p', { class: 'demo-status' });
    parts.stage.appendChild(view);

    function y(at) {
      return top + at * rowHeight;
    }

    function drawStatic() {
      view.innerHTML = '';
      var grid = s('g');
      for (var block = 0; block <= 18; block += 3) {
        grid.appendChild(
          s('line', {
            x1: 66,
            x2: 660,
            y1: y(block),
            y2: y(block),
            stroke: 'currentColor',
            'stroke-opacity': '0.09',
          }),
        );
        grid.appendChild(
          s('text', {
            x: 58,
            y: y(block) + 4,
            'text-anchor': 'end',
            fill: 'currentColor',
            'fill-opacity': '0.5',
            'font-size': '11',
            'font-family': 'ui-monospace, monospace',
            text: '+' + block,
          }),
        );
      }
      grid.appendChild(
        s('text', {
          x: 58,
          y: 34,
          'text-anchor': 'end',
          fill: 'currentColor',
          'fill-opacity': '0.5',
          'font-size': '10',
          'letter-spacing': '1.4',
          text: 'BLOCK',
        }),
      );
      laneX.forEach(function (x, index) {
        grid.appendChild(
          s('text', {
            x: x,
            y: 34,
            'text-anchor': 'middle',
            fill: 'currentColor',
            'fill-opacity': '0.75',
            'font-size': '12',
            'font-weight': '700',
            text: 'Path ' + (index + 1),
          }),
        );
      });
      view.appendChild(grid);
      view.appendChild(layerLinks);
      view.appendChild(layerNodes);
      layerLinks.innerHTML = '';
      layerNodes.innerHTML = '';
    }

    var position = { 0: null, 1: null, 2: null };
    var nodes = [];
    var step = -1;

    function stem(lane, toY) {
      var from = position[lane];
      if (from === null) return;
      layerLinks.appendChild(
        s('line', {
          x1: laneX[lane],
          x2: laneX[lane],
          y1: from,
          y2: toY,
          stroke: 'currentColor',
          'stroke-opacity': '0.34',
          'stroke-width': '2',
        }),
      );
    }

    function node(lane, at, colour, radius) {
      var circle = s('circle', {
        cx: laneX[lane],
        cy: y(at),
        r: radius || 7,
        fill: colour,
        'fill-opacity': '0.9',
      });
      layerNodes.appendChild(circle);
      nodes.push({ lane: lane, at: at, x: laneX[lane], y: y(at) });
      position[lane] = y(at);
      return circle;
    }

    function render(upTo) {
      drawStatic();
      position = { 0: null, 1: null, 2: null };
      nodes = [];
      for (var index = 0; index <= upTo; index += 1) {
        var event = WORLD_STORY[index];
        if (event.type === 'create') {
          laneX.forEach(function (x, lane) {
            layerNodes.appendChild(
              s('circle', {
                cx: x,
                cy: y(0),
                r: 9,
                fill: 'none',
                stroke: '#7ee0bd',
                'stroke-width': '2',
              }),
            );
            position[lane] = y(0);
          });
          layerNodes.appendChild(
            s('text', {
              x: 350,
              y: y(0) - 22,
              'text-anchor': 'middle',
              fill: '#7ee0bd',
              'font-size': '12',
              'font-weight': '700',
              text: 'Dawn Chorus opens',
            }),
          );
        } else if (event.type === 'bloom') {
          stem(event.lane, y(event.at));
          node(event.lane, event.at, PALETTE[event.palette]);
        } else if (event.type === 'echo') {
          var source = nodes.filter(function (item) {
            return item.lane === event.from;
          })[0];
          stem(event.lane, y(event.at));
          if (source) {
            layerLinks.appendChild(
              s('path', {
                d:
                  'M ' +
                  source.x +
                  ' ' +
                  source.y +
                  ' C ' +
                  (source.x + 90) +
                  ' ' +
                  (source.y + 30) +
                  ', ' +
                  (laneX[event.lane] - 90) +
                  ' ' +
                  (y(event.at) - 30) +
                  ', ' +
                  laneX[event.lane] +
                  ' ' +
                  y(event.at),
                fill: 'none',
                stroke: '#f4cc62',
                'stroke-width': '1.6',
                'stroke-dasharray': '5 4',
              }),
            );
          }
          node(event.lane, event.at, PALETTE[event.palette]);
          layerNodes.appendChild(
            s('text', {
              x: laneX[event.lane] + 16,
              y: y(event.at) + 4,
              fill: '#f4cc62',
              'font-size': '11',
              text: 'echo',
            }),
          );
        } else if (event.type === 'meet') {
          event.lanes.forEach(function (lane) {
            stem(lane, y(event.at));
          });
          layerLinks.appendChild(
            s('line', {
              x1: laneX[event.lanes[0]],
              x2: laneX[event.lanes[1]],
              y1: y(event.at),
              y2: y(event.at),
              stroke: '#ff8b70',
              'stroke-width': '2.4',
            }),
          );
          layerNodes.appendChild(
            s('circle', {
              cx: (laneX[event.lanes[0]] + laneX[event.lanes[1]]) / 2,
              cy: y(event.at),
              r: 11,
              fill: 'none',
              stroke: '#ff8b70',
              'stroke-width': '2',
            }),
          );
          layerNodes.appendChild(
            s('text', {
              x: (laneX[event.lanes[0]] + laneX[event.lanes[1]]) / 2,
              y: y(event.at) - 18,
              'text-anchor': 'middle',
              fill: '#ff8b70',
              'font-size': '11',
              'font-weight': '700',
              text: 'they meet, both continue',
            }),
          );
          event.lanes.forEach(function (lane) {
            node(lane, event.at, PALETTE[event.palette], 7);
          });
        } else if (event.type === 'close') {
          stem(event.lane, y(event.at));
          layerNodes.appendChild(
            s('rect', {
              x: laneX[event.lane] - 8,
              y: y(event.at) - 8,
              width: 16,
              height: 16,
              rx: 3,
              fill: 'none',
              stroke: 'currentColor',
              'stroke-opacity': '0.8',
              'stroke-width': '2',
            }),
          );
          layerNodes.appendChild(
            s('text', {
              x: laneX[event.lane] + 18,
              y: y(event.at) + 4,
              fill: 'currentColor',
              'fill-opacity': '0.75',
              'font-size': '11',
              text: 'completed',
            }),
          );
          position[event.lane] = null;
        }
      }
    }

    var playing = false;
    var timer = null;
    var playButton;

    function show(index) {
      step = Math.max(-1, Math.min(WORLD_STORY.length - 1, index));
      render(step);
      var event = WORLD_STORY[step];
      if (step < 0) {
        status.textContent = 'Press play, or step through one moment at a time.';
      } else {
        status.innerHTML = '';
        status.appendChild(
          h('strong', { text: 'Block +' + event.at + ' · ' + event.title }),
        );
        status.appendChild(h('span', { text: ' ' + event.note }));
        api.announce(event.title + '. ' + event.note);
      }
      prev.disabled = step < 0;
      nextButton.disabled = step >= WORLD_STORY.length - 1;
    }

    function stop() {
      playing = false;
      window.clearInterval(timer);
      playButton.textContent = 'Play';
    }

    function play() {
      if (playing) {
        stop();
        return;
      }
      if (step >= WORLD_STORY.length - 1) show(-1);
      playing = true;
      playButton.textContent = 'Pause';
      timer = window.setInterval(function () {
        if (step >= WORLD_STORY.length - 1) {
          stop();
          return;
        }
        show(step + 1);
      }, 2600);
    }

    var prev = button('Back', function () {
      stop();
      show(step - 1);
    });
    var nextButton = button('Next moment', function () {
      stop();
      show(step + 1);
    });
    playButton = button('Play', play, true);
    var restart = button('Restart', function () {
      stop();
      show(-1);
    });

    if (api.reducedMotion()) {
      parts.controls.appendChild(nextButton);
      parts.controls.appendChild(prev);
      parts.controls.appendChild(restart);
    } else {
      parts.controls.appendChild(playButton);
      parts.controls.appendChild(prev);
      parts.controls.appendChild(nextButton);
      parts.controls.appendChild(restart);
    }
    parts.controls.appendChild(status);
    show(api.reducedMotion() ? WORLD_STORY.length - 1 : -1);
  });

  /* -------------------------------------------------- transaction journey */

  var JOURNEY_STAGES = [
    {
      title: 'You choose',
      body: 'You pick the world, the path, and what you want to add. Nothing has left your device.',
      truth: 'Nothing exists yet',
      tone: 0,
    },
    {
      title: 'A draft is built',
      body: 'A draft transaction is prepared: the marker output that names your action, the 1,000-satoshi output that carries the path onward, and the inputs that pay the fee.',
      truth: 'Nothing exists yet',
      tone: 0,
    },
    {
      title: 'You review',
      body: 'Your wallet shows every input and output, the amount, and the network fee. This is the moment to stop if anything looks wrong.',
      truth: 'Nothing exists yet',
      tone: 0,
    },
    {
      title: 'You sign',
      body: 'Your wallet signs with keys that never leave it. The signed transaction is now valid, but still only on your device.',
      truth: 'Nothing exists yet',
      tone: 0,
    },
    {
      title: 'It is broadcast',
      body: 'The transaction reaches the Bitcoin network and waits in the mempool. A receipt means it was sent. It does not mean it was accepted into history.',
      truth: 'Provisional',
      tone: 1,
    },
    {
      title: 'A block confirms it',
      body: 'A miner includes the transaction in a block. Now every ChainBloom view places your moment at the same point in the same order.',
      truth: 'Confirmed history',
      tone: 2,
    },
    {
      title: 'It settles',
      body: 'More blocks follow. A very recent block can still be replaced, so an important moment is worth checking again a few blocks later.',
      truth: 'Confirmed history',
      tone: 2,
    },
  ];

  register('tx-journey', function (root) {
    var parts = frame(root, {
      title: 'What happens to a contribution',
      badge: 'Walk-through',
      caption:
        'A walk-through of the real sequence. Use the arrow keys, or press a stage to jump to it.',
    });
    var current = 0;
    var strip = h('div', { class: 'picker-grid', style: 'padding:0;gap:6px' });
    var detail = h('p', { class: 'demo-status' });
    var truth = h('p', { class: 'demo-caption' });
    parts.stage.appendChild(strip);
    parts.stage.appendChild(h('div', { style: 'height:12px' }));
    parts.stage.appendChild(detail);
    parts.stage.appendChild(truth);

    var TONES = ['currentColor', '#f4cc62', '#7ee0bd'];
    var TRUTH_TEXT = [
      'Nothing has been created. You can walk away at no cost.',
      'Provisional. It can still be replaced, dropped, or reordered.',
      'Confirmed. Everyone reading this world now sees the same order.',
    ];

    var buttons = JOURNEY_STAGES.map(function (stage, index) {
      var card = h(
        'button',
        {
          type: 'button',
          class: 'picker-card',
          'aria-pressed': 'false',
          style: 'padding:11px 13px',
          on: {
            click: function () {
              show(index);
            },
            keydown: function (event) {
              if (event.key === 'ArrowRight') show(Math.min(index + 1, buttons.length - 1));
              if (event.key === 'ArrowLeft') show(Math.max(index - 1, 0));
            },
          },
        },
        [
          h('strong', {
            text: index + 1 + '. ' + stage.title,
            style: 'font-size:0.98rem',
          }),
        ],
      );
      strip.appendChild(card);
      return card;
    });

    function show(index) {
      current = index;
      buttons.forEach(function (card, position) {
        card.setAttribute('aria-pressed', String(position === index));
      });
      var stage = JOURNEY_STAGES[index];
      detail.innerHTML = '';
      detail.appendChild(h('strong', { text: stage.title + '. ' }));
      detail.appendChild(h('span', { text: stage.body }));
      truth.innerHTML = '';
      truth.appendChild(
        h('span', {
          text: '● ' + stage.truth + '. ' + TRUTH_TEXT[stage.tone],
          style: 'color:' + TONES[stage.tone],
        }),
      );
      buttons[index].focus({ preventScroll: true });
      api.announce(stage.title + '. ' + stage.body);
    }

    parts.controls.appendChild(
      button('Back', function () {
        show(Math.max(0, current - 1));
      }),
    );
    parts.controls.appendChild(
      button(
        'Next stage',
        function () {
          show(Math.min(JOURNEY_STAGES.length - 1, current + 1));
        },
        true,
      ),
    );
    show(0);
    buttons[0].blur();
  });

  /* --------------------------------------------------------- path lineage */

  register('path-lineage', function (root) {
    var parts = frame(root, {
      title: 'One path, four confirmed steps',
      badge: 'Simulation',
      caption:
        'Example identifiers, shortened for reading. Each step spends the output the step before it created.',
    });
    var steps = [
      {
        label: 'Opened',
        outpoint: 'a91c…4f02:1',
        note: 'The world was created. This output is the root of path 2.',
      },
      {
        label: 'Bloom',
        outpoint: '3d77…be15:1',
        note: 'The root output was spent; a new one took its place.',
      },
      {
        label: 'Echo',
        outpoint: '0b52…cc90:1',
        note: 'This step also names an earlier event on another path.',
      },
      {
        label: 'Meeting',
        outpoint: 'f14a…2d63:1',
        note: 'A meeting spent this path and another one, and gave each a successor.',
      },
    ];
    var view = s('svg', {
      viewBox: '0 0 700 190',
      role: 'img',
      'aria-label':
        'Four linked steps. Each one spends the output created by the step before it.',
    });
    var detail = h('p', { class: 'demo-status' });
    parts.stage.appendChild(view);
    parts.stage.appendChild(detail);

    steps.forEach(function (item, index) {
      var x = 60 + index * 175;
      if (index > 0) {
        view.appendChild(
          s('line', {
            x1: x - 108,
            x2: x - 46,
            y1: 70,
            y2: 70,
            stroke: 'currentColor',
            'stroke-opacity': '0.35',
            'stroke-width': '2',
            'marker-end': 'url(#arrow)',
          }),
        );
        view.appendChild(
          s('text', {
            x: x - 77,
            y: 60,
            'text-anchor': 'middle',
            fill: 'currentColor',
            'fill-opacity': '0.45',
            'font-size': '10',
            text: 'spends',
          }),
        );
      }
      var group = s('g', {
        tabindex: '0',
        role: 'button',
        'aria-label': item.label + ', output ' + item.outpoint,
        style: 'cursor:pointer',
      });
      group.appendChild(
        s('rect', {
          x: x - 46,
          y: 44,
          width: 92,
          height: 52,
          rx: 10,
          fill: index === steps.length - 1 ? 'rgba(126,224,189,0.16)' : 'transparent',
          stroke: index === steps.length - 1 ? '#7ee0bd' : 'currentColor',
          'stroke-opacity': index === steps.length - 1 ? '1' : '0.35',
          'stroke-width': '1.6',
        }),
      );
      group.appendChild(
        s('text', {
          x: x,
          y: 66,
          'text-anchor': 'middle',
          fill: 'currentColor',
          'font-size': '12',
          'font-weight': '700',
          text: item.label,
        }),
      );
      group.appendChild(
        s('text', {
          x: x,
          y: 84,
          'text-anchor': 'middle',
          fill: 'currentColor',
          'fill-opacity': '0.6',
          'font-size': '10',
          'font-family': 'ui-monospace, monospace',
          text: item.outpoint,
        }),
      );
      if (index === steps.length - 1) {
        group.appendChild(
          s('text', {
            x: x,
            y: 122,
            'text-anchor': 'middle',
            fill: '#7ee0bd',
            'font-size': '11',
            'font-weight': '700',
            text: 'live now',
          }),
        );
      }
      var select = function () {
        detail.innerHTML = '';
        detail.appendChild(
          h('strong', { text: item.label + ' · ' + item.outpoint + '. ' }),
        );
        detail.appendChild(h('span', { text: item.note }));
      };
      group.addEventListener('click', select);
      group.addEventListener('focus', select);
      group.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          select();
        }
      });
      view.appendChild(group);
    });

    var defs = s('defs');
    var marker = s('marker', {
      id: 'arrow',
      viewBox: '0 0 10 10',
      refX: '9',
      refY: '5',
      markerWidth: '5',
      markerHeight: '5',
      orient: 'auto-start-reverse',
    });
    marker.appendChild(
      s('path', {
        d: 'M 0 0 L 10 5 L 0 10 z',
        fill: 'currentColor',
        'fill-opacity': '0.4',
      }),
    );
    defs.appendChild(marker);
    view.insertBefore(defs, view.firstChild);

    view.appendChild(
      s('text', {
        x: 350,
        y: 168,
        'text-anchor': 'middle',
        fill: 'currentColor',
        'fill-opacity': '0.5',
        'font-size': '11',
        text: 'Only the last output can be spent next. That is what fixes the order.',
      }),
    );
    detail.textContent = 'Select a step to read what it did.';
    parts.controls.remove();
  });

  /* -------------------------------------------------- confirmation states */

  register('confirmation-lifecycle', function (root) {
    var parts = frame(root, {
      title: 'From draft to settled',
      badge: 'Reference',
      caption: 'Select a state to see what is true while a contribution is in it.',
    });
    var states = [
      {
        name: 'Draft',
        colour: 'currentColor',
        body: 'Built but unsigned. It costs nothing and commits to nothing. Close the tab and it is gone.',
      },
      {
        name: 'Signed',
        colour: '#72aef8',
        body: 'Valid and ready, still only on your device. Nobody else can see it.',
      },
      {
        name: 'Waiting',
        colour: '#f4cc62',
        body: 'Broadcast and in the mempool. Treat it as a preview: it can be replaced by a higher fee, dropped, or confirmed in a different order.',
      },
      {
        name: 'Confirmed',
        colour: '#7ee0bd',
        body: 'In a block. Every ChainBloom view now agrees on where your moment sits, and it can be used as the parent of the next step.',
      },
      {
        name: 'Settled',
        colour: '#7ee0bd',
        body: 'Several blocks deep. A reorganization this far back is very unusual, so this is where an important moment can be treated as final.',
      },
    ];
    var view = s('svg', {
      viewBox: '0 0 700 150',
      role: 'img',
      'aria-label': 'Five states: draft, signed, waiting, confirmed, settled.',
    });
    var detail = h('p', { class: 'demo-status' });
    parts.stage.appendChild(view);
    parts.stage.appendChild(detail);
    parts.controls.remove();

    states.forEach(function (state, index) {
      var x = 76 + index * 137;
      if (index > 0) {
        view.appendChild(
          s('line', {
            x1: x - 90,
            x2: x - 48,
            y1: 60,
            y2: 60,
            stroke: 'currentColor',
            'stroke-opacity': '0.3',
            'stroke-width': '2',
          }),
        );
      }
      var group = s('g', {
        tabindex: '0',
        role: 'button',
        'aria-label': state.name,
        style: 'cursor:pointer',
      });
      group.appendChild(
        s('circle', {
          cx: x,
          cy: 60,
          r: 26,
          fill: 'none',
          stroke: state.colour,
          'stroke-opacity': index < 2 ? '0.5' : '1',
          'stroke-width': '2',
          'stroke-dasharray': index === 2 ? '5 4' : null,
        }),
      );
      group.appendChild(
        s('text', {
          x: x,
          y: 108,
          'text-anchor': 'middle',
          fill: 'currentColor',
          'font-size': '12',
          'font-weight': '700',
          text: state.name,
        }),
      );
      group.appendChild(
        s('text', {
          x: x,
          y: 65,
          'text-anchor': 'middle',
          fill: state.colour,
          'font-size': '15',
          'font-weight': '700',
          text: String(index + 1),
        }),
      );
      var select = function () {
        detail.innerHTML = '';
        detail.appendChild(h('strong', { text: state.name + '. ' }));
        detail.appendChild(h('span', { text: state.body }));
      };
      group.addEventListener('click', select);
      group.addEventListener('focus', select);
      view.appendChild(group);
    });
    detail.textContent = 'Select a state above.';
  });

  /* ------------------------------------------------------- reorganizations */

  register('reorg-demo', function (root) {
    var parts = frame(root, {
      title: 'When Bitcoin replaces its newest block',
      caption:
        'A simulation of a one-block reorganization: the shortest and by far the most common kind.',
    });
    var stage = parts.stage;
    var status = h('p', { class: 'demo-status' });
    var reorganized = false;

    function draw() {
      stage.innerHTML = '';
      var view = s('svg', {
        viewBox: '0 0 700 210',
        role: 'img',
        'aria-label': reorganized
          ? 'Block 812,455 has been replaced. The event it held is provisional again.'
          : 'Three confirmed blocks holding four ChainBloom events.',
      });
      var blocks = [
        { height: '812,453', events: 'create + 1 bloom', keep: true },
        { height: '812,454', events: '2 blooms', keep: true },
        { height: '812,455', events: '1 meeting', keep: !reorganized },
      ];
      blocks.forEach(function (block, index) {
        var x = 70 + index * 190;
        view.appendChild(
          s('rect', {
            x: x,
            y: 40,
            width: 150,
            height: 74,
            rx: 10,
            fill: block.keep ? 'rgba(126,224,189,0.12)' : 'rgba(255,139,112,0.1)',
            stroke: block.keep ? '#7ee0bd' : '#ff8b70',
            'stroke-width': '1.6',
            'stroke-dasharray': block.keep ? null : '5 4',
          }),
        );
        view.appendChild(
          s('text', {
            x: x + 75,
            y: 66,
            'text-anchor': 'middle',
            fill: 'currentColor',
            'font-size': '12',
            'font-weight': '700',
            text: 'Block ' + block.height,
          }),
        );
        view.appendChild(
          s('text', {
            x: x + 75,
            y: 88,
            'text-anchor': 'middle',
            fill: 'currentColor',
            'fill-opacity': '0.65',
            'font-size': '11',
            text: block.events,
          }),
        );
        if (!block.keep) {
          view.appendChild(
            s('text', {
              x: x + 75,
              y: 132,
              'text-anchor': 'middle',
              fill: '#ff8b70',
              'font-size': '11',
              'font-weight': '700',
              text: 'replaced',
            }),
          );
        }
      });
      if (reorganized) {
        view.appendChild(
          s('rect', {
            x: 450,
            y: 132,
            width: 150,
            height: 60,
            rx: 10,
            fill: 'rgba(126,224,189,0.12)',
            stroke: '#7ee0bd',
            'stroke-width': '1.6',
          }),
        );
        view.appendChild(
          s('text', {
            x: 525,
            y: 156,
            'text-anchor': 'middle',
            fill: 'currentColor',
            'font-size': '12',
            'font-weight': '700',
            text: 'New 812,455',
          }),
        );
        view.appendChild(
          s('text', {
            x: 525,
            y: 176,
            'text-anchor': 'middle',
            fill: 'currentColor',
            'fill-opacity': '0.65',
            'font-size': '11',
            text: 'meeting not included',
          }),
        );
      }
      stage.appendChild(view);
      stage.appendChild(status);
      status.innerHTML = '';
      if (reorganized) {
        status.appendChild(h('strong', { text: 'The meeting is provisional again. ' }));
        status.appendChild(
          h('span', {
            text: 'Every honest view removes the events from the replaced block, rewinds the paths they advanced, and replays the new branch. If the meeting is included in a later block it returns to the history at its new position. Nothing is invented in the meantime.',
          }),
        );
      } else {
        status.appendChild(h('strong', { text: 'Three blocks, four confirmed events. ' }));
        status.appendChild(
          h('span', {
            text: 'Press the button to replace the newest block and watch what a ChainBloom view does about it.',
          }),
        );
      }
    }

    parts.controls.appendChild(
      button(
        'Replace the newest block',
        function () {
          reorganized = !reorganized;
          draw();
          api.announce(
            reorganized
              ? 'The newest block was replaced. The meeting is provisional again.'
              : 'The chain is back to three confirmed blocks.',
          );
        },
        true,
      ),
    );
    parts.controls.appendChild(
      h('p', {
        class: 'demo-status',
        text: 'Depth is the protection. A moment several blocks deep is very unlikely to move.',
      }),
    );
    draw();
  });

  /* -------------------------------------------------------- marker explorer */

  register('marker-explorer', function (root) {
    var parts = frame(root, {
      title: 'Build a marker, byte by byte',
      badge: 'Live encoder',
      caption:
        'This uses the same encoding rules as the protocol package. Nothing is sent anywhere.',
    });
    var stage = parts.stage;
    parts.controls.remove();

    import(api.base + '/assets/marker.mjs')
      .then(function (marker) {
        var state = {
          network: 0,
          operation: 'CREATE',
          laneCount: 3,
          durationBlocks: 1008,
          maxSteps: 64,
          seed: '000102030405060708090a0b0c0d0e0f',
          title: 'Dawn Chorus',
          glyph: 7,
          palette: 3,
          motion: 2,
          magnitude: 200,
          targetEventTxid:
            '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f',
          relation: 2,
          bridgeStyle: 4,
          intensity: 220,
          reason: 1,
        };
        var form = h('div', { class: 'picker-grid', style: 'padding:0;gap:12px' });
        var output = h('div');
        stage.appendChild(form);
        stage.appendChild(h('div', { style: 'height:14px' }));
        stage.appendChild(output);

        function field(label, control) {
          return h('label', { style: 'display:block;font-size:0.8rem' }, [
            h('span', {
              text: label,
              style: 'display:block;margin-bottom:5px;opacity:0.7;font-weight:700',
            }),
            control,
          ]);
        }

        function select(key, options) {
          var node = h('select', {
            style:
              'width:100%;padding:8px 10px;border-radius:8px;border:1px solid rgba(159,190,208,0.32);background:transparent;color:inherit;font:inherit;font-size:0.85rem',
            on: {
              change: function () {
                state[key] = key === 'network' ? Number(node.value) : node.value;
                draw();
              },
            },
          });
          options.forEach(function (option) {
            node.appendChild(
              h('option', { value: String(option.value), text: option.label }),
            );
          });
          node.value = String(state[key]);
          return node;
        }

        function number(key, bounds) {
          var node = h('input', {
            type: 'number',
            min: String(bounds[0]),
            max: String(bounds[1]),
            value: String(state[key]),
            style:
              'width:100%;padding:8px 10px;border-radius:8px;border:1px solid rgba(159,190,208,0.32);background:transparent;color:inherit;font:inherit;font-size:0.85rem',
            on: {
              input: function () {
                state[key] = Number(node.value);
                draw();
              },
            },
          });
          return node;
        }

        function text(key, maxLength) {
          var node = h('input', {
            type: 'text',
            maxlength: String(maxLength),
            value: state[key],
            style:
              'width:100%;padding:8px 10px;border-radius:8px;border:1px solid rgba(159,190,208,0.32);background:transparent;color:inherit;font:inherit;font-size:0.85rem',
            on: {
              input: function () {
                state[key] = node.value;
                draw();
              },
            },
          });
          return node;
        }

        function payload() {
          if (state.operation === 'CREATE') {
            return {
              operation: 'CREATE',
              laneCount: state.laneCount,
              durationBlocks: state.durationBlocks,
              maxSteps: state.maxSteps,
              seed: state.seed,
              title: state.title,
            };
          }
          if (state.operation === 'BLOOM') {
            return {
              operation: 'BLOOM',
              glyph: state.glyph,
              palette: state.palette,
              motion: state.motion,
              magnitude: state.magnitude,
            };
          }
          if (state.operation === 'GRAFT') {
            return {
              operation: 'GRAFT',
              targetEventTxid: state.targetEventTxid,
              relation: state.relation,
              glyph: state.glyph,
              palette: state.palette,
            };
          }
          if (state.operation === 'RENDEZVOUS') {
            return {
              operation: 'RENDEZVOUS',
              bridgeStyle: state.bridgeStyle,
              glyph: state.glyph,
              palette: state.palette,
              intensity: state.intensity,
            };
          }
          return { operation: 'CLOSE', reason: state.reason };
        }

        function draw() {
          form.innerHTML = '';
          form.appendChild(
            field(
              'Action',
              select('operation', [
                { value: 'CREATE', label: 'Create a world' },
                { value: 'BLOOM', label: 'Bloom' },
                { value: 'GRAFT', label: 'Echo an earlier moment' },
                { value: 'RENDEZVOUS', label: 'Two paths meet' },
                { value: 'CLOSE', label: 'Complete a path' },
              ]),
            ),
          );
          form.appendChild(
            field(
              'Network',
              select(
                'network',
                marker.NETWORKS.map(function (item) {
                  return { value: item.id, label: item.name };
                }),
              ),
            ),
          );
          if (state.operation === 'CREATE') {
            form.appendChild(field('Paths', number('laneCount', marker.LIMITS.laneCount)));
            form.appendChild(
              field(
                'Open for (blocks)',
                number('durationBlocks', marker.LIMITS.durationBlocks),
              ),
            );
            form.appendChild(
              field('Steps per path', number('maxSteps', marker.LIMITS.maxSteps)),
            );
            form.appendChild(field('Title', text('title', 32)));
          } else if (state.operation === 'BLOOM') {
            form.appendChild(field('Glyph', number('glyph', marker.LIMITS.glyph)));
            form.appendChild(field('Palette', number('palette', marker.LIMITS.palette)));
            form.appendChild(field('Motion', number('motion', marker.LIMITS.motion)));
            form.appendChild(
              field('Magnitude', number('magnitude', marker.LIMITS.magnitude)),
            );
          } else if (state.operation === 'GRAFT') {
            form.appendChild(field('Relation', number('relation', marker.LIMITS.relation)));
            form.appendChild(field('Glyph', number('glyph', marker.LIMITS.glyph)));
            form.appendChild(field('Palette', number('palette', marker.LIMITS.palette)));
          } else if (state.operation === 'RENDEZVOUS') {
            form.appendChild(
              field('Bridge style', number('bridgeStyle', marker.LIMITS.bridgeStyle)),
            );
            form.appendChild(field('Glyph', number('glyph', marker.LIMITS.glyph)));
            form.appendChild(field('Palette', number('palette', marker.LIMITS.palette)));
            form.appendChild(
              field('Intensity', number('intensity', marker.LIMITS.intensity)),
            );
          } else {
            form.appendChild(field('Reason', number('reason', marker.LIMITS.reason)));
          }

          output.innerHTML = '';
          var encoded;
          try {
            encoded = marker.encodeMarker(state.network, payload());
          } catch (error) {
            output.appendChild(
              h('p', {
                class: 'demo-status',
                style: 'color:#ff8b70',
                text: 'The protocol would reject this: ' + error.message,
              }),
            );
            return;
          }
          var grid = h('div', {
            style:
              'display:flex;flex-wrap:wrap;gap:3px;font-family:ui-monospace,monospace;font-size:0.76rem',
          });
          var caption = h('p', { class: 'demo-status' });
          encoded.fields.forEach(function (item, index) {
            var group = h('span', {
              tabindex: '0',
              role: 'button',
              'aria-label': item.label + ': ' + item.value,
              style:
                'display:inline-flex;gap:2px;padding:4px 6px;border-radius:6px;cursor:pointer;border:1px solid rgba(159,190,208,0.28);color:' +
                PALETTE[index % PALETTE.length],
            });
            for (var offset = 0; offset < item.length; offset += 1) {
              group.appendChild(
                h('b', {
                  style: 'font-weight:600',
                  text: encoded.bytes[item.start + offset].toString(16).padStart(2, '0'),
                }),
              );
            }
            var describe = function () {
              caption.innerHTML = '';
              caption.appendChild(h('strong', { text: item.label + ': ' }));
              caption.appendChild(
                h('span', {
                  text:
                    item.value +
                    ' · ' +
                    item.length +
                    (item.length === 1 ? ' byte' : ' bytes') +
                    ' at position ' +
                    item.start,
                }),
              );
            };
            group.addEventListener('mouseenter', describe);
            group.addEventListener('focus', describe);
            group.addEventListener('click', describe);
            grid.appendChild(group);
          });
          output.appendChild(grid);
          output.appendChild(h('div', { style: 'height:10px' }));
          output.appendChild(caption);
          caption.textContent = 'Hover or focus any group of bytes to see what it means.';
          var used = encoded.bytes.length;
          output.appendChild(
            h('p', {
              class: 'demo-caption',
              style: 'padding:0',
              text:
                used +
                ' of ' +
                marker.MAX_MARKER_BYTES +
                ' bytes used. The whole action fits in one small output that holds no value.',
            }),
          );
        }

        draw();
      })
      .catch(function () {
        stage.appendChild(
          h('p', {
            class: 'demo-status',
            text: 'The encoder could not be loaded. The marker layout is written out in the table on this page.',
          }),
        );
      });
  });

  /* ------------------------------------------------------------ fee figure */

  register('fee-explorer', function (root) {
    var parts = frame(root, {
      title: 'What a contribution costs',
      badge: 'Estimate',
      caption:
        'An estimate from the shape of each transaction. Your wallet shows the exact fee before you sign, and that number is the one that counts.',
    });
    parts.controls.remove();
    var stage = parts.stage;

    import(api.base + '/assets/marker.mjs')
      .then(function (marker) {
        var shapes = [
          {
            id: 'CREATE',
            label: 'Create a world (3 paths)',
            carriers: 0,
            successors: 3,
            markerBytes: 34,
          },
          { id: 'BLOOM', label: 'Bloom', carriers: 1, successors: 1, markerBytes: 12 },
          { id: 'GRAFT', label: 'Echo', carriers: 1, successors: 1, markerBytes: 43 },
          {
            id: 'RENDEZVOUS',
            label: 'Meeting (two paths)',
            carriers: 2,
            successors: 2,
            markerBytes: 12,
          },
          {
            id: 'CLOSE',
            label: 'Complete a path',
            carriers: 1,
            successors: 0,
            markerBytes: 9,
          },
        ];
        var rate = 5;
        var chosen = shapes[1];
        var table = h('div');
        var slider = h('input', {
          type: 'range',
          min: '1',
          max: '100',
          value: String(rate),
          'aria-label': 'Fee rate in satoshis per virtual byte',
          style: 'width:100%',
          on: {
            input: function () {
              rate = Number(slider.value);
              draw();
            },
          },
        });
        var chooser = h('div', { class: 'picker-grid', style: 'padding:0;gap:6px' });
        stage.appendChild(chooser);
        stage.appendChild(h('div', { style: 'height:14px' }));
        stage.appendChild(
          h('label', { style: 'display:block;font-size:0.8rem' }, [
            h('span', {
              class: 'demo-title',
              style: 'display:block;margin-bottom:6px',
              text: 'Fee rate',
            }),
            slider,
          ]),
        );
        stage.appendChild(h('div', { style: 'height:14px' }));
        stage.appendChild(table);

        var cards = shapes.map(function (shape) {
          var card = h(
            'button',
            {
              type: 'button',
              class: 'picker-card',
              style: 'padding:10px 12px',
              'aria-pressed': 'false',
              on: {
                click: function () {
                  chosen = shape;
                  draw();
                },
              },
            },
            [h('strong', { text: shape.label, style: 'font-size:0.92rem' })],
          );
          chooser.appendChild(card);
          return { card: card, shape: shape };
        });

        function draw() {
          cards.forEach(function (entry) {
            entry.card.setAttribute('aria-pressed', String(entry.shape === chosen));
          });
          var vsize = marker.estimateVirtualSize({
            carriers: chosen.carriers,
            successors: chosen.successors,
            feeInputs: 1,
            markerBytes: chosen.markerBytes,
          });
          var minerFee = vsize * rate;
          var carried = chosen.successors * 1000;
          var reclaimed = chosen.carriers * 1000;
          table.innerHTML = '';
          var number = function (value) {
            return value.toLocaleString('en-US');
          };
          var rows = [
            ['Fee rate', rate + ' sat/vB'],
            ['Estimated size', number(vsize) + ' vB'],
            ['Miner fee', number(minerFee) + ' sats'],
            [
              'Carried forward',
              carried === 0
                ? 'none, this action ends a path'
                : number(carried) +
                  ' sats in ' +
                  chosen.successors +
                  ' path output' +
                  (chosen.successors === 1 ? '' : 's'),
            ],
            [
              'Released back',
              reclaimed === 0
                ? 'none, this action opens new paths'
                : number(reclaimed) +
                  ' sats from the ' +
                  (chosen.carriers === 1
                    ? 'path output'
                    : chosen.carriers + ' path outputs') +
                  ' being spent',
            ],
            ['Net cost to you', number(minerFee + carried - reclaimed) + ' sats'],
          ];
          var element = h('table', { class: 'demo-table' });
          rows.forEach(function (row) {
            element.appendChild(
              h('tr', {}, [h('th', { text: row[0] }), h('td', { text: row[1] })]),
            );
          });
          table.appendChild(element);
          table.appendChild(
            h('p', {
              class: 'demo-caption',
              style: 'padding:12px 0 0',
              text: 'The 1,000 satoshis in a path output are not spent, only carried. They come back when the path is completed. Only the miner fee actually leaves.',
            }),
          );
        }

        draw();
      })
      .catch(function () {
        stage.appendChild(
          h('p', {
            class: 'demo-status',
            text: 'The estimate could not be loaded. Your wallet still shows the exact fee before you sign.',
          }),
        );
      });
  });

  /* -------------------------------------------------------- completion card */

  register('completion-card', function (root) {
    var guide = root.dataset.guide || 'participant';
    var titles = {
      participant: 'Took part in a world',
      creator: 'Created a world',
      integrator: 'Built with ChainBloom',
    };
    var parts = frame(root, {
      title: 'Your completion card',
      badge: 'Learning only',
    });
    parts.controls.remove();
    var stage = parts.stage;
    var box = h('div', { class: 'completion' });
    stage.appendChild(box);

    fetch(api.base + '/docs/journeys.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (journeys) {
        var map = { participant: 'join', creator: 'create', integrator: 'integrate' };
        var journey = journeys.filter(function (item) {
          return item.id === map[guide];
        })[0];
        api.subscribe(function (state) {
          var steps = journey ? journey.steps : [];
          var done = steps.filter(function (step) {
            return state.read[step.id];
          });
          box.innerHTML = '';
          box.appendChild(h('h3', { text: titles[guide] || 'Guide complete' }));
          if (steps.length === 0 || done.length < steps.length) {
            box.appendChild(
              h('p', {
                text:
                  'You have read ' +
                  done.length +
                  ' of ' +
                  steps.length +
                  ' pages in this guide. Mark the rest as read and a card you can save appears here.',
              }),
            );
            return;
          }
          box.appendChild(
            h('p', {
              text: 'You finished the guide. This card records that you read it. It is not a badge, a balance, a certificate, or anything the protocol knows about.',
            }),
          );
          var actions = h('div', { class: 'completion-actions' });
          actions.appendChild(
            button(
              'Download the card',
              function () {
                var svg = cardSvg(titles[guide] || 'Guide complete', steps.length);
                var blob = new Blob([svg], { type: 'image/svg+xml' });
                var url = URL.createObjectURL(blob);
                var link = h('a', {
                  href: url,
                  download: 'chainbloom-' + guide + '-card.svg',
                });
                document.body.appendChild(link);
                link.click();
                link.remove();
                URL.revokeObjectURL(url);
                api.announce('Completion card downloaded.');
              },
              true,
            ),
          );
          box.appendChild(actions);
        });
      })
      .catch(function () {
        box.appendChild(h('p', { text: 'Progress could not be read on this device.' }));
      });

    function cardSvg(label, pages) {
      var date = new Date().toISOString().slice(0, 10);
      return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">' +
        '<rect width="1200" height="630" fill="#07111f"/>' +
        '<circle cx="1010" cy="150" r="150" fill="#7ee0bd" fill-opacity="0.09"/>' +
        '<circle cx="150" cy="520" r="180" fill="#ff8b70" fill-opacity="0.07"/>' +
        '<text x="90" y="150" fill="#7ee0bd" font-family="sans-serif" font-size="26" font-weight="700" letter-spacing="6">CHAINBLOOM</text>' +
        '<text x="90" y="270" fill="#f3f0e8" font-family="Georgia, serif" font-size="70">' +
        label +
        '</text>' +
        '<text x="90" y="340" fill="#9eb5c7" font-family="sans-serif" font-size="28">Read all ' +
        pages +
        ' pages of the guide on ' +
        date +
        '.</text>' +
        '<text x="90" y="540" fill="#9eb5c7" font-family="sans-serif" font-size="22">A record of reading. Not a token, a balance, a right, or proof of anything on Bitcoin.</text>' +
        '<text x="90" y="580" fill="#7ee0bd" font-family="sans-serif" font-size="22">bitcoinuniverseio.github.io/chainbloom/docs</text>' +
        '</svg>'
      );
    }
  });

  /* ------------------------------------------------------------ continue */

  register('continue-reading', function (root) {
    var parts = frame(root, {
      title: 'Pick up where you stopped',
      badge: 'On this device',
    });
    parts.controls.remove();
    var body = h('div', { class: 'picker-plan', style: 'padding:0' });
    parts.stage.appendChild(body);

    fetch(api.base + '/docs/journeys.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (journeys) {
        api.subscribe(function (state) {
          body.innerHTML = '';
          var journey = journeys.filter(function (item) {
            return item.id === state.journey;
          })[0];
          var readCount = Object.keys(state.read).length;
          if (!journey && readCount === 0) {
            body.appendChild(
              h('p', {
                class: 'demo-status',
                text: 'Nothing saved yet. Choose a path on the Start here page and this will remember your place.',
              }),
            );
            return;
          }
          if (journey) {
            var nextStep = journey.steps.filter(function (step) {
              return !state.read[step.id];
            })[0];
            body.appendChild(
              h('p', {
                class: 'demo-status',
                text:
                  'Your path: ' +
                  journey.label +
                  ' · ' +
                  journey.steps.filter(function (step) {
                    return state.read[step.id];
                  }).length +
                  ' of ' +
                  journey.steps.length +
                  ' pages read.',
              }),
            );
            if (nextStep) {
              body.appendChild(
                h('a', { class: 'plan-row', href: nextStep.url }, [
                  h('span', { class: 'plan-mark', text: '→', 'aria-hidden': 'true' }),
                  h('span', { class: 'plan-text' }, [
                    h('strong', { text: nextStep.title }),
                    h('span', { text: nextStep.description }),
                  ]),
                  h('span', { class: 'plan-minutes', text: nextStep.minutes + ' min' }),
                ]),
              );
            } else {
              body.appendChild(
                h('p', {
                  class: 'demo-caption',
                  style: 'padding:0',
                  text: 'You have read every page on this path.',
                }),
              );
            }
          } else {
            body.appendChild(
              h('p', {
                class: 'demo-status',
                text:
                  'You have read ' +
                  readCount +
                  ' pages. Choose a path to get an ordered route through the rest.',
              }),
            );
          }
        });
      })
      .catch(function () {
        body.appendChild(
          h('p', { class: 'demo-status', text: 'Progress could not be read.' }),
        );
      });
  });

  /* ------------------------------------------------------------- mounting */

  document.querySelectorAll('[data-demo]').forEach(function (root) {
    var mount = registry[root.dataset.demo];
    if (!mount) return;
    try {
      mount(root);
    } catch (error) {
      /* Leave the written fallback in place if a figure cannot start. */
    }
  });
})();
