### 3.7 UML Use Case Diagram

The Use Case Diagram illustrates the interactions between the three main actors and the Library Management System.

The system includes three actors:

- **Member:** Searches for books, checks availability, views borrowing history, and checks due dates.
- **Librarian:** Manages books and members, processes book loans and returns, and monitors overdue books.
- **Administrator:** Manages librarian accounts, configures the system, and generates reports.

The diagram also uses the UML `<<include>>` relationship to represent mandatory operations.

For example, issuing a book includes validating the member, checking the borrowing limit, checking book availability, and updating the physical copy status.

This diagram provides a clear overview of the system's functional requirements and defines the responsibilities of each actor.

### 3.8 UML Sequence Diagrams

Sequence Diagrams describe how different objects interact over time to perform specific operations in the Library Management System.

Two important scenarios have been modeled:

**1. Borrowing a Book**

When a member requests to borrow a book, the librarian selects the member and the physical book copy through the library interface. The LoanService validates the member, checks the maximum number of active loans, and verifies the availability of the selected copy.

If all conditions are satisfied, the system creates a loan record and changes the copy status to `Issued`. Otherwise, the request is rejected with an appropriate message.

**2. Returning a Book**

When a member returns a borrowed book, the librarian selects the corresponding active loan. The LoanService retrieves the loan information and verifies its validity.

The system checks the due date, calculates any overdue days, records the return date, and changes the loan status to `Returned`. Finally, the physical book copy status is updated to `Available`.

Both diagrams demonstrate the collaboration between the user interface, business services, repositories, and database operations.

Database transactions should be used to ensure that related updates are completed consistently.

### 3.9 UML State Diagram

The State Diagram illustrates the lifecycle of a physical book copy (BookCopy) in the Library Management System.

The main states are:

- **Available:** The book copy is available for borrowing.
- **Issued:** The book copy has been borrowed by a registered member.
- **Returned:** The return operation has been recorded and the associated loan has been closed.

The main state transitions are triggered by system events. When a librarian successfully issues a book copy, its state changes from `Available` to `Issued`.

When the member returns the book, the system records the return date and changes the associated loan status to `Returned`. The physical book copy then returns to the `Available` state.

The diagram also reflects important business rules, such as preventing unavailable copies from being borrowed and preventing invalid return operations.

This model helps maintain accurate information about the availability and borrowing history of physical book copies.

### 4.4 Data, Functional and Behavioral Modeling Summary

The Data, Functional and Behavioral Modeling phase defines how the Library Management System stores information, performs operations, and responds to different events.

**Data Modeling** identifies the main entities, their attributes, primary keys, foreign keys, and relationships. The proposed database includes five main entities: User, Member, Book, BookCopy, and Loan.

**Functional Modeling** describes the main operations of the system, including book management, member registration, book searching, borrowing, returning, and report generation.

**Behavioral Modeling** defines the system's responses to user actions and business events. It includes member validation, book availability checks, borrowing limits, loan processing, book returns, and overdue detection.

Together, these models provide a structured representation of the system's data, operations, and behavior. They also establish a foundation for the implementation phase.

### 5.3 Implementation of the BookCopy Class

The `BookCopy` class represents a physical copy of a book available in the library. While the `Book` class describes a bibliographic title, the `BookCopy` class represents an individual physical item.

Each copy has a unique identifier, a reference to its associated book, a status, and a shelf location.

The implementation uses a TypeScript enumeration named `CopyStatus`, which defines two possible states: `Available` and `Issued`.

Encapsulation is applied by declaring the class attributes as private. The status cannot be modified directly from outside the class. Instead, controlled methods such as `markAsIssued()` and `markAsAvailable()` manage status changes.

The `markAsIssued()` method checks whether the copy is available before changing its status. This prevents an already issued copy from being borrowed again.

The relationship between `Book` and `BookCopy` allows one bibliographic title to be associated with several physical copies. This distinction is essential for managing book availability and individual borrowing operations.

This implementation demonstrates the use of **Enums, Encapsulation, Object References, and Object-Oriented Relationships** in TypeScript.

### 5.4 Implementation of the Abstract User Class and Member Class

The `User` class is designed as an abstract parent class that defines the common attributes and behavior shared by all system users. These attributes include `userId`, `fullName`, `email`, and `passwordHash`.

The class uses encapsulation by declaring its attributes as private. It also defines an abstract method named `getRole()`, which requires each concrete subclass to provide its own role.

The `Member` class extends the `User` class using TypeScript's `extends` keyword. It inherits the common user attributes and methods while introducing specific attributes such as `memberId`, `membershipNumber`, `registrationDate`, and `isActive`.

The `super()` keyword is used in the `Member` constructor to initialize the inherited properties through the parent class constructor.

The `Member` class also implements methods to retrieve membership information, deactivate an account, reactivate an account, and identify the user's role.

This implementation demonstrates two important object-oriented programming principles: **Abstraction and Inheritance**. It also promotes code reuse and reduces duplication by centralizing common user properties in a single parent class.

### 5.5 Implementation of the Librarian and Administrator Classes

The `Librarian` and `Administrator` classes extend the abstract `User` class. Both classes inherit the common user attributes and methods while introducing properties specific to their responsibilities.

The `Librarian` class includes an employee identifier and a hire date. It represents a library staff member responsible for daily operations, such as managing books, registering members, and processing borrowing and return transactions.

The `Administrator` class includes an access level and represents a user responsible for administrative activities, including librarian account management, system configuration, and report generation.

Both classes implement the abstract `getRole()` method inherited from `User`. The `Librarian` class returns `"Librarian"`, whereas the `Administrator` class returns `"Administrator"`.

This implementation demonstrates **Inheritance**, **Method Overriding**, and **Polymorphism**. The polymorphism concept is illustrated by storing objects of different subclasses in an array of type `User[]` and invoking the same `getRole()` method on each object. Each object responds according to its actual class.

This approach improves code reuse, consistency, and extensibility within the Library Management System.

### 5.6 Implementation of the Loan Class

The `Loan` class represents a borrowing transaction between a library member and a physical book copy.

It contains attributes such as `loanId`, `member`, `bookCopy`, `issueDate`, `dueDate`, `returnDate`, and `status`.

A TypeScript enumeration named `LoanStatus` defines two possible states: `Active` and `Returned`. The `returnDate` attribute uses the union type `Date | null`, allowing the system to distinguish between active loans and completed transactions.

The constructor validates the member's account status, checks the due date, verifies the member's active loan limit, and ensures that the requested book copy is available. Once the loan is created, the copy status changes to `Issued`.

The `markAsReturned()` method records the return date, changes the loan status to `Returned`, and makes the physical copy available again.

The `getOverdueDays()` method calculates the number of days between the due date and the actual return date, or a reference date when the loan is still active.

This implementation demonstrates **Object Relationships, Encapsulation, Enums, Date Handling, and Business Rule Validation**. It also establishes the foundation for managing borrowing history and overdue books.

### 5.7 Integration and Testing of the Object-Oriented Classes

After implementing the seven main classes, integration testing was performed to verify that the objects interact correctly and that the system follows the defined business rules.

The testing process covered the following areas:

**1. Integration Testing**

The relationships between `Book`, `BookCopy`, `Member`, and `Loan` were verified. The tests confirmed that creating a loan changes the associated book copy status to `Issued`, while returning the book changes it back to `Available`.

**2. Functional Testing**

The main operations were tested, including loan creation, book return, status updates, and overdue-day calculation.

**3. Business Rule Validation**

The following business rules were successfully tested:

- Inactive members cannot borrow books.
- Unavailable book copies cannot be borrowed.
- Members cannot exceed the maximum of three active loans.
- A loan cannot be returned more than once.
- The due date must be later than the issue date.

**4. Object-Oriented Programming Validation**

The implementation demonstrated encapsulation through private attributes and public methods, inheritance through the `User` subclasses, abstraction through the abstract `User` class, and polymorphism through the use of a common `User` reference.

The relationships between the main domain objects were also verified.

**5. Test Results**

The integration testing process produced the following results:

| Metric             | Result |
| ------------------ | -----: |
| Total tests        |     11 |
| Passed tests       |     11 |
| Failed tests       |      0 |
| Compilation errors |      0 |

**Conclusion**

All 11 integration and business rule tests passed successfully. The results provide evidence that the main object-oriented components work together as expected and respect the defined business rules.

The implementation establishes a functional foundation for the Library Management System and prepares it for further development, including service-layer implementation and database integration.

### 6.1 Implementation of the Loan Service

The Loan Service was implemented as part of the Business Logic Layer of the Library Management System.

Its primary responsibility is to coordinate borrowing and returning operations while enforcing the business rules defined during the analysis and design phases.

The `LoanService` class provides the following methods:

- `borrowBook()`: Creates a new loan after validating the borrowing conditions.
- `returnBook()`: Records the return of a borrowed book.
- `findLoanById()`: Retrieves a loan using its unique identifier.
- `getAllLoans()`: Returns the complete list of loans.
- `getActiveLoansForMember()`: Retrieves all active loans belonging to a specific member.
- `getActiveLoanCount()`: Calculates the number of active loans for a member.

The service interacts with the `Member`, `BookCopy`, and `Loan` model classes. It delegates the enforcement of borrowing rules to the `Loan` class, including member eligibility, book availability, the maximum number of active loans, and date validation.

For this implementation, loan records are temporarily stored in an in-memory array. A persistent repository and database integration can be introduced in a later development stage.

#### 6.1.1 Testing and Validation

The `LoanService` implementation was tested using a dedicated TypeScript test file named `loanService.test.ts`.

A total of 17 tests were executed successfully, covering normal operations and business rule validation.

| Validation   | Result |
| ------------ | -----: |
| Total tests  |     17 |
| Passed tests |     17 |
| Failed tests |      0 |
| Success rate |   100% |

The TypeScript compilation check (`npx tsc --noEmit`) also completed without errors.

These results confirm that the Loan Service behaves as expected for the tested scenarios.

### 6.2 Implementation of the Book Service

The Book Service was implemented as part of the Business Logic Layer of the Library Management System.

Its main responsibility is to manage the library catalogue and the physical copies associated with each bibliographic record.

The `BookService` class maintains two in-memory collections:

- `books`: stores bibliographic records represented by the `Book` class.
- `copies`: stores physical book copies represented by the `BookCopy` class.

The service provides the following methods:

- `addBook()`: Adds a new book to the catalogue while checking the uniqueness of its ID and ISBN.
- `findBookById()`: Searches for a book using its unique identifier.
- `findBooksByTitle()`: Searches for books using their titles, supporting partial and case-insensitive matching.
- `findBooksByAuthor()`: Searches for books by author.
- `findBookByISBN()`: Retrieves a book using its ISBN.
- `addBookCopy()`: Creates a physical copy associated with an existing book.
- `getCopiesForBook()`: Retrieves all physical copies belonging to a specific book.
- `getAvailableCopies()`: Returns only the copies whose status is Available.
- `getAllBooks()`: Returns the complete book catalogue.
- `getAllCopies()`: Returns all registered physical copies.

The implementation preserves the distinction between a bibliographic record and its physical copies. A single `Book` object can therefore be associated with multiple `BookCopy` objects, each having its own unique identifier, shelf location, and availability status.

#### 6.2.1 Testing and Validation

The implementation was tested using a dedicated TypeScript test file named `bookService.test.ts`.

A total of 17 tests were executed successfully. They covered book registration, catalogue searches, ISBN and identifier uniqueness, physical copy management, and availability tracking.

| Validation   | Result |
| ------------ | -----: |
| Total tests  |     17 |
| Passed tests |     17 |
| Failed tests |      0 |
| Success rate |   100% |

The TypeScript compilation check (`npx tsc --noEmit`) also completed without errors.

These results confirm that the Book Service performs the expected catalogue and physical copy management operations for the tested scenarios.

### 6.3 Implementation of the Member Service

The `MemberService` class implements the business logic responsible for managing library members. It provides operations for registering members, searching for existing members, retrieving member lists, and managing membership status.

**Main Responsibilities**

The service maintains an in-memory collection of registered members and provides the following methods:

- `addMember()`: Registers a new member after validating the member's information and checking for duplicate IDs, membership numbers, and email addresses.
- `findMemberById()`: Searches for a member using their unique ID.
- `findMemberByNumber()`: Searches for a member using their membership number.
- `findMemberByEmail()`: Searches for a member using their email address, without considering uppercase or lowercase differences.
- `getAllMembers()`: Returns all registered members.
- `getActiveMembers()`: Returns only members whose accounts are active.
- `activateMember()`: Reactivates an existing member.
- `deactivateMember()`: Deactivates an existing member.
- `getMemberCount()`: Returns the total number of registered members.
- `getActiveMemberCount()`: Returns the number of active members.

**Business Rules and Validation**

The implementation enforces several important business rules:

1. Each member must have a unique member ID.
2. Each membership number must be unique.
3. Each member must have a unique email address.
4. Essential member information cannot be empty.
5. Only registered members can be activated or deactivated through the service.
6. Inactive members are excluded from the active members list.

**Testing and Validation**

A dedicated test file, `memberService.test.ts`, was created to verify the service's functionality.

The test suite covers member registration, searching, duplicate detection, activation and deactivation, and member counting.

The following commands were executed successfully:

```powershell
npx tsc --noEmit
npx ts-node src/tests/memberService.test.ts
```

**Test Results:**

- Total tests: 19
- Passed tests: 19
- Failed tests: 0

All tests passed successfully, confirming that the `MemberService` behaves as expected.

**Implementation Note**

At this stage, member data is stored in an in-memory array. This approach is suitable for demonstrating the business logic. In a production system, member records would be managed through a database and a dedicated repository layer.

### 6.4 Implementation of the Authentication Service

The `AuthenticationService` class implements the authentication functionality of the Library Management System. Its primary responsibility is to verify user credentials, manage the current authenticated user, and identify the user's role.

The service supports the three user categories defined in the object-oriented model: `Member`, `Librarian`, and `Administrator`. This is achieved through the inheritance relationship established by the abstract `User` class.

**Main Responsibilities**

The `AuthenticationService` provides the following methods:

- `addUser()`: Registers a user and prevents duplicate email addresses.
- `findUserByEmail()`: Searches for a user using their email address, regardless of letter case.
- `login()`: Verifies the supplied credentials and authenticates the user if they are valid.
- `logout()`: Ends the current session.
- `getCurrentUser()`: Returns the currently authenticated user.
- `isAuthenticated()`: Checks whether a user is currently logged in.
- `getCurrentUserRole()`: Returns the role of the authenticated user.

**Authentication Process**

The login process follows these steps:

1. The user provides an email address and password.
2. The service searches for the corresponding user account.
3. If the account belongs to a member, the service checks whether the membership is active.
4. The password is verified through the `PasswordVerifier` interface.
5. If all checks succeed, the user becomes the current authenticated user.
6. Otherwise, the authentication attempt is rejected.

**Password Verification and Encapsulation**

The `User` class stores the password hash in a private attribute. It does not expose this value through a public getter.

Instead, the `verifyPassword()` method delegates password verification to an object implementing the `PasswordVerifier` interface.

This design separates authentication logic from password verification and demonstrates encapsulation and abstraction.

**Testing and Validation**

A dedicated test file, `authenticationService.test.ts`, was created to validate the authentication process.

The test suite covers:

- Successful authentication for members, librarians, and administrators.
- Rejection of incorrect passwords and unknown email addresses.
- Case-insensitive email searches.
- Rejection of inactive member accounts.
- Validation of empty credentials.
- Current user and role management.
- Logout functionality.
- Prevention of duplicate email registration.

The following commands were executed successfully:

```powershell
npx tsc --noEmit
npx ts-node src/tests/authenticationService.test.ts
```

**Test Results:**

- Total tests: 18
- Passed tests: 18
- Failed tests: 0

All tests passed successfully.

**Implementation Note**

The authentication service currently uses an in-memory user collection and a simplified password verifier for testing purposes. The test verifier compares strings directly and is not suitable for production password security.

A production implementation would require a secure password hashing algorithm and a persistent user repository. These features are outside the scope of this simplified academic project.

### 6.5 Implementation of the Report Service

The `ReportService` class is responsible for generating basic statistical reports about the library's activities. It provides an overview of the book collection, copy availability, borrowing transactions, and overdue loans.

The service uses the existing `BookService` and `LoanService` to retrieve information. This approach avoids duplicating business logic and respects the Single Responsibility Principle.

**Main Responsibilities**

The `ReportService` provides four main reporting methods:

- `generateBooksReport()`: Returns the total number of registered book titles and physical copies.
- `generateAvailabilityReport()`: Calculates the number of available and issued copies.
- `generateLoansReport()`: Provides the total number of loans, active loans, and returned loans.
- `generateOverdueReport()`: Identifies active loans whose due dates have passed and returns their identifiers.

**Design and Implementation**

The service receives `BookService` and `LoanService` through its constructor. It uses their existing methods to retrieve books, copies, and loan records.

The overdue report relies on the `getOverdueDays()` method implemented in the `Loan` class. Only active loans with overdue days greater than zero are included in the current overdue report. Returned loans are excluded, even if they were returned late.

This design demonstrates separation of responsibilities and reuse of existing business logic.

**Testing and Validation**

A dedicated test file, `reportService.test.ts`, was created to verify the four reporting methods.

The tests cover book and copy counting, availability statistics, loan statistics, and overdue loan identification.

The following commands were executed successfully:

```powershell
npx tsc --noEmit
npx ts-node src/tests/reportService.test.ts
```

**Test Results:**

- Total tests: 11
- Passed tests: 11
- Failed tests: 0

All tests passed successfully.

**Implementation Note**

The reports are generated dynamically from in-memory data. No external reporting database, graphical dashboard, or PDF/Excel export functionality is implemented, as these features are outside the scope of this simplified academic project.

### 6.6 Data Access Layer Implementation

The Data Access Layer is responsible for managing access to the system's data. It separates data storage and retrieval operations from the business logic.

Four repository classes were implemented using in-memory collections:

**1. BookRepository**

Responsible for managing book records. Its main operations include:

- Adding a book.
- Finding a book by its identifier.
- Retrieving all books.
- Updating a book.
- Deleting a book.

**2. MemberRepository**

Responsible for managing library members. It provides operations for adding, searching, updating, and deleting members. It also supports retrieving active members and searching by membership number.

**3. LoanRepository**

Responsible for managing borrowing records. It supports retrieving all loans, finding a loan by its identifier, retrieving active loans, and searching for loans associated with a specific member.

**4. UserRepository**

Responsible for managing system users, including members, librarians, and administrators. It supports user registration, searching by ID or email, updating, and deleting users. It also prevents duplicate user identifiers and email addresses.

**Implementation Approach**

The repositories use private arrays to store objects in memory. Each repository provides basic CRUD operations (Create, Read, Update, Delete).

This implementation demonstrates the responsibilities of the Data Access Layer without requiring an external database or a complex persistence mechanism.

**Testing and Validation**

A dedicated test file, `repository.test.ts`, was created to validate the four repositories.

The tests cover:

- Adding and retrieving records.
- Searching by identifiers and other attributes.
- Updating and deleting records.
- Handling unknown identifiers.
- Rejecting duplicate identifiers and email addresses.
- Retrieving active members and active loans.

The following commands were executed successfully:

```powershell
npx tsc --noEmit
npx ts-node src/tests/repository.test.ts
```

**Test Results:**

| Repository       | Passed Tests |
| ---------------- | -----------: |
| BookRepository   |          8/8 |
| MemberRepository |          9/9 |
| LoanRepository   |          8/8 |
| UserRepository   |        10/10 |
| **Total**        |    **35/35** |

All repository tests passed successfully.

**Implementation Limitations**

The repositories currently operate independently using in-memory arrays. They are not yet connected to an external database.

Furthermore, the five business services still maintain their own in-memory collections. Therefore, the repositories demonstrate the intended Data Access Layer design, but full integration between the Business Logic Layer and Data Access Layer has not been implemented.

These limitations are intentional within the scope of this simplified academic project.

### 6.7.1 Final Project Structure Review

The Library Management System project follows a modular TypeScript structure. Its source code is organized into five main directories: models, repositories, security, services, and tests.

**Project Organization**

- **Models:** Contains seven classes representing the main system entities and user roles, including Book, BookCopy, Member, Loan, User, Librarian, and Administrator.
- **Repositories:** Contains four repository classes responsible for basic data access operations.
- **Security:** Contains the PasswordVerifier interface, which abstracts password verification.
- **Services:** Contains five service classes implementing the main business operations: authentication, book management, member management, loan management, and reporting.
- **Tests:** Contains seven test files covering individual services, repositories, and integration scenarios.

The `index.ts` file serves as the main application entry point.

**Architectural Assessment**

The project structure demonstrates a modular organization and separates domain models, business operations, data access components, and testing.

The presentation layer and external database are not implemented in this prototype. The repositories and services currently use in-memory collections rather than persistent database storage.

This structure is appropriate for the simplified academic implementation and provides a foundation for future extensions.

### 6.7.3 Services and Repository Consistency Review

The implemented services were reviewed to verify their consistency with the system architecture and the previously defined UML models.

**LoanService**

Manages borrowing and returning operations. It validates loan creation through the Loan model, maintains borrowing records, and provides methods for retrieving active loans and calculating the number of active loans per member.

**BookService**

Manages the book catalogue and physical book copies. It supports book registration, searching by title, author, and ISBN, and the management of physical copies and their availability.

**MemberService**

Manages library membership operations. It supports member registration, searching, activation, deactivation, and member statistics.

**Architectural Consistency**

The three services follow the responsibilities assigned to the Business Logic Layer. Their operations are consistent with the system's domain models and business rules.

The repository classes have also been implemented and tested independently. However, the services currently maintain their own in-memory collections rather than delegating data operations to these repositories.

Consequently, the Data Access Layer is demonstrated as a separate architectural component but is not fully integrated with the Business Logic Layer.

The presentation layer and persistent database are also outside the scope of the current implementation.

This approach keeps the prototype focused on demonstrating object-oriented design, business logic, modular organization, and basic data access responsibilities.

### 6.7.3 Services and Repository Consistency Review – Authentication and Reporting

**AuthenticationService**

The AuthenticationService manages user authentication and the current authenticated user.

Its main responsibilities include registering users, searching for accounts by email, verifying credentials, preventing inactive members from logging in, and managing the current authentication state.

The service uses the PasswordVerifier interface to abstract password verification. This design reduces coupling between authentication logic and the underlying password verification mechanism.

The current implementation uses an in-memory representation of the authenticated user. It does not implement persistent sessions, token management, or session expiration.

**ReportService**

The ReportService generates basic library statistics by collaborating with BookService and LoanService.

It provides four reporting operations:

- Book and physical copy statistics.
- Copy availability statistics.
- Active and returned loan statistics.
- Overdue loan identification.

The service uses the existing domain models and status enumerations to calculate its results.

**Overall Assessment**

The five implemented services are consistent with their intended responsibilities in the Business Logic Layer.

Their operations correspond to the system's functional requirements and demonstrate collaboration between domain models and service components.

The repositories remain independently implemented and tested. Full integration between the services and repositories has not been performed in this prototype.

### 6.7.4 Integration Testing

Integration testing was performed to verify the collaboration between the main components of the Library Management System.

A dedicated test file, `integration.test.ts`, was created to validate a complete borrowing workflow.

The test scenarios cover:

1. Registering a book in the catalogue.
2. Creating a physical copy of the registered book.
3. Registering a library member.
4. Borrowing an available book copy.
5. Verifying the member's active loan count.
6. Returning the borrowed copy.
7. Verifying that the loan is no longer active.
8. Generating book statistics.
9. Generating copy availability statistics.
10. Generating loan statistics.

The tests verify the collaboration between BookService, MemberService, LoanService, ReportService, and their associated domain models.

**Test Execution**

The following commands were executed successfully:

```powershell
npx tsc --noEmit
npx ts-node src/tests/integration.test.ts
```

**Results**

- Total integration tests: 10
- Passed tests: 10
- Failed tests: 0

All integration tests passed successfully.

The results demonstrate that the main application components can collaborate correctly during a complete borrowing and returning workflow.

The tests use in-memory data and do not cover external database integration or user interface interactions.

### 6.8 Functional Requirements Traceability

#### 6.8.1 Analysis of Functional Requirements FR01–FR04

The first four functional requirements were reviewed against the implemented TypeScript components.

| Requirement | Description                           | Main Components                 | Implementation Status |
| ----------- | ------------------------------------- | ------------------------------- | --------------------- |
| FR01        | Add, update and delete books          | BookService, BookRepository     | Partially implemented |
| FR02        | Search books by title, author or ISBN | BookService                     | Implemented           |
| FR03        | Register and manage members           | MemberService, MemberRepository | Partially implemented |
| FR04        | Check book availability               | BookService, BookCopy           | Implemented           |

**FR01 – Add, Update and Delete Books**

The BookService provides the `addBook()` method for registering new books. The BookRepository also provides `update()` and `delete()` methods. However, these repository operations are not integrated into BookService. Therefore, the requirement is considered partially implemented.

**FR02 – Search Books**

The BookService supports searching books by title, author and ISBN through `findBooksByTitle()`, `findBooksByAuthor()` and `findBookByISBN()`. Title and author searches support partial and case-insensitive matching. This requirement is considered implemented.

**FR03 – Register and Manage Members**

The MemberService supports member registration, searching, activation and deactivation. The MemberRepository provides additional update and delete operations, but these are not integrated into MemberService. Therefore, this requirement is considered partially implemented.

**FR04 – Check Book Availability**

The BookService provides methods for retrieving all copies of a book and filtering available copies. The BookCopy model also provides availability-checking functionality. Availability is additionally validated during the borrowing process. This requirement is considered implemented.

This review distinguishes between operations that exist in the source code and functionalities that are fully integrated into the application services.

#### 6.8.2 Analysis of Functional Requirements FR05–FR08

The next four functional requirements concern the borrowing and returning process.

| Requirement | Description            | Main Components             | Implementation Status |
| ----------- | ---------------------- | --------------------------- | --------------------- |
| FR05        | Issue books to members | LoanService, Loan           | Implemented           |
| FR06        | Record book returns    | LoanService, Loan, BookCopy | Implemented           |
| FR07        | Track due dates        | Loan, LoanService           | Implemented           |
| FR08        | Identify overdue books | Loan, ReportService         | Implemented           |

**FR05 – Issue Books to Members**

The LoanService provides the `borrowBook()` method to create new loans. Before creating a loan, the Loan model validates the member's active status, the availability of the selected copy, the due date and the maximum number of active loans per member. When all conditions are satisfied, the loan is created and the physical copy is marked as Issued.

**FR06 – Record Book Returns**

The LoanService provides the `returnBook()` method to process book returns. The Loan model records the return date, changes the loan status to Returned and makes the associated physical copy available again. It also prevents an already returned loan from being processed a second time.

**FR07 – Track Due Dates**

The Loan model stores both the issue date and the due date. Its `getOverdueDays()` method calculates the number of overdue days using a reference date for active loans or the actual return date for completed loans.

**FR08 – Identify Overdue Books**

The ReportService provides the `generateOverdueReport()` method. It identifies active loans whose due dates have passed and returns the number of overdue loans and their identifiers. Returned loans are excluded from the current overdue report, even if they were returned late.

All four requirements are implemented and supported by the executed unit and integration tests.

The overdue condition is calculated dynamically from the loan dates rather than represented as an additional loan status.

#### 6.8.3 Analysis of Functional Requirements FR09–FR11

The final three functional requirements were reviewed against the implemented components.

| Requirement | Description                                   | Main Components                                                       | Implementation Status |
| ----------- | --------------------------------------------- | --------------------------------------------------------------------- | --------------------- |
| FR09        | View borrowing history                        | LoanService, LoanRepository                                           | Implemented           |
| FR10        | Manage librarian accounts and system settings | User, Librarian, Administrator, AuthenticationService, UserRepository | Partially implemented |
| FR11        | Generate reports                              | ReportService                                                         | Implemented           |

**FR09 – View Borrowing History**

The LoanService provides methods for retrieving all loans and active loans associated with a specific member. The LoanRepository also provides `findByMemberId()`, which retrieves both active and returned loans for a given member. Therefore, borrowing history can be accessed through the implemented data structures. However, no dedicated user interface has been developed.

**FR10 – Manage Librarian Accounts and System Settings**

The system includes User, Librarian and Administrator models, together with an AuthenticationService responsible for basic authentication and role identification. The UserRepository also provides basic user data management operations.

However, a complete administrative interface, integrated staff account management and system configuration module have not been implemented. Therefore, this requirement is considered partially implemented.

**FR11 – Generate Reports**

The ReportService provides four reporting operations: book statistics, copy availability, loan statistics and overdue loan identification. The reports are returned as structured in-memory data objects. No graphical dashboard or PDF/Excel export functionality has been implemented.

This requirement is considered implemented at the business logic level.

### Overall Functional Requirements Assessment

The traceability review shows that eight out of eleven functional requirements are fully implemented at the business logic level, while three are partially implemented.

The partially implemented requirements are FR01, FR03 and FR10. Their remaining limitations mainly concern the integration of repository operations into services and the absence of complete administrative management features.

This assessment reflects the actual scope of the TypeScript implementation and does not claim that the complete production system has been developed.

### 6.9 Final System Validation and Technical Limitations

#### 6.9.1 Final Technical Validation

The Library Management System implementation was reviewed through TypeScript compilation, unit testing, repository testing and integration testing.

The following components were implemented and examined:

- Domain models: Book, BookCopy, User, Member, Librarian, Administrator and Loan.
- Business services: AuthenticationService, BookService, MemberService, LoanService and ReportService.
- Data access components: BookRepository, MemberRepository, LoanRepository and UserRepository.

The TypeScript compiler completed successfully without reporting errors.

The seven main test suites produced the following results:

| Test Suite            | Passed Tests |
| --------------------- | -----------: |
| LoanService           |        17/17 |
| BookService           |        17/17 |
| MemberService         |        19/19 |
| AuthenticationService |        18/18 |
| ReportService         |        11/11 |
| Repositories          |        35/35 |
| Integration Tests     |        10/10 |
| **Total**             |  **127/127** |

An additional eleven business rule tests were successfully executed in the initial implementation stage.

These results demonstrate that the tested operations behave as expected. However, they do not constitute exhaustive verification of every possible system scenario.

#### 6.9.2 Architecture Consistency Validation

The implementation follows the conceptual three-layer architecture defined during the system design phase.

The Business Logic Layer is represented by five TypeScript services responsible for authentication, book management, member management, loan processing and reporting.

The Data Access Layer is represented by four repository classes. These repositories implement basic in-memory data operations and were tested independently.

However, the repositories are not yet integrated with the application services. The services maintain their own in-memory collections.

The Presentation Layer remains conceptual and has not been implemented as a graphical user interface.

Therefore, the project represents a partial technical implementation of the proposed architecture rather than a complete three-layer application.

#### 6.9.3 Technical Limitations

Despite the successful implementation and testing of the main business operations, several limitations remain.

**Data Persistence:** All application data is stored in in-memory arrays. Consequently, information is not preserved after the application terminates.

**Database Integration:** No relational database has been connected to the system. The repository classes currently provide simplified in-memory data access.

**Repository Integration:** The repository classes operate independently from the business services. A future version should integrate them to establish a clearer separation between business logic and data access.

**Presentation Layer:** No graphical user interface has been developed. The current implementation is primarily demonstrated through TypeScript code and automated tests.

**Authentication and Security:** The system provides a basic authentication structure and a PasswordVerifier abstraction. However, the test implementation uses direct string comparison rather than a secure password-hashing mechanism. Production-level authentication, session management and authorization policies remain outside the current scope.

**Reporting:** The ReportService generates structured statistical data, but graphical dashboards and PDF or spreadsheet exports have not been implemented.

#### 6.9.4 Future Improvements

Several improvements could extend the current implementation into a complete application:

1. Integrating a relational database such as SQLite, MySQL or PostgreSQL.
2. Connecting the repositories to the business services.
3. Developing dedicated interfaces for members, librarians and administrators.
4. Implementing secure password hashing and session management.
5. Introducing role-based access control.
6. Extending reporting capabilities with dashboards and document exports.
7. Adding further tests for database operations, security and exceptional scenarios.

These improvements would increase the system's reliability, maintainability, security and usability.

#### 6.9.5 Validation Conclusion

The final validation confirms that the project successfully demonstrates the essential domain models, business rules, service responsibilities and basic data access abstractions of a Library Management System.

Although the implementation does not represent a complete production application, it provides a practical demonstration of how object-oriented analysis, UML modeling and layered architecture concepts can be translated into TypeScript components.

The project therefore achieves its primary academic objective: designing and technically demonstrating a simplified Library Management System while identifying the limitations and future development opportunities of the proposed solution.

# General Conclusion

This project focused on the analysis, design and partial technical implementation of a simplified Library Management System using Object-Oriented Analysis and Design principles.

The work began with the identification of the system's functional and non-functional requirements, followed by the definition of a three-layer architecture consisting of the Presentation Layer, Business Logic Layer and Data Access Layer.

The system was then modeled using UML diagrams, including use case, class, sequence and state diagrams. These models helped identify the main system actors, domain entities, relationships, business rules and interactions involved in library operations.

During the implementation phase, TypeScript and object-oriented programming concepts were used to translate the conceptual models into software components. The implementation included domain models, business services, repository abstractions and an authentication structure.

Particular attention was given to the borrowing and returning processes. The system demonstrates important business rules, such as validating member status, checking copy availability, enforcing the maximum number of active loans, recording returns and identifying overdue loans.

The implementation was evaluated through TypeScript compilation, unit tests, repository tests and integration tests. All 127 tests across the seven main test suites passed successfully, in addition to eleven business rule tests executed during the initial implementation stage.

The project also identified several technical limitations. The current implementation uses in-memory collections instead of a persistent database. The repository classes are not yet integrated with the business services, and the Presentation Layer remains conceptual. Production-level authentication, complete authorization mechanisms and graphical reporting interfaces are also outside the current implementation scope.

Despite these limitations, the project achieved its main academic objective: demonstrating how software requirements, object-oriented analysis, UML modeling and layered architecture can be translated into a practical TypeScript implementation.

This work provided an opportunity to apply software engineering concepts throughout the development process, from requirements analysis to implementation and validation.

In conclusion, the proposed Library Management System represents a functional academic prototype that demonstrates the essential business logic of a library application and provides a solid foundation for future development, including database integration, user interface implementation, enhanced security and more advanced reporting capabilities.
