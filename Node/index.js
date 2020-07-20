const WebSocket = require('ws');

const socketServer = WebSocket.Server;
const webSocketServer = new socketServer({
    port: 8000
}, undefined);

let queuingList = [];
let gameList = [];

/*
Param = {
    type: enum{'nextMove','message'}
    player: enum{'p1','p2'}

    next: {
        x: int[0,15)
        y: int[0,15)
    }

    context: String
}
 */

/*
Response = {
    data: Param

    result: int[0,3)
}
 */

webSocketServer.on('connection', function (ws) {
    if (queuingList.length === 0) {
        queuingList.push(ws);
        ws.send(JSON.stringify({
            status: -1
        }));
    } else {
        let status = new Array(15);
        for (let i = 0; i < 15; i++) {
            status[i] = new Array(15).fill(0);
        }
        let game = {
            p1: queuingList.shift(),
            p2: ws,
            status: status
        };
        gameList.push(game);
        game.p1.send(JSON.stringify({
            role: 'p1',
            status: 1
        }));
        game.p2.send(JSON.stringify({
            role: 'p2',
            status: 2
        }));
    }
    ws.on('message', function (data) {
        if (!data)
            return;
        data = JSON.parse(data);
        if (data['type'] === 'nextMove') {
            nextMove(ws, data);
        } else
            sendMessage(ws, data);
    });
    ws.on('close', function (data) {
        let index = gameList.findIndex(item => item[data['player']] === ws)
        let game = gameList[index];
        if (!game) return;
        let other = data['player'] === 'p1' ? 'p2' : 'p1';
        game[other].send(JSON.stringify({
            status: 0
        }));
        game[other].close();
        gameList.splice(index, 1);
    })
});

function nextMove(ws, data) {
    let index = gameList.findIndex(item => item[data['player']] === ws)
    let game = gameList[index];
    if (!game) return;
    let other = data['player'] === 'p1' ? 'p2' : 'p1';
    if (game.status[data['next'].y][data['next'].x])
        return;
    game.status[data['next'].y][data['next'].x] = data['player'] === 'p1' ? 1 : 2;
    let result = statusJudge(game.status, data['next']);
    game[other].send(JSON.stringify({
        data: data,
        status: result < 4 ? result + 2 : 1
    }));
    ws.send(JSON.stringify({
        data: data,
        status: result < 4 ? result + 2 : 2
    }));
    if (result < 4) {
        gameList.splice(index, 1);
    }
}

function sendMessage(ws, data) {
    let game = gameList.find(item => item[data['player']] === ws);
    if (!game) return;
    let other = data['player'] === 'p1' ? 'p2' : 'p1';
    game[other].send(JSON.stringify({
        data: data
    }));
    ws.send(JSON.stringify({
        data: data
    }));
}

function statusJudge(status, currentPosition) {
    //水平
    let count1 = 0, count2 = 0;
    let x = Math.max(currentPosition.x - 4, 0);
    let y = currentPosition.y;
    while (status[y][x] === 0 && x <= Math.min(currentPosition.x + 4, 14)) x++;
    while (status[y][x] === 1 && x <= Math.min(currentPosition.x + 4, 14)) {
        count1++;
        x++;
    }
    if (count1 > 4) return 1;
    while (status[y][x] === 2 && x <= Math.min(currentPosition.x + 4, 14)) {
        count2++;
        x++
    }
    if (count2 > 4) return 2;

    //垂直
    count1 = 0;
    count2 = 0;
    x = currentPosition.x;
    y = Math.max(currentPosition.y - 4, 0);
    while (status[y][x] === 0 && y <= Math.min(currentPosition.y + 4, 14)) y++;
    while (status[y][x] === 1 && y <= Math.min(currentPosition.y + 4, 14)) {
        count1++;
        y++;
    }
    if (count1 > 4) return 1;
    while (status[y][x] === 2 && y <= Math.min(currentPosition.y + 4, 14)) {
        count2++;
        y++;
    }
    if (count2 > 4) return 2;

    //对角线1
    count1 = 0;
    count2 = 0;
    x = Math.max(currentPosition.x - 4, 0);
    y = Math.max(currentPosition.y - 4, 0);
    while (status[y][x] === 0 && x <= Math.min(currentPosition.x + 4, 14) && y <= Math.min(currentPosition.y + 4, 14)) {
        x++;
        y++;
    }
    while (status[y][x] === 1 && x <= Math.min(currentPosition.x + 4, 14) && y <= Math.min(currentPosition.y + 4, 14)) {
        count1++;
        y++;
        x++;
    }
    if (count1 > 4) return 1;
    while (status[y][x] === 2 && x <= Math.min(currentPosition.x + 4, 14) && y <= Math.min(currentPosition.y + 4, 14)) {
        count2++;
        y++;
        x++;
    }
    if (count2 > 4) return 2;

    //对角线2
    count1 = 0;
    count2 = 0;
    x = Math.min(currentPosition.x + 4, 14);
    y = Math.max(currentPosition.y - 4, 0);
    while (status[y][x] === 0 && x >= Math.max(currentPosition.x - 4, 0) && y <= Math.min(currentPosition.y + 4, 14)) {
        x--;
        y++;
    }
    while (status[y][x] === 1 && x >= Math.max(currentPosition.x - 4, 0) && y <= Math.min(currentPosition.y + 4, 14)) {
        count1++;
        y++;
        x--;
    }
    if (count1 > 4) return 1;
    while (status[y][x] === 2 && x >= Math.max(currentPosition.x - 4, 0) && y <= Math.min(currentPosition.y + 4, 14)) {
        count2++;
        y++;
        x--;
    }
    if (count2 > 4) return 2;

    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            if (!status[i][j])
                return 4;
        }
    }
    return 3;
}