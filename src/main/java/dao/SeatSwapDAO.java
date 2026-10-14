package dao;

import util.DBConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class SeatSwapDAO {

    public boolean createSwapRequest(
            int requesterId,
            int receiverId,
            int requestedSeatId,
            int offeredSeatId) {

        String sql = "INSERT INTO seat_swaps " +
                "(requester_id, receiver_id, requested_seat_id, " +
                "offered_seat_id, status) VALUES (?, ?, ?, ?, 'PENDING')";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, requesterId);
            ps.setInt(2, receiverId);
            ps.setInt(3, requestedSeatId);
            ps.setInt(4, offeredSeatId);

            return ps.executeUpdate() > 0;

        } catch (SQLException e) {
            System.out.println("Failed to create swap request.");
            e.printStackTrace();
            return false;
        }
    }

    public void viewSwapRequests() {

        String sql = "SELECT * FROM seat_swaps";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             java.sql.ResultSet rs = ps.executeQuery()) {

            System.out.println("\n===== Seat Swap Requests =====");

            while (rs.next()) {
                System.out.println("Request ID: " + rs.getInt("swap_id"));
                System.out.println("Requester ID: " + rs.getInt("requester_id"));
                System.out.println("Receiver ID: " + rs.getInt("receiver_id"));
                System.out.println("Requested Seat: " + rs.getInt("requested_seat_id"));
                System.out.println("Offered Seat: " + rs.getInt("offered_seat_id"));
                System.out.println("Status: " + rs.getString("status"));
                System.out.println("----------------------------");
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public boolean updateSwapStatus(int swapId, String newStatus) {

        if (!newStatus.equals("ACCEPTED") &&
                !newStatus.equals("REJECTED")) {
            System.out.println("Invalid status!");
            return false;
        }

        String sql = "UPDATE seat_swaps SET status = ? " +
                "WHERE swap_id = ? AND status = 'PENDING'";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, newStatus);
            ps.setInt(2, swapId);

            return ps.executeUpdate() > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean acceptSwapRequest(int swapId) {

        String findSql =
                "SELECT requested_seat_id, offered_seat_id " +
                        "FROM seat_swaps WHERE swap_id = ? AND status = 'PENDING'";

        String seatSql =
                "UPDATE seats SET status = 'SWAPPED' " +
                        "WHERE seat_id IN (?, ?) AND status = 'AVAILABLE'";

        String requestSql =
                "UPDATE seat_swaps SET status = 'ACCEPTED' " +
                        "WHERE swap_id = ? AND status = 'PENDING'";

        try (Connection con = DBConnection.getConnection()) {

            con.setAutoCommit(false);

            try {
                int requestedSeatId;
                int offeredSeatId;

                try (PreparedStatement ps = con.prepareStatement(findSql)) {
                    ps.setInt(1, swapId);

                    try (java.sql.ResultSet rs = ps.executeQuery()) {
                        if (!rs.next()) {
                            con.rollback();
                            System.out.println("Pending request not found.");
                            return false;
                        }

                        requestedSeatId = rs.getInt("requested_seat_id");
                        offeredSeatId = rs.getInt("offered_seat_id");
                    }
                }

                if (requestedSeatId == offeredSeatId) {
                    con.rollback();
                    System.out.println("Cannot swap the same seat.");
                    return false;
                }

                try (PreparedStatement ps = con.prepareStatement(seatSql)) {
                    ps.setInt(1, requestedSeatId);
                    ps.setInt(2, offeredSeatId);

                    if (ps.executeUpdate() != 2) {
                        con.rollback();
                        System.out.println("Both seats must be AVAILABLE.");
                        return false;
                    }
                }

                try (PreparedStatement ps = con.prepareStatement(requestSql)) {
                    ps.setInt(1, swapId);

                    if (ps.executeUpdate() != 1) {
                        con.rollback();
                        return false;
                    }
                }

                con.commit();
                return true;

            } catch (SQLException e) {
                con.rollback();
                throw e;
            } finally {
                con.setAutoCommit(true);
            }

        } catch (SQLException e) {
            System.out.println("Failed to accept swap request.");
            e.printStackTrace();
            return false;
        }
    }

    public boolean rejectSwapRequest(int swapId) {
        return updateSwapStatus(swapId, "REJECTED");
    }
}