
// const {PriorityQueue} = require('@datastructures-js/priority-queue');
/*
 PriorityQueue is internally included in the solution file on leetcode.
 When running the code on leetcode it should stay commented out. 
 It is mentioned here just for information about the external library 
 that is applied for this data structure.
 */

class FileSharing {

    private static NOT_FOUND = new Array();

    numberOfActiveUsers: number;
    freedUserIDs: PriorityQueue<number>;
    userIDsToChunkIDs: Map<number, Set<number>>;

    constructor(numberOfChunks: number) {
        this.numberOfActiveUsers = 0;
        this.freedUserIDs = new PriorityQueue<number>((firstUserID, secondUserID) => firstUserID - secondUserID);
        this.userIDsToChunkIDs = new Map();
    }

    join(ownedChunks: number[]): number {
        const newUserID = this.getNewUserID();
        this.userIDsToChunkIDs.set(newUserID, new Set(ownedChunks));
        return newUserID;
    }

    leave(userID: number): void {
        this.setFreeLeavingUserID(userID);
        this.userIDsToChunkIDs.delete(userID);
    }

    request(userID: number, chunkID: number): number[] {
        const userIDsOwningRequestedChunkID: number[] = new Array();

        for (let user of this.userIDsToChunkIDs.keys()) {
            if (this.userIDsToChunkIDs.get(user).has(chunkID)) {
                userIDsOwningRequestedChunkID.push(user);
            }
        }

        if (userIDsOwningRequestedChunkID.length === 0) {
            return FileSharing.NOT_FOUND;
        }

        userIDsOwningRequestedChunkID.sort((firstUserID, secondUserID) => firstUserID - secondUserID);
        this.userIDsToChunkIDs.get(userID).add(chunkID);

        return userIDsOwningRequestedChunkID;
    }

    getNewUserID(): number {
        ++this.numberOfActiveUsers;
        if (!this.freedUserIDs.isEmpty()) {
            return this.freedUserIDs.dequeue();
        }
        return this.numberOfActiveUsers;
    }

    setFreeLeavingUserID(userID: number): void {
        --this.numberOfActiveUsers;
        this.freedUserIDs.enqueue(userID);
    }
}
