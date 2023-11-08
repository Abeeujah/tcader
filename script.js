const form = document.getElementById("form");
const result = document.getElementById("result");
const scanned = document.getElementById("scanned");
const matched = document.getElementById("matched");
const char = document.getElementById("char");
const elapsed = document.getElementById("elapsed");
const output = document.getElementById("output");

function readCount(words, word) {
  const extras = {
    wordCount: 0,
    count: 0,
    chars: 0,
  };

  if (words) {
    const wordsArray = words.toLowerCase().trim().split(" ");
    const count = wordsArray.filter(
      (inWord) => inWord === word.toLowerCase()
    ).length;

    extras.wordCount = wordsArray.length;
    extras.count = count;
    extras.chars = count * word.length;
    return extras;
  }
  return extras;
}

function redact(payload) {
  const { words, word, cipher } = payload;

  if (words.includes(word)) {
    const key = word.toLowerCase();
    const code = cipher.length > 1 ? cipher : cipher.repeat(key.length);

    const redactedWords = words.trim().toLowerCase().replaceAll(key, code);

    return redactedWords;
  }

  return words;
}

function main(payload) {
  const { words, word, cipher } = payload;

  const start = new Date().getMilliseconds();

  const redacted = redact(payload);

  const end = new Date().getMilliseconds();
  const time = end - start;

  const extras = readCount(words, word);

  return { ...extras, redacted, time };
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const payload = Object.fromEntries(formData);
  const response = main(payload);
  const { wordCount, count, chars, redacted, time } = response;
  scanned.innerText = wordCount;
  matched.innerText = count;
  char.innerText = chars;
  elapsed.innerText = `${time}ms`;
  output.innerText = redacted;
  output.innerText.length > 1 && output.classList.remove("none");
  form.reset();
});
