firebase.initializeApp(config);
var messageAppReference = firebase.database();
var messageAppAuth = firebase.auth();

$(() => {
  var firebaseCurrentUser = {};
  var $messageBoardDiv = $('.message-board');

  $('#message-form').submit(event => {
    event.preventDefault()
 
    var message = $('#message').val()
    $('#message').val('')
 
    var messagesReference = messageAppReference.ref('messages');
 
    messagesReference.push({
      message: message,
      votes: 0,
      user: messageAppAuth.currentUser.uid,
      email: messageAppAuth.currentUser.email
    })
  })  

  function getFanMessages() {    
    // var firebaseCurrentUser = {};
    console.log(firebaseCurrentUser)
    // console.log(firebaseCurrentUserId)

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
          let userId = e.target.parentNode.getAttribute('data-user')
          
          console.log(userId)
          console.log(messageAppAuth.currentUser.uid)
          
          if (userId === messageAppAuth.currentUser.uid) {
            messageAppReference
            .ref(`messages/${id}`)
            .remove()
              .then(() => { console.log("Remove succeeded.") })
              .catch(error => { console.log("Remove failed: " + error.message) });
          } else {
            alert(`Only ${messageAppAuth.currentUser.email} can delete that!!`)
          }
        })

        // CREATE VOTES DISPLAY
        var $votes = $(`<div class="pull-right">${allMessages[msg].votes}</div>`)

        // CREATE NEW MESSAGE LI ELEMENT
        let $newMessage = $(`<li id=${msg} data-user=${allMessages[msg].user} data-votes=${allMessages[msg].votes}>${allMessages[msg].message}</li>`);
        
        // CREATE CURRENT USER DISPLAY
        var $firebaseCurrentUser = $(`<div class="pull-right">${allMessages[msg].email}</div>`)

        // APPEND ICONS TO THE LI
        $newMessage
          .append($votes)
          .append($deleteElement)
          .append($downVoteElement)
          .append($upVoteElement)
          .append($firebaseCurrentUser)

        // APPEND NEW MESSAGE TO MESSAGE BOARD  
        $messageBoardDiv
          .append($newMessage);
      }
    })
  }  
  
// FIREBASE AUTH STUFF
 /**
     * Handles the sign in button press.
     */
    function toggleSignIn() {
      if (messageAppAuth.currentUser) {
        firebaseCurrentUser = messageAppAuth.currentUser
        console.log(firebaseCurrentUser)
        // [START signout]
        messageAppAuth.signOut();
        // [END signout]
      } else {
        // firebaseCurrentUser = "Not Logged In"
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
          alert('Please enter an email address.');
          return;
        }
        if (password.length < 4) {
          alert('Please enter a password.');
          return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        messageAppAuth.signInWithEmailAndPassword(email, password)
        .then(response => {
          console.log(response.user.uid)
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
          document.getElementById('quickstart-sign-in').disabled = false;
          // [END_EXCLUDE]
        });
        // [END authwithemail]
      }
      document.getElementById('quickstart-sign-in').disabled = true;
    }
    /**
     * Handles the sign up button press.
     */
    function handleSignUp() {
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Sign in with email and pass.
      // [START createwithemail]
      messageAppAuth.createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
      });
      // [END createwithemail]
    }
    /**
     * Sends an email verification to the user.
     */
    function sendEmailVerification() {
      // [START sendemailverification]
      firebase.auth().currentUser.sendEmailVerification().then(function() {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert('Email Verification Sent!');
        // [END_EXCLUDE]
      });
      // [END sendemailverification]
    }
    function sendPasswordReset() {
      var email = document.getElementById('email').value;
      // [START sendpasswordemail]
      firebase.auth().sendPasswordResetEmail(email).then(function() {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        alert('Password Reset Email Sent!');
        // [END_EXCLUDE]
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
          alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
      });
      // [END sendpasswordemail];
    }
    /**
     * initApp handles setting up UI event listeners and registering Firebase auth listeners:
     *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
     *    out, and that is where we update the UI.
     */
    function initApp() {
      // Listening for auth state changes.
      // [START authstatelistener]
      firebase.auth().onAuthStateChanged(function(user) {
        // [START_EXCLUDE silent]
        document.getElementById('quickstart-verify-email').disabled = true;
        // [END_EXCLUDE]
        if (user) {
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          // [START_EXCLUDE]
          document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
          document.getElementById('quickstart-sign-in').textContent = 'Sign out';
          document.getElementById('quickstart-account-details').textContent = JSON.stringify({uid: user.uid, email: user.email}, null, '  ');
          if (!emailVerified) {
            document.getElementById('quickstart-verify-email').disabled = false;
          }
          // [END_EXCLUDE]
        } else {
          // User is signed out.
          // [START_EXCLUDE]
          document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
          document.getElementById('quickstart-sign-in').textContent = 'Sign in';
          document.getElementById('quickstart-account-details').textContent = 'null';
          // [END_EXCLUDE]
        }
        // [START_EXCLUDE silent]
        document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
      });
      // [END authstatelistener]
      document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
      document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
      document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
      document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);

    }
    initApp();
    getFanMessages();
  }) // END READY

