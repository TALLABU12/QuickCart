import { Inngest } from "inngest";
import connectDB from "./db";
import User from "models/User";

// Crée une seule instance d'Inngest pour éviter les conflits
export const inngest = new Inngest({ id: "quickcart-next" });

// Fonction pour synchroniser et sauvegarder les données utilisateur dans la base de données
export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  { event: "clerk/user.created" },
  async (event) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      if (!id || !email_addresses?.[0]?.email_address) {
        throw new Error("Données utilisateur invalides");
      }

      const userData = {
        id: id,
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`,
        imageUrl: image_url,
      };

      await connectDB();
      await User.create(userData);
      console.log(`Utilisateur créé avec succès : ${userData.email}`);
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur :", error);
      throw error;
    }
  }
);

// Fonction Inngest pour mettre à jour les données utilisateur dans la base de données
export const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
  },
  { event: "clerk/user.updated" },
  async (event) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;

      const userData = {
        _id: id,
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`,
        imageUrl: image_url,
      };

      await connectDB();
      const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
      if (!updatedUser) {
        throw new Error(`Utilisateur avec ID ${id} introuvable pour mise à jour`);
      }
      console.log(`Utilisateur mis à jour avec succès : ${userData.email}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
      throw error;
    }
  }
);

// Fonction Inngest pour supprimer un utilisateur de la base de données
export const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
  },
  { event: "clerk/user.deleted" },
  async (event) => {
    try {
      const { id } = event.data;
      await connectDB();
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        throw new Error(`Utilisateur avec ID ${id} introuvable pour suppression`);
      }
      console.log(`Utilisateur supprimé avec succès : ${id}`);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
      throw error;
    }
  }
);
