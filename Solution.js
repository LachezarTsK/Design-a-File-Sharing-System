
// const {PriorityQueue} = require('@datastructures-js/priority-queue');
/*
 PriorityQueue is internally included in the solution file on leetcode.
 When running the code on leetcode it should stay commented out. 
 It is mentioned here just for information about the external library 
 that is applied for this data structure.
 */

class FileSharing {

    static #NOT_FOUND = new Array();

    /**
     * @param {number} numberOfChunks
     */
    constructor(numberOfChunks) {
        this.numberOfActiveUsers = 0;

        // PriorityQueue<number>
        this.freedUserIDs = new PriorityQueue((firstUserID, secondUserID) => firstUserID - secondUserID);

        // Map<number, Set<number>>
        this.userIDsToChunkIDs = new Map();
    }

    /** 
     * @param {number[]} ownedChunks
     * @return {number}
     */
    join(ownedChunks) {
        const newUserID = this.getNewUserID();
        this.userIDsToChunkIDs.set(newUserID, new Set(ownedChunks));
        return newUserID;
    }

    /** 
     * @param {number} userID
     * @return {void}
     */
    leave(userID) {
        this.setFreeLeavingUserID(userID);
        this.userIDsToChunkIDs.delete(userID);
    }

    /** 
     * @param {number} userID 
     * @param {number} chunkID
     * @return {number[]}
     */
    request(userID, chunkID) {
        const userIDsOwningRequestedChunkID = new Array();

        for (let user of this.userIDsToChunkIDs.keys()) {
            if (this.userIDsToChunkIDs.get(user).has(chunkID)) {
                userIDsOwningRequestedChunkID.push(user);
            }
        }

        if (userIDsOwningRequestedChunkID.length === 0) {
            return FileSharing.#NOT_FOUND;
        }

        userIDsOwningRequestedChunkID.sort((firstUserID, secondUserID) => firstUserID - secondUserID);
        this.userIDsToChunkIDs.get(userID).add(chunkID);

        return userIDsOwningRequestedChunkID;
    }

    /** 
     * @return {number}
     */
    getNewUserID() {
        ++this.numberOfActiveUsers;
        if (!this.freedUserIDs.isEmpty()) {
            return this.freedUserIDs.dequeue();
        }
        return this.numberOfActiveUsers;
    }

    /** 
     * @param {number} userID 
     * @return {void}
     */
    setFreeLeavingUserID(userID) {
        --this.numberOfActiveUsers;
        this.freedUserIDs.enqueue(userID);
    }
}
