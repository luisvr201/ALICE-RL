
function setupPopSizeListener(width, height, element) {
}
setupPopSizeListener(750, 600, document.getElementById("settings-popup"));
  
  function set_theme(theme_name) {
    _jm.set_theme(theme_name);
  }


  function getValueOrDefault(obj, key, defaultValue) {
    if (!obj.hasOwnProperty(key)) {
      return defaultValue;
    }
    return obj[key];
  }

  function openSettingsPopup() {
    document.getElementById("settings-popup").classList.remove("hidden");
  }

  function closeSettingsPopup() {
    console.log("close");
    document.getElementById("settings-popup").classList.add("hidden");
    autoSaveData();
  }
  function recordSettings(data) {
    console.log(data);
    // Obtener los valores de los campos del formulario.
    data["child-node-suggestionse"] = document.getElementById(
      "child-node-suggestionse"
    ).value;
    data["discuss-node-promptse"] = document.getElementById(
      "discuss-node-promptse"
    ).value;
    data["prefix-prompt"] = document.getElementById("prefix-prompt").value;
    //data["restructure-prompt"] = document.getElementById("restructure-prompt").value;
    data["gpt-engine"] = document.getElementById("gpt-engine").value;
    data["token-usage"] = document.getElementById("token-usage").textContent;
    data["temperature"] = document.getElementById("temperature").value;
    console.log("recordSettings", data);
  }

  function addTokenUsage(tokens) {
      value = document.getElementById("token-usage").textContent;
      if (value == "" || isNaN(parseInt(value))) {
	  count = 0;
      } else {
	  count = parseInt(value);
      }
      console.log("addTokenUsage", value, count, tokens, count+tokens);
      document.getElementById("token-usage").textContent = (count + tokens).toString();
  }
  
  function saveSettings(event) {
    if (event) event.preventDefault();
    closeSettingsPopup();
  }

  // Adjunte el detector de eventos al formulario
  document
    .getElementById("settings-form")
    .addEventListener("submit", saveSettings);

  function load_meta_properties(options) {
    document.getElementById("token-usage").textContent = getValueOrDefault(
	options, "token-usage", (0).toString())
    document.getElementById("discuss-node-promptse").value = getValueOrDefault(
      options,
      "discuss-node-promptse",
      "Estoy realizando un mapa de mental sobre: '(${hyphenated_list})', ten en cuenta que estoy trabajando bajo el framework lean startup\n"+
      "Me gustaria que tuvieras en cuenta las 6 preguntas a resolver: (1. Persona o segmento de usuario que interviene con el tema '${text_of_node}, 2. Lo que ven, teniendo una idea de lo que perciben tus usuario, 3. Lo que escuchan, o sugieren los usuarios, 4. Lo que sugieren los usuarios, sugerencias de lo que piensan y sienten los usuarios, 5. Los esfuerzos que se sugiere para afrontar el tema, 6. Los resultados que deseamos obtener), para resolver: (${hyphenated_list}), menciona las preguntas sin describirlas ni enumerarlas, luego genera una sangria para generar una lista con las respuestas de cada pregunta. \n"+
      "Respeta la sangria  para generar una jerarquia de: pregunta y respuesta de tema:${text_of_node}"
    );

    document.getElementById("child-node-suggestionse").value = getValueOrDefault(
      options,
      "child-node-suggestionse",
      "Estoy realizando un mapa de mental sobre: '(${hyphenated_list})', ten en cueta que estoy trabajando bajo el framework lean startup\n"+
      "Me gustaria que tuvieras en cuenta las 6 preguntas a resolver: (1. Persona o segmento de usuario que interviene con el tema '${text_of_node}, 2. Lo que ven, teniendo una idea de lo que perciben tus usuario, 3. Lo que escuchan, o sugieren los usuarios, 4. Lo que sugieren los usuarios, sugerencias de lo que piensan y sienten los usuarios, 5. Los esfuerzos que se sugiere para afrontar el tema, 6. Los resultados que deseamos obtener), para resolver: (${hyphenated_list}), menciona las preguntas sin describirlas ni enumerarlas, luego genera una sangria para generar una lista con las respuestas de cada pregunta. \n"+
      "Respeta la sangria  para generar una jerarquia de: pregunta y respuesta de tema:${text_of_node}"
        // "Finalmente, genera una lista para responder las 6 preguntas mencionadas en el nodo anterior, con su sangria respectiva para generar nuevos nodos"

    );
    document.getElementById("prefix-prompt").value = getValueOrDefault(
      options,
      "prefix-prompt",
      "Estoy creando un mapa mental. Esto es lo que está visible actualmente en el mapa mental:\n${hyphenated_list}\nI quisiera discutir el'${cur_topic}' nodo.\n\n"
    );

   /* document.getElementById("restructure-prompt").value = getValueOrDefault(
      options,
      "restructure-prompt",
	"I am creating a mindmap, here's what is currently visible in the mindmap:\n${hyphenated_list}\n"+
	"Restructure the mindmap listed above into a more cohesive, clear, and impactful mindmap.\n"+
	    "The restructured mindmap should have many levels, but no less than 3 children and no more than 6 children per item.\n"+
	    "Use the same hyphenated hierarchical format above, with no empty lines.\n"+
	    "Ensure that the hierarchical hyphenated list is surrounded by <embed></embed>.\n"+
	    "Do not include the top level node.\n"
    );*/

    document.getElementById("gpt-engine").value = getValueOrDefault(
      options,
      "gpt-engine",
      "gpt-3.5-turbo"
    );
    document.getElementById("temperature").value = getValueOrDefault(
      options,
      "temperature",
      "0.5"
    );
  }