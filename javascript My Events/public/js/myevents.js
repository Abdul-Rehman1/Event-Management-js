  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDkZ_m4wABUApwwx51CiTeachceRaMpY9g",
    authDomain: "event-management-5fda4.firebaseapp.com",
    databaseURL: "https://event-management-5fda4.firebaseio.com",
    projectId: "event-management-5fda4",
    storageBucket: "",
    messagingSenderId: "30285929873"
  };
  firebase.initializeApp(config);

var database = firebase.database().ref(); //access firebase Database 
var auth = firebase.auth();  // access authentication service

database.child("eventPosts").on("child_added",function(snapshot){
    var obj = snapshot.val();
    obj.id = snapshot.key;
    render(obj);
})
database.child("eventPosts").on("child_changed",function(snapshot){
    var obj = snapshot.val();
    obj.id = snapshot.key;
    render(obj);
})
function render(events){
   if(events.goingId.indexOf(JSON.parse(sessionStorage.getItem('Eventp_userInfo')).email)>-1){
        
        var eventDetails = document.getElementById('div-eventDetail');
        if(eventDetails.getElementsByTagName('span').length>0) 
        eventDetails.removeChild(eventDetails.getElementsByTagName('span')[0]);
        
        var card= document.createElement("div");
        card.setAttribute("id","div-"+events.id);
        card.setAttribute("class","card");
        cardbody= document.createElement("div");
        cardbody.setAttribute("class","card-body");
                   
        var Title=document.createElement('h4');
        Title.appendChild(document.createTextNode(events.eventTitle));
        Title.setAttribute("class","card-title");
        
        var nameOFUser=document.createElement('h6');
        nameOFUser.appendChild(document.createTextNode("By "+events.createrName+" at "+events.createdTime));
        nameOFUser.setAttribute("class","card-subtitle mb-2 text-muted");
        
        var discription=document.createElement('p');
        discription.appendChild(document.createTextNode("Description:"+events.eventDesc));
        discription.setAttribute("class","card-text");
        
        var eventTime=document.createElement('h6');
        eventTime.appendChild(document.createTextNode("Event Date "+events.eventTime));
        eventTime.setAttribute("class","card-subtitle mb-2 text-muted")
        
        var goingAnchor=document.createElement('a');
        goingAnchor.appendChild(document.createTextNode("Not Going"));
        goingAnchor.setAttribute("class","card-link");
        goingAnchor.setAttribute("href","javaScript:void(0)");
        goingAnchor.onclick=function(){ fnNotGoing(events)  }
        
        cardbody.appendChild(Title);
        cardbody.appendChild(nameOFUser);
        cardbody.appendChild(discription);
        cardbody.appendChild(eventTime);
        cardbody.appendChild(goingAnchor);
        
        card.appendChild(cardbody);
            

       eventDetails.insertBefore(card, eventDetails.childNodes[0]);            
   }     
}

function fnNotGoing(events){
    var going=[];
    var i=0;
    for(var prop in events.goingId)
    {
      if(events.goingId[prop]=="none"){}
      else{
        going[i]=events.goingId[prop];
        i++;
      } 
    }
    var loc = going.indexOf(JSON.parse(sessionStorage.getItem('Eventp_userInfo')).email);
    going.splice(loc, 1) 
    database.child("eventPosts").child(events.id).child("goingId").set(going);
    var card = document.getElementById("div-"+events.id);
    for(var i=0;i<card.children.length;i++)
    {
        card.children[i].remove();
    }
    document.getElementById("div-eventDetail").removeChild(card);
    if(document.getElementById("div-eventDetail").children.length==0)
    {
      var span=document.createElement('span');
      span.appendChild(document.createTextNode("List is empty"));
      document.getElementById("div-eventDetail").appendChild(span);
    }
}

function modalboxAlert(msg,color){
        
            
            var modal = document.getElementById('modal-message'); // Get the modal
            var span = document.getElementsByClassName("close")[0]; // Get the <span> element that closes the modal
             
             
                modal.classList.add('modal-alert');
                modal.classList.remove('modal-temp');
                modal.style.backgroundColor=color;
                
                document.getElementById('msg').innerHTML= msg ;                
            
            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
               modal.classList.add('modal-temp');
               modal.classList.remove('modal-alert');
            }
            
            //close After 3 seconds
              setTimeout(function(){  modal.classList.add('modal-temp');
               modal.classList.remove('modal-alert'); }, 4000);
            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.classList.add('modal-temp');
                    modal.classList.remove('modal-alert');
                }
            }
}

var ipArr=[];
database.child("ipget").on("child_added",function(snapshot){
    var obj = snapshot.val();
    // ipArr.push(obj);
      //document.getElementById("ipcount").innerHTML="Visitor count:"+ipArr.length;
      
})
function fnUserCounter(ip){
    setTimeout(function(){
        
          database.child("ipget").push(ip); 
        
    },10000)  
}

function fnlogout(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        sessionStorage.clear();
        location.reload(true);
    }, function(error) {
        // An error happened.
    });
}