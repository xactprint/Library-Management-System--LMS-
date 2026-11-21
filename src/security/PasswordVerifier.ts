
export interface PasswordVerifier {

    // Vérifier un mot de passe avec son empreinte stockée
    verify(password: string, passwordHash: string): boolean;

}
