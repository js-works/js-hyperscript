import React from 'react';
import dio from 'dio.js';

import hyperscriptReact from 'js-hyperscript/react';
import hyperscriptDio from 'js-hyperscript/dio';
import hyperscriptUniversal from 'js-hyperscript/universal';

const
    iterationCount = 200000,
    contentContainer = document.getElementById('content'),

    adapters = [
        {
            name: 'React',
            createElement: React.createElement,
            hyperscript: hyperscriptReact
        },

        {
            name: 'DIO',
            createElement: dio.createElement,
            hyperscript: hyperscriptDio
        },

        {
            name: 'universal',
            
            createElement: function () {
                const
                    argCount = arguments.length,
                    type = arguments[0],
                    props = arguments[1],
                    children = new Array(argCount - 2);

                for (let i = 2; i < argCount; ++i) {
                    children[i - 2] = arguments[i];
                }

                return {
                    type,
                    props,
                    children,
                    isElement: true
                };
            },

            hyperscript: hyperscriptUniversal
        }
    ],

    testGroups = [];

contentContainer.innerHTML = 'Please wait - performance tests are running ...';

let report = `<b>User agent: "${navigator.userAgent}</b><br/>`;

for (const { name, createElement, hyperscript } of adapters) {
    const tests = [];
    
    tests.push({
        displayName: `[${name}] Using createElement`,

        run() {
            for (let i = 0; i < iterationCount; ++i) {
                createElement('div',
                    { className: 'my-class', id: 'my-id' },
                    createElement('div', { className: 'my-class2', id: 'my-id2'}, 'my-div'));    
            }
        }
    });

    tests.push({
        displayName: `[${name}] Using 'js-hyperscript (variant 1)'`,

        run() {
            for (let i = 0; i < iterationCount; ++i) {
                hyperscript('div',
                    { className: 'my-class', id: 'my-id' },
                    hyperscript('div', { className: 'my-class2', id: 'my-id2'}, 'my-div'));    
            }
        }
    });

    tests.push({
        displayName: `[${name}] Using 'js-hyperscript (variant 2)'`,

        run() {
            for (let i = 0; i < iterationCount; ++i) {
                hyperscript('div#my-id.my-class',
                    hyperscript('div', { className: 'my-class2', id: 'my-id2'}, 'my-div'));    
            }
        }
    });

    tests.push({
        displayName: `[${name}] Using 'js-hyperscript (variant 3)'`,

        run() {
            for (let i = 0; i < iterationCount; ++i) {
                hyperscript('#my-id.my-class > #my-id2.my-class2', 'my-div');
            }
        }
    });

    testGroups.push(tests);
}

let stdDuration;

for (let i = 0; i < testGroups.length; ++i) {
    const tests = testGroups[i];

    for (let j = 0; j < tests.length; ++j) {
        setTimeout(() => {
            const
                test = tests[j],
                startTime = Date.now();
            
            test.run();

            const
                stopTime = Date.now(),
                duration = (stopTime - startTime);

            if (j === 0) {
                stdDuration = duration;
            }
            
            const durationInfo =
                duration + ' ms => '
                    + (duration / stdDuration * 100).toFixed() + '%';

            const message = `Run time for test '${test.displayName}': ${durationInfo}`;

            report += '<br/>' + message;
            
            if (j === tests.length -1) {
                if (i === testGroups.length - 1) {
                    report += '<br/><br/>All tests finished.';
                } else {
                    report += '<br/>';
                }
            }

            contentContainer.innerHTML = '';
            const div = document.createElement('div');
            div.innerHTML = report;
            contentContainer.appendChild(div);
        }, 10);
    }
}
