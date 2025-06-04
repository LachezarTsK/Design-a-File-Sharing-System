
import java.util.*

class FileSharing(numberOfChunks: Int) {

    private companion object {
        val NOT_FOUND = ArrayList<Int>()
    }

    private var numberOfActiveUsers = 0
    private val freedUserIDs = PriorityQueue<Int>()
    private val userIDsToChunkIDs = mutableMapOf<Int, MutableSet<Int>>()

    fun join(ownedChunks: List<Int>): Int {
        val newUserID = getNewUserID()
        userIDsToChunkIDs[newUserID] = HashSet<Int>(ownedChunks)
        return newUserID
    }

    fun leave(userID: Int) {
        setFreeLeavingUserID(userID)
        userIDsToChunkIDs.remove(userID)
    }

    fun request(userID: Int, chunkID: Int): List<Int> {
        val userIDsOwningRequestedChunkID = ArrayList<Int>()

        for ((user, chunkIDs) in userIDsToChunkIDs) {
            if (chunkIDs.contains(chunkID)) {
                userIDsOwningRequestedChunkID.add(user)
            }
        }

        if (userIDsOwningRequestedChunkID.isEmpty()) {
            return NOT_FOUND
        }

        userIDsOwningRequestedChunkID.sort()
        userIDsToChunkIDs[userID]!!.add(chunkID)

        return userIDsOwningRequestedChunkID
    }

    private fun getNewUserID(): Int {
        ++numberOfActiveUsers
        if (!freedUserIDs.isEmpty()) {
            return freedUserIDs.poll()
        }
        return numberOfActiveUsers
    }

    private fun setFreeLeavingUserID(userID: Int) {
        --numberOfActiveUsers
        freedUserIDs.add(userID)
    }
}
