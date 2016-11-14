 var winners = [
 ['00','01','02','03','04'],
 ['10','11','12','13','14'],
 ['20','21','22','23','24'],
 ['30','31','32','33','34'],
 ['40','41','42','43','44'],
 ['00','10','20','30','40'],
 ['01','11','21','31','41'],
 ['02','12','22','32','42'],
 ['03','13','23','33','43'],
 ['04','14','24','34','44'],
 ['00','11','22','33','44'],
 ['40','31','22','13','04']
 ];
 var possibleWinners = winners.length;
 // var win_nums = [10, 100, 105, 110, 115, 120, 160, 210, 60]
 var end_sound = new Audio(__dirname + '/sounds/end.wav');
 var end = false;
 require('electron').webFrame.setZoomLevelLimits(1, 1)


 $(document).ready(function () {

  const ipc = require('electron').ipcRenderer

  ipc.on('information-dialog-selection', function (event, index) {
    let message = 'You selected '
    if (index === 0) location.reload();
  })




  var selected = ['22'];
  var bingo_sound = new Audio(__dirname + '/sounds/bell.wav');
  var remove_sound = new Audio(__dirname + '/sounds/remove.wav');
  var data = require('electron').remote.getGlobal('bingoes').bingoes.sort(function(a, b){return 0.5 - Math.random()});
  loadBoard(data);

  $('.bingo_box').click(function () {
    if (!end){
      var id = $(this).attr('id')
      console.log(id);
      if ($(this).hasClass('selected')) {
        if(id != '22') selected.pop(id);
        $(this).removeClass('selected');
        remove_sound.currentTime = 0;
        remove_sound.play();
      }else{
        $(this).addClass('selected');
        if(id != '22' && selected.push(id) && !checkBingo(selected)){
          bingo_sound.currentTime = 0;
          bingo_sound.play();
        } else {
          // setTimeout(location.reload(), 10000);
        }
      };
      console.log(selected);
    }
  })

});

 function loadBoard (data) {
  $('.container').append(createContainer(data));
}
function createContainer (data) {
  var container = "";
  for (var i = 0; i <= 4; i++) {
    container += "<div class='row'>" + createRow(i, data) + "</div>";
  };
  return container;
}

function createRow (num, data) {
  var row ="";
  for (var i = 0; i <= 4; i++) {
    if (i == 2 && num == 2) {
      row += "<div class='bingo_box star' id='22'> <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Five-pointed_star.svg/1088px-Five-pointed_star.svg.png'></div>"
    }else{
      row += "<div class='bingo_box' id='" + num + ''+ i + "'>"+ data.pop() +"</div>"
    };
  };
  return row;
}

function checkBingo (selected) {
  a = []
  for(var i = 0; i < possibleWinners; i++) {
    var cellExists = 0;
    var sum = 0;

    for(var j = 0; j < 5; j++) {
      sum += parseInt(winners[i][j]);
      if($.inArray(winners[i][j], selected) > -1) {
        cellExists++;
      }
    }
    a.push(sum)
    // If all 5 winner cells exist in selected array alert success message
    // if(win_nums) {
      if(cellExists == 5) {
        end_sound.currentTime = 0;
        end_sound.play();
        // alert('You Win-go!');
        // ipc.send('show-winner-page', 'file://' + __dirname + '/winner.html');
        ipc.send('open-game-end-page');

        end = true;
        return end;
      }
    }
    console.log(Array.from(new Set(a)).sort());
  }



