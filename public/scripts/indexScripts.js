function parseCredentials(){
  var payload = {};
  $('.credentialsParser').each(function(index){
    payload[$(this).prop('id')] = $(this).val();
  });
  return payload;
}

function submitCredentials(){
  $.ajax({
    url:'/try',
    contentType:'application/json',
    data: parseCredentials(),
    success: function(data){
      var intermediate = JSON.parse(data.body);
      var payload = JSON.stringify(intermediate, null, 1);
      $('#configText').val(payload);
    }
  });
}

function getConfigClick(){
  $('#getConfig').click(function(){
    submitCredentials();
  });
}

function sendConfigClick(){
  $('#sendChange').click(function(){
    var massager = {};
    massager['configData']=JSON.parse($('#configText').val());
    massager['credentials']=parseCredentials();

    // console.logging raw payload sent from browser
    console.log(massager);

    $.ajax({
      type:'POST',
      contentType: "application/json",
      data: JSON.stringify(massager)
    });
    window.location.reload();
  });
}

// onload functions
$(function(){
  getConfigClick();
  sendConfigClick();
});
