let GlobalID = require("../Data/GlobalID");

class ByteStreamHelper {
    static encodeLogicLong(stream, highInt, lowInt) {
        stream.writeVInt(highInt);
        stream.writeVInt(lowInt);
    }

    static writeDataReference(stream, globalId) {
        if (globalId > 0) {
            stream.writeVInt(GlobalID.getClassId(globalId));
            stream.writeVInt(GlobalID.getInstanceId(globalId));
        }
        else {
            stream.writeVInt(0);
        }
    }

    static readDataReference(stream) {
        let classId = stream.readVInt();
        let instanceId = stream.readVInt();

        return classId + instanceId == 0 ? 0 : GlobalID.createGlobalId(classId, instanceId);
    }

    static writeDataReferenceWithIds(stream, classId, instanceId) {
        if (classId > 0) {
            stream.writeVInt(classId);
            stream.writeVInt(instanceId);
        } else {
            stream.writeVInt(0);
        }
        return instanceId;
    }
}

module.exports = ByteStreamHelper;
