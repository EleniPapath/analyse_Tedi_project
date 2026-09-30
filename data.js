// ============================================================
// data.js — Όλα τα δεδομένα του οδηγού
// Δομή: κάθε ενότητα (section) έχει id, τίτλο, icon και λίστα αρχείων.
// Κάθε αρχείο έχει: name, folder, type, summary, what, why, keyPoints.
// ============================================================

const SECTIONS = [
  // ==========================================================
  // BACKEND — ROOT
  // ==========================================================
  {
    id: 'backend-root',
    title: 'Backend — Root',
    icon: '⚙️',
    files: [
      {
        name: 'manage.py',
        folder: 'backend/',
        type: 'backend',
        summary: 'CLI εργαλείο της Django — η είσοδος για όλες τις εντολές.',
        what: 'Ορίζει τη μεταβλητή DJANGO_SETTINGS_MODULE=config.settings και καλεί execute_from_command_line(sys.argv).',
        why: 'Χωρίς αυτό δεν μπορείς να τρέξεις runserver, migrate, createsuperuser, makemigrations κ.λπ. Δεν καλείται από τον browser — είναι εργαλείο ανάπτυξης.',
        keyPoints: [
          'Δεν σερβίρει requests — είναι εργαλείο CLI.',
          'Το DJANGO_SETTINGS_MODULE δείχνει στο config/settings.py.',
          'Το try/except δίνει φιλικό μήνυμα αν λείπει η Django ή το venv.'
        ]
      },
      {
        name: 'requirements.txt',
        folder: 'backend/',
        type: 'backend',
        summary: 'Λίστα με όλα τα Python packages και τις εκδόσεις τους.',
        what: 'Django 5.2, DRF, SimpleJWT, django-cors-headers, django-filter, psycopg2-binary, dj-database-url, python-dotenv, Pillow, lxml, gunicorn, whitenoise, cryptography, pyOpenSSL κ.ά.',
        why: 'Για reproducibility — με pip install -r requirements.txt στήνεται το ίδιο περιβάλλον παντού.',
        keyPoints: [
          'djangorestframework + SimpleJWT → REST API με JWT.',
          'django-cors-headers → επικοινωνία με React (5173).',
          'psycopg2-binary + dj-database-url → Neon PostgreSQL.',
          'lxml → εξαγωγή XML κατά DTD (απαίτηση 12).',
          'gunicorn + whitenoise → production server + static files.'
        ]
      },
      {
        name: '.env.example',
        folder: 'backend/',
        type: 'backend',
        summary: 'Υπόδειγμα για το πραγματικό .env (δεν ανεβαίνει στο git).',
        what: 'DATABASE_URL, ADMIN_USERNAME/EMAIL/PASSWORD, SECRET_KEY, DEBUG, DB_SSL.',
        why: 'Διαχωρισμός κώδικα από configuration. Ο καθηγητής αντιγράφει σε .env και τρέχει την εφαρμογή.',
        keyPoints: [
          'Το πραγματικό .env δεν πρέπει να είναι στο git.',
          'SECRET_KEY δεν είναι hardcoded στο settings.py — διαβάζεται από εδώ.',
          'ADMIN_PASSWORD=123456 δημιουργεί τον built-in admin μέσω migration.'
        ]
      }
    ]
  },

  // ==========================================================
  // BACKEND — CONFIG
  // ==========================================================
  {
    id: 'backend-config',
    title: 'Backend — Config',
    icon: '🔧',
    files: [
      {
        name: 'asgi.py',
        folder: 'backend/config/',
        type: 'backend',
        summary: 'Entry point για ASGI servers (async, WebSockets).',
        what: 'Δημιουργεί το callable application μέσω get_asgi_application().',
        why: 'Τυπικό boilerplate. Αν ποτέ προστεθούν real-time features (π.χ. instant messaging) θα χρειαστεί. Τώρα δεν χρησιμοποιείται — χρησιμοποιείται το wsgi.py.',
        keyPoints: [
          'ASGI = asynchronous, WSGI = synchronous.',
          'Το δημιουργεί αυτόματα η Django — σπάνια αλλάζει.'
        ]
      },
      {
        name: 'settings.py',
        folder: 'backend/config/',
        type: 'backend',
        summary: 'Κεντρικό configuration ολόκληρου του Django project.',
        what: 'SECRET_KEY, DEBUG, INSTALLED_APPS, MIDDLEWARE, DATABASES, REST_FRAMEWORK, SIMPLE_JWT, CORS, CSRF, MEDIA, AUTH_USER_MODEL=core.User κ.λπ.',
        why: 'Χωρίς αυτό η Django δεν ξέρει πού είναι η βάση, ποια apps υπάρχουν, πώς γίνεται το auth, πώς σερβίρονται τα static files κ.λπ.',
        keyPoints: [
          'AUTH_USER_MODEL = core.User — custom user με ρόλους (πρέπει πριν την 1η migration).',
          'SESSION_COOKIE_SECURE + CSRF_COOKIE_SECURE = True — cookies μόνο μέσω HTTPS.',
          'REST_FRAMEWORK: JWT auth, IsAuthenticated default, PageNumberPagination (30/σελίδα).',
          'SIMPLE_JWT: access 10 λεπτά, refresh 1 μέρα.',
          'TIME_ZONE = Europe/Athens, USE_TZ = True.',
          'DATABASES μέσω dj_database_url.parse + select_for_update υποστήριξη.'
        ]
      },
      {
        name: 'urls.py',
        folder: 'backend/config/',
        type: 'backend',
        summary: 'Root URLconf — το σημείο εισόδου για όλα τα URLs.',
        what: 'Redirect από / στο /api/events/, admin/, include(core.urls) κάτω από /api/, media files σε DEBUG.',
        why: 'Ορίζει τη δομή: admin, api, media. Κάθε app έχει το δικό του urls.py (modularity).',
        keyPoints: [
          'To admin/ εξυπηρετεί τη σελίδα διαχείρισης (απαίτηση 3-4).',
          'Όλα τα API endpoints κάτω από /api/.',
          'Media files σερβίρονται μόνο σε DEBUG.'
        ]
      },
      {
        name: 'wsgi.py',
        folder: 'backend/config/',
        type: 'backend',
        summary: 'Entry point για WSGI servers (gunicorn) σε production.',
        what: 'Δημιουργεί το application callable μέσω get_wsgi_application().',
        why: 'Ο gunicorn το φορτώνει και του στέλνει HTTP requests. Είναι το standard interface μεταξύ web server και Django.',
        keyPoints: [
          'Στο deployment: Client → nginx → gunicorn (WSGI) → Django.',
          'Το χρησιμοποιείς αυτή τη στιγμή (όχι το asgi.py).'
        ]
      }
    ]
  },

  // ==========================================================
  // BACKEND — CORE APP
  // ==========================================================
  {
    id: 'backend-core',
    title: 'Backend — Core App',
    icon: '🏗️',
    files: [
      {
        name: 'urls.py',
        folder: 'backend/core/',
        type: 'backend',
        summary: 'URLs του core app — DefaultRouter + auth endpoints + export.',
        what: 'DefaultRouter για categories/events/ticket-types/bookings/messages/conversations/admin-users. Χειροκίνητα: auth/register, auth/login, auth/refresh, auth/me, admin/events/export/xml|json.',
        why: 'Το DefaultRouter δημιουργεί αυτόματα CRUD URLs για κάθε ViewSet. Τα auth endpoints δεν ταιριάζουν σε ViewSet, οπότε μπαίνουν χειροκίνητα.',
        keyPoints: [
          'Prefix /api/ (από config/urls.py).',
          'Custom actions: /events/{id}/publish/, /cancel/, /photos/, /recommendations/.',
          're_path για xml|json export.'
        ]
      },
      {
        name: 'utils.py',
        folder: 'backend/core/',
        type: 'backend',
        summary: 'Helpers για δημιουργία unique IDs (EV0001, BK0501, T0001).',
        what: 'temporary_id() → UUID hex (προσωρινό). set_id_from_pk(obj, field, prefix) → μετά το save βάζει EV{pk:04d}. generate_id(model, field, prefix, scope) → για TicketType (unique per event).',
        why: 'Λύνει το race condition: δύο ταυτόχρονες δημιουργίες δεν μπορούν να πάρουν το ίδιο pk, άρα ούτε το ίδιο id.',
        keyPoints: [
          'Temp id → save → set_id_from_pk με βάση το pk.',
          'generate_id χρησιμοποιεί select_for_update() για ασφάλεια.',
          'Τα IDs μοιάζουν με της εκφώνησης: EV1024, T1, B501.'
        ]
      },
      {
        name: 'admin.py',
        folder: 'backend/core/',
        type: 'backend',
        summary: 'Ρυθμίσεις Django admin panel (σελίδα /admin/).',
        what: 'CustomUserAdmin (approval_status, ΑΦΜ, τηλέφωνο, τοποθεσία), TicketTypeInlineFormSet (capacity validation), EventAdmin με inlines, BookingAdmin read-only.',
        why: 'Η εκφώνηση απαιτεί σελίδα διαχείρισης χρηστών (απαίτηση 4) — υλοποιείται μέσω του admin.',
        keyPoints: [
          'BookingAdmin: has_add/change/delete_permission = False — μόνο ο χρήστης κάνει κρατήσεις.',
          'Inline formset ελέγχει ότι sum(quantity) ≤ capacity.',
          'ConversationAdmin με select_related για N+1 optimization.'
        ]
      },
      {
        name: 'apps.py',
        folder: 'backend/core/',
        type: 'backend',
        summary: 'Configuration της Django app "core".',
        what: 'default_auto_field = BigAutoField, name = "core".',
        why: 'Boilerplate — δημιουργείται από startapp. Σπάνια αλλάζει.',
        keyPoints: ['Το BigAutoField γίνεται το default primary key.']
      },
      {
        name: 'filters.py',
        folder: 'backend/core/',
        type: 'backend',
        summary: 'Φίλτρα αναζήτησης εκδηλώσεων (απαίτηση 8).',
        what: 'EventFilter με category, organizer, status, event_type, start_after, start_before, city (icontains), country (icontains), min_price/max_price (noop + κοινό filter).',
        why: 'Το filtering γίνεται δηλωτικά αντί χειροκίνητα — πιο καθαρό, DRY, και ταιριάζει με το DjangoFilterBackend.',
        keyPoints: [
          'min_price/max_price με method=noop: εφαρμόζονται μαζί στο ίδιο ticket type (όχι το ένα σε ένα, το άλλο σε άλλο).',
          '.distinct() γιατί τα joins σε M2M δημιουργούν duplicates.',
          'SearchFilter (title+description) και OrderingFilter έρχονται από το DRF.'
        ]
      },
      {
        name: 'permissions.py',
        folder: 'backend/core/',
        type: 'backend',
        summary: 'Custom permissions για role-based access control.',
        what: 'IsAdmin (is_staff/is_superuser), IsApprovedUser (defense-in-depth), IsEventOwnerOrReadOnly, IsTicketTypeEventOwnerOrReadOnly, IsBookingOwnerOrEventOrganizer, IsMessageParticipant, IsBookingOwner.',
        why: 'Στην εκφώνηση ο χρήστης δεν επιλέγει ρόλο — μόλις εγκριθεί, μπορεί και να διοργανώσει και να κάνει κρατήσεις. Άρα οι «ρόλοι» είναι καταστάσεις (ενέργειες), όχι αποθηκευμένα πεδία.',
        keyPoints: [
          'SAFE_METHODS (GET/HEAD/OPTIONS) → όλοι· αλλιώς owner ή admin.',
          'IsTicketTypeEventOwnerOrReadOnly: στο create δεν υπάρχει object → κοιτάει event_id από URL/body.',
          'Στο create καλείται μόνο has_permission — όχι has_object_permission.'
        ]
      }
    ]
  },

  // ==========================================================
  // BACKEND — MODELS
  // ==========================================================
  {
    id: 'backend-models',
    title: 'Backend — Models',
    icon: '🗄️',
    files: [
      {
        name: 'user.py',
        folder: 'backend/core/models/',
        type: 'backend',
        summary: 'Custom User (extends AbstractUser) με ρόλους, ΑΦΜ, τοποθεσία.',
        what: 'first_name, last_name, email (unique ci), phone, address, city, country, afm (9-digit), latitude, longitude, approval_status (PENDING/APPROVED/REJECTED).',
        why: 'Η εκφώνηση απαιτεί ΑΦΜ, τηλέφωνο, τοποθεσία και approval workflow — το built-in auth.User δεν τα έχει.',
        keyPoints: [
          'Properties: is_admin (is_staff or is_superuser), is_organizer, is_approved.',
          'UniqueConstraint(Lower("email")) για case-insensitive.',
          'CheckConstraint lat/lon pair — ή και τα δύο ή κανένα.',
          'ΑΠΑΙΤΕΙΤΑΙ AUTH_USER_MODEL="core.User" στο settings ΠΡΙΝ την 1η migration.'
        ]
      },
      {
        name: 'category.py',
        folder: 'backend/core/models/',
        type: 'backend',
        summary: 'Κατηγορία εκδήλωσης (Music, Theater, Sports...).',
        what: 'name (unique), slug (auto από slugify, allow_unicode=True για ελληνικά).',
        why: 'Τα events μπορούν να ανήκουν σε πολλές κατηγορίες (M2M) — απαίτηση της εκφώνησης.',
        keyPoints: [
          'save() αυτόματα δημιουργεί το slug αν λείπει.',
          'allow_unicode=True → δουλεύει με ελληνικά.'
        ]
      },
      {
        name: 'event.py',
        folder: 'backend/core/models/',
        type: 'backend',
        summary: 'Η κεντρική οντότητα — Εκδήλωση.',
        what: 'event_id (EV0001), organizer, title, description, event_type, venue, address, city, country, lat/lng, start/end_datetime, capacity, status (DRAFT/PUBLISHED/COMPLETED/CANCELLED), categories (M2M).',
        why: 'Απεικονίζει το DTD της εκφώνησης. Όλες οι άλλες οντότητες περιστρέφονται γύρω της.',
        keyPoints: [
          'Properties: is_published, is_cancelled, is_active (PUBLISHED and end>now), total_reserved, available_capacity.',
          'Constraint end_datetime > start_datetime.',
          'save() με temporary_id + set_id_from_pk → EV{pk:04d}.',
          'Indexes: (status, start_datetime), (city, start_datetime).'
        ]
      },
      {
        name: 'ticket_type.py',
        folder: 'backend/core/models/',
        type: 'backend',
        summary: 'Τύπος εισιτηρίου για κάθε εκδήλωση (Regular, VIP, Student...).',
        what: 'event, ticket_type_id (unique per event), name, price, quantity, reserved.',
        why: 'Ο διοργανωτής μπορεί να έχει πολλαπλούς τύπους εισιτηρίων (απαίτηση 7). Το backend πρέπει να ελέγχει ότι sum(quantity) ≤ capacity.',
        keyPoints: [
          'Property available = quantity - reserved.',
          'clean(): quantity ≥ reserved, sum(quantity) ≤ event.capacity.',
          'save(): select_for_update στο Event + generate_id με scope={event_id}.',
          'Constraint reserved ≤ quantity, unique (event, Lower(name)).'
        ]
      },
      {
        name: 'booking.py',
        folder: 'backend/core/models/',
        type: 'backend',
        summary: 'Κράτηση εισιτηρίων (attendee κρατάει X εισιτήρια σε event).',
        what: 'booking_id (BK0501), event, attendee, ticket_type, number_of_tickets, total_cost, status (PENDING/CONFIRMED/CANCELLED).',
        why: 'Οι κρατήσεις είναι το κεντρικό σενάριο χρήσης (απαίτηση 9). Δύο φάσεις: PENDING → CONFIRMED.',
        keyPoints: [
          'on_delete=PROTECT σε event/attendee/ticket_type — δεν χάνονται τα δεδομένα.',
          'clean(): ticket_type.event == event, event active, availability.',
          'save(): temp id → set_id_from_pk με prefix BK.',
          'Status transition CANCELLED μόνο μέσω ακύρωσης event.'
        ]
      },
      {
        name: 'conversation.py',
        folder: 'backend/core/models/',
        type: 'backend',
        summary: 'Συνομιλία μεταξύ organizer και attendee για συγκεκριμένο event.',
        what: 'organizer, attendee, event, created_at, deleted_by_organizer, deleted_by_attendee.',
        why: 'Τα μηνύματα οργανώνονται σε συζητήσεις (απαίτηση 10) ώστε να φαίνεται όλο το ιστορικό.',
        keyPoints: [
          'UniqueConstraint(event, attendee) — μία συνομιλία ανά ζεύγος/event.',
          'Soft delete μέσω δύο flags — κάθε πλευρά διαγράφει το δικό της αντίγραφο.'
        ]
      },
      {
        name: 'message.py',
        folder: 'backend/core/models/',
        type: 'backend',
        summary: 'Μήνυμα μέσα σε συνομιλία.',
        what: 'sender, receiver, conversation (FK), body (max 2048), is_read, deleted_by_sender/receiver, created_at.',
        why: 'Απαίτηση 10: messaging με inbox/sent + indication νέων.',
        keyPoints: [
          'mark_as_read() method.',
          'Soft delete μέσω flags — αν και οι δύο διαγράψουν → hard delete.',
          'Indexes: (receiver, deleted_by_receiver, -created_at), (sender, deleted_by_sender, -created_at).'
        ]
      },
      {
        name: 'photo.py',
        folder: 'backend/core/models/',
        type: 'backend',
        summary: 'Φωτογραφία εκδήλωσης (Media/Photo από DTD).',
        what: 'event, image (ImageField), caption, order, uploaded_at. Upload path: events/EV0001/xxx.jpg.',
        why: 'Απαίτηση 7: προαιρετικές φωτογραφίες για κάθε εκδήλωση.',
        keyPoints: [
          'event_photo_path() → events/{event_id}/{filename} (οργάνωση σε υποφακέλους).',
          'Signal post_delete → διαγράφει το αρχείο μέσω transaction.on_commit.',
          'Δεν αποθηκεύεται το binary στη βάση — μόνο το path.'
        ]
      },
      {
        name: 'event_view.py',
        folder: 'backend/core/models/',
        type: 'backend',
        summary: 'Καταγραφή προβολών event από user (για recommender).',
        what: 'user, event, view_count, first_viewed_at, last_viewed_at.',
        why: 'Το σύστημα συστάσεων (απαίτηση 13) χρειάζεται και τις προβολές ως έμμεσο rating (2.0-3.0).',
        keyPoints: [
          'UniqueConstraint(user, event) — μία εγγραφή ανά ζεύγος.',
          'EventDetails view αυξάνει view_count με cooldown 30s (anti-spam).',
          'Rating από view: min(3.0, 1.5 + 0.5 * view_count).'
        ]
      }
    ]
  },

  // ==========================================================
  // BACKEND — SERIALIZERS
  // ==========================================================
  {
    id: 'backend-serializers',
    title: 'Backend — Serializers',
    icon: '🔄',
    files: [
      {
        name: 'user.py',
        folder: 'backend/core/serializers/',
        type: 'backend',
        summary: 'Serializers για User — public, self, admin, register.',
        what: 'UserPublicSerializer (id, username, name, email), UserSerializer (πλήρες + password change), UserAdminSerializer (read-only), RegisterSerializer (sign-up).',
        why: 'Διαφορετικά contexts — public view vs own profile vs admin vs registration. Καθένα εκθέτει διαφορετικά πεδία.',
        keyPoints: [
          'UserSerializer: update() αλλάζει μόνο τα πεδία που στάλθηκαν (update_fields).',
          'RegisterSerializer: email unique ci, password validation, lat/lon pair.',
          'Custom update αποφεύγει race condition με admin approval.'
        ]
      },
      {
        name: 'event.py',
        folder: 'backend/core/serializers/',
        type: 'backend',
        summary: '3 serializers για Event — list, detail, write.',
        what: 'EventListSerializer (grid, min_price, cover_photo), EventDetailSerializer (πλήρες, nested), EventWriteSerializer (create/update — περιορισμένο).',
        why: 'Best practice: διαφορετικά contexts. Το WriteSerializer ΔΕΝ επιτρέπει status/event_id — αλλάζουν μέσω actions (publish/cancel).',
        keyPoints: [
          'List: υπολογίζει min_price από ticket_types, cover = 1η φωτογραφία.',
          'Write: validation lat/lon pair, range, rounding 5 δεκαδικών, start > now.',
          'Detail: nested organizer, ticket_types, photos, categories.'
        ]
      },
      {
        name: 'ticket_type.py',
        folder: 'backend/core/serializers/',
        type: 'backend',
        summary: 'Serializer για TicketType — create/update μέσω services.',
        what: 'available (read-only), validation duplicate name, sum ≤ capacity, name strip.',
        why: 'Ο έλεγχος γίνεται σε δύο επίπεδα — serializer (γρήγορο feedback) + service (locking).',
        keyPoints: [
          'create() καλεί create_ticket_type service με select_for_update.',
          'update() καλεί update_ticket_type με ReservedTicketsError/CapacityExceededError.',
          'event_id read-only — προέρχεται από context.'
        ]
      },
      {
        name: 'booking.py',
        folder: 'backend/core/serializers/',
        type: 'backend',
        summary: 'Serializer για Booking — create μόνο, no update.',
        what: 'read-only: booking_id, attendee, total_cost, status. Nested: event_title, event_date, venue, city, ticket_type_name.',
        why: 'Οι κρατήσεις ΔΕΝ τροποποιούνται μετά την υποβολή (απαίτηση 9). Το update() πετάει ValidationError.',
        keyPoints: [
          'Validation: ticket_type.event == event, event active, availability, cost not too large.',
          'create() καλεί create_booking service.',
          'update() → "Bookings cannot be updated or withdrawn once submitted."'
        ]
      },
      {
        name: 'conversation.py',
        folder: 'backend/core/serializers/',
        type: 'backend',
        summary: 'Serializer για Conversation με has_unread flag.',
        what: 'organizer/attendee usernames, event_title, has_unread (SerializerMethodField που διαβάζει annotation).',
        why: 'Το has_unread αποφεύγει N+1 query — το ViewSet το annotate-άρει με Exists().',
        keyPoints: [
          'validate(): μόνο αν έχει booking στο event ή είναι organizer.',
          'create(): get_or_create — αν υπάρχει, ξαναενεργοποιεί.',
          'validators = [] — αφαιρεί το unique constraint από serializer.'
        ]
      },
      {
        name: 'message.py',
        folder: 'backend/core/serializers/',
        type: 'backend',
        summary: 'Serializer για Message.',
        what: 'read-only sender/receiver, usernames, is_read, event_title.',
        why: 'Το create() καλεί send_message service με select_for_update (για race condition).',
        keyPoints: [
          'validate(): ο χρήστης πρέπει να είναι μέλος της συνομιλίας.',
          'create(): send_message service.'
        ]
      },
      {
        name: 'photo.py',
        folder: 'backend/core/serializers/',
        type: 'backend',
        summary: 'Serializer για EventPhoto με validation.',
        what: 'validation: max 10MB, JPEG/PNG/WEBP, max 20 φωτογραφίες ανά event.',
        why: 'Προστασία από κακόβουλα/τεράστια αρχεία.',
        keyPoints: [
          'validate_image: size + format.',
          'validate(): max 20 photos.',
          'create(): event από context.'
        ]
      },
      {
        name: 'category.py',
        folder: 'backend/core/serializers/',
        type: 'backend',
        summary: 'Serializer για Category με slug validation.',
        what: 'slug read-only, validation duplicate slug (εξαιρεί τον εαυτό του σε update).',
        why: 'Αποτρέπει τη δημιουργία κατηγοριών με ίδιο slug (π.χ. "Music" και "music").',
        keyPoints: ['Χρησιμοποιεί slugify με allow_unicode=True.']
      }
    ]
  },

  // ==========================================================
  // BACKEND — SERVICES (Business Logic)
  // ==========================================================
  {
    id: 'backend-services',
    title: 'Backend — Services (Business Logic)',
    icon: '🧠',
    files: [
      {
        name: 'events.py',
        folder: 'backend/core/services/',
        type: 'backend',
        summary: 'Business logic για Events (create, update, mark completed).',
        what: 'create_event (έλεγχος sum(quantity) ≤ capacity), update_event (select_for_update, freeze αν ξεκίνησε), mark_completed_events.',
        why: 'Οι views δεν πρέπει να έχουν business logic — μπαίνει σε services για testability και reuse.',
        keyPoints: [
          'DomainError: CapacityExceeded, InvalidTransition.',
          'update_event: απαγορεύει αλλαγή σε COMPLETED/CANCELLED, ελέγχει νέο capacity ≥ sum(tickets).',
          'mark_completed_events: bulk update για PUBLISHED που έληξαν.'
        ]
      },
      {
        name: 'booking.py',
        folder: 'backend/core/services/',
        type: 'backend',
        summary: 'Business logic για Bookings (create, confirm, cancel).',
        what: 'create_booking (PENDING), confirm_booking (reserve_tickets + CONFIRMED), cancel_event_bookings, get_booking_queryset.',
        why: 'Οι κρατήσεις απαιτούν locking (select_for_update) — δεν είναι απλό CRUD.',
        keyPoints: [
          'SoldOutError, EventNotActiveError, TicketTypeMismatchError.',
          'create_booking: user.is_approved, event.is_active, ticket_type belongs, availability.',
          'Ο organizer ΔΕΝ μπορεί να κάνει κράτηση στη δική του εκδήλωση.',
          'Two-phase: PENDING → CONFIRMED (μέσω /confirm/).'
        ]
      },
      {
        name: 'ticket_type.py',
        folder: 'backend/core/services/',
        type: 'backend',
        summary: 'Business logic για TicketTypes (create, update, delete, reserve).',
        what: 'create_ticket_type (lock event, check capacity, status DRAFT/PUBLISHED), update_ticket_type (quantity ≥ reserved), delete_ticket_type (no non-PENDING bookings), reserve_tickets.',
        why: 'Το select_for_update είναι κρίσιμο — δύο ταυτόχρονες κρατήσεις δεν πρέπει να πουλήσουν το ίδιο εισιτήριο.',
        keyPoints: [
          'CapacityExceededError, ReservedTicketsError, EventNotEditableError.',
          'Δεν διαγράφεται ticket type αν υπάρχουν CONFIRMED bookings.',
          'Ένα published event πρέπει να έχει ≥1 ticket type.'
        ]
      },
      {
        name: 'conv_mess.py',
        folder: 'backend/core/services/',
        type: 'backend',
        summary: 'Business logic για Conversations & Messages.',
        what: 'delete_conversation_for_organizer/attendee, delete_message_for_sender/receiver, send_message.',
        why: 'Soft delete + reactivation λογική. Αν και οι δύο διαγράψουν → hard delete.',
        keyPoints: [
          'select_for_update για αποφυγή race condition.',
          'send_message: αν deleted, «ξαναενεργοποιεί» τη συνομιλία.',
          'Bulk update των messages σε κάθε delete.'
        ]
      },
      {
        name: 'export.py',
        folder: 'backend/core/services/',
        type: 'backend',
        summary: 'Εξαγωγή εκδηλώσεων σε XML (κατά DTD) ή JSON.',
        what: 'EVENTS_DTD, get_exportable_events (φιλτράρει events χωρίς categories/ticket_types), build_events_data, events_to_xml, events_to_json.',
        why: 'Απαίτηση 12: εξαγωγή σε XML κατά DTD + JSON.',
        keyPoints: [
          'Φιλτράρει events χωρίς categories ή ticket_types — το DTD απαιτεί +.',
          'prefetch_related για performance.',
          'ensure_ascii=False → ελληνικά κανονικά (όχι \\uXXXX).',
          'Καθαρισμός invalid XML chars.'
        ]
      },
      {
        name: 'helper_recommendations.py',
        folder: 'backend/core/services/',
        type: 'backend',
        summary: 'Υλοποίηση Biased Matrix Factorization από το μηδέν.',
        what: 'Rating scale (5.0/3.0/1.0), load_dataset_ratings (CSV → S), build_interactions (από EventView + Booking), class BiasedMF (fit, predict, rmse_on).',
        why: 'Απαίτηση 13: αλγόριθμος σύστασης BiasedMF χωρίς έτοιμη βιβλιοθήκη.',
        keyPoints: [
          'X̂ = μ + b[i] + c[j] + V[i]·F[j].',
          'SGD: b,c,V,F updates με regularization.',
          'Early stopping με PATIENCE=2 epochs.',
          'View rating: min(3.0, 1.5 + 0.5 * view_count).',
          'Booking → 5.0 (υπερισχύει view).'
        ]
      },
      {
        name: 'recommendations.py',
        folder: 'backend/core/services/',
        type: 'backend',
        summary: 'Cache + live model για recommendations.',
        what: '_fingerprint (count + last viewed/created), get_model (TTL 10 λεπτά + lock), rank_event_ids (sort by -predict, tie-break).',
        why: 'Το MF training είναι αργό — δεν γίνεται σε κάθε request. Cache invalidation μέσω fingerprint.',
        keyPoints: [
          'CACHE_TTL = 10 λεπτά.',
          'Fingerprint αλλάζει όταν αλλάξουν views ή bookings.',
          'threading.Lock για thread-safety.'
        ]
      }
    ]
  },

  // ==========================================================
  // BACKEND — VIEWS
  // ==========================================================
  {
    id: 'backend-views',
    title: 'Backend — Views (ViewSets)',
    icon: '🌐',
    files: [
      {
        name: 'auth.py',
        folder: 'backend/core/views/',
        type: 'backend',
        summary: 'Authentication views: register, login, refresh, me.',
        what: 'RegisterView (AllowAny), CustomTokenObtainPairView (έλεγχος approval_status), CustomTokenRefreshView (ξανά έλεγχος), MeView (RetrieveUpdateAPIView).',
        why: 'Ο admin μπορεί να απορρίψει τον χρήστη μετά την έκδοση token — άρα χρειάζεται έλεγχος και στο refresh.',
        keyPoints: [
          'Το login επιστρέφει access (10min) + refresh (1day).',
          'Custom serializer: αν PENDING/REJECTED → error.',
          'update_last_login μετά το login.'
        ]
      },
      {
        name: 'event.py',
        folder: 'backend/core/views/',
        type: 'backend',
        summary: 'EventViewSet — list/retrieve/create/update/destroy + actions.',
        what: 'get_queryset ανά role, get_serializer_class ανά action, get_permissions ανά action, perform_create/update μέσω services, publish/cancel/add_photo/delete_photo/recommendations actions.',
        why: 'Ο πυρήνας του API. Διαφορετικά permissions/serializers ανά action — αυτό είναι DRF best practice.',
        keyPoints: [
          'retrieve: αυξάνει view_count με cooldown 30s.',
          'destroy: δεν επιτρέπεται αν έχει bookings.',
          'publish: DRAFT → PUBLISHED με validation.',
          'cancel: PUBLISHED → CANCELLED + send_message σε όλους τους attendees.',
          'recommendations: Case/When annotate για σωστή pagination.'
        ]
      },
      {
        name: 'booking.py',
        folder: 'backend/core/views/',
        type: 'backend',
        summary: 'BookingViewSet — create/confirm only.',
        what: 'get_queryset από service, get_permissions ανά action, confirm action, me action, update/partial_update/destroy → 405.',
        why: 'Οι κρατήσεις δεν αλλάζουν/ακυρώνονται από τον χρήστη (απαίτηση 9).',
        keyPoints: [
          'confirm: καλεί confirm_booking service.',
          'update/destroy: 405 Method Not Allowed.',
          '/me/: οι κρατήσεις του τρέχοντος χρήστη.'
        ]
      },
      {
        name: 'ticket_type.py',
        folder: 'backend/core/views/',
        type: 'backend',
        summary: 'TicketTypeViewSet — CRUD + bulk_create.',
        what: 'get_permissions (AllowAny list/retrieve, IsApprovedUser+Owner create/update/delete), get_serializer_context (event από URL/body), bulk_create (transaction, all-or-nothing).',
        why: 'Το bulk endpoint επιτρέπει δημιουργία πολλών ticket types σε μία κλήση (κατά τη δημιουργία event).',
        keyPoints: [
          'bulk_create: transaction.atomic + set_rollback(True) αν κάποιο αποτύχει.',
          'Το event διαβάζεται από context (URL/body).'
        ]
      },
      {
        name: 'category.py',
        folder: 'backend/core/views/',
        type: 'backend',
        summary: 'CategoryViewSet — read για όλους, write μόνο admin.',
        what: 'IsAdminOrReadOnly permission, lookup_field="slug".',
        why: 'Οι κατηγορίες είναι σχετικά σταθερές — δεν αλλάζουν συχνά.',
        keyPoints: ['Το URL χρησιμοποιεί slug αντί για pk.']
      },
      {
        name: 'conversation.py',
        folder: 'backend/core/views/',
        type: 'backend',
        summary: 'ConversationViewSet — get/post/delete + mark_read.',
        what: 'get_queryset με annotate has_unread_flag (Exists), destroy με soft delete, mark_read action.',
        why: 'Το annotate αποφεύγει N+1 query — το serializer διαβάζει το flag αντί να ρωτάει τη βάση για κάθε conversation.',
        keyPoints: [
          'http_method_names: όχι PUT/PATCH — οι συνομιλίες δεν αλλάζουν.',
          'destroy: delete_conversation_for_organizer/attendee ανά role.'
        ]
      },
      {
        name: 'message.py',
        folder: 'backend/core/views/',
        type: 'backend',
        summary: 'MessageViewSet — get/post/delete + inbox/sent/unread_summary.',
        what: 'get_queryset filter, retrieve → mark_as_read, destroy soft delete, inbox/sent/unread_summary actions.',
        why: 'Το inbox/sent ξεχωριστά ταιριάζει με την απαίτηση 10 (inbox/sent καταλόγους).',
        keyPoints: [
          'unread_summary → μόνο count, ελαφρύ για polling.',
          'retrieve: αν receiver, mark_as_read.'
        ]
      },
      {
        name: 'admin.py',
        folder: 'backend/core/views/',
        type: 'backend',
        summary: 'Admin-only views: UserAdminViewSet + EventExportView.',
        what: 'UserAdminViewSet (ReadOnly, approve/reject actions), EventExportView (APIView, XML/JSON με Content-Disposition).',
        why: 'Απαιτήσεις 4 και 12: διαχείριση χρηστών + export.',
        keyPoints: [
          'approve/reject: αλλάζουν approval_status.',
          'EventExportView: ?organizer=ID ή ?event=ID.',
          'Content-Disposition header για download.'
        ]
      }
    ]
  },

  // ==========================================================
  // BACKEND — MIGRATIONS
  // ==========================================================
  {
    id: 'backend-migrations',
    title: 'Backend — Migrations',
    icon: '📦',
    files: [
      {
        name: '0001_initial.py',
        folder: 'backend/core/migrations/',
        type: 'backend',
        summary: 'Η αρχική migration — δημιουργεί ΟΛΑ τα models + constraints + indexes.',
        what: 'User, Event, Category, TicketType, Booking, Conversation, Message, EventPhoto, EventView + όλα τα constraints.',
        why: 'Το schema της βάσης παράγεται από αυτό. Περιέχει indexes, unique constraints, check constraints.',
        keyPoints: [
          'UniqueConstraint(Lower("email"), name="uniq_user_email_ci").',
          'CheckConstraint(end_datetime > start_datetime).',
          'CheckConstraint(reserved ≤ quantity).',
          'UniqueConstraint(event, ticket_type_id).',
          'Indexes για performance (status+start, city+start).'
        ]
      },
      {
        name: '0002_seed_categories.py',
        folder: 'backend/core/migrations/',
        type: 'backend',
        summary: 'Data migration — σπέρνει 10 default κατηγορίες.',
        what: 'Music, Theater, Sports, Conference, Seminar, Arts & Culture, Technology, Food & Drink, Community, Charity.',
        why: 'Για να μην ξεκινά η εφαρμογή με κενή λίστα κατηγοριών — ο organizer πρέπει να επιλέξει από κάπου.',
        keyPoints: [
          'RunPython με reverse_code για rollback.',
          'slugify(name, allow_unicode=True).'
        ]
      },
      {
        name: '0003_seed_admin.py',
        folder: 'backend/core/migrations/',
        type: 'backend',
        summary: 'Data migration — δημιουργεί τον built-in admin.',
        what: 'Διαβάζει ADMIN_USERNAME/EMAIL/PASSWORD από env. make_password γιατί το historical model δεν έχει custom manager.',
        why: 'Απαίτηση 3: built-in admin χωρίς manual setup.',
        keyPoints: [
          'is_staff=True, is_superuser=True, approval_status=APPROVED.',
          'Fallbacks αν λείπουν env vars.'
        ]
      },
      {
        name: '0004_alter_eventphoto_image.py',
        folder: 'backend/core/migrations/',
        type: 'backend',
        summary: 'Αλλάζει το upload_to του EventPhoto σε custom function.',
        what: 'Από events/%Y/%m/ σε event_photo_path (events/EV0001/xxx.jpg).',
        why: 'Ομαδοποίηση φωτογραφιών ανά event — πιο οργανωμένος φάκελος media/.',
        keyPoints: ['Καθαρά migration, χωρίς data changes.']
      },
      {
        name: '0005_add_other_category.py',
        folder: 'backend/core/migrations/',
        type: 'backend',
        summary: 'Προσθέτει την κατηγορία "Other" (catch-all).',
        what: 'get_or_create — αν ο admin το έχει φτιάξει, δεν το διπλασιάζει.',
        why: 'Για events που δεν ταιριάζουν σε καμία από τις 10 default.',
        keyPoints: ['Reverse: delete μόνο αν events__isnull=True.']
      }
    ]
  },

  // ==========================================================
  // BACKEND — MANAGEMENT COMMANDS
  // ==========================================================
  {
    id: 'backend-commands',
    title: 'Backend — Management Commands',
    icon: '🎯',
    files: [
      {
        name: 'evaluate_recommender.py',
        folder: 'backend/core/management/commands/',
        type: 'backend',
        summary: 'CLI command για αξιολόγηση του recommender στο e-class dataset.',
        what: 'MAE, RMSE, Precision@K, Recall@K, l-fold cross-validation, --tune για grid search.',
        why: 'Απαίτηση 13: να μετρηθεί η απόδοση του αλγορίθμου στο dataset.',
        keyPoints: [
          'python manage.py evaluate_recommender [--tune].',
          'Cross-validation με 5 folds.',
          'Baseline RMSE: πρόβλεψη μ για κάθε ζεύγος.',
          'Αποτελέσματα: MAE=0.778, RMSE=0.9273, Precision@5=0.0126.'
        ]
      }
    ]
  },

  // ==========================================================
  // SCRIPTS & DATA
  // ==========================================================
  {
    id: 'scripts',
    title: 'Scripts & Data',
    icon: '📜',
    files: [
      {
        name: 'make_certs.sh',
        folder: 'scripts/',
        type: 'script',
        summary: 'Δημιουργεί self-signed TLS πιστοποιητικό για localhost.',
        what: 'openssl req -x509 -newkey rsa:2048 -nodes -days 365 -addext "subjectAltName=DNS:localhost,DNS:127.0.0.1,IP:127.0.0.1".',
        why: 'Η εκφώνηση απαιτεί SSL/TLS. Τοπικά χρειάζεται self-signed. Χωρίς SAN, ο browser βγάζει NET::ERR_CERT_COMMON_NAME_INVALID.',
        keyPoints: [
          '-nodes = χωρίς passphrase (αλλιώς ο server ζητά κωδικό).',
          'SAN: DNS:localhost, DNS:127.0.0.1, IP:127.0.0.1.',
          'Δημιουργεί certs/localhost.pem + certs/localhost-key.pem.'
        ]
      },
      {
        name: 'install_requirements.sh',
        folder: 'scripts/',
        type: 'script',
        summary: 'One-shot setup: venv + pip + npm + certs.',
        what: 'set -e (exit on error), δημιουργεί venv, εγκαθιστά requirements.txt, npm install, καλεί make_certs.sh.',
        why: 'Αυτοματοποιεί το setup — ο καθηγητής τρέχει ένα script.',
        keyPoints: [
          'set -e = σταματά αν κάτι αποτύχει.',
          'cd "$(dirname "$0")/.." = root ανεξάρτητα από working dir.',
          'Καλεί venv/bin/pip απευθείας (χωρίς activate).'
        ]
      },
      {
        name: 'event_interest.csv',
        folder: 'rel_event_csvs/',
        type: 'script',
        summary: 'Dataset από e-class για τον recommender.',
        what: 'user, event, invited, timestamp, interested, not_interested. 13.983 ratings από 1.970 users × 8.119 events (0.087% dense).',
        why: 'Απαίτηση 13: ground truth για offline αξιολόγηση.',
        keyPoints: [
          'interested=1 → 5.0, not_interested=1 → 1.0, και τα δύο 0 → 3.0.',
          'Χρησιμοποιείται ΜΟΝΟ για αξιολόγηση — το live μοντέλο εκπαιδεύεται σε live δεδομένα.',
          'Ο κώδικας προσπερνά rows με κενό event (try/except).'
        ]
      }
    ]
  },

  // ==========================================================
  // FRONTEND — ROOT
  // ==========================================================
  {
    id: 'frontend-root',
    title: 'Frontend — Root',
    icon: '⚛️',
    files: [
      {
        name: 'README.md',
        folder: 'frontend/',
        type: 'frontend',
        summary: 'Τεκμηρίωση setup του frontend.',
        what: 'Template Vite + ελληνικό κείμενο για δημιουργία project, τεχνολογίες, dependencies, εντολές εκκίνησης.',
        why: 'Μέρος των οδηγιών παράδοσης (απαίτηση εκφώνησης σελίδα 7).',
        keyPoints: [
          'React + Vite + React Router DOM + Axios + MUI + Leaflet + React Datepicker.',
          'npm create vite@latest . -- --template react.'
        ]
      },
      {
        name: '.env.example',
        folder: 'frontend/',
        type: 'frontend',
        summary: 'Template για VITE_API_URL.',
        what: 'VITE_API_URL=https://localhost:8000/api.',
        why: 'Το Vite εκθέτει μόνο μεταβλητές με prefix VITE_ στο client-side code.',
        keyPoints: [
          'security by design — δεν διαρρέουν server-side secrets.',
          'HTTPS για συμβατότητα με backend TLS.'
        ]
      },
      {
        name: 'package.json',
        folder: 'frontend/',
        type: 'frontend',
        summary: 'Manifest του Node project — scripts + dependencies.',
        what: 'dependencies (react, axios, mui, leaflet, react-datepicker), devDependencies (vite, eslint, plugins), scripts (dev, build, lint, preview).',
        why: 'Δηλώνει τι χρειάζεται το project για να τρέξει.',
        keyPoints: [
          '"type": "module" → ES Modules.',
          '"private": true → δεν δημοσιεύεται στο npm.',
          'Διαχωρισμός dependencies / devDependencies.'
        ]
      },
      {
        name: 'package-lock.json',
        folder: 'frontend/',
        type: 'frontend',
        summary: 'Lockfile — exact versions + integrity hashes.',
        what: 'Για κάθε πακέτο: version, resolved URL, integrity (SHA-512), dependencies.',
        why: 'Reproducibility — με npm ci εγκαθίστανται ΑΚΡΙΒΩΣ οι ίδιες εκδόσεις.',
        keyPoints: [
          'Πρέπει να ανεβαίνει στο git (όχι το node_modules/).',
          'Το integrity ανιχνεύει tampered packages.',
          'Vite 8 χρησιμοποιεί Rolldown (Rust-based bundler).'
        ]
      },
      {
        name: 'vite.config.js',
        folder: 'frontend/',
        type: 'frontend',
        summary: 'Configuration του Vite dev server.',
        what: 'plugin-react, server.port=5173, strictPort=true, https με certs.',
        why: 'HTTPS απαραίτητο για TLS-only cookies + mixed content.',
        keyPoints: [
          'strictPort: αν 5173 είναι πιασμένη → fail (για CORS).',
          'Διαβάζει ../certs/localhost.pem + -key.pem.',
          'node:fs prefix (modern).'
        ]
      },
      {
        name: 'eslint.config.js',
        folder: 'frontend/',
        type: 'frontend',
        summary: 'Static analysis rules (flat config, ESLint v9+).',
        what: 'js.configs.recommended, react-hooks, react-refresh, globals.browser.',
        why: 'Πιάνει bugs πριν το runtime (unused vars, hooks rules).',
        keyPoints: [
          'react-hooks: επιβάλλει rules-of-hooks + exhaustive-deps.',
          'globalIgnores(["dist"]).',
          'ecmaFeatures.jsx = true.'
        ]
      },
      {
        name: 'index.html',
        folder: 'frontend/',
        type: 'frontend',
        summary: 'SPA entry HTML — το μόνο HTML.',
        what: '<div id="root"></div> + <script type="module" src="/src/main.jsx">.',
        why: 'SPA: όλα τα components mount εδώ. Δεν υπάρχει server-side rendering.',
        keyPoints: [
          'Μεταβλητή charset=UTF-8 (ελληνικά).',
          'viewport για responsive.',
          'Favicon /logo.png.'
        ]
      }
    ]
  },

  // ==========================================================
  // FRONTEND — src/
  // ==========================================================
  {
    id: 'frontend-src',
    title: 'Frontend — src/',
    icon: '📂',
    files: [
      {
        name: 'main.jsx',
        folder: 'frontend/src/',
        type: 'frontend',
        summary: 'React entry point — mount του App στο #root.',
        what: 'ReactDOM.createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>).',
        why: 'Το πρώτο JS αρχείο που εκτελείται. React 18+ API (createRoot).',
        keyPoints: [
          'StrictMode: dev-only, αποκαλύπτει side effects.',
          'Δεν επηρεάζει production.',
          'Import App.css για global styles.'
        ]
      },
      {
        name: 'App.jsx',
        folder: 'frontend/src/',
        type: 'frontend',
        summary: 'Root component — routing + layout.',
        what: 'AuthProvider, Router, PageTitle (browser tab), Routes (Welcome fullscreen, άλλα με Navbar/Footer), RequireRole wrappers.',
        why: 'Ορίζει ΟΛΟ το routing της εφαρμογής.',
        keyPoints: [
          'Nested Routes: / fullscreen, * με Navbar/Footer.',
          'RequireRole roles=["USER"] για protected.',
          'PageTitle: dynamic document.title ανά path/tab.',
          'Admin → /profile?tab=users μετά login.'
        ]
      },
      {
        name: 'App.css',
        folder: 'frontend/src/',
        type: 'frontend',
        summary: 'Global styles + responsive breakpoints.',
        what: 'CSS reset, dark theme, custom scrollbar, .container, .section-title, @keyframes, sticky footer layout.',
        why: 'Global πράγματα (reset, theme, typography) σε ένα σημείο.',
        keyPoints: [
          'box-sizing: border-box παντού.',
          'rem-based scaling με media queries (1400, 992, 768, 480, 360).',
          '#root { display: flex; flex-direction: column; } για sticky footer.',
          'overflow-x: hidden στο body.'
        ]
      }
    ]
  },

  // ==========================================================
  // FRONTEND — CONTEXT
  // ==========================================================
  {
    id: 'frontend-context',
    title: 'Frontend — Context',
    icon: '🔐',
    files: [
      {
        name: 'AuthContext.jsx',
        folder: 'frontend/src/context/',
        type: 'frontend',
        summary: 'Global auth state — user, login, register, logout.',
        what: 'useState(user, loading, isAuthenticated), useEffect restore από sessionStorage, useEffect auth-expired listener, login/register/logout functions.',
        why: 'Αποφεύγει prop drilling — όλα τα components διαβάζουν το useAuth() context.',
        keyPoints: [
          'Lazy initializer στο loading: !!sessionStorage.getItem("access_token").',
          'Restore user μέσω /auth/me/ on mount.',
          'Custom event auth-expired → clear state.',
          'login returns {success, user/error} αντί για throwing.',
          'Defensive useAuth: throw αν εκτός Provider.'
        ]
      }
    ]
  },

  // ==========================================================
  // FRONTEND — SERVICES
  // ==========================================================
  {
    id: 'frontend-services',
    title: 'Frontend — Services',
    icon: '🔌',
    files: [
      {
        name: 'client.js',
        folder: 'frontend/src/services/',
        type: 'frontend',
        summary: 'Axios instance + JWT interceptors + auto-refresh.',
        what: 'Request interceptor (Authorization: Bearer), Response interceptor (401 → refresh → retry, single-flight), error message normalization.',
        why: 'Κεντρική διαχείριση auth + errors — οι κλήσεις δεν χρειάζεται να τα ξέρουν.',
        keyPoints: [
          'Single-flight refresh: μία refresh promise για πολλά 401.',
          'Raw axios για το refresh (όχι api) — αποφεύγει infinite loop.',
          'window.dispatchEvent("auth-expired") σε λήξη refresh.',
          'errorMessage(): ομαλοποιεί DRF errors σε ένα string.'
        ]
      },
      {
        name: 'helpers.js',
        folder: 'frontend/src/services/',
        type: 'frontend',
        summary: 'Βοηθητικές συναρτήσεις (pagination, sync, upload).',
        what: 'fetchAll (ακολουθεί next link), resolveCategoryIds (names → IDs), uploadEventPhotos (FormData), syncTicketTypes (diff-based), syncEventPhotos.',
        why: 'Το API είναι paginated + έχει ξεχωριστά endpoints για tickets/photos. Τα helpers κάνουν τη σύνθεση.',
        keyPoints: [
          'syncTicketTypes: DELETE / UPDATE / CREATE με sort κατά diff (μειώσεις πρώτα).',
          'uploadEventPhotos: sequential (για σωστό order).',
          'next link override baseURL — δουλεύει κανονικά.'
        ]
      },
      {
        name: 'api.js',
        folder: 'frontend/src/services/',
        type: 'frontend',
        summary: 'Service layer — όλα τα API calls ομαδοποιημένα.',
        what: 'authService, eventService, categoryService, bookingService, messageService, userService.',
        why: 'Μία πηγή αλήθειας για τα endpoints. Οι pages δεν ξέρουν URLs.',
        keyPoints: [
          'createBooking: POST /bookings/ + POST /bookings/{id}/confirm/.',
          'createEvent: rollback με delete αν αποτύχει ticket/photos creation.',
          'updateEvent: capacity up/down logic (order-dependent).',
          'exportEvents: responseType="text" για XML/JSON.'
        ]
      }
    ]
  },

  // ==========================================================
  // FRONTEND — COMPONENTS
  // ==========================================================
  {
    id: 'frontend-components',
    title: 'Frontend — Components',
    icon: '🧩',
    files: [
      {
        name: 'BookTicket.jsx/.css',
        folder: 'frontend/src/components/',
        type: 'frontend',
        summary: 'Modal επιλογής τύπου + ποσότητας εισιτηρίων.',
        what: 'State: selectedTicket, quantity. Auto-select 1ου διαθέσιμου. Ticket color map. Navigate σε /booking?ticketId=&quantity=.',
        why: 'Ξεχωριστό βήμα πριν το booking — καλύτερο UX από inline form.',
        keyPoints: [
          'Δύο early returns: null αν κλειστό, null αν μη bookable.',
          'Modal overlay + stopPropagation.',
          'Query params → shareable, refresh-safe.',
          'Radius 20px με clip-path για tickets.'
        ]
      },
      {
        name: 'RequireRole.jsx',
        folder: 'frontend/src/components/',
        type: 'frontend',
        summary: 'Route guard για role-based access.',
        what: 'Loading state, isAuthenticated check, admin bypass, roles.includes(userRole).',
        why: 'DRY: αντί για if(!user) σε κάθε page.',
        keyPoints: [
          'Loading state αποτρέπει race condition (redirect πριν φορτώσει /auth/me/).',
          '<Navigate replace> — δεν λερώνει history.',
          'Admin περνάει παντού (bypass).',
          '3 roles: Guest (redirect), User, Admin.'
        ]
      },
      {
        name: 'common/index.js',
        folder: 'frontend/src/components/common/',
        type: 'frontend',
        summary: 'Barrel file — συγκεντρώνει exports.',
        what: 'export { Navbar, Footer, LoadingSpinner }.',
        why: 'Καθαρότερα imports: import { Navbar } from "./components/common".',
        keyPoints: ['Pattern, όχι απαίτηση.']
      },
      {
        name: 'LoadingSpinner.jsx/.css',
        folder: 'frontend/src/components/common/',
        type: 'frontend',
        summary: 'Ενιαίος spinner φόρτωσης.',
        what: 'Props: message (default "Loading..."), fullHeight. AutorenewIcon με animation.',
        why: 'Centralized loading UI — αποφεύγει duplication.',
        keyPoints: [
          'fullHeight: min-height calc(100vh - navbar - footer).',
          'AutorenewIcon από MUI, spin 1.5s.',
          'message="" για no text.'
        ]
      },
      {
        name: 'Navbar.jsx/.css',
        folder: 'frontend/src/components/common/',
        type: 'frontend',
        summary: 'Top navigation — logo, links, profile, unread badge.',
        what: 'Three useEffects: fetch unread, polling 20s, listen "unread-changed". Conditional rendering ανά role. Profile avatar με initials + badge.',
        why: 'Κύρια πλοήγηση. Διαφορετικά links ανά role.',
        keyPoints: [
          'Polling + custom event (hybrid real-time χωρίς WebSockets).',
          'cleanup: clearInterval, removeEventListener.',
          'NavLink isActive callback για styling.',
          'isAdmin → profileTarget = "/profile?tab=users".',
          'Logout: window.location.href = "/" (full reload).'
        ]
      },
      {
        name: 'Footer.jsx/.css',
        folder: 'frontend/src/components/common/',
        type: 'frontend',
        summary: 'Υποσέλιδο — copyright.',
        what: '<footer> με © 2026 EventHub.',
        why: 'Sticky footer μέσω flex layout.',
        keyPoints: ['margin-top: auto μέσα σε flex column.']
      }
    ]
  },

  // ==========================================================
  // FRONTEND — PUBLIC PAGES
  // ==========================================================
  {
    id: 'frontend-pages-public',
    title: 'Frontend — Public Pages',
    icon: '🏠',
    files: [
      {
        name: 'WelcomePage.jsx/.css',
        folder: 'frontend/src/pages/',
        type: 'frontend',
        summary: 'Fullscreen splash — απαίτηση 1.',
        what: '4 animated orbs, watermark logo, 3 CTAs (Sign Up / Log In / click anywhere), keyboard support (Enter/Space).',
        why: 'Welcome page με δυνατότητα εγγραφής/εισόδου, όπως ζητά η εκφώνηση.',
        keyPoints: [
          'isLeaving state + 400ms delay για fade-out.',
          'e.stopPropagation() στα buttons.',
          'role="button" + tabIndex={0} + aria-label (accessibility).',
          'Orbs με διαφορετικά durations (18-26s) — no sync.'
        ]
      },
      {
        name: 'HomePage.jsx/.css',
        folder: 'frontend/src/pages/',
        type: 'frontend',
        summary: 'Landing page — hero search + categories + events grid.',
        what: 'Hero με search (category/region/date), categories bar (tabs), events grid (5 columns desktop), See All link.',
        why: 'Κύρια είσοδος για τον επισκέπτη.',
        keyPoints: [
          'Navigate στο /events?category=&region=&dateFrom=&dateTo= για search.',
          'padStart(2, "0") για zero-padded dates.',
          'Availability: limited αν ≤10 ή <20%.',
          'Grid: 5 cols → 4 → 3 → 2 → 1 (responsive).'
        ]
      }
    ]
  },

  // ==========================================================
  // FRONTEND — AUTH PAGES
  // ==========================================================
  {
    id: 'frontend-pages-auth',
    title: 'Frontend — Auth Pages',
    icon: '🔑',
    files: [
      {
        name: 'SignIn.jsx',
        folder: 'frontend/src/pages/auth/',
        type: 'frontend',
        summary: 'Φόρμα σύνδεσης.',
        what: 'useState username/password, login μέσω AuthContext, admin → /profile?tab=users, user → /homepage.',
        why: 'Απαίτηση 1: δυνατότητα εισόδου με username + password.',
        keyPoints: [
          'finally για cleanup του loading.',
          'disabled={loading} σε inputs.',
          'Inline error αντί alert.'
        ]
      },
      {
        name: 'SignUp.jsx',
        folder: 'frontend/src/pages/auth/',
        type: 'frontend',
        summary: 'Φόρμα εγγραφής με live password validation.',
        what: 'useMemo passwordChecks (length, english, letter, number, symbol), input sanitization (phone/afm digits only), lat/lon pair.',
        why: 'Απαίτηση 2: στοιχεία εγγραφής + validation + κατάσταση PENDING.',
        keyPoints: [
          'Live requirements box — εμφανίζεται όταν αρχίζει να γράφει και είναι invalid.',
          'delete latitude/longitude αν κενά.',
          'setTimeout 2000ms → /homepage μετά success.',
          'DRF field errors → multiline string.'
        ]
      },
      {
        name: 'auth.css',
        folder: 'frontend/src/pages/auth/',
        type: 'frontend',
        summary: 'Shared styles για SignIn + SignUp.',
        what: '.login-card (500px) / .signup-card (560px), .auth-form-row (2 columns), .pwd-requirements.',
        why: 'Και οι δύο φόρμες μοιράζονται design.',
        keyPoints: [
          'Responsive: 2 columns → 1 column σε <640px.',
          'pwd-req.ok: πράσινο χρώμα.'
        ]
      }
    ]
  },

  // ==========================================================
  // FRONTEND — EVENTS PAGES
  // ==========================================================
  {
    id: 'frontend-pages-events',
    title: 'Frontend — Events Pages',
    icon: '🎫',
    files: [
      {
        name: 'EventsPage.jsx/.css',
        folder: 'frontend/src/pages/events/',
        type: 'frontend',
        summary: 'Λίστα events + drawer + server-side filtering + pagination.',
        what: 'URL sync (useSearchParams), draft filters (drawer), 30/page pagination, active filter chips, server-side filtering.',
        why: 'Απαίτηση 8: αναζήτηση με κατηγορία/τίτλο/περιγραφή/χρονικό διάστημα/τιμή/τοποθεσία + pagination.',
        keyPoints: [
          'toDateString manual (όχι toISOString — local time).',
          'region → city param mapping.',
          'Draft state vs applied state.',
          'Pagination: sliding window 5 pages + "..." dots.',
          'Date range: start_after=T00:00:00, start_before=T23:59:59.'
        ]
      },
      {
        name: 'EventDetails.jsx/.css',
        folder: 'frontend/src/pages/events/',
        type: 'frontend',
        summary: 'Detail + carousel + Leaflet map + tabs + booking modal.',
        what: 'Image carousel (circular), Leaflet map με marker, tabs (description/organizer/tickets), BookTicket modal, view_count tracking.',
        why: 'Απαίτηση 9: αναλυτικά στοιχεία + χάρτης OpenStreetMap + κράτηση.',
        keyPoints: [
          'Leaflet icon fix (import + L.icon + Marker.prototype.options.icon).',
          'useEffect cleanup για map.remove().',
          'setTimeout 100ms + invalidateSize 200ms.',
          'canBook(): status=PUBLISHED, available_capacity>0, end>now, per-ticket availability.',
          'getBookingBlockReason: γιατί δεν μπορεί να κάνει κράτηση.'
        ]
      },
      {
        name: 'RecommendationsPage.jsx/.css',
        folder: 'frontend/src/pages/events/',
        type: 'frontend',
        summary: 'Ίδιο με EventsPage αλλά χρησιμοποιεί /events/recommendations/.',
        what: 'Δεν έχει search bar (μόνο filters). Custom subtitle + icon. Empty state με hint.',
        why: 'Απαίτηση 13: σύστημα συστάσεων BiasedMF.',
        keyPoints: [
          'getRecommendations(params) αντί getEvents.',
          'Δύο διαφορετικά empty messages (φίλτρα vs no data).',
          'Χρησιμοποιεί το EventsPage.css + override.'
        ]
      },
      {
        name: 'BookingPage.jsx/.css',
        folder: 'frontend/src/pages/events/',
        type: 'frontend',
        summary: 'Ολοκλήρωση κράτησης — 2 στάδια (confirm + success).',
        what: 'LocalStorage persistence (10min TTL), auth redirect με save, multi-stage validation, window.confirm με όλα τα στοιχεία, auto-redirect σε 3s.',
        why: 'Απαίτηση 9: υποχρεωτική επιβεβαίωση + έλεγχοι διαθεσιμότητας.',
        keyPoints: [
          'getBookingData: από query params ή localStorage (TTL 10min).',
          'Αν δεν είναι authenticated: save + navigate /signin.',
          'window.confirm με event/ticket/qty/total + "cannot be undone".',
          'createBooking = POST + POST /confirm/.',
          'Success: CheckCircleIcon + animation + /profile?tab=bookings.'
        ]
      }
    ]
  },

  // ==========================================================
  // FRONTEND — PROFILE PAGES
  // ==========================================================
  {
    id: 'frontend-pages-profile',
    title: 'Frontend — Profile Pages',
    icon: '👤',
    files: [
      {
        name: 'ProfilePage.jsx/.css',
        folder: 'frontend/src/pages/profile/',
        type: 'frontend',
        summary: 'Dispatcher: AdminDashboard vs UserDashboard.',
        what: 'user?.is_staff ? <AdminDashboard/> : <UserDashboard/>.',
        why: 'Μία απόφαση σε ένα σημείο.',
        keyPoints: ['Minimal CSS — wrapper + loading spinner.']
      },
      {
        name: 'UserDashboard.jsx',
        folder: 'frontend/src/pages/profile/',
        type: 'frontend',
        summary: '5 tabs: Personal, Messages, My Bookings, My Events, Reservations.',
        what: 'URL sync (?tab=), messaging state (πολλά vars), custom event dispatch, PersonalInfoTab + MessagesLayout components.',
        why: 'Ο κεντρικός χώρος εργασίας του χρήστη.',
        keyPoints: [
          'Custom event "unread-changed" → Navbar badge update άμεσα.',
          'handleOpenMessage: mark_read + fetch thread + optimistic update.',
          'Delete conversation: warning για soft delete.',
          'Nested components στο ίδιο αρχείο (co-located).'
        ]
      },
      {
        name: 'EditProfile.jsx/.css',
        folder: 'frontend/src/pages/profile/',
        type: 'frontend',
        summary: 'Φόρμα επεξεργασίας + password change.',
        what: 'Robust field extraction (multiple fallbacks), conditional password validation, lat/lon pair check, optimistic update.',
        why: 'Απαίτηση: επεξεργασία στοιχείων χρήστη.',
        keyPoints: [
          'isChangingPassword: μόνο αν password.length > 0.',
          'Αλλαγή password: current + new + confirm + valid.',
          'lat/lon pair: και τα δύο ή κανένα.',
          'updateData.latitude = null (όχι undefined) — καθαρίζει το πεδίο.',
          'setUser(prev => ({...prev, ...response.data})) → ενημέρωση context.'
        ]
      },
      {
        name: 'common/Dashboard.css',
        folder: 'frontend/src/pages/profile/common/',
        type: 'frontend',
        summary: 'Shared styles για user + admin dashboards.',
        what: '.profile-tabs, .profile-tab.active::after, .dashboard-tab-badge, .profile-photo, .dashboard-info-row.',
        why: 'Και τα δύο dashboards μοιράζονται design.',
        keyPoints: ['.profile-photo: 180x180 κύκλος με initials.']
      },
      {
        name: 'common/MessagesPanel.css',
        folder: 'frontend/src/pages/profile/common/',
        type: 'frontend',
        summary: 'Chat-style messaging styles.',
        what: 'Grid layout με dynamic columns (.with-opened), chat bubbles (incoming/outgoing με asymmetric radius), folder sidebar.',
        why: 'Καλύπτει την απαίτηση 10 (inbox/sent + indication).',
        keyPoints: [
          '.msg-layout.with-opened → 3 columns με transition.',
          '.msg-bubble.outgoing: δεξιά, πράσινο.',
          '.msg-row.unread: μπλε αριστερό border.'
        ]
      },
      {
        name: 'common/NewMessage.jsx/.css',
        folder: 'frontend/src/pages/profile/common/',
        type: 'frontend',
        summary: 'Compose new message — με event ως context.',
        what: 'Options = bookings (προς organizer) + organized (προς attendee). Conditional attendee select. Warning banner αν κενό.',
        why: 'Απαίτηση 10: μήνυμα οργανωτή-συμμετέχοντα μετά από κράτηση.',
        keyPoints: [
          'Promise.all για δύο API calls.',
          'unique: μία entry ανά event.',
          'selected?.mine → attendee select εμφανίζεται.',
          'sendNewMessage: POST /conversations/ + POST /messages/.'
        ]
      },
      {
        name: 'participant/MyBookings.jsx/.css',
        folder: 'frontend/src/pages/profile/participant/',
        type: 'frontend',
        summary: 'Λίστα κρατήσεων του χρήστη με φίλτρα.',
        what: 'Client-side filter chips (All/Confirmed/Cancelled), card με icon + details + actions.',
        why: 'Ο χρήστης βλέπει τις κρατήσεις του.',
        keyPoints: [
          'Status left-border μέσω ::before pseudo-element.',
          'Action: View Event + Message organizer.',
          'Format date 24h, DD/MM/YYYY.'
        ]
      }
    ]
  },

  // ==========================================================
  // FRONTEND — ORGANIZER PAGES
  // ==========================================================
  {
    id: 'frontend-pages-organizer',
    title: 'Frontend — Organizer Pages',
    icon: '🎪',
    files: [
      {
        name: 'CreateEvent.jsx/.css',
        folder: 'frontend/src/pages/profile/organizer/',
        type: 'frontend',
        summary: '3-step wizard: Details → Tickets → Photos + Preview.',
        what: 'Stepper, split datetime (DatePicker + hour/minute dropdowns), category add/remove, ticket types με capacity live, photos upload, preview page, submit draft/publish.',
        why: 'Απαίτηση 7: δημιουργία εκδήλωσης με όλα τα πεδία του DTD.',
        keyPoints: [
          'blockTyping: μόνο navigation keys στο DatePicker.',
          'joinDateTime: `${date}T${hour}:${minute}` (ISO 8601).',
          'validateStep1/2/3 return string ή null.',
          'Preview mode: read-only view πριν submit.',
          'MAX_DESCRIPTION=4096, MAX_PHOTOS=20.'
        ]
      },
      {
        name: 'EditEvent.jsx',
        folder: 'frontend/src/pages/profile/organizer/',
        type: 'frontend',
        summary: 'Ίδιο με CreateEvent + load existing + diff sync.',
        what: 'loadEvent, splitDateTime, ticket types με pk + originalQuantity/originalAvailable, validateStep2 με booked check, payload με pk.',
        why: 'Απαίτηση 7: επεξεργασία υπάρχουσας εκδήλωσης.',
        keyPoints: [
          'Cannot reduce quantity below booked: `booked = original - available`.',
          'item.pk αν t.pk != null → syncTicketTypes κάνει UPDATE αντί CREATE.',
          'photoPayload με pk (existing) ή file (new).'
        ]
      },
      {
        name: 'MyEvents.jsx/.css',
        folder: 'frontend/src/pages/profile/organizer/',
        type: 'frontend',
        summary: 'Λίστα events με filters + bulk delete.',
        what: 'STATUS_ORDER sort, canDelete (total_booked=0), bulk delete με Promise.all, disabled checkboxes για μη-deletable.',
        why: 'Ο organizer διαχειρίζεται τα events του.',
        keyPoints: [
          'Primary sort: status, secondary: date.',
          'Two confirmation messages (με/χωρίς skipped).',
          'title attribute για tooltip "why disabled".'
        ]
      },
      {
        name: 'EventDetailsOrganizer.jsx/.css',
        folder: 'frontend/src/pages/profile/organizer/',
        type: 'frontend',
        summary: 'Detail + actions (edit/cancel/delete).',
        what: 'fetchData με Promise.all, handleDelete, cancel modal, canEdit/canCancel/canDelete logic.',
        why: 'Ο organizer βλέπει τι μπορεί να κάνει.',
        keyPoints: [
          'Δεν μπορεί να διαγράψει PUBLISHED με bookings.',
          'Cancel: modal με warning + auto-notification σε attendees.'
        ]
      },
      {
        name: 'Reservations.jsx/.css',
        folder: 'frontend/src/pages/profile/organizer/',
        type: 'frontend',
        summary: 'Λίστα events με count κρατήσεων.',
        what: 'Fetch organizer events + all bookings, grouping client-side, sort by day-release/name/reservations.',
        why: 'Ο organizer βλέπει ποιες εκδηλώσεις έχουν κρατήσεις.',
        keyPoints: [
          'Ένα request αντί N — grouping client-side.',
          'Μόνο non-CANCELLED μετρούν.'
        ]
      },
      {
        name: 'ReservationsDetails.jsx/.css',
        folder: 'frontend/src/pages/profile/organizer/',
        type: 'frontend',
        summary: 'Detail event + όλες οι κρατήσεις + modal ανά booking.',
        what: 'Section 1: event info 3 columns + tickets table. Section 2: reservations grid 3 columns. Modal με booking details.',
        why: 'Αναλυτική προβολή κρατήσεων.',
        keyPoints: [
          'getUserName: 3 fallbacks (full name → username → User #id).',
          'Ticket table: padStart(2, "0") για availability.',
          'Status-colored left border σε κάθε κάρτα.'
        ]
      }
    ]
  },

  // ==========================================================
  // FRONTEND — ADMIN PAGES
  // ==========================================================
  {
    id: 'frontend-pages-admin',
    title: 'Frontend — Admin Pages',
    icon: '🛡️',
    files: [
      {
        name: 'AdminDashboard.jsx',
        folder: 'frontend/src/pages/profile/admin/',
        type: 'frontend',
        summary: '4 tabs: Personal, Users, Events, Export.',
        what: 'URL sync, PersonalInfoTab (ίδιο με UserDashboard), conditional render των components.',
        why: 'Ξεχωριστό dashboard για admin (απαίτηση 4).',
        keyPoints: [
          'Two-way sync: URL ↔ state.',
          'PersonalInfoTab: co-located component.'
        ]
      },
      {
        name: 'UserManagement.jsx/.css',
        folder: 'frontend/src/pages/profile/admin/',
        type: 'frontend',
        summary: 'Λίστα χρηστών + approve/reject + export.',
        what: 'Filters (All/Pending/Approved/Rejected), search 4 fields, approve/reject με optimistic update, export XML/JSON αν APPROVED.',
        why: 'Απαίτηση 4: έγκριση/απόρριψη εγγραφών + πλοήγηση σε στοιχεία.',
        keyPoints: [
          'Approve/Reject μόνο σε PENDING.',
          'Optimistic update: setUsers + setSelectedUser.',
          'Export: μόνο για approved users.'
        ]
      },
      {
        name: 'AdminEvents.jsx/.css',
        folder: 'frontend/src/pages/profile/admin/',
        type: 'frontend',
        summary: 'Όλα τα events + admin actions (cancel/delete).',
        what: 'Filters, search, sort, lazy fetch bookings, cancel modal, delete.',
        why: 'Ο admin βλέπει ΟΛΑ τα events (bypass).',
        keyPoints: [
          'Race condition guard: cancelled flag σε fetchBookings.',
          'canDelete: DRAFT ή total_booked=0.',
          'canCancel: PUBLISHED.',
          'Cancel modal με activeBookingsCount.'
        ]
      },
      {
        name: 'ExportData.jsx',
        folder: 'frontend/src/pages/profile/admin/',
        type: 'frontend',
        summary: 'Export events σε XML/JSON με client-side filtering.',
        what: 'filterXmlByStatus (DOMParser + XMLSerializer), filterJsonByStatus, downloadFile helper, canExportEvent check.',
        why: 'Απαίτηση 12: εξαγωγή σε XML κατά DTD + JSON.',
        keyPoints: [
          'Regex για διαχωρισμό header/body XML.',
          'canExportEvent: έχει categories + min_price != null.',
          'downloadFile: Blob + URL.createObjectURL + revoke.'
        ]
      }
    ]
  }
];

// ============================================================
// RECOMMENDER — Ξεχωριστή εμπλουτισμένη ενότητα
// Πηγή: message.txt + Recommender Pipeline PDF + report.pdf κεφ. 6
// ============================================================

const RECOMMENDER_SECTION = {
  id: 'recommender',
  title: 'Recommender System — Deep Dive',
  icon: '🎯',
  subtitle: 'Biased Matrix Factorization — Από το μηδέν, βήμα προς βήμα',
  intro: 'Ο αλγόριθμος σύστασης (απαίτηση 13) υλοποιήθηκε εξ ολοκλήρου από το μηδέν, χωρίς έτοιμη βιβλιοθήκη ML. Προβλέπει τι βαθμολογία θα έδινε ένας χρήστης σε μια εκδήλωση και επιστρέφει τις top-K. Αυτή η ενότητα εξηγεί την pipeline σε 4 φάσεις (A, B, C, D) με όλα τα βήματα, τους τύπους, τα αποτελέσματα και τις edge cases.',

  // ---------- FORMULA ----------
  formula: {
    main: 'x̂_{uj}  =  μ  +  b_u  +  c_j  +  v_u · f_j',
    subtitle: 'Η πρόβλεψη αποτελείται από 4 όρους — τους 3 πρώτους τους λέμε baseline, τον 4ο taste term.',
    terms: [
      {
        symbol: 'μ',
        name: 'Global mean',
        desc: 'Η μέση βαθμολογία όλων των γνωστών ζευγαριών (user, event) στο S.',
        color: '#a0a0b8'
      },
      {
        symbol: 'b_u',
        name: 'User bias',
        desc: 'Πόσο πιο θετικός ή αρνητικός είναι ο χρήστης u σε σχέση με τον μέσο όρο. Ένας χρήστης που βάζει πάντα 4-5 έχει θετικό b_u.',
        color: '#4a90d9'
      },
      {
        symbol: 'c_j',
        name: 'Item bias',
        desc: 'Πόσο πιο δημοφιλής ή αντιδημοφιλής είναι η εκδήλωση j. Μια δημοφιλής συναυλία έχει θετικό c_j.',
        color: '#2ecc71'
      },
      {
        symbol: 'v_u · f_j',
        name: 'Taste term',
        desc: 'Το προσωπικό γούστο — το εσωτερικό γινόμενο των K latent factors του χρήστη και της εκδήλωσης. Είναι ο μόνος όρος που κάνει την εξατομίκευση.',
        color: '#a29bfe'
      }
    ]
  },

  // ---------- PHASE A ----------
  phaseA: {
    title: 'Phase A — Build το σύνολο γνωστών βαθμολογιών S',
    icon: '📊',
    steps: [
      {
        n: 1,
        title: 'Συλλογή αλληλεπιδράσεων',
        body: 'Μόνο ζεύγη όπου κάτι πραγματικά συνέβη. Δύο πηγές: το dataset του e-class και τα live δεδομένα της εφαρμογής.'
      },
      {
        n: 2,
        title: 'Indexing',
        body: 'Map user ids → 0..N-1 και event ids → 0..M-1. Έτσι τα V και F είναι απλές λίστες που indexάρονται με ακέραιο.'
      },
      {
        n: 3,
        title: 'Κατασκευή S',
        body: 'S = λίστα από (i, j, x_ij) triples. ΜΟΝΟ τα observed pairs μπαίνουν. Όλα τα άλλα μένουν ? — τα unknowns είναι αυτά που προβλέπουμε, ποτέ training rows.'
      }
    ],
    datasetRatings: {
      title: 'Από το event_interest.csv (e-class dataset)',
      rows: [
        { row: 'interested = 1', rating: '5.0', color: '#2ecc71' },
        { row: '0 / 0  (shown, no reaction)', rating: '2.0', color: '#6c7a89' },
        { row: 'not_interested = 1', rating: '1.0', color: '#e74c3c' }
      ]
    },
    liveRatings: {
      title: 'Από live signals της εφαρμογής',
      rows: [
        { signal: 'view_count views', rating: 'min(3.0, 1.5 + 0.5 × view_count)', example: '→ 2.0, 2.5, 3.0' },
        { signal: 'Booking PENDING', rating: '4.0', example: '' },
        { signal: 'Booking CONFIRMED', rating: '5.0', example: '' }
      ]
    },
    rules: [
      'Αν ο χρήστης και είδε και έκλεισε το ίδιο event → κρατάμε τη μεγαλύτερη βαθμολογία.',
      'Cancelled bookings δεν συνεισφέρουν τίποτα. Μόνο τα views αυτού του event επιβιώνουν.',
      'Κενά κελιά του πίνακα = ? — ποτέ δεν γίνονται training rows.'
    ]
  },

  // ---------- PHASE B ----------
  phaseB: {
    title: 'Phase B — Train',
    icon: '🏋️',
    steps: [
      {
        n: 4,
        title: 'Global mean μ',
        body: 'μ = (1/|S|) · Σ x_ij — η μέση βαθμολογία όλων των γνωστών ζευγαριών.'
      },
      {
        n: 5,
        title: 'Αρχικοποίηση biases',
        body: 'b_i = 0 για κάθε χρήστη, c_j = 0 για κάθε item.'
      },
      {
        n: 6,
        title: 'Αρχικοποίηση factor matrices',
        body: 'V (N×K) και F (M×K) ← μικρές τυχαίες τιμές, π.χ. gauss(0, 0.1). ΔΕΝ πρέπει να είναι ίδιες — αλλιώς όλες οι γραμμές παίρνουν ίδιο gradient για πάντα και το taste term δεν μαθαίνει τίποτα.'
      },
      {
        n: 7,
        title: 'Epoch loop',
        body: 'Για κάθε epoch: shuffle, SGD update σε κάθε triple, υπολογισμός RMSE, early stopping.'
      },
      {
        n: 8,
        title: 'Το εκπαιδευμένο μοντέλο',
        body: 'Το μοντέλο είναι τα μ, b, c, V, F. Προσοχή: οι βαθμολογίες φεύγουν. Ήταν input — αυτά τα 5 πράγματα είναι ό,τι μένει.'
      }
    ],
    sgd: {
      title: 'SGD Updates — για κάθε (i, j, x_ij) ∈ S',
      lines: [
        { code: 'e_ij = x_ij − x̂_ij', comment: 'υπολογισμός σφάλματος' },
        { code: 'b_i ← b_i + η (e_ij − λ b_i)', comment: 'update user bias' },
        { code: 'c_j ← c_j + η (e_ij − λ c_j)', comment: 'update item bias' },
        { code: 'v_old = V[i][k]', comment: '⚠️ κρατάμε πρώτα την παλιά τιμή' },
        { code: 'V[i][k] ← V[i][k] + η (e_ij · F[j][k] − λ · V[i][k])', comment: 'update V — χρησιμοποιεί νέο F' },
        { code: 'F[j][k] ← F[j][k] + η (e_ij · v_old − λ · F[j][k])', comment: 'update F — χρησιμοποιεί ΠΑΛΙΟ V' }
      ],
      warning: 'Το v_old δεν είναι διακοσμητικό. Αν χρησιμοποιήσεις το νέο V[i][k] και για τα δύο updates, το F μαθαίνει πάνω σε ένα V που ήδη άλλαξε — αυτό είναι λάθος gradient.'
    }
  },

  // ---------- PHASE C ----------
  phaseC: {
    title: 'Phase C — Evaluate',
    icon: '📏',
    steps: [
      { n: 9, title: 'Split S σε l folds', body: 'Συνήθως l=5. Κάθε fold είναι ένα κομμάτι του S.' },
      { n: 10, title: 'Cross-validate', body: 'Για κάθε fold: train στα υπόλοιπα l−1, κρύβουμε αυτό.' },
      { n: 11, title: 'Predict hidden pairs', body: 'Υπολογισμός MAE και RMSE στα κρυμμένα ζεύγη.' },
      { n: 12, title: 'Ranking metrics', body: 'Για κάθε χρήστη: rank τους candidates, πάρε top-K, υπολόγισε Precision@K και Recall@K.' },
      { n: 13, title: 'Average', body: 'Μέσος όρος πάνω από users, μετά πάνω από folds.' }
    ],
    metrics: [
      {
        name: 'MAE',
        formula: 'MAE = (1/J) · Σ |R_j − P_j|',
        meaning: 'Μέσο απόλυτο σφάλμα — πόσο κοντά είναι η πρόβλεψη στην πραγματική τιμή.'
      },
      {
        name: 'RMSE',
        formula: 'RMSE = √(Σ(R_j − P_j)² / J)',
        meaning: 'Root Mean Squared Error — τιμωρεί περισσότερο τα μεγάλα σφάλματα.'
      },
      {
        name: 'Precision@K',
        formula: 'Precision@K = |L_u(K) ∩ T_u| / K',
        meaning: 'Από τα K που προτείναμε, πόσα άρεσαν στον χρήστη.'
      },
      {
        name: 'Recall@K',
        formula: 'Recall@K = |L_u(K) ∩ T_u| / |T_u|',
        meaning: 'Από όλα όσα άρεσαν στον χρήστη, πόσα πιάσαμε στα top-K.'
      }
    ],
    results: {
      title: 'Αποτελέσματα στο event_interest.csv (13.983 ratings, 1.970 users, 8.119 events — 0.087% dense)',
      rows: [
        { metric: 'MAE', value: '0.7780', baseline: '—', highlight: false },
        { metric: 'RMSE', value: '0.9273', baseline: '0.9965 (πρόβλεψη μ)', highlight: true },
        { metric: 'Precision@5', value: '0.01263', baseline: '0.00019 (random)', highlight: true },
        { metric: 'Recall@5', value: '0.05402', baseline: '—', highlight: false }
      ],
      notes: [
        'Το RMSE είναι 6.9% χαμηλότερο από την πρόβλεψη του μέσου όρου για κάθε ζεύγος.',
        'Η Precision@5 είναι 68× καλύτερη από random guessing.',
        'Το training σταματά συνήθως στις 7–9 epochs (PATIENCE=2).'
      ]
    }
  },

  // ---------- PHASE D ----------
  phaseD: {
    title: 'Phase D — Serve τις συστάσεις',
    icon: '🚀',
    steps: [
      { n: 14, title: 'Candidate set', body: 'PUBLISHED events, που ξεκινούν στο μέλλον, δεν τα διοργανώνει ο χρήστης, δεν τα έχει ήδη κλείσει.' },
      { n: 15, title: 'Scoring', body: 'Ίδιος τύπος με το training: x̂ = μ + b_u + c_j + Σ V[u][k] · F[j][k].' },
      { n: 16, title: 'Sort', body: 'Φθίνουσα σειρά. Tie-break στο event id ώστε η pagination να μένει σταθερή μεταξύ σελίδων.' },
      { n: 17, title: 'Return top K', body: 'Η εκφώνηση προτείνει K=5· η σελίδα μας paginate 30.' }
    ]
  },

  // ---------- WORKED EXAMPLE ----------
  workedExample: {
    title: 'Worked Example — Πώς βγαίνει ένα 4.7',
    intro: 'Παράδειγμα από το slide 35, με τους δικούς μας όρους. Δείχνει ότι το baseline και το taste term προστίθενται.',
    rows: [
      { term: 'μ', value: '3.5', meaning: 'Μέση βαθμολογία dataset', group: 'baseline' },
      { term: 'b_u', value: '+0.4', meaning: 'Ο χρήστης αντιδρά πιο θετικά από τον μέσο', group: 'baseline' },
      { term: 'c_j', value: '−0.3', meaning: 'Η εκδήλωση παίρνει λιγότερο ενδιαφέρον από τον μέσο', group: 'baseline' },
      { term: 'Baseline', value: '3.6', meaning: 'μ + b_u + c_j', group: 'subtotal' },
      { term: 'v_u · f_j', value: '+1.1', meaning: 'Ταιριάζουν τα γούστα χρήστη και event', group: 'taste' },
      { term: 'x̂', value: '4.7', meaning: 'Τελική πρόβλεψη', group: 'total' }
    ],
    message: 'Το baseline λέει «τυπικός χρήστης, αυτή η εκδήλωση → 3.6». Το taste term είναι αυτό που κάνει την εξατομίκευση — προσθέτει +1.1 γιατί τα latent factors του χρήστη ευθυγραμμίζονται με αυτά της εκδήλωσης.'
  },

  // ---------- EDGE CASES ----------
  edgeCases: [
    {
      title: 'Cold start — Χρήστης με views αλλά χωρίς bookings',
      icon: '❄️',
      quote: '«Αν ο χρήστης δεν έχει προηγούμενο ιστορικό κρατήσεων, ο αλγόριθμος θα λειτουργεί βάσει μόνο των εκδηλώσεων που έχει επισκεφθεί.»',
      explanation: 'Τα views μπαίνουν στο S ως ratings ακριβώς όπως τα bookings. Άρα ένας χρήστης που έχει μόνο browsed παίρνει κανονικά b_u και v_u από αυτά τα views. Δεν χρειάζεται ειδικός κώδικας — η ίδια pipeline καλύπτει την απαίτηση δωρεάν.'
    },
    {
      title: 'Brand-new user — Μηδενικό ιστορικό',
      icon: '✨',
      explanation: 'Δεν έχει b_u και v_u, άρα ο τύπος καταρρέει σε x̂ = μ + c_j — καθαρά popularity ranking. Αυτό είναι το λογικό αποτέλεσμα: σε sparse δεδομένα, τα bias terms είναι το αξιόπιστο baseline (slide 40).'
    }
  ],

  // ---------- HYPERPARAMETERS ----------
  hyperparams: {
    title: 'Τελικές υπερπαράμετροι',
    rows: [
      { name: 'K (factors)', value: '2', note: 'Λίγοι — αρκούν για sparse data' },
      { name: 'learning_rate (η)', value: '0.01', note: 'Ίδια accuracy με 0.005, αλλά λιγότερα epochs' },
      { name: 'regularization (λ)', value: '0.005', note: 'Κρατά τα βάρη μικρά' },
      { name: 'MAX_EPOCHS', value: '17', note: 'Ceiling όταν δεν υπάρχει validation slice' },
      { name: 'PATIENCE', value: '2', note: 'Early stopping μετά από 2 μη βελτιώσεις' },
      { name: 'SEED', value: '67', note: 'Reproducibility' }
    ]
  },

  // ---------- FILES INVOLVED ----------
  filesInvolved: {
    title: 'Αρχεία που υλοποιούν τον recommender',
    files: [
      {
        name: 'helper_recommendations.py',
        folder: 'backend/core/services/',
        what: 'Η καρδιά του αλγορίθμου — class BiasedMF (fit, predict, rmse_on), load_dataset_ratings, build_interactions, view_rating.'
      },
      {
        name: 'recommendations.py',
        folder: 'backend/core/services/',
        what: 'Caching layer — TTL 10 λεπτών, fingerprint (count + last date), threading.Lock, rank_event_ids.'
      },
      {
        name: 'evaluate_recommender.py',
        folder: 'backend/core/management/commands/',
        what: 'CLI command — cross-validation, MAE/RMSE/Precision@K/Recall@K, --tune για grid search.'
      },
      {
        name: 'event_interest.csv',
        folder: 'rel_event_csvs/',
        what: 'Dataset e-class — 13.983 ratings, 1.970 users, 8.119 events.'
      },
      {
        name: 'event_view.py',
        folder: 'backend/core/models/',
        what: 'Model EventView — καταγράφει προβολές (view_count, last_viewed_at) που τροφοδοτούν τα implicit ratings.'
      }
    ]
  }
};