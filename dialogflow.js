const { dialogflow } = require('actions-on-google');
const app = dialogflow();

app.intent('next_appointment', conv => {
  console.log("conv.parameters: ", conv.parameters)  
  conv.ask('your next appointment is cominmg up')
})

app.intent('demo_action', conv => {
  console.log("conv.parameters: ", conv.parameters)  
  conv.ask('your test app is running kevin')
})

app.intent('Default Fallback Intent', conv => {
  conv.ask(`I didn't understand. Can you tell me something else?`)
})

// Intent in Dialogflow called `Goodbye`
app.intent('Goodbye', conv => {    
  conv.close('See you later!')
})

exports.fulfillment = app;