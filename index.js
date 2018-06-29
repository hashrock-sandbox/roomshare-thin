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
      return this.messages.slice(-10)
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
    const app = new PIXI.Application(300, 300, {backgroundColor : 0xEEEEEE});
    document.body.appendChild(app.view);
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    const fav = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAgMAAAAOFJJnAAAADFBMVEVMaXFoaHH///+xsbZ33b8HAAAAAXRSTlMAQObYZgAAADtJREFUeAFjoBiYhoaGgxmhQOAApJlBjAIggxHECEBlRK2CMiJDcTKiVhJWEwtkYFoBtx3mngNwF5IJADN2H9fK38Y8AAAAAElFTkSuQmCC";

    var chr = PIXI.Sprite.fromImage(fav)
    chr.anchor.set(0.5)
    chr.x = 50
    chr.y = 50
    app.stage.scale.x = 4
    app.stage.scale.y = 4
    app.stage.addChild(chr)


  }
})
