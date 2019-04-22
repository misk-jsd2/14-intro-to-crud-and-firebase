firebase.initializeApp(config);
var messageAppReference = firebase.database();

$(() => {
  var $messageBoardDiv = $('.message-board');
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
      $messageBoardDiv.empty()

      // VAL() IS A FIREBASE METHOD
      let allMessages = results.val()
      
      for (let msg in allMessages) {        
        
        // UPVOTES
        var $upVoteElement = $(`<i class="fa fa-thumbs-up pull-right"></i>`)
        $upVoteElement.on('click', (e) => {
          let id = e.target.parentNode.id
          let updatedUpvotes = parseInt(e.target.parentNode.getAttribute('data-votes')) + 1
          
          messageAppReference
            .ref(`messages/${id}/`)
            .update({votes: updatedUpvotes})
              .then(() => { console.log("Update Upvotes succeeded.") })
              .catch(error => { console.log("Update failed: " + error.message) });
        }) 

        // DOWNVOTES
        var $downVoteElement = $(`<i class="fa fa-thumbs-down pull-right"></i>`)
        $downVoteElement.on('click', (e) => {
          let id = e.target.parentNode.id
          let updatedDownVotes = parseInt(e.target.parentNode.getAttribute('data-votes')) - 1

          messageAppReference
            .ref(`messages/${id}/`)
            .update({votes: updatedDownVotes})
              .then(() => { console.log("Update Downvotes succeeded.") })
              .catch(error => { console.log("Update failed: " + error.message) });
        })        
        
        // DELETE MESSAGE
        var $deleteElement = $(`<i class="fa fa-trash pull-right delete"></i>`)
        $deleteElement.on('click', (e) => {
          let id = e.target.parentNode.id
          
          messageAppReference
          .ref(`messages/${id}`)
          .remove()
            .then(() => { console.log("Remove succeeded.") })
            .catch(error => { console.log("Remove failed: " + error.message) });
        })

        // CREATE VOTES DISPLAY
        var $votes = $(`<div class="pull-right">${allMessages[msg].votes}</div>`)

        // CREATE NEW MESSAGE LI ELEMENT
        let $newMessage = $(`<li id=${msg} data-votes=${allMessages[msg].votes}>${allMessages[msg].message}</li>`);

        // APPEND ICONS TO THE LI
        $newMessage
          .append($votes)
          .append($deleteElement)
          .append($downVoteElement)
          .append($upVoteElement)

        // APPEND NEW MESSAGE TO MESSAGE BOARD  
        $messageBoardDiv
          .append($newMessage);
      }
    })
  }  
  
  getFanMessages()
}) // END READY
