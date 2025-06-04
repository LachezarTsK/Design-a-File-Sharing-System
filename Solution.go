
package main

import (
    "container/heap"
    "slices"
)

var NOT_FOUND = []int{}

type FileSharing struct {
    numberOfChunks      int
    numberOfActiveUsers int
    freedUserIDs        PriorityQueue
    userIDsToChunkIDs   map[int]*HashSet
}

func Constructor(numberOfChunks int) FileSharing {
    fileSharing := FileSharing{
            numberOfChunks:      numberOfChunks,
            numberOfActiveUsers: 0,
            freedUserIDs:        make(PriorityQueue, 0),
            userIDsToChunkIDs:   map[int]*HashSet{},
    }
    return fileSharing
}

func (this *FileSharing) Join(ownedChunks []int) int {
    newUserID := this.getNewUserID()
    this.userIDsToChunkIDs[newUserID] = NewHashSet()
    for i := range ownedChunks {
            this.userIDsToChunkIDs[newUserID].Add(ownedChunks[i])
    }
    return newUserID
}

func (this *FileSharing) Leave(userID int) {
    this.setFreeLeavingUserID(userID)
    delete(this.userIDsToChunkIDs, userID)
}

func (this *FileSharing) Request(userID int, chunkID int) []int {
    userIDsOwningRequestedChunkID := make([]int, 0)

    for user, chunkIDs := range this.userIDsToChunkIDs {
            if chunkIDs.Contains(chunkID) {
                    userIDsOwningRequestedChunkID = append(userIDsOwningRequestedChunkID, user)
            }
    }

    if len(userIDsOwningRequestedChunkID) == 0 {
            return NOT_FOUND
    }
    slices.Sort(userIDsOwningRequestedChunkID)
    this.userIDsToChunkIDs[userID].Add(chunkID)

    return userIDsOwningRequestedChunkID
}

func (this *FileSharing) getNewUserID() int {
    this.numberOfActiveUsers++
    if this.freedUserIDs.Len() > 0 {
            return heap.Pop(&this.freedUserIDs).(int)
    }
    return this.numberOfActiveUsers
}

func (this *FileSharing) setFreeLeavingUserID(userID int) {
    this.numberOfActiveUsers--
    heap.Push(&this.freedUserIDs, userID)
}

type PriorityQueue []int

func (pq PriorityQueue) Len() int {
    return len(pq)
}

func (pq PriorityQueue) Less(first int, second int) bool {
    return pq[first] < pq[second]
}

func (pq PriorityQueue) Swap(first int, second int) {
    pq[first], pq[second] = pq[second], pq[first]
}

func (pq *PriorityQueue) Push(object any) {
    *pq = append(*pq, object.(int))
}

func (pq *PriorityQueue) Pop() any {
    value := (*pq)[pq.Len() - 1]
    *pq = (*pq)[0 : pq.Len() - 1]
    return value
}

type HashSet struct {
    container map[int]bool
}

func NewHashSet() *HashSet {
    return &HashSet{container: map[int]bool{}}
}

func (this *HashSet) Contains(value int) bool {
    return this.container[value]
}

func (this *HashSet) Add(value int) {
    this.container[value] = true
}

func (this *HashSet) Remove(value int) {
    delete(this.container, value)
}
