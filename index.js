var db = firebase.database()
var user = {
  username: "hashrock",
  x: 0,
  y: 0,
  log: {}
}

function writeUserData(userId, name) {
  db.ref('users/' + userId).set({
    username: name,
    x: 0,
    y: 0,
    log: {}
  });
}
function move(userId, x, y){
  db.ref('users/' + userId).set({
    ...user, 
    x: x,
    y: y,
    log: {}
  });
}


var usersRef = db.ref('users/');

new Vue({
  el: "#app",
  data(){
    return {
      user: {
        name: "",
        x: 0,
        y: 0,
        log: {}
      }
    }
  },
  methods:{
    update(){
      writeUserData("0", "hashrock")
    },
    move(){
      move("0", 100, 100)
    },
    say(){
      var logRef = db.ref('users/1/log');
      logRef.set("" + new Date().getTime(), "Hello")
      // this.user.log[] = "Hello"
      // if(this.user.log.length > 10){
      //   this.user.log.splice(0, 1)
      // }
    }
  },
  mounted(){
    usersRef.on('value',  (snapshot) =>{
      var val = snapshot.val()["0"]
      this.user = val
    });
    
  }
})