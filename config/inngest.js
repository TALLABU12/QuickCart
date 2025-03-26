import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

// Création d'un client pour envoyer et recevoir des événements
export const inngest = new Inngest({ id: "quickcart-next" });

// Fonction pour synchroniser et sauvegarder les données utilisateur dans la base de données
export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk"
  },
  {event: "clerk/user.created"
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      imageUrl: image_url,
    };

    // Connexion à la base de données et sauvegarde des données utilisateur
    await connectDB();
    await User.create(userData);
  }
);
// Fonction Inngest pour mettre à jour les données utilisateur dans la base de données
export const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk" // Identifiant unique de la fonction
  },
  {
    event: "clerk/user.updated" // Nom de l'événement à écouter
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    // Structure des données utilisateur
    const userData = {
      _id: id,
      email: email_addresses[0].email_address, // Adresse e-mail principale
      name: first_name + ' ' + last_name, // Nom complet
      imageUrl: image_url // URL de l'image utilisateur
    };

    // Connexion à la base de données
    await connectDB();

    // Mise à jour des données utilisateur dans la base
    await User.findByIdAndUpdate(id, userData);
  }
);
// Fonction Inngest pour supprimer un utilisateur de la base de données
export const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk" // Identifiant unique de la fonction
  },
  {
    event: "clerk/user.deleted" // Nom de l'événement à écouter
  },
  async ({ event }) => {
    const { id } = event.data; // Récupération de l'ID utilisateur depuis les données de l'événement

    // Connexion à la base de données
    await connectDB();
    await User.findByIdAndDelete(id);
   

   
  }
);
