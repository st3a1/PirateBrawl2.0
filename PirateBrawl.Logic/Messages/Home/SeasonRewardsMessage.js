const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class SeasonRewardsMessage extends PiranhaMessage {
  constructor(session, type) {
    super(session);
    this.id = 24123;
    this.session = session;
    this.version = 0;
    this.stream = new ByteStream();
    this.type = type
  }

  async encode() {
    this.stream.writeVInt(this.type)
    if(this.type === 1){
        this.stream.writeVInt(31) // count

        this.stream.writeVInt(501) // 1
        this.stream.writeVInt(524)
        this.stream.writeVInt(20)
        this.stream.writeVInt(500)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(525) // 2
        this.stream.writeVInt(549)
        this.stream.writeVInt(50)
        this.stream.writeVInt(524)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(550) // 3
        this.stream.writeVInt(574)
        this.stream.writeVInt(70)
        this.stream.writeVInt(549)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(575) // 4 
        this.stream.writeVInt(599)
        this.stream.writeVInt(80)
        this.stream.writeVInt(574)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет
        
        this.stream.writeVInt(600) // 5
        this.stream.writeVInt(624)
        this.stream.writeVInt(90)
        this.stream.writeVInt(599)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(625) // 6
        this.stream.writeVInt(649)
        this.stream.writeVInt(100)
        this.stream.writeVInt(624)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет
        
        this.stream.writeVInt(650) // 7 
        this.stream.writeVInt(674)
        this.stream.writeVInt(110)
        this.stream.writeVInt(649)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(675) // 8
        this.stream.writeVInt(699)
        this.stream.writeVInt(120)
        this.stream.writeVInt(674)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(700) // 9
        this.stream.writeVInt(724)
        this.stream.writeVInt(130)
        this.stream.writeVInt(699)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(725) // 10
        this.stream.writeVInt(749)
        this.stream.writeVInt(140)
        this.stream.writeVInt(724)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(750) // 11
        this.stream.writeVInt(774)
        this.stream.writeVInt(150)
        this.stream.writeVInt(749)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(775) // 12
        this.stream.writeVInt(779)
        this.stream.writeVInt(160)
        this.stream.writeVInt(774)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет
        
        this.stream.writeVInt(800) // 13
        this.stream.writeVInt(824)
        this.stream.writeVInt(170)
        this.stream.writeVInt(799)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет
      
        this.stream.writeVInt(825) // 14
        this.stream.writeVInt(849)
        this.stream.writeVInt(180)
        this.stream.writeVInt(824)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(850) // 15
        this.stream.writeVInt(874)
        this.stream.writeVInt(190)
        this.stream.writeVInt(849)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(875) // 16
        this.stream.writeVInt(899)
        this.stream.writeVInt(200)
        this.stream.writeVInt(874)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(900) // 17
        this.stream.writeVInt(924)
        this.stream.writeVInt(210)
        this.stream.writeVInt(885)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(925) // 18
        this.stream.writeVInt(949)
        this.stream.writeVInt(220)
        this.stream.writeVInt(920)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(950) // 19
        this.stream.writeVInt(974)
        this.stream.writeVInt(230)
        this.stream.writeVInt(940)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(975) // 20 
        this.stream.writeVInt(999)
        this.stream.writeVInt(240)
        this.stream.writeVInt(960)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(1000) // 21
        this.stream.writeVInt(1049)
        this.stream.writeVInt(250)
        this.stream.writeVInt(999)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(1050)
        this.stream.writeVInt(1099)
        this.stream.writeVInt(260)
        this.stream.writeVInt(980) // 22
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(1100)
        this.stream.writeVInt(1149)
        this.stream.writeVInt(270)
        this.stream.writeVInt(1000) // 23
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(1150) // 24
        this.stream.writeVInt(1199)
        this.stream.writeVInt(280)
        this.stream.writeVInt(1020)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(1200)// 25
        this.stream.writeVInt(1249)
        this.stream.writeVInt(290)
        this.stream.writeVInt(1040)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(1250) // 26
        this.stream.writeVInt(1299)
        this.stream.writeVInt(300)
        this.stream.writeVInt(1060)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(1300) // 27
        this.stream.writeVInt(1349)
        this.stream.writeVInt(310)
        this.stream.writeVInt(1080)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(1350) // 28
        this.stream.writeVInt(1399)
        this.stream.writeVInt(320)
        this.stream.writeVInt(1100)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(1400) // 29
        this.stream.writeVInt(1449)
        this.stream.writeVInt(330)
        this.stream.writeVInt(1120)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(1450) // 30
        this.stream.writeVInt(1499)
        this.stream.writeVInt(340)
        this.stream.writeVInt(1140)
        this.stream.writeVInt(0)
        this.stream.writeBoolean(false) // заканчивается в конце или нет

        this.stream.writeVInt(1500) // 31
        this.stream.writeVInt(-1)
        this.stream.writeVInt(350)
        this.stream.writeVInt(1150)
        this.stream.writeVInt(1)
        this.stream.writeBoolean(true) // заканчивается в конце или нет



    }else if(this.type === 4) { // челендж какой то наверное по типу псж
    // потом, в 24 нету
    }else if(this.type === 6) { // special chempeonad
    // потом, в 24 нету 
    }
  }
}

module.exports = SeasonRewardsMessage;