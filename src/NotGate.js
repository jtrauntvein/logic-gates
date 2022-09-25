import { Gate } from "./Gate";

function NotGate() {
   Gate.prototype.call(this, [
      {
         inputs: [ { name: "A", rule_value: false } ],
         outputs: [ { name: "Q", rule_value: true } ]
      },
      {
         inputs: [ {name: "A", rule_value: true } ],
         outputs: [ { name: "Q", rule_value: false } ]
      }
   ])
};
NotGate.prototype = new Gate();

export const {
   NotGate
}