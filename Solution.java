
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Set;

public class FileSharing {

    private static final List<Integer> NOT_FOUND = new ArrayList<>();

    private int numberOfActiveUsers;
    private final PriorityQueue<Integer> freedUserIDs;
    private final Map<Integer, Set<Integer>> userIDsToChunkIDs;

    public FileSharing(int numberOfChunks) {
        freedUserIDs = new PriorityQueue<>();
        userIDsToChunkIDs = new HashMap<>();
    }

    public int join(List<Integer> ownedChunks) {
        int newUserID = getNewUserID();
        userIDsToChunkIDs.put(newUserID, new HashSet<>(ownedChunks));
        return newUserID;
    }

    public void leave(int userID) {
        setFreeLeavingUserID(userID);
        userIDsToChunkIDs.remove(userID);
    }

    public List<Integer> request(int userID, int chunkID) {
        List<Integer> userIDsOwningRequestedChunkID = new ArrayList<>();

        for (int user : userIDsToChunkIDs.keySet()) {
            if (userIDsToChunkIDs.get(user).contains(chunkID)) {
                userIDsOwningRequestedChunkID.add(user);
            }
        }

        if (userIDsOwningRequestedChunkID.isEmpty()) {
            return NOT_FOUND;
        }

        Collections.sort(userIDsOwningRequestedChunkID);
        userIDsToChunkIDs.get(userID).add(chunkID);

        return userIDsOwningRequestedChunkID;
    }

    private int getNewUserID() {
        ++numberOfActiveUsers;
        if (!freedUserIDs.isEmpty()) {
            return freedUserIDs.poll();
        }
        return numberOfActiveUsers;
    }

    private void setFreeLeavingUserID(int userID) {
        --numberOfActiveUsers;
        freedUserIDs.add(userID);
    }
}
