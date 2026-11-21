
import { User } from "../models/User";

export class UserRepository {
    private users: User[] = [];

    // Ajouter un utilisateur
    public add(user: User): void {
        if (this.findById(user.getUserId())) {
            throw new Error("User already exists.");
        }

        if (this.findByEmail(user.getEmail())) {
            throw new Error("Email already exists.");
        }

        this.users.push(user);
    }

    // Rechercher un utilisateur par identifiant
    public findById(userId: number): User | undefined {
        return this.users.find(
            user => user.getUserId() === userId
        );
    }

    // Rechercher un utilisateur par adresse e-mail
    public findByEmail(email: string): User | undefined {
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail) {
            return undefined;
        }

        return this.users.find(
            user => user.getEmail().trim().toLowerCase() === normalizedEmail
        );
    }

    // Récupérer tous les utilisateurs
    public findAll(): User[] {
        return [...this.users];
    }

    // Mettre à jour un utilisateur
    public update(user: User): boolean {
        const index = this.users.findIndex(
            item => item.getUserId() === user.getUserId()
        );

        if (index === -1) {
            return false;
        }

        const existingEmailUser = this.findByEmail(user.getEmail());

        if (existingEmailUser &&
            existingEmailUser.getUserId() !== user.getUserId()) {
            throw new Error("Email already exists.");
        }

        this.users[index] = user;
        return true;
    }

    // Supprimer un utilisateur
    public delete(userId: number): boolean {
        const index = this.users.findIndex(
            user => user.getUserId() === userId
        );

        if (index === -1) {
            return false;
        }

        this.users.splice(index, 1);
        return true;
    }
}
