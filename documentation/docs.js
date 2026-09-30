// ============================================================
// docs.js — Deep-dive ενότητες για πλήρη κατανόηση του project
// Δομή: κάθε entry έχει {id, title, icon, subtitle, blocks[]}
// ============================================================

const DEEPDIVES = [

  // ==========================================================
  // 1. DATABASE DEEP DIVE
  // ==========================================================
  {
    id: 'db-deepdive',
    title: 'Database Schema — Deep Dive',
    icon: '🗄️',
    subtitle: 'Πίνακες, στήλες, constraints και indexes με πλήρη αιτιολόγηση',
    type: 'backend',
    intro: 'Η βάση δεδομένων έχει 9 πίνακες. Κάθε constraint και index έχει συγκεκριμένο λόγο ύπαρξης — δεν είναι τυχαία. Αυτή η ενότητα εξηγεί πίνακα-πίνακα γιατί πήραμε κάθε απόφαση.',
    blocks: [
      {
        type: 'table',
        title: 'Πίνακας User — core_user',
        headers: ['Στήλη', 'Τύπος', 'Constraint', 'Γιατί'],
        rows: [
          ['id', 'BigAutoField', 'PK', 'Default Django primary key'],
          ['username', 'CharField(150)', 'unique', 'Login identifier'],
          ['password', 'CharField(128)', '—', 'Hashed με PBKDF2 (Django default)'],
          ['email', 'EmailField', 'UniqueConstraint(Lower(email))', 'Case-insensitive: "A@b.com" = "a@b.com"'],
          ['first_name', 'CharField(150)', '—', 'Απαίτηση 2 — όνομα'],
          ['last_name', 'CharField(150)', '—', 'Απαίτηση 2 — επώνυμο'],
          ['afm', 'CharField(9)', 'unique + RegexValidator(\\d{9})', 'ΑΦΜ — απαίτηση 2'],
          ['phone', 'CharField(30)', '—', 'Τηλέφωνο — απαίτηση 2'],
          ['address', 'CharField(255)', '—', 'Διεύθυνση — απαίτηση 2'],
          ['city', 'CharField(100)', '—', 'Πόλη — απαίτηση 2'],
          ['country', 'CharField(100)', '—', 'Χώρα — απαίτηση 2'],
          ['latitude', 'DecimalField(9,6)', 'CheckConstraint(pair)', 'Γεωγραφική θέση — απαίτηση 2'],
          ['longitude', 'DecimalField(9,6)', 'CheckConstraint(pair)', 'Γεωγραφική θέση — απαίτηση 2'],
          ['approval_status', 'CharField(20)', 'db_index, choices', 'PENDING/APPROVED/REJECTED — απαίτηση 4'],
          ['is_staff', 'BooleanField', '—', 'Admin flag'],
          ['is_superuser', 'BooleanField', '—', 'Superuser flag'],
          ['date_joined', 'DateTimeField', 'auto_now_add', 'Registration timestamp'],
          ['last_login', 'DateTimeField', 'null=True', 'Django default — ενημερώνεται στο login']
        ]
      },
      {
        type: 'text',
        title: 'Γιατί ξεχωριστός πίνακας για User;',
        body: 'Το Django επιτρέπει custom User model μέσω AUTH_USER_MODEL. Το χρησιμοποιούμε γιατί η εκφώνηση απαιτεί ρόλους (4), ΑΦΜ, τηλέφωνο, τοποθεσία, approval workflow — πεδία που ΔΕΝ υπάρχουν στο built-in auth.User. Αν χρησιμοποιούσαμε το built-in, θα έπρεπε να φτιάξουμε ξεχωριστό Profile model με OneToOne — πιο πολύπλοκο.'
      },
      {
        type: 'text',
        title: '⚠️ Το AUTH_USER_MODEL πρέπει να οριστεί ΠΡΙΝ την 1η migration',
        body: 'Αν το αλλάξεις μετά, το Django σπάει — τα FKs από όλα τα άλλα models δείχνουν σε auth.User και θα πρέπει να ξαναφτιαχτεί ολόκληρη η βάση. Γι\' αυτό το ορίζουμε στο settings.py από την αρχή.'
      },
      {
        type: 'table',
        title: 'Πίνακας Event — core_event',
        headers: ['Στήλη', 'Τύπος', 'Constraint', 'Γιατί'],
        rows: [
          ['id', 'BigAutoField', 'PK', 'Εσωτερικό ID'],
          ['event_id', 'CharField(20)', 'unique', 'EV0001-style ID για DTD'],
          ['organizer', 'ForeignKey(User)', 'on_delete=PROTECT', 'PROTECT: δεν χάνονται events αν διαγραφεί user'],
          ['title', 'CharField(200)', '—', 'Τίτλος — DTD Title'],
          ['description', 'TextField', 'blank=True', 'Περιγραφή — DTD Description'],
          ['event_type', 'CharField(50)', 'choices: CONCERT/SEMINAR/...', 'DTD EventType'],
          ['venue/address/city/country', 'CharField', '—', 'DTD Venue/Address/City/Country'],
          ['latitude/longitude', 'DecimalField(9,6)', 'CheckConstraint(pair)', 'DTD GeoLocation'],
          ['start_datetime', 'DateTimeField', '—', 'DTD StartDateTime'],
          ['end_datetime', 'DateTimeField', 'CheckConstraint(end>start)', 'DTD EndDateTime'],
          ['capacity', 'PositiveIntegerField', 'MinValueValidator(1)', 'DTD Capacity'],
          ['status', 'CharField(20)', 'choices, default=DRAFT', 'DTD Status'],
          ['categories', 'ManyToMany(Category)', '—', 'DTD Category+'],
          ['created_at/updated_at', 'DateTimeField', 'auto', 'Audit trail']
        ]
      },
      {
        type: 'list',
        title: 'Indexes στο Event — πότε και γιατί',
        items: [
          'Index(status, start_datetime): η πιο συχνή query — "φέρε μου τα PUBLISHED events που ξεκινούν μετά από τώρα". Ο composite index επιταχύνει το WHERE + ORDER BY.',
          'Index(city, start_datetime): όταν φιλτράρεις κατά πόλη (αναζήτηση).',
          'Ordering = ["-start_datetime"]: default sort. Το αρνητικό = descending.'
        ]
      },
      {
        type: 'table',
        title: 'Πίνακας TicketType — core_tickettype',
        headers: ['Στήλη', 'Τύπος', 'Constraint', 'Γιατί'],
        rows: [
          ['event', 'ForeignKey(Event)', 'on_delete=CASCADE', 'CASCADE: αν διαγραφεί event, διαγράφονται και τα tickets του'],
          ['ticket_type_id', 'CharField(20)', 'UniqueConstraint(event, ticket_type_id)', 'T1, T2 ανά event — όχι globally unique'],
          ['name', 'CharField(100)', 'UniqueConstraint(Lower(name), event)', 'Case-insensitive: "VIP" ≠ "vip" στο ίδιο event'],
          ['price', 'DecimalField(10,2)', 'MinValueValidator(0)', 'Τιμή — DTD Price'],
          ['quantity', 'PositiveIntegerField', 'MinValueValidator(1)', 'Σύνολο — DTD Quantity'],
          ['reserved', 'PositiveIntegerField', 'CheckConstraint(reserved ≤ quantity)', 'Δεσμευμένα — δεν μπορεί να ξεπεράσει το quantity']
        ]
      },
      {
        type: 'text',
        title: '⚠️ Σημαντικό: Το reserved υπολογίζεται αυτόματα',
        body: 'Το frontend ΔΕΝ στέλνει ποτέ reserved. Δημιουργείται 0 και αυξάνεται ΜΟΝΟ από το reserve_tickets() service μέσα σε transaction.atomic + select_for_update. Αυτό είναι το κλειδί για την ακεραιότητα σε race conditions.'
      },
      {
        type: 'table',
        title: 'Πίνακας Booking — core_booking',
        headers: ['Στήλη', 'Τύπος', 'Constraint', 'Γιατί'],
        rows: [
          ['booking_id', 'CharField(20)', 'unique', 'BK0501-style ID'],
          ['event', 'ForeignKey(Event)', 'on_delete=PROTECT', 'PROTECT: διατηρείται για ιστορικότητα'],
          ['attendee', 'ForeignKey(User)', 'on_delete=PROTECT', 'PROTECT: δεν χάνονται κρατήσεις'],
          ['ticket_type', 'ForeignKey(TicketType)', 'on_delete=PROTECT', 'PROTECT: δεν χάνεται η αναφορά'],
          ['number_of_tickets', 'PositiveIntegerField', 'MinValueValidator(1)', 'Τουλάχιστον 1'],
          ['total_cost', 'DecimalField(10,2)', '—', 'Snapshot της τιμής τη στιγμή της κράτησης'],
          ['status', 'CharField(20)', 'choices, default=PENDING', 'PENDING/CONFIRMED/CANCELLED'],
          ['created_at', 'DateTimeField', 'auto_now_add', 'DTD Time']
        ]
      },
      {
        type: 'list',
        title: 'Γιατί total_cost αποθηκεύεται (denormalization)',
        items: [
          'Αν αλλάξει η τιμή του ticket type αργότερα, η κράτηση πρέπει να κρατήσει την ΠΑΛΙΑ τιμή — αυτό είναι legal/accounting requirement.',
          'Χωρίς snapshot, αν αυξηθεί η τιμή, όλες οι παλιές κρατήσεις θα "κοστίζουν" τη νέα τιμή.',
          'Index(attendee, -created_at): για το "οι κρατήσεις μου" με sort.',
          'Index(event, status): για το "κρατήσεις αυτού του event ανά status".'
        ]
      },
      {
        type: 'table',
        title: 'Conversation + Message (soft delete)',
        headers: ['Στήλη', 'Constraint', 'Γιατί'],
        rows: [
          ['Conversation(event, attendee)', 'UniqueConstraint', 'Μία συνομιλία ανά ζεύγος/event'],
          ['deleted_by_organizer', 'BooleanField', 'Soft delete — μόνο αυτός δεν τη βλέπει'],
          ['deleted_by_attendee', 'BooleanField', 'Soft delete — μόνο αυτός δεν τη βλέπει'],
          ['Message(conversation)', 'on_delete=CASCADE', 'Αν διαγραφεί conversation, διαγράφονται και messages'],
          ['deleted_by_sender/receiver', 'BooleanField', 'Ίδιο soft delete pattern']
        ]
      },
      {
        type: 'text',
        title: '⚠️ Hard delete μόνο όταν ΚΑΙ οι δύο διαγράψουν',
        body: 'Η λογική: όταν ο user A διαγράψει, θέτει deleted_by_organizer=True. Η συνομιλία παραμένει στη βάση για τον user B. Όταν ΚΑΙ ο B διαγράψει, τότε η συνομιλία διαγράφεται hard (delete()). Έτσι διατηρείται η δυνατότητα "να ξαναρχίσει" η συνομιλία αν κάποιος στείλει νέο μήνυμα.'
      },
      {
        type: 'table',
        title: 'EventView — για recommendations',
        headers: ['Στήλη', 'Constraint', 'Γιατί'],
        rows: [
          ['user', 'ForeignKey', 'Ποιος είδε'],
          ['event', 'ForeignKey', 'Τι είδε'],
          ['view_count', 'PositiveIntegerField(default=1)', 'Πόσες φορές'],
          ['UniqueConstraint(user, event)', '—', 'Μία εγγραφή ανά ζεύγος'],
          ['Index(user, -last_viewed_at)', '—', 'Για γρήγορο fetch των πρόσφατων προβολών']
        ]
      },
      {
        type: 'list',
        title: 'Πώς τροφοδοτεί τον recommender',
        items: [
          'Κάθε EventView γίνεται rating: min(3.0, 1.5 + 0.5 × view_count).',
          '1 view → 2.0, 2 views → 2.5, 3+ views → 3.0.',
          'Αν υπάρχει ΚΑΙ booking, το booking κερδίζει (5.0 > 3.0).',
          'Το view_count αυξάνεται με cooldown 30s — αποτρέπει spam F5 να "φουσκώσει" το rating.'
        ]
      }
    ]
  },

  // ==========================================================
  // 2. API ENDPOINTS DEEP DIVE
  // ==========================================================
  {
    id: 'api-deepdive',
    title: 'REST API — Deep Dive',
    icon: '🌐',
    subtitle: 'Κάθε endpoint με request, response, permissions, errors',
    type: 'backend',
    intro: 'Όλα τα endpoints κάτω από /api/. Η αρχιτεκτονική είναι resource-oriented: κάθε οντότητα έχει URL, η ενέργεια καθορίζεται από HTTP method. Εδώ αναλύονται όλα τα endpoints ανά resource.',
    blocks: [
      {
        type: 'text',
        title: '🔐 Authentication endpoints',
        body: 'Τα endpoints ταυτοποίησης δεν ακολουθούν το resource pattern — είναι συγκεκριμένες ενέργειες.'
      },
      {
        type: 'endpoint',
        method: 'POST',
        url: '/api/auth/register/',
        auth: 'AllowAny',
        request: '{ username, password, password2, email, first_name, last_name, phone, address, city, country, afm, latitude?, longitude? }',
        response: '{ id, username, email, ..., approval_status: "PENDING" }',
        errors: '400 αν email υπάρχει, password δεν περνά validation, ή lat/lon δεν είναι pair',
        why: 'Δημιουργεί user σε PENDING. Δεν επιστρέφει tokens — ο χρήστης πρέπει να εγκριθεί από admin πρώτα.'
      },
      {
        type: 'endpoint',
        method: 'POST',
        url: '/api/auth/login/',
        auth: 'AllowAny',
        request: '{ username, password }',
        response: '{ access: "eyJ...", refresh: "eyJ..." }',
        errors: '401 αν invalid credentials, 400 αν PENDING/REJECTED',
        why: 'Επιστρέφει JWT. Ελέγχει approval_status — αν δεν είναι APPROVED, δεν δίνει tokens.'
      },
      {
        type: 'endpoint',
        method: 'POST',
        url: '/api/auth/refresh/',
        auth: 'AllowAny',
        request: '{ refresh: "eyJ..." }',
        response: '{ access: "eyJ..." }',
        errors: '401 αν refresh έληξε, 400 αν user δεν είναι πλέον approved',
        why: 'Ξανά-ελέγχει approval_status — αν ο admin απέρριψε τον χρήστη στο μεταξύ, δεν δίνει νέο access.'
      },
      {
        type: 'endpoint',
        method: 'GET / PATCH',
        url: '/api/auth/me/',
        auth: 'IsApprovedUser',
        request: 'PATCH: { first_name?, last_name?, phone?, address?, city?, latitude?, longitude?, new_password?, current_password? }',
        response: '{ id, username, email, ..., approval_status, date_joined, last_login }',
        errors: '400 αν current_password λάθος, ή lat/lon δεν είναι pair',
        why: 'Το προφίλ του τρέχοντος χρήστη. Username/email/afm είναι read-only.'
      },
      {
        type: 'text',
        title: '📅 Events endpoints',
        body: 'Το πιο σύνθετο resource — έχει CRUD + actions (publish, cancel, photos, recommendations).'
      },
      {
        type: 'endpoint',
        method: 'GET',
        url: '/api/events/',
        auth: 'AllowAny (list μόνο PUBLISHED για anon)',
        params: 'category, organizer, status, event_type, city, country, start_after, start_before, min_price, max_price, search, ordering, page',
        response: '{ count, next, previous, results: [{ id, event_id, title, ..., min_price, cover_photo, available_capacity }] }',
        why: 'Λίστα με server-side filtering + pagination 30/page. Anonymous βλέπουν μόνο PUBLISHED.'
      },
      {
        type: 'endpoint',
        method: 'POST',
        url: '/api/events/',
        auth: 'IsApprovedUser + IsOrganizer',
        request: '{ title, description, event_type, venue, address, city, country, latitude, longitude, start_datetime, end_datetime, capacity, categories: [ids] }',
        response: '201 Created με το event object',
        errors: '400 αν lat/lon δεν είναι pair, end ≤ start, start στο παρελθόν',
        why: 'Δημιουργεί event σε DRAFT. Status/event_id είναι read-only (από server).'
      },
      {
        type: 'endpoint',
        method: 'GET',
        url: '/api/events/{id}/',
        auth: 'AllowAny',
        response: 'Event detail με nested organizer, ticket_types, photos, categories',
        why: 'Το retrieve αυξάνει view_count μέσω EventView (cooldown 30s).'
      },
      {
        type: 'endpoint',
        method: 'PATCH',
        url: '/api/events/{id}/',
        auth: 'IsApprovedUser + IsEventOwnerOrReadOnly',
        request: 'Μερικό update — μόνο τα πεδία που στέλνονται',
        errors: '403 αν δεν είσαι owner, 400 αν event COMPLETED/CANCELLED ή ξεκίνησε',
        why: 'Ο organizer μπορεί να αλλάξει μόνο τα ΔΙΚΑ ΤΟΥ events. Το capacity δεν μπορεί να μειωθεί κάτω από sum(ticket quantities).'
      },
      {
        type: 'endpoint',
        method: 'DELETE',
        url: '/api/events/{id}/',
        auth: 'IsApprovedUser + IsEventOwnerOrReadOnly',
        errors: '400 αν έχει non-PENDING bookings — "Use cancel instead"',
        why: 'Διαγραφή μόνο αν DRAFT ή χωρίς bookings. Διαφορετικά → cancel.'
      },
      {
        type: 'endpoint',
        method: 'POST',
        url: '/api/events/{id}/publish/',
        auth: 'IsApprovedUser + IsEventOwnerOrReadOnly',
        errors: '400 αν δεν είναι DRAFT, δεν έχει ticket types, ή ξεκίνησε',
        why: 'DRAFT → PUBLISHED. Ελέγχει ότι total_tickets > 0 και ≤ capacity.'
      },
      {
        type: 'endpoint',
        method: 'POST',
        url: '/api/events/{id}/cancel/',
        auth: 'IsApprovedUser + IsEventOwnerOrReadOnly',
        errors: '400 αν δεν είναι PUBLISHED',
        why: 'PUBLISHED → CANCELLED. Στέλνει ΑΥΤΟΜΑΤΑ μήνυμα σε όλους τους attendees (απαίτηση 10).'
      },
      {
        type: 'endpoint',
        method: 'POST',
        url: '/api/events/{id}/photos/',
        auth: 'IsApprovedUser + IsEventOwnerOrReadOnly',
        request: 'multipart/form-data: { image: <file>, caption?, order? }',
        errors: '400 αν > 10MB, μη JPEG/PNG/WEBP, ή > 20 photos',
        why: 'Ξεχωριστό endpoint γιατί η δημιουργία event δεν είναι multipart.'
      },
      {
        type: 'endpoint',
        method: 'GET',
        url: '/api/events/recommendations/',
        auth: 'IsApprovedUser',
        response: '{ count, results: [top-K events ταξινομημένα κατά -predict] }',
        why: 'Custom action που καλεί rank_event_ids. Κάθε σελίδα paginate 30 από τα ranked.'
      },
      {
        type: 'text',
        title: '🎫 Ticket Types endpoints',
        body: 'Ticket types είναι sub-resource των events — δεν έχουν νόημα χωρίς event.'
      },
      {
        type: 'endpoint',
        method: 'POST',
        url: '/api/ticket-types/',
        auth: 'IsApprovedUser + IsTicketTypeEventOwnerOrReadOnly',
        request: '{ event: <id>, name, price, quantity }',
        errors: '400 αν sum(quantities) > event.capacity ή duplicate name',
        why: 'Δημιουργεί ένα ticket type. Ο ticket_type_id (T1, T2...) παράγεται αυτόματα από generate_id.'
      },
      {
        type: 'endpoint',
        method: 'POST',
        url: '/api/ticket-types/bulk/',
        auth: 'IsApprovedUser + IsTicketTypeEventOwnerOrReadOnly',
        request: '{ event_id, ticket_types: [{name, price, quantity}, ...] }',
        response: '{ created: [...], errors: [], total, failed }',
        why: 'Bulk create με all-or-nothing transaction. Χρησιμοποιείται στο CreateEvent.'
      },
      {
        type: 'endpoint',
        method: 'PATCH',
        url: '/api/ticket-types/{id}/',
        errors: '400 αν νέο quantity < reserved, ή sum > capacity',
        why: 'Δεν μπορείς να μειώσεις κάτω από τα ήδη-κρατημένα. Ο organizer μπορεί να αλλάξει name/price/quantity.'
      },
      {
        type: 'endpoint',
        method: 'DELETE',
        url: '/api/ticket-types/{id}/',
        errors: '400 αν έχει CONFIRMED bookings, ή είναι το τελευταίο σε PUBLISHED event',
        why: 'Διαγραφή μόνο αν δεν υπάρχει κράτηση. Διαγράφει πρώτα τα PENDING bookings.'
      },
      {
        type: 'text',
        title: '💰 Bookings endpoints',
        body: 'Δύο φάσεις: create (PENDING) + confirm (CONFIRMED). Update/delete απαγορεύονται.'
      },
      {
        type: 'endpoint',
        method: 'POST',
        url: '/api/bookings/',
        auth: 'IsAuthenticated + IsParticipant',
        request: '{ event, ticket_type, number_of_tickets }',
        response: '201 με booking (status: PENDING)',
        errors: '400 αν ticket_type δεν ανήκει, event inactive, insufficient availability',
        why: 'ΔΕΝ δεσμεύει ακόμα εισιτήρια — PENDING. Ο organizer δεν μπορεί να κάνει κράτηση στο δικό του event.'
      },
      {
        type: 'endpoint',
        method: 'POST',
        url: '/api/bookings/{id}/confirm/',
        auth: 'IsBookingOwner',
        response: 'Booking με status: CONFIRMED',
        errors: '400 αν δεν είναι PENDING, 409 αν sold out',
        why: 'Δεσμεύει τα εισιτήρια (reserve_tickets) + αλλάζει status. Εδώ γίνεται το select_for_update.'
      },
      {
        type: 'endpoint',
        method: 'GET',
        url: '/api/bookings/me/',
        auth: 'IsAuthenticated',
        response: 'Paginated list των κρατήσεων του τρέχοντος χρήστη',
        why: 'Custom action — φιλτράρει αυτόματα στο request.user.'
      },
      {
        type: 'endpoint',
        method: 'PATCH/PUT/DELETE',
        url: '/api/bookings/{id}/',
        response: '405 Method Not Allowed',
        why: 'Οι κρατήσεις δεν τροποποιούνται μετά την υποβολή (απαίτηση 9). Ακυρώνονται μόνο αν ακυρωθεί το event.'
      },
      {
        type: 'text',
        title: '💬 Messages endpoints',
        body: 'Οργανώνονται σε conversations. Soft delete για κάθε πλευρά.'
      },
      {
        type: 'endpoint',
        method: 'POST',
        url: '/api/conversations/',
        auth: 'IsApprovedUser',
        request: '{ event, attendee? }',
        errors: '400 αν δεν έχεις booking ή δεν είσαι organizer',
        why: 'Δημιουργεί conversation. Αν υπάρχει ήδη, την επαναφέρει (καθαρίζει τα delete flags).'
      },
      {
        type: 'endpoint',
        method: 'POST',
        url: '/api/messages/',
        auth: 'IsApprovedUser',
        request: '{ conversation, body }',
        why: 'Στέλνει μήνυμα. Ο receiver προκύπτει από το conversation.'
      },
      {
        type: 'endpoint',
        method: 'GET',
        url: '/api/messages/inbox/',
        response: 'Paginated list εισερχόμενων (receiver=me, not deleted)',
        why: 'Custom action — φιλτράρει και δεν επιστρέφει soft-deleted.'
      },
      {
        type: 'endpoint',
        method: 'GET',
        url: '/api/messages/unread_summary/',
        response: '{ has_unread: bool, count: int }',
        why: 'Ελαφρύ endpoint για polling του Navbar κάθε 20s — δεν επιστρέφει τα μηνύματα.'
      },
      {
        type: 'text',
        title: '🛡️ Admin endpoints',
        body: 'Προσβάσιμα μόνο σε is_staff=True.'
      },
      {
        type: 'endpoint',
        method: 'GET',
        url: '/api/admin/users/',
        auth: 'IsAdmin',
        params: 'approval_status, page',
        response: 'Paginated list όλων των χρηστών',
        why: 'ReadOnly ViewSet — ο admin δεν μπορεί να δημιουργήσει/αλλάξει χρήστες, μόνο να εγκρίνει/απορρίψει.'
      },
      {
        type: 'endpoint',
        method: 'POST',
        url: '/api/admin/users/{id}/approve/',
        auth: 'IsAdmin',
        response: 'User με approval_status: APPROVED',
        why: 'Custom action. Δεν είναι idempotent check — μπορεί να ξανα-εγκρίνει (δεν πειράζει).'
      },
      {
        type: 'endpoint',
        method: 'GET',
        url: '/api/admin/events/export/xml/',
        auth: 'IsAdmin',
        params: 'organizer (id), event (id)',
        response: 'XML με DTD header + όλα τα events',
        why: 'Το filename και το Content-Type εξαρτώνται από το format. Αν έχει organizer/event param, φιλτράρει.'
      }
    ]
  },

  // ==========================================================
  // 3. AUTH FLOW DEEP DIVE
  // ==========================================================
  {
    id: 'auth-deepdive',
    title: 'Authentication Flow — Deep Dive',
    icon: '🔐',
    subtitle: 'JWT lifecycle, refresh, interceptor, security',
    type: 'frontend',
    intro: 'Η ταυτοποίηση χρησιμοποιεί JWT. Η διαχείριση γίνεται εξ ολοκλήρου στο frontend μέσω Axios interceptors. Αυτή η ενότητα εξηγεί το πλήρες ταξίδι ενός token.',
    blocks: [
      {
        type: 'flow',
        title: '🔑 Login Flow — 7 βήματα',
        steps: [
          { n: 1, text: 'Ο χρήστης συμπληρώνει username/password στο SignIn.' },
          { n: 2, text: 'Το SignIn καλεί authService.login() → POST /api/auth/login/.' },
          { n: 3, text: 'Το backend επικυρώνει credentials + ελέγχει approval_status.' },
          { n: 4, text: 'Αν OK, επιστρέφει {access, refresh}. Το frontend τα αποθηκεύει σε sessionStorage.' },
          { n: 5, text: 'Αμέσως μετά: GET /api/auth/me/ για να πάρει το πλήρες user object.' },
          { n: 6, text: 'Το AuthContext ενημερώνεται: user=<object>, isAuthenticated=true.' },
          { n: 7, text: 'Navigate: admin → /profile?tab=users, user → /homepage.' }
        ]
      },
      {
        type: 'flow',
        title: '🔄 Request Flow — πώς ταξιδεύει κάθε request',
        steps: [
          { n: 1, text: 'Ένα component καλεί π.χ. eventService.getEvents().' },
          { n: 2, text: 'Το eventService καλεί api.get("/events/", {params}).' },
          { n: 3, text: 'Το Axios request interceptor προσθέτει Authorization: Bearer <access>.' },
          { n: 4, text: 'Ο server επικυρώνει το JWT.' },
          { n: 5, text: 'Αν 200, το response επιστρέφει στο component.' },
          { n: 6, text: 'Αν 401 (token έληξε), ο response interceptor πιάνει το error.' }
        ]
      },
      {
        type: 'flow',
        title: '♻️ Auto-Refresh Flow (single-flight)',
        steps: [
          { n: 1, text: 'Το 401 φτάνει στον response interceptor.' },
          { n: 2, text: 'Ελέγχει: status=401, έχει refresh_token, δεν έχει ξαναπροσπαθήσει (original._retried).' },
          { n: 3, text: 'Θέτει original._retried = true για να μην μπει σε loop.' },
          { n: 4, text: 'Αν ΔΕΝ υπάρχει ήδη refresh in-flight, ξεκινάει ένα: axios.post("/auth/refresh/", {refresh}).' },
          { n: 5, text: 'Άλλα requests που παίρνουν 401 ΤΗΝ ΙΔΙΑ ΣΤΙΓΜΗ περιμένουν το ΙΔΙΟ promise (refreshing).' },
          { n: 6, text: 'Όταν έρθει το νέο access, αποθηκεύεται σε sessionStorage.' },
          { n: 7, text: 'Το original request ξανα-εκτελείται με το νέο token.' },
          { n: 8, text: 'Αν το refresh αποτύχει, καθαρίζονται tokens + dispatch "auth-expired".' }
        ]
      },
      {
        type: 'code',
        title: 'Single-flight refresh — ο κώδικας',
        code: `refreshing = refreshing || axios
  .post(\`\${API_BASE}/auth/refresh/\`, { refresh })
  .then((r) => r.data.access)
  .finally(() => { refreshing = null; });

const access = await refreshing;`
      },
      {
        type: 'text',
        title: '⚠️ Γιατί single-flight;',
        body: 'Αν 5 components κάνουν API calls ταυτόχρονα και το token λήγει, χωρίς single-flight θα έτρεχαν 5 refresh requests. Ο server θα δεχόταν 5 POST /refresh/ με το ίδιο refresh token. Το single-flight εξασφαλίζει ότι γίνεται ΜΟΝΟ ένα refresh και όλα τα αιτήματα περιμένουν το ίδιο promise.'
      },
      {
        type: 'list',
        title: '🔒 Γιατί sessionStorage και όχι localStorage;',
        items: [
          'sessionStorage: καθαρίζεται όταν κλείσει το tab.',
          'localStorage: επιμένει μετά το κλείσιμο — ευάλωτο σε persistent XSS.',
          'Trade-off: ο χρήστης πρέπει να ξανακάνει login μετά από κάθε κλείσιμο tab.',
          'Για εφαρμογή με ευαίσθητα δεδομένα (κρατήσεις, πληρωμές) το sessionStorage είναι πιο ασφαλές.'
        ]
      },
      {
        type: 'list',
        title: '⏱️ Γιατί access=10min, refresh=1day;',
        items: [
          'Access 10min: αν κλαπεί, ο επιτιθέμενος έχει μόνο 10 λεπτά παράθυρο.',
          'Refresh 1 μέρα: ο χρήστης δεν χρειάζεται να ξανακάνει login κάθε 10 λεπτά.',
          'Το refresh token είναι πιο ευαίσθητο — αποθηκεύεται και αυτό σε sessionStorage.',
          'Ο server δεν χρειάζεται session state — κάθε request αυτοτελές.'
        ]
      },
      {
        type: 'list',
        title: '🛡️ Approval check σε 2 σημεία',
        items: [
          'Στο login: CustomTokenObtainPairSerializer.validate() ελέγχει PENDING/REJECTED και πετάει error.',
          'Στο refresh: CustomTokenRefreshSerializer.validate() ελέγχει ξανά — αν ο admin απέρριψε τον χρήστη στο μεταξύ, δεν του δίνει νέο access.',
          'Γιατί; Επειδή το refresh token ζει 1 μέρα. Χωρίς αυτόν τον έλεγχο, ένας rejected user θα είχε πρόσβαση για 24h μετά την απόρριψη.'
        ]
      },
      {
        type: 'text',
        title: '🚨 Custom event "auth-expired"',
        body: 'Όταν το refresh αποτύχει, το client.js κάνει window.dispatchEvent(new Event("auth-expired")). Το AuthContext ακούει αυτό το event (useEffect) και καθαρίζει το state (setUser(null), setIsAuthenticated(false)). Έτσι το UI ενημερώνεται αυτόματα — το Navbar δείχνει "Sign In" και τα protected routes γίνονται redirect.'
      }
    ]
  },

  // ==========================================================
  // 4. RACE CONDITIONS DEEP DIVE
  // ==========================================================
  {
    id: 'race-deepdive',
    title: 'Race Conditions — Deep Dive',
    icon: '⚡',
    subtitle: 'Πώς αποφεύγεται η υπερπώληση εισιτηρίων',
    type: 'backend',
    intro: 'Το πιο κρίσιμο τεχνικό πρόβλημα του project. Αν δύο χρήστες προσπαθήσουν ταυτόχρονα να κρατήσουν τα τελευταία 2 εισιτήρια, χωρίς προστασία και οι δύο θα περάσουν — και το event θα έχει 3 κρατήσεις για 2 θέσεις.',
    blocks: [
      {
        type: 'text',
        title: '🐛 Το πρόβλημα (χωρίς προστασία)',
        body: 'Χρήστης A: διαβάζει available=2 → OK. Χρήστης B: διαβάζει available=2 (πριν αλλάξει) → OK. Χρήστης A: reserved += 2, available=0. Χρήστης B: reserved += 2, available=-2. ΑΠΟΤΕΛΕΣΜΑ: 4 εισιτήρια πουλήθηκαν για 2 θέσεις. Αυτό λέγεται race condition.'
      },
      {
        type: 'code',
        title: 'Λάθος κώδικας (χωρίς locking)',
        code: `# ❌ ΛΑΘΟΣ — δύο ταυτόχρονες κλήσεις βλέπουν την ίδια τιμή
def reserve_tickets(ticket_type_id, quantity):
    tt = TicketType.objects.get(pk=ticket_type_id)
    if tt.available < quantity:
        raise SoldOutError()
    tt.reserved += quantity
    tt.save()`
      },
      {
        type: 'code',
        title: 'Σωστός κώδικας (με select_for_update)',
        code: `# ✅ ΣΩΣΤΟΣ — κλειδώνει τη γραμμή μέχρι να ολοκληρωθεί το transaction
@transaction.atomic
def reserve_tickets(*, ticket_type_id, quantity):
    tt = TicketType.objects.select_for_update().get(pk=ticket_type_id)
    if tt.available < quantity:
        raise SoldOutError()
    tt.reserved += quantity
    tt.save(update_fields=['reserved'])`
      },
      {
        type: 'list',
        title: '🔍 Τι κάνει το select_for_update()',
        items: [
          'Εκδίδει SQL: SELECT ... FOR UPDATE στη PostgreSQL.',
          'Κλειδώνει τη ΓΡΑΜΜΗ (όχι τον πίνακα) μέχρι το transaction να ολοκληρωθεί.',
          'Ο δεύτερος που θα εκτελέσει select_for_update() στην ίδια γραμμή ΠΕΡΙΜΕΝΕΙ.',
          'Όταν ελευθερωθεί, διαβάζει τις ΕΝΗΜΕΡΩΜΕΝΕΣ τιμές.',
          'Αν το available έγινε 0, πετάει SoldOutError.'
        ]
      },
      {
        type: 'list',
        title: '🛡️ Πού χρησιμοποιείται select_for_update',
        items: [
          'reserve_tickets: κλειδώνει το TicketType πριν αυξήσει το reserved.',
          'confirm_booking: κλειδώνει το Booking πριν αλλάξει status.',
          'create_ticket_type / update_ticket_type: κλειδώνει το Event πριν ελέγξει capacity.',
          'delete_ticket_type: κλειδώνει πριν ελέγξει bookings.',
          'update_event: κλειδώνει το Event πριν ελέγξει capacity.',
          'destroy event: κλειδώνει πριν διαγράψει.'
        ]
      },
      {
        type: 'text',
        title: '🔐 Γιατί @transaction.atomic;',
        body: 'Το select_for_update() ΑΠΑΙΤΕΙ ενεργό transaction. Χωρίς το @transaction.atomic decorator, το lock απελευθερώνεται αμέσως μετά το SELECT — άρα δεν προστατεύει. Το atomic εξασφαλίζει ότι όλες οι πράξεις (SELECT FOR UPDATE + UPDATE) γίνονται σε ένα transaction.'
      },
      {
        type: 'text',
        title: '⚠️ Deadlock prevention',
        body: 'Αν δύο transactions κλειδώνουν δύο πίνακες με αντίστροφη σειρά, μπορεί να προκληθεί deadlock. Γι\' αυτό το reserve_tickets κλειδώνει ΠΑΝΤΑ το TicketType πρώτα (ποτέ το Event μετά το TicketType). Η σειρά είναι συνεπής σε όλα τα services.'
      },
      {
        type: 'list',
        title: '📊 Isolation levels — τι χρησιμοποιεί η PostgreSQL',
        items: [
          'READ COMMITTED (default): μπορείς να δεις μόνο committed data. Το select_for_update αποτρέπει το race.',
          'REPEATABLE READ: ό,τι διαβάσεις στην αρχή του transaction είναι σταθερό μέχρι το τέλος.',
          'SERIALIZABLE: το πιο αυστηρό — τα transactions φαίνονται σα να εκτελούνται σειριακά.',
          'Το Django δεν αλλάζει το isolation level — χρησιμοποιεί το default της βάσης + select_for_update για fine-grained locking.'
        ]
      },
      {
        type: 'flow',
        title: '🔄 Το σωστό flow των 2 χρηστών',
        steps: [
          { n: 1, text: 'Χρήστης A: BEGIN TRANSACTION.' },
          { n: 2, text: 'Χρήστης A: SELECT ... FOR UPDATE → ΚΛΕΙΔΩΜΑ στη γραμμή.' },
          { n: 3, text: 'Χρήστης B: BEGIN TRANSACTION.' },
          { n: 4, text: 'Χρήστης B: SELECT ... FOR UPDATE → ΠΕΡΙΜΕΝΕΙ.' },
          { n: 5, text: 'Χρήστης A: reserved += 2, available=0, COMMIT.' },
          { n: 6, text: 'Χρήστης B: ξεκλειδώνει, διαβάζει available=0 → SoldOutError.' },
          { n: 7, text: 'ΑΠΟΤΕΛΕΣΜΑ: μόνο 2 εισιτήρια πουλήθηκαν. ✅' }
        ]
      }
    ]
  },

  // ==========================================================
  // 5. SECURITY DEEP DIVE
  // ==========================================================
  {
    id: 'security-deepdive',
    title: 'Security — Deep Dive',
    icon: '🔒',
    subtitle: 'TLS, CORS, CSRF, cookies, JWT storage',
    type: 'backend',
    intro: 'Η ασφάλεια είναι multi-layer. Κάθε layer προστατεύει από διαφορετικό attack. Η εκφώνηση απαιτεί TLS/SSL για ΟΛΕΣ τις επικοινωνίες.',
    blocks: [
      {
        type: 'list',
        title: '📋 Τα 6 layers ασφαλείας',
        items: [
          'Layer 1: TLS/SSL — κρυπτογράφηση όλων των καναλιών (browser↔frontend, frontend↔backend).',
          'Layer 2: JWT authentication — κάθε request φέρνει signed token.',
          'Layer 3: Permission classes — role-based + object-level checks.',
          'Layer 4: CORS — μόνο trusted origins.',
          'Layer 5: CSRF — protection για unsafe methods (POST/PUT/DELETE).',
          'Layer 6: Secure cookies — μόνο μέσω HTTPS.'
        ]
      },
      {
        type: 'text',
        title: '🔐 TLS/SSL — Πώς δουλεύει',
        body: 'Το TLS κρυπτογραφεί τη σύνδεση μεταξύ browser και server. Χρησιμοποιεί ασύμμετρη κρυπτογραφία για το handshake (ανταλλαγή κλειδιών) και συμμετρική για τα δεδομένα. Τοπικά χρησιμοποιούμε self-signed πιστοποιητικό (δεν έχουμε public domain). Σε production θα ήταν Let\'s Encrypt.'
      },
      {
        type: 'list',
        title: '🛠️ Πώς στήνεται τοπικά',
        items: [
          'make_certs.sh: openssl req -x509 -newkey rsa:2048 -nodes -days 365 με SAN=DNS:localhost,DNS:127.0.0.1,IP:127.0.0.1.',
          'Backend: runserver_plus --cert-file certs/localhost.pem --key-file certs/localhost-key.pem --threaded.',
          'Frontend: Vite server.https με τα ίδια certs.',
          'Ο browser εμφανίζει warning (self-signed) — πρέπει να γίνει accept στο https://localhost:5173 ΚΑΙ https://localhost:8000/api.'
        ]
      },
      {
        type: 'list',
        title: '⚠️ Γιατί ΚΑΙ στο 8000;',
        items: [
          'Ο browser κάνει preflight requests (OPTIONS) στο API πριν στείλει το πραγματικό request.',
          'Αν δεν έχει accept το cert του API, blockάρει ΣΙΩΠΗΛΑ τα requests.',
          'Δεν εμφανίζεται σαφές error — φαίνεται ότι "δεν δουλεύει" το login/booking.',
          'Γι\' αυτό στο README αναφέρεται ρητά ότι πρέπει να γίνει accept σε 2 URLs.'
        ]
      },
      {
        type: 'list',
        title: '🌐 CORS — Cross-Origin Resource Sharing',
        items: [
          'Το frontend (5173) και backend (8000) είναι διαφορετικά origins.',
          'Ο browser by default μπλοκάρει cross-origin AJAX requests.',
          'Το CORS_ALLOWED_ORIGINS = ["https://localhost:5173"] λέει στο backend ποια origins επιτρέπονται.',
          'Το django-cors-headers middleware προσθέτει τα σωστά headers (Access-Control-Allow-Origin) στα responses.',
          'Πρέπει να είναι ΠΡΙΝ το CommonMiddleware — αλλιώς τα OPTIONS δεν φτάνουν στο view.'
        ]
      },
      {
        type: 'list',
        title: '🛡️ CSRF — Cross-Site Request Forgery',
        items: [
          'Επίθεση: κακόβουλο site κάνει request στο API σου με τα cookies του θύματος.',
          'Το CSRF_TRUSTED_ORIGINS = ["https://localhost:8000", "https://localhost:5173"] λέει στη Django ποια origins είναι trusted για unsafe methods.',
          'Το CSRF_COOKIE_SECURE = True σημαίνει ότι το CSRF cookie στέλνεται μόνο μέσω HTTPS.',
          'Το API χρησιμοποιεί JWT (stateless) — δεν χρειάζεται CSRF protection στα API endpoints.',
          'Το CSRF είναι απαραίτητο για το /admin/ που χρησιμοποιεί session cookies.'
        ]
      },
      {
        type: 'list',
        title: '🍪 Secure cookies',
        items: [
          'SESSION_COOKIE_SECURE = True: το session cookie του admin στέλνεται μόνο μέσω HTTPS.',
          'CSRF_COOKIE_SECURE = True: το CSRF cookie μόνο μέσω HTTPS.',
          'SECURE_SSL_REDIRECT = not DEBUG: σε production, HTTP → HTTPS redirect.',
          'ALLOWED_HOSTS = [localhost, 127.0.0.1, ::1]: αποτροπή Host header attacks.'
        ]
      },
      {
        type: 'list',
        title: '🔑 JWT Security — τα 5 κλειδιά',
        items: [
          'Signed με SECRET_KEY — αν αλλάξει, όλα τα tokens γίνονται invalid.',
          'Access 10min: μικρό παράθυρο έκθεσης.',
          'Refresh 1day: αλλά ελέγχεται το approval_status σε κάθε refresh.',
          'sessionStorage: καθαρίζεται στο tab close.',
          'Bearer header: δεν αποθηκεύεται σε URL (θα ήταν σε logs).'
        ]
      },
      {
        type: 'list',
        title: '🚫 Τι ΔΕΝ κάνουμε (και γιατί είναι σωστό)',
        items: [
          'Δεν αποθηκεύουμε passwords σε plaintext — Django hashing με PBKDF2.',
          'Δεν βάζουμε tokens σε localStorage — ευάλωτο σε persistent XSS.',
          'Δεν χρησιμοποιούμε HTTP — θα ήταν ευάλωτο σε MITM.',
          'Δεν έχουμε wildcard CORS — μόνο trusted origins.',
          'Δεν εκθέτουμε το SECRET_KEY — διαβάζεται από .env.'
        ]
      }
    ]
  },

  // ==========================================================
  // 6. EXAM Q&A
  // ==========================================================
  {
    id: 'exam-qa',
    title: 'Exam Q&A — Πιθανές Ερωτήσεις',
    icon: '🎓',
    subtitle: '30+ ερωτήσεις εξέτασης με πλήρεις απαντήσεις',
    type: 'script',
    intro: 'Συλλογή από τις πιο πιθανές ερωτήσεις στην προφορική εξέταση. Κάθε απάντηση εξηγεί το «γιατί» πίσω από κάθε απόφαση.',
    blocks: [
      { type: 'qa', q: 'Γιατί χρησιμοποιείτε custom User model αντί για το built-in auth.User;', a: 'Η εκφώνηση απαιτεί ρόλους (4), ΑΦΜ, τηλέφωνο, τοποθεσία, approval_status. Αυτά δεν υπάρχουν στο built-in auth.User. Αν χρησιμοποιούσαμε το built-in, θα χρειαζόμασταν ξεχωριστό Profile model με OneToOne — περισσότερη πολυπλοκότητα. Το AUTH_USER_MODEL = "core.User" πρέπει να οριστεί ΠΡΙΝ την 1η migration, αλλιώς σπάει η βάση.' },
      { type: 'qa', q: 'Πώς αποφεύγετε το race condition στις κρατήσεις;', a: 'Με select_for_update() + @transaction.atomic. Το select_for_update εκδίδει SELECT ... FOR UPDATE στη PostgreSQL, κλειδώνοντας τη γραμμή του TicketType μέχρι το transaction να ολοκληρωθεί. Ο δεύτερος χρήστης περιμένει. Όταν ξεκλειδώσει, βλέπει τις ενημερωμένες τιμές. Αν το available έγινε 0, πετάει SoldOutError.' },
      { type: 'qa', q: 'Γιατί δύο φάσεις στις κρατήσεις (PENDING + CONFIRMED);', a: 'Γιατί η δέσμευση εισιτηρίων είναι πιο ασφαλής σε δύο βήματα. Πρώτα δημιουργείται η κράτηση (PENDING) — ελέγχονται τα δεδομένα χωρίς locking. Μετά, με το select_for_update, δεσμεύονται τα εισιτήρια και γίνεται CONFIRMED. Αν γινόταν σε ένα βήμα, θα έπρεπε να κρατάμε lock από την αρχή — πιο αργό και πιο επιρρεπές σε deadlocks.' },
      { type: 'qa', q: 'Γιατί χρησιμοποιείτε JWT αντί session cookies;', a: 'Γιατί η αρχιτεκτονική είναι decoupled (React 5173 + Django 8000). Τα session cookies απαιτούν same-origin ή σωστή ρύθμιση credentials. Τα JWT είναι stateless — κάθε request αυτοτελές, δεν χρειάζεται server-side session. Αυτό ταιριάζει με REST API + SPA. Επίσης, το CORS με credentials (cookies) είναι πιο περίπλοκο από το Authorization header.' },
      { type: 'qa', q: 'Γιατί access=10min και refresh=1day;', a: 'Το access token έχει μικρή διάρκεια ώστε αν κλαπεί, ο επιτιθέμενος να έχει περιορισμένο παράθυρο (10 λεπτά). Το refresh έχει μεγαλύτερη διάρκεια (1 μέρα) ώστε ο χρήστης να μην ξανακάνει login κάθε 10 λεπτά. Ο server ελέγχει το approval_status ΚΑΙ στο refresh — αν ο admin απέρριψε τον χρήστη στο μεταξύ, δεν του δίνει νέο access.' },
      { type: 'qa', q: 'Τι είναι το single-flight refresh;', a: 'Όταν πολλά requests παίρνουν 401 ταυτόχρονα, αντί να κάνουν 5 refresh calls, χρησιμοποιούν το ΙΔΙΟ promise (refreshing). Το πρώτο ξεκινάει το refresh, τα άλλα περιμένουν. Όταν έρθει το νέο access, όλα ξανα-εκτελούνται. Αποτρέπει το thundering herd problem.' },
      { type: 'qa', q: 'Γιατί event_id = EV0001 και όχι απλά το pk;', a: 'Η εκφώνηση απαιτεί EventID με format EV1024. Το pk (1, 2, 3) δεν ταιριάζει. Χρησιμοποιούμε temporary_id (UUID) → save → set_id_from_pk με βάση το pk. Αυτό λύνει το race condition: δύο ταυτόχρονες δημιουργίες δεν μπορούν να πάρουν το ίδιο pk, άρα ούτε το ίδιο event_id.' },
      { type: 'qa', q: 'Γιατί το ticket_type_id είναι unique per event και όχι globally;', a: 'Κάθε event ξεκινάει από T1. Αν ήταν globally unique, κάθε event θα είχε T1, T2, T3... αλλά σε διαφορετικούς αριθμούς. Το unique (event, ticket_type_id) επιτρέπει σε κάθε event να έχει το δικό του T1. Χρησιμοποιείται generate_id με scope={event_id}.' },
      { type: 'qa', q: 'Πώς λειτουργεί ο recommender;', a: 'Biased Matrix Factorization: x̂ = μ + b_u + c_j + v_u·f_j. Τα 3 πρώτα είναι baseline (μέση τιμή + biases). Το v_u·f_j είναι το taste term — εσωτερικό γινόμενο K latent factors. Training: SGD updates με regularization + early stopping. Prediction: ίδια formula. Cache 10 λεπτών με fingerprint invalidation.' },
      { type: 'qa', q: 'Πώς χειρίζεστε cold start χρήστη χωρίς bookings;', a: 'Δωρεάν — τα views μπαίνουν στο S ως ratings. Ένας χρήστης που έχει μόνο browsed παίρνει b_u και v_u από αυτά τα views. Η εκφώνηση το λέει ρητά: "Αν ο χρήστης δεν έχει προηγούμενο ιστορικό κρατήσεων, ο αλγόριθμος θα λειτουργεί βάσει μόνο των εκδηλώσεων που έχει επισκεφθεί." Δεν χρειάζεται ειδικός κώδικας.' },
      { type: 'qa', q: 'Brand-new user με μηδενικό history;', a: 'Ο τύπος καταρρέει σε x̂ = μ + c_j — καθαρά popularity ranking. Δεν έχει b_u (0) ούτε v_u (0). Αυτό είναι το σωστό αποτέλεσμα: σε sparse δεδομένα, το popularity είναι αξιόπιστο baseline (slide 40).' },
      { type: 'qa', q: 'Γιατί export φιλτράρεται client-side;', a: 'Το backend export endpoint δεν δέχεται παράμετρο status. Επιστρέφει ΟΛΑ τα events. Το frontend χρησιμοποιεί DOMParser (για XML) ή JSON.parse (για JSON) και φιλτράρει κατά status. Είναι λιγότερο κομψό από server-side filtering αλλά δεν απαιτεί αλλαγές στο backend.' },
      { type: 'qa', q: 'Ποια events εξάγονται σε XML/JSON;', a: 'Μόνο όσα έχουν ≥1 category ΚΑΙ ≥1 ticket type. Το DTD απαιτεί Category+ και TicketType+ (το + σημαίνει 1 ή περισσότερα). Αν λείπει κάτι, το event δεν συμπεριλαμβάνεται στο export. Το frontend το ελέγχει με canExportEvent: categories.length > 0 && min_price != null.' },
      { type: 'qa', q: 'Γιατί το φωτογραφίες δεν είναι στη βάση;', a: 'Αποθηκεύεται μόνο το PATH στη βάση. Το πραγματικό αρχείο πάει στον φάκελο media/events/EV0001/. Αυτό γιατί: (1) τα binary αρχεία γεμίζουν τη βάση, (2) τα media σερβίρονται πιο γρήγορα από web server, (3) backup/restore είναι πιο εύκολο. Η διαγραφή event διαγράφει και τα αρχεία μέσω signal post_delete.' },
      { type: 'qa', q: 'Πώς δουλεύει το soft delete στα μηνύματα;', a: 'Κάθε Message έχει deleted_by_sender και deleted_by_receiver. Όταν ο sender διαγράψει, θέτει deleted_by_sender=True. Το μήνυμα παραμένει στη βάση, αλλά δεν φαίνεται στον sender. Αν ΚΑΙ ο receiver διαγράψει, τότε γίνεται hard delete (delete()). Το ίδιο pattern για conversations. Αυτό επιτρέπει "reactivation" — αν κάποιος στείλει νέο μήνυμα, τα flags καθαρίζονται.' },
      { type: 'qa', q: 'Γιατί 3 roles και όχι 4;', a: 'Η εκφώνηση ορίζει 4 (Admin, Organizer, Attendee, Guest). Στην υλοποίηση: Guest = μη συνδεδεμένος, User = ταυτόχρονα Organizer + Attendee. Γιατί; Επειδή ένας χρήστης μπορεί και να διοργανώσει και να κρατήσει — οι "ρόλοι" είναι ενέργειες, όχι αποθηκευμένα πεδία. Ο διαχωρισμός θα απαιτούσε toggle στο UI χωρίς λειτουργικό όφελος.' },
      { type: 'qa', q: 'Γιατί RequireRole αντί για checks σε κάθε σελίδα;', a: 'DRY — ένα σημείο ελέγχου. Το RequireRole ελέγχει: loading state (αποφυγή race condition), isAuthenticated, role. Admin περνάει παντού (bypass). Αν δεν είναι authenticated → redirect /signin. Αν δεν έχει role → redirect /homepage. Κάθε protected route τυλίγεται με <RequireRole roles={["USER"]}>...</RequireRole>.' },
      { type: 'qa', q: 'Τι είναι το X-Frame-Options;', a: 'Προστατεύει από clickjacking — αποτρέπει το site να φορτωθεί μέσα σε iframe άλλου site. Το Django το ενεργοποιεί default μέσω XFrameOptionsMiddleware. Αν κάποιος βάλει iframe, ο browser δεν φορτώνει το περιεχόμενο.' },
      { type: 'qa', q: 'Γιατί extensions;', a: 'Το django-extensions δίνει χρήσιμα commands: runserver_plus (TLS-capable server για development), shell_plus (auto-imports), show_urls. Το runserver_plus χρησιμοποιείται αντί του απλού runserver γιατί υποστηρίζει --cert-file/--key-file.' },
      { type: 'qa', q: 'Γιατί whitenoise;', a: 'Σε production, το Django ΔΕΝ σερβίρει static files αποτελεσματικά. Το whitenoise middleware τα σερβίρει με σωστά headers (caching, compression) απευθείας από το Django process. Είναι πιο απλό από nginx για μικρά projects.' },
      { type: 'qa', q: 'Ποια είναι η διαφορά μεταξύ select_related και prefetch_related;', a: 'select_related: SQL JOIN, για ForeignKey/OneToOne (single object). prefetch_related: ξεχωριστό query + Python joining, για ManyToMany/Reverse FK (multiple objects). Στο EventSerializer χρησιμοποιούνται και τα δύο: select_related("organizer") + prefetch_related("categories", "ticket_types", "photos"). Αποφεύγει το N+1 query problem.' },
      { type: 'qa', q: 'Τι κάνει το .distinct() στο EventFilter;', a: 'Τα joins σε ManyToMany (categories) ή reverse FK (ticket_types) δημιουργούν διπλές γραμμές event — ένα event με 3 categories εμφανίζεται 3 φορές. Το .distinct() αφαιρεί τα duplicates. Χωρίς αυτό, η λίστα θα είχε το ίδιο event πολλές φορές.' },
      { type: 'qa', q: 'Γιατί TIME_ZONE = Europe/Athens και USE_TZ = True;', a: 'USE_TZ=True: τα datetimes αποθηκεύονται σε UTC στη βάση (standard). TIME_ZONE=Europe/Athens: κατά την ανάγνωση, μετατρέπονται σε τοπική ώρα. Αυτό είναι best practice — ο server μπορεί να είναι οπουδήποτε, τα δεδομένα μένουν σε UTC. Στο frontend, οι formatDate helpers χρησιμοποιούν τη local ώρα για εμφάνιση.' },
      { type: 'qa', q: 'Γιατί το DEFAULT_PAGINATION_CLASS είναι global;', a: 'Είναι global ρύθμιση στο REST_FRAMEWORK dict — όλα τα list endpoints έχουν pagination αυτόματα. PAGE_SIZE=30. Έτσι κανένα endpoint δεν μπορεί κατά λάθος να επιστρέψει ολόκληρο πίνακα. Αυτό είναι defense against accidental data leaks.' },
      { type: 'qa', q: 'Γιατί το COERCE_DECIMAL_TO_STRING = False;', a: 'By default, το DRF επιστρέφει DecimalField ως string ("18.00") για να μην χάσει precision. Αν το θέτεις False, γίνεται JSON number (18.00). Το frontend προτιμάει numbers — δεν χρειάζεται parseFloat(). Το precision είναι εντάξει γιατί τα prices είναι μικρά.' },
      { type: 'qa', q: 'Τι είναι το signal post_delete στο EventPhoto;', a: 'Όταν διαγραφεί η εγγραφή EventPhoto από τη βάση, το signal καλεί delete_photo_file(). Αυτό διαγράφει το πραγματικό αρχείο από το media/. Χρησιμοποιεί transaction.on_commit() — τρέχει μόνο αν το transaction ολοκληρωθεί επιτυχώς. Αν γίνει rollback, το αρχείο δεν διαγράφεται.' },
      { type: 'qa', q: 'Πώς εξασφαλίζετε ότι το image είναι ασφαλές;', a: '3 έλεγχοι στο EventPhotoSerializer: (1) μέγεθος ≤ 10MB, (2) format ∈ {JPEG, PNG, WEBP} — αποτρέπει malicious formats, (3) max 20 photos ανά event — αποτρέπει DoS μέσω disk fill. Το Pillow χειρίζεται την επεξεργασία.' },
      { type: 'qa', q: 'Γιατί χρησιμοποιείτε React Router αντί για server-side routing;', a: 'SPA — μία σελίδα, όλη η δρομολόγηση client-side. Πλεονεκτήματα: (1) πιο γρήγορες μεταβάσεις, (2) καλύτερο UX, (3) separation frontend/backend. Το React Router v7 χειρίζεται URLs, history, params, nested routes. Το backend σερβίρει ΜΟΝΟ ένα index.html.' },
      { type: 'qa', q: 'Τι είναι το StrictMode στο React;', a: 'Development-only wrapper. Διπλασιάζει intentionally κάποιες κλήσεις (render, effects) για να αποκαλύψει side effects που δεν είναι idempotent. Δεν επηρεάζει production. Αν δεις δύο requests σε ένα useEffect με [] dependency, αυτό είναι το StrictMode.' },
      { type: 'qa', q: 'Γιατί τα routes "/" και "*" στο App.jsx;', a: 'Το "/" αποδίδει WelcomePage χωρίς Navbar/Footer (fullscreen splash). Το "*" πιάνει όλα τα άλλα routes και τα τυλίγει με Navbar + Footer. Μέσα στο "*" υπάρχει nested <Routes> που ορίζει τα πραγματικά routes.' },
      { type: 'qa', q: 'Πώς λειτουργεί το useSearchParams;', a: 'Hook του React Router που διαβάζει/γράφει query params. Παράδειγμα: const [searchParams, setSearchParams] = useSearchParams(). Το activeTab = searchParams.get("tab") || "personal". Το setSearchParams({tab: "messages"}) αλλάζει το URL. Έτσι τα tabs είναι bookmarkable, shareable, refresh-safe.' }
    ]
  },

  // ==========================================================
  // 7. GLOSSARY
  // ==========================================================
  {
    id: 'glossary',
    title: 'Glossary — Λεξικό Όρων',
    icon: '📖',
    subtitle: 'Όλοι οι τεχνικοί όροι του project',
    type: 'script',
    intro: 'Συλλογή από τους τεχνικούς όρους που θα ακούσεις/πεις στην εξέταση. Κάθε όρος έχει σύντομη εξήγηση + πού χρησιμοποιείται.',
    blocks: [
      {
        type: 'glossary',
        terms: [
          { term: 'SPA (Single Page Application)', def: 'Εφαρμογή που φορτώνει ένα HTML και αλλάζει το περιεχόμενο μέσω JS χωρίς full reload. Χρησιμοποιείται στο frontend (React).' },
          { term: 'JWT (JSON Web Token)', def: 'Stateless token με 3 μέρη (header.payload.signature). Το access ζει 10min, το refresh 1day. Χρησιμοποιείται για authentication.' },
          { term: 'REST API', def: 'Resource-oriented API που χρησιμοποιεί HTTP methods (GET/POST/PATCH/DELETE) για CRUD. Εκτίθεται από το DRF.' },
          { term: 'ORM (Object-Relational Mapping)', def: 'Απεικόνιση σχεσιακών πινάκων σε Python objects. Το Django ORM μετατρέπει Event.objects.all() σε SQL SELECT.' },
          { term: 'Migration', def: 'Αρχείο που περιγράφει αλλαγές στο schema της βάσης. Δημιουργείται με makemigrations, εκτελείται με migrate.' },
          { term: 'Serializer', def: 'Μετατρέπει Python objects ↔ JSON. Περιλαμβάνει validation εισερχόμενων δεδομένων. DRF concept.' },
          { term: 'ViewSet', def: 'Ομαδοποίηση CRUD operations για ένα resource. Το DefaultRouter δημιουργεί αυτόματα URLs.' },
          { term: 'Router', def: 'Το DefaultRouter του DRF δημιουργεί URLs για κάθε ViewSet — π.χ. /events/, /events/{id}/.' },
          { term: 'Permission Class', def: 'Κλάση που ελέγχει αν ένας χρήστης μπορεί να εκτελέσει μια ενέργεια. Custom στο core/permissions.py.' },
          { term: 'Race Condition', def: 'Πρόβλημα όταν δύο processes διαβάζουν/γράφουν ταυτόχρονα το ίδιο δεδομένο. Λύνεται με select_for_update.' },
          { term: 'select_for_update', def: 'Django ORM method που εκδίδει SELECT FOR UPDATE — κλειδώνει τη γραμμή μέχρι το transaction να ολοκληρωθεί.' },
          { term: 'Transaction', def: 'Ομάδα πράξεων που είτε εκτελούνται όλες είτε καμία. Στη Django με @transaction.atomic.' },
          { term: 'CORS', def: 'Cross-Origin Resource Sharing. Επιτρέπει σε ένα origin (5173) να καλέσει API σε άλλο (8000).' },
          { term: 'CSRF', def: 'Cross-Site Request Forgery. Επίθεση όπου κακόβουλο site κάνει request με τα cookies του θύματος.' },
          { term: 'TLS/SSL', def: 'Κρυπτογράφηση επικοινωνίας μεταξύ browser και server. Self-signed certs για localhost.' },
          { term: 'Middleware', def: 'Layer που επεξεργάζεται requests/responses. Παραδείγματα: CORS, CSRF, Auth, Sessions.' },
          { term: 'N+1 Query Problem', def: 'Πρόβλημα απόδοσης: 1 query για τη λίστα + N queries για κάθε στοιχείο. Λύνεται με select_related/prefetch_related.' },
          { term: 'select_related', def: 'JOIN για ForeignKey/OneToOne. Παράδειγμα: Event.objects.select_related("organizer").' },
          { term: 'prefetch_related', def: 'Ξεχωριστό query + Python joining, για M2M/Reverse FK. Παράδειγμα: Event.objects.prefetch_related("ticket_types").' },
          { term: 'SerializerMethodField', def: 'DRF field που υπολογίζεται από method. Παράδειγμα: min_price = SerializerMethodField().' },
          { term: 'Action', def: 'DRF decorator @action που δημιουργεί custom endpoint πάνω σε ViewSet. Παράδειγμα: /events/{id}/publish/.' },
          { term: 'Soft Delete', def: 'Δεν διαγράφεται η εγγραφή — απλά τίθεται flag deleted=True. Χρησιμοποιείται σε messages/conversations.' },
          { term: 'Hard Delete', def: 'Πραγματική διαγραφή από τη βάση. Γίνεται όταν ΚΑΙ οι δύο πλευρές διαγράψουν.' },
          { term: 'Signal', def: 'Django μηχανισμός για side effects σε events. Παράδειγμα: post_delete στο EventPhoto.' },
          { term: 'Barrel File', def: 'Αρχείο που εξάγει πολλά modules μαζί (index.js). Καθαρίζει imports.' },
          { term: 'Accordion', def: 'UI pattern — κάρτες που ανοίγουν/κλείνουν. Χρησιμοποιείται στο documentation.' },
          { term: 'Custom Hook', def: 'React συνάρτηση που ξεκινά με "use". Παράδειγμα: useAuth().' },
          { term: 'Context', def: 'React μηχανισμός για global state χωρίς prop drilling. Χρησιμοποιείται για AuthContext.' },
          { term: 'Prop Drilling', def: 'Πέρασμα props μέσα από πολλά components που δεν τα χρησιμοποιούν. Αποφεύγεται με Context.' },
          { term: 'Lazy Initializer', def: 'useState(() => computeValue()) — υπολογίζει το initial state μόνο μία φορά.' },
          { term: 'Debounce', def: 'Καθυστέρηση εκτέλεσης μέχρι να σταματήσει ο χρήστης. Χρησιμοποιείται στο search (150ms).' },
          { term: 'Throttling', def: 'Περιορισμός συχνότητας εκτέλεσης. Διαφορετικό από debounce.' },
          { term: 'Biased Matrix Factorization', def: 'Recommender αλγόριθμος. x̂ = μ + b_u + c_j + v_u·f_j. Υλοποιήθηκε από το μηδέν.' },
          { term: 'Latent Factors', def: 'Κρυφά χαρακτηριστικά (K διαστάσεις) που μαθαίνονται. Παριστάνουν το "γούστο".' },
          { term: 'SGD (Stochastic Gradient Descent)', def: 'Αλγόριθμος optimization. Κάνει updates σε κάθε sample αντί σε όλο το batch.' },
          { term: 'Regularization', def: 'Ποινή (λ) που κρατά τα βάρη μικρά — αποτρέπει overfitting.' },
          { term: 'Early Stopping', def: 'Σταματάει το training όταν το validation error δεν βελτιώνεται για N epochs (PATIENCE=2).' },
          { term: 'MAE', def: 'Mean Absolute Error. Μέσο απόλυτο σφάλμα πρόβλεψης.' },
          { term: 'RMSE', def: 'Root Mean Squared Error. Τιμωρεί περισσότερο τα μεγάλα σφάλματα.' },
          { term: 'Precision@K', def: 'Από τα K που προτείναμε, πόσα άρεσαν στον χρήστη.' },
          { term: 'Recall@K', def: 'Από όλα όσα άρεσαν, πόσα πιάσαμε στα top-K.' },
          { term: 'Cold Start', def: 'Χρήστης χωρίς ιστορικό. Λύνεται με views ως ratings.' },
          { term: 'Fingerprint (Cache)', def: 'Στιγμιότυπο της κατάστασης (count + last date) για cache invalidation.' }
        ]
      }
    ]
  },

  // ==========================================================
  // 8. DATA FLOW DIAGRAMS
  // ==========================================================
  {
    id: 'data-flows',
    title: 'Data Flows — Πώς Ταξιδεύουν τα Δεδομένα',
    icon: '🔄',
    subtitle: 'End-to-end flows για τα 5 κύρια σενάρια',
    type: 'script',
    intro: 'Κάθε σενάριο περιγράφει πώς τα δεδομένα ταξιδεύουν από τον χρήστη στη βάση και πίσω.',
    blocks: [
      {
        type: 'flow',
        title: '🔑 Flow 1: Registration + Approval',
        steps: [
          { n: 1, text: 'Χρήστης συμπληρώνει φόρμα → SignUp.jsx.' },
          { n: 2, text: 'authService.register() → POST /api/auth/register/.' },
          { n: 3, text: 'RegisterSerializer validation + create user με approval_status=PENDING.' },
          { n: 4, text: 'Response 201. UI δείχνει "waiting for approval".' },
          { n: 5, text: 'Admin βλέπει τη νέα εγγραφή στο /profile?tab=users (PENDING filter).' },
          { n: 6, text: 'Admin κλικάρει Approve → POST /api/admin/users/{id}/approve/.' },
          { n: 7, text: 'approval_status=APPROVED. Ο χρήστης μπορεί τώρα να κάνει login.' }
        ]
      },
      {
        type: 'flow',
        title: '🎫 Flow 2: Create Event (Wizard)',
        steps: [
          { n: 1, text: 'Οργανωτής ανοίγει /profile/events/new → CreateEvent.jsx.' },
          { n: 2, text: 'Step 1: Συμπληρώνει title, venue, dates, categories.' },
          { n: 3, text: 'Step 2: Ticket types + live capacity indicator.' },
          { n: 4, text: 'Step 3: Description + photos (preview με URL.createObjectURL).' },
          { n: 5, text: 'Preview: read-only view όλων των στοιχείων.' },
          { n: 6, text: 'Submit: eventService.createEvent(payload).' },
          { n: 7, text: 'Backend: POST /events/. Response: event object με event_id=EV0001.' },
          { n: 8, text: 'Frontend: POST /ticket-types/bulk/ + POST /events/{id}/photos/.' },
          { n: 9, text: 'Αν κάτι αποτύχει: DELETE /events/{id}/ (rollback).' },
          { n: 10, text: 'Αν status=PUBLISHED: POST /events/{id}/publish/.' },
          { n: 11, text: 'Navigate στο /profile?tab=events.' }
        ]
      },
      {
        type: 'flow',
        title: '💰 Flow 3: Booking (Full Lifecycle)',
        steps: [
          { n: 1, text: 'Χρήστης βλέπει event → EventDetails.jsx.' },
          { n: 2, text: 'Κλικάρει "Tickets →" → BookTicket modal.' },
          { n: 3, text: 'Επιλέγει ticket type + quantity → Navigate στο /booking?ticketId=&quantity=.' },
          { n: 4, text: 'BookingPage: getBookingData() → localStorage save με timestamp.' },
          { n: 5, text: 'Αν δεν είναι authenticated → save + redirect /signin.' },
          { n: 6, text: 'Multi-stage validation: event PUBLISHED, end>now, capacity>0.' },
          { n: 7, text: 'window.confirm με event title + ticket + qty + total.' },
          { n: 8, text: 'POST /bookings/ → status PENDING (χωρίς reserve).' },
          { n: 9, text: 'POST /bookings/{id}/confirm/ → select_for_update στο TicketType.' },
          { n: 10, text: 'reserve_tickets: reserved += qty. status=CONFIRMED.' },
          { n: 11, text: 'Frontend: success state + auto-redirect /profile?tab=bookings.' }
        ]
      },
      {
        type: 'flow',
        title: '🎯 Flow 4: Recommendations',
        steps: [
          { n: 1, text: 'Χρήστης κλικάρει "Recommended Events" → /recommendations.' },
          { n: 2, text: 'RecommendationsPage: getRecommendations({page, filters}).' },
          { n: 3, text: 'Backend EventViewSet.recommendations action.' },
          { n: 4, text: 'Build candidate set: PUBLISHED, end>now, not organised by user, not already booked.' },
          { n: 5, text: 'rank_event_ids: get_model() → cache check (fingerprint + TTL).' },
          { n: 6, text: 'Αν cache miss: BiasedMF().fit(build_interactions()).' },
          { n: 7, text: 'build_interactions: EventView → view_rating, Booking → 5.0 (υπερισχύει).' },
          { n: 8, text: 'Score κάθε candidate: μ + b_u + c_j + v_u·f_j.' },
          { n: 9, text: 'Sort descending, tie-break στο event_id.' },
          { n: 10, text: 'Case/When annotate → SQL ordering → pagination.' },
          { n: 11, text: 'Response: top-30 (paginated).' }
        ]
      },
      {
        type: 'flow',
        title: '💬 Flow 5: Messaging',
        steps: [
          { n: 1, text: 'Χρήστης → /profile/messages/new?event=X.' },
          { n: 2, text: 'NewMessage: loadOptions (bookings + organised events).' },
          { n: 3, text: 'Αν event=mine: load attendees μέσω getEventBookings.' },
          { n: 4, text: 'Submit: sendNewMessage({event, attendee?, body}).' },
          { n: 5, text: 'Backend: POST /conversations/ (get_or_create).' },
          { n: 6, text: 'POST /messages/ με conversation + body.' },
          { n: 7, text: 'MessageService.getModel: sender + receiver από conversation.' },
          { n: 8, text: 'Recipient: fetch unread count → Navbar badge update.' },
          { n: 9, text: 'Sender: navigate /profile?tab=messages.' },
          { n: 10, text: 'Στο inbox: getInbox (messages received, not deleted).' },
          { n: 11, text: 'Open message: markConversationRead + getConversation (thread).' },
          { n: 12, text: 'Reply: POST /messages/ → thread append optimistic.' }
        ]
      }
    ]
  },

  // ==========================================================
  // 9. ΕΡΩΤΗΣΕΙΣ ΤΟΥ ΚΑΘΗΓΗΤΗ
  // ==========================================================
  {
    id: 'professor-questions',
    title: 'Ερωτήσεις του Καθηγητή',
    icon: '🎤',
    subtitle: 'Οι 10 ερωτήσεις που ρώτησε στην εξέταση — με πλήρεις απαντήσεις',
    type: 'script',
    intro: 'Αυτές είναι οι ερωτήσεις που τέθηκαν στην προφορική εξέταση. Κάθε απάντηση εξηγεί το «γιατί» πίσω από κάθε τεχνική απόφαση και δείχνει σε ποιο αρχείο υλοποιείται.',
    blocks: [
      { type: 'qa', q: '1. Υλοποιήθηκε το recommendation; Πώς;', a: 'ΝΑΙ, πλήρως από το μηδέν χωρίς έτοιμη βιβλιοθήκη ML. Υλοποιήθηκε ο αλγόριθμος Biased Matrix Factorization με SGD training. Τοποθεσία: backend/core/services/helper_recommendations.py. Τύπος: x̂ = μ + b_u + c_j + v_u·f_j. Αξιολόγηση μέσω management command evaluate_recommender. Πηγές ratings: booking CONFIRMED=5.0, PENDING=4.0, views=min(3.0, 1.5+0.5×N), και dataset e-class (interested=5.0, not_interested=1.0, neutral=2.0). Αποτελέσματα: RMSE=0.9273 vs baseline 0.9965 (6.9% βελτίωση), Precision@5=68× random. Hyperparameters: K=2, η=0.01, λ=0.005, PATIENCE=2, MAX_EPOCHS=17. Το μοντέλο κρατείται στη μνήμη με cache TTL 10 λεπτών + fingerprint invalidation. Cold start: ο χρήστης χωρίς bookings παίρνει b_u και v_u από τα views — η εκφώνηση το απαιτεί ρητά.' },
      { type: 'qa', q: '2. Πώς αποθηκεύονται οι εικόνες;', a: 'Filesystem + μόνο το path στη βάση. Στον πίνακα EventPhoto αποθηκεύεται το path ως string (π.χ. events/EV0001/cover1.jpg). Το πραγματικό αρχείο πάει στον φάκελο media/ με ομαδοποίηση ανά event — custom function event_photo_path() στο core/models/photo.py: f"events/{instance.event.event_id}/{filename}". Validation: max 10MB, μόνο JPEG/PNG/WEBP, max 20 φωτογραφίες ανά event. Διαγραφή μέσω signal post_delete που διαγράφει και το αρχείο μέσω transaction.on_commit(). Γιατί όχι στη βάση: τα binary αρχεία γεμίζουν τη βάση, είναι πιο αργά, και κάνουν το backup δύσκολο.' },
      { type: 'qa', q: '3. Διαχειρίζεστε σωστά τη χωρητικότητα;', a: 'ΝΑΙ, με 4 επίπεδα ελέγχου. Κανόνας: SUM(ticket_type.quantity) ≤ event.capacity. (1) Django Admin: TicketTypeInlineFormSet.clean() στο admin.py. (2) Model: TicketType.clean() στο core/models/ticket_type.py — others + self.quantity > capacity → error. (3) Service: create_ticket_type() και update_ticket_type() στο core/services/ticket_type.py ελέγχουν πριν το save, με select_for_update() στο Event. (4) Serializer: validate() στο core/serializers/ticket_type.py. (5) Frontend: ζωντανός δείκτης Capacity / Tickets allocated / Remaining + disabled submit. (6) DB: CheckConstraint(reserved ≤ quantity). Defense-in-depth — αν αποτύχει ένα επίπεδο, τα άλλα προστατεύουν.' },
      { type: 'qa', q: '4. Τι frontend framework χρησιμοποιήσατε;', a: 'React 19.2.8 + Vite 8.2.2. Πλήρες stack: react-router-dom 7.18, axios 1.20, @mui/material 9.4 + Material icons, leaflet 1.9 για OpenStreetMap (απαίτηση 9), react-datepicker 9.1. Αρχιτεκτονική: SPA — ένα index.html, όλη η δρομολόγηση client-side. Decoupled από το backend (5173 vs 8000). HTTPS μέσω Vite dev server με self-signed certs. Δομή φακέλων: context/, components/, pages/, services/. Η εκφώνηση απαιτεί «Javascript/Typescript Web framework (Angular, React κ.ο.κ.)».' },
      { type: 'qa', q: '5. Έχει framework το backend;', a: 'ΝΑΙ — Django 5.2.15 + Django REST Framework 3.17.1. Πλήρες stack: DRF για το REST API (serializers, viewsets, permissions), SimpleJWT για JWT authentication, django-cors-headers για CORS, django-filter για δηλωτικά φίλτρα (απαίτηση 8), django-extensions για runserver_plus με TLS, psycopg2-binary + dj-database-url για PostgreSQL (Neon), python-dotenv, gunicorn + whitenoise, Pillow, lxml. Η εκφώνηση απαιτεί ρητά REST API + αντικειμενοστρεφές μοντέλο μέσω ORM.' },
      { type: 'qa', q: '6. Πώς σώζονται τα tokens;', a: 'Σε sessionStorage (ΟΧΙ localStorage). Δύο tokens: access_token (10 λεπτά) και refresh_token (1 μέρα). Αποθήκευση στο frontend/src/services/client.js και api.js. Γιατί sessionStorage: καθαρίζεται αυτόματα στο κλείσιμο του tab — πιο ασφαλές από localStorage που είναι ευάλωτο σε persistent XSS. Lifecycle: (1) Login: authService.login() αποθηκεύει tokens + κάνει GET /auth/me/. (2) Request: request interceptor προσθέτει Authorization: Bearer. (3) Refresh: response interceptor βλέπει 401, καλεί POST /auth/refresh/ single-flight. (4) Logout: removeItem. (5) Refresh expired: clear + dispatch event "auth-expired".' },
      { type: 'qa', q: '7. Το authorization έγινε με tokens;', a: 'ΝΑΙ — JWT. Authentication (ποιος είσαι): access token 10 λεπτών σε κάθε request header Authorization: Bearer <token> + refresh token 1 μέρας. Stateless — ο server δεν κρατάει session. Signed με SECRET_KEY. Authorization (τι μπορείς να κάνεις): χωριστά μέσω custom permission classes στο core/permissions.py — IsAdmin, IsApprovedUser, IsEventOwnerOrReadOnly, IsTicketTypeEventOwnerOrReadOnly, IsBookingOwnerOrEventOrganizer, IsMessageParticipant, IsBookingOwner. DRF default: DEFAULT_PERMISSION_CLASSES = [IsAuthenticated].' },
      { type: 'qa', q: '8. Στο edit event γίνεται έλεγχος ότι εισιτήρια < capacity;', a: 'ΝΑΙ, σε 3+ επίπεδα. (1) Frontend (EditEvent.jsx): live indicator, validateStep2(), disabled submit, ΚΑΙ check ότι δεν μειώνεις quantity κάτω από already-booked (booked = originalQuantity - originalAvailable). (2) Serializer: validate() ελέγχει other_total + quantity > event.capacity. (3) Service (update_ticket_type): ίδιος έλεγχος με select_for_update στο Event. (4) DB: CheckConstraint. Επιπλέον, στο updateEvent() το frontend κάνει order-dependent sync: αν μειωθεί το capacity → πρώτα sync tickets, μετά save. Αν αυξηθεί → πρώτα save, μετά sync.' },
      { type: 'qa', q: '9. Γίνεται έλεγχος για race condition στη διαθεσιμότητα εισιτηρίων;', a: 'ΝΑΙ — με select_for_update() + @transaction.atomic. Το πρόβλημα: δύο χρήστες διαβάζουν available=2 ταυτόχρονα, και οι δύο περνάνε. Η λύση στο core/services/ticket_type.py → reserve_tickets(): @transaction.atomic + TicketType.objects.select_for_update().get(pk=...) + check + reserved += quantity. Το select_for_update εκδίδει SELECT ... FOR UPDATE στη PostgreSQL — κλειδώνει τη γραμμή μέχρι το transaction να ολοκληρωθεί. Χρησιμοποιείται σε 7+ σημεία: reserve_tickets, confirm_booking, create/update/delete_ticket_type, update_event, destroy event, cancel_event_bookings. Two-phase booking: create (PENDING χωρίς lock) + confirm (με lock).' },
      { type: 'qa', q: '10. Τα μηνύματα όταν στέλνονται εμφανίζονται κατευθείαν ή θέλει refresh;', a: 'Εμφανίζονται ΚΑΤΕΥΘΕΙΑΝ — χωρίς refresh, με 3 τεχνικές που συνδυάζονται. (1) Optimistic UI: στο UserDashboard.jsx, handleSendReply() κάνει setThread(prev => [...prev, data]). (2) Custom event: το fetchUnreadCount() κάνει window.dispatchEvent(new CustomEvent("unread-changed", {detail: count})). Το Navbar ακούει με useEffect + addEventListener → ενημερώνει το badge ΑΜΕΣΩΣ. (3) Polling fallback: κάθε 20s καλείται getUnreadCount() για μηνύματα από ΑΛΛΟΥΣ χρήστες. Chat bubbles: incoming (αριστερά γκρι) / outgoing (δεξιά πράσινο). Delete: soft delete με flags deleted_by_sender/receiver.' }
    ]
  }
];