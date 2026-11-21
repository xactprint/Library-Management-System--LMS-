
import { BookService } from "./BookService";
import { LoanService } from "./LoanService";
import { CopyStatus } from "../models/BookCopy";
import { LoanStatus } from "../models/Loan";

export class ReportService {

    private bookService: BookService;
    private loanService: LoanService;

    constructor(
        bookService: BookService,
        loanService: LoanService
    ) {
        this.bookService = bookService;
        this.loanService = loanService;
    }

    // Générer les statistiques du catalogue
    public generateBooksReport() {
        const books = this.bookService.getAllBooks();
        const copies = this.bookService.getAllCopies();

        return {
            totalBooks: books.length,
            totalCopies: copies.length
        };
    }

    // Générer les statistiques de disponibilité
    public generateAvailabilityReport() {
        const copies = this.bookService.getAllCopies();

        const availableCopies = copies.filter(
            copy => copy.getStatus() === CopyStatus.Available
        ).length;

        const issuedCopies = copies.filter(
            copy => copy.getStatus() === CopyStatus.Issued
        ).length;

        return {
            totalCopies: copies.length,
            availableCopies,
            issuedCopies
        };
    }

    // Générer les statistiques des emprunts
    public generateLoansReport() {
        const loans = this.loanService.getAllLoans();

        const activeLoans = loans.filter(
            loan => loan.getStatus() === LoanStatus.Active
        ).length;

        const returnedLoans = loans.filter(
            loan => loan.getStatus() === LoanStatus.Returned
        ).length;

        return {
            totalLoans: loans.length,
            activeLoans,
            returnedLoans
        };
    }

    // Générer les statistiques des emprunts en retard
    public generateOverdueReport(referenceDate: Date = new Date()) {
        const loans = this.loanService.getAllLoans();

        const overdueLoans = loans.filter(
            loan =>
                loan.getStatus() === LoanStatus.Active &&
                loan.getOverdueDays(referenceDate) > 0
        );

        return {
            overdueCount: overdueLoans.length,
            overdueLoanIds: overdueLoans.map(
                loan => loan.getLoanId()
            )
        };
    }
}
