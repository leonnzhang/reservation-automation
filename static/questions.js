const firstMenu = [{
    type: 'list',
    name: 'mode',
    message: 'Which mode would you like to enter?',
    choices: ['Config mode', 'Reservation mode'],
    filter(val) {
       if(val == 'Config mode') {
        return 'config';
      } else if(val == 'Reservation mode') {
        return 'reserve';
      } else {
        return 'error';
      }
    }
  }];
  
const secondMenu = [{
    type:'list',
    name:'activity',
    message:'Which activity would you like to reserve for?',
    choices: ['Cardio/Weight Room','Adult Volleyball', 'Bootcamp - turf']
}]

module.exports = {
    firstMenu,
    secondMenu
}