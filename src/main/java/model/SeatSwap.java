package model;

public class SeatSwap {

    private int swapId;
    private int requesterId;
    private int receiverId;
    private int requestedSeatId;
    private int offeredSeatId;
    private String status;

    public SeatSwap(int swapId, int requesterId, int receiverId,
                    int requestedSeatId, int offeredSeatId,
                    String status) {
        this.swapId = swapId;
        this.requesterId = requesterId;
        this.receiverId = receiverId;
        this.requestedSeatId = requestedSeatId;
        this.offeredSeatId = offeredSeatId;
        this.status = status;
    }

    public int getSwapId() {
        return swapId;
    }

    public int getRequesterId() {
        return requesterId;
    }

    public int getReceiverId() {
        return receiverId;
    }

    public int getRequestedSeatId() {
        return requestedSeatId;
    }

    public int getOfferedSeatId() {
        return offeredSeatId;
    }

    public String getStatus() {
        return status;
    }

}