export async function exportUserGroup(
  xPathDivModal, 
  classDivWrapperAvatarNome,
  xPathSpanNomeGrupo,
  xPathDivCriacaoGrupo,
) {

  function getNameGroup() {
    try {

      let span_name_group = document.evaluate(xPathSpanNomeGrupo, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      if (span_name_group.singleNodeValue) {      
        let content = span_name_group.singleNodeValue.textContent;
        return content.replace(/\<.*\>/gi, "");
      } else {
          return "error-nome-grupo";
      }

      // const span_name_group = document.querySelector(SPAN_NOME_GRUPO);
      // const title = span_name_group.innerText;
      // return title.replace(/\<.*\>/gi, "");
    } catch (error) {
      return "error-nome-grupo";
    }
  }


  //const modalElement = document.querySelector(xPathDivModal);
  const modalElement = document.evaluate(xPathDivModal, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  if (!modalElement) {
    alert(
      "Não foi possível encontrar a modal de usuários, Clique no nome do grupo e depois em Ver tudo"
    );
    return;
  }

  // seta a altura da modal para 9999999999px para que todos os usuários sejam renderizados
  await new Promise((resolve) => {
    modalElement.style.height = "9999999999px";

    const check = setInterval(() => {
      if (modalElement.style.height !== "9999999999px") {
        clearInterval(check);
        resolve("ok");
      }
    }, 500);
  });

  let contacts = [];

  const elements = modalElement.querySelectorAll(classDivWrapperAvatarNome);
  for await (let item of elements) {
    // wrappers: avatar e conteúdo
    const [div_wrapper_avatar, div_wrapper_content] = item.childNodes;

    // wrapper image < flex < div_wrapper_avatar
    const [div_wrapper_flex_avatar] = div_wrapper_avatar.childNodes;
    const [div_wrapper_rondend] = div_wrapper_flex_avatar.childNodes;
    const [img] = div_wrapper_rondend.childNodes;

    // wrappers das linhas < div_wrapper_content
    const [div_wrapper_title, div_wrapper_status] = div_wrapper_content.childNodes;

    // wrappers: nome administrador
    const [span_phone, span_status] = div_wrapper_title.childNodes;

    const [span_status_desc, span_status_name] = div_wrapper_status
      ? div_wrapper_status.childNodes
      : ["", ""];

    const admin = !!span_status;

    let status = span_status_desc.textContent || "";
    status = status.replace(/\<.*\>/g, "");

    let name = span_status_name.textContent || "";
    name = name.replace(/\<.*\>/gi, "");

    let src = "";
    try {
      src = img?.src?.replace("t=s", "t=l");
    } catch (_) {}

    let number = span_phone.textContent || "";
    number = typeof number === "string" ? number.replace(/\+55\s|\+|-/g, "") : "";

    contacts.push({
      number,
      admin,
      status,
      name,
      avatar: src,
    });
  }

  contacts.sort((a, b) => {
    return b.admin - a.admin;
  });

  let csv = "Número;Administrador;Status;Nome\n";
  csv += contacts
    .map((contact) => {
      const admin = contact.admin ? "Administrador do grupo" : "";
      const sanitize = `${contact.number};${admin};${contact.status};${contact.name}\n`;
      return sanitize.replace(/\,|\'|\"|\“|\”/g, "");
    })
    .join("");

  const data = new TextEncoder("utf-8").encode(csv);
  const blob = new Blob(["\uFEFF", data], { type: "text/csv;charset=utf-8" });

  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);

  a.href = url;
  a.download = `${getNameGroup()}.csv`;
  document.body.appendChild(a);
  a.click();

  setTimeout(function () {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}
