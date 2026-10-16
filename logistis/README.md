# N2X

AI back office for Greek accounting offices. One accountant login, many clients (ΑΦΜ). Greek UI.

1. **Χαρακτηρισμός εξόδων (myDATA).** Pulls the invoices suppliers issued to each client (`RequestDocs`) and suggests the E3 + VAT classification for every line. The accountant approves and the app sends it with `SendExpensesClassification`.
   - Suggestions come from the accountant's own earlier choice for the same supplier first, and from Claude otherwise.
   - Every suggestion is checked against AADE's table of valid category/E3 combinations per invoice type (`src/expense-classifications.json`, converted from [firebed/aade-mydata](https://github.com/firebed/aade-mydata), MIT). An invalid combination is never sent.
   - Classifying one invoice pre-fills the other pending invoices from the same supplier. «Αποστολή έτοιμων» sends them in bulk.
2. **Τράπεζα.** Upload an e-banking CSV (Greek or English headers, `1.234,56` amounts). Each outgoing payment is matched to an invoice with the same gross amount, and payments with no invoice are listed.
3. **Έγγραφα πελάτη.** Each client gets a private upload link (send it by Viber). Photos and PDFs of receipts are read by Claude, which extracts ΑΦΜ, date, total and category. The app flags any receipt that is **not** in myDATA.

## Run

Needs Node ≥ 22.18, which runs the `.ts` files directly with no build step.

```bash
npm install
node --env-file=.env src/server.ts   # http://localhost:4747 (put the variables below in .env)
npm test         # unit tests + end-to-end test against a fake myDATA server
npm run typecheck
```

| Env | |
|---|---|
| `APP_PASSWORD` | office login password |
| `APP_SECRET` | long random string; encrypts stored myDATA keys and signs the session |
| `ANTHROPIC_API_KEY` | for AI suggestions and receipt reading; without it everything else still works and invoices are classified by hand |
| `MYDATA_BASE_URL` | defaults to the **sandbox** `https://mydataapidev.aade.gr/`; production is `https://mydatapi.aade.gr/myDATA/` |
| `MYDATA_USER`, `MYDATA_KEY` | optional office (accountant) credentials, used with `entityVatNumber` for clients that have no credentials of their own |
| `DATA_DIR`, `PORT` | default `./data`, `4747` |

Sandbox credentials: register at https://mydata-dev-register.azurewebsites.net (AADE's dev portal).

## Known limits

- VAT classification is sent only for lines that carry VAT. 0%/exempt lines would also need `vatExemptionCategory`.
- Single office, single password. Multi-office accounts and per-user logins come later.
- SQLite file in `DATA_DIR`. Back it up; it holds the classification history that drives suggestions.
