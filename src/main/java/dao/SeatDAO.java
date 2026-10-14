package dao;

import util.DBConnection;
import model.Seat;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class SeatDAO {

    public List<Seat> getAvailableSeats() {

        List<Seat> seats = new ArrayList<>();

        String sql = "SELECT * FROM seats WHERE status = 'AVAILABLE'";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {

                Seat seat = new Seat(
                        rs.getInt("seat_id"),
                        rs.getString("seat_number"),
                        rs.getString("coach"),
                        rs.getString("status")
                );

                seats.add(seat);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return seats;
    }

}