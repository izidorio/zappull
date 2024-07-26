export async function previewUserGroup() {
  // classes da div da modal que fica acima do header do nome e envolver o nome do grupo e os usuários
  const DIV_MODAL =
    ".x15g3fpr.x78zum5.xdt5ytf.x5yr21d.x17qophe.x6ikm8r.x10wlt62.x67bb7w.x10l6tqk.x13vifvy.xh8yej3.xnpuxes.copyable-area";

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

  function getDateCreatedGroup() {
    try {
      const span_date_group = document.querySelector(DIV_CRIACAO_GRUPO).firstChild;
      return span_date_group.textContent;
    } catch (error) {
      return "error-data-grupo";
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

  function card(contact) {
    const url = contact.avatar
      ? contact.avatar
      : "data:image/png;base64,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";

    const admin = contact.admin ? `(<b> Administrador </b>)` : "";

    return `<div class="content"> <img src="${url}" /> <div class="info" data-number="${contact.number}"> <p>${contact.number}${admin}</p> <p>${contact.name}</p> <p>${contact.status}</p> </div> </div>`;
  }

  function container(content) {
    return `<div class="container">${content}</div>`;
  }

  let html = `<title>${getNameGroup()}</title>${STYLE}<h2>${getNameGroup()} (${
    contacts.length
  } participantes, <small>${getDateCreatedGroup()}</small>)</h2>`;
  let cards = "";
  let i = 1;

  for (let contact of contacts) {
    cards += card(contact);
    if (i % 14 == 0) {
      html += container(cards);
      cards = "";
    }
    i++;
  }

  html += container(cards);

  const previewPage = window.open("about:blank");
  previewPage.document.write(html);
}
