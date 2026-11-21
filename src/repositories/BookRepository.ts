
import { Book } from "../models/Book";

export class BookRepository {
    private books: Book[] = [];

    // Ajouter un livre
    public add(book: Book): void {
        if (this.findById(book.getBookId())) {
            throw new Error("Book already exists.");
        }

        this.books.push(book);
    }

    // Rechercher un livre par son identifiant
    public findById(bookId: number): Book | undefined {
        return this.books.find(book => book.getBookId() === bookId);
    }

    // Récupérer tous les livres
    public findAll(): Book[] {
        return [...this.books];
    }

    // Mettre à jour un livre
    public update(book: Book): boolean {
        const index = this.books.findIndex(
            item => item.getBookId() === book.getBookId()
        );

        if (index === -1) {
            return false;
        }

        this.books[index] = book;
        return true;
    }

    // Supprimer un livre
    public delete(bookId: number): boolean {
        const index = this.books.findIndex(
            book => book.getBookId() === bookId
        );

        if (index === -1) {
            return false;
        }

        this.books.splice(index, 1);
        return true;
    }
}
