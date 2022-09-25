import { Gate } from "./gate";


function AndGate() {
   const table = [
      [ false, false, false ],
      [ false, true, false ],
      [ true, false, false ],
      [ true, true, true ]
   ]
   Gate.prototype.call(this, table.map((rule) => {
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
AndGate.prototype = new Gate();

function NandGate() {
   const table = [
      [ false, false, true ],
      [ false, true, true ],
      [ true, false, true ],
      [ true, true, false ]
   ];
   Gate.prototype.call(this, table.map((rule) => {
      return {
         inputs: [
            { name: "A", rule_value: rule[0] },
            { name: "B", rule_value: rule[1] },
         ],
         outputs: [
            { name: "Q", rule_value: rule[2] }
         ]
      };
   }));
}

export const {
   AndGate,
   NandGate
};