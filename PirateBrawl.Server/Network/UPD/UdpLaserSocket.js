class UdpLaserSocket {
    constructor(ep, s, connection) {
        this.EndPoint = ep;
        this.SessionId = s;
        this.Alive = true;
        this.TcpConnection = connection;
    }

    send(packet) {
        if (this.Alive) {
            packet.encode();
            const data = packet.stream.toArray();
            UdpLaserSocketListener.send(data, packet.stream.offset, this.EndPoint);
        } else {
            console.log("UdpLaserSocket.Send called when socket is dead.");
        }
    }
}

module.exports = UdpLaserSocket;
