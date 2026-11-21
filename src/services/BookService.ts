
import { Book } from "../models/Book";
import { BookCopy } from "../models/BookCopy";
import { CopyStatus } from "../models/BookCopy";

export class BookService {

    // Collections temporaires stockées en mémoire
    private books: Book[] = [];
    private copies: BookCopy[] = [];

    // Ajouter un nouveau livre au catalogue
    public addBook(book: Book): void {

        // Vérifier si l'identifiant existe déjà
        const existingId = this.findBookById(book.getBookId());

        if (existingId) {
            throw new Error("A book with this ID already exists.");
        }

        // Vérifier si l'ISBN existe déjà
        const existingISBN = this.findBookByISBN(book.getISBN());

        if (existingISBN) {
            throw new Error("A book with this ISBN already exists.");
        }

        // Vérifier les informations obligatoires
        if (
            !book.getTitle().trim() ||
            !book.getAuthor().trim() ||
            !book.getISBN().trim()
        ) {
            throw new Error("Book information cannot be empty.");
        }

        this.books.push(book);
    }

    // Rechercher un livre par son identifiant
    public findBookById(bookId: number): Book | undefined {

        return this.books.find(
            book => book.getBookId() === bookId
        );
    }

    // Rechercher des livres par titre
    public findBooksByTitle(title: string): Book[] {

        const searchTerm = title.trim().toLowerCase();

        if (!searchTerm) {
            return [];
        }

        return this.books.filter(
            book => book.getTitle().toLowerCase().includes(searchTerm)
        );
    }

    // Rechercher des livres par auteur
    public findBooksByAuthor(author: string): Book[] {

        const searchTerm = author.trim().toLowerCase();

        if (!searchTerm) {
            return [];
        }

        return this.books.filter(
            book => book.getAuthor().toLowerCase().includes(searchTerm)
        );
    }

    // Rechercher un livre par ISBN
    public findBookByISBN(isbn: string): Book | undefined {

        const searchTerm = isbn.trim().toLowerCase();

        return this.books.find(
            book => book.getISBN().trim().toLowerCase() === searchTerm
        );
    }

    // Ajouter un exemplaire physique à un livre existant
    public addBookCopy(
        bookId: number,
        copyId: number,
        shelfLocation: string
    ): BookCopy {

        const book = this.findBookById(bookId);

        if (!book) {
            throw new Error("Cannot add a copy to a non-existing book.");
        }

        // Vérifier l'unicité de l'identifiant de l'exemplaire
        const existingCopy = this.copies.find(
            copy => copy.getCopyId() === copyId
        );

        if (existingCopy) {
            throw new Error("A copy with this ID already exists.");
        }

        if (!shelfLocation.trim()) {
            throw new Error("Shelf location cannot be empty.");
        }

        // Créer et enregistrer le nouvel exemplaire
        const copy = new BookCopy(copyId, book, shelfLocation);

        this.copies.push(copy);

        return copy;
    }

    // Récupérer tous les exemplaires d'un livre
    public getCopiesForBook(bookId: number): BookCopy[] {

        return this.copies.filter(
            copy => copy.getBook().getBookId() === bookId
        );
    }

    // Récupérer uniquement les exemplaires disponibles
    public getAvailableCopies(bookId: number): BookCopy[] {

        return this.getCopiesForBook(bookId).filter(
            copy => copy.getStatus() === CopyStatus.Available
        );
    }

    // Récupérer tous les livres du catalogue
    public getAllBooks(): Book[] {

        return [...this.books];
    }

    // Récupérer tous les exemplaires physiques
    public getAllCopies(): BookCopy[] {

        return [...this.copies];
    }
}
