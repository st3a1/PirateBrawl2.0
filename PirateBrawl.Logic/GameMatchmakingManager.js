const MatchMakingStatusMessage = 0//require('./MatchMaking/MatchMakingStatusMessage');
const UdpLaserSocketListener = 0//require('../Laser.Server/Networking/udp/UdpLaserSocketListener');


var x10 = [2,5];
const TrioPlayer = 1;//6
const ShdPlayer = 1;//10
class GameMatchmakingManager {
  static Queues = {};
  static ToAdd = [];
  static Thread = null;
  static TimerOnStart = 30;

  static init() {
    this.Queues = {};
    this.ToAdd = [];
    this.Thread = setInterval(() => this.update(), 500);
  }

  static Enqueue(connection, EventSlot) {
    connection.inMatchmaking = true;
    connection.EventSlot = EventSlot;
    if (!this.Queues[EventSlot]) {
      this.Queues[EventSlot] = {
        Queue: [],
        Timer: this.TimerOnStart
      };
    }
    this.ToAdd.push(connection);
  }

  static update() {
    const ToRemove = [];

    // Add new connections to the appropriate queue
    this.ToAdd.forEach(connection => {
      if (!this.Queues[connection.EventSlot].Queue.includes(connection)) {
        this.Queues[connection.EventSlot].Queue.push(connection);
      }
    });
    this.ToAdd = [];

    // Process each queue based on EventSlot
    Object.keys(this.Queues).forEach(EventSlot => {
      const queueData = this.Queues[EventSlot];
      const queue = queueData.Queue;

      // Remove disconnected or out-of-matchmaking connections
      queue.forEach(connection => {
        if (!connection.inMatchmaking) {
          ToRemove.push({ connection, EventSlot });
          console.log("remove");
        }
      });

      // Remove connections marked for removal
      ToRemove.forEach(({ connection, EventSlot }) => {
        const index = this.Queues[EventSlot].Queue.indexOf(connection);
        if (index > -1) {
          this.Queues[EventSlot].Queue.splice(index, 1);
        }
      });

      // Start game if enough players are in the queue
      const maxPlayers = x10.includes(parseInt(EventSlot)) ? ShdPlayer : TrioPlayer;
      if (queue.length >= maxPlayers) {
        this.startGame(EventSlot);
      }

      // Handle timer and matchmaking status
      if (queue.length > 0) {
        queueData.Timer -= 0.5;

        queue.forEach(connection => {
          const status = new MatchMakingStatusMessage(connection);
          status.PlayersFound = queue.length;
          status.MaxPlayers = maxPlayers;
          status.UseTimer = true;
          status.Timer = queueData.Timer;
          status.send();
        });

        if (queueData.Timer <= 0) {
          console.log("TIME TO BOT START");
          queueData.Timer = this.TimerOnStart; // Reset timer if needed
        }
      } else {
        queueData.Timer = this.TimerOnStart; // Reset timer if no players are in the queue
      }
    });
  }

  static startGame(EventSlot) {
    const queue = this.Queues[EventSlot].Queue;
    const maxPlayers = x10.includes(parseInt(EventSlot)) ? ShdPlayer : TrioPlayer;
    const connections = [];

    for (let i = 0; i < maxPlayers; i++) {
      connections.push(queue.shift());
    }
    UdpLaserSocketListener.createBattleSessions(connections);
  }
}

module.exports = GameMatchmakingManager;
