package rs.raf.novosti;

import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.ServerProperties;

import javax.ws.rs.ApplicationPath;

@ApplicationPath("/api")
public class RestApplication extends ResourceConfig {

    public RestApplication() {
        property(ServerProperties.BV_SEND_ERROR_IN_RESPONSE, true);

        packages("rs.raf.novosti");
    }
}
