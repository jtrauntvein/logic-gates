const input_values = {
   true_value: true,
   false_value: false,
   dont_care: -1
};
Object.freeze(input_values);


/**
 * @typedef TruthTableOutputType Defines an object that makes up one of the rules for a gate output.
 * @property {string} name Specifies the name of the output.
 * @property {boolean} value Specifies the value (true or false) associated with the rule.
 */
/**
 * @typedef TruthTableInputType Defines one of the inputs of a truth table function.
 * @property {string} name Specifies the name of the input
 * @property {input_values} value Specifies the value for the input associated with the rule.
 */
/**
 * @typedef TruthTableRule Defines a rule that is a part of the truth table
 * @property {TruthTableInputType[]} inputs Specifies the collection of inputs with their names and initial values.
 * @property {TruthTableOutputType[]} outputs Specifies the collection of output names for this rule.
 */
/**
 * Defines a logical gate object that maintains a collection of inputs and a collection of outputs.
 * It also maintains a truth table that defines how the output(s) will be generated from the current 
 * values.  Finally, it provides for a collection of watchers, including other gates, that can be 
 * hooked into the output.  This object will form the basis for all other logical functions within this
 * project.
 * 
 * @param {TruthTableRule}
 */
function Gate(truth_table)
{
   // if not an array (as would be the case of a prototype access), ignore the rules.
   if(Array.isArray(truth_table))
   {
      // we are going to map the rule values to a collection of objects 
      this.truth_table = truth_table.map((rule) => {
         return {
            inputs: rule.inputs.map((input) => {
               return {
                  name: input.name, 
                  // If the input value is not specified, it will be considered as don't care
                  rule_value: input.value ?? input_values.dont_care
               }
            }),
            outputs: rule.outputs.map((output) => {
               return {
                  name: output.name,
                  rule_value: output.value,
               };
            })
         };
      });
      this.inputs = this.truth_table.inputs.map((input) => {
         return {
            name: input.name,
            value: input.rule_value
         };
      });
      this.outputs = this.truth_table[0].outputs.map((output) => {
         return {
            name: output.name,
            value: output.rule_value,
            watchers: []
         };
      });
   }
}

/**
 * Searches for a truth table that matches all of the current input values and sets the outputs to the 
 * values associated with the rule.
 */
Gate.prototype.evaluate = function() {
   // in order to evaluate the current input values, we will need to iterate through the truth table
   // so that we can find a rule whose current input values match all of the inputs in the rule.
   const rule = this.truth_table.find((rule) => {
      return rule.inputs.every((input, input_idx) => {
         const input_value = this.inputs[input_idx];
         const rtn = (input.rule_value === input_values.dont_care || input_value === input.rule_value);
         return rtn;
      });
   });

   // we now need to set the output values to match those given in the rule.  If no rule was found, we will
   // set every output value to don't care since we have no rule to set.
   if(rule !== undefined)
      this.outputs.forEach((output, output_idx) => output.value = rule.outputs[output_idx].rule_value);
   else
      this.outputs.forEach((output) => output.value = input_values.dont_care);
};

/**
 * Iterates the outputs of this gate and invokes the callback function for each output watcher.
 */
Gate.prototype.notify_watchers = function() {
   this.outputs.forEach((output) => {
      output.watchers.forEach((watcher) => {
         watcher({
            name: output.name,
            value: output.value,
            source: this
         });
      });
   });
};

/**
 * Searches for the specified input and sets its value.  If the value is different from the current value,
 * evaluate will be called and then output values will be sent to each registered listener for that output.
 * @param {string | number} id Specifies the name or index of the input to set.
 * @param {boolean=true} value Specifies the new current value for the input.
 */
Gate.prototype.set = function(id, value) {
   let input = this.find_input(id);
   if(input && input.value !== value)
   {
      input.value = value;
      this.evaluate();
      this.notify_watchers();
   }
};

/**
 * @param {function} watcher Specifies the callback function to invoke when there is a possibility
 * that the output pin value has changed.
 * @param {(string | number)?} output_id Specifies the name or index of the output to connect.  If 
 * not defined, will connect the specified watcher to ALL outputs.
 */
Gate.prototype.add_watcher = function(output_id, watcher) {
   let output = this.find_output(output_id);
   if(output)
      output.watchers.push(watcher);
   else
      this.outputs.forEach((output) => output.watchers.push(watcher));
};

/**
 * 
 * @param {string | number} input_id Specifies the name or the index of the desired input.
 * @returns {object | undefined} Returns the specified input pin or undefined if there is no such input.
 */
Gate.prototype.find_input = function(input_id) {
   let rtn = undefined;
   if(typeof input_id === "string")
      rtn = this.inputs.find((input) => input.name === input_id);
   else if(typeof input_id === "number")
      rtn = this.inputs[input_id];
   return rtn;
};

/**
 * @param {string ? number} output_id Specifies name of the output or its index.
 * @returns {object | undefined} Returns the identified output object or undefined if that 
 * output dopes not exist
 */
Gate.prototype.find_output = function(output_id) {
   let rtn = undefined;
   if(typeof output_id === "string")
      rtn = this.outputs.find((output) => output.name === output_id);
   else
      rtn = this.outputs[output_id];
   return rtn;
}

/**
 * Binds a watcher function between one of the outputs of gate g1 to one of the inputs of gate g2.
 * @param {Gate} g1 Specifies the gate that owns the output to connect 
 * @param {string | number} output_id Specifies the name or index of the output pin
 * @param {Gate} g2 Specifies the gate that owns the input to be invoked.
 * @param {string | number} input_id Specifies the input pin to set. 
 */
function connect_gates(g1, output_id, g2, input_id) {
   g1.add_watcher(output_id, (value) => {
      g2.set(input_id, value);
   });
}

export default {
   Gate,
   connect_gates,
   input_values
};

