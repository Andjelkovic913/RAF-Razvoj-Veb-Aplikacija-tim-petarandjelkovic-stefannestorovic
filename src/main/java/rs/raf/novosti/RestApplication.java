package rs.raf.novosti;

import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.ServerProperties;

import rs.raf.novosti.repositories.user.PostgresUserRepository;
import rs.raf.novosti.repositories.user.UserRepository;
import rs.raf.novosti.services.UserService;

import javax.inject.Singleton;
import javax.ws.rs.ApplicationPath;

@ApplicationPath("/api")
public class RestApplication extends ResourceConfig {

    public RestApplication() {
        property(ServerProperties.BV_SEND_ERROR_IN_RESPONSE, true);

        AbstractBinder binder = new AbstractBinder() {
            @Override
            protected void configure() {
                // Repozitorijume nabajdujemo
                this.bind(PostgresUserRepository.class).to(UserRepository.class).in(Singleton.class);

                // i servise
                this.bindAsContract(UserService.class);
            }
        };
        register(binder);

        packages("rs.raf.novosti");
    }
}
