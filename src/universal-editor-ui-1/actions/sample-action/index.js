// action.js
function main(params) {
    const jsModule = `
    export function greet(name) {
      return \`Hello, \${name}!\`;
    }
  `;

    return {
        headers: { 'Content-Type': 'application/javascript' },
        body: jsModule
    };
}

exports.main = main;
