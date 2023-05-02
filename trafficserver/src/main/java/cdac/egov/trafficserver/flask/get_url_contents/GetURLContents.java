package cdac.egov.trafficserver.flask.get_url_contents;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;

public class GetURLContents {

    public String getData(String address)
    {
        StringBuilder content = new StringBuilder();
        try {
            URL url = new URL(address); 
            URLConnection urlConnection = url.openConnection();

            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                content.append(line).append("\n");
            }
            bufferedReader.close();
        }
        catch(Exception e) {
            e.printStackTrace();
        }
        return content.toString();
    }

}
