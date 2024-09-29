const BitStream = require('./BitStream');
const ByteStream = require('../Utils/ByteStream');
const LogicGameObjectManager = require('./LogicGameObjectManager');
const VisionUpdate = require('./VisionUpdate');
const UdpLaserSocketListener = require('../Laser.Server/Networking/udp/UdpLaserSocketListener');

class Session {
    constructor(endpoint, sessionId, server) {
        this.EndPoint = endpoint;
        this.SessionId = sessionId;
        this.server = server;
        this.started = false;
        this.Tick = 1;
        this.manager = new LogicGameObjectManager();
    }

    startBattleThread() {
        if (!this.started) {
            this.started = true;
            this.Tick = 1; // Initialize tick here
            this.intervalId = setInterval(this.battleLoop.bind(this), 1000 / 20);
        }
    }
    
    battleLoop() {
        const interval = setInterval(() => {
            var stream = new ByteStream();
            const update = new VisionUpdate()
            update.Tick = this.Tick;
            update.stream = stream;
            update.InputCounter = this.manager.InputCounter;
            this.sendDick(update)
            this.Tick++;

        }, 50); // 1000ms / 20 ticks per second = 50ms per tick
    }
    sendDick(Vision) {
        Vision.encode();
        const data = Vision.stream.getBuff();
        const length = Vision.stream.getOffset();

        const stream = new ByteStream(); // Assuming ByteStream constructor accepts size

        stream.writeInt(0);
        stream.writeInt(1);
        stream.writeShort(0);

        stream.writeVInt(24109);
        stream.writeVInt(length);

        stream.writeBytesWithoutLength(data, length);
        const packet = stream.getBuff();
        console.log(packet, 0, stream.getOffset(), this.EndPoint.port, this.EndPoint.address)
        this.server.send(packet, 0, stream.getOffset(), this.EndPoint.port, this.EndPoint.address, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
}

module.exports = Session;
