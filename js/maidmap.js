function patch_jm(_jm) {
    _jm.layout._layout_offset_subnodes = function(nodes) {
    var total_height = 0;
    var nodes_count = nodes.length;
    var i = nodes_count;
    var node = null;
    var node_outer_height = 0;
    var layout_data = null;
    var base_y = 0;
    var pd = null; // parent._data
    while (i--) {
        node = nodes[i];
        layout_data = node._data.layout;
        if (pd == null) {
        pd = node.parent._data;
        }

        node_outer_height = this._layout_offset_subnodes(node.children);
        if (!node.expanded) {
        node_outer_height = 0;
        this.set_visible(node.children, false);
        }
        node_outer_height = Math.max(node._data.view.height, node_outer_height);

        layout_data.outer_height = node_outer_height;
        layout_data.offset_y = base_y - node_outer_height / 2;
        layout_data.offset_x =
        this.opts.hspace * layout_data.direction +
        (pd.view.width * (pd.layout.direction + layout_data.direction)) / 2;
        if (!node.parent.isroot) {
        layout_data.offset_x += this.opts.pspace * layout_data.direction;
        }

        base_y = base_y - node_outer_height - this.opts.vspace;
        total_height += node_outer_height;
    }
    if (nodes_count > 1) {
        total_height += this.opts.vspace * (nodes_count - 1);
    }
    i = nodes_count;
    var middle_height = total_height / 2;
    while (i--) {
        node = nodes[i];
        node._data.layout.offset_y += middle_height;
}
    return total_height+10;
    }

    _jm.layout._layout_offset_subnodes_height = function(nodes) {
    var total_height = 0;
    var nodes_count = nodes.length;
    var i = nodes_count;
    var node = null;
    var node_outer_height = 0;
    var layout_data = null;
    var base_y = 0;
    var pd = null; // parent._data
    while (i--) {
    node = nodes[i];
    layout_data = node._data.layout;
    if (pd == null) {
        pd = node.parent._data;
    }

    node_outer_height = this._layout_offset_subnodes_height(node.children);
    if (!node.expanded) {
        node_outer_height = 0;
    }
    node_outer_height = Math.max(node._data.view.height, node_outer_height);

    layout_data.outer_height = node_outer_height;
    layout_data.offset_y = base_y - node_outer_height / 2;
    base_y = base_y - node_outer_height - this.opts.vspace;
    total_height += node_outer_height;
    }
    if (nodes_count > 1) {
    total_height += this.opts.vspace * (nodes_count - 1);
    }
    i = nodes_count;
    var middle_height = total_height / 2;
    while (i--) {
    node = nodes[i];
    node._data.layout.offset_y += middle_height;
    }
    console.log("layout", total_height);
    return total_height+10;
}
}
const buttonBar = document.getElementById('button-bar');

buttonBar.addEventListener('mousedown', (event) => {
    const offsetX = event.clientX - buttonBar.getBoundingClientRect().left;
    const offsetY = buttonBar.getBoundingClientRect().bottom;
    const onMouseMove = (event) => {
    buttonBar.style.left = `${event.clientX - offsetX}px`;
    buttonBar.style.bottom = `${offsetY - event.clientY}px`;
    };

    const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});


function showSpinner() {
  const button = document.getElementById("add-node-button");
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
}

function hideSpinner() {
  const button = document.getElementById("add-node-button");
  button.innerHTML = '<i class="fas fa-share-alt"></i>';
}

function getParameterFromUrl(paramName) {
  try {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return urlSearchParams.get(paramName);
  } catch (error) {
    return null;
  }
}

let dbName = getParameterFromUrl("map");
if (dbName == null) {
  dbName = "default";
}

async function openDatabase(dbName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore("dataStore", { keyPath: "id" });
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

async function loadData(dbName, defaultValue) {
  try {
    const db = await openDatabase(dbName);
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["dataStore"], "readonly");
      const objectStore = transaction.objectStore("dataStore");
      const request = objectStore.get(1);

      request.onsuccess = (event) => {
        const data = event.target.result;
        resolve(data ? data.value : defaultValue);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

async function saveData(dbName, data) {
  try {
    const db = await openDatabase(dbName);
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["dataStore"], "readwrite");
      const objectStore = transaction.objectStore("dataStore");
      const request = objectStore.put({ id: 1, value: data });

      request.onsuccess = (event) => {
        resolve();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error("Error saving data:", error);
  }
}

var redo_manager_disabled = false;

async function autoSaveData() {
    var data = _jm.get_data();
    if (!redo_manager_disabled) {
    console.log("autoSaveData performAction");
    undoRedoManager.performAction(data);
    }
  document.title = data.data.topic;
  recordSettings(data);
  await saveData(dbName, data);
}

function undo() {
    const repeat = undoRedoManager.undo(_jm.get_data());
    console.log(repeat);
    if (repeat != null) {
    _jm.show(repeat);
    }
}

function redo() {
    const repeat = undoRedoManager.redo();
    if (repeat != null) {
    _jm.show(repeat);
    }
}

var _jm = null;

function get_def_options() {
  var def_options = {
    container: "jsmind_container",
    theme: "asphalt",
    editable: true,
    support_html: false,
    view: {
      node_overflow: "wrap",
      engine: "svg",
        draggable: true,
      line_width:3, 
    },

  layout: {
      hspace: 40,
      vspace: 10,
      pspace: 20,
  },
  };
    return def_options;
}

function get_def_mind() {
  var mind = {
    meta: {
      name: "ALICE-RL",
      author: "Roland-Luis",
      version: "0.1",
    },

    format: "node_tree",
    data: {
      id: "root",
      topic: "ALICE-RL",
    },
  };
    return mind;
}

function init_jm(def_options, options) {
    def_options.view.line_width = 3;
    _jm = new jsMind(def_options);
    patch_jm(_jm);
    console.log("open_empty 1", _jm.options);
    _jm.show(options);
    console.log("open_empty 2", _jm.options);
    
  load_meta_properties(options);
  _jm.add_event_listener(async function (type, data) {
    if (
      ["update_node", "expand_node", "collapse_node", "remove_node"].includes(
        data.evt
      )
    ) {
      await autoSaveData();
    } else {
        console.log("event", data);
    }
  });
    return _jm;
}

async function open_empty() {
    const def_options = get_def_options();
    const mind = get_def_mind();
    const options = await loadData(dbName, mind);
    console.log("open_empty performAction");
  undoRedoManager.performAction(options);
    _jm = init_jm(def_options, options);
}

function save_file() {
  var mind_data = _jm.get_data();
  var mind_name = mind_data.meta.name;
  var mind_str = jsMind.util.json.json2string(mind_data);
  jsMind.util.file.save(mind_str, "text/jsmind", mind_name + ".jm");
}

function open_file(event) {
  var files = document.getElementById("file_input").files;
  console.log(files);
  if (
    _jm.get_data().data.children &&
    _jm.get_data().data.children.length > 0
  ) {
    prompt_info(
      "Comience con un mapa mental vacío antes de cargar desde el disco."
    );
    event.target.value = null;
    return;
  }
  if (files.length > 0) {
    var file_data = files[0];
    jsMind.util.file.read(file_data, function (jsmind_data, jsmind_name) {
      var mind = jsMind.util.json.string2json(jsmind_data);
      if (!!mind) {
        _jm.show(mind);
        load_meta_properties(mind);
      } else {
        prompt_info("no se puede abrir este archivo como mapa mental");
      }
    });
  } else {
    prompt_info("por favor elija un archivo primero");
  }
  event.target.value = null;
}

document.getElementById("file_input").addEventListener("change", open_file);

function get_selected_nodeid() {
  var selected_node = _jm.get_selected_node();
  if (!!selected_node) {
    return selected_node.id;
  } else {
    return null;
  }
}

function createHyphenatedList(node, depth = 0) {
  let result = "";
  let prefix = " ".repeat(depth * 2);
  result += `${prefix}- ${node.topic}\n`;
  if (!node.expanded) return result;

  if (node.children) {
    for (const child of node.children) {
      result += createHyphenatedList(child, depth + 1);
    }
  }

  return result;
}

const API_URL = "https://api.openai.com/v1/chat/completions";

async function chatGPTRequest(prompt, curNode = null) {
    try {

    gptEngine = document.getElementById("gpt-engine").value;
    maxTokens = 100; //document.getElementById("max-tokens").value;
    temperature = parseFloat(document.getElementById("temperature").value);
    if (isNaN(temperature)){
        temperature = 0.1;
    }
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
          model: gptEngine,
        messages: [{ role: "user", content: prompt }],
        temperature: temperature,
      }),
    });
    if (!response.ok) {
        console.log(response);
        prompt_info("Error de comunicación con la API OpenAI:"+response.status+" 401 means that your API Key is incorrect.");
        throw new Error(`HTTP error: ${response.status}`);
    }
    
  const data = await response.json();
  console.log("chatGPTRequest", data);
  addTokenUsage(data.usage.total_tokens);
    const resp = data.choices[0].message.content;
    if (curNode) {
      dict = curNode.data;
      if (!dict.hasOwnProperty("chatlog")) {
        dict["chatlog"] = "";
      }
    
      dict["chatlog"] += "user-message:\n" + prompt + "\n";
      dict["chatlog"] += "gpt-message:\n" + resp + "\n\n";
      _jm.set_node_color(curNode.id, "#FFA533", null);
      await autoSaveData();
    }

    return resp;
  } catch (error) {
    console.error("Error:", error);
  }
}

function secureEvaluateTemplate(template, context) {
  return template.replace(/\$\{(\w+)\}/g, (_, variable) => {
    return context[variable] || "";
  });
}

async function get_children_suggestions(node, _jm, tmpl) {
  const text_of_node = node.topic;
  const hyphenated_list = createHyphenatedList(_jm.get_data().data);
    var prompt = tmpl;
  prompt = secureEvaluateTemplate(prompt, {
    hyphenated_list: hyphenated_list,
    text_of_node: text_of_node,
  });
  console.log(prompt);
    // Asegúrese de llamar a la función chatGPTRequest con el mensaje
  showSpinner();
  const data = await chatGPTRequest(prompt);
  hideSpinner();
  return data;
}

function processGptResponse(response, selected_node, _jm, do_scroll = true) {
  // Paso 1: extraiga el contenido entre las etiquetas <embed>
   // const embedContent = response.match(/<embed>([\s\S]*?)<\/embed>/)[1].trim();
  //Paso 2: Procese el contenido extraído y cree la jerarquía
  const lines = embedContent.split("\n");
  const hierarchy = [];

  for (const line of lines) {
    const level = line.search(/\S/);
    const content = line.trim().replace(/^-/, "").trim();

    hierarchy.push({
      level: level/2,
      content: content,
      id: jsMind.util.uuid.newid(),
    });
  }

  console.log(hierarchy);
  // Paso 3: agregue nodos a jsMind con las conexiones correctas
  for (let i = 0; i < hierarchy.length; i++) {
    const currentNode = hierarchy[i];
    let parentId = selected_node;

    if (currentNode.level > 0) {
      for (let j = i - 1; j >= 0; j--) {
        if (hierarchy[j].level === currentNode.level - 1) {
          parentId = hierarchy[j].id;
          break;
        }
      }
    }

  nd = _jm.add_node(parentId, currentNode.id, currentNode.content);
  console.log(nd);
  if (do_scroll) {
      nd._data.view.element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: "nearest"  });
  }
  }
}

async function add_node() {
  var selected_node = _jm.get_selected_node(); // as parent of new node
  if (!selected_node) {
    prompt_info("seleccione un nodo primero.");
    return;
  }

  // Llame a la función get_children_suggestions y espere la respuesta
    const response = await get_children_suggestions(selected_node, _jm, document.getElementById("child-node-suggestion").value);
  console.log(response);
    // Llame a la función ProcessGptResponse para procesar la respuesta y agregar nodos
    console.log("add_node redo_manager true");
    redo_manager_disabled = true;
    processGptResponse(response, selected_node, _jm);
    console.log("add_node redo_manager false");
    setTimeout(async () => {
    redo_manager_disabled = false;
    await autoSaveData();
    }, 100);
}

async function restructure() {
    var selected_node = _jm.get_root();
    const response = await get_children_suggestions(selected_node, _jm, document.getElementById("restructure-prompt").value);
    const def_options = get_def_options();
    const mind = get_def_mind();
    _jm = init_jm(def_options, mind);
    var selected_node = _jm.get_root();


    console.log(response);
  
    processGptResponse(response, selected_node, _jm);

}



var zoomInButton = document.getElementById("zoom-in-button");
var zoomOutButton = document.getElementById("zoom-out-button");

function zoomIn() {
  if (_jm.view.zoomIn()) {
    zoomOutButton.disabled = false;
  } else {
    zoomInButton.disabled = true;
  }
}

function zoomOut() {
  if (_jm.view.zoomOut()) {
    zoomInButton.disabled = false;
  } else {
    zoomOutButton.disabled = true;
  }
}

function expand_all() {
  _jm.expand_all();
}

function collapse_all() {
  _jm.collapse_all();
}

function prompt_info(msg) {
  showCustomAlert(msg);
}

open_empty();
