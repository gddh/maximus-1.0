//const emojiReply = (data) => {
  var emoji_dict = {0 : 0x1F602, 1 : 0x1F612, 2 : 0x1F629, 3 : 0x1F62D, 4 : 0x1F60D, 5 : 0x1F61E,
                    6 : 0x1F44C, 7 : 0x1F60A, 8 : 0x2764 , 9 : 0x1F60F, 10: 0x1F601, 11: 0x1F3B6,
                    12: 0x1F633, 13: 0x1F4AF, 14: 0x1F62A, 15: 0x1F60C, 16: 0x1F60A, 17: 0x1F64C,
                    18: 0x1F495, 19: 0x1F611, 20: 0x1F605, 21: 0x1F64F, 22: 0x1F615, 23: 0x1F618,
                    24: 0x2764,  25: 0x1F610, 26: 0x1F481, 27: 0x1F61E, 28: 0x1F648, 29: 0x1F627,
                    30: 0x260C,  31: 0x1F60E, 32: 0x1F621, 33: 0x1F44D, 34: 0x1F622, 35: 0x1F62A,
                    36: 0x1F60B, 37: 0x1F624, 38: 0x270B , 39: 0x1F637, 40: 0x1F44F, 41: 0x1F440,
                    42: 0x1F52B, 43: 0x2639 , 44: 0x1F608, 45: 0x1F613, 46: 0x1F494, 47: 0x1F49F,
                    48: 0x1F3A7, 49: 0x1F64A, 50: 0x1F609, 51: 0x1F480, 52: 0x1F616, 53: 0x1F604,
                    54: 0x1F61C, 55: 0x1F620, 56: 0x1F645, 57: 0x1F4AA, 58: 0x1F44A, 59: 0x1F49C,
                    60: 0x1F496, 61: 0x1F499, 62: 0x1F62C, 63: 0x2728};

  data = ['I love mom\'s cooking.']

  console.log(`IN EMOJI: DATA: ${data}`);
   
  var spawn = require('child_process').spawn,
      py    = spawn('python', ['score_texts_emojis.py']),
      dataString = '';

  py.stdout.on('data', function(data){
      console.log(`getting data: ${data}`)
      dataString += data.toString();
  });
  py.stdout.on('end', function(){
      console.log(`dataString: ${dataString}`);
      let data_obj = JSON.parse(dataString);
      let i;
      let response = 'I think I know how you feel. Let me try to express it:';
      for (i = 0; i < 5; i ++) {
            response += String.fromCodePoint(emoji_dict[data_obj[i + 2]]);
      }
      console.log(response);
  });
  
  py.stdin.write(JSON.stringify(data));
  py.stdin.end();
  //console.log(`this is the response ${response}`);
//  return {text: 'this is the response'};
//}
//
//module.exports = {
//    emojiReply : emojiReply
//}
