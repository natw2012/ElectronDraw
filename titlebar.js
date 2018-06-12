const $ = require('jquery');
const {remote} = require('electron');
var win = remote.getCurrentWindow();
var TMP = {maximized:false};

$('#min-btn').click(function(){
  win.minimize();
});

$('#close-btn').click(function(){
  win.close();
});

//Sometimes doesn't work
$('#max-btn').click(function() {
  if(TMP.maximized == true){
      TMP.maximized = false;
      win.unmaximize();
  }else{
    TMP.maximized = true;
      win.maximize();
  }
  console.log(win.isMaximized());
});
