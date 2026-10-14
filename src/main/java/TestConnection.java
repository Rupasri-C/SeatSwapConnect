import util.DBConnection;
import java.sql.Connection;

public class TestConnection {

    public static void main(String[] args) {
        try {
            Connection con = DBConnection.getConnection();

            if (con != null) {
                System.out.println("MySQL Connected Successfully!");
            }

            con.close();

        } catch (Exception e) {
            System.out.println("Connection Failed!");
            e.printStackTrace();
        }
    }

}