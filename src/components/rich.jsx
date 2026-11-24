// The copy in ../constants is plain strings; this turns **bold** into <b> and
// `code` into <code> so the data file never has to hold markup.
const rich = (text) =>
  text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith("**")) return <b key={i}>{part.slice(2, -2)}</b>;
    if (part.startsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;
    return part;
  });

export default rich;
