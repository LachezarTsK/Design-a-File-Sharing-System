
using System;
using System.Collections.Generic;

public class FileSharing
{
    private static readonly List<int> NOT_FOUND = new List<int>();

    private int numberOfActiveUsers = 0;
    private PriorityQueue<int, int> freedUserIDs;
    private Dictionary<int, HashSet<int>> userIDsToChunkIDs;

    public FileSharing(int numberOfChunks)
    {
        freedUserIDs = new PriorityQueue<int, int>();
        userIDsToChunkIDs = new Dictionary<int, HashSet<int>>();
    }

    public int Join(IList<int> ownedChunks)
    {
        int newUserID = GetNewUserID();
        userIDsToChunkIDs.Add(newUserID, new HashSet<int>(ownedChunks));
        return newUserID;
    }

    public void Leave(int userID)
    {
        SetFreeLeavingUserID(userID);
        userIDsToChunkIDs.Remove(userID);
    }

    public IList<int> Request(int userID, int chunkID)
    {
        List<int> userIDsOwningRequestedChunkID = new List<int>();

        foreach (int user in userIDsToChunkIDs.Keys)
        {
            if (userIDsToChunkIDs[user].Contains(chunkID))
            {
                userIDsOwningRequestedChunkID.Add(user);
            }
        }

        if (userIDsOwningRequestedChunkID.Count == 0)
        {
            return NOT_FOUND;
        }
        userIDsOwningRequestedChunkID.Sort();
        userIDsToChunkIDs[userID].Add(chunkID);

        return userIDsOwningRequestedChunkID;
    }

    private int GetNewUserID()
    {
        ++numberOfActiveUsers;
        if (freedUserIDs.Count > 0)
        {
            return freedUserIDs.Dequeue();
        }
        return numberOfActiveUsers;
    }

    private void SetFreeLeavingUserID(int userID)
    {
        --numberOfActiveUsers;
        freedUserIDs.Enqueue(userID, userID);
    }
}
