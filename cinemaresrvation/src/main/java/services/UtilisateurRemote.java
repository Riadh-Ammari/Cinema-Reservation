package services;


import java.util.Set;

import jakarta.ejb.Remote;
import model.Compte;
import model.Seance;


@Remote
public interface UtilisateurRemote {
     //Initialiser le bean compte bancaire utilisateur (authentification) 
     public void init(String name, String passwd); 
     
     public String getName() ; 
     
     public float solde() ; 
     public Set<Compte> listc ();
     public void addCompte (Compte c);
     // D�biter le compte de l'utilisateur
     void deleteCompte(int compteId); 
     public void updateSolde(int id,int sid);
     
}
