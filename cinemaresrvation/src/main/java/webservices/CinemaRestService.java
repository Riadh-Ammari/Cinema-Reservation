package webservices;

import java.util.Set;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityNotFoundException;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.Compte;
import model.Film;
import model.SalleProg;
import model.Seance;
import services.CinemaLocal;
import services.UtilisateurLocal;

@Stateless
@Path("/me")  // Base path is now the root of "/cinemaREST"
@Produces(MediaType.APPLICATION_JSON)  // Default media type for responses
@Consumes(MediaType.APPLICATION_JSON)  // Default media type for request bodies
public class CinemaRestService {

    @EJB
    CinemaLocal cinema;
    @EJB
    UtilisateurLocal utilisateurService;

    // Ping endpoint to check if the service is running
    @GET
    @Path("/ping")
    public Response ping() {
        return Response.ok("{\"message\":\"Service is running\"}", MediaType.APPLICATION_JSON).build();
    }

    // Get all films
    @GET
    @Path("/films")
    public Response getFilms() {
        Set<Film> films = cinema.list();
        return Response.ok(films).build();
    }

    // Get a film by its ID
    @GET
    @Path("/films/{id}")
    public Response getFilm(@PathParam("id") int id) {
        Film film = cinema.findFilm(id);
        if (film != null) {
            return Response.ok(film).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND)
                           .entity("{\"message\":\"Film not found\"}")
                           .build();
        }
    }

    // Add a new film
    @POST
    @Path("/films")
    public Response addFilm(Film film) {
        cinema.addfilm(film);
        return Response.status(Response.Status.CREATED).entity(film).build();
    }

    // Update an existing film
    @PUT
    @Path("/films")
    public Response updateFilm(Film film) {
        cinema.update(film);
        return Response.ok(film).build();
    }

//    // Search for films by a pattern
    @GET
    @Path("/films/search/{pattern}")
    public Response findFilmsByPattern(@PathParam("pattern") String pattern) {
        // Fetch the films matching the pattern
        Set<Film> films = cinema.findByPattern("%" + pattern + "%"); // Add wildcards if applicable
        return Response.ok(films).build(); // Return an HTTP 200 response with the result
    }


    // Get all salle programs
    @GET
    @Path("/salleProg")
    public Response getAllSalleProg() {
        Set<SalleProg> salleProgs = cinema.getAllSalleProg();
        return Response.ok(salleProgs).build();
    }
    
    @GET
    @Path("/seance")
    public Response getAllSeance() {
        Set<Seance> seance = cinema.getAllSeance();
        return Response.ok(seance).build();
    }

    // Get the tarif (price)
   
    @GET
    @Path("/compte")
    public Response getCompte() {
        Set<Compte> Comptes = utilisateurService.listc();
        return Response.ok(Comptes).build();
    }
    @POST
    @Path("/compte")
    public Response addCompte(Compte compte) {
    	utilisateurService.addCompte(compte);
        return Response.status(Response.Status.CREATED).entity(compte).build();
    }
    @DELETE
    @Path("/compte/{id}")
    public Response deleteCompte(@PathParam("id") int id) {
        try {
            utilisateurService.deleteCompte(id);  // Call the delete method from UtilisateurLocal
            return Response.status(Response.Status.NO_CONTENT).build();  // No content is returned on successful delete
        } catch (EntityNotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND)
                           .entity("Compte with ID " + id + " not found").build();
        }
    }
    @DELETE
    @Path("/films/{id}")
    public Response deleteFilm(@PathParam("id") int id) {
        try {
        	cinema.deleteFilm(id) ; // Call the delete method from UtilisateurLocal
            return Response.status(Response.Status.NO_CONTENT).build();  // No content is returned on successful delete
        } catch (EntityNotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND)
                           .entity("Compte with ID " + id + " not found").build();
        }
    }
    @GET
    @Path("/tarif/{id}")
    public Response getTarif(@PathParam("id") int id) {  // The id is passed as a path parameter
        try {
            float tarif = cinema.getTarif(id);  // Pass the id to the method that fetches the tarif
            return Response.ok(tarif).build();
        } catch (EntityNotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND)
                           .entity("Seance with ID " + id + " not found").build();
        }
    }
    @PUT
    @Path("/compte/{id}/seance/{sid}")
    public Response updateSolde(@PathParam("id") int id, @PathParam("sid") int sid) {
        try {
            utilisateurService.updateSolde(id, sid);  
            return Response.status(Response.Status.NO_CONTENT).build();  // Success with no content
        } catch (EntityNotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND)
                           .entity(e.getMessage())  // Use the message from the exception for more context
                           .build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                           .entity(e.getMessage())  // Handle invalid input gracefully
                           .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                           .entity("An unexpected error occurred: " + e.getMessage())
                           .build();
        }
    }
    @POST
    @Path("/seance")
    public Response addSeance(Seance seance) {
    	cinema.addSeance(seance);
        return Response.status(Response.Status.CREATED).entity(seance).build();
    }
    @POST
    @Path("/salleProg")
    public Response addSalleprog(SalleProg salleprog ){
    	cinema.addSalleprog(salleprog);
        return Response.status(Response.Status.CREATED).entity(salleprog).build();
    }
    @DELETE
    @Path("/seance/{id}")
    public Response deleteSeance(@PathParam("id") int id) {
        try {
        	cinema.deleteSeance(id) ; // Call the delete method from UtilisateurLocal
            return Response.status(Response.Status.NO_CONTENT).build();  // No content is returned on successful delete
        } catch (EntityNotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND)
                           .entity("Compte with ID " + id + " not found").build();
        }
    }



  
    
}
