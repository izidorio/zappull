export function readNumberNameUsers(xPathSpanComNumerosNomesDoGrupo) {
  try {
    let users = document
    .evaluate(xPathSpanComNumerosNomesDoGrupo, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
    .singleNodeValue
    .textContent;

    users = users.replace(/\+55\s|\+|-/gi, "");

    const textarea = document.createElement("textarea");
    users = users.replace(/\,/g, "\n");
    textarea.value = users.replace(/\,/gi, /\n/).replace(/^\s/gm, "");
    textarea.style.position = "absolute";
    textarea.style.left = "-99999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    if (document.queryCommandSupported("copy")) {
      alert("Texto copiado para a área de transferência!");
    } else {
      alert("Seu navegador não suporta a cópia para a área de transferência.");
    }
  } catch (error) {
    console.log(error.message);
  }
}
