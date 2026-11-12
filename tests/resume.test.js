const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

beforeEach(() => {
  document.documentElement.innerHTML = html;
});

test('page title includes the name', () => {
  expect(html).toMatch(/<title>Khai Phan/);
});

test('main heading shows the name', () => {
  expect(document.querySelector('h1').textContent.trim()).toBe('Khai Phan');
});

test('all resume sections are present', () => {
  ['education', 'skills', 'projects', 'experience', 'leadership'].forEach((id) => {
    expect(document.getElementById(id)).not.toBeNull();
  });
});

test('every section has at least one entry or skill', () => {
  document.querySelectorAll('main section').forEach((section) => {
    const items = section.querySelectorAll('.entry, .skills div');
    expect(items.length).toBeGreaterThan(0);
  });
});

test('contact links are valid', () => {
  const links = [...document.querySelectorAll('.contact a')].map((a) => a.getAttribute('href'));
  expect(links).toContain('mailto:hphan16@my.bcit.ca');
  links.filter((l) => !l.startsWith('mailto:')).forEach((l) => {
    expect(l).toMatch(/^https:\/\//);
  });
});

test('external links open safely in a new tab', () => {
  document.querySelectorAll('a[target="_blank"]').forEach((a) => {
    expect(a.getAttribute('rel')).toContain('noopener');
  });
});

test('stylesheet referenced by the page exists', () => {
  const href = document.querySelector('link[rel="stylesheet"][href^="css/"]').getAttribute('href');
  expect(fs.existsSync(path.join(root, href))).toBe(true);
});

test('no phone number is published on the public page', () => {
  expect(document.body.textContent).not.toMatch(/\d{3}[-.\s]\d{3}[-.\s]\d{4}/);
});
