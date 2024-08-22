const Ws = require('ws');

class WebSocketApi {
    constructor(Ws) {
        this.server = new Ws.Server({
            port: 8000
        }, () => {
            console.log("开始监听8000端口");
        });
    }
    //与前端建立连接
    handleOpen() {
        console.log('BE:WebSocket open');
    }
    //与前端关闭连接
    handleClose() {
        console.log('BE:WebSocket close');
    }
    //错误信息
    handleError() {
        console.log('BE:WebSocket error');
    }
    handleMessage(msg) {
        // //遍历每一条内容信息
        this.server.clients.forEach((c) => {
            // 发送send 信息 到前端
            if (c.readyState === 1) {
                c.send(msg);
            }
        })
    }
    //信息处理
    handleConnection(ws, req) {
        ws.on('message', this.handleMessage.bind(this))
    }
    init() {
        this.server.on('open', this.handleOpen)
        this.server.on('close', this.handleClose)
        this.server.on('error', this.handleError)
        this.server.on('connection', this.handleConnection.bind(this))
    }
}

const p = new WebSocketApi(Ws)

p.init()
