export function readNumberNameUsers() {
  try {
    // div com a lista de números/nomes dos participantes do grupo
    const SPAN_COM_NUMEROS_NOMES_DO_GRUPO =
      "#main > header > div._amie > div.x78zum5.x1cy8zhl.xisnujt.x1nxh6w3.xcgms0a.x16cd2qt > span";

    const classContainerParticipantes = document.querySelector(SPAN_COM_NUMEROS_NOMES_DO_GRUPO);

    let users = classContainerParticipantes.textContent.replace(/,\s/gi, "\n");
    users = users.replace(/\+55\s|\+|-/gi, "");

    const textarea = document.createElement("textarea");
    textarea.value = users;
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
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
