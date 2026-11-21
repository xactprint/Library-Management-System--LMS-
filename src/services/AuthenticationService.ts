
import { User } from "../models/User";
import { Member } from "../models/Member";
import { PasswordVerifier } from "../security/PasswordVerifier";

export class AuthenticationService {

    private users: User[] = [];
    private currentUser: User | null = null;
    private passwordVerifier: PasswordVerifier;

    constructor(passwordVerifier: PasswordVerifier) {
        this.passwordVerifier = passwordVerifier;
    }

    // Ajouter un utilisateur au système
    public addUser(user: User): void {

        if (!user.getEmail().trim()) {
            throw new Error("Email cannot be empty.");
        }

        if (this.findUserByEmail(user.getEmail())) {
            throw new Error("An account with this email already exists.");
        }

        this.users.push(user);
    }

    // Rechercher un utilisateur par son adresse email
    public findUserByEmail(email: string): User | undefined {

        const searchEmail = email.trim().toLowerCase();

        if (!searchEmail) {
            return undefined;
        }

        return this.users.find(
            user => user.getEmail().trim().toLowerCase() === searchEmail
        );
    }

    // Authentifier un utilisateur
    public login(email: string, password: string): User | null {

        // Vérifier les informations fournies
        if (!email.trim() || !password) {
            return null;
        }

        const user = this.findUserByEmail(email);

        if (!user) {
            return null;
        }

        // Vérifier si le compte membre est actif
        if (user instanceof Member && !user.getIsActive()) {
            return null;
        }

        // Vérifier le mot de passe
        const isPasswordValid = user.verifyPassword(
            password,
            this.passwordVerifier
        );

        if (!isPasswordValid) {
            return null;
        }

        this.currentUser = user;

        return user;
    }

    // Déconnecter l'utilisateur courant
    public logout(): void {
        this.currentUser = null;
    }

    // Obtenir l'utilisateur actuellement connecté
    public getCurrentUser(): User | null {
        return this.currentUser;
    }

    // Vérifier si une session est active
    public isAuthenticated(): boolean {
        return this.currentUser !== null;
    }

    // Obtenir le rôle de l'utilisateur connecté
    public getCurrentUserRole(): string | null {

        if (!this.currentUser) {
            return null;
        }

        return this.currentUser.getRole();
    }
}
