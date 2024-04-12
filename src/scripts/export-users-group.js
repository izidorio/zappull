export async function exportUserGroup() {
  // classes da div da modal que fica acima do header do nome e envolver o nome do grupo e os usuários
  const DIV_MODAL =
    ".x15g3fpr.x78zum5.xdt5ytf.x5yr21d.x17qophe.x6ikm8r.x10wlt62.x67bb7w.x10l6tqk.x13vifvy.xh8yej3._ahmw.copyable-area";
  // classes da div que envolvem o avatar e o nome do usuário
  const DIV_WRAPPER_AVATAR_NOME = "._ak72._ak73";
  // seletor do span com o nome do grupo
  const SPAN_NOME_GRUPO =
    "#app > div > div.three._aigs > div._aigv._aig- > span > div > span > div > div > div > section > div.x13mwh8y.x1q3qbx4.x1wg5k15.xajqne3.x1n2onr6.x1c4vz4f.x2lah0s.xdl72j9.xyorhqc.x13x2ugz.x7sb2j6.x6x52a7.x1i2zvha.xxpdul3 > div > div.x2b8uid.x193iq5w.xqmxbcd > div > div > div > div > span > span";
  // seletor da div com a data de criação do grupo
  const DIV_CRIACAO_GRUPO =
    "#app > div > div.three._aigs > div._aigv._aig- > span > div > span > div > div > div > section > div.x13mwh8y.x1q3qbx4.x1wg5k15.xajqne3.x1n2onr6.x1c4vz4f.x2lah0s.xdl72j9.x13x2ugz.x6x52a7.xxpdul3.xat24cr.x1cnzs8.xx6bls6 > div.x1f6kntn.x16h55sf.x1fcty0u.x1rw0npd";

  const STYLE = `<style> @import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap'); h2{  font-family: 'Open Sans', sans-serif; font-size: 1em; text-align: center;} .container{ width: 900px; display: flex; flex-wrap: wrap; justify-content: space-between; page-break-after: always; font-family: 'Open Sans', sans-serif; } .content{ display: flex; width: 440px; border: 1px #cccccc solid; height: 160px; margin-bottom: 20px; border-radius: 8px; overflow: hidden; } .content img{ height: 160px; } .info{ padding: 0 10px; } </style>`;

  function getNameGroup() {
    try {
      const span_name_group = document.querySelector(SPAN_NOME_GRUPO);
      const title = span_name_group.innerText;
      return title.replace(/\<.*\>/gi, "");
    } catch (error) {
      return "error-nome-grupo";
    }
  }

  const modalElement = document.querySelector(DIV_MODAL);
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

  const elements = modalElement.querySelectorAll(DIV_WRAPPER_AVATAR_NOME);
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
