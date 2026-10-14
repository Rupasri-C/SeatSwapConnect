import java.util.Scanner;
import java.util.List;

public class Main {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        int choice;

        do {
            System.out.println("\n================================");
            System.out.println("       SeatSwapConnect");
            System.out.println("================================");
            System.out.println("1. User Login");
            System.out.println("2. View Available Seats");
            System.out.println("3. View Swap Requests");
            System.out.println("4. Exit");
            System.out.println("5. Create Seat Swap Request");
            System.out.println("6. Accept Swap Request");
            System.out.println("7. Reject Swap Request");
            System.out.println("================================");
            System.out.print("Enter your choice: ");

            choice = sc.nextInt();

            switch (choice) {
                case 1:
                    sc.nextLine();

                    System.out.print("Enter email: ");
                    String email = sc.nextLine();

                    System.out.print("Enter password: ");
                    String password = sc.nextLine();

                    dao.UserDAO userDAO = new dao.UserDAO();
                    model.User user = userDAO.login(email, password);

                    if (user != null) {
                        System.out.println(
                                "Login Successful! Welcome, "
                                        + user.getName()
                        );
                    } else {
                        System.out.println(
                                "Invalid email or password!"
                        );
                    }
                    break;

                case 2:
                    dao.SeatDAO seatDAO = new dao.SeatDAO();
                    List<model.Seat> seats =
                            seatDAO.getAvailableSeats();

                    System.out.println("\n--- Available Seats ---");

                    if (seats.isEmpty()) {
                        System.out.println("No seats available.");
                    } else {
                        for (model.Seat seat : seats) {
                            System.out.println(
                                    "Seat ID: " + seat.getSeatId()
                                            + " | Seat Number: "
                                            + seat.getSeatNumber()
                                            + " | Coach: " + seat.getCoach()
                                            + " | Status: " + seat.getStatus()
                            );
                        }
                    }
                    break;

                case 3:
                    dao.SeatSwapDAO swapDAO =
                            new dao.SeatSwapDAO();
                    swapDAO.viewSwapRequests();
                    break;

                case 4:
                    System.out.println(
                            "Thank you for using SeatSwapConnect!"
                    );
                    break;

                case 5:
                    System.out.print("Enter your User ID: ");
                    int requesterId = sc.nextInt();

                    System.out.print("Enter receiver User ID: ");
                    int receiverId = sc.nextInt();

                    System.out.print("Enter requested Seat ID: ");
                    int requestedSeatId = sc.nextInt();

                    System.out.print("Enter your offered Seat ID: ");
                    int offeredSeatId = sc.nextInt();

                    dao.SeatSwapDAO swapDAO5 = new dao.SeatSwapDAO();

                    boolean created = swapDAO5.createSwapRequest(
                            requesterId,
                            receiverId,
                            requestedSeatId,
                            offeredSeatId
                    );

                    if (created) {
                        System.out.println("Seat swap request created successfully!");
                    } else {
                        System.out.println("Failed to create seat swap request.");
                    }
                    break;

                case 6:
                    System.out.print("Enter Swap Request ID to accept: ");
                    int acceptId = sc.nextInt();

                    dao.SeatSwapDAO acceptDAO = new dao.SeatSwapDAO();

                    if (acceptDAO.acceptSwapRequest(acceptId)) {
                        System.out.println("Swap request accepted successfully!");
                    } else {
                        System.out.println("Request not found or already processed.");
                    }
                    break;

                case 7:
                    System.out.print("Enter Swap Request ID to reject: ");
                    int rejectId = sc.nextInt();

                    dao.SeatSwapDAO rejectDAO = new dao.SeatSwapDAO();

                    if (rejectDAO.rejectSwapRequest(rejectId)) {
                        System.out.println("Swap request rejected successfully!");
                    } else {
                        System.out.println("Request not found or already processed.");
                    }
                    break;

                default:
                    System.out.println("Invalid choice!");
            }

        } while (choice != 4);

        sc.close();
    }
}