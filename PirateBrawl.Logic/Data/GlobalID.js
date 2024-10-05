class GlobalID {
    static createGlobalId(classId, instanceId) {
        return classId <= 0 ? 1000000 + instanceId : classId * 1000000 + instanceId;
    }

    static getClassId(globalId) {
        return globalId / 1000000;
    }

    static getInstanceId(globalId) {
        return globalId % 1000000;
    }
}

module.exports = GlobalID;