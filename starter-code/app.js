firebase.initializeApp(config);

var messageAppReference = firebase.database();

$(() => {
  console.log(messageAppReference)

  $('#message-form').submit(event => {
    event.preventDefault()
 
    var message = $('#message').val()
    $('#message').val('')
 
    var messagesReference = messageAppReference.ref('messages');
 
    messagesReference.push({
      message: message,
      votes: 0
    })
  })

  function getFanMessages() {
    messageAppReference
    .ref('messages')
    .on('value', (results) => {
      let allMessages = results.val()
      let $messageBoardDiv = $('.message-board');
      
      for (let msg in allMessages) {        
        var $upVoteElement = $(`<i class="fa fa-thumbs-up pull-right"></i>`)
        $upVoteElement.on('click', () => {

        })

        var $downVoteElement = $(`<i class="fa fa-thumbs-down pull-right"></i>`)
        $downVoteElement.on('click', (e) => {
          let id = e.target.parentNode.id
          console.log(id)
        })        
        
        var $deleteElement = $(`<i class="fa fa-trash pull-right delete"></i>`)
        $deleteElement.on('click', () => {

          console.log("delete")
        })

        var $votes = $(`<div class="pull-right">${allMessages[msg].votes}</div>`)

        console.log(msg)
        let $newMessage = $(`<li id=${msg}>${allMessages[msg].message}</li>`);

        $newMessage
          .append($votes)
          .append($deleteElement)
          .append($downVoteElement)
          .append($upVoteElement)

        $messageBoardDiv.append($newMessage);
      }
    })
  }



  
  
  
  getFanMessages()
})
