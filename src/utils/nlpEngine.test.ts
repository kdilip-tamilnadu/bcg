import test from 'node:test';
import assert from 'node:assert/strict';
import { parseQuery, generateBotResponse } from './nlpEngine';
import { ChatContext } from '../types/finance';

const emptyContext: ChatContext = {
  conversationTurnCount: 0,
};

test('NLP Engine: parses single-metric Microsoft revenue 2024 query', () => {
  const result = parseQuery("What was Microsoft's revenue in 2024?", emptyContext);
  assert.equal(result.intent, 'single-metric');
  assert.deepEqual(result.companies, ['MSFT']);
  assert.deepEqual(result.years, [2024]);
  assert.deepEqual(result.metrics, ['revenue']);

  const response = generateBotResponse("What was Microsoft's revenue in 2024?", emptyContext);
  assert.ok(response.message.text.includes('245,122'));
  assert.equal(response.newContext.activeCompany, 'MSFT');
  assert.equal(response.newContext.activeYear, 2024);
});

test('NLP Engine: parses comparison query between Apple and Tesla for 2025', () => {
  const result = parseQuery('Compare Apple and Tesla net income 2025', emptyContext);
  assert.equal(result.intent, 'comparison');
  assert.ok(result.companies.includes('AAPL'));
  assert.ok(result.companies.includes('TSLA'));
  assert.deepEqual(result.years, [2025]);
  assert.deepEqual(result.metrics, ['netIncome']);

  const response = generateBotResponse('Compare Apple and Tesla net income 2025', emptyContext);
  assert.equal(response.message.structuredData?.type, 'comparison');
  assert.ok(response.message.structuredData?.table?.rows.length === 2);
});

test('NLP Engine: parses trend queries for cash flow', () => {
  const result = parseQuery('Show cash flow trends', emptyContext);
  assert.equal(result.intent, 'trend');
  assert.deepEqual(result.metrics, ['operatingCashFlow']);

  const response = generateBotResponse('Show cash flow trends', emptyContext);
  assert.equal(response.message.structuredData?.type, 'trend');
});

test('NLP Engine: multi-turn context resolution', () => {
  const contextWithMsft: ChatContext = {
    activeCompany: 'MSFT',
    activeYear: 2024,
    lastMetric: 'revenue',
    conversationTurnCount: 1,
  };

  // User asks: "What about 2025?"
  const result = parseQuery('What about 2025?', contextWithMsft);
  assert.deepEqual(result.companies, ['MSFT']);
  assert.deepEqual(result.years, [2025]);
  assert.deepEqual(result.metrics, ['revenue']);

  const response = generateBotResponse('What about 2025?', contextWithMsft);
  assert.ok(response.message.text.includes('281,800'));
});

test('NLP Engine: handles unsupported companies with polite guidance', () => {
  const result = parseQuery('How much did Amazon make in 2024?', emptyContext);
  assert.equal(result.intent, 'unsupported-company');
  assert.equal(result.unsupportedEntity, 'AMAZON');

  const response = generateBotResponse('How much did Amazon make in 2024?', emptyContext);
  assert.ok(response.message.text.includes('engagement scope is currently configured'));
});

test('NLP Engine: board briefing and key findings', () => {
  const response = generateBotResponse('Summarize key findings for GFC executive board', emptyContext);
  assert.equal(response.message.structuredData?.type, 'board-brief');
  assert.ok(response.message.text.includes('Global Finance Corp'));
});
