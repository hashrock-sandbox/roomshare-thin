const db = firebase.database()
var usersRef = db.ref('users');
var messagesRef = db.ref('messages');
var chipsRef = db.ref('chips');

new Vue({
  el: "#app",
  data() {
    return {
      key: "",
      users: {},
      uid: "",
      chatMessage: "",
      messages: [],
      chips: [
        "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "",
      ]
    }
  },
  computed: {
    filteredMessage() {
      return this.messages.slice(-10)
    }
  },
  methods: {
    sendChat() {
      messagesRef.push({
        id: this.key,
        uid: this.uid,
        message: this.chatMessage,
      })
      this.chatMessage = "";
    }
  },
  mounted() {
    if (localStorage.getItem("roomshare-thin-uid")) {
      this.uid = localStorage.getItem("roomshare-thin-uid")
    } else {
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

    usersRef.on("value", (value) => {
      this.users = value.val();
    })

    messagesRef.limitToLast(10).on("child_added", (value) => {
      this.messages.push(value.val())
    })
    const app = new PIXI.Application(300, 300, { backgroundColor: 0xEEEEEE });
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

    var el = document.querySelector("canvas#canv")

    var ctx = el.getContext("2d")
    var pp = new Array(256).fill(1);
    var down = false;

    function draw(ctx, ratio){
      for (var i = 0; i < 16; i++) {
        for (var j = 0; j < 16; j++) {
          ctx.fillStyle = pp[j * 16 + i] === 0 ? "rgb(100, 100, 100)" : "rgb(255, 255, 255)";
          ctx.fillRect(i * ratio, j * ratio, ratio, ratio);
        }
      }
    }
    db.ref('chips/' + 0).on("value", (ref)=>{
      Vue.set(this.chips, 0, ref.val())
    })

    el.addEventListener("pointerdown", (ev) => {
      down = true
      el.setPointerCapture(ev.pointerId)
    })
    el.addEventListener("pointerup", ()=>{
      down = false
      var mycanvas = document.createElement("canvas");
      var ctx = mycanvas.getContext("2d")
      draw(ctx, 1);
      var base64= mycanvas.toDataURL('image/png');
      db.ref('chips/' + 0).set(base64)
    })
    el.addEventListener("pointermove", (ev) => {
      if(!down){
        return;
      }
      var x = Math.floor(ev.offsetX / 4);
      var y = Math.floor(ev.offsetY / 4);
      pp[y * 16 + x] = 0;
      draw(ctx, 4)
    })
  }
})
