package model;

public class Seat {

    private int seatId;
    private String seatNumber;
    private String coach;
    private String status;

    public Seat(int seatId, String seatNumber,
                String coach, String status) {
        this.seatId = seatId;
        this.seatNumber = seatNumber;
        this.coach = coach;
        this.status = status;
    }

    public int getSeatId() {
        return seatId;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public String getCoach() {
        return coach;
    }

    public String getStatus() {
        return status;
    }

}