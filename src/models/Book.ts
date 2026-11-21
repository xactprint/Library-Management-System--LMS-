
export class Book {
    // Attributs privés : accessibles uniquement depuis cette classe
    private bookId: number;
    private title: string;
    private author: string;
    private isbn: string;
    private publisher: string;

    // Constructeur : initialise les informations du livre
    constructor(
        bookId: number,
        title: string,
        author: string,
        isbn: string,
        publisher: string
    ) {
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.publisher = publisher;
    }

    // Getters : permettent de consulter les attributs privés
    public getBookId(): number {
        return this.bookId;
    }

    public getTitle(): string {
        return this.title;
    }

    public getAuthor(): string {
        return this.author;
    }

    public getISBN(): string {
        return this.isbn;
    }

    public getPublisher(): string {
        return this.publisher;
    }

    // Modifie les informations générales du livre
    public updateBookInfo(
        title: string,
        author: string,
        publisher: string
    ): void {
        this.title = title;
        this.author = author;
        this.publisher = publisher;
    }

    // Retourne toutes les informations du livre
    public getBookDetails(): string {
        return `Book ID: ${this.bookId}
Title: ${this.title}
Author: ${this.author}
ISBN: ${this.isbn}
Publisher: ${this.publisher}`;
    }
}
