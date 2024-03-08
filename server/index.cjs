const Ws = require('ws');

; ((Ws) => {
    //接口 为8000
    const server = new Ws.Server({
        port: 8000
    });
    const init = () => {
        bindEvent()
    }
    function bindEvent() {
        server.on('open', handleOpen)
        server.on('close', handleClose)
        server.on('error', handleError)
        server.on('connection', handleConnection)
    }
    //与前端建立连接
    function handleOpen() {
        console.log('BE:WebSocket open');
    }
    //与前端关闭连接
    function handleClose() {
        console.log('BE:WebSocket close');
    }
    //错误信息
    function handleError() {
        console.log('BE:WebSocket error');
    }
    //信息处理
    function handleConnection(ws, req) {
        ws.on('message', handleMessage)
    }
    function handleMessage(msg) {
        //遍历每一条内容信息
        server.clients.forEach((c) => {
            // 发送send 信息 到前端
            if (c.readyState === 1) {
                c.send(msg);
            }
        })
    }
    init()
})(Ws)