package rs.raf.novosti.resources;

import rs.raf.novosti.entities.User;
import rs.raf.novosti.entities.UserType;
import rs.raf.novosti.requests.CreateUserRequest;
import rs.raf.novosti.requests.LoginRequest;
import rs.raf.novosti.services.UserService;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/users")
public class UserResource {

    @Inject
    private UserService userService;

    private Response requireAdmin(String authHeader) {
        User loggedIn = this.userService.getUserFromToken(authHeader);
        if (loggedIn == null || loggedIn.getUserType() != UserType.ADMIN) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Access denied: admin only");
            return Response.status(Response.Status.FORBIDDEN).entity(error).build();
        }
        return null;
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(@Valid LoginRequest loginRequest) {
        Map<String, String> response = new HashMap<>();

        String jwt = this.userService.login(loginRequest.getEmail(), loginRequest.getPassword());
        if (jwt == null) {
            response.put("error", "Pogresan email ili lozinka, ili je nalog deaktiviran");
            return Response.status(Response.Status.UNAUTHORIZED).entity(response).build();
        }

        response.put("jwt", jwt);
        return Response.ok(response).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response all(@HeaderParam("Authorization") String authHeader,
                        @QueryParam("page") @DefaultValue("1") int page,
                        @QueryParam("pageSize") @DefaultValue("10") int pageSize) {

        Response forbidden = requireAdmin(authHeader);
        if (forbidden != null) return forbidden;

        List<User> users = this.userService.allUsers(page, pageSize);
        int total = this.userService.userCount();

        Map<String, Object> response = new HashMap<>();
        response.put("users", users);
        response.put("totalCount", total);
        response.put("page", page);
        response.put("pageSize", pageSize);

        return Response.ok(response).build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response find(@HeaderParam("Authorization") String authHeader,
                         @PathParam("id") Long id) {
        Response forbidden = requireAdmin(authHeader);
        if (forbidden != null) return forbidden;

        User user = this.userService.findUser(id);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"message\":\"User not found\"}")
                    .build();
        }
        return Response.ok(user).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(@HeaderParam("Authorization") String authHeader,
                           @Valid CreateUserRequest request) {
        Response forbidden = requireAdmin(authHeader);
        if (forbidden != null) return forbidden;

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Password and confirmation do not match");
            return Response.status(Response.Status.BAD_REQUEST).entity(error).build();
        }

        User created = this.userService.addUser(request);

        if (created == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "A user with this email already exists");
            return Response.status(Response.Status.CONFLICT).entity(error).build();
        }

        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@HeaderParam("Authorization") String authHeader,
                           @PathParam("id") Long id,
                           @Valid User userData) {
        Response forbidden = requireAdmin(authHeader);
        if (forbidden != null) return forbidden;

        User existing = this.userService.findUser(id);
        if (existing == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "User not found");
            return Response.status(Response.Status.NOT_FOUND).entity(error).build();
        }

        User updated = this.userService.updateUser(id, userData);

        if (updated == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Email already taken by another user");
            return Response.status(Response.Status.CONFLICT).entity(error).build();
        }

        return Response.ok(updated).build();
    }

    @PUT
    @Path("/{id}/status")
    @Produces(MediaType.APPLICATION_JSON)
    public Response toggleStatus(@HeaderParam("Authorization") String authHeader,
                                 @PathParam("id") Long id) {
        Response forbidden = requireAdmin(authHeader);
        if (forbidden != null) return forbidden;

        this.userService.toggleStatus(id);
        return Response.ok("{\"message\":\"Status updated\"}").build();
    }
}
