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


///------------------Index page -------------------------///
function fnSignup(){
    
    var fname=document.getElementById('sgn_fname');
    var lname=document.getElementById('sgn_lname');
    var email=document.getElementById('sgn_uemail');
    var gender = document.getElementsByName("sgn_gender");
    var genderVal="";
       
    for(var i=0;i<gender.length;i++)
    {
        if(gender[i].checked)
        {
           genderVal= gender[i].value;
            break;
        }
    }
    var  pass=document.getElementById('sgn_upass');
    var confPass=document.getElementById('sgn_ucpass');
    if(pass.value.length<6)
    {   
        modalboxAlert("Password must be atleast 6 characters long","red");
    }
    else{
            if(pass.value==confPass.value){
                auth.createUserWithEmailAndPassword(email.value, pass.value) //promise
                .then(function (user) {
                    return user.updateProfile({ displayName: fname.value+" "+lname.value }) // updating info of user
                        .then(function () {
                            name.value="";
                            email.value="";
                            gender[0].checked=true;
                            pass.value="";
                            confPass.value="";
                            switchLoginSignup(0);
                            modalboxAlert("User has created","#1C7705");
                        })
                        .catch(function(error){
                              modalboxAlert(error.message,"red");
                        })
                })
                .catch(function (error) {
                      modalboxAlert(error.message,"red");
                }) 
            }
            else{
               modalboxAlert("Password does not match the confirm password.","red");
            }
    }
    
}

function fnLogin()
{
    var email=document.getElementById("lgn_uemail");
    var password=document.getElementById("lgn_upass");
    auth.signInWithEmailAndPassword(email.value,password.value)
    .then(function(user){
        sessionStorage.setItem("Eventp_userInfo",JSON.stringify(user));
        console.log(JSON.stringify(user));
        location.href="home.html";
    })
    .catch(function(error)
    {
        modalboxAlert(error.message,"red");
    })
}
function switchLoginSignup(val){
    var loginDiv=document.getElementById("loginDiv");
    var signupdiv=document.getElementById("signupDiv");
    if(val==0)
    {
        signupdiv.style.display = "none";
        loginDiv.style.display = "block";
    }
    else{
         loginDiv.style.display = "none";
         signupdiv.style.display = "block";
    }
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



///------------------Home page -------------------------///

/* Event Creation Method */
function fnCreateEvent(){
   var evnName=document.getElementById('evnName');
   var evnDescr=document.getElementById('evnDesc');
   
   var createEvent={
     eventTitle:evnName.value,
     eventTime: createFullDate(),
     eventDesc:evnDescr.value,
     createdTime:created_Time(),
     createrID: JSON.parse(sessionStorage.getItem('Eventp_userInfo')).email,
     createrName:JSON.parse(sessionStorage.getItem('Eventp_userInfo')).displayName,
     goingId:['none']
   }
   database.child("eventPosts").push(createEvent);
   evnName.value="";
   evnDescr.value="";
   document.getElementById('e-datepicker').value="";
   document.getElementById('evnHour').selectedIndex=0;
   document.getElementById('evnMin').selectedIndex=0;
   document.getElementById('evn-Am-Pm').selectedIndex=0;
  
    $("#myModal").css("display","none");
    modalboxAlert("Event created","green"); 
}
/* Filling textboxes with value for edit */
function fillData(evnt){
    modalboxShow(2);
    function monthNametoNum(monthName){
        switch(monthName){ 
                      case "Jan" :monthName="01"; break;
                      case "Feb" :monthName="02"; break;
                      case "Mar" :monthName="03"; break;
                      case "Apr" :monthName="04"; break;
                      case "May" :monthName="05"; break;
                      case "Jun" :monthName="06"; break;
                      case "July":monthName="07"; break;
                      case "Aug" :monthName="08"; break;
                      case "Sep" :monthName="09"; break;
                      case "Oct" :monthName="10"; break;
                      case "Nov" :monthName="11"; break;
                      case "Dec" :monthName="12";}
        return monthName;
    }
    
    document.getElementById('evnName').value=evnt.eventTitle;
    document.getElementById('evnDesc').value=evnt.eventDesc.trim();
    
    var month=monthNametoNum(evnt.eventTime.substring(3,6));
    var date=month+"/"+evnt.eventTime.slice(0,2)+evnt.eventTime.slice(6);
    var isTime=false;
    if(date.indexOf(" ")>-1)
    {
       var time=date.split(" ");
       document.getElementById('e-datepicker').value=time[0];
       var getTime=time[1].split(':');
       document.getElementById('evnHour').value=getTime[0];
       document.getElementById('evnMin').value=getTime[1].slice(1);
       document.getElementById('evn-Am-Pm').value=time[2]=='AM'?0:1; 
       document.getElementById("evnDefTime").checked=true;
       document.getElementById("evnTime").style.display="";
    }
    else{
       document.getElementById('e-datepicker').value= date;
       document.getElementById('evnHour').value=1;
       document.getElementById('evnMin').value=0;
       document.getElementById('evn-Am-Pm').value=0; 
       document.getElementById("evnDefTime").checked=false;
       document.getElementById("evnTime").style.display="none";
    }
    document.getElementById("modal-form").onsubmit=function(){ UpdateEntry(evnt); };
}
/* Event Editing Method */
function UpdateEntry(evnt){
    var FormElements = document.getElementById("modal-form").elements;
    var elemObj ={};
    for(var i = 0 ; i < FormElements.length ; i++){
        var item = FormElements.item(i);
        elemObj[item.id] = item.value;
    }
    if(evnt.eventTitle!=elemObj.evnName)
    {
       database.child("eventPosts").child(evnt.id).child("eventTitle").set(elemObj.evnName);
    }
    
    if(evnt.eventDesc!=elemObj.evnDesc)
    {
       database.child("eventPosts").child(evnt.id).child("eventDesc").set(elemObj.evnDesc);
    }
    database.child("eventPosts").child(evnt.id).child("eventTime").set(createFullDate());
    $("#myModal").css("display","none");
    modalboxAlert("Event edited","green");
    resetValues();
}
database.child("eventPosts").on("child_added",function(snapshot){
    var obj = snapshot.val();
    obj.id = snapshot.key;
    render(obj, "create");
})
database.child("eventPosts").on("child_changed",function(snapshot){
    var obj = snapshot.val();
    obj.id = snapshot.key;
    render(obj, "edit");
})
function render(events,status){
   var pgdetctor= document.getElementById("pagedetector");
   if(pgdetctor.value=='home')
   {
     if(status=="create"){
       var eventDetails = document.getElementById('table-eventDetail'); 
       if(events.createrID==JSON.parse(sessionStorage.getItem('Eventp_userInfo')).email){
            var tr= document.createElement("tr");
            tr.setAttribute("id","tr-"+events.id);
            
            for(var i=1;i<=6;i++)
            {
                var td=document.createElement('td');    
                if(i==1){
                  var text=document.createTextNode(1);
                  var trs=eventDetails.getElementsByTagName('tr');
                  for(var j=0;j<trs.length;j++)
                  {
                    trs[j].childNodes[0].innerHTML=j+2;  
                  }
                }
                else if(i==2)
                {
                   var text=document.createTextNode(events.eventTitle);
                }
                else if(i==3)
                {
                   var text=document.createTextNode(events.eventDesc);
                }
                else if(i==4)
                {
                   var text=document.createTextNode(events.eventTime);
                }
                else if(i==5)
                {
                   var text=document.createTextNode(events.createdTime);
                }
                else{
                    var editBtn=document.createElement('i');
                    editBtn.setAttribute("class","fa fa-pencil");
                    editBtn.setAttribute("aria-hidden","true");
                    editBtn.onclick = function(){ fillData(events);}
                    var delBtn=document.createElement('i');
                    delBtn.setAttribute("class","fa fa-trash-o");
                    delBtn.setAttribute("aria-hidden","true");
                    delBtn.onclick = function(){ DelEvent(events.id);}
                    var text=document.createElement('span');
                    text.appendChild(editBtn);
                    text.appendChild(delBtn);
                }
                
                
                td.appendChild(text);
                tr.appendChild(td);
            }
            eventDetails.insertBefore(tr, eventDetails.childNodes[0]);            
        }
     }
     else if(status=="edit"){
       var tr= document.getElementById("tr-"+events.id);
       tr.childNodes[1].innerHTML=events.eventTitle;
       tr.childNodes[2].innerHTML=events.eventDesc;
       tr.childNodes[3].innerHTML=events.eventTime;
       tr.childNodes[5].childNodes[0].childNodes[0].onclick = function(){ fillData(events);}
     }    
   }
}
function createFullDate()
{
   var datePickr=document.getElementById('e-datepicker').value; 
   var month=datePickr.slice(0,2);
   switch(month){ case "01" :month="Jan"; break;
                      case "02" :month="Feb"; break;
                      case "03" :month="Mar"; break;
                      case "04" :month="Apr"; break;
                      case "05" :month="May"; break;
                      case "06" :month="Jun"; break;
                      case "07" :month="July"; break;
                      case "08" :month="Aug"; break;
                      case "09" :month="Sep"; break;
                      case "10" :month="Oct"; break;
                      case "11" :month="Nov"; break;
                      case "12" :month="Dec";}
   datePickr=datePickr.slice(3,5)+"/"+month+"/"+datePickr.slice(6);
   if(document.getElementById("evnDefTime").checked==true){
      var amPm=document.getElementById('evn-Am-Pm');
      var evnMin=document.getElementById('evnMin');   
      var evnTime=datePickr+" "+document.getElementById('evnHour').value+":"+evnMin.options[evnMin.selectedIndex].text+" "+amPm.options[amPm.selectedIndex].text;  
   }
   else{
      var evnTime=datePickr;
   }
   return evnTime;
}

function resetValues(){
    document.getElementById('evnName').value="";
    document.getElementById('evnDesc').value="";
    document.getElementById('e-datepicker').value="";
    document.getElementById('evnHour').selectedIndex=0;
    document.getElementById('evnMin').selectedIndex=0;
    document.getElementById('evn-Am-Pm').selectedIndex=0; 
    document.getElementById("evnDefTime").checked=true;
    document.getElementById("modal-form").onsubmit=function(){fnCreateEvent(); };
}

function DelEvent(eventId){
    database.child("eventPosts/"+eventId).remove();
}
database.child("eventPosts").on("child_removed",function(snapshot){
    document.getElementById("tr-"+snapshot.key).remove();
    var eventDetails = document.getElementById('table-eventDetail'); 
    var trs=eventDetails.getElementsByTagName('tr');
    for(var j=0;j<trs.length;j++)
    {
      trs[j].childNodes[0].innerHTML=j+1;  
    }
})
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
function ChangeTextElemToDate(){
  var seachBy=document.getElementById("searchBy").value;  
  var sB=document.getElementById('searchInput');
  if(seachBy==3)
  {
    var date=new Date();
    month=date.getMonth();
    month = month < 10 ? '0'+(month+1) : month+1;
    var dt=date.getDate()<"10"?"0"+date.getDate():date.getDate();
   sB.setAttribute("id","searchDate");
   sB.setAttribute("type","date");
   sB.setAttribute("value",date.getFullYear()+"-"+month+"-"+dt);
   //searchEvents();
  }
  else{
    var sdt=document.getElementById('searchDate');
    if(sdt){
        sdt.setAttribute("id","searchInput");
        sdt.setAttribute("type","text");
        sdt.setAttribute("value","");
    }
    
  }  
}
function searchEvents(){
  var input, filter, table, tr, td, i;
  var seachBy=document.getElementById("searchBy").value;
  if(seachBy!=3 )
  {
    input = document.getElementById("searchInput");
    filter = input.value.toLowerCase();
  }
  else{
    input = document.getElementById("searchDate");
    filter = input.value.toString()
    var month=monthName(filter.slice(5,7));
    filter = filter.slice(8)+"/"+month+"/"+filter.slice(0,4);
   
  }
  tbody = document.getElementById("table-eventDetail");
  tr = tbody.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    if(seachBy==1)
    {
    td = tr[i].getElementsByTagName("td")[1];
    }
    else if(seachBy==2)
    {
      td = tr[i].getElementsByTagName("td")[2];
    }
    else if(seachBy==3)
    {
      if(filter){ 
      td = tr[i].getElementsByTagName("td")[3];
      }
    }    
    if (td && filter!="//") {
      if (td.innerHTML.toLowerCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
    else{
        tr[i].style.display = "";
    }
  }
}
function monthName(monthnum)
{
 var month=monthnum;
 switch(month){ case "01" :month="jan"; break; case "02" :month="feb"; break; case "03" :month="mar"; break; case "04" :month="apr"; break; case "05" :month="may"; break; case "06" :month="jun"; break; case "07" :month="july"; break; case "08" :month="aug"; break; case "09" :month="sep"; break; case "10" :month="oct"; break; case "11" :month="nov"; break; case "12" :month="dec";}   
    return month;
}
function created_Time() {
                      var date=new Date();
                      var hours = date.getHours();
                      var minutes = date.getMinutes();
                      var day=date.getDate();
                      var month=date.getMonth();
                      var fullYear=date.getFullYear();
                      switch(month){ case 0 :month="Jan"; break;
                      case 1 :month="Feb"; break;
                      case 2 :month="Mar"; break;
                      case 3 :month="Apr"; break;
                      case 4 :month="May"; break;
                      case 5 :month="Jun"; break;
                      case 6 :month="July"; break;
                      case 7 :month="Aug"; break;
                      case 8 :month="Sep"; break;
                      case 9 :month="Oct"; break;
                      case 10 :month="Nov"; break;
                      case 11 :month="Dec";}
                      var ampm = hours >= 12 ? 'PM' : 'AM';
                      hours = hours % 12;
                      hours = hours ? hours : 12; // the hour '0' should be '12'
                      minutes = minutes < 10 ? '0'+minutes : minutes;
                      return(day+"/"+month+"/"+fullYear+" "+hours + ':' + minutes + ' ' + ampm);
}

var ipArr=[];
database.child("ipget").on("child_added",function(snapshot){
    var obj = snapshot.val();
     //ipArr.push(obj);
      //document.getElementById("ipcount").innerHTML="Visitor count:"+ipArr.length;
      
})

function fnUserCounter(ip){
    setTimeout(function(){
        
          database.child("ipget").push(ip); 
        
    },10000)  
}