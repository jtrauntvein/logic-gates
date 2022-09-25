import { Gate } from "./gate";

function OrGate() {
   const table = [
      [ false, false, false ],
      [ false, true, true ],
      [ true, false, true ],
      [ true, true, true ]
   ];
   Gate.call(this, table.map((rule) => {
      return {
         inputs: [
            { name: "A", rule_value: rule[0] },
            { name: "B", rule_value: rule[1] }
         ],
         outputs: [
            { name: "Q", rule_value: rule[2] }
         ]
      };
   }));
}
OrGate.prototype = new Gate();

function NorGate() {
   const table = [
      [ false, false, true ],
      [ false, true, false ],
      [ true, false, false ],
      [ true, true, false ]
   ];
   Gate.call(this, table.map((rule) => {
      return {
         inputs: [
            { name: "A", rule_value: rule[0] },
            { name: "B", rule_value: rule[1] }
         ],
         outputs: [
            { name: "Q", rule_value: rule[2] }
         ]
      };
   }));
}
NorGate.prototype = new Gate();


function XorGate() {
   const table = [
      [ false, false, false ],
      [ false, true, true ],
      [ true, false, true ],
      [ true, true, false ]
   ];
   Gate.call(this, table.map((rule) => {
      return {
         inputs: [
            { name: "A", rule_value: rule[0] },
            { name: "B", rule_value: rule[1] }
         ],
         outputs: [
            { name: "Q", rule_value: rule[2] }
         ]
      };
   }));
};
XorGate.prototype = new Gate();


export const {
   OrGate,
   NorGate,
   XorGate
};
