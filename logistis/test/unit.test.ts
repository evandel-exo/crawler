import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseAmount, parseDate, parseStatement, matchPayments } from '../src/bank.ts';
import { isValid, allowedFor } from '../src/classify.ts';
import { buildExpensesXml } from '../src/mydata.ts';

test('amounts in Greek and English formats', () => {
  assert.equal(parseAmount('1.234,56'), 1234.56);
  assert.equal(parseAmount('-12,50'), -12.5);
  assert.equal(parseAmount('1,234.56'), 1234.56);
  assert.equal(parseAmount('12.50'), 12.5);
  assert.equal(parseAmount('1.234'), 1234);
  assert.equal(parseAmount('€ 99,90'), 99.9);
});

test('dates', () => {
  assert.equal(parseDate('05/03/2026'), '2026-03-05');
  assert.equal(parseDate('5.3.26'), '2026-03-05');
  assert.equal(parseDate('2026-03-05T10:00'), '2026-03-05');
  assert.equal(parseDate('σκουπίδια'), '');
});

test('bank CSV with Greek headers, debit/credit columns and quoted fields', () => {
  const csv = '﻿Λογαριασμός: GR12...\nΗμερομηνία;Περιγραφή;Χρέωση;Πίστωση\n10/03/2026;"ΠΛΗΡΩΜΗ ΔΕΗ; ΛΟΓ/ΣΜΟΣ";124,00;\n11/03/2026;ΚΑΤΑΘΕΣΗ;;1.000,00\n';
  assert.deepEqual(parseStatement(csv), [
    { date: '2026-03-10', description: 'ΠΛΗΡΩΜΗ ΔΕΗ; ΛΟΓ/ΣΜΟΣ', amount: -124 },
    { date: '2026-03-11', description: 'ΚΑΤΑΘΕΣΗ', amount: 1000 },
  ]);
});

test('payment matching prefers the supplier named in the description, one invoice per payment', () => {
  const lines = [
    { date: '2026-03-10', description: 'ΠΛΗΡΩΜΗ ΔΕΗ', amount: -124 },
    { date: '2026-03-12', description: 'ΜΕΤΑΦΟΡΑ', amount: -124 },
    { date: '2026-03-12', description: 'ΜΕΤΑΦΟΡΑ', amount: -50 },
  ];
  const invoices = [
    { mark: 'A', issueDate: '2026-03-09', gross: 124, issuerName: 'COSMOTE' },
    { mark: 'B', issueDate: '2026-03-01', gross: 124, issuerName: 'ΔΕΗ ΑΕ' },
    { mark: 'C', issueDate: '2025-01-01', gross: 50, issuerName: 'ΠΑΛΙΟ' },
  ];
  const m = matchPayments(lines, invoices);
  assert.equal(m.get(0), 'B');
  assert.equal(m.get(1), 'A');
  assert.equal(m.has(2), false); // too old to be this payment
});

test('classification combos follow AADE table', () => {
  assert.ok(isValid('1.1', 'category2_1', 'E3_102_001', 'VAT_361'));
  assert.ok(!isValid('1.1', 'category2_1', 'E3_585_011', null)); // energy is not a purchase of goods
  assert.ok(!isValid('1.1', 'category2_1', null, null));
  assert.ok(isValid('1.1', 'category2_95', null, null)); // category without E3 type
  assert.ok(!isValid('1.1', 'category2_3', 'E3_585_011', 'VAT_999'));
  assert.ok(Array.isArray(allowedFor('13.1').category2_4));
  assert.ok(Object.keys(allowedFor('99.9')).length > 10); // unknown type falls back to every code
});

test('expenses classification XML', () => {
  const xml = buildExpensesXml('400001234567890', '123456789', [
    { lineNumber: 1, amount: 100, vatAmount: 24, vatCategory: '1', category: 'category2_3', type: 'E3_585_011', vatType: 'VAT_361' },
    { lineNumber: 2, amount: 10, vatAmount: 0, vatCategory: '8', category: 'category2_95', type: null, vatType: null },
  ]);
  assert.match(xml, /<invoiceMark>400001234567890<\/invoiceMark><entityVatNumber>123456789<\/entityVatNumber><invoicesExpensesClassificationDetails><lineNumber>1<\/lineNumber>/);
  assert.match(xml, /<classificationType>E3_585_011<\/classificationType><classificationCategory>category2_3<\/classificationCategory><amount>100.00<\/amount>/);
  assert.match(xml, /<classificationType>VAT_361<\/classificationType><amount>100.00<\/amount><vatAmount>24.00<\/vatAmount><vatCategory>1<\/vatCategory>/);
  assert.match(xml, /<lineNumber>2<\/lineNumber><expensesClassificationDetailData><classificationCategory>category2_95<\/classificationCategory><amount>10.00<\/amount><\/expensesClassificationDetailData><\/invoicesExpensesClassificationDetails>/);
});
