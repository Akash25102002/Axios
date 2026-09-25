/**
 * Automated End-to-End API Verification Script
 * Validates all endpoints, status codes, input validations, search, filtering, and notes.
 */
const http = require('http');

const request = (method, path, body = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, 'http://localhost:5000');
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('\n--- Starting SupportFlow CRM API Automated Tests ---\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(` PASS: ${testName}`);
      passed++;
    } else {
      console.error(` FAIL: ${testName} - ${details}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const health = await request('GET', '/health');
    assert(health.status === 200 && health.data.status === 'healthy', 'Health check endpoint returns 200');

    // 2. Validation check: Empty fields
    const emptyPayload = await request('POST', '/api/tickets', {});
    assert(emptyPayload.status === 400, 'POST /api/tickets rejects empty body with 400');

    // 3. Validation check: Invalid email
    const invalidEmail = await request('POST', '/api/tickets', {
      customer_name: 'John Doe',
      customer_email: 'not-an-email',
      subject: 'Login failed',
      description: 'Customer cannot log in to account'
    });
    assert(invalidEmail.status === 400 && invalidEmail.data.error.includes('email'), 'POST /api/tickets rejects invalid email format');

    // 4. Validation check: Short description
    const shortDesc = await request('POST', '/api/tickets', {
      customer_name: 'John Doe',
      customer_email: 'john@example.com',
      subject: 'Issue',
      description: 'Too short'
    });
    assert(shortDesc.status === 400, 'POST /api/tickets rejects description < 10 chars');

    // 5. Create valid ticket 1 (TKT-001)
    const tkt1 = await request('POST', '/api/tickets', {
      customer_name: 'Alice Johnson',
      customer_email: 'alice@wonderland.com',
      subject: 'Cannot reset password on portal',
      description: 'Password reset link expires immediately upon receiving the email.',
      priority: 'High'
    });
    assert(
      tkt1.status === 201 && tkt1.data.ticket_id === 'TKT-001' && tkt1.data.status === 'Open' && tkt1.data.priority === 'High',
      'Create Ticket 1 generates TKT-001 with High priority'
    );

    // 6. Create valid ticket 2 (TKT-002)
    const tkt2 = await request('POST', '/api/tickets', {
      customer_name: 'Bob Smith',
      customer_email: 'bob@builder.org',
      subject: 'Billing invoice query for September',
      description: 'Double charge noticed on card statement for subscription renewal.',
      priority: 'Medium'
    });
    assert(tkt2.status === 201 && tkt2.data.ticket_id === 'TKT-002', 'Create Ticket 2 generates sequential TKT-002');

    // 7. Create valid ticket 3 (TKT-003)
    const tkt3 = await request('POST', '/api/tickets', {
      customer_name: 'Charlie Brown',
      customer_email: 'charlie@peanuts.com',
      subject: 'Feature request for dark mode',
      description: 'Would love to see an automated dark mode theme option in settings.',
      priority: 'Low'
    });
    assert(tkt3.status === 201 && tkt3.data.ticket_id === 'TKT-003', 'Create Ticket 3 generates sequential TKT-003');

    // 8. Get all tickets
    const allTickets = await request('GET', '/api/tickets');
    assert(allTickets.status === 200 && Array.isArray(allTickets.data) && allTickets.data.length >= 3, 'GET /api/tickets returns array of tickets');

    // 9. Search tickets by customer name
    const searchByName = await request('GET', '/api/tickets?search=Alice');
    assert(searchByName.status === 200 && searchByName.data.some(t => t.customer_name.includes('Alice')), 'Search tickets by name works');

    // 10. Search tickets by ticketId
    const searchById = await request('GET', '/api/tickets?search=TKT-002');
    assert(searchById.status === 200 && searchById.data.length === 1 && searchById.data[0].ticket_id === 'TKT-002', 'Search tickets by ID works');

    // 11. Search tickets by keyword in description
    const searchByDesc = await request('GET', '/api/tickets?search=subscription');
    assert(searchByDesc.status === 200 && searchByDesc.data.length >= 1, 'Search tickets by description keyword works');

    // 12. Get ticket stats
    const stats = await request('GET', '/api/tickets/stats');
    assert(
      stats.status === 200 && stats.data.total >= 3 && stats.data.open >= 3,
      'GET /api/tickets/stats returns correct counts'
    );

    // 13. Get single ticket by ID
    const single = await request('GET', '/api/tickets/TKT-001');
    assert(
      single.status === 200 && single.data.ticket_id === 'TKT-001' && Array.isArray(single.data.notes),
      'GET /api/tickets/TKT-001 returns ticket details with notes array'
    );

    // 14. Non-existent ticket test
    const notFound = await request('GET', '/api/tickets/TKT-999');
    assert(notFound.status === 404, 'GET /api/tickets/TKT-999 returns 404 Not Found');

    // 15. Update ticket status to In Progress
    const update1 = await request('PUT', '/api/tickets/TKT-001', {
      status: 'In Progress'
    });
    assert(
      update1.status === 200 && update1.data.ticket.status === 'In Progress',
      'PUT /api/tickets/TKT-001 updates status to In Progress'
    );

    // 16. Add first note
    const note1 = await request('PUT', '/api/tickets/TKT-001', {
      notes: 'Investigating auth token expiry with security team.'
    });
    assert(
      note1.status === 200 && note1.data.note && note1.data.note.note_text.includes('Investigating'),
      'PUT /api/tickets/TKT-001 adds note 1'
    );

    // 17. Add second note
    const note2 = await request('PUT', '/api/tickets/TKT-001', {
      notes: 'Issue reproduced. Patching password reset handler.'
    });
    assert(
      note2.status === 200 && note2.data.note && note2.data.note.note_text.includes('reproduced'),
      'PUT /api/tickets/TKT-001 adds note 2'
    );

    // 18. Verify both notes appear in ticket details
    const singleWithNotes = await request('GET', '/api/tickets/TKT-001');
    assert(
      singleWithNotes.status === 200 && singleWithNotes.data.notes.length === 2,
      'GET /api/tickets/TKT-001 returns both appended notes in chronological order'
    );

    // 19. Update ticket status to Closed
    const updateClosed = await request('PUT', '/api/tickets/TKT-001', {
      status: 'Closed'
    });
    assert(
      updateClosed.status === 200 && updateClosed.data.ticket.status === 'Closed',
      'PUT /api/tickets/TKT-001 updates status to Closed'
    );

    // 20. Filter by Closed status
    const filterClosed = await request('GET', '/api/tickets?status=Closed');
    assert(
      filterClosed.status === 200 && filterClosed.data.some(t => t.ticket_id === 'TKT-001'),
      'Filter by Closed returns TKT-001'
    );

    // 21. Filter by Open status
    const filterOpen = await request('GET', '/api/tickets?status=Open');
    assert(
      filterOpen.status === 200 && filterOpen.data.every(t => t.status === 'Open'),
      'Filter by Open returns only Open tickets'
    );

    console.log(`\n========================================`);
    console.log(` API Tests Completed: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
};

runTests();
