const db = firebase.database()
var usersRef = db.ref('users');
var messagesRef = db.ref('messages');

new Vue({
  el: "#app",
  data(){
    return {
      key: "",
      users: {},
      uid: "",
      chatMessage: "",
      messages: []
    }
  },
  computed:{
    filteredMessage(){
      return this.messages.slice(-5)
    }
  },
  methods:{
    sendChat(){
      messagesRef.push({
        id: this.key,
        uid: this.uid,
        message: this.chatMessage
      })
      this.chatMessage = "";
    }
  },
  mounted(){
    if(localStorage.getItem("roomshare-thin-uid")){
      this.uid = localStorage.getItem("roomshare-thin-uid")
    }else{
      const uid = window.prompt("Input username : ", "anonymous")
      this.uid = uid
      localStorage.setItem("roomshare-thin-uid", uid)
    }

    const user = usersRef.push({
      name: this.uid,
      x: 0,
      y: 0
    })

    this.key = user.key

    user.onDisconnect().remove();

    usersRef.on("value", (value)=>{
      this.users = value.val();
    })

    messagesRef.limitToLast(10).on("child_added", (value)=>{
      this.messages.push(value.val())
    })

  }
})
