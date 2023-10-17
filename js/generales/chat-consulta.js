function setupPopSizeListener(width, height, element) {
}
setupPopSizeListener(800, 600, document.getElementById("chat-popup"));
  
  function get_node_discussion_prompt(node, _jm) {
    const text_of_node = node.topic;
    const hyphenated_list = createHyphenatedList(_jm.get_data().data);
    var prompt = document.getElementById("discuss-node-prompt").value;
    prompt = secureEvaluateTemplate(prompt, {
      hyphenated_list: hyphenated_list,
      text_of_node: text_of_node,
    });
    console.log(prompt);
    return prompt;
  }

  function scrollToBottom() {
    var anchor = document.getElementById("anchor");
    anchor.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  function observeChatMessages() {
    const chatMessages = document.getElementById("chat-messages");
    const observer = new MutationObserver(scrollToBottom);

    observer.observe(chatMessages, {
      childList: true, // Observar cambios en los subnodos de los  Mensajes del chat
      subtree: true, // Observar cambios en los subnodos del chat.
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    observeChatMessages();
  });

  async function discuss_node() {
    var selected_node = _jm.get_selected_node(); // Como padre del nuevo nodo
    if (!selected_node) {
      prompt_info("por favor seleccione un nodo primero.");
      return;
    }

    // Llame a la función get_children_suggestions y espere la respuesta
    const prompt = get_node_discussion_prompt(selected_node, _jm);
    openChatPopup(selected_node, prompt, _jm);
  }
  let curNode = null;
  let prompt_prefix = "";
  async function openChatPopup(_curNode, prompt, _jm) {
    curNode = _curNode;
    backlog = "";
    if (curNode.data.hasOwnProperty("chatlog")) {
      backlog = curNode.data["chatlog"];
    }
    const chatPopup = document.getElementById("chat-popup");
    chatPopup.classList.remove("hidden");

    // Borrar mensajes de chat existentes
    const chatMessages = document.getElementById("chat-messages");
    chatMessages.innerHTML = "";
    const cur_topic = curNode.topic;
    const hyphenated_list = createHyphenatedList(_jm.get_data().data);
    var prompt_prefix_tmpl = document.getElementById("prefix-prompt").value;
    prompt_prefix = secureEvaluateTemplate(prompt_prefix_tmpl, {
      hyphenated_list: hyphenated_list,
      cur_topic: cur_topic,
    });

    // Mostrar trabajo pendiente
    if (backlog != "") {
      displayChatMessage(
        "backlog-message",
        "------backlog-----\n" + backlog + "\n----end backlog---"
      );
      displayChatMessage("user-message", "user-message:\n" + prompt_prefix);
    } else {
      // Mostrar mensaje
      displayChatMessage("user-message", "user-message:\n" + prompt);

      // Enviar mensaje a GPT y mostrar respuesta
      displayChatMessage(
        "gpt-message",
        "... mensaje enviado a la API de GPT, esperando respuesta ..."
      );
      const lastMessage = document.getElementById("chat-messages").lastChild;
      const response = await chatGPTRequest(prompt, curNode);
      lastMessage.innerText = "gpt-message:\n" + response;
    }
    scrollToBottom();
  }

  function closeChatPopup() {
    const chatPopup = document.getElementById("chat-popup");
    chatPopup.classList.add("hidden");
  }

  function displayChatMessage(sender, message) {
    const chatMessages = document.getElementById("chat-messages");
    const messageDiv = document.createElement("div");
    messageDiv.className = sender;
    messageDiv.innerText = message;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  // Arrastrable
  const chatHeader = document.querySelector(".chat-header");
  chatHeader.addEventListener("mousedown", dragMouseDown);

  function dragMouseDown(e) {
    e.preventDefault();

    const chatPopup = document.getElementById("chat-popup");
    const offsetX = e.clientX - chatPopup.getBoundingClientRect().left;
    const offsetY = e.clientY - chatPopup.getBoundingClientRect().top;

    document.onmousemove = (e) => {
      chatPopup.style.left = `${e.clientX - offsetX}px`;
      chatPopup.style.top = `${e.clientY - offsetY}px`;
    };

    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  }

  // Redimensionable
  const resizeHandle = document.querySelector(".resize-handle");
  resizeHandle.addEventListener("mousedown", resizeMouseDown);

  function resizeMouseDown(e) {
    e.preventDefault();

    const chatPopup = document.getElementById("chat-popup");
    const initialWidth = chatPopup.clientWidth;
    const initialHeight = chatPopup.clientHeight;
    const initialX = e.clientX;
    const initialY = e.clientY;

    document.onmousemove = (e) => {
      const newX = e.clientX;
      const newY = e.clientY;

      chatPopup.style.width = `${initialWidth + (newX - initialX)}px`;
      chatPopup.style.height = `${initialHeight + (newY - initialY)}px`;
    };

    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  }

  // Campo de entrada multilínea e indicador de espera ".."
  async function submitChatMessage() {
    const inputText = document.getElementById("chat-input-text");
    const message = inputText.value;
    inputText.value = "";

    if (message.trim() === "") return;

    displayChatMessage("user-message", message);
    displayChatMessage("gpt-message", "..thinking..");
    const lastMessage = document.getElementById("chat-messages").lastChild;
    const response = await chatGPTRequest(prompt_prefix + message, curNode);
    lastMessage.innerText = "gpt-message:\n" + response;
  }