package rs.raf.novosti.resources;

import rs.raf.novosti.entities.News;
import rs.raf.novosti.services.NewsService;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/news")
public class NewsResource {

    @Inject
    private NewsService newsService;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response all(@QueryParam("page") @DefaultValue("1") int page,
                        @QueryParam("pageSize") @DefaultValue("10") int pageSize) {

        List<News> newsList = this.newsService.allNews(page, pageSize);
        int total = this.newsService.newsCount();

        Map<String, Object> response = new HashMap<>();
        response.put("news", newsList);
        response.put("totalCount", total);
        response.put("page", page);
        response.put("pageSize", pageSize);

        return Response.ok(response).build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response find(@PathParam("id") Long id) {
        News news = this.newsService.findNews(id);
        if (news == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"message\":\"News not found\"}")
                    .build();
        }
        return Response.ok(news).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(Map<String, Object> body) {
        News news = new News();
        news.setTitle((String) body.get("title"));
        news.setText((String) body.get("text"));
        news.setAuthorId(Long.valueOf(body.get("authorId").toString()));
        news.setCategoryId(Long.valueOf(body.get("categoryId").toString()));

        List<String> tagValues = (List<String>) body.get("tags");

        News created = this.newsService.addNews(news, tagValues);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") Long id, Map<String, Object> body) {
        News newsData = new News();
        newsData.setTitle((String) body.get("title"));
        newsData.setText((String) body.get("text"));
        newsData.setCategoryId(Long.valueOf(body.get("categoryId").toString()));

        List<String> tagValues = (List<String>) body.get("tags");

        News updated = this.newsService.updateNews(id, newsData, tagValues);
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"message\":\"News not found\"}")
                    .build();
        }

        return Response.ok(updated).build();
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("id") Long id) {
        this.newsService.deleteNews(id);
        return Response.ok("{\"message\":\"News deleted\"}").build();
    }
}
