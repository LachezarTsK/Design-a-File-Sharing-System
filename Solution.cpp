
#include <ranges> 
#include <vector>
#include <unordered_set>
#include <unordered_map>
using namespace std;

class FileSharing {

    inline static vector<int> NOT_FOUND;

    int numberOfActiveUsers = 0;
    priority_queue<int, vector<int>, greater<int>> freedUserIDs;
    unordered_map<int, unordered_set<int>> userIDsToChunkIDs;

public:
    FileSharing(int numberOfChunks) {}

    int join(vector<int> ownedChunks) {
        int newUserID = getNewUserID();
        userIDsToChunkIDs[newUserID] = unordered_set<int>(ownedChunks.begin(), ownedChunks.end());
        return newUserID;
    }

    void leave(int userID) {
        setFreeLeavingUserID(userID);
        userIDsToChunkIDs.erase(userID);
    }

    vector<int> request(int userID, int chunkID) {
        vector<int> userIDsOwningRequestedChunkID;

        for (const auto& [user, chunkIDs] : userIDsToChunkIDs) {
            if (chunkIDs.contains(chunkID)) {
                userIDsOwningRequestedChunkID.push_back(user);
            }
        }

        if (userIDsOwningRequestedChunkID.empty()) {
            return NOT_FOUND;
        }

        ranges::sort(userIDsOwningRequestedChunkID);
        userIDsToChunkIDs[userID].insert(chunkID);

        return userIDsOwningRequestedChunkID;
    }

private:

    int getNewUserID() {
        ++numberOfActiveUsers;
        if (!freedUserIDs.empty()) {
            int freedID = freedUserIDs.top();
            freedUserIDs.pop();
            return freedID;
        }
        return numberOfActiveUsers;
    }

    void setFreeLeavingUserID(int userID) {
        --numberOfActiveUsers;
        freedUserIDs.push(userID);
    }
};
