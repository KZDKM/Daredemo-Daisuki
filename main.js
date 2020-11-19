/*

_KZD:
Javascript即世界上最烂的语言
C++是世界上坠好滴语言
JS初见，东西写的贼jb瞎眼
我只会写C++（哭）

*/

var Max_wnd = 20;
var WNDCount = 0;
var Max_row = 2;
var Glob_UID = 0;
var first_wind = false;

//CORS代理字段，跨域是真的nt，我这白嫖的别人的代理，写成var，In case if this shit wont work
var CORS_Proxy = "https://api.codetabs.com/v1/proxy?quest=";


var pg_n = 1;

var Following = [];
var Wnd = [];
var Danmaku_pool = [];

function add_wnd(){
    if(WNDCount+ 1 > Max_wnd) return;
    if(WNDCount + 1 > (Max_row * Max_row)){
        Max_row = Math.ceil(Math.sqrt(WNDCount + 1));
    }
    var orig_node = document.getElementsByClassName("Sub-container").item(0);
    var clone_node = orig_node.cloneNode(true);
    var new_node = orig_node.parentNode.appendChild(clone_node);
    WNDCount++;
    reset_addr(WNDCount);
    var dmk_holder = document.getElementsByClassName("danmaku-placeholder").item(WNDCount).childNodes;
    for (var dph in dmk_holder) {
            var leftover = dmk_holder.item(dph);
            if(!leftover) continue;
            leftover.parentNode.removeChild(leftover);
    }
    
    for(i = 0; i <= WNDCount; i++) {
        var rowcount = WNDCount+1;
        if(rowcount > Max_row) rowcount = Max_row;
        var desired_width = 100 / (rowcount);
        var desired_height = 100 / Math.ceil( (WNDCount + 1) / Max_row);
        if(WNDCount + 1 < Max_row) desired_height = 100;
        if(i == WNDCount && (WNDCount + 1) > Max_row && ((WNDCount + 1) % Max_row) != 0){
            desired_width = 100 / (rowcount) * ((Max_row + 1) - ((WNDCount + 1) % Max_row));
        }
        document.getElementsByClassName("Sub-container").item(i).style.width = desired_width + '%';
        document.getElementsByClassName("Sub-container").item(i).style.height = desired_height + 'vh';
    
        if(WNDCount > 0 && document.getElementsByClassName("Input-placeholder").item(i).style.display != "none"){
            document.getElementsByClassName("Sub-container").item(i).style.border = "dashed white 2px";
        }
    }
}

function delete_wnd(rid){
    for(i = 0; i <= WNDCount; i++) {
        
    }
}

function add_wnd_id(rid,uname){
    if(WNDCount+ 1 > Max_wnd) return;
    if(first_wind == true){
    if(WNDCount + 1 > (Max_row * Max_row)){
        Max_row = Math.ceil(Math.sqrt(WNDCount + 1));
    }
    var orig_node = document.getElementsByClassName("Sub-container").item(0);
    var clone_node = orig_node.cloneNode(true);
    var new_node = orig_node.parentNode.appendChild(clone_node);
    WNDCount++;
    var dmk_holder = document.getElementsByClassName("danmaku-placeholder").item(WNDCount).childNodes;
    for (var dph in dmk_holder) {
            var leftover = dmk_holder.item(dph);
            if(!leftover) continue;
            leftover.parentNode.removeChild(leftover);
        }
    }
    reset_addr(WNDCount);
    set_addr_id(WNDCount,rid,uname);
    if(WNDCount == 0) first_wind = true;
    for(i = 0; i <= WNDCount; i++) {
        var rowcount = WNDCount+1;
        if(rowcount > Max_row) rowcount = Max_row;
        var desired_width = 100 / (rowcount);
        var desired_height = 100 / Math.ceil( (WNDCount + 1) / Max_row);
        if(WNDCount + 1 < Max_row) desired_height = 100;
        if(i == WNDCount && (WNDCount + 1) > Max_row && ((WNDCount + 1) % Max_row) != 0){
            desired_width = 100 / (rowcount) * ((Max_row + 1) - ((WNDCount + 1) % Max_row));
        }
        document.getElementsByClassName("Sub-container").item(i).style.width = desired_width + '%';
        document.getElementsByClassName("Sub-container").item(i).style.height = desired_height + 'vh';
        if(WNDCount > 0 && document.getElementsByClassName("Input-placeholder").item(i).style.display != "none"){
            document.getElementsByClassName("Sub-container").item(i).style.border = "dashed white 2px";
        }
    }
}


function show_Login() {
    var Login_Panel = document.getElementById("Login");
    
    if(Login_Panel.style.display != "none") {
        Login_Panel.style.display = "none";
    }
    else{
        Login_Panel.style.display = "block";
        QR_Login();
    }
    
    
}

function show_LoginID() {
    var Login_Panel = document.getElementById("Login");
    
    if(Login_Panel.style.display != "none") {
        Login_Panel.style.display = "none";
    }
    else{
        Login_Panel.style.display = "block";
        
    }
}

function Get_Following() {
        document.getElementById("Login-Submit").disabled = true;
        document.getElementById("Status").style.color = "Green";
        document.getElementById("Status").innerHTML = "稍候..."
        var req = new XMLHttpRequest();
        var UID = document.getElementById("Login-usr").value;
        req.open("GET",CORS_Proxy + "https://api.bilibili.com/x/relation/followings?vmid=" + UID + "&pn=" + pg_n);
        req.onreadystatechange = function(){
            if(req.readyState == 4){
                if(req.status == 200) {
                    var json_res = JSON.parse(req.responseText);
                    for(var f in json_res.data.list){
                        if(json_res.data.list[f]){
                            //console.log(pg_n+ " " + json_res.data.list[f].uname + " ID：" + json_res.data.list[f].mid);
                            var cur_usr = {
                                "Username" : json_res.data.list[f].uname,
                                "UID" : json_res.data.list[f].mid
                            }
                            Following.push(cur_usr);
                            document.getElementById("Status").innerHTML = "已获取： " + Following.length + "个UP";
                        }
                        else{
                            console.log("skip");
                        }
                    }
                    if(pg_n < 5) { 
                        pg_n++;
                        Get_Following();
                    }else{
                        if(Following.length == 0){
                            document.getElementById("Status").style.color = "red";
                            document.getElementById("Status").innerHTML = "错误：没有获取到任何关注，检查UID";
                            document.getElementById("Login-Submit").disabled = false;
                            pg_n = 0;
                        }
                    }
                }
            }
        };
        req.send();

}

var can_proceed = true;

var timer = window.setInterval(function(){
        if(can_proceed && Following.length != 0 && req_rep < 100){
            if(usr_idx > Following.length){
            usr_idx = 0;
            }
            else {
                usr_idx++;
                req_rep++;
            }
            Following_Manager();
        }
},1000 * 3);

var rep = window.setInterval(function(){
    
        req_rep = 0;
    
    
},1000 * 600);


var req_rep = 0;

var usr_idx = -1;

function Following_Manager() {
                var req = new XMLHttpRequest();
                req.open("GET", CORS_Proxy + "https://api.bilibili.com/x/space/acc/info?mid=" + Following[usr_idx].UID);
                console.log(Following[usr_idx].Username + " checking..." + usr_idx);
                can_proceed = false;
                req.onreadystatechange = function(){
                    if(req.readyState == 4){
                        can_proceed = true;
                        if(req.status == 200){
                            var json_res = JSON.parse(req.responseText);
                            if(json_res.data == null){
                                document.getElementById("Status").innerHTML = "轮询中: " + usr_idx + " " +  Following[usr_idx].Username + " 错误（无响应）";
                                        document.getElementById("Status").style.color = "red";
                            }
                            if(json_res.data.live_room.liveStatus){
                               
                                document.getElementById("Status").style.color = "green";
                                for(var l in Wnd){
                                    if(Wnd[l] == json_res.data.live_room.roomid){
                                        document.getElementById("Status").innerHTML = "轮询中: " + usr_idx + " " +  Following[usr_idx].Username + " 目前在线";
                                        return;}
                                }
                                document.getElementById("Status").innerHTML = "轮询中: " + usr_idx + " " +  Following[usr_idx].Username + " 在线，正在加载直播间...";
                                add_wnd_id(json_res.data.live_room.roomid,Following[usr_idx].Username  + " 的直播间");
                            }else{
                                document.getElementById("Status").innerHTML = "轮询中: " + usr_idx + " " +  Following[usr_idx].Username + " 不在线";
                                document.getElementById("Status").style.color = "black";
                            }
                        }
                    }
                };
                req.send();
        
}

var msg_logger = window.setInterval(function(){
    Message_manager();
},1000* 2);

var danmaku_wave = true;

var dmk_interval = 0;


function Message_manager(){
    if(dmk_interval > 0) {
        dmk_interval--;
        return;
    }
    var repetition = [];
    danmaku_wave = true;
    var dmk_len = -1;
    for(var m_idx = message_pool.length-1; m_idx >= 0 ; m_idx--){
        //弹幕
        if(message_pool[m_idx].content.cmd == "DANMU_MSG" && danmaku_wave){
            var createnew = true;
            var idx = 0;
            var content = message_pool[m_idx].content.info[1];
            var danmaku_color = message_pool[m_idx].content.info[0][3];
            var roomid = message_pool[m_idx].id;
            var this_dmk_len = Math.floor(content.length / 5);
            if (this_dmk_len > dmk_len) {
                dmk_len = this_dmk_len;
            }
            for(var k in repetition){
                if(repetition[k].roomid == roomid){
                    createnew = false;
                    idx = k;
                }
                
            }
            if(createnew){
                var newline = {"roomid":roomid,"rep":0};
                repetition.push(newline);
                idx = repetition.length-1;
            }
            
            if(repetition[idx].rep <= 20){
                    
                    console.log("RoomID: " + roomid + " Sent:" + content);
                    Danmaku_launcher(roomid, content, repetition[idx].rep, danmaku_color); 
                    
            }
                
            repetition[idx].rep++;
                
            
        }
        //SC
        if(message_pool[m_idx].content.cmd == "SUPER_CHAT_MESSAGE"){
            var content = message_pool[m_idx].content.info[1];
            var roomid = message_pool[m_idx].id;
            //content.data.price
            //content.data.message
            /*background_bottom_color: "#427D9E"
            background_color: "#DBFFFD"
            background_color_end: "#29718B"
            background_color_start: "#4EA4C5"
            background_icon: ""
            background_image: "https://i0.hdslb.com/bfs/live/a712efa5c6ebc67bafbe8352d3e74b820a00c13e.png"
            background_price_color: "#7DA4BD"
            color_point: 0.7
            end_time: 1604415608
            gift: {num: 1, gift_id: 12000, gift_name: "醒目留言"}
            id: 810355
            is_ranked: 1
            is_send_audit: "0"
            medal_info: {icon_id: 0, target_id: 387636363, special: "", anchor_uname: "雫るる_Official", anchor_roomid: 21013446, …}
            message: "明天最后一场考试了，mia可以给我加个油吗！然后今日もめっちゃかわいくて大好き！"
            message_font_color: "#A3F6FF"
            message_trans: ""
            price: 50
            rate: 1000
            start_time: 1604415488
            time: 119
            token: "1E351EF3"
            trans_mark: 0
            ts: 1604415489
            uid: 494744
            user_info: {uname: "テルルルル", face: "http://i2.hdslb.com/bfs/face/ba51a1cee752c9d4bf2ee37f3e02a615
            */
            
        }
        
        
        
        message_pool.splice(m_idx,1);
        
    }
    dmk_interval = dmk_len;
}

async function Danmaku_launcher(wnd_id,content,row_num,color) {
    var new_dmk = document.createElement("h4");
    var dmk = document.getElementsByName(wnd_id).item(0).appendChild(new_dmk);
    dmk.className = "right";
    dmk.style.float = "right";
    dmk.style.transform = `translateX(${(-dmk.parentElement.clientWidth) - 500 + (100* Math.random())}px)`;
    dmk.innerHTML = content;
    dmk.className = "left";
    dmk.style.color = "#" + color.toString(16);
    dmk.addEventListener('transitionend', function(dmk) {
        this.parentNode.removeChild(this);
        this.style.transform = null;
    },false);
   dmk.style.top = (row_num * dmk.clientHeight) + 2 + "px";
}

async function Superchat_launcher(wnd_id,content,price,sender) {
    var new_sc = document.createElement("div");
    var pic = document.createElement("img");
    var dmk = document.getElementsByName(wnd_id+"sc").item(0).appendChild(new_dmk);
}

function sleep(delay) {
    var start = (new Date()).getTime();
    while((new Date()).getTime() - start < delay) {
        continue;
    }
}


async function Check_Login() {
    for (var i = 0; i < 600; i++) {
        await sleep(3000);
        var req = new XMLHttpRequest();
        req.open("Post", CORS_Proxy + "https://passport.bilibili.com/qrcode/getLoginInfo");
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        var Form = new FormData();
        Form.append("oauthKey", Glob_authkey);
        req.onreadystatechange = function(){
            if(req.readyState == 4){
                if(req.status == 200){
                    var res_json = JSON.parse(req.responseText);    
                    if(res_json.status == true){
                        console.log("Logged in");
                    }
                }
            }
        };
        req.send(encodeURI("oauthKey=" + Glob_authkey));
    }
}


var Glob_authkey = "";

function QR_Login() {
    var req = new XMLHttpRequest();
    req.open("GET",CORS_Proxy + "https://passport.bilibili.com/qrcode/getLoginUrl");
    req.onreadystatechange = function(){
        if(req.readyState == 4){
            if(req.status == 200){
                var json_res = JSON.parse(req.responseText);
                var Placeholder = document.getElementById("QR_placeholder");
                if(Placeholder.childNodes[0]){
                    Placeholder.removeChild(Placeholder.childNodes[0]);
                }
                var QR_Element = jQuery('#QR_placeholder').qrcode({text: json_res.data.url});
                QR_Element.id = "QR";
                Glob_authkey = json_res.data.oauthKey;
                Check_Login();
            }
        }
    };
    req.send();
    var Placeholder = document.getElementById("QR_placeholder");
                if(Placeholder.childNodes[0]){
                    Placeholder.removeChild(Placeholder.childNodes[0]);
    }
}

function cleanString(input) {
    var output = "";
    for (var i=0; i<input.length; i++) {
        if (input.charCodeAt(i) <= 127) {
            output += input.charAt(i);
        }
    }
    return output;
}

const textEncoder = new TextEncoder('utf-8');
const textDecoder = new TextDecoder('utf-8');

const readInt = function(buffer,start,len){
  let result = 0
  for(let i=len - 1;i >= 0;i--){
    result += Math.pow(256,len - i - 1) * buffer[start + i]
  }
  return result
}

const writeInt = function(buffer,start,len,value){
  let i=0
  while(i<len){
    buffer[start + i] = value/Math.pow(256,len - i - 1)
    i++
  }
}

const encode = function(str,op){
  let data = textEncoder.encode(str);
  let packetLen = 16 + data.byteLength;
  let header = [0,0,0,0,0,16,0,1,0,0,0,op,0,0,0,1]
  writeInt(header,0,4,packetLen)
  return (new Uint8Array(header.concat(...data))).buffer
}
const decode = function(blob){
  return new Promise(function(resolve, reject) {
    let reader = new FileReader();
    reader.onload = function (e){
      let buffer = new Uint8Array(e.target.result)
      let result = {}
      result.packetLen = readInt(buffer,0,4)
      result.headerLen = readInt(buffer,4,2)
      result.ver = readInt(buffer,6,2)
      result.op = readInt(buffer,8,4)
      result.seq = readInt(buffer,12,4)
      if(result.op === 5){
        result.body = []
        let offset = 0;
        while(offset < buffer.length){
          let packetLen = readInt(buffer,offset + 0,4)
          let headerLen = 16// readInt(buffer,offset + 4,4)
          let data = buffer.slice(offset + headerLen, offset + packetLen);
          let body = textDecoder.decode(pako.inflate(data));
          if (body) {
              result.body.push(body.slice(body.indexOf("{")));
          }

          offset += packetLen;
        }
      }else if(result.op === 3){
        result.body = {
          count: readInt(buffer,16,4)
        };
      }
      resolve(result)
    }
    reader.readAsArrayBuffer(blob);
  });
}

//{"roomid": int, "content": (JSON)}
var message_pool = [];

//遍历字符串，寻找每一个 ‘{’ 并找到对应的 ‘}’ 并切片
function message_parser(raw,roomid) {
    var closed_bracket = false;
    var bracket_start = false;
    var delta = 0;
    var slice_start = 0;
    if(!raw) return;
    for(var i=0; i<raw.length; i++){
        if(raw[i] == '{') {
            if(bracket_start == false){
                slice_start = i;
            }
            delta++;
            bracket_start = true;
        };
        if(raw[i] == '}'){
            delta--;
        }
        if(delta < 0){
            return;
        }
        if(delta == 0 && bracket_start){
            var njson = {"content" : JSON.parse(raw.slice(slice_start,i+1)),"id": roomid};
            message_pool.push(njson);
            console.log(njson);
            slice_start = i+2;
            bracket_start = false;
        }
    }
}


var target_element = 0;

var last_roomid = 0;

function set_addr(id){
    for(i = 0; i <= WNDCount; i++) {
        if(document.getElementsByClassName("Submit-btn").item(i) == id){
            target_element = i;
            var field = document.getElementsByClassName("Site-field").item(i).value;
            var req = new XMLHttpRequest();
            req.open("GET",CORS_Proxy + "https://api.live.bilibili.com/room/v1/Room/playUrl?cid="+ field +"&platform=h5&qn=10000");
            last_roomid = field;
            req.onreadystatechange = function(){
                if(req.readyState == 4){
                    if(req.status == 200){
                        var res_json = JSON.parse(req.responseText);
                        console.log(res_json.data.durl[1].url);
                        var video = document.getElementsByClassName("content-holder").item(target_element);
                        var hls = new Hls();
                        hls.loadSource(res_json.data.durl[1].url);
                        hls.attachMedia(video);
                        hls.on(Hls.Events.MANIFEST_PARSED,function() {
                        video.play();
                        });
                        var req_rid = new XMLHttpRequest();
                        req_rid.open("GET",CORS_Proxy + "https://api.live.bilibili.com/room/v1/Room/room_init?id="+ field);
                        req_rid.onreadystatechange = function(){
                            if(req_rid.readyState == 4){
                                if(req_rid.status == 200){
                                    var res_rid_json = JSON.parse(req_rid.responseText);
                                    var req_dmk = new XMLHttpRequest();
                                    req_dmk.open("GET",CORS_Proxy + "https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?id="+ res_rid_json.data.room_id);
                                    req_dmk.onreadystatechange = function(){
                                        if(req_dmk.readyState == 4){
                                            if(req_dmk.status == 200){
                                                var res_dmk_json = JSON.parse(req_dmk.responseText);
                                                const ws = new WebSocket("ws://" + res_dmk_json.data.host_list[0].host + ":" + res_dmk_json.data.host_list[0].ws_port + "/sub");
                                                ws.onopen = function () {
                                                    var UID = document.getElementById("Login-usr").value;
                                                    ws.send(encode(JSON.stringify({
                                                        "uid": 0,
                                                        "roomid": res_rid_json.data.room_id,
                                                        "protover": 2,
                                                        "platform": "web",
                                                        "clientver": "1.14.3",
                                                        "type": 2
                                                    }), 7));
                                                    console.log("added " + res_rid_json.data.room_id);
                                                };
                                                setInterval(function () {
                                                  ws.send(encode('', 2));
                                                }, 30000);
                                                ws.onmessage = async function (msgEvent) {
                                                    const packet = await decode(msgEvent.data);
                                                    if(packet.body[0])
                                                    message_parser(packet.body[0], field);
                                                }
                                            }
                                        }
                                    }
                                    req_dmk.send();
                                }
                            }
                        }
                        req_rid.send();
                        document.getElementsByClassName("danmaku-placeholder").item(target_element).setAttribute("name",field);
                        document.getElementsByClassName("content-holder").item(target_element).style.display = "flex";
                        document.getElementsByClassName("Input-placeholder").item(target_element).style.display = "none";
                        document.getElementsByClassName("Sub-container").item(target_element).style.border = "";
                    }
                }
            };
            req.send();
            
        }
    }
    /*console.log("lol");
    for(i = 0; i <= WNDCount; i++) {
        if(document.getElementsByClassName("Submit-btn").item(i) == id){
            var field = document.getElementsByClassName("Site-field").item(i).value;
            document.getElementsByClassName("content-holder").item(i).style.display = "block";
            document.getElementsByClassName("content-holder").item(i).setAttribute("src",field);
            document.getElementsByClassName("Input-placeholder").item(i).style.display = "none";
        }
    }*/
}
function set_addr_id(id,rid,uname){
    

            target_element = id;
            var field = document.getElementsByClassName("Site-field").item(id).value;
            var req = new XMLHttpRequest();
            req.open("GET",CORS_Proxy + "https://api.live.bilibili.com/room/v1/Room/playUrl?cid="+ rid +"&platform=h5&qn=10000&callback=handleresponse");
            req.onreadystatechange = function(){
                if(req.readyState == 4){
                    if(req.status == 200){
                        Wnd.push(rid);
                        var res_json = JSON.parse(req.responseText);
                        console.log(res_json.data.durl[1].url);
                        var video = document.getElementsByClassName("content-holder").item(target_element);
                        var hls = new Hls();
                        hls.loadSource(res_json.data.durl[1].url);
                        hls.attachMedia(video);
                        hls.on(Hls.Events.MANIFEST_PARSED,function() {
                        video.play();
                        });
                        var req_rid = new XMLHttpRequest();
                        req_rid.open("GET",CORS_Proxy + "https://api.live.bilibili.com/room/v1/Room/room_init?id="+ rid);
                        req_rid.onreadystatechange = function(){
                            if(req_rid.readyState == 4){
                                if(req_rid.status == 200){
                                    var res_rid_json = JSON.parse(req_rid.responseText);
                                    var req_dmk = new XMLHttpRequest();
                                    req_dmk.open("GET",CORS_Proxy + "https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?id="+ res_rid_json.data.room_id);
                                    req_dmk.onreadystatechange = function(){
                                        if(req_dmk.readyState == 4){
                                            if(req_dmk.status == 200){
                                                var res_dmk_json = JSON.parse(req_dmk.responseText);
                                                const ws = new WebSocket("ws://" + res_dmk_json.data.host_list[0].host + ":" + res_dmk_json.data.host_list[0].ws_port + "/sub");
                                                ws.onopen = function () {
                                                    var UID = document.getElementById("Login-usr").value;
                                                    ws.send(encode(JSON.stringify({
                                                        "uid": 0,
                                                        "roomid": res_rid_json.data.room_id,
                                                        "protover": 2,
                                                        "platform": "web",
                                                        "clientver": "1.14.3",
                                                        "type": 2
                                                    }), 7));
                                                    console.log("added " + res_rid_json.data.room_id);
                                                };
                                                setInterval(function () {
                                                  ws.send(encode('', 2));
                                                }, 30000);
                                                ws.onmessage = async function (msgEvent) {
                                                    const packet = await decode(msgEvent.data);
                                                    if(packet.body[0])
                                                    message_parser(packet.body[0], rid);
                                                }
                                            }
                                        }
                                    }
                                    req_dmk.send();
                                }
                            }
                        }
                        req_rid.send();
                        document.getElementsByClassName("danmaku-placeholder").item(target_element).setAttribute("name",rid);
                        document.getElementsByClassName("content-holder").item(target_element).style.display = "flex";
                        document.getElementsByClassName("Vid-title").item(target_element).innerHTML = uname;
                        document.getElementsByClassName("Input-placeholder").item(target_element).style.display = "none";
                        document.getElementsByClassName("Sub-container").item(target_element).style.border = "";
                    }
                }
            };
            req.send();
            

}


function reset_addr(id){
    document.getElementsByClassName("content-holder").item(id).removeAttribute("src");
    document.getElementsByClassName("content-holder").item(id).style.display = "none";
    document.getElementsByClassName("Input-placeholder").item(id).style.display = "block";
}